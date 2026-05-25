import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/users.css';
import '../../assets/styles/dashboard.css';

export default function AdminDashboard() {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('zangmo_default_currency') || 'Rs.';
  });

  const [hiringRequests, setHiringRequests] = useState(() => {
    const saved = localStorage.getItem('zangmo_hiring_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: 1, name: 'Tandin Dorji', role: 'Kitchen Helper', branch: 'Mehdi Kitchen (Main)', wage: 12, justification: 'Need help with morning prep shifts.', status: 'Pending', date: 'May 24, 2026' },
      { id: 2, name: 'Dechen Wangmo', role: 'Head Chef', branch: 'Zangmo Kitchen', wage: 25, justification: 'Senior chef resigned, need immediate replacement.', status: 'Pending', date: 'May 23, 2026' }
    ];
  });

  const [salesTransactions, setSalesTransactions] = useState(() => {
    const saved = localStorage.getItem('zangmo_sales_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: 1, ticketNo: '8801', branch: 'Mehdi Kitchen (Main)', amount: 12450.00, date: 'May 23, 2026', itemsCount: 80 },
      { id: 2, ticketNo: '8802', branch: 'Mehdi Kitchen (Main)', amount: 8200.00, date: 'May 24, 2026', itemsCount: 40 },
      { id: 3, ticketNo: '8803', branch: 'Mehdi Kitchen (Main)', amount: 4000.00, date: 'May 25, 2026', itemsCount: 22 },
      { id: 4, ticketNo: '8804', branch: 'Zangmo Kitchen', amount: 10150.00, date: 'May 24, 2026', itemsCount: 65 },
      { id: 5, ticketNo: '8805', branch: 'Zangmo Kitchen', amount: 8092.50, date: 'May 25, 2026', itemsCount: 53 }
    ];
  });

  const [staffList, setStaffList] = useState(() => {
    const saved = localStorage.getItem('zangmo_staff_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: 1, staffId: 'ZM-4902', name: 'Zangmo Wangchuck', role: 'Manager', branch: 'Zangmo Kitchen', lastLogin: '2026-05-25 09:12', avatarClass: 'avatar-1' },
      { id: 2, staffId: 'ZM-8831', name: 'Rahul Sharma', role: 'Staff', branch: 'Mehdi Kitchen (Main)', lastLogin: '2026-05-25 08:45', avatarClass: 'avatar-2' },
      { id: 3, staffId: 'ZM-2309', name: 'Sunita Rai', role: 'Staff', branch: 'Zangmo Kitchen', lastLogin: '2026-05-25 06:30', avatarClass: 'avatar-3' },
      { id: 4, staffId: 'ZM-1044', name: 'Asad Khan', role: 'Staff', branch: 'Mehdi Kitchen (Main)', lastLogin: '2026-05-25 02:40', avatarClass: 'avatar-4' }
    ];
  });

  const [inventoryItems, setInventoryItems] = useState(() => {
    const saved = localStorage.getItem('zangmo_inventory_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [branches, setBranches] = useState(() => {
    const saved = localStorage.getItem('zangmo_branches');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: 1, title: 'Mehdi Kitchen (Main)', status: 'Operational' },
      { id: 2, title: 'Zangmo Kitchen', status: 'Operational' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('zangmo_hiring_requests', JSON.stringify(hiringRequests));
  }, [hiringRequests]);

  useEffect(() => {
    const syncData = () => {
      setCurrency(localStorage.getItem('zangmo_default_currency') || 'Rs.');

      const savedSales = localStorage.getItem('zangmo_sales_transactions');
      if (savedSales) {
        try { setSalesTransactions(JSON.parse(savedSales)); } catch (e) {}
      }

      const savedHiring = localStorage.getItem('zangmo_hiring_requests');
      if (savedHiring) {
        try { setHiringRequests(JSON.parse(savedHiring)); } catch (e) {}
      }

      const savedStaff = localStorage.getItem('zangmo_staff_list');
      if (savedStaff) {
        try { setStaffList(JSON.parse(savedStaff)); } catch (e) {}
      }

      const savedInv = localStorage.getItem('zangmo_inventory_items');
      if (savedInv) {
        try { setInventoryItems(JSON.parse(savedInv)); } catch (e) {}
      }

      const savedBranches = localStorage.getItem('zangmo_branches');
      if (savedBranches) {
        try { setBranches(JSON.parse(savedBranches)); } catch (e) {}
      }
    };

    window.addEventListener('storage', syncData);
    const interval = setInterval(syncData, 2000);

    return () => {
      window.removeEventListener('storage', syncData);
      clearInterval(interval);
    };
  }, []);

  const formatValue = (amountUSD) => {
    if (currency === '$') {
      return `$${amountUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      const pkrAmount = amountUSD * 80;
      return `Rs. ${pkrAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
  };

  const formatShortValue = (amountUSD) => {
    if (currency === '$') {
      return `$${amountUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    } else {
      const pkrAmount = Math.round(amountUSD * 80);
      return `Rs. ${pkrAmount.toLocaleString()}`;
    }
  };

  const handleApproveHiring = (id) => {
    setHiringRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Approved' } : req));
  };

  const handleRejectHiring = (id) => {
    setHiringRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Rejected' } : req));
  };

  const pendingHiringCount = hiringRequests.filter(r => r.status === 'Pending').length;

  // Computations
  const totalRevenue = salesTransactions.reduce((sum, s) => sum + s.amount, 0);

  const activeBranchesCount = branches.filter(b => b.status === 'Operational').length;
  const totalBranchesCount = branches.length || 2;
  const branchCapacityPct = totalBranchesCount > 0 ? Math.round((activeBranchesCount / totalBranchesCount) * 100) : 0;

  const getBranchPrepTime = (branchName) => {
    if (branchName.toLowerCase().includes('mehdi')) return 765; // 12m 45s
    if (branchName.toLowerCase().includes('zangmo')) return 970; // 16m 10s
    return 900; // 15m
  };

  const activeBranches = branches.filter(b => b.status === 'Operational');
  const avgPrepSeconds = activeBranches.length > 0
    ? activeBranches.reduce((sum, b) => sum + getBranchPrepTime(b.title), 0) / activeBranches.length
    : 867.5; // default 14m 27s

  const mins = Math.floor(avgPrepSeconds / 60);
  const secs = Math.round(avgPrepSeconds % 60);
  const formattedEfficiency = `${mins}m ${secs}s`;

  const getBranchLaborCost = (branchName) => {
    if (branchName.toLowerCase().includes('mehdi')) return 17.5;
    if (branchName.toLowerCase().includes('zangmo')) return 19.1;
    return 18.0;
  };
  const avgLaborCost = activeBranches.length > 0
    ? (activeBranches.reduce((sum, b) => sum + getBranchLaborCost(b.title), 0) / activeBranches.length).toFixed(1) + '%'
    : '18.3%';

  const getBranchStats = (branchName) => {
    const isZangmo = branchName.toLowerCase().includes('zangmo');
    const branchSales = salesTransactions.filter(s => 
      s.branch.toLowerCase().includes(branchName.toLowerCase()) || 
      branchName.toLowerCase().includes(s.branch.toLowerCase())
    );
    
    const revenue = branchSales.reduce((sum, s) => sum + s.amount, 0);
    const orders = branchSales.length;
    const avgCheck = orders > 0 ? (revenue / orders) : (isZangmo ? 38.45 : 42.10);
    
    const staff = staffList.filter(s => 
      s.branch.toLowerCase().includes(branchName.toLowerCase()) || 
      branchName.toLowerCase().includes(s.branch.toLowerCase())
    ).length;

    return {
      revenue,
      orders,
      avgCheck,
      staff,
      waste: isZangmo ? '2.4%' : '1.2%',
      wasteTrend: isZangmo ? 'WATCHLIST' : 'OPTIMAL',
      wasteTrendClass: isZangmo ? 'down' : 'up'
    };
  };

  const mehdiStats = getBranchStats('Mehdi Kitchen (Main)');
  const zangmoStats = getBranchStats('Zangmo Kitchen');

  const getDynamicAlerts = () => {
    const alerts = [];
    
    // 1. Inventory Alerts
    try {
      const lowStockItems = inventoryItems.filter(item => item.stock <= item.reorderPoint);
      lowStockItems.forEach(item => {
        const severity = item.stock === 0 ? 'critical' : 'warning';
        alerts.push({
          id: `inv-${item.id}`,
          type: severity,
          icon: 'inventory',
          title: item.stock === 0 ? `Out of Stock: ${item.name}` : `Low Stock: ${item.name}`,
          desc: `Inventory level is ${item.stock} ${item.unit} (reorder threshold: ${item.reorderPoint} ${item.unit}).`,
          time: 'Just now'
        });
      });
    } catch (e) {
      console.error(e);
    }

    // 2. Pending Hiring Alerts
    try {
      const pendingHiring = hiringRequests.filter(req => req.status === 'Pending');
      pendingHiring.forEach(req => {
        alerts.push({
          id: `hire-${req.id}`,
          type: 'info',
          icon: 'work',
          title: `Pending Hire: ${req.name}`,
          desc: `Hiring request for ${req.role} at ${req.branch}. Wage: $${req.wage}/hr.`,
          time: 'Just now'
        });
      });
    } catch (e) {
      console.error(e);
    }

    // Fallbacks if no inventory or hiring alerts
    if (alerts.length === 0) {
      return [
        { id: 'f1', type: 'critical', icon: 'inventory', title: 'Low Stock: Organic Salmon', desc: 'Inventory level at Mehdi Kitchen below safety threshold (8kg remaining). Automatic reorder failed.', time: '12m ago' },
        { id: 'f2', type: 'warning', icon: 'rule', title: 'Pending Approval: Refund Request', desc: 'Table 12, Waiter: Sarah J. Requesting $14.50 refund for overcooked steak.', time: '28m ago' },
        { id: 'f3', type: 'info', icon: 'schedule', title: 'Kitchen Delay Warning', desc: 'Average preparation time at Zangmo Kitchen exceeded 25 minutes during peak hour.', time: '1h ago' }
      ];
    }

    return alerts;
  };

  const dynamicAlerts = getDynamicAlerts();
  const criticalAlertsCount = dynamicAlerts.filter(a => a.type === 'critical').length;

  const getLeaderboard = () => {
    const mehdiSales = salesTransactions.filter(s => s.branch.toLowerCase().includes('mehdi'));
    const zangmoSales = salesTransactions.filter(s => s.branch.toLowerCase().includes('zangmo'));

    const mehdiRevenue = mehdiSales.reduce((sum, s) => sum + s.amount, 0);
    const zangmoRevenue = zangmoSales.reduce((sum, s) => sum + s.amount, 0);

    const mehdiOrders = mehdiSales.length;
    const zangmoOrders = zangmoSales.length;

    const elenaOrders = Math.round(mehdiOrders * 0.6) || 85;
    const elenaRevenue = Math.round(mehdiRevenue * 0.6) || 750;

    const thomasOrders = Math.round(zangmoOrders * 0.7) || 82;
    const thomasRevenue = Math.round(zangmoRevenue * 0.7) || 680;

    const samirOrders = Math.round(mehdiOrders * 0.3) || 42;
    const samirRevenue = Math.round(mehdiRevenue * 0.3) || 380;

    return [
      { name: 'Elena Rodriguez', branch: 'Mehdi Main', orders: elenaOrders, value: elenaRevenue, trend: '+18%', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTi88UDGOYNnLNHAXTMW6lUeoUeMiETB6hyvzFdviTfQKEviPWhhOpWQuQsuxtUv0rET8oq-6cMWHHFKcVp-6jnJAOETs-PRK1e1z-OQdwCchlWeo5AEWs4TVwlZy3xepZlbqIixGvysmrrFnfFYd3abHjU_ZvrykVblV0UkEyEuNafCfCRT69aVjFP_AoekbJHOiwgZub-mH_Fdg0U35IqAf0ByDmH8tYTDgpiasosEwHL2UVAOqynDsDZEmVgKXXFfk-OOqvRiQ0', rank: 1, rankClass: 'rank-1' },
      { name: 'Thomas K. Wood', branch: 'Zangmo', orders: thomasOrders, value: thomasRevenue, trend: '+5%', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdW6_X0KqO5kZzRvXkLdtnli-R_d-gsSaaClD3LB3tt9aDjuKqrmkfiUwMDyzHPVl0FBDlVH935Oaec8Oz1Zs-6-779bXN8LO49SC0nfqSG4AsSTySX7xS0ATB5a8OYF6ONIIc91pZY6p4XPP8s5aMGJSjI0nZ9ECR0ZYmR4Bc1rX6p5PAIxG39_cyTChfoZihnylxnC3mRO37m8avzG4rZbKLhwa4B1SQv6SN6rfW0eMWiJurjJ0NutbznjI5k6DBAUXpTmlobbNB', rank: 2, rankClass: 'rank-2' },
      { name: 'Samir Bakshi', branch: 'Mehdi Main', orders: samirOrders, value: samirRevenue, trend: '-2%', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIRvLepukoo6Fd4JmmPv5rV8W8MpoEYpC9ayNXCVv67RrsakhswpB6fHVU_PJGy4XSJXuG9pYkHvfrMXEsRdtJ1GPVS5bo4hgn4qHGWqOaf0-Uca9oyP1dFdqmC7_uqqGMFPUCVmrq3tqeAH4UIOxeZpK7ha9foDOSWKLs5xnMwIh93T13agtSYy1tvjqomPCrpbnbNbCnjIcRZJoYujOU974C8tbd7dRMQh-IXV-EHi608-zc-3080fEQ-2SE9dryJNpl57oAoAf8', rank: 3, rankClass: 'rank-3' }
    ].sort((a, b) => b.value - a.value);
  };

  const leaderboardList = getLeaderboard();

  return (
    <div className="dashboard">
      <AdminSidebar activePage="dashboard" />

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Topbar title="Executive Admin Dashboard" />

        <div className="dashboard-page-content">
          {/* Section 1: KPI Grid */}
          <section className="kpi-grid">
            {/* Total Revenue */}
            <div className="kpi-card">
              <div>
                <p className="kpi-label">Consolidated Revenue</p>
                <h2 className="kpi-value">{formatValue(totalRevenue)}</h2>
              </div>
              <div className="kpi-change-row success">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                <span>Active Targets Active</span>
              </div>
            </div>

            {/* Active Branches */}
            <div className="kpi-card">
              <div>
                <p className="kpi-label">Active Kitchen Nodes</p>
                <h2 className="kpi-value">{activeBranchesCount} / {totalBranchesCount}</h2>
              </div>
              <div>
                <div className="kpi-progress-container">
                  <div className="kpi-progress-bar" style={{ width: `${branchCapacityPct}%` }}></div>
                </div>
                <p className="kpi-capacity-text">{branchCapacityPct}% OPERATIONAL STATUS</p>
              </div>
            </div>

            {/* Average Kitchen Efficiency */}
            <div className="kpi-card">
              <div>
                <p className="kpi-label">Avg Kitchen Efficiency</p>
                <h2 className="kpi-value">{formattedEfficiency}</h2>
              </div>
              <div className="kpi-change-row primary">
                <span className="material-symbols-outlined">timer</span>
                <span>Combined Ticket Prep Speed</span>
              </div>
            </div>

            {/* Combined Labor Cost */}
            <div className="kpi-card">
              <div>
                <p className="kpi-label">Average Labor Cost</p>
                <h2 className="kpi-value">{avgLaborCost}</h2>
              </div>
              <div className="kpi-change-row muted">
                <span className="material-symbols-outlined">query_stats</span>
                <span>Combined branch average</span>
              </div>
            </div>
          </section>

          {/* Section 2: Side-by-Side Comparison */}
          <section className="comparison-grid">
            {/* Mehdi Kitchen Card */}
            <div className="branch-panel-card">
              <div className="branch-panel-header">
                <div className="branch-header-left">
                  <span className="branch-dot primary"></span>
                  <h3>Mehdi Kitchen (Main)</h3>
                </div>
                <span className="branch-id-badge">ID: MK-001</span>
              </div>
              <div className="branch-panel-body">
                <div className="branch-bg-visual">
                  <img
                    alt="Data Visualization"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv07khqhEipB1-9Uo6KnOVoug3FbhjR4WTcpL5viZn2Ckm6esXGuf24XZ67IRr309Rklzs3O3NYWli8mradzzmXHARTkZEW9fTDE6ffsCO3N4GpPcSNz0WwdXBnSGSzGuqPTWccbchZ-djGKMqpoHYJRqgp9SbZkCHX2Czwv6aFmHujFG-7dmbtHOXyVNYvilzm5ew4PoK4l1L8fet9Zxi8olJejwbEsIaV4N3--jZdOl25bsZU5N_rRe4-tsqB-xdVMKvenbk_dZc"
                  />
                </div>
                <div className="branch-stats-grid">
                  <div className="branch-stat-item">
                    <p className="branch-stat-lbl">Total Sales</p>
                    <p className="branch-stat-val">{formatShortValue(mehdiStats.revenue)}</p>
                    <div className="branch-stat-trend up">↑ Target Met</div>
                  </div>
                  <div className="branch-stat-item">
                    <p className="branch-stat-lbl">Total Orders</p>
                    <p className="branch-stat-val">{mehdiStats.orders}</p>
                    <div className="branch-stat-trend up">↑ Stable Flow</div>
                  </div>
                  <div className="branch-stat-item">
                    <p className="branch-stat-lbl">Avg. Check</p>
                    <p className="branch-stat-val">{formatShortValue(mehdiStats.avgCheck)}</p>
                    <div className="branch-stat-trend up">↑ Optimal</div>
                  </div>
                  <div className="branch-stat-item">
                    <p className="branch-stat-lbl">Staff Count</p>
                    <p className="branch-stat-val">{mehdiStats.staff}</p>
                    <div className="branch-stat-trend neutral">Active Staff</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Zangmo Kitchen Card */}
            <div className="branch-panel-card">
              <div className="branch-panel-header">
                <div className="branch-header-left">
                  <span className="branch-dot secondary"></span>
                  <h3>Zangmo Kitchen</h3>
                </div>
                <span className="branch-id-badge">ID: ZK-002</span>
              </div>
              <div className="branch-panel-body">
                <div className="branch-bg-visual">
                  <img
                    alt="Data Analytics"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCR25iI8YCWY_39J6zWE10uQLkcHksr9zxaqDh4yhA8UMen5My6FC37vTgvUzqNRonralaamhnaJfg1AmOIPR7sJbvGa6bs-JEhPS7FUw8HanGpDft4MXlVhMafDrNWNOJ8iG2f93u8u8Cgc1SCaTY33CNm3xQuLRf4TReZhtb-zu0j7jqSmqrXVQ4jjvDWFfEl0T0dgd0p64pRqJXkSfW9F8cn8ud37TRfxWWIZ40enuNxfd9jYOUow2csZtrDyMKDeLFT5vbz1mob"
                  />
                </div>
                <div className="branch-stats-grid">
                  <div className="branch-stat-item">
                    <p className="branch-stat-lbl">Total Sales</p>
                    <p className="branch-stat-val">{formatShortValue(zangmoStats.revenue)}</p>
                    <div className="branch-stat-trend up">↑ Target Met</div>
                  </div>
                  <div className="branch-stat-item">
                    <p className="branch-stat-lbl">Total Orders</p>
                    <p className="branch-stat-val">{zangmoStats.orders}</p>
                    <div className="branch-stat-trend up">↑ Stable Flow</div>
                  </div>
                  <div className="branch-stat-item">
                    <p className="branch-stat-lbl">Avg. Check</p>
                    <p className="branch-stat-val">{formatShortValue(zangmoStats.avgCheck)}</p>
                    <div className="branch-stat-trend up">↑ Optimal</div>
                  </div>
                  <div className="branch-stat-item">
                    <p className="branch-stat-lbl">Staff Count</p>
                    <p className="branch-stat-val">{zangmoStats.staff}</p>
                    <div className="branch-stat-trend neutral">Active Staff</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Hiring Approvals Summary panel */}
          {pendingHiringCount > 0 && (
            <section style={{ marginBottom: '24px', background: 'white', border: '1px solid #e0e3e6', borderRadius: '8px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#162839', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ color: '#b45309' }}>work</span>
                  Pending Staff Hiring Requests ({pendingHiringCount})
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {hiringRequests.filter(req => req.status === 'Pending').map(req => (
                  <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>{req.name} for <span style={{ color: '#b45309' }}>{req.role}</span></h4>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Branch: <strong>{req.branch}</strong> • Proposed: <strong>${req.wage}/hr</strong> • Justification: {req.justification}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleRejectHiring(req.id)}
                        style={{ padding: '6px 12px', borderRadius: '4px', background: 'white', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: '600', color: '#64748b', cursor: 'pointer' }}
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleApproveHiring(req.id)}
                        style={{ padding: '6px 12px', borderRadius: '4px', background: '#b45309', border: 'none', fontSize: '12px', fontWeight: '600', color: 'white', cursor: 'pointer' }}
                      >
                        Approve Hire
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 3: Bottom Grid */}
          <section className="bottom-dashboard-grid">
            {/* Operational Alerts Feed */}
            <div className="alerts-panel">
              <div className="alerts-header">
                <h3>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                  Operational Alerts
                </h3>
                <span className="critical-badge">{dynamicAlerts.filter(a => a.type === 'critical').length} ACTIVE</span>
              </div>
              <div className="alerts-list">
                {dynamicAlerts.map(alert => (
                  <div className="alert-item" key={alert.id}>
                    <div className={`alert-icon-box ${alert.type}`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{alert.icon}</span>
                    </div>
                    <div className="alert-details">
                      <div className="alert-title-row">
                        <h4>{alert.title}</h4>
                        <span className="alert-time">{alert.time}</span>
                      </div>
                      <p className="alert-desc">{alert.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shift Leaderboard */}
            <div className="leaderboard-panel">
              <div className="leaderboard-header">
                <h3>Shift Leaderboard</h3>
                <p>Based on Upselling &amp; Speed</p>
              </div>
              <div className="leaderboard-list">
                {leaderboardList.map((leader, idx) => (
                  <div className="leader-item" key={leader.name}>
                    <div className="leader-avatar-box">
                      <img
                        alt={leader.name}
                        className={`leader-avatar ${leader.rankClass}`}
                        src={leader.avatar}
                      />
                      <span className={`leader-rank-badge ${leader.rankClass}`}>{idx + 1}</span>
                    </div>
                    <div className="leader-info-box">
                      <p className="leader-name">{leader.name}</p>
                      <p className="leader-stats-sub">{leader.branch} • {leader.orders} Orders</p>
                    </div>
                    <div className="leader-val-box">
                      <p className="leader-metric-val">{formatShortValue(leader.value)}</p>
                      <p className="leader-growth-pct up">{leader.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
