// f:\antigravityprojects\zangmo\frontend\src\pages\admin\AdminPayroll.jsx
import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from './AdminSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/users.css';

/* ─────────────────────────────────────────────────────────────────
   Inline styles — consistent with project patterns
   ───────────────────────────────────────────────────────────────── */
const S = `
  @keyframes pr-fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pr-toast {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pr-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(252,143,52,0.35); }
    50%       { box-shadow: 0 0 0 6px rgba(252,143,52,0); }
  }
  @keyframes pr-spin {
    to { transform: rotate(360deg); }
  }

  /* ── Hero banner ── */
  .pr-hero {
    background: linear-gradient(135deg, #172331 0%, #1e2e40 55%, #162839 100%);
    border-radius: 10px;
    padding: 28px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 24px;
    position: relative;
    overflow: hidden;
    animation: pr-fadeUp 0.35s ease both;
  }
  .pr-hero::before {
    content: '';
    position: absolute; top: -60px; right: -30px;
    width: 220px; height: 220px; border-radius: 50%;
    background: radial-gradient(circle, rgba(252,143,52,0.13) 0%, transparent 70%);
    pointer-events: none;
  }
  .pr-hero::after {
    content: '';
    position: absolute; bottom: -40px; left: 30%;
    width: 140px; height: 140px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99,179,237,0.07) 0%, transparent 70%);
    pointer-events: none;
  }
  .pr-hero-left { flex: 1; min-width: 0; }
  .pr-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(252,143,52,0.16); border: 1px solid rgba(252,143,52,0.3);
    color: #fc8f34; font-size: 10px; font-weight: 700;
    padding: 3px 11px; border-radius: 20px;
    text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 9px;
  }
  .pr-hero h1 { margin: 0 0 6px; font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
  .pr-hero p  { margin: 0; font-size: 13px; color: rgba(255,255,255,0.48); line-height: 1.65; max-width: 560px; }
  .pr-hero-right { display: flex; gap: 14px; flex-shrink: 0; flex-wrap: wrap; }
  .pr-hero-stat {
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px; padding: 14px 20px; text-align: center; min-width: 110px;
  }
  .pr-hero-stat-val { font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
  .pr-hero-stat-lbl { font-size: 10px; color: rgba(255,255,255,0.45); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 4px; }

  /* ── KPI Cards ── */
  .pr-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .pr-kpi {
    background: white; border: 1px solid #e0e3e6; border-radius: 10px;
    padding: 18px 20px; display: flex; flex-direction: column; gap: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
    animation: pr-fadeUp 0.35s ease both;
    border-left: 4px solid transparent;
  }
  .pr-kpi:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.07); }
  .pr-kpi-top { display: flex; align-items: center; justify-content: space-between; }
  .pr-kpi-label { font-size: 10.5px; font-weight: 700; color: #5a626a; text-transform: uppercase; letter-spacing: 0.05em; }
  .pr-kpi-ico { width: 32px; height: 32px; border-radius: 7px; display: flex; align-items: center; justify-content: center; }
  .pr-kpi-value { font-size: 24px; font-weight: 700; color: #162839; letter-spacing: -0.03em; margin: 0; }
  .pr-kpi-sub { font-size: 11px; color: #9ca3af; font-weight: 500; margin: 0; }

  /* ── Toolbar ── */
  .pr-toolbar {
    background: white; border: 1px solid #e0e3e6; border-radius: 10px;
    padding: 14px 18px; display: flex; align-items: center; gap: 12px;
    margin-bottom: 20px; flex-wrap: wrap;
  }
  .pr-toolbar-title { font-size: 14px; font-weight: 700; color: #162839; white-space: nowrap; }
  .pr-search {
    flex: 1; min-width: 180px; max-width: 280px;
    display: flex; align-items: center; gap: 8px;
    background: #f7f9fc; border: 1px solid #e0e3e6; border-radius: 7px;
    padding: 8px 12px;
  }
  .pr-search input {
    border: none; outline: none; background: transparent;
    font-size: 13px; font-family: 'Inter', sans-serif; font-weight: 500;
    color: #162839; width: 100%;
  }
  .pr-search input::placeholder { color: #9ca3af; }
  .pr-select {
    padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 7px;
    font-size: 13px; font-family: 'Inter', sans-serif; font-weight: 600;
    color: #374151; background: white; cursor: pointer; outline: none;
    transition: border-color 0.15s;
  }
  .pr-select:focus { border-color: #fc8f34; }
  .pr-toolbar-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
  .pr-btn-add {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 7px; border: none;
    background: #162839; color: white;
    font-size: 13px; font-weight: 600; font-family: 'Inter', sans-serif;
    cursor: pointer; transition: all 0.18s; white-space: nowrap;
  }
  .pr-btn-add:hover { background: #0f172a; box-shadow: 0 4px 12px rgba(22,40,57,0.25); }
  .pr-count { font-size: 12px; font-weight: 600; color: #9ca3af; white-space: nowrap; }

  /* ── Month tabs ── */
  .pr-month-tabs {
    display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px;
    scrollbar-width: none;
  }
  .pr-month-tabs::-webkit-scrollbar { display: none; }
  .pr-month-tab {
    padding: 6px 14px; border-radius: 6px; border: 1px solid #e0e3e6;
    background: white; font-size: 12px; font-weight: 600; color: #5a626a;
    cursor: pointer; white-space: nowrap; transition: all 0.15s; font-family: 'Inter', sans-serif;
  }
  .pr-month-tab:hover { border-color: #b0b7bf; color: #162839; }
  .pr-month-tab.active {
    background: #162839; color: white; border-color: #162839;
  }

  /* ── Table ── */
  .pr-table-wrap {
    background: white; border: 1px solid #e0e3e6; border-radius: 10px;
    overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    animation: pr-fadeUp 0.35s ease both; animation-delay: 0.08s;
  }
  .pr-table-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px 12px; border-bottom: 1px solid #f1f5f9;
  }
  .pr-table-head-title { font-size: 14px; font-weight: 700; color: #162839; }
  .pr-table-head-sub { font-size: 12px; color: #9ca3af; font-weight: 500; margin-top: 2px; }

  table.pr-table { width: 100%; border-collapse: collapse; }
  table.pr-table thead th {
    padding: 11px 16px; text-align: left;
    font-size: 10.5px; font-weight: 700; color: #5a626a;
    text-transform: uppercase; letter-spacing: 0.05em;
    background: #f7f9fc; border-bottom: 1px solid #e0e3e6;
    white-space: nowrap;
  }
  table.pr-table thead th:first-child { border-radius: 0; }
  table.pr-table tbody tr {
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.15s;
  }
  table.pr-table tbody tr:hover { background: #f7f9fc; }
  table.pr-table tbody tr:last-child { border-bottom: none; }
  table.pr-table td { padding: 13px 16px; font-size: 13px; color: #374151; vertical-align: middle; }

  /* Cells */
  .pr-avatar {
    width: 36px; height: 36px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; flex-shrink: 0;
  }
  .pr-emp-cell { display: flex; align-items: center; gap: 10px; }
  .pr-emp-name { font-weight: 700; color: #162839; font-size: 13.5px; }
  .pr-emp-role { font-size: 11px; color: #9ca3af; font-weight: 500; margin-top: 1px; }
  .pr-branch-pill {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
    background: #e0e7ff; color: #4338ca;
  }
  .pr-branch-pill.mehdi { background: #fff7ed; color: #c2410c; }
  .pr-branch-pill.zangmo { background: #e0e7ff; color: #4338ca; }

  .pr-amount { font-weight: 700; font-size: 14px; color: #162839; }
  .pr-amount-sub { font-size: 11px; color: #9ca3af; font-weight: 500; }

  /* Status badges */
  .pr-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 6px;
    font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
  }
  .pr-badge-paid     { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
  .pr-badge-pending  { background: #fef3c7; color: #d97706; border: 1px solid #fde68a; }
  .pr-badge-overdue  { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
  .pr-badge-draft    { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }

  /* Action buttons */
  .pr-actions { display: flex; align-items: center; gap: 6px; }
  .pr-btn-icon {
    width: 32px; height: 32px; border-radius: 6px; border: 1px solid #e0e3e6;
    background: white; cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: #5a626a; transition: all 0.15s; font-family: 'Inter', sans-serif;
  }
  .pr-btn-icon:hover { border-color: #162839; color: #162839; background: #f7f9fc; }
  .pr-btn-icon.danger:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }
  .pr-btn-pay {
    padding: 6px 14px; border-radius: 6px; border: none;
    background: #162839; color: white; font-size: 11.5px; font-weight: 700;
    font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.18s;
    white-space: nowrap;
  }
  .pr-btn-pay:hover { background: #0f172a; box-shadow: 0 2px 8px rgba(22,40,57,0.2); }
  .pr-btn-pay:disabled { background: #d1d5db; cursor: not-allowed; box-shadow: none; }

  /* ── Empty state ── */
  .pr-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 80px 24px; text-align: center; gap: 8px;
  }
  .pr-empty-ico {
    width: 56px; height: 56px; border-radius: 50%;
    background: #f3f4f6; border: 1px solid #e5e7eb;
    display: flex; align-items: center; justify-content: center;
    color: #c4c6cd; margin-bottom: 6px;
  }
  .pr-empty h3 { margin: 0; font-size: 15px; font-weight: 700; color: #162839; }
  .pr-empty p  { margin: 0; font-size: 13px; color: #5a626a; max-width: 300px; line-height: 1.6; }

  /* ── Modal overlay ── */
  .pr-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.45);
    display: flex; align-items: center; justify-content: center;
    z-index: 1100; padding: 24px;
    animation: pr-fadeUp 0.18s ease;
  }
  .pr-modal {
    background: white; border-radius: 12px; width: 100%;
    max-width: 560px; max-height: 90vh; overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    animation: pr-fadeUp 0.22s cubic-bezier(0.34,1.56,0.64,1);
  }
  .pr-modal-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px 16px; border-bottom: 1px solid #f1f5f9;
    position: sticky; top: 0; background: white; z-index: 1;
  }
  .pr-modal-title { font-size: 16px; font-weight: 700; color: #162839; margin: 0; }
  .pr-modal-sub { font-size: 12px; color: #9ca3af; font-weight: 500; margin: 3px 0 0; }
  .pr-modal-close {
    width: 32px; height: 32px; border-radius: 6px; border: 1px solid #e0e3e6;
    background: white; cursor: pointer; display: flex; align-items: center;
    justify-content: center; color: #5a626a; transition: all 0.15s;
  }
  .pr-modal-close:hover { background: #fef2f2; border-color: #fca5a5; color: #ef4444; }
  .pr-modal-body { padding: 20px 24px; }
  .pr-modal-footer {
    padding: 14px 24px; border-top: 1px solid #f1f5f9;
    display: flex; justify-content: flex-end; gap: 10px;
    position: sticky; bottom: 0; background: white;
  }

  /* Form fields */
  .pr-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .pr-form-grid.single { grid-template-columns: 1fr; }
  .pr-form-field { display: flex; flex-direction: column; gap: 5px; }
  .pr-form-field.span2 { grid-column: span 2; }
  .pr-label { font-size: 11.5px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.05em; }
  .pr-input, .pr-textarea, .pr-fselect {
    padding: 9px 12px; border: 1px solid #d1d5db; border-radius: 7px;
    font-size: 13px; font-family: 'Inter', sans-serif; color: #162839;
    outline: none; transition: border-color 0.15s, box-shadow 0.15s;
    background: white;
  }
  .pr-input:focus, .pr-textarea:focus, .pr-fselect:focus {
    border-color: #162839; box-shadow: 0 0 0 3px rgba(22,40,57,0.08);
  }
  .pr-textarea { resize: vertical; min-height: 72px; }
  .pr-divider { border: none; border-top: 1px solid #f1f5f9; margin: 16px 0; }
  .pr-section-label {
    font-size: 10.5px; font-weight: 700; color: #9ca3af;
    text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 10px;
  }
  .pr-breakdown {
    background: #f7f9fc; border: 1px solid #e0e3e6; border-radius: 8px;
    padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;
  }
  .pr-breakdown-row {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 13px;
  }
  .pr-breakdown-row .lbl { color: #475569; font-weight: 500; }
  .pr-breakdown-row .val { font-weight: 700; color: #162839; }
  .pr-breakdown-row .val.green { color: #059669; }
  .pr-breakdown-row .val.red   { color: #dc2626; }
  .pr-breakdown-total {
    border-top: 2px solid #162839; padding-top: 8px; margin-top: 4px;
  }
  .pr-breakdown-total .lbl { font-weight: 700; color: #162839; font-size: 14px; }
  .pr-breakdown-total .val  { font-weight: 700; color: #162839; font-size: 16px; }

  /* Cancel / Save buttons */
  .pr-btn-cancel {
    padding: 9px 20px; border: 1px solid #e0e3e6; border-radius: 7px;
    background: white; font-size: 13px; font-weight: 600; color: #374151;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s;
  }
  .pr-btn-cancel:hover { background: #f7f9fc; border-color: #b0b7bf; }
  .pr-btn-save {
    padding: 9px 22px; border: none; border-radius: 7px;
    background: #162839; font-size: 13px; font-weight: 700; color: white;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.18s;
    display: flex; align-items: center; gap: 7px;
  }
  .pr-btn-save:hover { background: #0f172a; box-shadow: 0 4px 12px rgba(22,40,57,0.22); }

  /* ── Payslip modal ── */
  .pr-slip { font-family: 'Inter', sans-serif; }
  .pr-slip-head {
    background: linear-gradient(135deg, #172331 0%, #1e2e40 100%);
    padding: 22px 24px; border-radius: 8px 8px 0 0; color: white;
    display: flex; justify-content: space-between; align-items: flex-start;
  }
  .pr-slip-brand { font-size: 17px; font-weight: 700; }
  .pr-slip-sub   { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 3px; }
  .pr-slip-title { font-size: 13px; font-weight: 700; background: rgba(255,255,255,0.1); padding: 6px 14px; border-radius: 6px; }
  .pr-slip-meta {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
    padding: 16px 24px; background: #f7f9fc; border: 1px solid #e0e3e6;
    border-top: none;
  }
  .pr-slip-meta-item { display: flex; flex-direction: column; gap: 2px; }
  .pr-slip-meta-item .k { font-size: 10px; color: #9ca3af; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
  .pr-slip-meta-item .v { font-size: 13px; font-weight: 600; color: #162839; }
  .pr-slip-section { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; }
  .pr-slip-section-title { font-size: 10.5px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 12px; }
  .pr-slip-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #f1f5f9; font-size: 13px; }
  .pr-slip-row:last-child { border-bottom: none; }
  .pr-slip-total {
    padding: 16px 24px; display: flex; justify-content: space-between; align-items: center;
    background: #162839; border-radius: 0 0 8px 8px; color: white;
  }
  .pr-slip-total-lbl { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.7); }
  .pr-slip-total-val { font-size: 24px; font-weight: 700; color: #fff; letter-spacing: -0.03em; }

  /* ── Toast ── */
  .pr-toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background: #111827; color: white;
    padding: 13px 20px; border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.22);
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; font-weight: 500; font-family: 'Inter', sans-serif;
    animation: pr-toast 0.3s cubic-bezier(0.16,1,0.3,1) forwards;
    max-width: 380px;
  }
  .pr-toast-success { border-left: 4px solid #10b981; }
  .pr-toast-success svg { color: #10b981; }
  .pr-toast-error { border-left: 4px solid #ef4444; }
  .pr-toast-error svg { color: #ef4444; }

  /* ── Responsive ── */
  @media (max-width: 1100px) { .pr-kpis { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 900px) {
    .pr-hero { flex-direction: column; }
    .pr-hero-right { flex-direction: row; justify-content: flex-start; }
    .pr-form-grid { grid-template-columns: 1fr; }
    .pr-form-field.span2 { grid-column: span 1; }
  }
  @media (max-width: 640px) {
    .pr-kpis { grid-template-columns: 1fr 1fr; }
  }

  /* ── Calendar Month Picker ── */
  .pr-cal-picker-container {
    position: relative;
    display: inline-block;
  }
  .pr-cal-trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 7px;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
    height: 38px;
    box-sizing: border-box;
  }
  .pr-cal-trigger:hover {
    border-color: #fc8f34;
    color: #162839;
    background: #fffcf9;
  }
  .pr-cal-icon {
    width: 15px;
    height: 15px;
    color: #fc8f34;
    flex-shrink: 0;
  }
  .pr-cal-arrow {
    width: 12px;
    height: 12px;
    color: #9ca3af;
    transition: transform 0.15s ease;
  }
  .pr-cal-trigger:hover .pr-cal-arrow {
    color: #fc8f34;
  }
  .pr-cal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
  }
  .pr-cal-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    width: 230px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    z-index: 1001;
    padding: 12px;
    animation: pr-fadeUp 0.18s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .pr-cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f1f5f9;
  }
  .pr-cal-year-btn {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748b;
    transition: all 0.15s;
  }
  .pr-cal-year-btn:hover {
    border-color: #fc8f34;
    color: #fc8f34;
    background: #fffcf9;
  }
  .pr-cal-year-btn svg {
    width: 12px;
    height: 12px;
  }
  .pr-cal-year-title {
    font-size: 14px;
    font-weight: 700;
    color: #162839;
    letter-spacing: -0.01em;
  }
  .pr-cal-months-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
  .pr-cal-month-btn {
    padding: 8px 0;
    border: none;
    background: transparent;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    color: #475569;
    cursor: pointer;
    transition: all 0.12s;
  }
  .pr-cal-month-btn:hover {
    background: #f1f5f9;
    color: #162839;
  }
  .pr-cal-month-btn.active {
    background: #162839;
    color: white;
    font-weight: 700;
  }
`;

/* ── Icons ── */
const Ico = {
  Payroll:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>,
  Users:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Clock:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  TrendUp:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Plus:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Search:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Filter:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Eye:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Edit:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Download: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Check:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Receipt:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="16" y1="8" x2="8" y2="8"/><line x1="16" y1="12" x2="8" y2="12"/><line x1="16" y1="16" x2="12" y2="16"/></svg>,
  Empty:    () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>,
  Shield:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  CheckCircle: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  XCircle:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>,
  Calendar: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
};

/* ── Helpers ── */
const PALETTE = [
  { bg: '#ffedd5', color: '#c2410c' },
  { bg: '#dbeafe', color: '#1e40af' },
  { bg: '#e0e7ff', color: '#4338ca' },
  { bg: '#fef08a', color: '#854d0e' },
  { bg: '#d1fae5', color: '#065f46' },
  { bg: '#fce7f3', color: '#be185d' },
  { bg: '#f3e8ff', color: '#7e22ce' },
  { bg: '#e0f2fe', color: '#0369a1' },
];

function initials(name) {
  return (name || '').trim().split(' ').filter(Boolean).map(w => w[0]).join('').substring(0, 2).toUpperCase() || '??';
}

function fmtPKR(n) {
  if (n === undefined || n === null) return 'Rs. 0';
  return `Rs. ${Number(n).toLocaleString('en-PK')}`;
}

const MONTHS = ['Jan 2026','Feb 2026','Mar 2026','Apr 2026','May 2026'];

const INITIAL_EMPLOYEES = [
  {
    id: 1, name: 'Tandin Dorji', role: 'Head Chef', branch: 'Mehdi Kitchen (Main)',
    basicSalary: 75000, hoursWorked: 192, overtimeHours: 12, overtimeRate: 450,
    allowances: 8000, deductions: 3500, tax: 4200, status: 'Paid',
    month: 'May 2026', paidOn: 'May 24, 2026', notes: 'Excellent work during Eid rush.',
  },
  {
    id: 2, name: 'Dechen Wangmo', role: 'Sous Chef', branch: 'Zangmo Kitchen',
    basicSalary: 60000, hoursWorked: 184, overtimeHours: 8, overtimeRate: 380,
    allowances: 5000, deductions: 2800, tax: 3600, status: 'Paid',
    month: 'May 2026', paidOn: 'May 24, 2026', notes: 'Consistent performance.',
  },
  {
    id: 3, name: 'Passang Tshering', role: 'Waiter', branch: 'Mehdi Kitchen (Main)',
    basicSalary: 38000, hoursWorked: 176, overtimeHours: 5, overtimeRate: 260,
    allowances: 3000, deductions: 1500, tax: 2000, status: 'Pending',
    month: 'May 2026', paidOn: '', notes: '',
  },
  {
    id: 4, name: 'Rinchen Lhamo', role: 'Kitchen Helper', branch: 'Zangmo Kitchen',
    basicSalary: 32000, hoursWorked: 180, overtimeHours: 0, overtimeRate: 200,
    allowances: 2500, deductions: 1200, tax: 1600, status: 'Pending',
    month: 'May 2026', paidOn: '', notes: '',
  },
  {
    id: 5, name: 'Karma Yangzom', role: 'Cashier', branch: 'Mehdi Kitchen (Main)',
    basicSalary: 42000, hoursWorked: 188, overtimeHours: 3, overtimeRate: 290,
    allowances: 3500, deductions: 1800, tax: 2300, status: 'Paid',
    month: 'May 2026', paidOn: 'May 22, 2026', notes: 'Accurate cash handling all month.',
  },
  {
    id: 6, name: 'Tashi Namgyal', role: 'Waiter', branch: 'Zangmo Kitchen',
    basicSalary: 36000, hoursWorked: 172, overtimeHours: 2, overtimeRate: 240,
    allowances: 2800, deductions: 1400, tax: 1900, status: 'Overdue',
    month: 'Apr 2026', paidOn: '', notes: 'Payment delayed — bank issue.',
  },
  {
    id: 7, name: 'Sonam Pelbar', role: 'Delivery Rider', branch: 'Mehdi Kitchen (Main)',
    basicSalary: 29000, hoursWorked: 196, overtimeHours: 16, overtimeRate: 200,
    allowances: 5000, deductions: 1000, tax: 1400, status: 'Paid',
    month: 'May 2026', paidOn: 'May 25, 2026', notes: 'High delivery performance.',
  },
  {
    id: 8, name: 'Pema Choden', role: 'Cleaner', branch: 'Zangmo Kitchen',
    basicSalary: 24000, hoursWorked: 160, overtimeHours: 0, overtimeRate: 170,
    allowances: 2000, deductions: 800, tax: 1100, status: 'Draft',
    month: 'May 2026', paidOn: '', notes: 'New hire — first payroll cycle.',
  },
];

function calcNet(emp) {
  const overtime = (emp.overtimeHours || 0) * (emp.overtimeRate || 0);
  const gross = (emp.basicSalary || 0) + (emp.allowances || 0) + overtime;
  const net = gross - (emp.deductions || 0) - (emp.tax || 0);
  return { overtime, gross, net };
}

/* ─────── Main component ─────── */
export default function AdminPayroll() {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('zangmo_payroll_v2');
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return INITIAL_EMPLOYEES;
  });

  const [selectedMonth, setSelectedMonth] = useState('May 2026');
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    const parts = selectedMonth.split(' ');
    if (parts.length === 2) {
      const yr = parseInt(parts[1], 10);
      if (!isNaN(yr)) return yr;
    }
    return 2026;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [modal, setModal] = useState({ open: false, mode: 'add', data: null });
  const [slipModal, setSlipModal] = useState({ open: false, emp: null });
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });

  useEffect(() => { localStorage.setItem('zangmo_payroll_v2', JSON.stringify(employees)); }, [employees]);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  /* ── Filtering ── */
  const filtered = employees.filter(e => {
    const mMonth = e.month === selectedMonth;
    const mBranch = branchFilter === 'All' || e.branch === branchFilter;
    const mStatus = statusFilter === 'All' || e.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const mSearch = !q || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q);
    return mMonth && mBranch && mStatus && mSearch;
  });

  /* ── KPIs ── */
  const monthEmps = employees.filter(e => e.month === selectedMonth);
  const totalPayroll = monthEmps.reduce((s, e) => s + calcNet(e).net, 0);
  const paidCount = monthEmps.filter(e => e.status === 'Paid').length;
  const pendingCount = monthEmps.filter(e => e.status === 'Pending').length;
  const overdueCount = monthEmps.filter(e => e.status === 'Overdue').length;

  /* ── Actions ── */
  const markPaid = (id) => {
    const emp = employees.find(e => e.id === id);
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: 'Paid', paidOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } : e));
    showToast(`Salary for ${emp?.name} marked as Paid.`);
  };

  const deleteRecord = (id) => {
    const emp = employees.find(e => e.id === id);
    if (!window.confirm(`Delete payroll record for "${emp?.name}"? This cannot be undone.`)) return;
    setEmployees(prev => prev.filter(e => e.id !== id));
    showToast(`Record for ${emp?.name} deleted.`, 'error');
  };

  const openEdit = (emp) => setModal({ open: true, mode: 'edit', data: { ...emp } });
  const openAdd  = () => setModal({
    open: true, mode: 'add', data: {
      id: Date.now(), name: '', role: '', branch: 'Mehdi Kitchen (Main)',
      basicSalary: '', hoursWorked: '', overtimeHours: 0, overtimeRate: '',
      allowances: '', deductions: '', tax: '', status: 'Draft',
      month: selectedMonth, paidOn: '', notes: '',
    }
  });

  const saveModal = () => {
    const d = modal.data;
    if (!d.name.trim() || !d.role.trim() || !d.basicSalary) {
      showToast('Please fill in name, role, and basic salary.', 'error'); return;
    }
    if (modal.mode === 'add') {
      setEmployees(prev => [...prev, { ...d, id: Date.now() }]);
      showToast(`Payroll record for ${d.name} added successfully.`);
    } else {
      setEmployees(prev => prev.map(e => e.id === d.id ? { ...d } : e));
      showToast(`Record for ${d.name} updated.`);
    }
    setModal({ open: false, mode: 'add', data: null });
  };

  const fieldChange = (key, val) => setModal(m => ({ ...m, data: { ...m.data, [key]: val } }));

  const viewSlip = (emp) => setSlipModal({ open: true, emp });

  /* ── Live modal breakdown ── */
  const modalCalc = modal.data ? calcNet(modal.data) : {};

  return (
    <div className="dashboard">
      <style>{S}</style>
      <AdminSidebar activePage="payroll" />

      <div className="main-content">
        <Topbar title="Salary & Payroll" />

        <div className="page-content" style={{ overflowY: 'auto', background: '#f7f9fc' }}>

          {/* ── Hero ── */}
          <div className="pr-hero">
            <div className="pr-hero-left">
              <div className="pr-eyebrow"><Ico.Shield /> Payroll Management</div>
              <h1>Salary &amp; Payroll</h1>
              <p>Manage monthly salaries, track payments, and generate pay slips for all staff across both branches. Every rupee accounted for — transparently and on time.</p>
            </div>
            <div className="pr-hero-right">
              <div className="pr-hero-stat">
                <div className="pr-hero-stat-val">{monthEmps.length}</div>
                <div className="pr-hero-stat-lbl">Employees</div>
              </div>
              <div className="pr-hero-stat">
                <div className="pr-hero-stat-val">{fmtPKR(totalPayroll)}</div>
                <div className="pr-hero-stat-lbl">Total Payroll</div>
              </div>
              <div className="pr-hero-stat">
                <div className="pr-hero-stat-val">{paidCount}/{monthEmps.length}</div>
                <div className="pr-hero-stat-lbl">Salaries Paid</div>
              </div>
            </div>
          </div>

          {/* ── KPIs ── */}
          <div className="pr-kpis">
            {[
              { label: 'Total Payroll', value: fmtPKR(totalPayroll), sub: selectedMonth, Icon: Ico.Payroll, ico_bg: '#f3f4f6', ico_c: '#374151', border: '#e0e3e6' },
              { label: 'Paid', value: paidCount, sub: `${monthEmps.length} total`, Icon: Ico.CheckCircle, ico_bg: '#ecfdf5', ico_c: '#059669', border: '#10b981' },
              { label: 'Pending', value: pendingCount, sub: 'awaiting payment', Icon: Ico.Clock, ico_bg: '#fff7ed', ico_c: '#c2410c', border: '#fc8f34' },
              { label: 'Overdue', value: overdueCount, sub: 'needs attention', Icon: Ico.XCircle, ico_bg: '#fef2f2', ico_c: '#dc2626', border: '#ef4444' },
            ].map((k, i) => (
              <div key={i} className="pr-kpi" style={{ borderLeftColor: k.border, animationDelay: `${i * 0.06}s` }}>
                <div className="pr-kpi-top">
                  <span className="pr-kpi-label">{k.label}</span>
                  <div className="pr-kpi-ico" style={{ background: k.ico_bg, color: k.ico_c }}><k.Icon /></div>
                </div>
                <p className="pr-kpi-value">{k.value}</p>
                <p className="pr-kpi-sub">{k.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Toolbar ── */}
          <div className="pr-toolbar">
            <span className="pr-toolbar-title">Payroll Records</span>
            <Ico.Filter />
            {/* Styled Calendar Month Picker Dropdown */}
            <div className="pr-cal-picker-container">
              <button
                className="pr-cal-trigger"
                onClick={() => {
                  const parts = selectedMonth.split(' ');
                  if (parts.length === 2) {
                    const yr = parseInt(parts[1], 10);
                    if (!isNaN(yr)) setViewYear(yr);
                  }
                  setShowMonthPicker(!showMonthPicker);
                }}
                id="payroll-month-picker-trigger"
              >
                <Ico.Calendar />
                <span>{selectedMonth}</span>
                <svg className="pr-cal-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {showMonthPicker && (
                <>
                  <div className="pr-cal-backdrop" onClick={() => setShowMonthPicker(false)} />
                  <div className="pr-cal-dropdown">
                    <div className="pr-cal-header">
                      <button type="button" className="pr-cal-year-btn" onClick={() => setViewYear(y => y - 1)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                      </button>
                      <span className="pr-cal-year-title">{viewYear}</span>
                      <button type="button" className="pr-cal-year-btn" onClick={() => setViewYear(y => y + 1)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                      </button>
                    </div>
                    <div className="pr-cal-months-grid">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(mShort => {
                        const mFull = `${mShort} ${viewYear}`;
                        const isActive = selectedMonth === mFull;
                        return (
                          <button
                            key={mShort}
                            type="button"
                            className={`pr-cal-month-btn${isActive ? ' active' : ''}`}
                            onClick={() => {
                              setSelectedMonth(mFull);
                              setShowMonthPicker(false);
                            }}
                          >
                            {mShort}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="pr-search">
              <Ico.Search />
              <input
                placeholder="Search staff…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                id="payroll-search-input"
              />
            </div>

            <select className="pr-select" value={branchFilter} onChange={e => setBranchFilter(e.target.value)} id="payroll-branch-filter">
              <option value="All">All Branches</option>
              <option value="Mehdi Kitchen (Main)">Mehdi Kitchen</option>
              <option value="Zangmo Kitchen">Zangmo Kitchen</option>
            </select>

            <select className="pr-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} id="payroll-status-filter">
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Draft">Draft</option>
            </select>

            <div className="pr-toolbar-right">
              <span className="pr-count">{filtered.length} of {monthEmps.length} record{monthEmps.length !== 1 ? 's' : ''}</span>
              <button className="pr-btn-add" onClick={openAdd} id="payroll-add-btn">
                <Ico.Plus /> Add Record
              </button>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="pr-table-wrap">
            <div className="pr-table-head">
              <div>
                <div className="pr-table-head-title">Staff Payroll — {selectedMonth}</div>
                <div className="pr-table-head-sub">All amounts in Pakistani Rupees (Rs.)</div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="pr-empty">
                <div className="pr-empty-ico"><Ico.Empty /></div>
                <h3>No payroll records found</h3>
                <p>No staff matches your current filters for {selectedMonth}. Try changing branch, status, or search query.</p>
              </div>
            ) : (
              <table className="pr-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Branch</th>
                    <th>Basic Salary</th>
                    <th>Allowances</th>
                    <th>Deductions &amp; Tax</th>
                    <th>Net Pay</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp, idx) => {
                    const pal = PALETTE[idx % PALETTE.length];
                    const { overtime, gross, net } = calcNet(emp);
                    const isPaid = emp.status === 'Paid';
                    return (
                      <tr key={emp.id} style={{ animationDelay: `${idx * 0.04}s` }}>
                        {/* Employee */}
                        <td>
                          <div className="pr-emp-cell">
                            <div className="pr-avatar" style={{ background: pal.bg, color: pal.color }}>{initials(emp.name)}</div>
                            <div>
                              <div className="pr-emp-name">{emp.name}</div>
                              <div className="pr-emp-role">{emp.role}</div>
                            </div>
                          </div>
                        </td>

                        {/* Branch */}
                        <td>
                          <span className={`pr-branch-pill ${emp.branch.includes('Mehdi') ? 'mehdi' : 'zangmo'}`}>
                            {emp.branch.includes('Mehdi') ? 'Mehdi' : 'Zangmo'}
                          </span>
                        </td>

                        {/* Basic Salary */}
                        <td>
                          <div className="pr-amount">{fmtPKR(emp.basicSalary)}</div>
                          {overtime > 0 && <div className="pr-amount-sub">+{fmtPKR(overtime)} OT</div>}
                        </td>

                        {/* Allowances */}
                        <td>
                          <div className="pr-amount" style={{ color: '#059669' }}>+{fmtPKR(emp.allowances)}</div>
                        </td>

                        {/* Deductions + Tax */}
                        <td>
                          <div className="pr-amount" style={{ color: '#dc2626' }}>−{fmtPKR((emp.deductions || 0) + (emp.tax || 0))}</div>
                          <div className="pr-amount-sub">{fmtPKR(emp.deductions)} ded. + {fmtPKR(emp.tax)} tax</div>
                        </td>

                        {/* Net Pay */}
                        <td>
                          <div className="pr-amount" style={{ fontSize: '15px' }}>{fmtPKR(net)}</div>
                          {isPaid && emp.paidOn && <div className="pr-amount-sub">Paid {emp.paidOn}</div>}
                        </td>

                        {/* Status */}
                        <td>
                          <span className={`pr-badge pr-badge-${emp.status.toLowerCase()}`}>
                            {emp.status === 'Paid' && <Ico.Check />}
                            {emp.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="pr-actions">
                            <button className="pr-btn-icon" title="View Pay Slip" onClick={() => viewSlip(emp)} id={`payroll-slip-${emp.id}`}>
                              <Ico.Receipt />
                            </button>
                            <button className="pr-btn-icon" title="Edit Record" onClick={() => openEdit(emp)} id={`payroll-edit-${emp.id}`}>
                              <Ico.Edit />
                            </button>
                            {!isPaid && (
                              <button className="pr-btn-pay" onClick={() => markPaid(emp.id)} id={`payroll-pay-${emp.id}`}>
                                Pay Now
                              </button>
                            )}
                            <button className="pr-btn-icon danger" title="Delete" onClick={() => deleteRecord(emp.id)} id={`payroll-del-${emp.id}`}>
                              <Ico.Trash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          Add / Edit Modal
          ═══════════════════════════════════════════ */}
      {modal.open && modal.data && (
        <div className="pr-overlay" onClick={e => e.target === e.currentTarget && setModal(m => ({ ...m, open: false }))}>
          <div className="pr-modal">
            <div className="pr-modal-head">
              <div>
                <h3 className="pr-modal-title">{modal.mode === 'add' ? 'Add Payroll Record' : `Edit — ${modal.data.name}`}</h3>
                <p className="pr-modal-sub">{modal.mode === 'add' ? "Fill in the staff member's salary details below." : 'Update the salary and payment details.'}</p>
              </div>
              <button className="pr-modal-close" onClick={() => setModal(m => ({ ...m, open: false }))}><Ico.X /></button>
            </div>

            <div className="pr-modal-body">
              {/* Personal Info */}
              <div className="pr-section-label">Personal &amp; Role</div>
              <div className="pr-form-grid">
                <div className="pr-form-field">
                  <label className="pr-label">Full Name</label>
                  <input className="pr-input" placeholder="e.g. Tandin Dorji" value={modal.data.name} onChange={e => fieldChange('name', e.target.value)} id="modal-name" />
                </div>
                <div className="pr-form-field">
                  <label className="pr-label">Job Role</label>
                  <input className="pr-input" placeholder="e.g. Head Chef" value={modal.data.role} onChange={e => fieldChange('role', e.target.value)} id="modal-role" />
                </div>
                <div className="pr-form-field">
                  <label className="pr-label">Branch</label>
                  <select className="pr-fselect" value={modal.data.branch} onChange={e => fieldChange('branch', e.target.value)} id="modal-branch">
                    <option value="Mehdi Kitchen (Main)">Mehdi Kitchen (Main)</option>
                    <option value="Zangmo Kitchen">Zangmo Kitchen</option>
                  </select>
                </div>
                <div className="pr-form-field">
                  <label className="pr-label">Pay Month</label>
                  <select className="pr-fselect" value={modal.data.month} onChange={e => fieldChange('month', e.target.value)} id="modal-month">
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <hr className="pr-divider" />

              {/* Salary Breakdown */}
              <div className="pr-section-label">Salary Components</div>
              <div className="pr-form-grid">
                <div className="pr-form-field">
                  <label className="pr-label">Basic Salary (Rs.)</label>
                  <input className="pr-input" type="number" min="0" placeholder="e.g. 75000" value={modal.data.basicSalary} onChange={e => fieldChange('basicSalary', Number(e.target.value))} id="modal-basic" />
                </div>
                <div className="pr-form-field">
                  <label className="pr-label">Allowances (Rs.)</label>
                  <input className="pr-input" type="number" min="0" placeholder="e.g. 8000" value={modal.data.allowances} onChange={e => fieldChange('allowances', Number(e.target.value))} id="modal-allowances" />
                </div>
                <div className="pr-form-field">
                  <label className="pr-label">Overtime Hours</label>
                  <input className="pr-input" type="number" min="0" placeholder="e.g. 12" value={modal.data.overtimeHours} onChange={e => fieldChange('overtimeHours', Number(e.target.value))} id="modal-ot-hrs" />
                </div>
                <div className="pr-form-field">
                  <label className="pr-label">Overtime Rate (Rs./hr)</label>
                  <input className="pr-input" type="number" min="0" placeholder="e.g. 450" value={modal.data.overtimeRate} onChange={e => fieldChange('overtimeRate', Number(e.target.value))} id="modal-ot-rate" />
                </div>
                <div className="pr-form-field">
                  <label className="pr-label">Deductions (Rs.)</label>
                  <input className="pr-input" type="number" min="0" placeholder="e.g. 3500" value={modal.data.deductions} onChange={e => fieldChange('deductions', Number(e.target.value))} id="modal-deductions" />
                </div>
                <div className="pr-form-field">
                  <label className="pr-label">Income Tax (Rs.)</label>
                  <input className="pr-input" type="number" min="0" placeholder="e.g. 4200" value={modal.data.tax} onChange={e => fieldChange('tax', Number(e.target.value))} id="modal-tax" />
                </div>
              </div>

              <hr className="pr-divider" />

              {/* Live Breakdown */}
              <div className="pr-section-label">Live Pay Breakdown</div>
              <div className="pr-breakdown">
                <div className="pr-breakdown-row">
                  <span className="lbl">Basic Salary</span>
                  <span className="val">{fmtPKR(modal.data.basicSalary)}</span>
                </div>
                {(modal.data.overtimeHours > 0) && (
                  <div className="pr-breakdown-row">
                    <span className="lbl">Overtime ({modal.data.overtimeHours} hrs × Rs. {modal.data.overtimeRate})</span>
                    <span className="val green">+{fmtPKR(modalCalc.overtime)}</span>
                  </div>
                )}
                <div className="pr-breakdown-row">
                  <span className="lbl">Allowances</span>
                  <span className="val green">+{fmtPKR(modal.data.allowances)}</span>
                </div>
                <div className="pr-breakdown-row">
                  <span className="lbl">Deductions</span>
                  <span className="val red">−{fmtPKR(modal.data.deductions)}</span>
                </div>
                <div className="pr-breakdown-row">
                  <span className="lbl">Income Tax</span>
                  <span className="val red">−{fmtPKR(modal.data.tax)}</span>
                </div>
                <div className="pr-breakdown-row pr-breakdown-total">
                  <span className="lbl">Net Pay</span>
                  <span className="val">{fmtPKR(modalCalc.net)}</span>
                </div>
              </div>

              <hr className="pr-divider" />

              {/* Status + Notes */}
              <div className="pr-form-grid">
                <div className="pr-form-field">
                  <label className="pr-label">Payment Status</label>
                  <select className="pr-fselect" value={modal.data.status} onChange={e => fieldChange('status', e.target.value)} id="modal-status">
                    <option value="Draft">Draft</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
                <div className="pr-form-field">
                  <label className="pr-label">Hours Worked</label>
                  <input className="pr-input" type="number" min="0" max="744" placeholder="e.g. 192" value={modal.data.hoursWorked} onChange={e => fieldChange('hoursWorked', Number(e.target.value))} id="modal-hours" />
                </div>
                <div className="pr-form-field span2">
                  <label className="pr-label">Notes / Remarks</label>
                  <textarea className="pr-textarea" placeholder="Any notes about this pay period…" value={modal.data.notes} onChange={e => fieldChange('notes', e.target.value)} id="modal-notes" />
                </div>
              </div>
            </div>

            <div className="pr-modal-footer">
              <button className="pr-btn-cancel" onClick={() => setModal(m => ({ ...m, open: false }))}>Cancel</button>
              <button className="pr-btn-save" onClick={saveModal} id="modal-save-btn">
                <Ico.Check /> {modal.mode === 'add' ? 'Add Record' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          Pay Slip Modal
          ═══════════════════════════════════════════ */}
      {slipModal.open && slipModal.emp && (() => {
        const emp = slipModal.emp;
        const { overtime, gross, net } = calcNet(emp);
        const pal = PALETTE[0];
        return (
          <div className="pr-overlay" onClick={e => e.target === e.currentTarget && setSlipModal({ open: false, emp: null })}>
            <div className="pr-modal" style={{ maxWidth: '480px' }}>
              <div className="pr-modal-head">
                <div>
                  <h3 className="pr-modal-title">Pay Slip</h3>
                  <p className="pr-modal-sub">{emp.name} — {emp.month}</p>
                </div>
                <button className="pr-modal-close" onClick={() => setSlipModal({ open: false, emp: null })}><Ico.X /></button>
              </div>
              <div className="pr-modal-body" style={{ padding: 0 }}>
                <div className="pr-slip">
                  {/* Header */}
                  <div className="pr-slip-head">
                    <div>
                      <div className="pr-slip-brand">Zangmo &amp; Mehdi Kitchen</div>
                      <div className="pr-slip-sub">Official Salary Statement</div>
                    </div>
                    <div className="pr-slip-title">PAY SLIP</div>
                  </div>

                  {/* Meta */}
                  <div className="pr-slip-meta">
                    <div className="pr-slip-meta-item"><span className="k">Employee Name</span><span className="v">{emp.name}</span></div>
                    <div className="pr-slip-meta-item"><span className="k">Pay Period</span><span className="v">{emp.month}</span></div>
                    <div className="pr-slip-meta-item"><span className="k">Job Role</span><span className="v">{emp.role}</span></div>
                    <div className="pr-slip-meta-item"><span className="k">Branch</span><span className="v">{emp.branch}</span></div>
                    <div className="pr-slip-meta-item"><span className="k">Hours Worked</span><span className="v">{emp.hoursWorked} hrs</span></div>
                    <div className="pr-slip-meta-item"><span className="k">Payment Status</span><span className="v" style={{ color: emp.status === 'Paid' ? '#059669' : '#d97706' }}>{emp.status}</span></div>
                  </div>

                  {/* Earnings */}
                  <div className="pr-slip-section">
                    <div className="pr-slip-section-title">Earnings</div>
                    <div className="pr-slip-row"><span>Basic Salary</span><span style={{ fontWeight: 700 }}>{fmtPKR(emp.basicSalary)}</span></div>
                    <div className="pr-slip-row"><span>Allowances</span><span style={{ fontWeight: 700, color: '#059669' }}>+{fmtPKR(emp.allowances)}</span></div>
                    {overtime > 0 && <div className="pr-slip-row"><span>Overtime ({emp.overtimeHours} hrs × Rs. {emp.overtimeRate})</span><span style={{ fontWeight: 700, color: '#059669' }}>+{fmtPKR(overtime)}</span></div>}
                    <div className="pr-slip-row" style={{ borderTop: '1px solid #e0e3e6', paddingTop: '8px', marginTop: '4px' }}>
                      <span style={{ fontWeight: 700 }}>Gross Pay</span>
                      <span style={{ fontWeight: 700 }}>{fmtPKR(gross)}</span>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="pr-slip-section">
                    <div className="pr-slip-section-title">Deductions</div>
                    <div className="pr-slip-row"><span>Deductions</span><span style={{ fontWeight: 700, color: '#dc2626' }}>−{fmtPKR(emp.deductions)}</span></div>
                    <div className="pr-slip-row"><span>Income Tax</span><span style={{ fontWeight: 700, color: '#dc2626' }}>−{fmtPKR(emp.tax)}</span></div>
                    <div className="pr-slip-row" style={{ borderTop: '1px solid #e0e3e6', paddingTop: '8px', marginTop: '4px' }}>
                      <span style={{ fontWeight: 700 }}>Total Deductions</span>
                      <span style={{ fontWeight: 700, color: '#dc2626' }}>−{fmtPKR((emp.deductions || 0) + (emp.tax || 0))}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  {emp.notes && (
                    <div className="pr-slip-section" style={{ paddingBottom: '12px' }}>
                      <div className="pr-slip-section-title">Remarks</div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>{emp.notes}</p>
                    </div>
                  )}

                  {/* Total */}
                  <div className="pr-slip-total">
                    <div>
                      <div className="pr-slip-total-lbl">Net Pay for {emp.month}</div>
                      {emp.paidOn && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Paid on {emp.paidOn}</div>}
                    </div>
                    <div className="pr-slip-total-val">{fmtPKR(net)}</div>
                  </div>
                </div>
              </div>
              <div className="pr-modal-footer">
                <button className="pr-btn-cancel" onClick={() => setSlipModal({ open: false, emp: null })}>Close</button>
                <button className="pr-btn-save" onClick={() => { window.print(); showToast(`Pay slip for ${emp.name} sent to printer.`); }} id={`slip-print-${emp.id}`}>
                  <Ico.Download /> Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Toast ── */}
      {toast.show && (
        <div className={`pr-toast pr-toast-${toast.type}`}>
          {toast.type === 'success' ? <Ico.CheckCircle /> : <Ico.XCircle />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
