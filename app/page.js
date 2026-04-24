'use client';

import React, { useMemo, useState } from 'react';

/* ─── Rug Price List (from Rug_Quote_Template.xlsx) ─────────────────────────── */

const PRODUCTS = [
  {
    name: 'Opal',
    pile: 'Cut Pile with Carving',
    suitability: 'Guest Rooms, Public Spaces',
    maxColors: '6',
    yarn: '100% Semi-wor NZ wool',
    construction: 'High pile, plush w/carving',
    custom: { '4500-8000': 15.79, '8001-16000': 14.41 },
    qwPalettes: 'ABRS11, ABRS12, GALA, GRENADA, CINNAMON, CAPTURE, (GRAPHITE)',
    qw: { '1125-2500': 18.48, '2501-5000': 17.30, '5001-8000': 15.92, '8001-16000': 14.69, '>16000': 13.88 },
  },
  {
    name: 'Regius',
    pile: 'Cut Pile',
    suitability: 'Guest Rooms, Public Spaces',
    maxColors: '6',
    yarn: '100% Semi-wor NZ wool',
    construction: 'High pile, plush',
    custom: { '4500-8000': 13.29, '8001-16000': 11.91 },
    qwPalettes: 'ABRS11, ABRS12, GALA, GRENADA, CINNAMON, CAPTURE, (GRAPHITE)',
    qw: { '1125-2500': 15.98, '2501-5000': 14.80, '5001-8000': 13.42, '8001-16000': 12.19, '>16000': 11.38 },
  },
  {
    name: 'Calisia',
    pile: 'Cut Pile',
    suitability: 'Guest Rooms, Public Spaces',
    maxColors: '6',
    yarn: '100% Semi-wor NZ wool',
    construction: 'High pile, plush',
    custom: { '4500-8000': 13.29, '8001-16000': 11.91 },
    qwPalettes: 'ABRS11, ABRS12, GALA, GRENADA, CINNAMON, CAPTURE, (GRAPHITE)',
    qw: { '1125-2500': 15.98, '2501-5000': 14.80, '5001-8000': 13.42, '8001-16000': 12.19, '>16000': 11.38 },
  },
  {
    name: 'Agnus',
    pile: 'Cut Pile',
    suitability: 'Guest Rooms, Public Spaces',
    maxColors: '6',
    yarn: '100% Semi-wor NZ wool',
    construction: 'Cut pile',
    custom: { '4500-8000': 9.16, '8001-16000': 8.15 },
    qwPalettes: 'ABRS11, ABRS12, GALA, GRENADA, CINNAMON, CAPTURE, (GRAPHITE)',
    qw: { '1125-2500': 11.12, '2501-5000': 10.25, '5001-8000': 9.28, '8001-16000': 8.42, '>16000': 7.83 },
  },
  {
    name: 'Isfahan',
    pile: 'Cut Pile',
    suitability: 'Guest Rooms',
    maxColors: '6',
    yarn: '100% Semi-wor NZ wool',
    construction: 'Cut pile',
    custom: { '4500-8000': 7.53, '8001-16000': 7.02 },
    qwPalettes: 'ABRS11, ABRS12, GALA, GRENADA, CINNAMON, CAPTURE, (GRAPHITE)',
    qw: { '1125-2500': 8.77, '2501-5000': 8.04, '5001-8000': 7.27, '8001-16000': 6.65, '>16000': 6.38 },
  },
  {
    name: 'Noble',
    pile: 'Cut & Loop',
    suitability: 'Guest Rooms, Public Spaces',
    maxColors: '2-3',
    yarn: '100% Wool',
    construction: 'Var pile heights, cut & loop',
    custom: { '4500-8000': 7.53, '8001-16000': 7.02 },
    qwPalettes: 'WARM, NOBLE',
    qw: { '1125-2500': 8.77, '2501-5000': 8.04, '5001-8000': 7.27, '8001-16000': 6.65, '>16000': 6.38 },
  },
  {
    name: 'Crescendo',
    pile: 'Cut Pile',
    suitability: 'Guest Rooms, Public Spaces',
    maxColors: '12*',
    yarn: '80/20 Yarn',
    construction: 'Standard pile',
    custom: { '4500-8000': 12.04, '8001-16000': 11.54 },
    qwPalettes: 'INCEPTION, SEQUENCE, ODYSSEY',
    qw: { '1125-2500': 12.62, '2501-5000': 12.16, '5001-8000': 11.59, '8001-16000': 11.05, '>16000': 10.51 },
  },
  {
    name: 'Tempo',
    pile: 'Cut Pile',
    suitability: 'Guest Rooms, Public Spaces',
    maxColors: '12*',
    yarn: '80/20 Yarn',
    construction: 'Standard pile',
    custom: { '4500-8000': 10.03, '8001-16000': 9.53 },
    qwPalettes: 'INCEPTION, SEQUENCE, ODYSSEY, REVIVE, UNITY, NATURAL',
    qw: { '1125-2500': 10.59, '2501-5000': 10.13, '5001-8000': 9.58, '8001-16000': 9.03, '>16000': 8.56 },
  },
  {
    name: 'Ballata',
    pile: 'Cut Pile',
    suitability: 'Guest Rooms',
    maxColors: '12*',
    yarn: '80/20 Yarn',
    construction: 'Standard pile',
    custom: { '4500-8000': 7.53, '8001-16000': 7.02 },
    qwPalettes: 'INCEPTION, SEQUENCE, ODYSSEY, REVIVE, UNITY, NATURAL',
    qw: { '1125-2500': 8.05, '2501-5000': 7.62, '5001-8000': 7.27, '8001-16000': 6.65, '>16000': 6.38 },
  },
  {
    name: 'Hand Tufted',
    pile: 'Cut & Loop with Carving',
    suitability: 'Guest Rooms, Public Spaces',
    maxColors: '24',
    yarn: '100% NZ Wool',
    construction: 'Var pile height, cut & loop, carving',
    custom: { '4500-8000': 'PPP', '8001-16000': 'PPP' },
    qwPalettes: 'N/A',
    qw: null,
    ppp: true,
  },
];

const CUSTOM_MIN = 4500;
const QW_MIN = 1125;

function getCustomBracket(totalSft) {
  if (totalSft < CUSTOM_MIN) return null;
  if (totalSft <= 8000) return '4500-8000';
  return '8001-16000';
}

function getQwBracket(totalSft) {
  if (totalSft < QW_MIN) return null;
  if (totalSft <= 2500) return '1125-2500';
  if (totalSft <= 5000) return '2501-5000';
  if (totalSft <= 8000) return '5001-8000';
  if (totalSft <= 16000) return '8001-16000';
  return '>16000';
}

const BRACKET_LABELS = {
  '4500-8000': '4,500 – 8,000 sft',
  '8001-16000': '8,001 – 16,000 sft',
  '1125-2500': '1,125 – 2,500 sft',
  '2501-5000': '2,501 – 5,000 sft',
  '5001-8000': '5,001 – 8,000 sft',
  '>16000': '>16,000 sft',
};

function currency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n || 0));
}

function fmtNum(n, decimals = 1) {
  if (typeof n !== 'number' || isNaN(n)) return '—';
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function computeSft(wFt, wIn, lFt, lIn) {
  const w = (Number(wFt) || 0) + (Number(wIn) || 0) / 12;
  const l = (Number(lFt) || 0) + (Number(lIn) || 0) / 12;
  return w * l;
}

/* ─── Styles (matching carpet app exactly) ──────────────────────────────────── */

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #111318;
    --ink2: #6b7280;
    --ink3: #9ca3af;
    --bg: #f5f5f7;
    --white: #ffffff;
    --border: #e5e7eb;
    --green: #166534;
    --green-bg: #f0fdf4;
    --gold: #C9A84C;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.05);
    --shadow-md: 0 1px 0 rgba(0,0,0,0.06);
    --radius: 10px;
    --radius-lg: 16px;
  }

  body {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    background: var(--bg);
    color: var(--ink);
    min-height: 100vh;
  }

  .header {
    background: var(--white);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: var(--shadow-md);
  }
  .header-inner {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 28px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .header-brand { display: flex; align-items: center; gap: 16px; }
  .header-logo-placeholder { height: 32px; display: flex; align-items: center; gap: 10px; }
  .logo-diamond {
    width: 28px;
    height: 28px;
    background: var(--gold);
    transform: rotate(45deg);
    flex-shrink: 0;
  }
  .logo-text {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .header-subtitle { font-size: 12px; font-weight: 400; color: var(--ink2); }
  .header-divider { width: 1px; height: 28px; background: var(--border); }
  .header-badge {
    font-size: 11px;
    font-weight: 500;
    color: var(--ink2);
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 4px 10px;
    border-radius: 20px;
  }

  .page-wrap {
    max-width: 1400px;
    margin: 0 auto;
    padding: 32px 28px;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }
  .card-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    background: var(--white);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .card-title {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--ink);
  }
  .card-body { padding: 24px; }

  .field-group { display: grid; gap: 20px; }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .field { display: flex; flex-direction: column; gap: 7px; }
  .field label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink2);
  }
  .field-input {
    width: 100%;
    padding: 13px 18px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    background: var(--white);
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 14px;
    color: var(--ink);
    transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
    appearance: none;
    -webkit-appearance: none;
  }
  .field-input:focus {
    outline: none;
    background: var(--white);
    border-color: var(--ink);
    box-shadow: 0 0 0 2px rgba(17,19,24,0.08);
  }
  .field-input::placeholder { color: var(--ink3); }

  .section-divider { display: flex; align-items: center; gap: 12px; margin: 4px 0; }
  .section-divider-line { flex: 1; height: 1px; background: var(--border); }
  .section-divider-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink3);
    white-space: nowrap;
  }

  .btn-reset {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--white);
    color: var(--ink2);
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }
  .btn-reset:hover { background: var(--bg); border-color: var(--ink2); }
  .btn-reset.btn-sm { padding: 6px 10px; font-size: 11px; border-radius: 6px; letter-spacing: 0.05em; }
  .btn-primary {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border: 1px solid var(--ink);
    border-radius: 8px;
    background: var(--ink);
    color: var(--white);
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .btn-primary:hover { opacity: 0.88; }

  .summary-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }
  .summary-header {
    background: var(--white);
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
  }
  .summary-header-title {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 2px;
  }
  .summary-header-sub { font-size: 12px; color: var(--ink2); }
  .summary-body { padding: 20px; display: grid; gap: 12px; }

  .alert { padding: 14px 16px; border-radius: var(--radius); font-size: 13px; line-height: 1.5; }
  .alert-warn { background: #fefce8; border: 1px solid #fde68a; color: #92400e; }
  .alert-ok {
    background: var(--green-bg);
    border: 1px solid #bbf7d0;
    color: var(--green);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .alert-warn ul { margin-top: 6px; padding-left: 18px; }
  .alert-warn strong { display: block; margin-bottom: 4px; font-weight: 600; }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  .summary-item {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 14px;
  }
  .summary-item-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink2);
    margin-bottom: 5px;
  }
  .summary-item-value { font-size: 15px; font-weight: 600; color: var(--ink); }

  .price-blocks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
  }
  .price-block {
    background: var(--ink);
    border-radius: var(--radius);
    padding: 18px 20px;
    position: relative;
    overflow: hidden;
  }
  .price-block::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 120px; height: 120px;
    background: radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%);
    transform: translate(30%, -30%);
  }
  .price-block-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink3);
    margin-bottom: 6px;
  }
  .price-block-value {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 30px;
    font-weight: 700;
    color: var(--white);
    line-height: 1;
    position: relative;
  }

  .total-block {
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 18px 20px;
  }
  .total-block-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink2);
    margin-bottom: 6px;
  }
  .total-block-value {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1;
  }

  .footnote {
    font-size: 11.5px;
    color: var(--ink2);
    line-height: 1.65;
    border-top: 1px solid var(--border);
    padding-top: 14px;
    margin-top: 4px;
  }

  /* Pill selector — matches carpet app */
  .product-selector {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 8px;
  }
  .product-btn {
    padding: 10px 8px;
    border: 1.5px solid transparent;
    border-radius: 16px;
    background: var(--white);
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 12px;
    font-weight: 400;
    color: var(--ink2);
    cursor: pointer;
    transition: all 0.12s;
    text-align: center;
    line-height: 1.3;
  }
  .product-btn:hover { background: var(--bg); color: var(--ink); }
  .product-btn.active {
    border-color: var(--ink);
    background: var(--ink);
    color: var(--white);
    font-weight: 600;
  }
  .product-btn.active .product-btn-sub { color: var(--ink3); }
  .product-btn-sub { display: block; font-size: 10px; color: var(--ink3); margin-top: 2px; }

  /* Mode toggle inside cards */
  .mode-toggle {
    display: inline-flex;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 2px;
  }
  .mode-toggle-btn {
    padding: 4px 10px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    background: transparent;
    border: none;
    color: var(--ink2);
    cursor: pointer;
    border-radius: 6px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    transition: background 0.1s, color 0.1s;
  }
  .mode-toggle-btn.active {
    background: var(--white);
    color: var(--ink);
    box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  }

  /* Rug table */
  .rug-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }
  .rug-table th {
    background: var(--bg);
    padding: 10px 10px;
    text-align: left;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink2);
    border-bottom: 1px solid var(--border);
  }
  .rug-table td {
    padding: 6px 8px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }
  .rug-table tr:last-child td { border-bottom: none; }
  .rug-input {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid transparent;
    background: transparent;
    border-radius: 6px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 13px;
    color: var(--ink);
    transition: all 0.1s;
  }
  .rug-input:hover { border-color: var(--border); }
  .rug-input:focus {
    outline: none;
    border-color: var(--ink);
    background: var(--white);
    box-shadow: 0 0 0 2px rgba(17,19,24,0.08);
  }
  .rug-input.rc { text-align: center; }
  .rug-sft { font-size: 13px; color: var(--ink2); text-align: right; font-variant-numeric: tabular-nums; padding: 0 8px; }
  .rug-total-sft {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
    text-align: right;
    font-variant-numeric: tabular-nums;
    padding: 0 8px;
  }
  .icon-btn {
    width: 26px; height: 26px;
    border: none;
    background: transparent;
    color: var(--ink3);
    cursor: pointer;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: background 0.1s, color 0.1s;
  }
  .icon-btn:hover:not(:disabled) { background: var(--bg); color: var(--ink); }
  .icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  /* Option card (for product pricing mode cards and display toggle cards) */
  .opt-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    gap: 10px;
    cursor: pointer;
    transition: all 0.12s;
  }
  .opt-card:hover { background: var(--bg); }
  .opt-card.active { border-color: var(--ink); background: var(--white); }
  .opt-card-main { display: flex; align-items: center; gap: 10px; flex: 1; }
  .opt-card-check { width: 16px; height: 16px; accent-color: var(--ink); cursor: pointer; }
  .opt-card-title { font-size: 13px; font-weight: 600; color: var(--ink); }
  .opt-card-sub { font-size: 11px; color: var(--ink2); margin-top: 1px; }

  /* Quote preview */
  .quote-preview {
    width: 100%;
    overflow-x: auto;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-top: 14px;
  }
  .quote-preview table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    min-width: 640px;
  }
  .quote-preview th.product-head {
    background: var(--ink);
    color: var(--white);
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    padding: 8px 8px 4px;
    border-left: 1px solid rgba(255,255,255,0.12);
  }
  .quote-preview th.product-head-mode {
    background: var(--ink);
    color: var(--ink3);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-align: center;
    padding: 0 8px 8px;
    border-left: 1px solid rgba(255,255,255,0.12);
  }
  .quote-preview th.sub {
    background: var(--ink);
    color: var(--ink3);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 6px 8px;
    text-align: right;
    border-left: 1px solid rgba(255,255,255,0.08);
  }
  .quote-preview th.sub.first { border-left: 1px solid rgba(255,255,255,0.2); }
  .quote-preview th.static {
    background: var(--bg);
    color: var(--ink2);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-align: left;
    padding: 10px 10px;
  }
  .quote-preview th.static.rc { text-align: center; }
  .quote-preview th.static.ra { text-align: right; }
  .quote-preview td { padding: 9px 10px; border-top: 1px solid var(--border); font-size: 12px; }
  .quote-preview td.rc { text-align: center; }
  .quote-preview td.ra { text-align: right; }
  .quote-preview td.col-l { border-left: 1px solid var(--border); }
  .quote-preview td.area-cell { font-weight: 600; color: var(--ink); }
  .quote-preview td.desc-cell { font-size: 11px; color: var(--ink2); font-style: italic; }
  .quote-preview tr.totals-row td {
    border-top: 2px solid var(--ink);
    background: var(--bg);
    font-weight: 700;
  }
  .quote-preview tr.totals-row td.grand {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 14px;
    color: var(--ink);
  }
  .quote-preview tr.attr-row td {
    background: var(--bg);
    font-size: 10.5px;
    color: var(--ink2);
    border-top: 1px dashed var(--border);
  }
  .quote-preview tr.attr-row td.label {
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-size: 9.5px;
  }

  .terms {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
    font-size: 10.5px;
    color: var(--ink2);
    line-height: 1.7;
  }
  .terms-title {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink);
    margin-bottom: 6px;
  }

  /* ── Upload / AI Extraction ── */
  .upload-zone {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 16px;
    background: var(--bg);
    border: 1.5px dashed var(--border);
    border-radius: 12px;
    transition: all 0.15s;
  }
  .upload-zone:hover { border-color: var(--ink2); background: var(--white); }
  .upload-zone.busy { border-style: solid; border-color: var(--ink); background: var(--white); }
  .upload-main { display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1; }
  .upload-icon {
    width: 36px; height: 36px;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: var(--ink);
    flex-shrink: 0;
  }
  .upload-text { min-width: 0; }
  .upload-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 2px;
  }
  .upload-sub {
    font-size: 11px;
    color: var(--ink2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 420px;
  }
  .upload-status {
    font-size: 11px;
    color: var(--ink2);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .spinner {
    width: 12px; height: 12px;
    border: 2px solid var(--border);
    border-top-color: var(--ink);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .upload-error {
    margin-top: 8px;
    padding: 10px 12px;
    border-radius: 8px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #991b1b;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
  }
  .upload-success {
    margin-top: 8px;
    padding: 10px 12px;
    border-radius: 8px;
    background: var(--green-bg);
    border: 1px solid #bbf7d0;
    color: var(--green);
    font-size: 12px;
    font-weight: 500;
  }

  /* Modal for confirm */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(17, 19, 24, 0.6);
    backdrop-filter: blur(2px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .modal {
    background: var(--white);
    border-radius: 14px;
    width: 100%;
    max-width: 520px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0,0,0,0.25);
  }
  .modal-header {
    padding: 18px 22px;
    border-bottom: 1px solid var(--border);
  }
  .modal-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 2px;
  }
  .modal-sub { font-size: 12px; color: var(--ink2); }
  .modal-body {
    padding: 16px 22px;
    overflow-y: auto;
    flex: 1;
  }
  .modal-list {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px 12px;
    max-height: 300px;
    overflow-y: auto;
  }
  .modal-list-row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 12px;
    padding: 6px 0;
    font-size: 12px;
    border-bottom: 1px solid var(--border);
  }
  .modal-list-row:last-child { border-bottom: none; }
  .modal-list-row .area { font-weight: 600; color: var(--ink); }
  .modal-list-row .size { color: var(--ink2); font-variant-numeric: tabular-nums; }
  .modal-list-row .qty { color: var(--ink2); font-variant-numeric: tabular-nums; }
  .modal-footer {
    padding: 14px 22px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    background: var(--bg);
  }

  @media (max-width: 900px) {
    .field-row { grid-template-columns: 1fr; }
    .product-selector { grid-template-columns: 1fr 1fr; }
    .summary-grid { grid-template-columns: 1fr 1fr; }
    .header-inner { padding: 0 16px; }
    .page-wrap { padding: 16px; }
    .card-body { padding: 16px; }
  }
`;

/* ─── Main Component ────────────────────────────────────────────────────────── */

export default function RugQuoteBuilder() {
  const [client, setClient] = useState('');
  const [project, setProject] = useState('Guest Room Rugs');
  const [crmRef, setCrmRef] = useState('');
  const [quoteDate, setQuoteDate] = useState(
    new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  );

  const [rugs, setRugs] = useState([
    { id: 1, area: 'Double Queen', description: '', wFt: 9, wIn: 0, lFt: 14, lIn: 0, qty: 44 },
    { id: 2, area: 'King', description: '', wFt: 12, wIn: 0, lFt: 8, lIn: 11, qty: 115 },
  ]);
  const [nextId, setNextId] = useState(3);

  const [selections, setSelections] = useState(() => {
    const o = {};
    PRODUCTS.forEach((p) => {
      o[p.name] = { selected: ['Isfahan', 'Noble', 'Tempo'].includes(p.name), mode: 'custom' };
    });
    return o;
  });

  const [showAttrs, setShowAttrs] = useState({
    maxColors: true,
    yarn: true,
    construction: true,
    pad: true,
    palettes: false,
  });

  // Upload / AI extraction state
  const [uploadState, setUploadState] = useState({
    status: 'idle', // 'idle' | 'uploading' | 'extracting' | 'confirm' | 'error' | 'success'
    filename: '',
    error: '',
    extractedRugs: null,
  });
  const fileInputRef = React.useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so the same file can be re-uploaded later
    e.target.value = '';

    setUploadState({ status: 'uploading', filename: file.name, error: '', extractedRugs: null });

    try {
      const fd = new FormData();
      fd.append('file', file);

      setUploadState((s) => ({ ...s, status: 'extracting' }));

      const res = await fetch('/api/extract-rugs', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) {
        setUploadState({ status: 'error', filename: file.name, error: data.error || 'Extraction failed.', extractedRugs: null });
        return;
      }

      if (!data.rugs || data.rugs.length === 0) {
        setUploadState({ status: 'error', filename: file.name, error: 'No rugs found in the document.', extractedRugs: null });
        return;
      }

      // Show confirm dialog before replacing
      setUploadState({
        status: 'confirm',
        filename: file.name,
        error: '',
        extractedRugs: data.rugs,
      });
    } catch (err) {
      setUploadState({
        status: 'error',
        filename: file.name,
        error: err?.message || 'Network error. Check your connection and try again.',
        extractedRugs: null,
      });
    }
  };

  const confirmApplyExtracted = () => {
    const extracted = uploadState.extractedRugs || [];
    // Re-id starting from 1 for a clean slate
    const reassigned = extracted.map((r, i) => ({ ...r, id: i + 1 }));
    setRugs(reassigned);
    setNextId(reassigned.length + 1);
    setUploadState({
      status: 'success',
      filename: uploadState.filename,
      error: '',
      extractedRugs: null,
    });
    // Auto-dismiss success after 4s
    setTimeout(() => setUploadState((s) => (s.status === 'success' ? { ...s, status: 'idle' } : s)), 4000);
  };

  const cancelExtracted = () => {
    setUploadState({ status: 'idle', filename: '', error: '', extractedRugs: null });
  };

  const dismissUploadError = () => {
    setUploadState({ status: 'idle', filename: '', error: '', extractedRugs: null });
  };

  const rugsWithSft = useMemo(
    () =>
      rugs.map((r) => {
        const sft = computeSft(r.wFt, r.wIn, r.lFt, r.lIn);
        const totalSft = sft * (Number(r.qty) || 0);
        return { ...r, sft, totalSft };
      }),
    [rugs]
  );

  const projectTotalSft = useMemo(
    () => rugsWithSft.reduce((s, r) => s + r.totalSft, 0),
    [rugsWithSft]
  );

  const customBracket = getCustomBracket(projectTotalSft);
  const qwBracket = getQwBracket(projectTotalSft);

  const selectedProducts = useMemo(
    () => PRODUCTS.filter((p) => selections[p.name]?.selected),
    [selections]
  );

  const getPrice = (p, mode) => {
    if (p.ppp) return 'PPP';
    if (mode === 'custom') {
      if (!customBracket) return null;
      return p.custom[customBracket];
    }
    if (!qwBracket) return null;
    return p.qw?.[qwBracket];
  };

  const grandTotals = useMemo(() => {
    const out = {};
    selectedProducts.forEach((p) => {
      const mode = selections[p.name].mode;
      const price = getPrice(p, mode);
      if (typeof price !== 'number') {
        out[p.name] = null;
        return;
      }
      out[p.name] = rugsWithSft.reduce((s, r) => s + price * r.sft * (Number(r.qty) || 0), 0);
    });
    return out;
  }, [selectedProducts, selections, rugsWithSft, customBracket, qwBracket]);

  const warnings = useMemo(() => {
    const w = [];
    const hasCustom = selectedProducts.some((p) => !p.ppp && selections[p.name].mode === 'custom');
    const hasQw = selectedProducts.some((p) => !p.ppp && selections[p.name].mode === 'qw');
    if (hasCustom && !customBracket && projectTotalSft > 0)
      w.push(`Custom minimum is 4,500 SFT (current: ${fmtNum(projectTotalSft, 0)} SFT).`);
    if (hasQw && !qwBracket && projectTotalSft > 0)
      w.push(`Quickweave minimum is 1,125 SFT (current: ${fmtNum(projectTotalSft, 0)} SFT).`);
    if (selectedProducts.some((p) => p.ppp))
      w.push('Hand Tufted is priced project-by-project (PPP) — contact management for a quote.');
    return w;
  }, [selectedProducts, selections, customBracket, qwBracket, projectTotalSft]);

  const addRug = () => {
    setRugs([
      ...rugs,
      { id: nextId, area: `Area ${nextId}`, description: '', wFt: 10, wIn: 0, lFt: 8, lIn: 0, qty: 1 },
    ]);
    setNextId(nextId + 1);
  };
  const removeRug = (id) => setRugs(rugs.filter((r) => r.id !== id));
  const updateRug = (id, field, val) =>
    setRugs(rugs.map((r) => (r.id === id ? { ...r, [field]: val } : r)));

  const toggleProduct = (name) =>
    setSelections({ ...selections, [name]: { ...selections[name], selected: !selections[name].selected } });
  const setMode = (name, mode) =>
    setSelections({ ...selections, [name]: { ...selections[name], mode } });

  const reset = () => {
    setClient('');
    setProject('Guest Room Rugs');
    setCrmRef('');
    setRugs([{ id: 1, area: 'Area 1', description: '', wFt: 10, wIn: 0, lFt: 8, lIn: 0, qty: 1 }]);
    setNextId(2);
    const o = {};
    PRODUCTS.forEach((p) => {
      o[p.name] = { selected: ['Isfahan', 'Noble', 'Tempo'].includes(p.name), mode: 'custom' };
    });
    setSelections(o);
  };

  const loadXLSX = () =>
    new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return reject(new Error('no window'));
      if (window.XLSX) return resolve(window.XLSX);
      const s = document.createElement('script');
      s.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
      s.onload = () => resolve(window.XLSX);
      s.onerror = () => reject(new Error('Failed to load XLSX'));
      document.head.appendChild(s);
    });

  const exportExcel = async () => {
    const XLSX = await loadXLSX();
    const wb = XLSX.utils.book_new();
    const rows = [];
    rows.push(['BUDGET QUOTE']);
    rows.push([client || '—']);
    rows.push([project]);
    if (crmRef) rows.push([`CRM Ref: ${crmRef}`]);
    rows.push([quoteDate]);
    rows.push([]);

    const h1 = ['', 'Area', 'Description', 'W ft', 'W in', 'L ft', 'L in', 'SFT', 'QTY', 'Total SFT'];
    selectedProducts.forEach((p) => h1.push(p.name, ''));
    rows.push(h1);

    const h2 = ['', '', '', '', '', '', '', '', '', ''];
    selectedProducts.forEach(() => h2.push('USD/RUG', 'TOTAL'));
    rows.push(h2);

    rugsWithSft.forEach((r) => {
      const row = [
        '',
        r.area,
        r.description || '',
        r.wFt, r.wIn, r.lFt, r.lIn,
        Number(r.sft.toFixed(2)),
        r.qty,
        Number(r.totalSft.toFixed(2)),
      ];
      selectedProducts.forEach((p) => {
        const mode = selections[p.name].mode;
        const price = getPrice(p, mode);
        if (typeof price !== 'number') {
          row.push('—', '—');
        } else {
          row.push(Number((price * r.sft).toFixed(2)), Number((price * r.sft * (Number(r.qty) || 0)).toFixed(2)));
        }
      });
      rows.push(row);
    });

    const totalsRow = ['', '', '', '', '', '', '', '', '', Number(projectTotalSft.toFixed(2))];
    selectedProducts.forEach((p) => {
      const g = grandTotals[p.name];
      totalsRow.push('', g !== null ? Number(g.toFixed(2)) : '—');
    });
    rows.push(totalsRow);
    rows.push([]);

    if (showAttrs.maxColors) {
      const r = ['', '', '', '', '', '', '', '', '', 'Max Colors'];
      selectedProducts.forEach((p) => r.push('', `Max ${p.maxColors} colors`));
      rows.push(r);
    }
    if (showAttrs.yarn) {
      const r = ['', '', '', '', '', '', '', '', '', 'Yarn'];
      selectedProducts.forEach((p) => r.push('', p.yarn));
      rows.push(r);
    }
    if (showAttrs.construction) {
      const r = ['', '', '', '', '', '', '', '', '', 'Construction'];
      selectedProducts.forEach((p) => r.push('', p.construction));
      rows.push(r);
    }
    if (showAttrs.pad) {
      const r = ['', '', '', '', '', '', '', '', '', 'Non-slip Pad'];
      selectedProducts.forEach(() => r.push('', 'With non-slip pad'));
      rows.push(r);
    }
    if (showAttrs.palettes) {
      const r = ['', '', '', '', '', '', '', '', '', 'Palettes'];
      selectedProducts.forEach((p) => r.push('', p.qwPalettes));
      rows.push(r);
    }

    rows.push([]);
    rows.push(['Terms & Conditions']);
    rows.push(['1', "This quotation is subject to Brintons' standard terms and conditions."]);
    rows.push(['2', 'All prices are valid for 30 days from the date of this document.']);
    rows.push(['3', 'Production lead times vary; please speak with your local Brintons representative.']);
    rows.push(['4', 'Orders may be subject to applicable import tariffs at the time of dispatch.']);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Quote');
    const fn = `${(client || 'Rug_Quote').replace(/[^a-z0-9]/gi, '_')}_Rug_Quote.xlsx`;
    XLSX.writeFile(wb, fn);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Header — matches carpet app */}
      <header className="header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="header-logo-placeholder">
              <img src="/brintons-logo.png" alt="Brintons" style={{ height: 36, width: 'auto' }} />
            </div>
            <div className="header-divider" />
            <span className="header-subtitle">Rug Quote Builder</span>
          </div>
          <div className="header-badge">Internal Use Only</div>
        </div>
      </header>

      <div className="page-wrap">
        {/* LEFT — Configure Quote */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Configure Quote</span>
            <button className="btn-reset" onClick={reset}>↺ New Quote</button>
          </div>
          <div className="card-body">
            <div className="field-group">

              {/* Project info */}
              <div className="field-row">
                <div className="field">
                  <label>Client</label>
                  <input
                    className="field-input"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Hotel / Client name"
                  />
                </div>
                <div className="field">
                  <label>Project</label>
                  <input
                    className="field-input"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    placeholder="Guest Room Rugs"
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>CRM Ref</label>
                  <input
                    className="field-input"
                    value={crmRef}
                    onChange={(e) => setCrmRef(e.target.value)}
                    placeholder="e.g. CRM-12345"
                  />
                </div>
                <div className="field">
                  <label>Quote Date</label>
                  <input
                    className="field-input"
                    value={quoteDate}
                    onChange={(e) => setQuoteDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="section-divider">
                <div className="section-divider-line" />
                <span className="section-divider-label">Rug Specifications</span>
                <div className="section-divider-line" />
              </div>

              {/* Upload / AI Extraction */}
              <div>
                <div className={`upload-zone${uploadState.status === 'uploading' || uploadState.status === 'extracting' ? ' busy' : ''}`}>
                  <div className="upload-main">
                    <div className="upload-icon">↑</div>
                    <div className="upload-text">
                      <div className="upload-title">Import rugs from file</div>
                      <div className="upload-sub">
                        {uploadState.status === 'idle' && 'Upload a PDF, Excel, CSV, or image — AI will extract the rug sizes.'}
                        {(uploadState.status === 'uploading' || uploadState.status === 'extracting') && (
                          <span className="upload-status">
                            <span className="spinner" />
                            {uploadState.status === 'uploading' ? 'Uploading' : 'Extracting rugs with Claude'} · {uploadState.filename}
                          </span>
                        )}
                        {uploadState.status === 'success' && `Imported from ${uploadState.filename}`}
                        {uploadState.status === 'error' && `Could not extract from ${uploadState.filename}`}
                      </div>
                    </div>
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.xlsx,.xls,.xlsm,.csv,.tsv,.png,.jpg,.jpeg,.webp,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,image/png,image/jpeg,image/webp"
                      onChange={handleFileUpload}
                      disabled={uploadState.status === 'uploading' || uploadState.status === 'extracting'}
                      style={{ display: 'none' }}
                    />
                    <button
                      className="btn-reset btn-sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadState.status === 'uploading' || uploadState.status === 'extracting'}
                      style={uploadState.status === 'uploading' || uploadState.status === 'extracting' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                      Choose File
                    </button>
                  </div>
                </div>

                {uploadState.status === 'error' && (
                  <div className="upload-error">
                    <div><strong>⚠ Extraction failed.</strong> {uploadState.error}</div>
                    <button
                      className="btn-reset btn-sm"
                      onClick={dismissUploadError}
                      style={{ flexShrink: 0, background: 'transparent', border: 'none', color: '#991b1b', padding: '2px 6px' }}
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {uploadState.status === 'success' && (
                  <div className="upload-success">
                    ✓ Rug list updated from imported file.
                  </div>
                )}
              </div>

              {/* Rug line items table */}
              <div>
                <table className="rug-table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: 120 }}>Area</th>
                      <th style={{ minWidth: 140 }}>Description</th>
                      <th style={{ textAlign: 'center', width: 50 }}>W ft</th>
                      <th style={{ textAlign: 'center', width: 50 }}>W in</th>
                      <th style={{ textAlign: 'center', width: 50 }}>L ft</th>
                      <th style={{ textAlign: 'center', width: 50 }}>L in</th>
                      <th style={{ textAlign: 'right', width: 60 }}>SFT</th>
                      <th style={{ textAlign: 'center', width: 55 }}>Qty</th>
                      <th style={{ textAlign: 'right', width: 80 }}>Total SFT</th>
                      <th style={{ width: 32 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rugsWithSft.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <input
                            className="rug-input"
                            value={r.area}
                            onChange={(e) => updateRug(r.id, 'area', e.target.value)}
                            placeholder="Area name"
                            style={{ fontWeight: 600 }}
                          />
                        </td>
                        <td>
                          <input
                            className="rug-input"
                            value={r.description}
                            onChange={(e) => updateRug(r.id, 'description', e.target.value)}
                            placeholder="Optional description…"
                          />
                        </td>
                        <td>
                          <input
                            className="rug-input rc"
                            type="number"
                            value={r.wFt}
                            onChange={(e) => updateRug(r.id, 'wFt', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            className="rug-input rc"
                            type="number"
                            value={r.wIn}
                            onChange={(e) => updateRug(r.id, 'wIn', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            className="rug-input rc"
                            type="number"
                            value={r.lFt}
                            onChange={(e) => updateRug(r.id, 'lFt', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            className="rug-input rc"
                            type="number"
                            value={r.lIn}
                            onChange={(e) => updateRug(r.id, 'lIn', e.target.value)}
                          />
                        </td>
                        <td className="rug-sft">{fmtNum(r.sft)}</td>
                        <td>
                          <input
                            className="rug-input rc"
                            type="number"
                            value={r.qty}
                            onChange={(e) => updateRug(r.id, 'qty', e.target.value)}
                          />
                        </td>
                        <td className="rug-total-sft">{fmtNum(r.totalSft)}</td>
                        <td>
                          <button
                            className="icon-btn"
                            onClick={() => removeRug(r.id)}
                            title="Remove rug"
                            disabled={rugs.length === 1}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="btn-reset btn-sm" onClick={addRug} style={{ marginTop: 10 }}>
                  + Add Rug
                </button>
              </div>

              <div className="section-divider">
                <div className="section-divider-line" />
                <span className="section-divider-label">Products &amp; Pricing Mode</span>
                <div className="section-divider-line" />
              </div>

              {/* Product pill selector — same style as carpet app product-btn */}
              <div className="field">
                <label>Include in Quote</label>
                <div className="product-selector">
                  {PRODUCTS.map((p) => {
                    const s = selections[p.name];
                    return (
                      <button
                        key={p.name}
                        className={`product-btn${s.selected ? ' active' : ''}`}
                        onClick={() => toggleProduct(p.name)}
                      >
                        {p.name}
                        <span className="product-btn-sub">
                          {p.ppp ? 'PPP' : `Max ${p.maxColors}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom / QW mode toggle per selected product */}
              {selectedProducts.filter((p) => !p.ppp).length > 0 && (
                <div className="field">
                  <label>Pricing Mode — Custom or Quickweave</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
                    {selectedProducts.filter((p) => !p.ppp).map((p) => {
                      const s = selections[p.name];
                      return (
                        <div key={p.name} className="opt-card active">
                          <div className="opt-card-main">
                            <div>
                              <div className="opt-card-title">{p.name}</div>
                              <div className="opt-card-sub">{p.pile}</div>
                            </div>
                          </div>
                          <div className="mode-toggle">
                            <button
                              className={`mode-toggle-btn${s.mode === 'custom' ? ' active' : ''}`}
                              onClick={() => setMode(p.name, 'custom')}
                            >
                              CUSTOM
                            </button>
                            <button
                              className={`mode-toggle-btn${s.mode === 'qw' ? ' active' : ''}`}
                              onClick={() => setMode(p.name, 'qw')}
                            >
                              QW
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="section-divider">
                <div className="section-divider-line" />
                <span className="section-divider-label">Quote Display Options</span>
                <div className="section-divider-line" />
              </div>

              {/* Show-in-quote toggles */}
              <div className="field">
                <label>Show in Final Quote</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 8 }}>
                  {[
                    ['maxColors', 'Max Colors'],
                    ['yarn', 'Yarn Composition'],
                    ['construction', 'Pile / Construction'],
                    ['pad', 'Non-slip Pad'],
                    ['palettes', 'QW Palettes'],
                  ].map(([k, label]) => (
                    <label key={k} className={`opt-card${showAttrs[k] ? ' active' : ''}`}>
                      <div className="opt-card-main">
                        <input
                          type="checkbox"
                          className="opt-card-check"
                          checked={showAttrs[k]}
                          onChange={() => setShowAttrs({ ...showAttrs, [k]: !showAttrs[k] })}
                        />
                        <div className="opt-card-title">{label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT — Quote Summary */}
        <div className="summary-card">
          <div className="summary-header">
            <div className="summary-header-title">Quote Summary</div>
            <div className="summary-header-sub">
              {client || 'No client'} · {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
              {crmRef && <> · CRM Ref: <strong style={{ color: 'var(--ink)' }}>{crmRef}</strong></>}
            </div>
          </div>
          <div className="summary-body">

            {warnings.length > 0 ? (
              <div className="alert alert-warn">
                <strong>⚠ Please review</strong>
                <ul>{warnings.map((w) => <li key={w}>{w}</li>)}</ul>
              </div>
            ) : projectTotalSft > 0 && selectedProducts.length > 0 ? (
              <div className="alert alert-ok">✓ Pricing valid</div>
            ) : (
              <div className="alert alert-warn" style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#64748b' }}>
                {projectTotalSft === 0 ? 'Add rug dimensions to calculate pricing.' : 'Select at least one product.'}
              </div>
            )}

            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-item-label">Project Total SFT</div>
                <div className="summary-item-value">{fmtNum(projectTotalSft, 0)}</div>
              </div>
              <div className="summary-item">
                <div className="summary-item-label">Rug Lines</div>
                <div className="summary-item-value">{rugs.length}</div>
              </div>
              <div className="summary-item">
                <div className="summary-item-label">Custom Bracket</div>
                <div className="summary-item-value" style={{ fontSize: 12 }}>
                  {customBracket ? BRACKET_LABELS[customBracket] : 'Below minimum'}
                </div>
              </div>
              <div className="summary-item">
                <div className="summary-item-label">QW Bracket</div>
                <div className="summary-item-value" style={{ fontSize: 12 }}>
                  {qwBracket ? BRACKET_LABELS[qwBracket] : 'Below minimum'}
                </div>
              </div>
            </div>

            {/* Price blocks — first product uses the dark ink block w/ gold gradient, rest use light totals */}
            <div className="price-blocks-grid">
            {selectedProducts.map((p, idx) => {
              const mode = selections[p.name].mode;
              const price = getPrice(p, mode);
              const grand = grandTotals[p.name];
              if (idx === 0) {
                return (
                  <div className="price-block" key={p.name}>
                    <div className="price-block-label">
                      {p.name} · {p.ppp ? 'PPP' : mode === 'custom' ? 'Custom' : 'Quickweave'}
                    </div>
                    <div className="price-block-value">
                      {p.ppp ? 'PPP' : typeof grand === 'number' ? currency(grand) : '—'}
                    </div>
                    {typeof price === 'number' && (
                      <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 6, position: 'relative' }}>
                        {currency(price)} / sft
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <div className="total-block" key={p.name}>
                  <div className="total-block-label">
                    {p.name} · {p.ppp ? 'PPP' : mode === 'custom' ? 'Custom' : 'Quickweave'}
                  </div>
                  <div className="total-block-value">
                    {p.ppp ? 'PPP' : typeof grand === 'number' ? currency(grand) : '—'}
                  </div>
                  {typeof price === 'number' && (
                    <div style={{ fontSize: 11, color: 'var(--ink2)', marginTop: 4 }}>
                      {currency(price)} / sft
                    </div>
                  )}
                </div>
              );
            })}
            </div>

            <button className="btn-primary" onClick={exportExcel} style={{ justifyContent: 'center', marginTop: 4 }}>
              ↓ Export Excel Quote
            </button>

            <p className="footnote">
              Prices include cutting, binding and attached non-slip pad. Custom minimum is 4,500 SFT; Quickweave minimum
              is 1,125 SFT. Hand Tufted is priced project-by-project.
            </p>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH QUOTE PREVIEW */}
      {selectedProducts.length > 0 && rugsWithSft.length > 0 && (
        <div style={{ maxWidth: 1400, margin: '0 auto 40px', padding: '0 28px' }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Quote Preview</span>
              <span style={{ fontSize: 11, color: 'var(--ink3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                Live · As it appears in export
              </span>
            </div>
            <div className="card-body">
              <div style={{ borderBottom: '2px solid var(--ink)', paddingBottom: 14, marginBottom: 16 }}>
                <div style={{ fontSize: 10, letterSpacing: '0.2em', fontWeight: 700, color: 'var(--gold)' }}>
                  BUDGET QUOTE
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0', color: 'var(--ink)' }}>
                  {client || '—'}
                </h2>
                <div style={{ fontSize: 12, color: 'var(--ink2)', marginTop: 4 }}>
                  {project} · {quoteDate}
                  {crmRef && <> · CRM Ref: <strong style={{ color: 'var(--ink)' }}>{crmRef}</strong></>}
                </div>
              </div>

              <div className="quote-preview">
                <table>
                  <thead>
                    <tr>
                      <th className="static" rowSpan={3}>Area</th>
                      <th className="static rc" rowSpan={3}>Size</th>
                      <th className="static ra" rowSpan={3}>SFT</th>
                      <th className="static rc" rowSpan={3}>Qty</th>
                      <th className="static ra" rowSpan={3}>Total SFT</th>
                      {selectedProducts.map((p) => (
                        <th key={p.name} className="product-head" colSpan={2}>
                          {p.name}
                        </th>
                      ))}
                    </tr>
                    <tr>
                      {selectedProducts.map((p) => (
                        <th key={`${p.name}-m`} className="product-head-mode" colSpan={2}>
                          {p.ppp ? 'PPP' : selections[p.name].mode === 'custom' ? 'CUSTOM' : 'QUICKWEAVE'}
                        </th>
                      ))}
                    </tr>
                    <tr>
                      {selectedProducts.map((p) => (
                        <React.Fragment key={`${p.name}-sub`}>
                          <th className="sub first">USD/RUG</th>
                          <th className="sub">TOTAL</th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rugsWithSft.map((r) => (
                      <tr key={r.id}>
                        <td className="area-cell">
                          {r.area}
                          {r.description && <div className="desc-cell" style={{ marginTop: 2 }}>{r.description}</div>}
                        </td>
                        <td className="rc" style={{ color: 'var(--ink2)' }}>
                          {r.wFt}'{r.wIn ? `${r.wIn}"` : ''} × {r.lFt}'{r.lIn ? `${r.lIn}"` : ''}
                        </td>
                        <td className="ra">{fmtNum(r.sft)}</td>
                        <td className="rc">{r.qty}</td>
                        <td className="ra" style={{ fontWeight: 600 }}>{fmtNum(r.totalSft)}</td>
                        {selectedProducts.map((p) => {
                          const mode = selections[p.name].mode;
                          const price = getPrice(p, mode);
                          return (
                            <React.Fragment key={`${p.name}-${r.id}`}>
                              <td className="ra col-l">
                                {typeof price === 'number' ? currency(price * r.sft) : '—'}
                              </td>
                              <td className="ra" style={{ fontWeight: 600 }}>
                                {typeof price === 'number'
                                  ? currency(price * r.sft * (Number(r.qty) || 0))
                                  : '—'}
                              </td>
                            </React.Fragment>
                          );
                        })}
                      </tr>
                    ))}
                    <tr className="totals-row">
                      <td colSpan={4} style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink2)' }}>
                        Project Total
                      </td>
                      <td className="ra">{fmtNum(projectTotalSft)}</td>
                      {selectedProducts.map((p) => {
                        const g = grandTotals[p.name];
                        return (
                          <React.Fragment key={`tot-${p.name}`}>
                            <td className="col-l"></td>
                            <td className="ra grand">
                              {p.ppp ? 'PPP' : typeof g === 'number' ? currency(g) : '—'}
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                    {showAttrs.maxColors && (
                      <AttrRow label="Max Colors" cols={selectedProducts} get={(p) => `Max ${p.maxColors}`} />
                    )}
                    {showAttrs.yarn && (
                      <AttrRow label="Yarn" cols={selectedProducts} get={(p) => p.yarn} />
                    )}
                    {showAttrs.construction && (
                      <AttrRow label="Construction" cols={selectedProducts} get={(p) => p.construction} />
                    )}
                    {showAttrs.pad && (
                      <AttrRow label="Pad" cols={selectedProducts} get={() => 'With non-slip pad'} />
                    )}
                    {showAttrs.palettes && (
                      <AttrRow label="Palettes" cols={selectedProducts} get={(p) => p.qwPalettes} />
                    )}
                  </tbody>
                </table>
              </div>

              <div className="terms">
                <div className="terms-title">Terms &amp; Conditions</div>
                <div>1. This quotation is subject to Brintons' standard terms and conditions.</div>
                <div>2. All prices are valid for 30 days from the date of this document.</div>
                <div>3. Production lead times vary; please speak with your local Brintons representative.</div>
                <div>4. Orders may be subject to applicable import tariffs at the time of dispatch.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm modal — review extracted rugs before replacing */}
      {uploadState.status === 'confirm' && uploadState.extractedRugs && (
        <div className="modal-backdrop" onClick={cancelExtracted}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Replace rugs with extracted data?</div>
              <div className="modal-sub">
                {uploadState.extractedRugs.length} rug{uploadState.extractedRugs.length !== 1 ? 's' : ''} found in {uploadState.filename}. This will replace your current {rugs.length} rug line{rugs.length !== 1 ? 's' : ''}.
              </div>
            </div>
            <div className="modal-body">
              <div className="modal-list">
                {uploadState.extractedRugs.map((r, i) => (
                  <div className="modal-list-row" key={i}>
                    <div>
                      <div className="area">{r.area}</div>
                      {r.description && <div style={{ fontSize: 11, color: 'var(--ink2)', fontStyle: 'italic' }}>{r.description}</div>}
                    </div>
                    <div className="size">
                      {r.wFt}'{r.wIn ? `${r.wIn}"` : ''} × {r.lFt}'{r.lIn ? `${r.lIn}"` : ''}
                    </div>
                    <div className="qty">× {r.qty}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-reset" onClick={cancelExtracted}>Cancel</button>
              <button className="btn-primary" onClick={confirmApplyExtracted} style={{ padding: '8px 16px' }}>
                Replace Rugs
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AttrRow({ label, cols, get }) {
  return (
    <tr className="attr-row">
      <td colSpan={4} className="label">{label}</td>
      <td></td>
      {cols.map((p) => (
        <td key={`attr-${label}-${p.name}`} colSpan={2} className="rc">
          {get(p)}
        </td>
      ))}
    </tr>
  );
}
