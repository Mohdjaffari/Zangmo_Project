import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/users.css';

/* ─────────────────────────────────────────────────────────────────
   Inline page styles — guaranteed to apply in Electron
   ───────────────────────────────────────────────────────────────── */
const S = `
  @keyframes ha-fadeUp {
    from { opacity:0; transform:translateY(12px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes ha-toast {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* Hero */
  .ha-hero {
    background: linear-gradient(135deg,#172331 0%,#1e2e40 55%,#162839 100%);
    border-radius: 8px;
    padding: 26px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 24px;
    position: relative;
    overflow: hidden;
    animation: ha-fadeUp 0.3s ease both;
  }
  .ha-hero::before {
    content:'';
    position:absolute; top:-60px; right:-40px;
    width:200px; height:200px; border-radius:50%;
    background:radial-gradient(circle,rgba(252,143,52,0.14) 0%,transparent 70%);
    pointer-events:none;
  }
  .ha-hero-eyebrow {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(252,143,52,0.16); border:1px solid rgba(252,143,52,0.3);
    color:#fc8f34; font-size:10px; font-weight:700;
    padding:3px 10px; border-radius:20px;
    text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px;
  }
  .ha-hero h1 { margin:0 0 5px; font-size:21px; font-weight:700; color:#fff; letter-spacing:-0.02em; }
  .ha-hero p  { margin:0; font-size:13px; color:rgba(255,255,255,0.5); line-height:1.6; }

  /* Stats */
  .ha-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:18px; margin-bottom:24px; }
  .ha-stat {
    background:white; border:1px solid #e0e3e6; border-radius:8px; padding:18px 20px;
    display:flex; flex-direction:column; gap:6px;
    box-shadow:0 1px 3px rgba(0,0,0,0.02);
    transition:all 0.2s cubic-bezier(0.4,0,0.2,1);
    animation: ha-fadeUp 0.3s ease both;
    border-left: 4px solid transparent;
  }
  .ha-stat:hover { transform:translateY(-2px); box-shadow:0 6px 16px rgba(0,0,0,0.06); }
  .ha-stat-top { display:flex; align-items:center; justify-content:space-between; }
  .ha-stat-label { font-size:11px; font-weight:700; color:#5a626a; text-transform:uppercase; letter-spacing:0.05em; }
  .ha-stat-ico { width:30px; height:30px; border-radius:6px; display:flex; align-items:center; justify-content:center; }
  .ha-stat-value { font-size:26px; font-weight:700; color:#162839; letter-spacing:-0.02em; margin:0; }

  /* Toolbar */
  .ha-toolbar {
    background:white; border:1px solid #e0e3e6; border-radius:8px;
    padding:14px 16px; display:flex; align-items:center; gap:12px;
    margin-bottom:20px; flex-wrap:wrap;
  }
  .ha-toolbar-title { font-size:14px; font-weight:700; color:#162839; margin-right:8px; }
  .ha-select {
    padding:8px 12px; border:1px solid #d1d5db; border-radius:6px;
    font-size:13px; font-family:'Inter',sans-serif; font-weight:600;
    color:#374151; background:white; cursor:pointer; outline:none;
    transition:border-color 0.15s;
  }
  .ha-select:focus { border-color:#b45309; }
  .ha-count { margin-left:auto; font-size:12px; font-weight:600; color:#9ca3af; white-space:nowrap; }

  /* Request Cards */
  .ha-cards { display:flex; flex-direction:column; gap:14px; }
  .ha-card {
    background:white; border:1px solid #e0e3e6; border-radius:8px;
    box-shadow:0 1px 3px rgba(0,0,0,0.03);
    transition:all 0.2s cubic-bezier(0.4,0,0.2,1);
    animation: ha-fadeUp 0.3s ease both;
    overflow:hidden;
  }
  .ha-card:hover { box-shadow:0 6px 18px rgba(0,0,0,0.07); border-color:#c4c6cd; transform:translateY(-1px); }
  .ha-card-body { padding:20px; display:flex; align-items:flex-start; justify-content:space-between; gap:20px; }
  .ha-card-left { display:flex; gap:14px; flex:1; min-width:0; }

  /* Avatar */
  .ha-avatar {
    width:44px; height:44px; border-radius:8px;
    display:flex; align-items:center; justify-content:center;
    font-size:15px; font-weight:700; flex-shrink:0;
  }

  /* Card content */
  .ha-card-content { flex:1; min-width:0; }
  .ha-card-name-row { display:flex; align-items:center; gap:8px; margin-bottom:6px; flex-wrap:wrap; }
  .ha-name { margin:0; font-size:15px; font-weight:700; color:#162839; }
  .ha-role-pill {
    font-size:11px; font-weight:700; padding:2px 9px; border-radius:20px;
    background:#e0e7ff; color:#4338ca; text-transform:uppercase; letter-spacing:0.04em;
  }
  .ha-date { font-size:11.5px; color:#9ca3af; font-weight:500; }
  .ha-card-meta { display:flex; flex-wrap:wrap; gap:16px; font-size:13px; color:#475569; margin-bottom:10px; }
  .ha-meta-item { display:flex; align-items:center; gap:6px; }
  .ha-meta-item svg { flex-shrink:0; color:#9ca3af; }
  .ha-meta-val { font-weight:600; color:#162839; }
  .ha-justification {
    background:#f8fafc; border:1px solid #f1f5f9; border-radius:6px;
    padding:10px 14px; font-size:13px; color:#475569; line-height:1.6;
  }
  .ha-justification strong { color:#162839; }

  /* Right side (status + actions) */
  .ha-card-right { display:flex; flex-direction:column; align-items:flex-end; gap:10px; flex-shrink:0; }
  .ha-status-badge {
    font-size:10px; font-weight:700; padding:4px 10px; border-radius:4px;
    text-transform:uppercase; letter-spacing:0.05em;
  }
  .ha-badge-pending  { background:#fef3c7; color:#d97706; border:1px solid #fde68a; }
  .ha-badge-approved { background:#d1fae5; color:#065f46; border:1px solid #a7f3d0; }
  .ha-badge-rejected { background:#fee2e2; color:#991b1b; border:1px solid #fecaca; }

  .ha-actions { display:flex; gap:8px; }
  .ha-btn-reject {
    padding:7px 14px; border-radius:6px; border:1px solid #e0e3e6;
    background:white; font-size:12px; font-weight:600; color:#dc2626;
    cursor:pointer; font-family:'Inter',sans-serif; transition:all 0.18s;
    display:flex; align-items:center; gap:5px;
  }
  .ha-btn-reject:hover { background:#fee2e2; border-color:#fca5a5; }
  .ha-btn-approve {
    padding:7px 14px; border-radius:6px; border:none;
    background:#162839; font-size:12px; font-weight:600; color:white;
    cursor:pointer; font-family:'Inter',sans-serif; transition:all 0.18s;
    display:flex; align-items:center; gap:5px;
  }
  .ha-btn-approve:hover { background:#0f172a; box-shadow:0 2px 8px rgba(22,40,57,0.2); }
  .ha-btn-delete {
    padding:6px 12px; border-radius:6px; border:none;
    background:transparent; font-size:12px; font-weight:600; color:#9ca3af;
    cursor:pointer; font-family:'Inter',sans-serif; transition:color 0.15s;
    display:flex; align-items:center; gap:5px;
  }
  .ha-btn-delete:hover { color:#dc2626; }

  /* Card bottom accent line by status */
  .ha-accent-line { height:3px; }
  .ha-accent-pending  { background:#f59e0b; }
  .ha-accent-approved { background:#10b981; }
  .ha-accent-rejected { background:#ef4444; }

  /* Empty state */
  .ha-empty {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:80px 24px; background:white; border-radius:8px;
    border:2px dashed #e0e3e6; text-align:center; gap:8px;
  }
  .ha-empty-ico { width:52px; height:52px; border-radius:50%; background:#f3f4f6; border:1px solid #e5e7eb; display:flex; align-items:center; justify-content:center; color:#c4c6cd; margin-bottom:4px; }
  .ha-empty h3 { margin:0; font-size:15px; font-weight:700; color:#162839; }
  .ha-empty p  { margin:0; font-size:13px; color:#5a626a; }

  /* Toast */
  .ha-toast {
    position:fixed; bottom:24px; right:24px; z-index:9999;
    background:#111827; color:white;
    padding:13px 20px; border-radius:8px;
    box-shadow:0 10px 15px -3px rgba(0,0,0,0.2);
    display:flex; align-items:center; gap:10px;
    font-size:13.5px; font-weight:500; font-family:'Inter',sans-serif;
    animation:ha-toast 0.3s cubic-bezier(0.16,1,0.3,1) forwards;
    max-width:360px;
  }
  .ha-toast-success { border-left:4px solid #10b981; }
  .ha-toast-success svg { color:#10b981; }
  .ha-toast-error { border-left:4px solid #ef4444; }
  .ha-toast-error svg { color:#ef4444; }

  @media(max-width:1100px) { .ha-stats { grid-template-columns:repeat(2,1fr); } }
  @media(max-width:768px)  {
    .ha-hero { flex-direction:column; align-items:flex-start; padding:20px; }
    .ha-stats { grid-template-columns:repeat(2,1fr); }
    .ha-card-body { flex-direction:column; }
    .ha-card-right { align-items:flex-start; }
  }
`;

/* ── Icons ────────────────────────────────────────────────────────── */
const Ico = {
  Clipboard:  () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4M12 16h4M8 11h.01M8 16h.01"/></svg>),
  Clock:      () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
  CheckCircle:() => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>),
  XCircle:    () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>),
  MapPin:     () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>),
  DollarSign: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>),
  Calendar:   () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>),
  Check:      () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  X:          () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>),
  Trash:      () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>),
  Empty:      () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>),
  Filter:     () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>),
  Shield:     () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
};

/* ── Avatar colours cycling ───────────────────────────────────────── */
const PALETTE = [
  { bg:'#ffedd5', color:'#c2410c' },
  { bg:'#dbeafe', color:'#1e40af' },
  { bg:'#e0e7ff', color:'#4338ca' },
  { bg:'#fef08a', color:'#854d0e' },
  { bg:'#d1fae5', color:'#065f46' },
  { bg:'#fce7f3', color:'#be185d' },
];

function initials(name) {
  return (name || '').trim().split(' ').filter(Boolean).map(w => w[0]).join('').substring(0, 2).toUpperCase() || '??';
}

/* ═══════════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════════ */
export default function AdminHiring() {
  const [requests, setRequests] = useState(() => {
    const s = localStorage.getItem('zangmo_hiring_requests');
    if (s) { try { return JSON.parse(s); } catch {} }
    return [
      { id: 1, name: 'Tandin Dorji',     role: 'Kitchen Helper', branch: 'Mehdi Kitchen (Main)', wage: 12, justification: 'Need help with morning prep shifts. Current team is overwhelmed during peak hours.', status: 'Pending',  date: 'May 24, 2026' },
      { id: 2, name: 'Dechen Wangmo',    role: 'Head Chef',      branch: 'Zangmo Kitchen',       wage: 25, justification: 'Senior chef resigned unexpectedly. Need immediate replacement for dinner service quality.', status: 'Pending',  date: 'May 23, 2026' },
      { id: 3, name: 'Passang Tshering', role: 'Waiter',         branch: 'Mehdi Kitchen (Main)', wage: 10, justification: 'Weekend and holiday rush coverage needed. Current staff cannot manage tables alone.', status: 'Approved', date: 'May 18, 2026' },
    ];
  });

  const [branchF, setBranchF] = useState('All');
  const [statusF, setStatusF] = useState('All');
  const [toast, setToast]     = useState({ show: false, msg: '', type: 'success' });

  useEffect(() => { localStorage.setItem('zangmo_hiring_requests', JSON.stringify(requests)); }, [requests]);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3200);
  };

  const approve = (id, name) => {
    setRequests(p => p.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    showToast(`Hiring request for ${name} has been approved.`);
  };
  const reject = (id, name) => {
    setRequests(p => p.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    showToast(`Hiring request for ${name} has been rejected.`, 'error');
  };
  const remove = (id, name) => {
    if (!window.confirm(`Delete the record for "${name}"?`)) return;
    setRequests(p => p.filter(r => r.id !== id));
    showToast(`Record for ${name} deleted.`, 'error');
  };

  const filtered = requests.filter(r => {
    const mb = branchF === 'All' || r.branch === branchF;
    const ms = statusF === 'All' || r.status === statusF;
    return mb && ms;
  });

  const stats = [
    { label: 'Total Requests', value: requests.length,                                   Icon: Ico.Clipboard,   ico_bg:'#f3f4f6', ico_c:'#374151', border:'#e0e3e6' },
    { label: 'Pending Action', value: requests.filter(r => r.status === 'Pending').length,  Icon: Ico.Clock,       ico_bg:'#fff7ed', ico_c:'#c2410c', border:'#fc8f34' },
    { label: 'Approved',       value: requests.filter(r => r.status === 'Approved').length, Icon: Ico.CheckCircle, ico_bg:'#ecfdf5', ico_c:'#059669', border:'#10b981' },
    { label: 'Rejected',       value: requests.filter(r => r.status === 'Rejected').length, Icon: Ico.XCircle,     ico_bg:'#fef2f2', ico_c:'#dc2626', border:'#ef4444' },
  ];

  return (
    <div className="dashboard">
      <style>{S}</style>
      <AdminSidebar activePage="hiring" />

      <div className="main-content">
        <Topbar title="Staff Hiring Approvals" />

        <div className="page-content" style={{ overflowY: 'auto', background: '#f7f9fc' }}>

          {/* Hero */}
          <div className="ha-hero">
            <div>
              <div className="ha-hero-eyebrow"><Ico.Shield /> Admin Review Panel</div>
              <h1>Staff Hiring Approvals</h1>
              <p>Review, approve, or reject staffing requests submitted by branch managers. Decisions are reflected immediately across branch operations.</p>
            </div>
          </div>

          {/* KPI Stats */}
          <div className="ha-stats">
            {stats.map((s, i) => (
              <div key={i} className="ha-stat" style={{ borderLeftColor: s.border, animationDelay: `${i * 0.06}s` }}>
                <div className="ha-stat-top">
                  <span className="ha-stat-label">{s.label}</span>
                  <div className="ha-stat-ico" style={{ background: s.ico_bg, color: s.ico_c }}>
                    <s.Icon />
                  </div>
                </div>
                <p className="ha-stat-value">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="ha-toolbar">
            <span className="ha-toolbar-title">Hiring Petitions</span>
            <Ico.Filter />
            <select className="ha-select" value={branchF} onChange={e => setBranchF(e.target.value)}>
              <option value="All">All Branches</option>
              <option value="Mehdi Kitchen (Main)">Mehdi Kitchen (Main)</option>
              <option value="Zangmo Kitchen">Zangmo Kitchen</option>
            </select>
            <select className="ha-select" value={statusF} onChange={e => setStatusF(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <span className="ha-count">{filtered.length} of {requests.length} request{requests.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="ha-empty">
              <div className="ha-empty-ico"><Ico.Empty /></div>
              <h3>No requests found</h3>
              <p>No hiring requests match your current filters. Try changing branch or status.</p>
            </div>
          ) : (
            <div className="ha-cards">
              {filtered.map((req, idx) => {
                const pal = PALETTE[idx % PALETTE.length];
                const isP = req.status === 'Pending';
                const isA = req.status === 'Approved';
                return (
                  <div key={req.id} className="ha-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                    {/* Top accent line */}
                    <div className={`ha-accent-line ha-accent-${req.status.toLowerCase()}`} />

                    <div className="ha-card-body">
                      {/* Left */}
                      <div className="ha-card-left">
                        {/* Avatar */}
                        <div className="ha-avatar" style={{ background: pal.bg, color: pal.color }}>
                          {initials(req.name)}
                        </div>

                        <div className="ha-card-content">
                          {/* Name row */}
                          <div className="ha-card-name-row">
                            <h4 className="ha-name">{req.name}</h4>
                            <span className="ha-role-pill">{req.role}</span>
                            <span className="ha-date"><Ico.Calendar /> {req.date}</span>
                          </div>

                          {/* Meta */}
                          <div className="ha-card-meta">
                            <div className="ha-meta-item">
                              <Ico.MapPin />
                              <span>Branch: <span className="ha-meta-val">{req.branch}</span></span>
                            </div>
                            <div className="ha-meta-item">
                              <Ico.DollarSign />
                              <span>Proposed Wage: <span className="ha-meta-val" style={{ color: '#c2410c' }}>Nu {req.wage}/hr</span></span>
                            </div>
                          </div>

                          {/* Justification */}
                          <div className="ha-justification">
                            <strong>Manager's Justification: </strong>{req.justification}
                          </div>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="ha-card-right">
                        {/* Status badge */}
                        <span className={`ha-status-badge ha-badge-${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>

                        {/* Action buttons */}
                        <div className="ha-actions">
                          {isP ? (
                            <>
                              <button className="ha-btn-reject" onClick={() => reject(req.id, req.name)}>
                                <Ico.X /> Reject
                              </button>
                              <button className="ha-btn-approve" onClick={() => approve(req.id, req.name)}>
                                <Ico.Check /> Approve
                              </button>
                            </>
                          ) : (
                            <button className="ha-btn-delete" onClick={() => remove(req.id, req.name)}>
                              <Ico.Trash /> Delete Record
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <div className={`ha-toast ha-toast-${toast.type}`}>
          {toast.type === 'success' ? <Ico.CheckCircle /> : <Ico.XCircle />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
