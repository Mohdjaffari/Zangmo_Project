// f:\antigravityprojects\zangmo\frontend\src\pages\admin\BranchComparison.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/branch-comparison.css';

// SVG Icons
const SearchIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>;
const ChevronDown = () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>;
const StoreIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="8" rx="2"/><path d="M4 21v-6a2 2 0 012-2h12a2 2 0 012 2v6M9 13v8M15 13v8"/></svg>;
const CalendarIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const PDFIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const ExcelIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const ClockIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const WifiIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>;
const BellIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;

// Base sales trend data points (representing a 30-day baseline average week)
const BASE_CHART_DATA = [
  { day: 'Mon', zangmo: 8200, mehdi: 6100 },
  { day: 'Tue', zangmo: 11500, mehdi: 8400 },
  { day: 'Wed', zangmo: 9800, mehdi: 7600 },
  { day: 'Thu', zangmo: 13400, mehdi: 9800 },
  { day: 'Fri', zangmo: 16900, mehdi: 12500 },
  { day: 'Sat', zangmo: 18400, mehdi: 14200 },
  { day: 'Sun', zangmo: 14200, mehdi: 11850 }
];

export default function BranchComparison() {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('zangmo_default_currency') || 'Rs.';
  });
  const [activeBranch, setActiveBranch] = useState('Consolidated'); // 'Consolidated', 'Zangmo', 'Mehdi'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [toastMessage, setToastMessage] = useState('');

  // Clock tick & Storage listener for currency
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    const handleStorage = () => {
      setCurrency(localStorage.getItem('zangmo_default_currency') || 'Rs.');
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Format currency helpers
  const formatMoney = (val) => {
    if (currency === 'Rs.') {
      const pkrAmount = val * 80;
      return `Rs. ${pkrAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
  };

  // Toast trigger
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Determine multipliers and chart configs dynamically based on selected date preset
  let rangeMultiplier = 1.0;
  let maxVal = 20000;
  let gridLines = [0, 5000, 10000, 15000, 20000];

  if (selectedRange === 'Last 7 Days') {
    rangeMultiplier = 0.24;
    maxVal = 6000;
    gridLines = [0, 1500, 3000, 4500, 6000];
  } else if (selectedRange === 'Last 90 Days') {
    rangeMultiplier = 3.12;
    maxVal = 65000;
    gridLines = [0, 15000, 30000, 45000, 60000];
  }

  // Handle branch change triggers (humanize actions with feedback)
  const selectBranch = (branch) => {
    setActiveBranch(branch);
    triggerToast(`View scope toggled to: ${branch === 'Consolidated' ? 'All Branches' : branch + ' Branch'}`);
  };

  // Download raw Excel CSV handler
  const handleExportExcel = () => {
    const headers = ['Metric', 'Zangmo Branch', 'Mehdi Branch', 'Variance'];
    const csvContent = [
      headers.join(','),
      ...tableRows.map(row => {
        const diff = (row.zVal * rangeMultiplier) - (row.mVal * rangeMultiplier);
        let zDisp, mDisp, vDisp;
        if (row.format === 'currency') {
          zDisp = (row.zVal * rangeMultiplier).toFixed(2);
          mDisp = (row.mVal * rangeMultiplier).toFixed(2);
          vDisp = diff.toFixed(2);
        } else {
          zDisp = `${row.zVal}%`;
          mDisp = `${row.mVal}%`;
          vDisp = `${diff.toFixed(1)}%`;
        }
        return `"${row.metric}","${zDisp}","${mDisp}","${vDisp}"`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ZM_Kitchen_Comparison_${selectedRange.replace(/ /g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast(`Successfully compiled and downloaded comparison CSV!`);
  };

  // Print PDF Handler
  const handleExportPDF = () => {
    triggerToast("Preparing clean document layouts for report compilation...");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Base metric constants
  const zGross = 82400.00;
  const mGross = 60450.00;
  const zDiscounts = 1200.00;
  const mDiscounts = 850.00;
  const zNet = zGross - zDiscounts;
  const mNet = mGross - mDiscounts;

  // Reactively calculate values with multipliers
  const currentZNet = zNet * rangeMultiplier;
  const currentMNet = mNet * rangeMultiplier;

  let displayRevenue = currentZNet + currentMNet;
  let revenueTrend = '+ 8.4%';
  let displayOrders = Math.round(3492 * rangeMultiplier);
  let ordersTrend = '+ 2.1%';
  let displayTicket = 40.90;
  let ticketTrend = '- 1.2%';

  const isZangmo = activeBranch === 'Zangmo';
  const isMehdi = activeBranch === 'Mehdi';

  if (isZangmo) {
    displayRevenue = currentZNet;
    revenueTrend = '+ 9.2%';
    displayOrders = Math.round(2015 * rangeMultiplier);
    ordersTrend = '+ 3.0%';
    displayTicket = 40.89;
    ticketTrend = '- 0.8%';
  } else if (isMehdi) {
    displayRevenue = currentMNet;
    revenueTrend = '+ 7.4%';
    displayOrders = Math.round(1477 * rangeMultiplier);
    ordersTrend = '+ 1.0%';
    displayTicket = 40.92;
    ticketTrend = '- 1.7%';
  }

  // Double Line Chart SVG drawing coordinates (dynamically scaled)
  const svgWidth = 600;
  const svgHeight = 200;
  const paddingX = 45;
  const paddingY = 20;

  // Generate active chart data based on selected range
  const getChartData = () => {
    if (selectedRange === 'Last 7 Days') {
      return BASE_CHART_DATA.map(d => ({
        day: d.day,
        zangmo: d.zangmo,
        mehdi: d.mehdi
      }));
    } else if (selectedRange === 'Last 30 Days') {
      const data = [];
      for (let i = 1; i <= 30; i++) {
        const dayOfWeek = i % 7;
        const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
        const cycleMult = isWeekend ? 1.4 : 1.0;
        
        const baseZ = 9500 + Math.sin(i / 2) * 1500 + (dayOfWeek * 300) + (i * 50);
        const baseM = 7000 + Math.cos(i / 2) * 1000 + (dayOfWeek * 200) + (i * 45);
        
        data.push({
          day: `Day ${i}`,
          zangmo: Math.round(baseZ * cycleMult),
          mehdi: Math.round(baseM * cycleMult)
        });
      }
      return data;
    } else if (selectedRange === 'Last 90 Days') {
      const data = [];
      for (let i = 1; i <= 90; i++) {
        const dayOfWeek = i % 7;
        const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
        const cycleMult = isWeekend ? 1.35 : 1.0;
        
        const wave = Math.sin(i / 6) * 1200;
        const baseZ = 10000 + wave + (dayOfWeek * 250) + (i * 20);
        const baseM = 7500 + (wave * 0.8) + (dayOfWeek * 200) + (i * 15);
        
        data.push({
          day: `Day ${i}`,
          zangmo: Math.round(baseZ * cycleMult),
          mehdi: Math.round(baseM * cycleMult)
        });
      }
      return data;
    }
    return [];
  };

  const activeData = getChartData();

  const getCoordinates = (index, value) => {
    const x = paddingX + (index * (svgWidth - paddingX - 20) / (activeData.length - 1));
    const y = svgHeight - paddingY - (value * (svgHeight - paddingY * 2) / maxVal);
    return { x, y };
  };

  // Calculate coordinates for points using range multiplier
  const zPoints = activeData.map((d, i) => getCoordinates(i, d.zangmo * rangeMultiplier));
  const mPoints = activeData.map((d, i) => getCoordinates(i, d.mehdi * rangeMultiplier));

  const zPath = zPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const mPath = mPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const zAreaPath = `${zPath} L ${zPoints[zPoints.length - 1].x} ${svgHeight - paddingY} L ${zPoints[0].x} ${svgHeight - paddingY} Z`;
  const mAreaPath = `${mPath} L ${mPoints[mPoints.length - 1].x} ${svgHeight - paddingY} L ${mPoints[0].x} ${svgHeight - paddingY} Z`;

  // Mouse coordinate check for custom interactive tooltip overlay
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    
    const colWidth = (svgWidth - paddingX - 20) / (activeData.length - 1);
    let index = Math.round((xPos - paddingX) / colWidth);
    index = Math.max(0, Math.min(activeData.length - 1, index));
    
    const highestVal = Math.max(activeData[index].zangmo * rangeMultiplier, activeData[index].mehdi * rangeMultiplier);
    const coord = getCoordinates(index, highestVal);
    
    setHoveredIndex(index);
    setTooltipPos({ x: coord.x, y: coord.y });
  };

  // Table rows structure
  const tableRows = [
    { metric: 'Gross Sales', zVal: zGross, mVal: mGross, format: 'currency', isPositiveGood: true },
    { metric: 'Discounts & Voids', zVal: zDiscounts, mVal: mDiscounts, format: 'currency', isPositiveGood: false },
    { metric: 'Net Sales', zVal: zNet, mVal: mNet, format: 'currency', isPositiveGood: true },
    { metric: 'Labor Cost %', zVal: 22.4, mVal: 24.1, format: 'percent', isPositiveGood: false },
    { metric: 'COGS %', zVal: 28.5, mVal: 29.0, format: 'percent', isPositiveGood: false }
  ];

  // Filter breakdown rows dynamically
  const filteredRows = tableRows.filter(row => 
    row.metric.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard">
      <AdminSidebar activePage="reports" />

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        
        <Topbar title="Branch Performance &amp; Comparison" />

        {/* Dashboard Page Contents */}
        <div className="comp-page-content">
          
          {/* Header Row */}
          <div className="comp-title-row">
            <div className="comp-title-left">
              <h1>Branch Performance &amp; Comparison</h1>
              <p>Consolidated view of Zangmo and Mehdi branches.</p>
            </div>

            <div className="comp-title-actions">
              {/* Search metrics */}
              <div className="comp-topbar-search-wrapper" style={{ width: '200px' }}>
                <span className="comp-topbar-search-icon"><SearchIcon /></span>
                <input 
                  type="text" 
                  className="comp-topbar-search-input" 
                  placeholder="Search metrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: 'white', border: '1px solid #cbd5e1' }}
                />
              </div>

              {/* Branch selector dropdown */}
              <div style={{ position: 'relative' }}>
                <button className="comp-btn-date" onClick={() => setShowBranchDropdown(!showBranchDropdown)}>
                  <StoreIcon />
                  <span>{activeBranch === 'Consolidated' ? 'Consolidated (All)' : `${activeBranch} Branch`}</span>
                  <ChevronDown />
                </button>
                {showBranchDropdown && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setShowBranchDropdown(false)} />
                    <div className="comp-date-picker-dropdown" style={{ left: 0, right: 'auto' }}>
                      {[
                        { value: 'Consolidated', label: 'Consolidated (All)' },
                        { value: 'Zangmo', label: 'Zangmo Branch' },
                        { value: 'Mehdi', label: 'Mehdi Branch' }
                      ].map(opt => (
                        <div 
                          key={opt.value}
                          className={`comp-date-option ${activeBranch === opt.value ? 'active' : ''}`}
                          onClick={() => {
                            selectBranch(opt.value);
                            setShowBranchDropdown(false);
                          }}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Date dropdown */}
              <div style={{ position: 'relative' }}>
                <button className="comp-btn-date" onClick={() => setShowRangeDropdown(!showRangeDropdown)}>
                  <CalendarIcon />
                  <span>{selectedRange}</span>
                  <ChevronDown />
                </button>
                {showRangeDropdown && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setShowRangeDropdown(false)} />
                    <div className="comp-date-picker-dropdown">
                      {['Last 7 Days', 'Last 30 Days', 'Last 90 Days'].map(opt => (
                        <div 
                          key={opt}
                          className={`comp-date-option ${selectedRange === opt ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedRange(opt);
                            setShowRangeDropdown(false);
                            triggerToast(`Date filter applied: ${opt}`);
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Exports */}
              <button className="comp-btn-export" onClick={handleExportPDF}>
                <PDFIcon />
                <span>PDF</span>
              </button>

              <button className="comp-btn-export-excel" onClick={handleExportExcel}>
                <ExcelIcon />
                <span>Export Excel</span>
              </button>
            </div>
          </div>

          {/* KPI grid row */}
          <div className="comp-kpi-grid">
            <div className="comp-kpi-card">
              <span className="comp-kpi-label">
                {activeBranch === 'Consolidated' ? 'CONSOLIDATED REVENUE' : `${activeBranch.toUpperCase()} REVENUE`}
              </span>
              <div className="comp-kpi-val-row">
                <span className="comp-kpi-value">{formatMoney(displayRevenue)}</span>
                <span className="comp-kpi-trend positive">
                  {revenueTrend}
                </span>
              </div>
            </div>

            <div className="comp-kpi-card">
              <span className="comp-kpi-label">TOTAL ORDERS</span>
              <div className="comp-kpi-val-row">
                <span className="comp-kpi-value">{displayOrders.toLocaleString()}</span>
                <span className="comp-kpi-trend positive">
                  {ordersTrend}
                </span>
              </div>
            </div>

            <div className="comp-kpi-card">
              <span className="comp-kpi-label">AVG TICKET SIZE</span>
              <div className="comp-kpi-val-row">
                <span className="comp-kpi-value">{formatMoney(displayTicket)}</span>
                <span className="comp-kpi-trend negative">
                  {ticketTrend}
                </span>
              </div>
            </div>
          </div>

          {/* Middle Row: Trend Chart & Categories */}
          <div className="comp-middle-grid">
            
            {/* Chart Card */}
            <div className="comp-card">
              <div className="comp-card-header">
                <span className="comp-card-title">Revenue Trend Comparison ({selectedRange})</span>
                <div className="comp-legend-row">
                  <div className="comp-legend-item">
                    <span className="comp-legend-dot zangmo"></span>
                    <span>Zangmo</span>
                  </div>
                  <div className="comp-legend-item">
                    <span className="comp-legend-dot mehdi"></span>
                    <span>Mehdi</span>
                  </div>
                </div>
              </div>

              {/* Dual line Chart Canvas */}
              <div 
                className="comp-chart-canvas"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {gridLines.map((v) => {
                    const coord = getCoordinates(0, v);
                    return (
                      <g key={v}>
                        <line 
                          x1={paddingX} 
                          y1={coord.y} 
                          x2={svgWidth - 20} 
                          y2={coord.y} 
                          stroke="#e2e8f0" 
                          strokeWidth="1"
                          strokeDasharray={v === 0 ? "none" : "4 4"}
                        />
                        <text 
                          x={paddingX - 10} 
                          y={coord.y + 4} 
                          textAnchor="end" 
                          fill="#94a3b8" 
                          fontSize="9" 
                          fontWeight="700"
                        >
                          {(() => {
                            if (v === 0) return '0';
                            const displayVal = currency === 'Rs.' ? v * 80 : v;
                            if (displayVal >= 1000000) return `${(displayVal / 1000000).toFixed(1)}M`;
                            if (displayVal >= 1000) return `${(displayVal / 1000).toFixed(0)}k`;
                            return displayVal;
                          })()}
                        </text>
                      </g>
                    );
                  })}

                  {/* Gradient Grids Definition */}
                  <defs>
                    <linearGradient id="gradient-zangmo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="gradient-mehdi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fc8f34" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#fc8f34" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Area gradient fills */}
                  {(!isMehdi) && (
                    <path d={zAreaPath} fill="url(#gradient-zangmo)" />
                  )}
                  {(!isZangmo) && (
                    <path d={mAreaPath} fill="url(#gradient-mehdi)" />
                  )}

                  {/* Trend Lines */}
                  {(!isMehdi) && (
                    <path 
                      d={zPath} 
                      fill="none" 
                      stroke="#1e3a8a" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      style={{ opacity: isZangmo ? 1 : 0.85 }}
                    />
                  )}
                  {(!isZangmo) && (
                    <path 
                      d={mPath} 
                      fill="none" 
                      stroke="#fc8f34" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      style={{ opacity: isMehdi ? 1 : 0.85 }}
                    />
                  )}

                  {/* Highlight dots on hovered point */}
                  {hoveredIndex !== null && (
                    <>
                      {(!isMehdi) && (
                        <circle 
                          cx={zPoints[hoveredIndex].x} 
                          cy={zPoints[hoveredIndex].y} 
                          r="5" 
                          fill="#1e3a8a" 
                          stroke="white" 
                          strokeWidth="2" 
                        />
                      )}
                      {(!isZangmo) && (
                        <circle 
                          cx={mPoints[hoveredIndex].x} 
                          cy={mPoints[hoveredIndex].y} 
                          r="5" 
                          fill="#fc8f34" 
                          stroke="white" 
                          strokeWidth="2" 
                        />
                      )}
                      {/* Vertical line indicator */}
                      <line 
                        x1={zPoints[hoveredIndex].x} 
                        y1={paddingY} 
                        x2={zPoints[hoveredIndex].x} 
                        y2={svgHeight - paddingY} 
                        stroke="#94a3b8" 
                        strokeWidth="1.5" 
                        strokeDasharray="2 2"
                      />
                    </>
                  )}

                  {/* X Axis Labels */}
                  {activeData.map((d, i) => {
                    const coord = getCoordinates(i, 0);
                    // Determine which labels to show to prevent overlapping
                    let showLabel = false;
                    if (selectedRange === 'Last 7 Days') {
                      showLabel = true;
                    } else if (selectedRange === 'Last 30 Days') {
                      showLabel = i === 0 || (i + 1) % 5 === 0;
                    } else if (selectedRange === 'Last 90 Days') {
                      showLabel = i === 0 || (i + 1) % 10 === 0;
                    }

                    if (!showLabel) return null;

                    return (
                      <text 
                        key={i} 
                        x={coord.x} 
                        y={svgHeight - 2} 
                        textAnchor="middle" 
                        fill="#94a3b8" 
                        fontSize="10" 
                        fontWeight="700"
                      >
                        {d.day}
                      </text>
                    );
                  })}
                </svg>

                {/* Floating Chart Tooltip */}
                {hoveredIndex !== null && activeData[hoveredIndex] && (
                  <div 
                    className="chart-tooltip" 
                    style={{ 
                      left: `${(tooltipPos.x / svgWidth) * 100}%`, 
                      top: `${(tooltipPos.y / svgHeight) * 100}%` 
                    }}
                  >
                    <div className="chart-tooltip-header">{activeData[hoveredIndex].day} Performance</div>
                    {(!isMehdi) && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                        <span style={{ color: '#93c5fd' }}>Zangmo:</span>
                        <span>{formatMoney(activeData[hoveredIndex].zangmo * rangeMultiplier)}</span>
                      </div>
                    )}
                    {(!isZangmo) && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                        <span style={{ color: '#fdba74' }}>Mehdi:</span>
                        <span>{formatMoney(activeData[hoveredIndex].mehdi * rangeMultiplier)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sales by Category Card */}
            <div className="comp-card">
              <div className="comp-card-header">
                <span className="comp-card-title">Sales by Category</span>
              </div>

              <div className="comp-category-list">
                {[
                  { name: 'Mains (Hot)', pct: 45 },
                  { name: 'Beverages', pct: 30 },
                  { name: 'Appetizers', pct: 15 },
                  { name: 'Desserts', pct: 10 }
                ].map(cat => (
                  <div className="comp-category-item" key={cat.name}>
                    <div className="comp-category-info">
                      <span className="comp-category-name">{cat.name}</span>
                      <span className="comp-category-pct">{cat.pct}%</span>
                    </div>
                    <div className="comp-progress-bar">
                      <div className="comp-progress-fill" style={{ width: `${cat.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Branch Breakdown */}
          <div className="comp-table-card">
            <span className="comp-table-card-title">Detailed Branch Breakdown</span>

            <div className="comp-table-wrapper">
              <table className="comp-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th style={{ background: isZangmo ? '#f8fafc' : 'transparent' }}>Zangmo Branch</th>
                    <th style={{ background: isMehdi ? '#f8fafc' : 'transparent' }}>Mehdi Branch</th>
                    <th>Variance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map(row => {
                    const zScaled = row.format === 'currency' ? row.zVal * rangeMultiplier : row.zVal;
                    const mScaled = row.format === 'currency' ? row.mVal * rangeMultiplier : row.mVal;
                    
                    const diff = zScaled - mScaled;
                    const isPositive = diff >= 0;
                    
                    // Format cell values helper
                    const formatCellVal = (val) => {
                      if (row.format === 'currency') return formatMoney(val);
                      return `${val.toFixed(1)}%`;
                    };

                    // Format Variance helper
                    const formatVariance = () => {
                      const absoluteDiff = Math.abs(diff);
                      const prefix = isPositive ? '+ ' : '- ';
                      const colorClass = (isPositive === row.isPositiveGood) ? 'positive' : 'negative';
                      
                      if (row.format === 'currency') {
                        return { text: `${prefix}${formatMoney(absoluteDiff)}`, colorClass };
                      }
                      return { text: `${prefix}${absoluteDiff.toFixed(1)}%`, colorClass };
                    };

                    const varianceInfo = formatVariance();

                    return (
                      <tr key={row.metric}>
                        <td className="metric-col">{row.metric}</td>
                        <td 
                          className="value-col" 
                          style={{ 
                            background: isZangmo ? '#f8fafc' : 'transparent',
                            fontWeight: isZangmo ? '800' : '500'
                          }}
                        >
                          {formatCellVal(zScaled)}
                        </td>
                        <td 
                          className="value-col" 
                          style={{ 
                            background: isMehdi ? '#f8fafc' : 'transparent',
                            fontWeight: isMehdi ? '800' : '500'
                          }}
                        >
                          {formatCellVal(mScaled)}
                        </td>
                        <td className={`variance-col ${varianceInfo.colorClass}`}>
                          {varianceInfo.text}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                        No metrics match your search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sub navigation link to detailed reports */}
          <div className="comp-footer-link-row">
            <Link to="/admin/reports-detailed" className="comp-detailed-link">
              Go to Detailed Performance &amp; Forecasting &rarr;
            </Link>
          </div>

        </div>
      </div>

      {/* Floating Success Toast Alert Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', background: '#0f172a',
          color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 1000,
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', fontWeight: '700', fontSize: '13px',
          animation: 'slideIn 0.3s ease-out', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
