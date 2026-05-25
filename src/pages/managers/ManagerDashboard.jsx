import React, { useState, useEffect } from 'react';
import ManagerSidebar from './ManagerSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/users.css';
import '../../assets/styles/dashboard.css';

export default function ManagerDashboard() {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('zangmo_default_currency') || 'Rs.';
  });
  
  const [loggedBranch, setLoggedBranch] = useState(() => {
    return localStorage.getItem('zangmo_logged_branch') || 'Mehdi Kitchen (Main)';
  });

  const [salesTransactions, setSalesTransactions] = useState(() => {
    const saved = localStorage.getItem('zangmo_sales_transactions');
    try { return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
  });

  const [tables, setTables] = useState(() => {
    const saved = localStorage.getItem('zangmo_tables');
    try { return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
  });

  const [staffList, setStaffList] = useState(() => {
    const saved = localStorage.getItem('zangmo_staff_list');
    try { return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
  });

  const [inventoryItems, setInventoryItems] = useState(() => {
    const saved = localStorage.getItem('zangmo_inventory_items');
    try { return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
  });

  useEffect(() => {
    const syncData = () => {
      setCurrency(localStorage.getItem('zangmo_default_currency') || 'Rs.');
      setLoggedBranch(localStorage.getItem('zangmo_logged_branch') || 'Mehdi Kitchen (Main)');

      const savedSales = localStorage.getItem('zangmo_sales_transactions');
      if (savedSales) {
        try { setSalesTransactions(JSON.parse(savedSales)); } catch (e) {}
      }
      const savedTables = localStorage.getItem('zangmo_tables');
      if (savedTables) {
        try { setTables(JSON.parse(savedTables)); } catch (e) {}
      }
      const savedStaff = localStorage.getItem('zangmo_staff_list');
      if (savedStaff) {
        try { setStaffList(JSON.parse(savedStaff)); } catch (e) {}
      }
      const savedInv = localStorage.getItem('zangmo_inventory_items');
      if (savedInv) {
        try { setInventoryItems(JSON.parse(savedInv)); } catch (e) {}
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
      return `$${amountUSD}`;
    } else {
      const pkrAmount = Math.round(amountUSD * 80);
      return `Rs. ${pkrAmount.toLocaleString()}`;
    }
  };

  // Branch Profile generator based on active branch
  const getBranchProfile = () => {
    const isZangmo = loggedBranch.toLowerCase().includes('zangmo');
    const branchId = isZangmo ? 'ZK-002' : 'MK-001';
    
    // 1. Calculate sales metrics dynamically
    const branchSales = salesTransactions.filter(sale => 
      sale.branch.toLowerCase().includes(loggedBranch.toLowerCase()) || 
      loggedBranch.toLowerCase().includes(sale.branch.toLowerCase())
    );

    const revenue = branchSales.length > 0 
      ? branchSales.reduce((sum, s) => sum + s.amount, 0)
      : (isZangmo ? 18242.50 : 24650.00);

    const orders = branchSales.length > 0
      ? branchSales.length
      : (isZangmo ? 118 : 142);

    const avgCheck = orders > 0 ? (revenue / orders) : (isZangmo ? 38.45 : 42.10);

    // 2. Calculate tables occupancy dynamically
    let activeTables = isZangmo ? 10 : 14;
    let totalTables = 16;
    if (tables.length > 0) {
      totalTables = tables.length;
      activeTables = tables.filter(t => t.status === 'Occupied' || t.status === 'Billed').length;
    }
    const capacityPct = totalTables > 0 ? Math.round((activeTables / totalTables) * 100) : 0;

    // 3. Calculate staff count dynamically
    let staffCount = isZangmo ? 11 : 14;
    if (staffList.length > 0) {
      staffCount = staffList.filter(s => 
        s.branch.toLowerCase().includes(loggedBranch.toLowerCase()) || 
        loggedBranch.toLowerCase().includes(s.branch.toLowerCase())
      ).length;
    }

    // 4. Calculate inventory alerts dynamically
    let alerts = [];
    if (inventoryItems.length > 0) {
      const lowStock = inventoryItems.filter(item => item.stock <= item.reorderPoint);
      alerts = lowStock.map(item => ({
        id: item.id,
        type: item.stock === 0 ? 'critical' : 'warning',
        title: item.stock === 0 ? `Out of Stock: ${item.name}` : `Low Stock: ${item.name}`,
        desc: `Current level is ${item.stock} ${item.unit} (reorder threshold: ${item.reorderPoint} ${item.unit}).`,
        time: 'Just now'
      }));
    }

    // Fallback if no inventory alerts
    if (alerts.length === 0) {
      alerts = isZangmo 
        ? [
            { id: 1, type: 'info', title: 'Kitchen Delay Warning', desc: 'Average preparation time at Zangmo Kitchen exceeded 25 minutes during peak hour.', time: '1h ago' }
          ]
        : [
            { id: 1, type: 'critical', title: 'Low Stock: Organic Salmon', desc: 'Inventory level at Mehdi Kitchen below safety threshold (8kg remaining). Automatic reorder failed.', time: '12m ago' },
            { id: 2, type: 'warning', title: 'Pending Approval: Refund Request', desc: 'Table 12, Waiter: Sarah J. Requesting $14.50 refund for overcooked steak.', time: '28m ago' }
          ];
    }

    const leaderboard = isZangmo
      ? [
          { name: 'Thomas K. Wood', rank: 1, orders: 108, metric: 985, growth: '+5%', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdW6_X0KqO5kZzRvXkLdtnli-R_d-gsSaaClD3LB3tt9aDjuKqrmkfiUwMDyzHPVl0FBDlVH935Oaec8Oz1Zs-6-779bXN8LO49SC0nfqSG4AsSTySX7xS0ATB5a8OYF6ONIIc91pZY6p4XPP8s5aMGJSjI0nZ9ECR0ZYmR4Bc1rX6p5PAIxG39_cyTChfoZihnylxnC3mRO37m8avzG4rZbKLhwa4B1SQv6SN6rfW0eMWiJurjJ0NutbznjI5k6DBAUXpTmlobbNB' }
        ]
      : [
          { name: 'Elena Rodriguez', rank: 1, orders: 142, metric: 1240, growth: '+18%', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTi88UDGOYNnLNHAXTMW6lUeoUeMiETB6hyvzFdviTfQKEviPWhhOpWQuQsuxtUv0rET8oq-6cMWHHFKcVp-6jnJAOETs-PRK1e1z-OQdwCchlWeo5AEWs4TVwlZy3xepZlbqIixGvysmrrFnfFYd3abHjU_ZvrykVblV0UkEyEuNafCfCRT69aVjFP_AoekbJHOiwgZub-mH_Fdg0U35IqAf0ByDmH8tYTDgpiasosEwHL2UVAOqynDsDZEmVgKXXFfk-OOqvRiQ0' },
          { name: 'Samir Bakshi', rank: 2, orders: 95, metric: 842, growth: '-2%', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIRvLepukoo6Fd4JmmPv5rV8W8MpoEYpC9ayNXCVv67RrsakhswpB6fHVU_PJGy4XSJXuG9pYkHvfrMXEsRdtJ1GPVS5bo4hgn4qHGWqOaf0-Uca9oyP1dFdqmC7_uqqGMFPUCVmrq3tqeAH4UIOxeZpK7ha9foDOSWKLs5xnMwIh93T13agtSYy1tvjqomPCrpbnbNbCnjIcRZJoYujOU974C8tbd7dRMQh-IXV-EHi608-zc-3080fEQ-2SE9dryJNpl57oAoAf8' }
        ];

    return {
      id: branchId,
      revenue,
      activeTables,
      totalTables,
      capacityPct,
      efficiency: isZangmo ? '16m 10s' : '12m 45s',
      laborCost: isZangmo ? '19.1%' : '17.5%',
      orders,
      avgCheck,
      waste: isZangmo ? '2.4%' : '1.2%',
      wasteTrend: isZangmo ? 'WATCHLIST' : 'OPTIMAL',
      wasteTrendClass: isZangmo ? 'down' : 'up',
      staffCount,
      staffStatus: staffCount < 12 ? 'UNDERSTAFFED' : 'FULL SHIFT',
      staffStatusClass: staffCount < 12 ? 'down' : 'neutral',
      image: isZangmo 
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR25iI8YCWY_39J6zWE10uQLkcHksr9zxaqDh4yhA8UMen5My6FC37vTgvUzqNRonralaamhnaJfg1AmOIPR7sJbvGa6bs-JEhPS7FUw8HanGpDft4MXlVhMafDrNWNOJ8iG2f93u8u8Cgc1SCaTY33CNm3xQuLRf4TReZhtb-zu0j7jqSmqrXVQ4jjvDWFfEl0T0dgd0p64pRqJXkSfW9F8cn8ud37TRfxWWIZ40enuNxfd9jYOUow2csZtrDyMKDeLFT5vbz1mob'
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv07khqhEipB1-9Uo6KnOVoug3FbhjR4WTcpL5viZn2Ckm6esXGuf24XZ67IRr309Rklzs3O3NYWli8mradzzmXHARTkZEW9fTDE6ffsCO3N4GpPcSNz0WwdXBnSGSzGuqPTWccbchZ-djGKMqpoHYJRqgp9SbZkCHX2Czwv6aFmHujFG-7dmbtHOXyVNYvilzm5ew4PoK4l1L8fet9Zxi8olJejwbEsIaV4N3--jZdOl25bsZU5N_rRe4-tsqB-xdVMKvenbk_dZc',
      alerts,
      leaderboard
    };
  };

  const branchData = getBranchProfile();

  return (
    <div className="dashboard">
      <ManagerSidebar activePage="dashboard" />

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Topbar title={`${loggedBranch} Dashboard`} />

        <div className="dashboard-page-content">
          {/* Section 1: KPI Grid */}
          <section className="kpi-grid">
            {/* Branch Revenue */}
            <div className="kpi-card">
              <div>
                <p className="kpi-label">Branch Revenue</p>
                <h2 className="kpi-value">{formatValue(branchData.revenue)}</h2>
              </div>
              <div className="kpi-change-row success">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                <span>Active Targets Active</span>
              </div>
            </div>

            {/* Active Tables */}
            <div className="kpi-card">
              <div>
                <p className="kpi-label">Active Tables</p>
                <h2 className="kpi-value">{branchData.activeTables} / {branchData.totalTables}</h2>
              </div>
              <div>
                <div className="kpi-progress-container">
                  <div className="kpi-progress-bar" style={{ width: `${branchData.capacityPct}%` }}></div>
                </div>
                <p className="kpi-capacity-text">{branchData.capacityPct}% CAPACITY REACHED</p>
              </div>
            </div>

            {/* Kitchen Efficiency */}
            <div className="kpi-card">
              <div>
                <p className="kpi-label">Kitchen Efficiency</p>
                <h2 className="kpi-value">{branchData.efficiency}</h2>
              </div>
              <div className="kpi-change-row primary">
                <span className="material-symbols-outlined">timer</span>
                <span>Avg. Ticket to Window</span>
              </div>
            </div>

            {/* Labor Cost */}
            <div className="kpi-card">
              <div>
                <p className="kpi-label">Labor Cost</p>
                <h2 className="kpi-value">{branchData.laborCost}</h2>
              </div>
              <div className="kpi-change-row muted">
                <span className="material-symbols-outlined">query_stats</span>
                <span>Within local targets</span>
              </div>
            </div>
          </section>

          {/* Section 2: Large Analytics Card for Logged-In Branch */}
          <section style={{ marginBottom: '24px' }}>
            <div className="branch-panel-card" style={{ width: '100%' }}>
              <div className="branch-panel-header" style={{ background: '#f8fafc' }}>
                <div className="branch-header-left">
                  <span className="branch-dot primary"></span>
                  <h3>{loggedBranch} - Detailed Performance Metrics</h3>
                </div>
                <span className="branch-id-badge">ID: {branchData.id}</span>
              </div>
              <div className="branch-panel-body" style={{ minHeight: '220px', padding: '24px 32px' }}>
                <div className="branch-bg-visual">
                  <img alt="Data Visual" src={branchData.image} />
                </div>
                <div className="branch-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: 'none', width: '100%' }}>
                  <div className="branch-stat-item">
                    <p className="branch-stat-lbl">Hourly Orders</p>
                    <p className="branch-stat-val">{branchData.orders}</p>
                    <div className="branch-stat-trend up">↑ Stable Flow</div>
                  </div>
                  <div className="branch-stat-item">
                    <p className="branch-stat-lbl">Avg. Ticket Check</p>
                    <p className="branch-stat-val">{formatShortValue(branchData.avgCheck)}</p>
                    <div className="branch-stat-trend up">↑ Target Achieved</div>
                  </div>
                  <div className="branch-stat-item">
                    <p className="branch-stat-lbl">Food Waste %</p>
                    <p className="branch-stat-val">{branchData.waste}</p>
                    <div className={`branch-stat-trend ${branchData.wasteTrendClass}`}>{branchData.wasteTrend}</div>
                  </div>
                  <div className="branch-stat-item">
                    <p className="branch-stat-lbl">Staff Active</p>
                    <p className="branch-stat-val">{branchData.staffCount}</p>
                    <div className={`branch-stat-trend ${branchData.staffStatusClass}`}>{branchData.staffStatus}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Bottom Grid */}
          <section className="bottom-dashboard-grid">
            {/* Operational Alerts Feed */}
            <div className="alerts-panel">
              <div className="alerts-header">
                <h3>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                  Operational Alerts ({loggedBranch})
                </h3>
                <span className="critical-badge">{branchData.alerts.length} ACTIVE</span>
              </div>
              <div className="alerts-list">
                {branchData.alerts.length > 0 ? branchData.alerts.map(alert => (
                  <div className="alert-item" key={alert.id}>
                    <div className={`alert-icon-box ${alert.type}`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {alert.type === 'critical' ? 'inventory' : alert.type === 'warning' ? 'rule' : 'schedule'}
                      </span>
                    </div>
                    <div className="alert-details">
                      <div className="alert-title-row">
                        <h4>{alert.title}</h4>
                        <span className="alert-time">{alert.time}</span>
                      </div>
                      <p className="alert-desc">{alert.desc}</p>
                      {alert.type === 'critical' && (
                        <div className="alert-actions">
                          <button type="button" className="alert-action-btn primary">Order Stock</button>
                        </div>
                      )}
                      {alert.type === 'warning' && (
                        <div className="alert-actions">
                          <button type="button" className="alert-action-btn primary">Review Ticket</button>
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#cbd5e1', marginBottom: '8px' }}>check_circle</span>
                    <p style={{ margin: 0, fontSize: '13px' }}>All systems nominal. No alerts for this branch.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shift Leaderboard */}
            <div className="leaderboard-panel">
              <div className="leaderboard-header">
                <h3>Branch Shift Leaderboard</h3>
                <p>Upselling &amp; speed stats</p>
              </div>
              <div className="leaderboard-list">
                {branchData.leaderboard.length > 0 ? branchData.leaderboard.map((leader, index) => (
                  <div className="leader-item" key={index}>
                    <div className="leader-avatar-box">
                      <img
                        alt={leader.name}
                        className={`leader-avatar ${leader.rank === 1 ? 'rank-1' : ''}`}
                        src={leader.avatar}
                      />
                      <span className={`leader-rank-badge ${leader.rank === 1 ? 'rank-1' : 'rank-2'}`}>{leader.rank}</span>
                    </div>
                    <div className="leader-info-box">
                      <p className="leader-name">{leader.name}</p>
                      <p className="leader-stats-sub">{leader.orders} Orders Handled</p>
                    </div>
                    <div className="leader-val-box">
                      <p className="leader-metric-val">{formatShortValue(leader.metric)}</p>
                      <p className="leader-growth-pct up">{leader.growth}</p>
                    </div>
                  </div>
                )) : (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                    <p style={{ margin: 0, fontSize: '13px' }}>No performance data collected for this shift.</p>
                  </div>
                )}
              </div>
              <div className="leaderboard-footer">
                <button type="button" className="leaderboard-footer-btn">VIEW FULL SHIFT LOGS</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
