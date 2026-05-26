// f:\antigravityprojects\zangmo\frontend\src\pages\admin\AdminCreditJournal.jsx
import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/users.css';

/* ─────────────────────────────────────────────────────────────────
   Inline styles - Premium Z&M Kitchen design matching project themes
   ───────────────────────────────────────────────────────────────── */
const SCOPED_STYLES = `
  @keyframes j-fadeUp {
    from { opacity: 0; transform: translateY(15px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes j-toast {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes j-dial-shake {
    0%, 100% { transform: rotate(0deg); }
    15%, 45%, 75% { transform: rotate(-5deg); }
    30%, 60%, 90% { transform: rotate(5deg); }
  }

  .j-layout {
    animation: j-fadeUp 0.35s ease both;
  }

  /* ── Header actions ── */
  .j-hdr-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .j-btn-sec {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 16px;
    border-radius: 7px;
    border: 1px solid #cbd5e1;
    background: #f8fafc;
    color: #334155;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .j-btn-sec:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
    color: #1e293b;
  }
  .j-btn-prim {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 18px;
    border-radius: 7px;
    border: none;
    background: #fc8f34;
    color: white;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.18s ease;
  }
  .j-btn-prim:hover {
    background: #e0771b;
    box-shadow: 0 4px 12px rgba(252,143,52,0.25);
  }

  /* ── KPI Grid ── */
  .j-kpis {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
  .j-kpi {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    transition: all 0.22s ease;
    position: relative;
    overflow: hidden;
  }
  .j-kpi:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  }
  .j-kpi-lbl {
    font-size: 10.5px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .j-kpi-val-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .j-kpi-val {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    letter-spacing: -0.02em;
    margin: 0;
  }
  .j-kpi-trend {
    font-size: 11px;
    font-weight: 700;
  }
  .j-kpi-trend.up { color: #10b981; }
  .j-kpi-trend.down { color: #ef4444; }
  .j-kpi-sub {
    font-size: 11px;
    color: #94a3b8;
    margin: 0;
    font-weight: 500;
  }
  .j-kpi.highlight {
    background: #162839;
    border-color: #162839;
    color: white;
  }
  .j-kpi.highlight .j-kpi-lbl { color: #94a3b8; }
  .j-kpi.highlight .j-kpi-val { color: white; }
  .j-kpi.highlight .j-kpi-sub { color: #64748b; }

  /* ── Tab Bar ── */
  .j-tabs-wrapper {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 10px 10px 0 0;
    border-bottom: none;
    padding: 0 16px;
    display: flex;
    gap: 8px;
  }
  .j-tab {
    padding: 16px 20px;
    background: transparent;
    border: none;
    font-size: 13px;
    font-weight: 700;
    color: #64748b;
    cursor: pointer;
    position: relative;
    transition: all 0.15s ease;
    font-family: 'Inter', sans-serif;
  }
  .j-tab:hover {
    color: #1e293b;
  }
  .j-tab.active {
    color: #162839;
  }
  .j-tab.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #fc8f34;
    border-radius: 3px 3px 0 0;
  }

  /* ── Toolbar ── */
  .j-toolbar {
    background: white;
    border: 1px solid #e2e8f0;
    border-top: 1px solid #f1f5f9;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .j-search {
    flex: 1;
    min-width: 180px;
    max-width: 280px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 7px;
    padding: 8px 12px;
  }
  .j-search input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    color: #1e293b;
    width: 100%;
  }
  .j-search input::placeholder { color: #94a3b8; }

  .j-select {
    padding: 8px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 7px;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    color: #475569;
    background: white;
    cursor: pointer;
    outline: none;
  }
  .j-select:focus { border-color: #fc8f34; }

  .j-select-branch {
    padding: 9px 16px;
    border-radius: 7px;
    border: 1px solid #cbd5e1;
    background: #f8fafc;
    color: #334155;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    outline: none;
    height: 38px;
    transition: all 0.15s ease;
  }
  .j-select-branch:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
    color: #1e293b;
  }
  .j-select-branch:focus {
    border-color: #fc8f34;
    box-shadow: 0 0 0 2px rgba(252,143,52,0.15);
  }

  .j-toolbar-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .j-count {
    font-size: 12.5px;
    font-weight: 600;
    color: #94a3b8;
  }

  /* ── Ledger Table ── */
  .j-table-wrap {
    background: white;
    border: 1px solid #e2e8f0;
    border-top: none;
    border-radius: 0 0 10px 10px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  }
  table.j-table {
    width: 100%;
    border-collapse: collapse;
  }
  table.j-table thead th {
    padding: 12px 18px;
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }
  table.j-table tbody tr {
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.15s;
  }
  table.j-table tbody tr:hover {
    background: #f8fafc;
  }
  table.j-table tbody tr:last-child {
    border-bottom: none;
  }
  table.j-table td {
    padding: 14px 18px;
    font-size: 13px;
    color: #334155;
    vertical-align: middle;
  }

  .j-avatar {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .j-party-cell { display: flex; align-items: center; gap: 10px; }
  .j-party-name { font-weight: 700; color: #162839; font-size: 13.5px; }
  .j-party-sub { font-size: 11px; color: #94a3b8; font-weight: 500; margin-top: 1px; }

  /* Aging Pills */
  .j-aging-pill {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #cbd5e1;
  }
  .j-aging-pill.current { background: #ecfdf5; color: #065f46; border-color: #a7f3d0; }
  .j-aging-pill.thirty  { background: #eff6ff; color: #1e40af; border-color: #bfdbfe; }
  .j-aging-pill.sixty   { background: #fff7ed; color: #c2410c; border-color: #fed7aa; }
  .j-aging-pill.ninety  { background: #fef2f2; color: #991b1b; border-color: #fecaca; }

  /* Status Badges */
  .j-badge-settled { color: #059669; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }

  .j-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .j-btn-action {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    background: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    transition: all 0.15s ease;
  }
  .j-btn-action:hover {
    border-color: #fc8f34;
    color: #fc8f34;
    background: #fffcf9;
  }
  .j-btn-action.danger:hover {
    border-color: #ef4444;
    color: #ef4444;
    background: #fef2f2;
  }

  /* ── Pagination ── */
  .j-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border-top: 1px solid #e2e8f0;
    background: white;
  }
  .j-pag-info {
    font-size: 12.5px;
    color: #64748b;
    font-weight: 500;
  }
  .j-pag-btns {
    display: flex;
    gap: 6px;
  }
  .j-pag-btn {
    min-width: 32px;
    height: 32px;
    padding: 0 6px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    font-family: 'Inter', sans-serif;
  }
  .j-pag-btn:hover:not(:disabled) {
    border-color: #fc8f34;
    color: #fc8f34;
    background: #fffcf9;
  }
  .j-pag-btn.active {
    background: #162839;
    color: white;
    border-color: #162839;
  }
  .j-pag-btn:disabled {
    color: #cbd5e1;
    cursor: not-allowed;
    background: #f8fafc;
  }

  /* ── Insights & Follow-up Section ── */
  .j-bottom-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 24px;
  }
  .j-widget {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 22px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  }
  .j-widget-title {
    font-size: 15px;
    font-weight: 700;
    color: #162839;
    margin: 0 0 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .j-widget-title svg { color: #f59e0b; }
  .j-follow-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .j-follow-card {
    border-left: 4px solid #ef4444;
    background: #fef2f2;
    border-radius: 0 6px 6px 0;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .j-follow-info { display: flex; flex-direction: column; gap: 3px; }
  .j-follow-name { font-weight: 700; color: #162839; font-size: 13.5px; }
  .j-follow-detail { font-size: 11px; color: #991b1b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
  .j-follow-btn {
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    background: #1e293b;
    color: white;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.15s ease;
  }
  .j-follow-btn:hover { background: #0f172a; box-shadow: 0 2px 6px rgba(15,23,42,0.2); }

  .j-insights-desc {
    font-size: 13px;
    color: #475569;
    line-height: 1.6;
    margin: 0 0 16px;
  }
  .j-goal-bar-wrap {
    background: #f1f5f9;
    border-radius: 10px;
    height: 16px;
    position: relative;
    overflow: hidden;
    margin-bottom: 8px;
  }
  .j-goal-bar {
    background: linear-gradient(90deg, #f59e0b 0%, #fc8f34 100%);
    height: 100%;
    border-radius: 10px;
    transition: width 0.4s ease;
  }
  .j-goal-lbls {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .j-insights-link {
    font-size: 13px;
    font-weight: 700;
    color: #fc8f34;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: color 0.15s;
  }
  .j-insights-link:hover { color: #e0771b; text-decoration: underline; }

  /* ── Modals ── */
  .j-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1200;
    padding: 24px;
  }
  .j-modal {
    background: white;
    border-radius: 12px;
    width: 100%;
    max-width: 520px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3);
    animation: j-fadeUp 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .j-modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px;
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
  }
  .j-modal-title {
    font-size: 15px;
    font-weight: 700;
    color: #162839;
    margin: 0;
  }
  .j-modal-sub {
    font-size: 11.5px;
    color: #64748b;
    margin: 2px 0 0;
  }
  .j-modal-close {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    transition: all 0.15s;
  }
  .j-modal-close:hover {
    background: #fef2f2;
    border-color: #fecaca;
    color: #ef4444;
  }
  .j-modal-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .j-fld-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .j-fld {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .j-lbl {
    font-size: 11px;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .j-lbl span { color: #ef4444; }
  .j-inp, .j-sel, .j-txt {
    padding: 9px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 7px;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    color: #1e293b;
    outline: none;
    background: white;
    box-sizing: border-box;
    width: 100%;
    transition: all 0.15s;
  }
  .j-inp:focus, .j-sel:focus, .j-txt:focus {
    border-color: #fc8f34;
    box-shadow: 0 0 0 3px rgba(252,143,52,0.1);
  }
  .j-txt { resize: vertical; min-height: 60px; }
  .j-modal-foot {
    padding: 14px 24px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    background: #f8fafc;
    border-radius: 0 0 12px 12px;
  }

  /* Dialer simulation */
  .j-dialer-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 24px 0 10px;
  }
  .j-dial-phone-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #fff7ed;
    color: #fc8f34;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fed7aa;
  }
  .j-dial-phone-avatar.calling {
    animation: j-dial-shake 0.5s infinite;
    background: #ecfdf5;
    color: #10b981;
    border-color: #a7f3d0;
  }
  .j-dial-num {
    font-size: 20px;
    font-weight: 700;
    color: #162839;
    letter-spacing: 0.05em;
  }
  .j-dial-status {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #fc8f34;
  }
  .j-dial-status.connected { color: #10b981; }
  .j-dial-btn-hang {
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 30px;
    padding: 10px 24px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
  }
  .j-dial-btn-hang:hover { background: #dc2626; }

  /* ── Toasts ── */
  .j-toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2000;
    background: #1e293b;
    color: white;
    padding: 12px 18px;
    border-radius: 8px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    font-weight: 600;
    animation: j-toast 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .j-toast.success { border-left: 4px solid #10b981; }
  .j-toast.success svg { color: #10b981; }
  .j-toast.error { border-left: 4px solid #ef4444; }
  .j-toast.error svg { color: #ef4444; }

  /* ── Responsive ── */
  @media(max-width: 1024px) {
    .j-kpis { grid-template-columns: repeat(2, 1fr); }
    .j-bottom-grid { grid-template-columns: 1fr; }
  }
  @media(max-width: 640px) {
    .j-kpis { grid-template-columns: 1fr; }
    .j-fld-grid { grid-template-columns: 1fr; }
  }
`;

/* ── SVG Icons map ── */
const Ico = {
  Alert: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Check: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>,
  ChevronLeft: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>,
  Phone: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Plus: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Receipt: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Trash: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  X: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Pay: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  DoubleChevronRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
};

/* ── Helpers ── */
function initials(name) {
  return (name || '').trim().split(' ').filter(Boolean).map(w => w[0]).join('').substring(0, 2).toUpperCase() || '??';
}

function fmtPKR(val) {
  if (val === undefined || val === null) return 'Rs. 0';
  return `Rs. ${Number(val).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const PALETTE = [
  { bg: '#dbeafe', color: '#1e40af' },
  { bg: '#ffedd5', color: '#c2410c' },
  { bg: '#fee2e2', color: '#991b1b' },
  { bg: '#e0e7ff', color: '#4338ca' },
  { bg: '#ecfdf5', color: '#065f46' },
  { bg: '#fef3c7', color: '#92400e' },
  { bg: '#f3e8ff', color: '#6b21a8' },
  { bg: '#e0f2fe', color: '#0369a1' },
];

/* ── Default mockup data ── */
const DEFAULT_JOURNALS = [
  { id: 1, type: 'receivable', party: 'Global Hotels Group', reference: 'ORD-2023-8812', contractId: '#4492', amount: 12450.00, settledAmount: 8000.00, branch: 'Mehdi Kitchen (Main)', aging: '30 Days', date: '2026-04-26', notes: 'Monthly corporate lunch hosting contract.' },
  { id: 2, type: 'receivable', party: 'Skyline Cafe & Bistro', reference: 'ORD-2023-9004', contractId: '#1021', amount: 4200.00, settledAmount: 0.00, branch: 'Mehdi Kitchen (Main)', aging: '60 Days', date: '2026-03-27', notes: 'Delivery catering setup.' },
  { id: 3, type: 'receivable', party: 'Elite Events LLC', reference: 'ORD-2023-7712', contractId: '#0056', amount: 9800.00, settledAmount: 1200.00, branch: 'Zangmo Kitchen', aging: '90+ Days', date: '2026-02-15', notes: 'Urgent follow-up requested. Extended term.' },
  { id: 4, type: 'receivable', party: 'Blue Bottle Coffee', reference: 'ORD-2023-9110', contractId: '#3321', amount: 1500.00, settledAmount: 1500.00, branch: 'Zangmo Kitchen', aging: 'Current', date: '2026-05-20', notes: 'Completed payment. Settled on delivery.' },
  { id: 5, type: 'receivable', party: 'Z-Global Partners', reference: 'ORD-2023-7049', contractId: '#0194', amount: 4800.00, settledAmount: 2400.00, branch: 'Mehdi Kitchen (Main)', aging: '90+ Days', date: '2026-02-10', notes: 'Partial payment received. Awaiting remaining.' },
  { id: 6, type: 'receivable', party: 'Apex Media Corp', reference: 'ORD-2023-9134', contractId: '#0921', amount: 6700.00, settledAmount: 0.00, branch: 'Mehdi Kitchen (Main)', aging: 'Current', date: '2026-05-24', notes: 'Fresh credit window issued.' },
  { id: 7, type: 'payble', party: 'Organic Spice Co.', reference: 'INV-2026-0044', contractId: '#V-882', amount: 8500.00, settledAmount: 5000.00, branch: 'Mehdi Kitchen (Main)', aging: '30 Days', date: '2026-04-26', notes: 'Batch import of special organic ingredients.' },
  { id: 8, type: 'payble', party: 'Al-Baraka Meats', reference: 'INV-2026-0091', contractId: '#V-102', amount: 15200.00, settledAmount: 10000.00, branch: 'Mehdi Kitchen (Main)', aging: '30 Days', date: '2026-04-25', notes: 'Weekly raw meat supply invoice.' },
  { id: 9, type: 'payble', party: 'Kitchen Equip Ltd.', reference: 'INV-2026-0021', contractId: '#V-024', amount: 9500.00, settledAmount: 9500.00, branch: 'Zangmo Kitchen', aging: 'Current', date: '2026-05-18', notes: 'Blender and grinder repairs and spares.' },
  { id: 10, type: 'payble', party: 'Saffron Wholesale', reference: 'INV-2026-0105', contractId: '#V-771', amount: 4800.00, settledAmount: 0.00, branch: 'Zangmo Kitchen', aging: '60 Days', date: '2026-03-24', notes: 'Premium saffron supplier invoice.' },
];

export default function AdminCreditJournal() {
  /* ── LocalStorage persistence ── */
  const [journals, setJournals] = useState(() => {
    const saved = localStorage.getItem('zangmo_credit_journal');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_JOURNALS;
  });

  useEffect(() => {
    localStorage.setItem('zangmo_credit_journal', JSON.stringify(journals));
  }, [journals]);

  /* ── Core states ── */
  const [activeTab, setActiveTab] = useState('receivable'); // 'receivable' (Receivables) vs 'payble' (Payables)
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Pagination states
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Modals state
  const [modal, setModal] = useState({ open: false, mode: 'add', type: 'receivable', data: null });
  const [settleModal, setSettleModal] = useState({ open: false, data: null, payAmt: '' });
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });

  // Dialer Widget simulation state
  const [dialer, setDialer] = useState({ open: false, name: '', amount: '', phone: '', status: 'Calling...' });

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  /* ── Totals Calculation ── */
  // Toolbar branch filter rules
  const branchFiltered = journals.filter(j => branchFilter === 'All' || j.branch === branchFilter);

  const totalReceivables = branchFiltered
    .filter(j => j.type === 'receivable')
    .reduce((sum, j) => sum + (j.amount - j.settledAmount), 0);

  const totalPayables = branchFiltered
    .filter(j => j.type === 'payble')
    .reduce((sum, j) => sum + (j.amount - j.settledAmount), 0);

  const netCreditPosition = totalReceivables - totalPayables;

  const overdueReceivables = branchFiltered
    .filter(j => j.type === 'receivable' && j.aging === '90+ Days')
    .reduce((sum, j) => sum + (j.amount - j.settledAmount), 0);

  /* ── Table Filtering ── */
  const tableFiltered = branchFiltered.filter(j => {
    // Tab filter
    if (j.type !== activeTab) return false;

    // Search query filter
    const q = search.toLowerCase();
    const matchesSearch = !q || j.party.toLowerCase().includes(q) || j.reference.toLowerCase().includes(q) || (j.contractId && j.contractId.toLowerCase().includes(q));

    // Status filter
    const balance = j.amount - j.settledAmount;
    let status = 'Unpaid';
    if (balance === 0) status = 'Settled';
    else if (j.settledAmount > 0) status = 'Partial';

    const matchesStatus = statusFilter === 'All' || statusFilter === status;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(tableFiltered.length / pageSize));
  useEffect(() => {
    // Reset page if it exceeds total pages
    if (page > totalPages) setPage(totalPages);
  }, [tableFiltered, totalPages]);

  const paginatedList = tableFiltered.slice((page - 1) * pageSize, page * pageSize);

  /* ── Operations CRUD ── */
  const openAdd = (type) => {
    setModal({
      open: true,
      mode: 'add',
      type,
      data: {
        id: Date.now(),
        type,
        party: '',
        reference: type === 'receivable' ? 'ORD-2026-' + Math.floor(1000 + Math.random() * 9000) : 'INV-2026-' + Math.floor(100 + Math.random() * 900),
        contractId: '#' + Math.floor(1000 + Math.random() * 9000),
        amount: '',
        settledAmount: 0,
        branch: branchFilter === 'All' ? 'Mehdi Kitchen (Main)' : branchFilter,
        aging: 'Current',
        date: new Date().toISOString().substring(0, 10),
        notes: '',
      }
    });
  };

  const openEdit = (j) => {
    setModal({
      open: true,
      mode: 'edit',
      type: j.type,
      data: { ...j }
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const d = modal.data;
    if (!d.party.trim() || !d.amount || Number(d.amount) <= 0) {
      showToast('Please enter a valid party name and total amount.', 'error');
      return;
    }

    const amt = Number(d.amount);
    const setl = Number(d.settledAmount || 0);

    if (setl > amt) {
      showToast('Settled amount cannot exceed total amount.', 'error');
      return;
    }

    // Determine Aging automatically based on Date difference if desired, or let it default
    let calculatedAging = d.aging || 'Current';
    if (modal.mode === 'add') {
      calculatedAging = 'Current';
    }

    const updated = {
      ...d,
      amount: amt,
      settledAmount: setl,
      aging: calculatedAging
    };

    if (modal.mode === 'add') {
      setJournals(prev => [updated, ...prev]);
      showToast(`Record for ${d.party} added successfully.`);
    } else {
      setJournals(prev => prev.map(item => item.id === d.id ? updated : item));
      showToast(`Record for ${d.party} updated.`);
    }

    setModal({ open: false, mode: 'add', type: 'receivable', data: null });
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the journal record for "${name}"?`)) return;
    setJournals(prev => prev.filter(j => j.id !== id));
    showToast(`Journal record for "${name}" deleted.`, 'error');
  };

  // Quick Settlement Modal
  const openSettle = (j) => {
    const bal = j.amount - j.settledAmount;
    setSettleModal({
      open: true,
      data: j,
      payAmt: bal.toString()
    });
  };

  const handleSettle = (e) => {
    e.preventDefault();
    const { data, payAmt } = settleModal;
    const payment = Number(payAmt);
    const balance = data.amount - data.settledAmount;

    if (isNaN(payment) || payment <= 0) {
      showToast('Please enter a valid positive payment amount.', 'error');
      return;
    }

    if (payment > balance) {
      showToast(`Payment amount cannot exceed the remaining balance of Rs. ${balance}.`, 'error');
      return;
    }

    setJournals(prev => prev.map(item => {
      if (item.id === data.id) {
        const newSettled = item.settledAmount + payment;
        return {
          ...item,
          settledAmount: newSettled,
          notes: item.notes + `\n[Payment recorded: ${fmtPKR(payment)} on ${new Date().toLocaleDateString()}]`
        };
      }
      return item;
    }));

    showToast(`Recorded payment of ${fmtPKR(payment)} for ${data.party}.`);
    setSettleModal({ open: false, data: null, payAmt: '' });
  };

  /* Dialer simulation call */
  const triggerCall = (partyName, amtText, phone = '+92 300 1234567') => {
    setDialer({
      open: true,
      name: partyName,
      amount: amtText,
      phone,
      status: 'Connecting...'
    });

    // Simulate ring and pickup
    setTimeout(() => {
      setDialer(d => ({ ...d, status: 'Ringing...' }));
    }, 1500);

    setTimeout(() => {
      setDialer(d => ({ ...d, status: 'Active Call (0:01)' }));
      // Start seconds counter
      let sec = 1;
      const interval = setInterval(() => {
        setDialer(d => {
          if (d.status.startsWith('Active Call')) {
            const minStr = Math.floor(sec / 60);
            const secStr = sec % 60 < 10 ? '0' + (sec % 60) : sec % 60;
            sec++;
            return { ...d, status: `Active Call (${minStr}:${secStr})` };
          } else {
            clearInterval(interval);
            return d;
          }
        });
      }, 1000);
    }, 3500);
  };

  /* ── Follow-up list filtering (Receivables with high aging / overdue balances) ── */
  /* Dynamic Insights calculation based on branch selection */
  const getBranchInsights = () => {
    switch (branchFilter) {
      case 'Mehdi Kitchen (Main)':
        return {
          avgDays: 35,
          percent: 85,
          desc: 'Mehdi Kitchen collection cycle is at a stable 35-day average, showing solid improvement in raw material credit clearance.',
          target: 30
        };
      case 'Zangmo Kitchen':
        return {
          avgDays: 42,
          percent: 71,
          desc: 'Zangmo Kitchen has a 42-day collection average. Follow-ups on critical event package contracts are recommended.',
          target: 30
        };
      case 'All':
      default:
        return {
          avgDays: 38,
          percent: 78,
          desc: 'Current collection cycle average: 38 days. This is a 4-day improvement from last quarter. Excellent work on matching target credit deadlines.',
          target: 30
        };
    }
  };

  const insights = getBranchInsights();

  /* ── Follow-up list filtering (Receivables with high aging / overdue balances) ── */
  const urgentFollowups = branchFiltered
    .filter(j => j.type === 'receivable' && (j.aging === '90+ Days' || j.aging === '60 Days') && (j.amount - j.settledAmount) > 0)
    .slice(0, 2);

  return (
    <div className="dashboard">
      <style>{SCOPED_STYLES}</style>
      <AdminSidebar activePage="journal" />

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Topbar title="Credit Journal" />

        <div className="page-content j-layout" style={{ overflowY: 'auto', background: '#f7f9fc' }}>
          {/* Header Description & Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#162839', margin: 0 }}>Ledger Analytics & Overview</h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Real-time updates of client dues and supplier payables.</p>
            </div>
            <div className="j-hdr-actions">
              <select
                className="j-select-branch"
                value={branchFilter}
                onChange={e => {
                  setBranchFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">All Branches</option>
                <option value="Mehdi Kitchen (Main)">Mehdi Kitchen</option>
                <option value="Zangmo Kitchen">Zangmo Kitchen</option>
              </select>

              <button className="j-btn-sec" onClick={() => openAdd('payble')}>
                <Ico.Plus /> Add Vendor Invoice
              </button>
              <button className="j-btn-prim" onClick={() => openAdd('receivable')}>
                <Ico.Plus /> Record Customer Credit
              </button>
            </div>
          </div>

          {/* ── KPI Grid ── */}
          <div className="j-kpis">
            <div className="j-kpi">
              <span className="j-kpi-lbl">Total Receivables</span>
              <div className="j-kpi-val-row">
                <p className="j-kpi-val">{fmtPKR(totalReceivables).split('.')[0]}</p>
                <span className="j-kpi-trend up">+5.2%</span>
              </div>
              <p className="j-kpi-sub">Outstanding customer dues</p>
            </div>
            <div className="j-kpi">
              <span className="j-kpi-lbl">Total Payables</span>
              <div className="j-kpi-val-row">
                <p className="j-kpi-val">{fmtPKR(totalPayables).split('.')[0]}</p>
                <span className="j-kpi-trend down">-12%</span>
              </div>
              <p className="j-kpi-sub">Outstanding vendor invoices</p>
            </div>
            <div className="j-kpi">
              <span className="j-kpi-lbl">Overdue (90+ Days)</span>
              <div className="j-kpi-val-row">
                <p className="j-kpi-val" style={{ color: '#ef4444' }}>{fmtPKR(overdueReceivables).split('.')[0]}</p>
              </div>
              <p className="j-kpi-sub">Critical receivables recovery</p>
            </div>
            <div className="j-kpi highlight">
              <span className="j-kpi-lbl">Net Credit Position</span>
              <div className="j-kpi-val-row">
                <p className="j-kpi-val">{netCreditPosition >= 0 ? '+' : ''}{fmtPKR(netCreditPosition).split('.')[0]}</p>
              </div>
              <p className="j-kpi-sub">Overall ledger liquidity</p>
            </div>
          </div>

          {/* ── Tab Switcher ── */}
          <div className="j-tabs-wrapper">
            <button className={`j-tab${activeTab === 'payble' ? ' active' : ''}`} onClick={() => { setActiveTab('payble'); setPage(1); }}>
              Payables (Vendor)
            </button>
            <button className={`j-tab${activeTab === 'receivable' ? ' active' : ''}`} onClick={() => { setActiveTab('receivable'); setPage(1); }}>
              Receivables (Customer)
            </button>
          </div>

          {/* ── Toolbar Filters ── */}
          <div className="j-toolbar">
            <div className="j-search">
              <Ico.Search />
              <input
                placeholder={activeTab === 'receivable' ? 'Search customer or order…' : 'Search vendor or invoice…'}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <select className="j-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Partial">Partial Dues</option>
              <option value="Settled">Settled</option>
            </select>

            <div className="j-toolbar-right">
              <span className="j-count">{tableFiltered.length} journal record{tableFiltered.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* ── Ledger Table ── */}
          <div className="j-table-wrap">
            {paginatedList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', color: '#64748b' }}>
                <Ico.Receipt />
                <h3 style={{ margin: '12px 0 6px', color: '#162839', fontSize: '15px', fontWeight: '700' }}>No journal entries found</h3>
                <p style={{ margin: 0, fontSize: '13px' }}>No records match your filters or search keywords.</p>
              </div>
            ) : (
              <table className="j-table">
                <thead>
                  <tr>
                    <th>{activeTab === 'receivable' ? 'Customer' : 'Vendor'}</th>
                    <th>{activeTab === 'receivable' ? 'Order #' : 'Invoice #'}</th>
                    <th>Total Amount</th>
                    <th>Aging</th>
                    <th>Settled Amount</th>
                    <th>Balance</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedList.map((j) => {
                    const balance = j.amount - j.settledAmount;
                    const agingClass = j.aging === 'Current' ? 'current' : j.aging === '30 Days' ? 'thirty' : j.aging === '60 Days' ? 'sixty' : 'ninety';
                    const pal = PALETTE[j.id % PALETTE.length];

                    return (
                      <tr key={j.id}>
                        {/* Name Column */}
                        <td>
                          <div className="j-party-cell">
                            <div className="j-avatar" style={{ background: pal.bg, color: pal.color }}>
                              {initials(j.party)}
                            </div>
                            <div>
                              <div className="j-party-name">{j.party}</div>
                              <div className="j-party-sub">Contract ID: {j.contractId || '#N/A'}</div>
                            </div>
                          </div>
                        </td>

                        {/* Reference Order Column */}
                        <td>
                          <span style={{ fontWeight: '600', color: '#475569', fontSize: '12.5px' }}>{j.reference}</span>
                        </td>

                        {/* Total Amount */}
                        <td>
                          <span style={{ fontWeight: '700', color: '#1e293b' }}>{fmtPKR(j.amount)}</span>
                        </td>

                        {/* Aging Status */}
                        <td>
                          <span className={`j-aging-pill ${agingClass}`}>{j.aging}</span>
                        </td>

                        {/* Settled Amount */}
                        <td>
                          <span style={{ fontWeight: '500', color: '#64748b' }}>{fmtPKR(j.settledAmount)}</span>
                        </td>

                        {/* Outstanding Balance */}
                        <td>
                          {balance === 0 ? (
                            <span className="j-badge-settled">Settled</span>
                          ) : (
                            <span style={{ fontWeight: '700', color: '#ef4444' }}>{fmtPKR(balance)}</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'right' }}>
                          <div className="j-actions" style={{ justifyContent: 'flex-end' }}>
                            {balance > 0 && (
                              <button className="j-btn-action" title="Record Payment / Settle" onClick={() => openSettle(j)}>
                                <Ico.Pay />
                              </button>
                            )}
                            <button className="j-btn-action" title="Edit Entry" onClick={() => openEdit(j)}>
                              <Ico.Edit />
                            </button>
                            <button className="j-btn-action danger" title="Delete" onClick={() => handleDelete(j.id, j.party)}>
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

            {/* Pagination Controls */}
            {tableFiltered.length > 0 && (
              <div className="j-pagination">
                <span className="j-pag-info">
                  Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, tableFiltered.length)} of {tableFiltered.length} entries
                </span>
                <div className="j-pag-btns">
                  <button className="j-pag-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    <Ico.ChevronLeft />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button key={i} className={`j-pag-btn${page === i + 1 ? ' active' : ''}`} onClick={() => setPage(i + 1)}>
                      {i + 1}
                    </button>
                  ))}
                  <button className="j-pag-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                    <Ico.ChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Widgets Grid (Bottom Section) ── */}
          <div className="j-bottom-grid">
            {/* Urgent Follow-ups */}
            <div className="j-widget">
              <h3 className="j-widget-title">
                <Ico.Alert />
                Immediate Follow-up Needed
              </h3>
              {urgentFollowups.length === 0 ? (
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>No high-priority overdue payments at this time. All customer debts are in good status.</p>
              ) : (
                <div className="j-follow-list">
                  {urgentFollowups.map(item => {
                    const balance = item.amount - item.settledAmount;
                    const days = item.aging === '90+ Days' ? '105 days' : '45 days';
                    return (
                      <div className="j-follow-card" key={item.id}>
                        <div className="j-follow-info">
                          <span className="j-follow-name">{item.party}</span>
                          <span className="j-follow-detail">{days} overdue • {fmtPKR(balance)}</span>
                        </div>
                        <button className="j-follow-btn" onClick={() => triggerCall(item.party, fmtPKR(balance))}>
                          Call Now
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Insights and Progress */}
            <div className="j-widget">
              <h3 className="j-widget-title" style={{ color: '#162839' }}>
                <Ico.Receipt />
                Journal Insights
              </h3>
              <p className="j-insights-desc">
                {insights.desc}
              </p>
              <div className="j-goal-bar-wrap">
                <div className="j-goal-bar" style={{ width: `${insights.percent}%` }} />
              </div>
              <div className="j-goal-lbls">
                <span>Current: {insights.avgDays} Days</span>
                <span>Target: {insights.target} Days</span>
              </div>
              <a href="#/admin/reports" className="j-insights-link">
                <span>View Full Analytics Report</span>
                <Ico.DoubleChevronRight />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          Add / Edit Invoice Modal
          ═══════════════════════════════════════════ */}
      {modal.open && modal.data && (
        <div className="j-overlay" onClick={e => e.target === e.currentTarget && setModal({ open: false, mode: 'add', type: 'receivable', data: null })}>
          <form className="j-modal" onSubmit={handleSave}>
            <div className="j-modal-head">
              <div>
                <h3 className="j-modal-title">{modal.mode === 'add' ? `Add ${modal.type === 'receivable' ? 'Customer Credit' : 'Vendor Invoice'}` : `Edit Entry — ${modal.data.party}`}</h3>
                <p className="j-modal-sub">Ensure all ledger figures are documented correctly in PKR.</p>
              </div>
              <button type="button" className="j-modal-close" onClick={() => setModal({ open: false, mode: 'add', type: 'receivable', data: null })}>
                <Ico.X />
              </button>
            </div>

            <div className="j-modal-body">
              {/* Party Name */}
              <div className="j-fld">
                <label className="j-lbl">{modal.type === 'receivable' ? 'Customer Name' : 'Vendor / Supplier Name'} <span>*</span></label>
                <input
                  className="j-inp"
                  placeholder={modal.type === 'receivable' ? 'e.g. Skyline Cafe' : 'e.g. Al-Baraka Meats'}
                  value={modal.data.party}
                  onChange={e => setModal(m => ({ ...m, data: { ...m.data, party: e.target.value } }))}
                  required
                  autoFocus
                />
              </div>

              {/* Reference and ID */}
              <div className="j-fld-grid">
                <div className="j-fld">
                  <label className="j-lbl">{modal.type === 'receivable' ? 'Order #' : 'Invoice #'} <span>*</span></label>
                  <input
                    className="j-inp"
                    placeholder="e.g. ORD-2026-99"
                    value={modal.data.reference}
                    onChange={e => setModal(m => ({ ...m, data: { ...m.data, reference: e.target.value } }))}
                    required
                  />
                </div>
                <div className="j-fld">
                  <label className="j-lbl">Contract ID / Ref</label>
                  <input
                    className="j-inp"
                    placeholder="e.g. #9901"
                    value={modal.data.contractId || ''}
                    onChange={e => setModal(m => ({ ...m, data: { ...m.data, contractId: e.target.value } }))}
                  />
                </div>
              </div>

              {/* Amounts */}
              <div className="j-fld-grid">
                <div className="j-fld">
                  <label className="j-lbl">Total Amount (Rs.) <span>*</span></label>
                  <input
                    className="j-inp"
                    type="number"
                    placeholder="0.00"
                    value={modal.data.amount}
                    onChange={e => setModal(m => ({ ...m, data: { ...m.data, amount: e.target.value } }))}
                    required
                  />
                </div>
                <div className="j-fld">
                  <label className="j-lbl">Settled Amount (Rs.)</label>
                  <input
                    className="j-inp"
                    type="number"
                    placeholder="0.00"
                    value={modal.data.settledAmount}
                    onChange={e => setModal(m => ({ ...m, data: { ...m.data, settledAmount: e.target.value } }))}
                  />
                </div>
              </div>

              {/* Branch and Date */}
              <div className="j-fld-grid">
                <div className="j-fld">
                  <label className="j-lbl">Branch <span>*</span></label>
                  <select
                    className="j-sel"
                    value={modal.data.branch}
                    onChange={e => setModal(m => ({ ...m, data: { ...m.data, branch: e.target.value } }))}
                    required
                  >
                    <option value="Mehdi Kitchen (Main)">Mehdi Kitchen</option>
                    <option value="Zangmo Kitchen">Zangmo Kitchen</option>
                  </select>
                </div>
                <div className="j-fld">
                  <label className="j-lbl">Due Date <span>*</span></label>
                  <input
                    className="j-inp"
                    type="date"
                    value={modal.data.date}
                    onChange={e => setModal(m => ({ ...m, data: { ...m.data, date: e.target.value } }))}
                    required
                  />
                </div>
              </div>

              {/* Aging Dropdown (only editable in Edit Mode to override status manually) */}
              <div className="j-fld">
                <label className="j-lbl">Aging Term</label>
                <select
                  className="j-sel"
                  value={modal.data.aging}
                  onChange={e => setModal(m => ({ ...m, data: { ...m.data, aging: e.target.value } }))}
                >
                  <option value="Current">Current / Due on delivery</option>
                  <option value="30 Days">30 Days Aging</option>
                  <option value="60 Days">60 Days Aging</option>
                  <option value="90+ Days">90+ Days (Critical)</option>
                </select>
              </div>

              {/* Notes */}
              <div className="j-fld">
                <label className="j-lbl">Notes &amp; Description</label>
                <textarea
                  className="j-txt"
                  placeholder="Record contract notes, payment conditions, or contact information."
                  value={modal.data.notes}
                  onChange={e => setModal(m => ({ ...m, data: { ...m.data, notes: e.target.value } }))}
                />
              </div>
            </div>

            <div className="j-modal-foot">
              <button type="button" className="j-btn-sec" onClick={() => setModal({ open: false, mode: 'add', type: 'receivable', data: null })}>Cancel</button>
              <button type="submit" className="j-btn-prim">{modal.mode === 'add' ? 'Save Entry' : 'Save Changes'}</button>
            </div>
          </form>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          Quick Settlement Modal
          ═══════════════════════════════════════════ */}
      {settleModal.open && settleModal.data && (
        <div className="j-overlay" onClick={e => e.target === e.currentTarget && setSettleModal({ open: false, data: null, payAmt: '' })}>
          <form className="j-modal" onSubmit={handleSettle}>
            <div className="j-modal-head">
              <div>
                <h3 className="j-modal-title">Record Payment Settlement</h3>
                <p className="j-modal-sub">{settleModal.data.party} — Balance: {fmtPKR(settleModal.data.amount - settleModal.data.settledAmount)}</p>
              </div>
              <button type="button" className="j-modal-close" onClick={() => setSettleModal({ open: false, data: null, payAmt: '' })}>
                <Ico.X />
              </button>
            </div>

            <div className="j-modal-body">
              <div className="j-fld">
                <label className="j-lbl">Payment Amount (Rs.) <span>*</span></label>
                <input
                  className="j-inp"
                  type="number"
                  placeholder="0.00"
                  value={settleModal.payAmt}
                  onChange={e => setSettleModal(s => ({ ...s, payAmt: e.target.value }))}
                  required
                  autoFocus
                />
                <span className="j-party-sub">Maximum settle limit is remaining outstanding dues.</span>
              </div>
            </div>

            <div className="j-modal-foot">
              <button type="button" className="j-btn-sec" onClick={() => setSettleModal({ open: false, data: null, payAmt: '' })}>Cancel</button>
              <button type="submit" className="j-btn-prim">Settle Payment</button>
            </div>
          </form>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          Phone Dialer Simulation Modal
          ═══════════════════════════════════════════ */}
      {dialer.open && (
        <div className="j-overlay" style={{ zIndex: 1300 }}>
          <div className="j-modal" style={{ maxWidth: '360px' }}>
            <div className="j-modal-head">
              <h3 className="j-modal-title">Outgoing Call simulation</h3>
              <button type="button" className="j-modal-close" onClick={() => setDialer(d => ({ ...d, open: false }))}>
                <Ico.X />
              </button>
            </div>
            <div className="j-modal-body" style={{ alignItems: 'center' }}>
              <div className="j-dialer-wrap">
                <div className={`j-dial-phone-avatar ${dialer.status.includes('Calling') || dialer.status.includes('Ringing') ? 'calling' : 'calling'}`}>
                  <Ico.Phone />
                </div>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#162839' }}>{dialer.name}</h4>
                <div className="j-dial-num">{dialer.phone}</div>
                <div className={`j-dial-status ${dialer.status.includes('Active') ? 'connected' : ''}`}>{dialer.status}</div>
                <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', margin: 0 }}>Simulated payment follow-up call regarding outstanding dues of <strong>{dialer.amount}</strong>.</p>
                <button type="button" className="j-dial-btn-hang" onClick={() => setDialer(d => ({ ...d, open: false }))}>
                  End Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Notifications ── */}
      {toast.show && (
        <div className={`j-toast ${toast.type}`}>
          {toast.type === 'success' ? <Ico.Check /> : <Ico.Alert />}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
