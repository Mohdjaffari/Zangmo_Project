import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/users.css';

/* ─────────────────────────────────────────────────────────────────
   All page-specific styles injected inline to guarantee application
   regardless of Vite HMR / Electron caching state.
   ───────────────────────────────────────────────────────────────── */
const PAGE_STYLES = `
  @keyframes mgrFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes mgrModalIn {
    from { opacity: 0; transform: scale(0.97) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes mgrToastIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Hero Banner ─────────────────────────────────────────────── */
  .mgr-hero {
    background: linear-gradient(135deg, #172331 0%, #1e2e40 60%, #162839 100%);
    border-radius: 8px;
    padding: 28px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 24px;
    position: relative;
    overflow: hidden;
    animation: mgrFadeUp 0.35s ease both;
  }
  .mgr-hero::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -5%;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(252,143,52,0.15) 0%, transparent 70%);
    pointer-events: none;
  }
  .mgr-hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(252,143,52,0.18);
    border: 1px solid rgba(252,143,52,0.35);
    color: #fc8f34;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 10px;
  }
  .mgr-hero h1 {
    margin: 0 0 6px;
    font-size: 22px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.02em;
  }
  .mgr-hero > div > p {
    margin: 0;
    font-size: 13px;
    color: rgba(255,255,255,0.5);
    line-height: 1.65;
    max-width: 500px;
  }

  /* ── Hire Button ──────────────────────────────────────────────── */
  .mgr-btn-hire {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: #fc8f34;
    color: #301400;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 2px 8px rgba(252,143,52,0.4);
    transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
  }
  .mgr-btn-hire:hover {
    background: #f97316;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(252,143,52,0.5);
  }

  /* ── KPI Stats Grid ───────────────────────────────────────────── */
  .mgr-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 24px;
  }
  .mgr-stat-card {
    background: white;
    border: 1px solid #e0e3e6;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
    animation: mgrFadeUp 0.35s ease both;
  }
  .mgr-stat-card:hover {
    border-color: #fc8f34;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.06);
  }
  .mgr-stat-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .mgr-stat-label {
    font-size: 11px;
    font-weight: 700;
    color: #5a626a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .mgr-stat-icon-box {
    width: 34px;
    height: 34px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .mgr-stat-value {
    font-size: 28px;
    font-weight: 700;
    color: #162839;
    margin: 0 0 4px;
    letter-spacing: -0.02em;
    line-height: 1;
  }
  .mgr-stat-sub {
    font-size: 11px;
    font-weight: 600;
    color: #10b981;
    margin: 0;
  }

  /* ── Toolbar ──────────────────────────────────────────────────── */
  .mgr-toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }
  .mgr-search-wrap {
    position: relative;
    flex: 1;
    max-width: 320px;
  }
  .mgr-search-wrap svg {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }
  .mgr-search {
    width: 100%;
    padding: 9px 12px 9px 36px;
    border: 1px solid #e0e3e6;
    border-radius: 6px;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    background: white;
    color: #111827;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    box-sizing: border-box;
  }
  .mgr-search::placeholder { color: #9ca3af; }
  .mgr-search:focus {
    border-color: #b45309;
    box-shadow: 0 0 0 3px rgba(180,83,9,0.1);
  }
  .mgr-filter-select {
    padding: 9px 14px;
    border: 1px solid #e0e3e6;
    border-radius: 6px;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    color: #374151;
    background: white;
    cursor: pointer;
    outline: none;
    transition: border-color 0.18s;
  }
  .mgr-filter-select:focus { border-color: #b45309; }
  .mgr-count-label {
    margin-left: auto;
    font-size: 12px;
    font-weight: 600;
    color: #9ca3af;
    white-space: nowrap;
  }

  /* ── Cards Grid ───────────────────────────────────────────────── */
  .mgr-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
    gap: 20px;
  }

  /* ── Manager Card ─────────────────────────────────────────────── */
  .mgr-card {
    background: white;
    border-radius: 8px;
    border: 1px solid #e0e3e6;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
    animation: mgrFadeUp 0.35s ease both;
    display: flex;
    flex-direction: column;
  }
  .mgr-card:hover {
    border-color: #c4c6cd;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    transform: translateY(-3px);
  }
  .mgr-card-stripe { height: 4px; }
  .mgr-card-body {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .mgr-name-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f2f4f7;
  }
  .mgr-avatar-box {
    width: 46px;
    height: 46px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
    flex-shrink: 0;
  }
  .mgr-name-block { flex: 1; min-width: 0; }
  .mgr-full-name {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #162839;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: -0.01em;
  }
  .mgr-uname {
    margin: 3px 0 0;
    font-size: 11.5px;
    color: #9ca3af;
    font-family: monospace;
  }
  .mgr-active-pill {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 20px;
    background: #ecfdf5;
    color: #059669;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: 1px solid #a7f3d0;
  }
  .mgr-active-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
  }

  /* Info list */
  .mgr-info-list {
    display: flex;
    flex-direction: column;
    gap: 9px;
    margin-bottom: 14px;
  }
  .mgr-info-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .mgr-info-ico {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #6b7280;
  }
  .mgr-info-val {
    font-size: 13px;
    font-weight: 600;
    color: #162839;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
    display: block;
  }
  .mgr-info-meta {
    font-size: 10.5px;
    color: #9ca3af;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    display: block;
  }

  /* Credential box */
  .mgr-cred-box {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 10px 12px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .mgr-cred-label {
    font-size: 10px;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 3px;
    display: block;
  }
  .mgr-cred-val {
    font-family: monospace;
    font-size: 13px;
    font-weight: 700;
    color: #162839;
    letter-spacing: 0.06em;
    display: block;
  }
  .mgr-cred-btn {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    background: white;
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.18s;
  }
  .mgr-cred-btn:hover { background: #162839; color: white; border-color: #162839; }

  /* Card actions */
  .mgr-card-actions {
    display: flex;
    gap: 8px;
    margin-top: auto;
  }
  .mgr-btn-edit {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #e0e3e6;
    background: white;
    color: #374151;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.18s;
  }
  .mgr-btn-edit:hover { background: #162839; color: white; border-color: #162839; }
  .mgr-btn-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #fecaca;
    background: white;
    color: #dc2626;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.18s;
  }
  .mgr-btn-remove:hover { background: #dc2626; color: white; border-color: #dc2626; }

  /* ── Empty State ──────────────────────────────────────────────── */
  .mgr-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 24px;
    background: white;
    border-radius: 8px;
    border: 2px dashed #e0e3e6;
    text-align: center;
    gap: 10px;
  }
  .mgr-empty-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c4c6cd;
    margin-bottom: 4px;
  }
  .mgr-empty h3 { margin: 0; font-size: 15px; font-weight: 700; color: #162839; }
  .mgr-empty p  { margin: 0; font-size: 13px; color: #5a626a; }

  /* ── Modal Overlay ────────────────────────────────────────────── */
  .mgr-overlay {
    position: fixed !important;
    inset: 0 !important;
    background: rgba(22,40,57,0.55);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
  }
  .mgr-modal {
    background: white;
    width: 100%;
    max-width: 520px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35);
    animation: mgrModalIn 0.22s cubic-bezier(0.16,1,0.3,1) both;
    font-family: 'Inter', sans-serif;
  }
  /* Dark modal header — like all other app modals */
  .mgr-modal-hdr {
    background: #111827;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .mgr-modal-hdr-edit {
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }
  .mgr-modal-hdr-ico {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .mgr-modal-hdr-ico-new  { background: rgba(252,143,52,0.18); color: #fc8f34; }
  .mgr-modal-hdr-ico-edit { background: #e0e7ff; color: #4338ca; }
  .mgr-modal-hdr-text { flex: 1; }
  .mgr-modal-title     { margin: 0; font-size: 15px; font-weight: 600; }
  .mgr-modal-title-new  { color: white; }
  .mgr-modal-title-edit { color: #111827; }
  .mgr-modal-sub { margin: 2px 0 0; font-size: 12px; }
  .mgr-modal-sub-new  { color: rgba(255,255,255,0.55); }
  .mgr-modal-sub-edit { color: #6b7280; }
  .mgr-modal-x {
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }
  .mgr-modal-x-new  { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); }
  .mgr-modal-x-new:hover  { background: rgba(255,255,255,0.2); color: white; }
  .mgr-modal-x-edit { background: #f3f4f6; color: #6b7280; }
  .mgr-modal-x-edit:hover { background: #e5e7eb; color: #111827; }

  .mgr-modal-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: 60vh;
    overflow-y: auto;
  }
  .mgr-modal-body::-webkit-scrollbar { width: 4px; }
  .mgr-modal-body::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 99px; }

  /* Form fields */
  .mgr-fld { display: flex; flex-direction: column; gap: 6px; }
  .mgr-lbl {
    font-size: 11px;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .mgr-lbl span { color: #d97706; }
  .mgr-inp {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    color: #111827;
    background: white;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .mgr-inp::placeholder { color: #9ca3af; }
  .mgr-inp:focus { border-color: #b45309; box-shadow: 0 0 0 3px rgba(180,83,9,0.1); }
  .mgr-inp-locked { background: #f9fafb; color: #6b7280; cursor: not-allowed; border-color: #e5e7eb; }
  .mgr-inp-locked:focus { box-shadow: none; border-color: #e5e7eb; }
  .mgr-inp-err { border-color: #ef4444 !important; box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important; }
  .mgr-hint { font-size: 11px; color: #9ca3af; font-style: italic; }
  .mgr-err-msg { font-size: 11px; color: #dc2626; font-weight: 600; }
  .mgr-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .mgr-pw-wrap { position: relative; }
  .mgr-pw-wrap .mgr-inp { padding-right: 40px; }
  .mgr-pw-toggle {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    transition: color 0.15s;
  }
  .mgr-pw-toggle:hover { color: #374151; }
  .mgr-cred-section {
    background: #fff7ed;
    border: 1px solid #fde68a;
    border-radius: 6px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .mgr-cred-section svg { color: #d97706; flex-shrink: 0; }
  .mgr-cred-sec-text {
    margin: 0;
    font-size: 11px;
    font-weight: 700;
    color: #92400e;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .mgr-cred-sec-note { font-size: 11px; font-weight: 400; color: #d97706; text-transform: none; letter-spacing: 0; }

  /* Modal footer */
  .mgr-modal-footer {
    background: #f9fafb;
    padding: 16px 20px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
  }
  .mgr-btn-cancel {
    padding: 9px 16px;
    border: 1px solid #d1d5db;
    background: white;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.15s;
  }
  .mgr-btn-cancel:hover { background: #f3f4f6; }
  .mgr-btn-submit {
    padding: 9px 18px;
    border: none;
    background: #162839;
    color: white;
    font-size: 14px;
    font-weight: 600;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.18s;
  }
  .mgr-btn-submit:hover { background: #0f172a; box-shadow: 0 4px 12px rgba(22,40,57,0.25); }

  /* ── Toast ────────────────────────────────────────────────────── */
  .mgr-toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 10000;
    background: #111827;
    color: white;
    padding: 14px 20px;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13.5px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    animation: mgrToastIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards;
    max-width: 360px;
  }
  .mgr-toast-success { border-left: 4px solid #10b981; }
  .mgr-toast-success svg { color: #10b981; flex-shrink: 0; }
  .mgr-toast-error { border-left: 4px solid #ef4444; }
  .mgr-toast-error svg { color: #ef4444; flex-shrink: 0; }

  /* ── Responsive ───────────────────────────────────────────────── */
  @media (max-width: 1100px) { .mgr-stats-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 768px)  {
    .mgr-hero { flex-direction: column; align-items: flex-start; padding: 20px; }
    .mgr-stats-grid { grid-template-columns: repeat(2,1fr); }
    .mgr-cards-grid { grid-template-columns: 1fr; }
    .mgr-row2 { grid-template-columns: 1fr; }
  }
  @media (max-width: 576px)  { .mgr-stats-grid { grid-template-columns: 1fr; } }
`;

/* ─────────────────────────────────────────────────────────────────
   SVG Icons — all inline, no images, no emoji
   ───────────────────────────────────────────────────────────────── */
const Ico = {
  Plus: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>),
  Close: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>),
  Eye: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>),
  EyeOff: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>),
  Pencil: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>),
  Trash: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>),
  Key: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>),
  Shield: () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
  ShieldTick: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>),
  MapPin: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>),
  Mail: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>),
  Phone: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>),
  Calendar: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>),
  Users: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  UserCheck: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>),
  Store: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>),
  Store2: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/></svg>),
  Check: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>),
  Alert: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>),
  Search: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>),
  Lock: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
};

/* ─────────────────────────────────────────────────────────────────
   Constants & Helpers
   ───────────────────────────────────────────────────────────────── */
const BRANCHES = ['Mehdi Kitchen (Main)', 'Zangmo Kitchen'];

const AVATAR_PALETTE = [
  { bg: '#ffedd5', color: '#c2410c' },
  { bg: '#dbeafe', color: '#1e40af' },
  { bg: '#e0e7ff', color: '#4338ca' },
  { bg: '#fef08a', color: '#854d0e' },
  { bg: '#d1fae5', color: '#065f46' },
];

function getInitials(name) {
  const parts = (name || '').trim().split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (parts[0]?.[0] || 'M').toUpperCase();
}

function getPw(username) {
  try {
    const accs = JSON.parse(localStorage.getItem('zangmo_user_accounts') || '[]');
    return accs.find(a => a.username === username)?.password || null;
  } catch { return null; }
}

function emptyForm() {
  return { name: '', username: '', branch: BRANCHES[0], email: '', phone: '', password: '', confirm: '' };
}

/* ─────────────────────────────────────────────────────────────────
   Component
   ───────────────────────────────────────────────────────────────── */
export default function AdminManagerHiring() {
  /* ── State ──────────────────────────────────────────────────── */
  const [managers, setManagers] = useState(() => {
    const s = localStorage.getItem('zangmo_managers');
    if (s) { try { return JSON.parse(s); } catch {} }
    const accs = (() => { try { return JSON.parse(localStorage.getItem('zangmo_user_accounts') || '[]'); } catch { return []; } })();
    return accs.filter(a => a.role === 'Manager').map((a, i) => ({
      id: Date.now() + i,
      name: a.name,
      username: a.username,
      branch: a.branch || BRANCHES[0],
      email: a.email || `${a.username}@zmkitchen.com`,
      phone: a.phone || '',
      joinDate: a.joinDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      palIdx: i % AVATAR_PALETTE.length,
      status: 'Active',
    }));
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(emptyForm());
  const [showPw,    setShowPw]    = useState(false);
  const [showCfm,   setShowCfm]   = useState(false);
  const [revealId,  setRevealId]  = useState(null);
  const [search,    setSearch]    = useState('');
  const [branchF,   setBranchF]   = useState('All');
  const [toast,     setToast]     = useState({ show: false, type: 'success', msg: '' });

  useEffect(() => { localStorage.setItem('zangmo_managers', JSON.stringify(managers)); }, [managers]);

  /* ── Helpers ─────────────────────────────────────────────── */
  const showToast = (msg, type = 'success') => {
    setToast({ show: true, type, msg });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  const syncAccounts = (mgr, pw = null) => {
    const accs = (() => { try { return JSON.parse(localStorage.getItem('zangmo_user_accounts') || '[]'); } catch { return []; } })();
    const idx = accs.findIndex(a => a.username === mgr.username);
    if (idx === -1) {
      accs.push({ username: mgr.username, password: pw || 'manager', role: 'Manager', name: mgr.name, branch: mgr.branch, email: mgr.email, phone: mgr.phone, joinDate: mgr.joinDate });
    } else {
      accs[idx] = { ...accs[idx], name: mgr.name, branch: mgr.branch, email: mgr.email, phone: mgr.phone, ...(pw ? { password: pw } : {}) };
    }
    localStorage.setItem('zangmo_user_accounts', JSON.stringify(accs));
  };

  const removeAccount = (uname) => {
    try {
      const accs = JSON.parse(localStorage.getItem('zangmo_user_accounts') || '[]').filter(a => a.username !== uname);
      localStorage.setItem('zangmo_user_accounts', JSON.stringify(accs));
    } catch {}
  };

  /* ── Modal ────────────────────────────────────────────────── */
  const openCreate = () => { setEditing(null); setForm(emptyForm()); setShowPw(false); setShowCfm(false); setModalOpen(true); };
  const openEdit   = (m)  => { setEditing(m); setForm({ name: m.name, username: m.username, branch: m.branch, email: m.email || '', phone: m.phone || '', password: '', confirm: '' }); setShowPw(false); setShowCfm(false); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const onNameChange = (val) => setForm(f => ({
    ...f, name: val,
    username: editing ? f.username : val.trim().toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9._-]/g, ''),
  }));

  /* ── Submit ───────────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.username.trim()) { showToast('Name and username are required.', 'error'); return; }
    if (!editing) {
      if (!form.password)                 { showToast('Password is required.', 'error'); return; }
      if (form.password !== form.confirm) { showToast('Passwords do not match.', 'error'); return; }
      const accs = (() => { try { return JSON.parse(localStorage.getItem('zangmo_user_accounts') || '[]'); } catch { return []; } })();
      if (accs.some(a => a.username === form.username)) { showToast('Username already exists.', 'error'); return; }
      const mgr = {
        id: Date.now(), name: form.name.trim(), username: form.username.trim(),
        branch: form.branch, email: form.email || `${form.username.trim()}@zmkitchen.com`,
        phone: form.phone,
        joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        palIdx: managers.length % AVATAR_PALETTE.length, status: 'Active',
      };
      syncAccounts(mgr, form.password);
      setManagers(p => [mgr, ...p]);
      showToast(`${mgr.name} hired successfully. Login credentials are ready.`);
    } else {
      if (form.password && form.password !== form.confirm) { showToast('Passwords do not match.', 'error'); return; }
      const upd = { ...editing, name: form.name.trim(), branch: form.branch, email: form.email, phone: form.phone };
      syncAccounts(upd, form.password || null);
      setManagers(p => p.map(m => m.id === editing.id ? upd : m));
      showToast(`${upd.name}'s profile updated.`);
    }
    closeModal();
  };

  const handleDelete = (mgr) => {
    if (!window.confirm(`Remove "${mgr.name}" and revoke their login access?`)) return;
    removeAccount(mgr.username);
    setManagers(p => p.filter(m => m.id !== mgr.id));
    showToast(`${mgr.name} removed.`, 'error');
  };

  /* ── Filter / Stats ───────────────────────────────────────── */
  const filtered = managers.filter(m => {
    const q  = search.toLowerCase();
    const mq = !q || m.name.toLowerCase().includes(q) || m.username.toLowerCase().includes(q) || (m.branch || '').toLowerCase().includes(q);
    const mb = branchF === 'All' || m.branch === branchF;
    return mq && mb;
  });

  const stats = [
    { label: 'Total Managers',  value: managers.length,                                                    Icon: Ico.Users,     iconBg: '#f3f4f6', iconColor: '#374151', sub: 'across all branches' },
    { label: 'Active Accounts', value: managers.filter(m => m.status === 'Active').length,                 Icon: Ico.UserCheck, iconBg: '#ecfdf5', iconColor: '#059669', sub: 'accounts active' },
    { label: 'Mehdi Kitchen',   value: managers.filter(m => m.branch === 'Mehdi Kitchen (Main)').length,  Icon: Ico.Store,     iconBg: '#eff6ff', iconColor: '#1d4ed8', sub: 'branch managers' },
    { label: 'Zangmo Kitchen',  value: managers.filter(m => m.branch === 'Zangmo Kitchen').length,        Icon: Ico.Store2,    iconBg: '#fff7ed', iconColor: '#c2410c', sub: 'branch managers' },
  ];

  /* ═══════════════════════════════════════════════════════════
     Render
     ═══════════════════════════════════════════════════════════ */
  return (
    <div className="dashboard">
      {/* Inject scoped styles directly — bypasses any CSS file caching */}
      <style>{PAGE_STYLES}</style>

      <AdminSidebar activePage="managers" />

      <div className="main-content">
        <Topbar title="Branch Manager Hiring" />

        <div className="page-content" style={{ overflowY: 'auto', background: '#f7f9fc' }}>

          {/* Hero */}
          <div className="mgr-hero">
            <div>
              <div className="mgr-hero-eyebrow"><Ico.ShieldTick /> Admin Control Panel</div>
              <h1>Branch Manager Hiring</h1>
              <p>Create and manage branch manager accounts with login credentials. Hired managers gain immediate dashboard access for their assigned branch.</p>
            </div>
            <button className="mgr-btn-hire" onClick={openCreate} id="hire-manager-btn">
              <Ico.Plus /> Hire New Manager
            </button>
          </div>

          {/* KPI Stats */}
          <div className="mgr-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="mgr-stat-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="mgr-stat-top">
                  <span className="mgr-stat-label">{s.label}</span>
                  <div className="mgr-stat-icon-box" style={{ background: s.iconBg, color: s.iconColor }}>
                    <s.Icon />
                  </div>
                </div>
                <p className="mgr-stat-value">{s.value}</p>
                <p className="mgr-stat-sub">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="mgr-toolbar">
            <div className="mgr-search-wrap">
              <Ico.Search />
              <input type="text" className="mgr-search" placeholder="Search managers…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="mgr-filter-select" value={branchF} onChange={e => setBranchF(e.target.value)}>
              <option value="All">All Branches</option>
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <span className="mgr-count-label">{filtered.length} / {managers.length} manager{managers.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="mgr-empty">
              <div className="mgr-empty-icon"><Ico.Shield /></div>
              <h3>{search || branchF !== 'All' ? 'No results found' : 'No managers hired yet'}</h3>
              <p>{search || branchF !== 'All' ? 'Try adjusting your search or branch filter.' : 'Click "Hire New Manager" to create the first account.'}</p>
            </div>
          ) : (
            <div className="mgr-cards-grid">
              {filtered.map((mgr, idx) => {
                const pal = AVATAR_PALETTE[mgr.palIdx ?? idx % AVATAR_PALETTE.length];
                const pw  = getPw(mgr.username);
                return (
                  <div key={mgr.id} className="mgr-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="mgr-card-stripe" style={{ background: pal.color }} />
                    <div className="mgr-card-body">

                      {/* Name row */}
                      <div className="mgr-name-row">
                        <div className="mgr-avatar-box" style={{ background: pal.bg, color: pal.color }}>
                          {getInitials(mgr.name)}
                        </div>
                        <div className="mgr-name-block">
                          <h5 className="mgr-full-name">{mgr.name}</h5>
                          <p className="mgr-uname">@{mgr.username}</p>
                        </div>
                        <span className="mgr-active-pill">
                          <span className="mgr-active-dot" />Active
                        </span>
                      </div>

                      {/* Info list */}
                      <div className="mgr-info-list">
                        <div className="mgr-info-row">
                          <div className="mgr-info-ico"><Ico.MapPin /></div>
                          <div><span className="mgr-info-val">{mgr.branch}</span><span className="mgr-info-meta">Assigned Branch</span></div>
                        </div>
                        {mgr.email && (
                          <div className="mgr-info-row">
                            <div className="mgr-info-ico"><Ico.Mail /></div>
                            <div><span className="mgr-info-val">{mgr.email}</span><span className="mgr-info-meta">Email</span></div>
                          </div>
                        )}
                        {mgr.phone && (
                          <div className="mgr-info-row">
                            <div className="mgr-info-ico"><Ico.Phone /></div>
                            <div><span className="mgr-info-val">{mgr.phone}</span><span className="mgr-info-meta">Phone</span></div>
                          </div>
                        )}
                        <div className="mgr-info-row">
                          <div className="mgr-info-ico"><Ico.Calendar /></div>
                          <div><span className="mgr-info-val">{mgr.joinDate}</span><span className="mgr-info-meta">Hire Date</span></div>
                        </div>
                      </div>

                      {/* Password */}
                      <div className="mgr-cred-box">
                        <div>
                          <span className="mgr-cred-label">Login Password</span>
                          <span className="mgr-cred-val">{revealId === mgr.id && pw ? pw : '• • • • • • • •'}</span>
                        </div>
                        <button className="mgr-cred-btn" onClick={() => setRevealId(revealId === mgr.id ? null : mgr.id)} title={revealId === mgr.id ? 'Hide' : 'Reveal password'}>
                          {revealId === mgr.id ? <Ico.EyeOff /> : <Ico.Eye />}
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="mgr-card-actions">
                        <button className="mgr-btn-edit"   onClick={() => openEdit(mgr)}><Ico.Pencil /> Edit Profile</button>
                        <button className="mgr-btn-remove" onClick={() => handleDelete(mgr)}><Ico.Trash /> Remove</button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="mgr-overlay" onClick={closeModal}>
          <form className="mgr-modal" onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className={`mgr-modal-hdr ${editing ? 'mgr-modal-hdr-edit' : ''}`}>
              <div className={`mgr-modal-hdr-ico ${editing ? 'mgr-modal-hdr-ico-edit' : 'mgr-modal-hdr-ico-new'}`}>
                {editing ? <Ico.Pencil /> : <Ico.ShieldTick />}
              </div>
              <div className="mgr-modal-hdr-text">
                <h3 className={`mgr-modal-title ${editing ? 'mgr-modal-title-edit' : 'mgr-modal-title-new'}`}>
                  {editing ? `Edit — ${editing.name}` : 'Hire New Branch Manager'}
                </h3>
                <p className={`mgr-modal-sub ${editing ? 'mgr-modal-sub-edit' : 'mgr-modal-sub-new'}`}>
                  {editing ? 'Update profile, branch, or credentials' : 'Set profile, branch & login credentials'}
                </p>
              </div>
              <button type="button" className={`mgr-modal-x ${editing ? 'mgr-modal-x-edit' : 'mgr-modal-x-new'}`} onClick={closeModal}>
                <Ico.Close />
              </button>
            </div>

            {/* Body */}
            <div className="mgr-modal-body">
              <div className="mgr-fld">
                <label className="mgr-lbl">Full Name <span>*</span></label>
                <input className="mgr-inp" type="text" required autoFocus placeholder="e.g. Zangmo Wangchuck" value={form.name} onChange={e => onNameChange(e.target.value)} />
              </div>
              <div className="mgr-fld">
                <label className="mgr-lbl">Username / Login ID <span>*</span></label>
                <input className={`mgr-inp ${editing ? 'mgr-inp-locked' : ''}`} type="text" required placeholder="e.g. zangmo.wangchuck" value={form.username} readOnly={!!editing} onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9._-]/g, '') }))} />
                <span className="mgr-hint">{editing ? 'Username is fixed after creation.' : 'Auto-generated from name. Manager logs in with this ID.'}</span>
              </div>
              <div className="mgr-fld">
                <label className="mgr-lbl">Assigned Branch <span>*</span></label>
                <select className="mgr-inp" value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value }))}>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="mgr-row2">
                <div className="mgr-fld">
                  <label className="mgr-lbl">Email</label>
                  <input className="mgr-inp" type="email" placeholder="manager@zmkitchen.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="mgr-fld">
                  <label className="mgr-lbl">Phone</label>
                  <input className="mgr-inp" type="text" placeholder="+975 17 ..." value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div className="mgr-cred-section">
                <Ico.Lock />
                <p className="mgr-cred-sec-text">Login Credentials {editing && <span className="mgr-cred-sec-note"> — leave blank to keep current password</span>}</p>
              </div>
              <div className="mgr-fld">
                <label className="mgr-lbl">Password {!editing && <span>*</span>}</label>
                <div className="mgr-pw-wrap">
                  <input className="mgr-inp" type={showPw ? 'text' : 'password'} placeholder={editing ? 'Leave blank to keep current' : 'Set a secure password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required={!editing} />
                  <button type="button" className="mgr-pw-toggle" onClick={() => setShowPw(v => !v)}>{showPw ? <Ico.EyeOff /> : <Ico.Eye />}</button>
                </div>
              </div>
              <div className="mgr-fld">
                <label className="mgr-lbl">Confirm Password {!editing && <span>*</span>}</label>
                <div className="mgr-pw-wrap">
                  <input className={`mgr-inp ${form.confirm && form.password !== form.confirm ? 'mgr-inp-err' : ''}`} type={showCfm ? 'text' : 'password'} placeholder="Repeat password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required={!editing} />
                  <button type="button" className="mgr-pw-toggle" onClick={() => setShowCfm(v => !v)}>{showCfm ? <Ico.EyeOff /> : <Ico.Eye />}</button>
                </div>
                {form.confirm && form.password !== form.confirm && <span className="mgr-err-msg">Passwords do not match</span>}
              </div>
            </div>

            {/* Footer */}
            <div className="mgr-modal-footer">
              <button type="button" className="mgr-btn-cancel" onClick={closeModal}>Cancel</button>
              <button type="submit" className="mgr-btn-submit"><Ico.Check /> {editing ? 'Save Changes' : 'Hire Manager & Create Login'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`mgr-toast mgr-toast-${toast.type}`}>
          {toast.type === 'success' ? <Ico.Check /> : <Ico.Alert />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
