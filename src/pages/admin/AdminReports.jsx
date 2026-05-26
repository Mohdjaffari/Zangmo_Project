import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/users.css';
import '../../assets/styles/reports.css';

// Helper to get week range relative to now
const getWeekRange = (offsetWeeks = 0) => {
  const now = new Date();
  const day = now.getDay(); // 0 (Sun) to 6 (Sat)
  const diff = now.getDate() - day + (offsetWeeks * 7);
  const sunday = new Date(now.setDate(diff));
  
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  
  const pad = (n) => n < 10 ? '0' + n : n;
  
  const formatDateISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formatDateNice = (d) => `${months[d.getMonth()]} ${pad(d.getDate())}, ${d.getFullYear()}`;
  
  return {
    startISO: formatDateISO(sunday),
    endISO: formatDateISO(saturday),
    rangeStr: `${formatDateNice(sunday)} - ${formatDateNice(saturday)}`,
    niceStart: formatDateNice(sunday),
    niceEnd: formatDateNice(saturday),
    days: {
      SUN: formatDateISO(sunday),
      MON: formatDateISO(new Date(new Date(sunday).setDate(sunday.getDate() + 1))),
      TUE: formatDateISO(new Date(new Date(sunday).setDate(sunday.getDate() + 2))),
      WED: formatDateISO(new Date(new Date(sunday).setDate(sunday.getDate() + 3))),
      THU: formatDateISO(new Date(new Date(sunday).setDate(sunday.getDate() + 4))),
      FRI: formatDateISO(new Date(new Date(sunday).setDate(sunday.getDate() + 5))),
      SAT: formatDateISO(saturday),
    }
  };
};

// Master mockup transaction generator
const generateMockTransactions = () => {
  const list = [];
  const branches = ['Mehdi Kitchen (Main)', 'Zangmo Kitchen'];
  
  const generateForDay = (dateStr, dayTotal, branchWeights) => {
    const txCount = 6;
    let remaining = dayTotal;
    for (let i = 0; i < txCount; i++) {
      const isLast = i === txCount - 1;
      const amount = isLast ? remaining : Math.round((dayTotal / txCount) * (0.6 + Math.random() * 0.8));
      remaining -= amount;
      
      const branch = Math.random() > branchWeights[0] ? branches[1] : branches[0];
      const id = Math.floor(100000 + Math.random() * 900000);
      const ticketNo = `T-${1000 + list.length}`;
      const hour = 11 + Math.floor(Math.random() * 11);
      const min = Math.floor(Math.random() * 60);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour > 12 ? hour - 12 : hour;
      const timestamp = `${dateStr} ${formattedHour}:${min < 10 ? '0' + min : min} ${ampm}`;
      
      const itemsList = [
        { name: 'Signature Buddha Bowl', price: 14.0 },
        { name: 'Truffle Mushroom Pizza', price: 15.0 },
        { name: 'Blueberry Stack', price: 12.0 },
        { name: 'Grilled Salmon Salad', price: 15.0 }
      ];
      const itemIndex = Math.floor(Math.random() * itemsList.length);
      const chosenItem = itemsList[itemIndex];
      const qty = Math.max(1, Math.round(amount / chosenItem.price));
      const finalAmount = qty * chosenItem.price;
      
      list.push({
        id,
        ticketNo,
        orderId: `Order #${8000 + list.length}`,
        branch,
        amount: Number(finalAmount.toFixed(2)),
        timestamp,
        date: dateStr,
        itemsCount: qty,
        items: `${chosenItem.name} x${qty}`,
        paymentMethod: Math.random() > 0.4 ? 'Card' : Math.random() > 0.25 ? 'Cash' : 'Bank',
        status: 'Paid',
        type: Math.random() > 0.5 ? 'Dining' : 'Takeaway'
      });
    }
  };

  const curW = getWeekRange(0);
  const prevW = getWeekRange(-1);
  const twoW = getWeekRange(-2);

  // Base daily totals for Current Week
  const currentTotals = {
    [curW.days.MON]: 3800,
    [curW.days.TUE]: 5100,
    [curW.days.WED]: 4300,
    [curW.days.THU]: 6200,
    [curW.days.FRI]: 7900,
    [curW.days.SAT]: 8900,
    [curW.days.SUN]: 5600
  };

  // Base daily totals for Previous Week
  const prevTotals = {
    [prevW.days.MON]: 3200,
    [prevW.days.TUE]: 4800,
    [prevW.days.WED]: 4100,
    [prevW.days.THU]: 5800,
    [prevW.days.FRI]: 7200,
    [prevW.days.SAT]: 8420,
    [prevW.days.SUN]: 9330
  };

  // Base daily totals for Week Before
  const weekBeforeTotals = {
    [twoW.days.MON]: 3600,
    [twoW.days.TUE]: 4200,
    [twoW.days.WED]: 4600,
    [twoW.days.THU]: 5000,
    [twoW.days.FRI]: 6000,
    [twoW.days.SAT]: 7200,
    [twoW.days.SUN]: 4800
  };

  // Generate monthly extra records dynamically for recent months in current year (e.g. 2026)
  const currentYear = new Date().getFullYear();
  const monthlyExtra = {
    [`${currentYear}-01-15`]: 18000,
    [`${currentYear}-02-20`]: 22000,
    [`${currentYear}-03-10`]: 25000,
    [`${currentYear}-04-05`]: 19000,
    [`${currentYear}-05-12`]: 29000
  };

  Object.keys(currentTotals).forEach(date => generateForDay(date, currentTotals[date], [0.55, 0.45]));
  Object.keys(prevTotals).forEach(date => generateForDay(date, prevTotals[date], [0.6, 0.4]));
  Object.keys(weekBeforeTotals).forEach(date => generateForDay(date, weekBeforeTotals[date], [0.65, 0.35]));
  Object.keys(monthlyExtra).forEach(date => generateForDay(date, monthlyExtra[date], [0.5, 0.5]));

  return list;
};

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState('Performance'); // 'Performance', 'Audits', 'Forecasting'
  const [activeBranch, setActiveBranch] = useState('Consolidated'); // 'Downtown Branch', 'Uptown Kitchen', 'Consolidated'
  const [timeFilter, setTimeFilter] = useState('Daily'); // 'Daily', 'Monthly', 'Branch', 'Items'
  const [dateRange, setDateRange] = useState(() => getWeekRange(0).rangeStr);
  
  // Custom Date range pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStart, setCustomStart] = useState(() => getWeekRange(0).startISO);
  const [customEnd, setCustomEnd] = useState(() => getWeekRange(0).endISO);

  // Chart Click Focus Tracking based on current timeFilter mode
  const [activeDay, setActiveDay] = useState('SAT'); // For 'Daily' (MON-SUN)
  const [activeMonth, setActiveMonth] = useState('OCT'); // For 'Monthly' (JAN-DEC)
  const [activeCompareBranch, setActiveCompareBranch] = useState('Mehdi Kitchen (Main)'); // For 'Branch'
  const [activeItemName, setActiveItemName] = useState('Signature Buddha Bowl'); // For 'Items'

  const [isToastOpen, setIsToastOpen] = useState(true);

  // Forecasting Sliders
  const [trafficGrowth, setTrafficGrowth] = useState(15);
  const [averageOrderChange, setAverageOrderChange] = useState(5);

  // Currency State
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('zangmo_default_currency') || 'Rs.';
  });

  // Transactions State
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('zangmo_sales_transactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 5) {
          const hasOldData = parsed.some(t => t.date && t.date.includes('2023'));
          if (!hasOldData) {
            return parsed;
          }
        }
      } catch (e) {}
    }
    const generated = generateMockTransactions();
    localStorage.setItem('zangmo_sales_transactions', JSON.stringify(generated));
    return generated;
  });

  // Sync state from storage
  useEffect(() => {
    const sync = () => {
      setCurrency(localStorage.getItem('zangmo_default_currency') || 'Rs.');
      const savedTxns = localStorage.getItem('zangmo_sales_transactions');
      if (savedTxns) {
        try {
          const parsed = JSON.parse(savedTxns);
          if (parsed && parsed.length > 5) {
            const hasOldData = parsed.some(t => t.date && t.date.includes('2023'));
            if (!hasOldData) {
              setTransactions(parsed);
              return;
            }
          }
        } catch (e) {}
      }
      const generated = generateMockTransactions();
      localStorage.setItem('zangmo_sales_transactions', JSON.stringify(generated));
      setTransactions(generated);
    };
    window.addEventListener('storage', sync);
    const iv = setInterval(sync, 2000);
    return () => { window.removeEventListener('storage', sync); clearInterval(iv); };
  }, []);

  // Format Helper
  const formatMoney = (amountUSD) => {
    if (currency === '$') {
      return `$${amountUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      const pkrAmount = amountUSD * 80;
      return `Rs. ${pkrAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
  };

  const formatShortMoney = (amountUSD) => {
    if (currency === '$') {
      return `$${amountUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    } else {
      const pkrAmount = Math.round(amountUSD * 80);
      return `Rs. ${pkrAmount.toLocaleString()}`;
    }
  };

  // Helper to check if a transaction date falls inside the active dateRange filter
  const isDateInFilterRange = (dateStr) => {
    const parts = dateRange.split(' - ');
    if (parts.length === 2) {
      const start = new Date(parts[0]);
      const end = new Date(parts[1]);
      const target = new Date(dateStr);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      target.setHours(12,0,0,0);
      return target >= start && target <= end;
    }
    return false;
  };

  // Determine current Dates set for MON-SUN matching the active dateRange
  const getDatesForDailyRange = (rangeStr, isPrev = false) => {
    const curW = getWeekRange(0);
    const prevW = getWeekRange(-1);
    const twoW = getWeekRange(-2);

    if (rangeStr === curW.rangeStr) {
      return isPrev ? prevW.days : curW.days;
    } else if (rangeStr === prevW.rangeStr) {
      return isPrev ? twoW.days : prevW.days;
    } else if (rangeStr === twoW.rangeStr) {
      return isPrev ? getWeekRange(-3).days : twoW.days;
    } else {
      // Custom date range fallback (offset by 7 days for previous week totals)
      const parts = rangeStr.split(' - ');
      if (parts.length === 2) {
        const start = new Date(parts[0]);
        const end = new Date(parts[1]);
        const midDiff = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
        
        // Return dummy MON-SUN mapped dates for charting
        const map = {};
        for (let i = 0; i < 7; i++) {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          const dPrev = new Date(d);
          dPrev.setDate(d.getDate() - midDiff);
          
          const pad = (n) => n < 10 ? '0' + n : n;
          const dayName = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()];
          const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
          const datePrevStr = `${dPrev.getFullYear()}-${pad(dPrev.getMonth() + 1)}-${pad(dPrev.getDate())}`;
          
          if (isPrev) {
            map[dayName] = datePrevStr;
          } else {
            map[dayName] = dateStr;
          }
        }
        return map;
      }
      return {};
    }
  };

  const currentDates = getDatesForDailyRange(dateRange, false);
  const prevDates = getDatesForDailyRange(dateRange, true);

  // 1. Filter Transactions by Branch dropdown
  const branchFilteredTxns = transactions.filter(t => {
    if (activeBranch === 'Consolidated') return true;
    if (activeBranch === 'Downtown Branch') return t.branch === 'Mehdi Kitchen (Main)';
    if (activeBranch === 'Uptown Kitchen') return t.branch === 'Zangmo Kitchen';
    return true;
  });

  // 2. Filter Transactions by Date range
  const dateFilteredTxns = branchFilteredTxns.filter(t => isDateInFilterRange(t.date));

  // 3. Filter Previous period Transactions (used for KPI change percentages)
  const getPrevFilterRangeTxns = () => {
    const parts = dateRange.split(' - ');
    if (parts.length === 2) {
      const start = new Date(parts[0]);
      const end = new Date(parts[1]);
      const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
      
      const prevStart = new Date(start);
      prevStart.setDate(start.getDate() - diffDays);
      const prevEnd = new Date(end);
      prevEnd.setDate(end.getDate() - diffDays);

      const pad = (n) => n < 10 ? '0' + n : n;
      const startStr = `${prevStart.getFullYear()}-${pad(prevStart.getMonth() + 1)}-${pad(prevStart.getDate())}`;
      const endStr = `${prevEnd.getFullYear()}-${pad(prevEnd.getMonth() + 1)}-${pad(prevEnd.getDate())}`;

      return branchFilteredTxns.filter(t => t.date >= startStr && t.date <= endStr);
    }
    return [];
  };

  const prevPeriodTxns = getPrevFilterRangeTxns();

  // Calculate KPI Card Metrics
  const totalRevenueCurrent = dateFilteredTxns.reduce((sum, t) => sum + t.amount, 0);
  const totalRevenuePrev = prevPeriodTxns.reduce((sum, t) => sum + t.amount, 0);
  const revenueTrendPct = totalRevenuePrev > 0 
    ? ((totalRevenueCurrent - totalRevenuePrev) / totalRevenuePrev) * 100 
    : 12.5;

  const totalOrdersCurrent = dateFilteredTxns.length;
  const totalOrdersPrev = prevPeriodTxns.length;
  const ordersTrendPct = totalOrdersPrev > 0
    ? ((totalOrdersCurrent - totalOrdersPrev) / totalOrdersPrev) * 100
    : 8.2;

  const avgTicketCurrent = totalOrdersCurrent > 0 ? totalRevenueCurrent / totalOrdersCurrent : 0;
  const avgTicketPrev = totalOrdersPrev > 0 ? totalRevenuePrev / totalOrdersPrev : 0;
  const avgTicketTrendPct = avgTicketPrev > 0
    ? ((avgTicketCurrent - avgTicketPrev) / avgTicketPrev) * 100
    : -2.1;

  const netMarginCurrent = 24.8 + (activeBranch === 'Consolidated' ? 1.2 : activeBranch === 'Uptown Kitchen' ? -1.5 : 0);

  // Dynamic Bestsellers Calculation from actual items sold in active period
  const itemSummary = {};
  dateFilteredTxns.forEach(t => {
    if (t.items && t.items.includes(' x')) {
      const parts = t.items.split(' x');
      const name = parts[0];
      const qty = parseInt(parts[1]) || 1;
      
      const basePrices = {
        'Signature Buddha Bowl': 14.0,
        'Truffle Mushroom Pizza': 15.0,
        'Blueberry Stack': 12.0,
        'Grilled Salmon Salad': 15.0
      };
      const price = basePrices[name] || 10.0;
      
      if (!itemSummary[name]) {
        itemSummary[name] = { qty: 0, amount: 0 };
      }
      itemSummary[name].qty += qty;
      itemSummary[name].amount += qty * price;
    }
  });

  const defaultBestsellers = [
    { name: 'Signature Buddha Bowl', qty: 248, amount: 3472, className: 'buddha-bowl', icon: 'fa-bowl-food' },
    { name: 'Truffle Mushroom Pizza', qty: 192, amount: 2880, className: 'pizza', icon: 'fa-pizza-slice' },
    { name: 'Blueberry Stack', qty: 156, amount: 1872, className: 'blue-berry', icon: 'fa-cookie' },
    { name: 'Grilled Salmon Salad', qty: 112, amount: 1680, className: 'salmon', icon: 'fa-fish' }
  ];

  const computedBestsellers = defaultBestsellers.map(b => {
    const summary = itemSummary[b.name] || { qty: 0, amount: 0 };
    return {
      ...b,
      qty: summary.qty || Math.round(b.qty * (totalOrdersCurrent / 1284 || 1)),
      amount: summary.amount || Math.round(b.amount * (totalRevenueCurrent / 42850 || 1))
    };
  });

  // ══════════════════════════════════════════════════════════
  // DYNAMIC CHART & DRILL-DOWN DATA COMPILER
  // ══════════════════════════════════════════════════════════
  let chartDataList = [];
  let peakLabelText = 'Peak';
  let activeChartLabel = '';
  const chartDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  if (timeFilter === 'Daily') {
    // MON - SUN daily revenue totals
    const getDayTotal = (dateStr) => branchFilteredTxns.filter(t => t.date === dateStr).reduce((sum, t) => sum + t.amount, 0);
    
    chartDataList = chartDays.map(day => {
      const curDate = currentDates[day];
      const prevDate = prevDates[day];
      return {
        label: day,
        current: getDayTotal(curDate),
        prev: getDayTotal(prevDate),
        metaDate: curDate,
        isActive: activeDay === day,
        onClick: () => setActiveDay(day)
      };
    });
    activeChartLabel = activeDay;
  } 
  else if (timeFilter === 'Monthly') {
    // JAN - DEC monthly revenue totals
    const monthsMap = {
      'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06',
      'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
    };
    
    const getMonthTotal = (monthCode, isPrevYear = false) => {
      const currentYear = new Date().getFullYear();
      const targetYear = isPrevYear ? String(currentYear - 1) : String(currentYear);
      return branchFilteredTxns
        .filter(t => t.date && t.date.startsWith(`${targetYear}-${monthCode}`))
        .reduce((sum, t) => sum + t.amount, 0);
    };

    chartDataList = Object.keys(monthsMap).map(m => {
      const monthCode = monthsMap[m];
      return {
        label: m,
        current: getMonthTotal(monthCode, false),
        prev: getMonthTotal(monthCode, true),
        metaDate: monthCode,
        isActive: activeMonth === m,
        onClick: () => setActiveMonth(m)
      };
    });
    activeChartLabel = activeMonth;
  } 
  else if (timeFilter === 'Branch') {
    // Compare branches directly
    const branchesNames = ['Mehdi Kitchen (Main)', 'Zangmo Kitchen'];
    const getBranchPeriodTotal = (bName, isPrev = false) => {
      const txList = isPrev ? prevPeriodTxns : dateFilteredTxns;
      return txList.filter(t => t.branch === bName).reduce((sum, t) => sum + t.amount, 0);
    };

    chartDataList = branchesNames.map(b => {
      const labelShort = b.includes('Mehdi') ? 'Mehdi Main' : 'Zangmo';
      return {
        label: labelShort,
        current: getBranchPeriodTotal(b, false),
        prev: getBranchPeriodTotal(b, true),
        metaDate: b,
        isActive: activeCompareBranch === b,
        onClick: () => setActiveCompareBranch(b)
      };
    });
    activeChartLabel = activeCompareBranch.includes('Mehdi') ? 'Mehdi Main' : 'Zangmo';
  } 
  else if (timeFilter === 'Items') {
    // Compare items directly
    const getItemPeriodTotal = (iName, isPrev = false) => {
      const txList = isPrev ? prevPeriodTxns : dateFilteredTxns;
      return txList
        .filter(t => t.items && t.items.includes(iName))
        .reduce((sum, t) => sum + t.amount, 0);
    };

    chartDataList = defaultBestsellers.map(b => {
      return {
        label: b.name.split(' ').slice(-2).join(' '), // Shorten label
        current: getItemPeriodTotal(b.name, false),
        prev: getItemPeriodTotal(b.name, true),
        metaDate: b.name,
        isActive: activeItemName === b.name,
        onClick: () => setActiveItemName(b.name)
      };
    });
    activeChartLabel = activeItemName.split(' ').slice(-2).join(' ');
  }

  // Scale chart bar heights dynamically relative to max value
  const allChartVals = chartDataList.flatMap(x => [x.current, x.prev]);
  const maxChartVal = Math.max(...allChartVals, 100);
  chartDataList.forEach(item => {
    item.scaledHeight = Math.round((item.current / maxChartVal) * 190);
    item.scaledPrevHeight = Math.round((item.prev / maxChartVal) * 190);
  });

  // Peak Highlight
  let peakChartIndex = -1;
  let maxChartValFound = 0;
  chartDataList.forEach((item, idx) => {
    if (item.current > maxChartValFound) {
      maxChartValFound = item.current;
      peakChartIndex = idx;
    }
  });

  // ══════════════════════════════════════════════════════════
  // FILTER TABLE LOGS MATCHING ACTIVE CHART drill-down
  // ══════════════════════════════════════════════════════════
  let bottomTableTxns = [];
  let drillDownTitle = '';

  if (timeFilter === 'Daily') {
    const targetDate = currentDates[activeDay];
    bottomTableTxns = branchFilteredTxns.filter(t => t.date === targetDate);
    drillDownTitle = `Day Feed: ${activeDay} (${targetDate || ''})`;
  } 
  else if (timeFilter === 'Monthly') {
    const monthsMap = {
      'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06',
      'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
    };
    const targetMonthCode = monthsMap[activeMonth];
    const currentYear = new Date().getFullYear();
    bottomTableTxns = branchFilteredTxns.filter(t => t.date && t.date.startsWith(`${currentYear}-${targetMonthCode}`));
    drillDownTitle = `Month Feed: ${activeMonth} ${currentYear}`;
  } 
  else if (timeFilter === 'Branch') {
    bottomTableTxns = dateFilteredTxns.filter(t => t.branch === activeCompareBranch);
    drillDownTitle = `Branch Feed: ${activeCompareBranch}`;
  } 
  else if (timeFilter === 'Items') {
    bottomTableTxns = dateFilteredTxns.filter(t => t.items && t.items.includes(activeItemName));
    drillDownTitle = `Item Sales Feed: ${activeItemName}`;
  }

  // Audits Data model
  const auditLogs = [
    { timestamp: '2026-05-26 10:32', user: 'Mehdi Administrator', action: 'Approved Kitchen Supplies Oil purchase (Rs. 28,500)', status: 'success' },
    { timestamp: '2026-05-26 09:15', user: 'System Spooler', action: 'Synced offline transactions for Zangmo Kitchen', status: 'info' },
    { timestamp: '2026-05-25 18:40', user: 'Sara Malik (Manager)', action: 'Logged Utilities Electric Bill (Rs. 12,400)', status: 'info' },
    { timestamp: '2026-05-25 14:10', user: 'Zangmo Owner', action: 'Adjusted default currency conversion settings to Rs.', status: 'success' }
  ];

  // Dynamic Forecasting Estimator calculation
  const forecastedRevenue = totalRevenueCurrent * (1 + trafficGrowth / 100) * (1 + averageOrderChange / 100);
  const revenueDifference = forecastedRevenue - totalRevenueCurrent;

  const handleExport = (type) => {
    alert(`Successfully generated and downloaded Reports & Analytics ${type} report!`);
  };

  return (
    <div className="dashboard">
      <AdminSidebar activePage="reports" />

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Topbar title="Reports & Analytics" />

        <div className="reports-page-content">
          
          {/* Header Row */}
          <div className="reports-header-row">
            <div className="reports-header-left">
              <Link to="/admin/reports" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: '#64748b', textDecoration: 'none', marginBottom: '12px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#0f172a'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>
                &larr; Back to Branch Comparison
              </Link>
              <h1>Reports & Analytics</h1>
              <p>Comprehensive performance analysis for Z&amp;M Kitchen - {activeBranch}</p>
            </div>
            
            <div className="reports-header-right">
              {/* Branch selector dropdown */}
              <div className="reports-branch-dropdown-wrapper">
                <i className="fa-solid fa-store branch-dropdown-icon"></i>
                <select 
                  value={activeBranch} 
                  onChange={(e) => setActiveBranch(e.target.value)}
                  className="reports-branch-select"
                >
                  <option value="Consolidated">Consolidated (All)</option>
                  <option value="Downtown Branch">Downtown Branch</option>
                  <option value="Uptown Kitchen">Uptown Kitchen</option>
                </select>
                <i className="fa-solid fa-chevron-down branch-dropdown-arrow"></i>
              </div>

              <button className="btn-export-excel" onClick={() => handleExport('Excel')}>
                <i className="fa-solid fa-file-excel" style={{ color: '#16a34a', marginRight: '8px', fontSize: '14px' }}></i>
                <span>Export Excel</span>
              </button>

              <button className="btn-export-pdf" onClick={() => handleExport('PDF')}>
                <i className="fa-solid fa-file-pdf" style={{ color: '#ef4444', marginRight: '8px', fontSize: '14px' }}></i>
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Secondary Nav / Subfilters Bar (WITH FUNCTIONAL CUSTOM DATE PICKER) */}
          <div className="reports-nav-filters-bar">
            <div className="reports-nav-tabs">
              {['Performance', 'Audits', 'Forecasting'].map(tab => {
                const getTabIcon = () => {
                  if (tab === 'Performance') return 'fa-solid fa-chart-line';
                  if (tab === 'Audits') return 'fa-solid fa-clipboard-check';
                  return 'fa-solid fa-compass';
                };
                return (
                  <button
                    key={tab}
                    className={`reports-tab-btn ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    <i className={getTabIcon()}></i>
                    <span>{tab}</span>
                  </button>
                );
              })}
            </div>


            <div className="reports-filter-controls">
              {/* Time group filters - Daily, Monthly, Branch, Items */}
              <div className="reports-time-pill-group">
                {['Daily', 'Monthly', 'Branch', 'Items'].map(time => (
                  <button
                    key={time}
                    className={`reports-time-btn ${timeFilter === time ? 'active' : ''}`}
                    onClick={() => setTimeFilter(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>

              {/* DATE PICKER DROPDOWN: Custom date selectors restored */}
              <div style={{ position: 'relative' }}>
                <div className="reports-date-picker-trigger" onClick={() => setShowDatePicker(!showDatePicker)}>
                  <i className="fa-regular fa-calendar date-picker-icon"></i>
                  <div className="date-picker-text">
                    <span>{dateRange}</span>
                  </div>
                </div>
                {showDatePicker && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setShowDatePicker(false)} />
                    <div style={{
                      position: 'absolute', top: '44px', right: 0, background: 'white',
                      border: '1px solid #cbd5e1', borderRadius: '8px', zIndex: 999, width: '240px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden'
                    }}>
                      {/* Presets */}
                      <div style={{ padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                        {[
                          getWeekRange(0).rangeStr,
                          getWeekRange(-1).rangeStr,
                          getWeekRange(-2).rangeStr
                        ].map(opt => (
                          <div
                            key={opt}
                            onClick={() => {
                              setDateRange(opt);
                              setShowDatePicker(false);
                            }}
                            style={{
                              padding: '10px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                              background: dateRange === opt ? '#fffcf9' : 'white',
                              color: dateRange === opt ? '#fc8f34' : '#334155'
                            }}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>

                      {/* Custom Range select inputs */}
                      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '10.5px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>
                          Custom range selection
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <input 
                            type="date" 
                            value={customStart} 
                            onChange={(e) => setCustomStart(e.target.value)} 
                            style={{ padding: '6px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', color: '#334155' }} 
                          />
                          <span style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', fontWeight: 600 }}>to</span>
                          <input 
                            type="date" 
                            value={customEnd} 
                            onChange={(e) => setCustomEnd(e.target.value)} 
                            style={{ padding: '6px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', color: '#334155' }} 
                          />
                        </div>
                        <button 
                          onClick={() => {
                            if (customStart && customEnd) {
                              setDateRange(`${customStart} - ${customEnd}`);
                              setShowDatePicker(false);
                            } else {
                              alert("Please select both start and end dates.");
                            }
                          }}
                          style={{
                            padding: '8px', background: '#fc8f34', color: 'white', border: 'none', borderRadius: '6px',
                            fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s'
                          }}
                        >
                          Apply Custom Range
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button className="reports-filter-icon-btn">
                <i className="fa-solid fa-filter"></i>
              </button>
            </div>
          </div>

          {/* VIEW CONTROLLER */}
          {activeTab === 'Performance' && (
            <>
              {/* KPI Cards Grid */}
              <div className="reports-kpi-grid">
                
                {/* 1. Total Revenue */}
                <div className="reports-kpi-card">
                  <div className="kpi-title-row">
                    <span>Total Revenue</span>
                    <i className="fa-solid fa-wallet" style={{ color: '#fc8f34', fontSize: '13px' }}></i>
                  </div>
                  <div className="kpi-main-value-row">
                    <span className="kpi-val-number">{formatMoney(totalRevenueCurrent)}</span>
                    <span className={`kpi-trend-pill ${revenueTrendPct >= 0 ? 'up' : 'down'}`}>
                      <i className={`fa-solid ${revenueTrendPct >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`} style={{ marginRight: '3px' }}></i>
                      <span>{Math.abs(revenueTrendPct).toFixed(1)}%</span>
                    </span>
                  </div>
                </div>

                {/* 2. Total Orders */}
                <div className="reports-kpi-card">
                  <div className="kpi-title-row">
                    <span>Total Orders</span>
                    <i className="fa-solid fa-bag-shopping" style={{ color: '#2563eb', fontSize: '13px' }}></i>
                  </div>
                  <div className="kpi-main-value-row">
                    <span className="kpi-val-number">{totalOrdersCurrent.toLocaleString()}</span>
                    <span className={`kpi-trend-pill ${ordersTrendPct >= 0 ? 'up' : 'down'}`}>
                      <i className={`fa-solid ${ordersTrendPct >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`} style={{ marginRight: '3px' }}></i>
                      <span>{Math.abs(ordersTrendPct).toFixed(1)}%</span>
                    </span>
                  </div>
                </div>

                {/* 3. Average Ticket */}
                <div className="reports-kpi-card">
                  <div className="kpi-title-row">
                    <span>Average Ticket</span>
                    <i className="fa-solid fa-receipt" style={{ color: '#db2777', fontSize: '13px' }}></i>
                  </div>
                  <div className="kpi-main-value-row">
                    <span className="kpi-val-number">{formatMoney(avgTicketCurrent)}</span>
                    <span className={`kpi-trend-pill ${avgTicketTrendPct >= 0 ? 'up' : 'down'}`}>
                      <i className={`fa-solid ${avgTicketTrendPct >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`} style={{ marginRight: '3px' }}></i>
                      <span>{Math.abs(avgTicketTrendPct).toFixed(1)}%</span>
                    </span>
                  </div>
                </div>

                {/* 4. Net Margin */}
                <div className="reports-kpi-card">
                  <div className="kpi-title-row">
                    <span>Net Margin</span>
                    <i className="fa-solid fa-chart-pie" style={{ color: '#16a34a', fontSize: '13px' }}></i>
                  </div>
                  <div className="kpi-main-value-row">
                    <span className="kpi-val-number">{netMarginCurrent}%</span>
                    <span className="kpi-trend-pill up">
                      <i className="fa-solid fa-arrow-trend-up" style={{ marginRight: '3px' }}></i>
                      <span>0.5%</span>
                    </span>
                  </div>
                </div>

              </div>

              {/* Stacked Chart & Bestsellers Split Grid */}
              <div className="reports-middle-split-grid">
                
                {/* Visual Stacked Bar Chart */}
                <div className="revenue-chart-card">
                  <div className="chart-header-row">
                    <h3>Revenue Trend ({timeFilter})</h3>
                    <div className="chart-legends">
                      <div className="legend-item">
                        <span className="legend-dot current" />
                        <span>Current Period</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-dot prev" />
                        <span>Prev Period</span>
                      </div>
                    </div>
                  </div>

                  <div className="chart-content-container">
                    <div className="chart-canvas">
                      {chartDataList.map((item, idx) => {
                        const isPeak = idx === peakChartIndex;
                        return (
                          <div 
                            key={idx} 
                            className={`chart-bar-group ${isPeak ? 'highlighted' : ''} ${item.isActive ? 'active-day' : ''}`}
                            onClick={item.onClick}
                          >
                            {/* Peak Tooltip dynamically matching the highest value day */}
                            {isPeak && (
                              <div className="chart-peak-tooltip">
                                {peakLabelText}: {formatShortMoney(item.current)}
                              </div>
                            )}

                            <div className="bar-stack-container">
                              <div 
                                className="bar-column-prev" 
                                style={{ height: `${item.scaledPrevHeight}px` }} 
                                title={`Previous Period: ${formatShortMoney(item.prev)}`}
                              />
                              <div 
                                className="bar-column-current" 
                                style={{ height: `${item.scaledHeight}px` }} 
                                title={`Current Period: ${formatShortMoney(item.current)}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="chart-days-row">
                      {chartDataList.map((item, idx) => (
                        <span 
                          key={idx} 
                          className={`chart-day-label ${item.isActive ? 'active-day' : ''}`}
                        >
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bestselling items list */}
                <div className="bestsellers-card">
                  <h3>Top Performing Items</h3>
                  <div className="bestsellers-list">
                    {computedBestsellers.map((item, idx) => (
                      <div key={idx} className="bestseller-item-row">
                        <div className={`bestseller-food-thumbnail-box ${item.className}`}>
                          <i className={`fa-solid ${item.icon}`} style={{ fontSize: '18px' }}></i>
                        </div>
                        <div className="bestseller-item-details">
                          <p className="bestseller-item-title">{item.name}</p>
                          <p className="bestseller-item-qty">{item.qty} units sold</p>
                        </div>
                        <div className="bestseller-item-revenue">
                          {formatShortMoney(item.amount)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="btn-view-all-bestsellers" onClick={() => alert("Redirecting to menu breakdown analytics list...")}>
                    View All Items
                  </button>
                </div>

              </div>

              {/* Bottom Card: Transaction History list */}
              <div className="reports-bottom-card">
                <div className="bottom-card-header">
                  <h3>{drillDownTitle}</h3>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>
                    <i className="fa-solid fa-bolt" style={{ marginRight: '4px', color: '#eab308' }}></i>
                    Showing {bottomTableTxns.length} tickets.
                  </span>
                </div>

                <div className="reports-transactions-table-wrapper">
                  <table className="reports-transactions-table">
                    <thead>
                      <tr>
                        <th>Ticket No</th>
                        <th>Time</th>
                        <th>Purchased Items</th>
                        <th>Subtotal</th>
                        <th>Payment Mode</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bottomTableTxns.length > 0 ? (
                        bottomTableTxns.map((tx, idx) => (
                          <tr key={idx}>
                            <td className="reports-ticket-cell">{tx.ticketNo}</td>
                            <td className="reports-time-cell">
                              {tx.timestamp && tx.timestamp.includes(' ') ? tx.timestamp.split(' ').slice(1).join(' ') : (tx.timestamp || tx.date || '12:00 PM')}
                            </td>
                            <td className="reports-items-cell">{tx.items}</td>
                            <td className="reports-subtotal-cell">{formatMoney(tx.amount)}</td>
                            <td>
                              <span className="reports-payment-cell">{tx.paymentMethod}</span>
                            </td>
                            <td>
                              <span className="reports-status-cell completed">{tx.status || 'Paid'}</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                            No transactions captured matching this drill-down filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'Audits' && (
            <div className="audit-list-card">
              <h3>System Performance Audit Log</h3>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 16px 0' }}>
                Verify secure database spools, currency configuration changes, and manager actions.
              </p>

              <div className="audit-table-wrapper">
                <table className="audit-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Operator</th>
                      <th>System Action / Event</th>
                      <th>Security Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log, idx) => (
                      <tr key={idx}>
                        <td className="audit-timestamp-cell">
                          <i className="fa-regular fa-clock" style={{ marginRight: '6px', color: '#94a3b8' }}></i>
                          {log.timestamp}
                        </td>
                        <td className="audit-user-cell">
                          <i className="fa-solid fa-user-shield" style={{ marginRight: '6px', color: '#475569', fontSize: '12px' }}></i>
                          {log.user}
                        </td>
                        <td className="audit-action-cell">{log.action}</td>
                        <td>
                          <span className={`audit-status-badge ${log.status}`}>
                            <i className="fa-solid fa-circle-check" style={{ marginRight: '4px' }}></i>
                            {log.status === 'success' ? 'VERIFIED' : 'LOGGED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Forecasting' && (
            <div className="forecast-card-grid">
              
              <div className="forecast-controls-card">
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#1e293b' }}>
                  Estimator Variables
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 20px 0' }}>
                  Adjust growth indicators to forecast future weekly revenue baselines.
                </p>

                <div className="forecast-slider-group">
                  <div className="forecast-slider-item">
                    <div className="forecast-slider-header">
                      <span>
                        <i className="fa-solid fa-users" style={{ marginRight: '6px', color: '#64748b' }}></i>
                        Expected Traffic Growth
                      </span>
                      <span className="pct">+{trafficGrowth}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={trafficGrowth} 
                      onChange={(e) => setTrafficGrowth(parseInt(e.target.value))}
                      className="forecast-slider-input" 
                    />
                  </div>

                  <div className="forecast-slider-item">
                    <div className="forecast-slider-header">
                      <span>
                        <i className="fa-solid fa-cart-shopping" style={{ marginRight: '6px', color: '#64748b' }}></i>
                        Average Order Size Variation
                      </span>
                      <span className="pct">
                        {averageOrderChange >= 0 ? `+${averageOrderChange}` : averageOrderChange}%
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="-20" 
                      max="20" 
                      value={averageOrderChange} 
                      onChange={(e) => setAverageOrderChange(parseInt(e.target.value))}
                      className="forecast-slider-input" 
                    />
                  </div>
                </div>
              </div>

              <div className="forecast-results-card">
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#1e293b' }}>
                  Revenue Forecast Output
                </h3>
                
                <div className="forecast-summary-metric-box">
                  <span className="forecast-metric-title">Forecasted Revenue</span>
                  <span className="forecast-metric-val">{formatMoney(forecastedRevenue)}</span>
                </div>

                <div className="forecast-summary-metric-box">
                  <span className="forecast-metric-title">Net Increase</span>
                  <span className="forecast-metric-val increase">
                    <i className="fa-solid fa-arrow-trend-up" style={{ marginRight: '6px' }}></i>
                    +{formatMoney(revenueDifference)}
                  </span>
                </div>

                <div className="forecast-advisory-box">
                  <i className="fa-solid fa-circle-info" style={{ marginRight: '6px', color: '#1e3a8a' }}></i>
                  <strong>Manager Recommendation:</strong> Based on the predicted traffic increase of <strong>{trafficGrowth}%</strong>, we advise prep-scheduling kitchen stocks by Friday evening shifts to prevent supply bottle-necks.
                </div>
              </div>

            </div>
          )}

          {/* Floating sync success banner at bottom right */}
          {isToastOpen && (
            <div className="sync-status-toast-floating">
              <span className="pulse-sync-dot" />
              <span>System synced: Just now</span>
              <button className="btn-close-sync-toast" onClick={() => setIsToastOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
