import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/users.css';
import '../../assets/styles/dashboard.css';

/* ── localStorage helper ────────────────────────────────── */
const loadLS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback) && !Array.isArray(parsed)) {
      return fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
};

/* ── Demo / fallback data ───────────────────────────────── */
const DEMO_TRANSACTIONS = [
  { id: 1, orderId: 'Order #8922', type: 'Dining',   items: 4, timestamp: '2026-05-25 12:45 PM', amount: 53.125, status: 'Paid', branch: 'Mehdi Kitchen (Main)' },
  { id: 2, orderId: 'Order #8921', type: 'Takeaway', items: 2, timestamp: '2026-05-25 11:15 AM', amount: 14.0,   status: 'Paid', branch: 'Mehdi Kitchen (Main)' },
  { id: 3, orderId: 'Order #8920', type: 'Dining',   items: 8, timestamp: '2026-05-25 09:45 AM', amount: 228.75, status: 'Credit', branch: 'Mehdi Kitchen (Main)' },
  { id: 4, orderId: 'Order #8919', type: 'Takeaway', items: 3, timestamp: '2026-05-25 09:10 AM', amount: 35.0,   status: 'Pending', branch: 'Zangmo Kitchen' },
  { id: 5, orderId: 'Order #8918', type: 'Dining',   items: 6, timestamp: '2026-05-25 08:30 AM', amount: 117.5,  status: 'Paid', branch: 'Zangmo Kitchen' },
];
const DEMO_EXPENSES = [
  { id: 1, status: 'Pending',  category: 'Utilities', branch: 'Mehdi Kitchen (Main)' },
  { id: 2, status: 'Approved', category: 'Inventory', branch: 'Mehdi Kitchen (Main)' },
  { id: 3, status: 'Pending',  category: 'Salaries', branch: 'Zangmo Kitchen' },
];
const DEMO_CREDIT = [
  { id: 1, customer: 'Organic Spice Co.',  amount: 156.25, status: 'Overdue', daysOverdue: 15, branch: 'Mehdi Kitchen (Main)' },
  { id: 2, customer: 'Kitchen Equip Ltd.', amount: 102.5,  status: 'Overdue', daysOverdue: 4,  branch: 'Mehdi Kitchen (Main)' },
  { id: 3, customer: 'Al-Baraka Meats',    amount: 275.0,  status: 'Unpaid',  daysOverdue: 0,  branch: 'Zangmo Kitchen' },
];
const DEMO_EMPLOYEES = [
  { id: 1, name: 'Zangmo Wangchuck', status: 'Active', branch: 'Zangmo Kitchen' },
  { id: 2, name: 'Rahul Sharma',     status: 'Active', branch: 'Mehdi Kitchen (Main)' },
  { id: 3, name: 'Sunita Rai',       status: 'On Leave', branch: 'Zangmo Kitchen' },
  { id: 4, name: 'Asad Khan',        status: 'Active', branch: 'Mehdi Kitchen (Main)' },
  { id: 5, name: 'Fatima Malik',     status: 'Active', branch: 'Mehdi Kitchen (Main)' },
];

const BAR_HEIGHTS = [120, 155, 140, 195, 170, 215, 42];
const BAR_DAYS    = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const BAR_VALUES_PKR = ['Rs.38K', 'Rs.48K', 'Rs.44K', 'Rs.60K', 'Rs.53K', 'Rs.67K', 'Rs.12K'];

const LOW_STOCK_ITEMS = [
  { name: 'Chicken (Fresh)',   last: '2 days ago',  qty: '5 KG',   min: '15 KG'   },
  { name: 'Saffron (Premium)', last: '14 days ago', qty: '45g',    min: '200g'    },
  { name: 'Basmati Rice',      last: '5 days ago',  qty: '2 Bags', min: '10 Bags' },
];

const DONUT_LEGEND = [
  { color: '#162839', label: 'Inventory' },
  { color: '#fc8f34', label: 'Salaries'  },
  { color: '#f59e0b', label: 'Utilities' },
  { color: '#cbd5e1', label: 'Other'     },
];

/* ── SVG icon components (no font dependency) ─────────────── */
const IconTrendUp = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const IconWallet = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
const IconGroup = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const IconRule = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </svg>
);
const IconBag = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);
const IconReceipt = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);
const IconWarning = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IconClock = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const ChevronDown = () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>;

/* ── Status tag helper ──────────────────────────────────── */
const statusClass = (s) => {
  if (s === 'Paid')   return 'paid';
  if (s === 'Credit') return 'credit';
  return 'pending';
};

/* ══════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════ */
export default function OwnerDashboard() {
  const navigate = useNavigate();

  const [employees,     setEmployees]     = useState(() => loadLS('zangmo_staff_list',        DEMO_EMPLOYEES));
  const [expenses,      setExpenses]      = useState(() => loadLS('zangmo_expenses',           DEMO_EXPENSES));
  const [creditEntries, setCreditEntries] = useState(() => loadLS('zangmo_credit_entries',     DEMO_CREDIT));
  const [transactions,  setTransactions]  = useState(() => loadLS('zangmo_sales_transactions', DEMO_TRANSACTIONS));
  const [activeBarView, setActiveBarView] = useState('Weekly');
  const [toast, setToast]                 = useState(null);
  const [currency, setCurrency]           = useState(() => {
    return localStorage.getItem('zangmo_default_currency') || 'Rs.';
  });
  const [branches, setBranches]           = useState(() => {
    const saved = localStorage.getItem('zangmo_branches');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      { id: 1, title: 'Mehdi Kitchen (Main)', status: 'Operational' },
      { id: 2, title: 'Zangmo Kitchen',       status: 'Operational' }
    ];
  });
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [userName, setUserName]           = useState(() => {
    return localStorage.getItem('zangmo_logged_user_name') || 'Mehdi Khan';
  });

  /* Sync from localStorage every 2 s */
  useEffect(() => {
    const sync = () => {
      setEmployees(    loadLS('zangmo_staff_list',        DEMO_EMPLOYEES));
      setExpenses(     loadLS('zangmo_expenses',          DEMO_EXPENSES));
      setCreditEntries(loadLS('zangmo_credit_entries',    DEMO_CREDIT));
      setTransactions( loadLS('zangmo_sales_transactions',DEMO_TRANSACTIONS));
      setCurrency(     localStorage.getItem('zangmo_default_currency') || 'Rs.');
      setUserName(     localStorage.getItem('zangmo_logged_user_name') || 'Mehdi Khan');
      const savedBranches = localStorage.getItem('zangmo_branches');
      if (savedBranches) { try { setBranches(JSON.parse(savedBranches)); } catch (e) {} }
    };
    window.addEventListener('storage', sync);
    const iv = setInterval(sync, 2000);
    return () => { window.removeEventListener('storage', sync); clearInterval(iv); };
  }, []);

  /* ── Currency Formatter matching AdminDashboard ── */
  const formatMoney = (amountUSD) => {
    if (currency === '$') {
      return `$${amountUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      const pkrAmount = amountUSD * 80;
      return `PKR ${pkrAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
  };

  const formatShortMoney = (amountUSD) => {
    if (currency === '$') {
      return `$${amountUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    } else {
      const pkrAmount = Math.round(amountUSD * 80);
      return `PKR ${pkrAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
  };

  /* Filter lists based on selected branch */
  const branchFilteredTxns = selectedBranch === 'All' 
    ? transactions 
    : transactions.filter(t => t && t.branch === selectedBranch);

  const branchFilteredEmployees = selectedBranch === 'All' 
    ? employees 
    : employees.filter(e => e && e.branch === selectedBranch);

  const branchFilteredExpenses = selectedBranch === 'All' 
    ? expenses 
    : expenses.filter(e => e && e.branch === selectedBranch);

  const branchFilteredCredit = selectedBranch === 'All' 
    ? creditEntries 
    : creditEntries.filter(c => c && c.branch === selectedBranch);

  /* Derived values */
  const pendingExpenses   = branchFilteredExpenses.filter(e => e && e.status === 'Pending').length;
  const outstandingCredit = branchFilteredCredit.filter(e => e && e.status !== 'Paid').reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const overdueCredit     = branchFilteredCredit.filter(e => e && e.status === 'Overdue').length;
  
  // Calculate today's revenue
  const todayRevenue      = branchFilteredTxns.filter(t => t && (t.status === 'Paid' || !t.status)).reduce((s, t) => s + (Number(t.amount) || 0), 0);

  const activeEmployees   = branchFilteredEmployees.filter(e => e && e.status === 'Active').length;
  const onLeaveEmployees  = branchFilteredEmployees.filter(e => e && e.status === 'On Leave').length;
  const recentTxns        = branchFilteredTxns.slice(0, 5);

  // Calculate dynamic sales trend data based on Daily/Weekly view and branch filter
  const getChartData = () => {
    const isWeekly = activeBarView === 'Weekly';
    
    // Sum total paid sales in selected branch to seed/influence the chart
    const totalPaidSales = branchFilteredTxns
      .filter(t => t.status === 'Paid' || !t.status)
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Branch modifier based on selection
    const branchRatio = selectedBranch === 'All'
      ? 1.0
      : selectedBranch.toLowerCase().includes('mehdi') ? 0.65 : 0.35;

    if (isWeekly) {
      // Weekly View (4 Weeks)
      const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const baseWeeklyUSD = [1200, 1450, 1300, 1600];
      const dbSalesModifier = totalPaidSales > 0 ? (totalPaidSales / 300) : 1.0;
      
      const usdValues = baseWeeklyUSD.map(val => Math.round(val * branchRatio * dbSalesModifier));
      const maxVal = Math.max(...usdValues, 1);
      const heights = usdValues.map(v => Math.round((v / maxVal) * 170));
      
      const formattedValues = usdValues.map(v => formatShortMoney(v));

      return { labels, heights, values: formattedValues, maxVal };
    } else {
      // Daily View (7 Days)
      const labels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
      const baseDailyUSD = [150, 200, 180, 250, 220, 280, 85];
      const dbSalesModifier = totalPaidSales > 0 ? (totalPaidSales / 300) : 1.0;
      
      const usdValues = baseDailyUSD.map(val => Math.round(val * branchRatio * dbSalesModifier));
      const maxVal = Math.max(...usdValues, 1);
      const heights = usdValues.map(v => Math.round((v / maxVal) * 170));
      
      const formattedValues = usdValues.map(v => formatShortMoney(v));

      return { labels, heights, values: formattedValues, maxVal };
    }
  };

  const chartData = getChartData();
  const barMax            = chartData.maxVal;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── KPI card data ── */
  const KPI_CARDS = [
    {
      label: "Today's Sales", value: formatMoney(todayRevenue),
      badge: '+12.5%', badgeClass: 'green', note: 'from yesterday',
      accent: '#10b981', iconBg: '#ecfdf5', iconColor: '#10b981', Icon: IconTrendUp,
    },
    {
      label: 'Outstanding Credit', value: formatMoney(outstandingCredit),
      badge: 'High Priority', badgeClass: 'red', note: `${overdueCredit} overdue`,
      accent: '#ef4444', iconBg: '#fff0f0', iconColor: '#ef4444', Icon: IconWallet,
    },
    {
      label: 'Total Employees', value: String(branchFilteredEmployees.length),
      badge: `${activeEmployees} active`, badgeClass: 'blue', note: `${onLeaveEmployees} on leave`,
      accent: '#3b82f6', iconBg: '#eff6ff', iconColor: '#3b82f6', Icon: IconGroup,
    },
    {
      label: 'Pending Approvals', value: String(pendingExpenses).padStart(2, '0'),
      badge: 'Action Required', badgeClass: 'orange', note: `${pendingExpenses} expenses`,
      accent: '#fc8f34', iconBg: '#fff7ed', iconColor: '#fc8f34', Icon: IconRule,
    },
  ];

  const BADGE_STYLES = {
    green:  { background: '#ecfdf5', color: '#065f46' },
    red:    { background: '#fff0f0', color: '#991b1b' },
    blue:   { background: '#eff6ff', color: '#1d4ed8' },
    orange: { background: '#fff7ed', color: '#9a3412' },
  };

  const firstName = userName ? userName.split(' ')[0] : 'Owner';

  return (
    <div className="dashboard">
      <AdminSidebar activePage="dashboard" />

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Topbar title="Owner Dashboard" />

        <div className="dashboard-page-content" style={{ background: '#f4f6fa' }}>

          {/* Humanised greeting header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#162839', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
                Good morning, {firstName}!
              </h1>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                Here's what's happening across your branches today. Keep up the great work!
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Branch Selector Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>View Branch</span>
                <div className="dashboard-branch-dropdown-container">
                  <button 
                    className="dashboard-branch-dropdown-btn"
                    onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                  >
                    <span>{selectedBranch === 'All' ? 'All Branches' : selectedBranch}</span>
                    <ChevronDown />
                  </button>
                  {showBranchDropdown && (
                    <>
                      <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setShowBranchDropdown(false)} />
                      <div className="dashboard-branch-dropdown-menu">
                        <div 
                          className={`dashboard-branch-option ${selectedBranch === 'All' ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedBranch('All');
                            setShowBranchDropdown(false);
                          }}
                        >
                          All Branches
                        </div>
                        {branches.map(b => (
                          <div 
                            key={b.id}
                            className={`dashboard-branch-option ${selectedBranch === b.title ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedBranch(b.title);
                              setShowBranchDropdown(false);
                            }}
                          >
                            {b.title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Date pill */}
              <div style={{ background: '#fff', border: '1px solid #e4e8ef', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, color: '#1e293b', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                System Live • {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Toast */}
          {toast && (
            <div style={{
              position: 'fixed', top: 80, right: 28, zIndex: 9999,
              padding: '12px 22px', borderRadius: 10, fontWeight: 700, fontSize: 13,
              background: toast.type === 'success' ? '#ecfdf5' : '#fff0f0',
              color:      toast.type === 'success' ? '#065f46' : '#991b1b',
              border:     `1px solid ${toast.type === 'success' ? '#10b981' : '#ef4444'}`,
              boxShadow:  '0 8px 24px rgba(0,0,0,0.12)',
            }}>
              {toast.type === 'success' ? '✓' : '⚠'} {toast.msg}
            </div>
          )}

          {/* ════ KPI CARDS ════ */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
            {KPI_CARDS.map(({ label, value, badge, badgeClass, note, accent, iconBg, iconColor, Icon }) => (
              <div key={label} style={{
                background: '#fff', border: '1px solid #e4e8ef', borderRadius: 10,
                padding: '18px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                borderBottom: `3px solid ${accent}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#8a94a6', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                    {label}
                  </p>
                  <span style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, color: iconColor, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon />
                  </span>
                </div>
                <p style={{ fontSize: 22, fontWeight: 800, color: '#162839', letterSpacing: '-0.02em', margin: 0, lineHeight: 1 }}>
                  {value}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 999, ...BADGE_STYLES[badgeClass] }}>
                    {badge}
                  </span>
                  <span style={{ fontSize: 11, color: '#9aa4b2' }}>{note}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ════ CHARTS ROW ════ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, marginBottom: 20 }}>

            {/* Bar Chart */}
            <div style={{ background: '#fff', border: '1px solid #e4e8ef', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#162839', margin: 0 }}>
                  {activeBarView === 'Weekly' ? 'Sales Trend (Weekly)' : 'Sales Trend (Last 7 Days)'}
                </h2>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['Daily', 'Weekly'].map(v => (
                    <button
                      key={v}
                      onClick={() => setActiveBarView(v)}
                      style={{
                        padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none',
                        background: activeBarView === v ? '#162839' : '#f1f5f9',
                        color:      activeBarView === v ? '#fff'    : '#64748b',
                        transition: 'background 0.15s, color 0.15s',
                      }}
                    >{v}</button>
                  ))}
                </div>
              </div>
              <div style={{ padding: '16px 20px 20px' }}>
                <div style={{ position: 'relative', height: 200, display: 'flex', alignItems: 'flex-end', gap: 8, borderBottom: '1px solid #edf0f5', paddingBottom: 0 }}>
                  {/* Grid lines */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, borderTop: '1px dashed #edf0f5', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px dashed #edf0f5', pointerEvents: 'none' }} />
                  {chartData.heights.map((h, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                      <div
                        title={`${chartData.labels[i]}: ${chartData.values[i]}`}
                        style={{
                          width: '100%',
                          height: `${h}px`,
                          borderRadius: '5px 5px 0 0',
                          background: i === chartData.heights.length - 1
                            ? 'linear-gradient(180deg,#f7c9a0 0%,#fba96d 100%)'
                            : 'linear-gradient(180deg,#fc8f34 0%,#f97316 100%)',
                          transition: 'opacity 0.15s',
                          cursor: 'pointer',
                          minHeight: 4,
                        }}
                      />
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#9aa4b2', letterSpacing: '0.04em', paddingBottom: 4 }}>
                        {chartData.labels[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Expense Donut */}
            <div style={{ background: '#fff', border: '1px solid #e4e8ef', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px 0' }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#162839', margin: 0 }}>Expense Breakdown</h2>
              </div>
              <div style={{ padding: '14px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ position: 'relative', width: 130, height: 130 }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'conic-gradient(#162839 0% 45%, #fc8f34 45% 70%, #f59e0b 70% 85%, #cbd5e1 85% 100%)' }} />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 76, height: 76, background: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}>
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: '#9aa4b2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#162839' }}>{expenses.length} exp</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', width: '100%' }}>
                  {DONUT_LEGEND.map(({ color, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11.5, color: '#5a6676', fontWeight: 500 }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ════ BOTTOM ROW ════ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>

            {/* Recent Transactions */}
            <div style={{ background: '#fff', border: '1px solid #e4e8ef', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '14px 20px', background: '#f8fafc', borderBottom: '1px solid #e4e8ef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#162839', margin: 0 }}>Recent Transactions</h2>
                <button onClick={() => navigate('/admin/expenses')} style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 700, color: '#fc8f34', cursor: 'pointer', padding: 0 }}>
                  View All →
                </button>
              </div>
              <div>
                {recentTxns.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 16px', color: '#9aa4b2', fontSize: 13 }}>No transactions yet.</div>
                ) : recentTxns.map(t => {
                  const statusVal = t.status || 'Paid';
                  const isIncome = statusVal === 'Paid';
                  
                  // Safe timestamp handling
                  let time = '';
                  if (typeof t.timestamp === 'string') {
                    time = t.timestamp.split(' ').slice(1).join(' ');
                  } else if (t.date) {
                    time = t.date;
                  }
                  
                  return (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ width: 38, height: 38, borderRadius: 8, background: isIncome ? '#ecfdf5' : '#fff0f0', color: isIncome ? '#10b981' : '#ef4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {isIncome ? <IconBag /> : <IconReceipt />}
                        </span>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', margin: '0 0 2px' }}>{t.orderId || `#${t.ticketNo}`}</p>
                          <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{t.type || 'Sale'} • {t.items || t.itemsCount || 0} items • {time}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 13, fontWeight: 800, color: isIncome ? '#10b981' : '#ef4444', margin: '0 0 3px', fontFamily: 'monospace' }}>
                          {isIncome ? '+' : '−'} {formatMoney(t.amount)}
                        </p>
                        <span style={{
                          display: 'inline-block', fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 999, letterSpacing: '0.04em',
                          ...(statusVal === 'Paid'   ? { background: '#ecfdf5', color: '#065f46' } :
                              statusVal === 'Credit' ? { background: '#fefce8', color: '#854d0e' } :
                                                       { background: '#fff0f0', color: '#991b1b' }),
                        }}>
                          {statusVal.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Alerts column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Low Stock Alert */}
              <div style={{ background: '#fff', border: '1px solid #e4e8ef', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #fde8e8', background: '#fff9f9', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#ef4444', display: 'inline-flex' }}><IconWarning /></span>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: '#162839', margin: 0 }}>Low Stock Alerts</h3>
                </div>
                <div style={{ padding: '12px 16px' }}>
                  {LOW_STOCK_ITEMS.map(item => (
                    <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <div>
                        <p style={{ fontSize: 12.5, fontWeight: 600, color: '#1e293b', margin: '0 0 1px' }}>{item.name}</p>
                        <p style={{ fontSize: 10.5, color: '#94a3b8', margin: 0 }}>Last Restock: {item.last}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 12.5, fontWeight: 800, color: '#ef4444', margin: '0 0 1px', fontFamily: 'monospace' }}>{item.qty}</p>
                        <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>Min: {item.min}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => showToast('Purchase order generated!', 'success')}
                    style={{ width: '100%', marginTop: 12, padding: '9px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none', background: '#162839', color: '#fff', boxShadow: '0 3px 10px rgba(22,40,57,0.22)' }}
                  >
                    Generate Purchase Order
                  </button>
                </div>
              </div>

              {/* Overdue Vendor Payments */}
              <div style={{ background: '#fff', border: '1px solid #e4e8ef', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #e4e8ef', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#fc8f34', display: 'inline-flex' }}><IconClock /></span>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: '#162839', margin: 0 }}>Overdue Vendor Payments</h3>
                </div>
                <div style={{ padding: '12px 16px' }}>
                  {creditEntries.filter(c => c.status === 'Overdue').slice(0, 2).map(c => (
                    <div key={c.id} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e4e8ef', background: '#f8fafc', marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                        <p style={{ fontSize: 12.5, fontWeight: 700, color: '#1e293b', margin: 0 }}>{c.customer}</p>
                        <span style={{ fontSize: 9, fontWeight: 800, color: '#ef4444', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                          {c.daysOverdue ? `${c.daysOverdue} DAYS OVERDUE` : 'OVERDUE'}
                        </span>
                      </div>
                      <p style={{ fontSize: 12.5, fontWeight: 700, color: '#162839', fontFamily: 'monospace', margin: 0 }}>
                        {formatMoney(c.amount)}
                      </p>
                    </div>
                  ))}
                  {creditEntries.filter(c => c.status === 'Overdue').length === 0 && (
                    <p style={{ textAlign: 'center', padding: '12px 0', color: '#9aa4b2', fontSize: 13 }}>No overdue payments.</p>
                  )}
                  <button
                    onClick={() => navigate('/admin/expenses')}
                    style={{ width: '100%', marginTop: 8, padding: '9px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: 'transparent', color: '#fc8f34', border: '2px solid #fc8f34' }}
                  >
                    Go to Accounts Payable →
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>{/* scroll container */}
      </div>{/* main-content */}
    </div>
  );
}
