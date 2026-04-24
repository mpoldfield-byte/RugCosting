import Anthropic from '@anthropic-ai/sdk';
import * as XLSX from 'xlsx';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MODEL = 'claude-sonnet-4-5';

const SYSTEM_PROMPT = `You are extracting rug sizes from a document for a carpet manufacturer's quoting tool.

Look for rugs / area rugs — each is defined by a room name or area, a width, a length, and a quantity (how many of that rug are needed). Dimensions are typically in feet and inches (e.g., 9'0" x 14'0", 12' x 8'11", 10ft 6in x 12ft).

Return a JSON array where each element has this exact shape:
{
  "area": string,          // short room/area name, e.g. "King", "Double Queen", "Suite Bedroom"
  "description": string,   // optional extra detail from the source doc; "" if none
  "wFt": number,           // width in whole feet
  "wIn": number,           // remaining width inches (0 if none)
  "lFt": number,           // length in whole feet
  "lIn": number,           // remaining length inches (0 if none)
  "qty": number            // quantity of this rug (1 if not specified)
}

Rules:
- Output ONLY the JSON array. No prose, no markdown fences, no explanations.
- If width or length is given as a decimal (e.g., 9.5 ft), convert to ft + in (9 ft 6 in).
- If a dimension is given in inches or metric (cm/m), convert to ft + in rounded to the nearest inch.
- If quantity is missing, default to 1.
- Skip any row that isn't actually a rug (e.g., headings, totals, pricing rows, broadloom carpet).
- If the document contains no rugs, return [].`;

function badRequest(message) {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

function serverError(message) {
  return new Response(JSON.stringify({ error: message }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Parse Excel/CSV into a readable text representation for Claude
function spreadsheetToText(buffer, ext) {
  const wb = XLSX.read(buffer, { type: 'buffer', cellDates: false });
  const parts = [];
  wb.SheetNames.forEach((name) => {
    const ws = wb.Sheets[name];
    // Use CSV for clean tabular output; Claude handles it well
    const csv = XLSX.utils.sheet_to_csv(ws, { blankrows: false });
    if (csv.trim()) {
      parts.push(`--- Sheet: ${name} ---\n${csv}`);
    }
  });
  return parts.join('\n\n');
}

function cleanJsonResponse(text) {
  // Strip markdown fences if the model decided to add them despite instructions
  let t = text.trim();
  if (t.startsWith('```')) {
    t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  return t.trim();
}

function normalizeRug(r, idx) {
  const toInt = (v) => {
    const n = Math.round(Number(v));
    return Number.isFinite(n) ? n : 0;
  };
  const wFt = toInt(r?.wFt);
  const wIn = toInt(r?.wIn);
  const lFt = toInt(r?.lFt);
  const lIn = toInt(r?.lIn);
  const qty = Math.max(1, toInt(r?.qty ?? 1));
  const area = (typeof r?.area === 'string' && r.area.trim()) ? r.area.trim() : `Area ${idx + 1}`;
  const description = typeof r?.description === 'string' ? r.description.trim() : '';
  return { id: idx + 1, area, description, wFt, wIn, lFt, lIn, qty };
}

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return serverError('ANTHROPIC_API_KEY is not configured on the server.');

  let formData;
  try {
    formData = await request.formData();
  } catch (e) {
    return badRequest('Could not read form data.');
  }

  const file = formData.get('file');
  if (!file || typeof file === 'string') return badRequest('No file uploaded.');

  const filename = file.name || 'upload';
  const mime = file.type || '';
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  // File size guard (15 MB)
  if (file.size > 15 * 1024 * 1024) {
    return badRequest('File is too large. Max 15 MB.');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const client = new Anthropic({ apiKey });

  // Dispatch by file type
  let content;
  try {
    if (ext === 'pdf' || mime === 'application/pdf') {
      content = [
        {
          type: 'document',
          source: {
            type: 'base64',
            media_type: 'application/pdf',
            data: buffer.toString('base64'),
          },
        },
        { type: 'text', text: 'Extract all rugs from this document as described.' },
      ];
    } else if (['xlsx', 'xls', 'xlsm', 'csv', 'tsv'].includes(ext) ||
               mime.includes('spreadsheet') || mime.includes('excel') || mime === 'text/csv') {
      const text = spreadsheetToText(buffer, ext);
      if (!text) return badRequest('The spreadsheet appears to be empty.');
      content = [
        {
          type: 'text',
          text: `Below is the content of an uploaded spreadsheet (${filename}). Extract all rugs as described.\n\n${text}`,
        },
      ];
    } else if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext) || mime.startsWith('image/')) {
      const mediaType =
        ext === 'png' ? 'image/png'
        : ext === 'webp' ? 'image/webp'
        : ext === 'gif' ? 'image/gif'
        : 'image/jpeg';
      content = [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType,
            data: buffer.toString('base64'),
          },
        },
        { type: 'text', text: 'Extract all rugs from this image as described.' },
      ];
    } else {
      return badRequest(`Unsupported file type: .${ext}. Supported: PDF, Excel (.xlsx/.xls), CSV, images (PNG/JPG).`);
    }
  } catch (e) {
    return serverError(`Failed to prepare file: ${e.message}`);
  }

  // Call Anthropic
  let responseText;
  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content }],
    });
    responseText = message.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n');
  } catch (e) {
    const msg = e?.error?.message || e?.message || 'Unknown error';
    return serverError(`Anthropic API error: ${msg}`);
  }

  // Parse JSON
  let rugs;
  try {
    const cleaned = cleanJsonResponse(responseText);
    rugs = JSON.parse(cleaned);
    if (!Array.isArray(rugs)) throw new Error('Expected a JSON array');
  } catch (e) {
    return serverError(
      `Model did not return valid JSON. Try a clearer document. Raw response: ${responseText.slice(0, 400)}`
    );
  }

  const normalized = rugs.map(normalizeRug);

  return new Response(
    JSON.stringify({ rugs: normalized, count: normalized.length }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
