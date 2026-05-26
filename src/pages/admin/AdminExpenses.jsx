// f:\antigravityprojects\zangmo\frontend\src\pages\admin\AdminExpenses.jsx
import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/users.css';
import '../../assets/styles/admin-expenses.css';

// Import image assets
import oilReceiptImg from '../../assets/images/oil_receipt.png';
import electricityBillImg from '../../assets/images/electricity_bill.png';
import repairBillImg from '../../assets/images/repair_bill.png';
import vegetablesReceiptImg from '../../assets/images/vegetables_receipt.png';
import thermalReceiptImg from '../../assets/images/thermal_receipt.png';

// Icon Map for Categories
const CategoryIcon = ({ category }) => {
  switch (category) {
    case 'KITCHEN SUPPLIES':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case 'UTILITIES':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      );
    case 'MAINTENANCE':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case 'FRESH PRODUCE':
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
  }
};

// Map file names to actual imported images
const receiptImageMap = {
  'oil_receipt.png': oilReceiptImg,
  'electricity_bill.png': electricityBillImg,
  'repair_bill.png': repairBillImg,
  'vegetables_receipt.png': vegetablesReceiptImg,
  'thermal_receipt.png': thermalReceiptImg
};

export default function AdminExpenses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBranchTab, setActiveBranchTab] = useState('Consolidated'); // 'Consolidated', 'Mehdi', 'Zangmo'
  
  // Advanced filters state
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Selected Card tracking state
  const [selectedId, setSelectedId] = useState(1);
  const [toast, setToast] = useState(null);

  // Currency State
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('zangmo_default_currency') || 'Rs.';
  });

  // Mock initial dataset aligning exactly with the screenshot amounts & submitting personnel
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('zangmo_expenses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          // Safe migration of stale data structure to new premium UI details schema
          return parsed.map(exp => {
            const budgetLimit = exp.budgetLimit || 200000;
            // Map old USD amounts to PKR scaling if they look like USD numbers
            let finalAmount = exp.amount || 10000;
            if (finalAmount < 5000) {
              finalAmount = Math.round(finalAmount * 80);
            }
            const budgetUsed = exp.budgetUsed || Math.min(Math.round(finalAmount * 3.5), 180000);
            const budgetPercent = exp.budgetPercent || Math.min(Math.round((budgetUsed / budgetLimit) * 100), 100);

            // Fallbacks for OCR & breakdown item fields
            const ocrVerified = exp.ocrVerified !== undefined ? exp.ocrVerified : true;
            const vendor = exp.vendor || (exp.category === 'UTILITIES' ? 'K-Electric Company Ltd.' : exp.category === 'MAINTENANCE' ? 'Catering Repairs & Co.' : 'Local Distributor');
            const invoiceNo = exp.invoiceNo || `INV-2023-${1000 + exp.id}`;
            const paymentMethod = exp.paymentMethod || 'Cash';
            const items = exp.items || [
              { name: exp.description || 'General expense items', qty: 1, price: finalAmount, total: finalAmount }
            ];

            return {
              id: exp.id,
              category: exp.category || 'KITCHEN SUPPLIES',
              amount: finalAmount,
              submittedBy: exp.submittedBy || 'Ahmed Khan',
              submitterAvatar: exp.submitterAvatar || 'https://i.pravatar.cc/150?img=68',
              receiptImg: exp.receiptImg || 'thermal_receipt.png',
              description: exp.description || 'General expense entry...',
              notes: exp.notes || 'No manager notes available.',
              budgetCategory: exp.budgetCategory || exp.category || 'Kitchen Supplies',
              budgetLimit,
              budgetUsed,
              budgetPercent,
              status: exp.status || 'PENDING',
              date: exp.date || 'Oct 24, 2023',
              branch: exp.branch || 'Mehdi Kitchen (Main)',
              ocrVerified,
              vendor,
              invoiceNo,
              paymentMethod,
              items
            };
          });
        }
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: 1,
        category: 'KITCHEN SUPPLIES',
        amount: 28500, // PKR
        submittedBy: 'Ahmed Khan',
        submitterAvatar: 'https://i.pravatar.cc/150?img=68',
        receiptImg: 'oil_receipt.png',
        description: 'Bulk purchase of vegetable oil and seasoning...',
        notes: 'We secured a 10% discount on this bulk purchase of oil. The supplier expects payment by Friday to maintain this rate. Recommended for immediate approval.',
        budgetCategory: 'Kitchen Supplies',
        budgetLimit: 200000,
        budgetUsed: 144000,
        budgetPercent: 72,
        status: 'PENDING',
        date: 'Oct 24, 2023',
        branch: 'Mehdi Kitchen (Main)',
        ocrVerified: true,
        vendor: 'Karamat Agro Industries Ltd.',
        invoiceNo: 'KAI-2023-8891',
        paymentMethod: 'Cash on Delivery',
        items: [
          { name: 'Vegetable Oil (16L Drum)', qty: 2, price: 9000, total: 18000 },
          { name: 'Premium Sesame Oil (1L)', qty: 5, price: 1500, total: 7500 },
          { name: 'White Pepper & Seasoning pack', qty: 1, price: 3000, total: 3000 }
        ]
      },
      {
        id: 2,
        category: 'UTILITIES',
        amount: 12400, // PKR
        submittedBy: 'Sara Malik',
        submitterAvatar: 'https://i.pravatar.cc/150?img=47',
        receiptImg: 'electricity_bill.png',
        description: 'Monthly electricity bill for the main kitchen...',
        notes: 'Electricity bill for peak summer usage. Includes commercial tax adjustment.',
        budgetCategory: 'Utilities',
        budgetLimit: 150000,
        budgetUsed: 82000,
        budgetPercent: 54.6,
        status: 'PENDING',
        date: 'Oct 22, 2023',
        branch: 'Mehdi Kitchen (Main)',
        ocrVerified: true,
        vendor: 'K-Electric Company Ltd.',
        invoiceNo: 'KE-OCT23-49021',
        paymentMethod: 'Bank Transfer',
        items: [
          { name: 'Commercial Electricity Consumption (1240 kWh)', qty: 1, price: 9800, total: 9800 },
          { name: 'Fuel Adjustment Charges & Govt Taxes', qty: 1, price: 2600, total: 2600 }
        ]
      },
      {
        id: 3,
        category: 'MAINTENANCE',
        amount: 8200, // PKR
        submittedBy: 'Ahmed Khan',
        submitterAvatar: 'https://i.pravatar.cc/150?img=68',
        receiptImg: 'repair_bill.png',
        description: 'Emergency repair for the deep fryer unit...',
        notes: 'Heating element burned out during Friday rush. Repair technician replaced coil and thermostat.',
        budgetCategory: 'Maintenance',
        budgetLimit: 100000,
        budgetUsed: 65000,
        budgetPercent: 65,
        status: 'PENDING',
        date: 'Oct 21, 2023',
        branch: 'Mehdi Kitchen (Main)',
        ocrVerified: true,
        vendor: 'Catering Repairs & Co.',
        invoiceNo: 'CRC-99401',
        paymentMethod: 'Cheque',
        items: [
          { name: 'Fryer Replacement Heating Element (3000W)', qty: 1, price: 4500, total: 4500 },
          { name: 'Emergency On-site Technician Service Fee', qty: 1, price: 3700, total: 3700 }
        ]
      },
      {
        id: 4,
        category: 'FRESH PRODUCE',
        amount: 15750, // PKR
        submittedBy: 'Zainab Bibi',
        submitterAvatar: 'https://i.pravatar.cc/150?img=49',
        receiptImg: 'vegetables_receipt.png',
        description: 'Weekly fresh vegetable stock from local market...',
        notes: 'Standard fresh goods purchase. Price increases due to seasonal shortage.',
        budgetCategory: 'Fresh Produce',
        budgetLimit: 200000,
        budgetUsed: 144000,
        budgetPercent: 72,
        status: 'PENDING',
        date: 'Oct 20, 2023',
        branch: 'Zangmo Kitchen',
        ocrVerified: true,
        vendor: 'Sabzi Mandi Subji Traders',
        invoiceNo: 'SMST-2023-102',
        paymentMethod: 'Cash',
        items: [
          { name: 'Red Tomatoes (Grade A, 30 KG)', qty: 1, price: 7500, total: 7500 },
          { name: 'White Onion (Bulk, 40 KG)', qty: 1, price: 6000, total: 6000 },
          { name: 'Fresh Coriander & Herbs (Bulk)', qty: 1, price: 2250, total: 2250 }
        ]
      }
    ];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('zangmo_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Sync Currency from storage
  useEffect(() => {
    const sync = () => {
      setCurrency(localStorage.getItem('zangmo_default_currency') || 'Rs.');
    };
    window.addEventListener('storage', sync);
    const iv = setInterval(sync, 2000);
    return () => { window.removeEventListener('storage', sync); clearInterval(iv); };
  }, []);

  // Currency Formatter
  const formatMoney = (amountPKR) => {
    if (currency === '$') {
      const usdAmount = amountPKR / 80;
      return `$${usdAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `Rs. ${amountPKR.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
  };

  // Filter Expenses by Tab (Branch), Search query, and advanced parameters
  const filteredExpenses = expenses.filter(exp => {
    // 1. Branch Tab filter
    if (activeBranchTab === 'Mehdi' && !exp.branch.includes('Mehdi')) return false;
    if (activeBranchTab === 'Zangmo' && !exp.branch.includes('Zangmo')) return false;

    // 2. Search query filter
    const matchesSearch = (exp.description || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (exp.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (exp.submittedBy || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (exp.vendor || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // 3. Category Advanced filter
    if (filterCategory !== 'All' && exp.category !== filterCategory) return false;

    // 4. Status Advanced filter
    if (filterStatus !== 'All' && exp.status !== filterStatus) return false;

    return true;
  });

  // Fallback to select first element when filter changes
  useEffect(() => {
    if (filteredExpenses.length > 0) {
      const isSelectedInList = filteredExpenses.some(e => e.id === selectedId);
      if (!isSelectedInList) {
        setSelectedId(filteredExpenses[0].id);
      }
    } else {
      setSelectedId(null);
    }
  }, [activeBranchTab, searchQuery, filterCategory, filterStatus, expenses]);

  const selectedExpense = filteredExpenses.find(e => e.id === selectedId) || null;

  // Defensive field mapping
  const selectedStatus = selectedExpense?.status || 'PENDING';
  const selectedNotes = selectedExpense?.notes || 'No notes available.';
  const selectedBudgetCategory = selectedExpense?.budgetCategory || selectedExpense?.category || 'General';
  const selectedBudgetLimit = selectedExpense?.budgetLimit || 200000;
  const selectedBudgetUsed = selectedExpense?.budgetUsed || 0;
  const selectedBudgetPercent = selectedExpense?.budgetPercent || 0;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Actions
  const handleApprove = (id) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, status: 'APPROVED' } : exp));
    showToast('Expense request approved successfully!', 'success');
  };

  const handleReject = (id) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, status: 'REJECTED' } : exp));
    showToast('Expense request rejected.', 'error');
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense record permanently?")) {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      showToast('Expense record deleted.', 'info');
    }
  };

  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) {
      alert("No expense records found to export.");
      return;
    }
    const headers = ['ID', 'Date', 'Branch', 'Category', 'Description', 'Vendor', 'Submitted By', 'Amount (PKR)', 'Status'];
    const rows = filteredExpenses.map(exp => [
      exp.id,
      `"${exp.date}"`,
      `"${exp.branch}"`,
      `"${exp.category}"`,
      `"${exp.description.replace(/"/g, '""')}"`,
      `"${(exp.vendor || '').replace(/"/g, '""')}"`,
      `"${exp.submittedBy}"`,
      exp.amount,
      `"${exp.status}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Kitchen_Suite_Expenses_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard">
      <AdminSidebar activePage="expenses" />

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Topbar title="Expenses & Approvals" />

        {/* Toast Notification */}
        {toast && (
          <div className={`admin-toast-alert ${toast.type}`}>
            <span className="toast-icon">
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '⚠' : 'ℹ'}
            </span>
            <span className="toast-text">{toast.msg}</span>
          </div>
        )}

        {/* Page Main Content Area */}
        <div className="expense-page-body">
          
          {/* Left Column: Submissions card list */}
          <div className="expense-list-column">
            <div className="list-header">
              <h2>Submissions</h2>
              <p>Review manager spending approvals.</p>

              {/* Branch Selector Pills Inside List Header */}
              <div className="branch-selector-pills-container">
                {['Consolidated', 'Mehdi Kitchen (Main)', 'Zangmo Kitchen'].map(b => {
                  const label = b === 'Consolidated' ? 'All Branches' : b.split(' ')[0];
                  const isActive = (b === 'Consolidated' && activeBranchTab === 'Consolidated') ||
                                   (b.includes('Mehdi') && activeBranchTab === 'Mehdi') ||
                                   (b.includes('Zangmo') && activeBranchTab === 'Zangmo');
                  return (
                    <button
                      key={b}
                      onClick={() => {
                        const targetTab = b === 'Consolidated' ? 'Consolidated' : (b.includes('Mehdi') ? 'Mehdi' : 'Zangmo');
                        setActiveBranchTab(targetTab);
                      }}
                      className={`branch-pill-button ${isActive ? 'active' : ''}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Search bar inside list header */}
              <div className="search-bar-wrapper">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="search-icon">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search by vendor, submitter..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="search-input-field"
                />
              </div>
              
              <div className="list-actions">
                <button 
                  className={`btn-action-filter ${showFilters ? 'active' : ''}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  <span>Filter Options</span>
                </button>

                <button className="btn-action-export" onClick={handleExportCSV}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Advanced Filters Drawer */}
            {showFilters && (
              <div className="admin-filter-sub-panel">
                <div className="form-group">
                  <label>Category</label>
                  <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                    <option value="All">All Categories</option>
                    <option value="KITCHEN SUPPLIES">Kitchen Supplies</option>
                    <option value="UTILITIES">Utilities</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="FRESH PRODUCE">Fresh Produce</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="All">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>
            )}

            {/* Scrollable cards list container - COMPACT cards style */}
            <div className="cards-scroll-container">
              {filteredExpenses.map(item => {
                const isActive = selectedExpense && selectedExpense.id === item.id;
                return (
                  <div 
                    key={item.id} 
                    className={`expense-item-card-compact ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <div className="compact-card-left">
                      <div className={`compact-category-icon-wrapper ${item.category.toLowerCase().replace(' ', '-')}`}>
                        <CategoryIcon category={item.category} />
                      </div>
                    </div>
                    
                    <div className="compact-card-body">
                      <div className="compact-card-title-row">
                        <span className="compact-vendor-name">{item.vendor}</span>
                        <span className={`compact-status-dot ${item.status.toLowerCase()}`} title={item.status} />
                      </div>
                      <div className="compact-desc-snippet">{item.description}</div>
                      <div className="compact-meta-row">
                        <span className="compact-date">{item.date}</span>
                        <span className="compact-bullet">•</span>
                        <span className="compact-submitter">{item.submittedBy}</span>
                      </div>
                    </div>

                    <div className="compact-card-right">
                      <span className="compact-amount-display">{formatMoney(item.amount)}</span>
                    </div>
                  </div>
                );
              })}

              {filteredExpenses.length === 0 && (
                <div className="no-records-placeholder">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                  <span>No matching submissions found</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Detailed review panel */}
          <div className="expense-details-column">
            {selectedExpense ? (
              <div className="details-wrapper">
                
                {/* 1. Header Card with Submitter profile & metadata */}
                <div className="detail-block-card submitter-meta-card">
                  <div className="submitter-profile-row">
                    <img className="submitter-avatar-large" alt={selectedExpense.submittedBy} src={selectedExpense.submitterAvatar} />
                    <div className="submitter-profile-info">
                      <h4>{selectedExpense.submittedBy}</h4>
                      <p className="submitter-role-badge">Kitchen Submitter</p>
                    </div>
                    <div className="category-pill-container">
                      <span className={`category-detail-pill ${selectedExpense.category.toLowerCase().replace(' ', '-')}`}>
                        <CategoryIcon category={selectedExpense.category} />
                        <span>{selectedExpense.category}</span>
                      </span>
                    </div>
                  </div>

                  <div className="meta-grid-details">
                    <div className="meta-detail-item">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.086-1.087-8.431-2.918M3.284 14.253A8.959 8.959 0 013 12c0-.778.099-1.533.284-2.253"/></svg>
                      <div>
                        <span className="meta-label">Branch Location</span>
                        <span className="meta-val">{selectedExpense.branch}</span>
                      </div>
                    </div>
                    <div className="meta-detail-item">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      <div>
                        <span className="meta-label">Submitted On</span>
                        <span className="meta-val">{selectedExpense.date}</span>
                      </div>
                    </div>
                    <div className="meta-detail-item">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <div>
                        <span className="meta-label">Review Status</span>
                        <span className={`meta-val status-badge-inline ${selectedStatus.toLowerCase()}`}>
                          {selectedStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Structured Layout: Left Preview / Right Parsed Data */}
                <div className="detail-split-grid">
                  
                  {/* Visual Receipt Evidence Card */}
                  <div className="detail-block-card evidence-card">
                    <span className="details-section-label">Receipt Evidence</span>
                    
                    <div className="evidence-receipt-box">
                      <img 
                        className="evidence-receipt-image" 
                        alt="Receipt Invoice Evidence" 
                        src={receiptImageMap[selectedExpense.receiptImg] || receiptImageMap['thermal_receipt.png']} 
                      />
                      
                      {/* Distressed Authentic Verification Stamp */}
                      <div className={`receipt-verification-stamp ${selectedStatus.toLowerCase()}`}>
                        <div className="stamp-text-main">{selectedStatus}</div>
                        <div className="stamp-text-sub">VERIFIED ADMIN</div>
                        <div className="stamp-date-sub">26 MAY 2026</div>
                      </div>
                    </div>

                    <div className="ocr-verification-banner">
                      <div className="ocr-verified-shield">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        <span>OCR Parsing Confident</span>
                      </div>
                      <span className="ocr-accuracy-badge">98.4% Match</span>
                    </div>
                  </div>

                  {/* Right Side: Parsed invoice table & OCR variables */}
                  <div className="detail-block-card invoice-breakdown-card">
                    <span className="details-section-label">Parsed Invoice Items</span>
                    
                    <div className="parsed-invoice-table-wrapper">
                      <table className="parsed-invoice-table">
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th className="align-center">Qty</th>
                            <th className="align-right">Unit Price</th>
                            <th className="align-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedExpense.items && selectedExpense.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="item-name-cell">{item.name}</td>
                              <td className="align-center cell-muted">{item.qty}</td>
                              <td className="align-right cell-muted">{formatMoney(item.price)}</td>
                              <td className="align-right item-total-cell">{formatMoney(item.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="invoice-summary-details">
                      <div className="summary-row">
                        <span>Invoice Subtotal</span>
                        <span>{formatMoney(selectedExpense.amount)}</span>
                      </div>
                      <div className="summary-row">
                        <span>OCR Adjustments / Tax</span>
                        <span>{formatMoney(0)}</span>
                      </div>
                      <div className="summary-row grand-total-row">
                        <span>Total Payable</span>
                        <span>{formatMoney(selectedExpense.amount)}</span>
                      </div>
                    </div>

                    {/* Metadata Variables */}
                    <div className="parsed-variables-box">
                      <div className="var-item">
                        <span className="var-label">Merchant / Vendor</span>
                        <span className="var-val">{selectedExpense.vendor}</span>
                      </div>
                      <div className="var-item">
                        <span className="var-label">Invoice Number</span>
                        <span className="var-val">{selectedExpense.invoiceNo}</span>
                      </div>
                      <div className="var-item">
                        <span className="var-label">Payment Mode</span>
                        <span className="var-val">{selectedExpense.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 3. Submitter Justification & Manager Notes */}
                <div className="detail-block-card notes-card">
                  <span className="details-section-label">Submitter Justification Notes</span>
                  <div className="manager-notes-quote-wrapper">
                    <svg className="quote-icon-svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2c0 2.2-1.8 4-4 4v3zm12 0c3 0 7-1 7-8V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2c0 2.2-1.8 4-4 4v3z"/></svg>
                    <blockquote className="manager-notes-quote-text">
                      "{selectedNotes}"
                    </blockquote>
                  </div>
                </div>

                {/* 4. Category Budget Analysis & Alert System */}
                <div className="detail-block-card budget-meter-card">
                  <span className="details-section-label">Category Budget Limit Assessment</span>
                  
                  <div className="budget-assessment-wrapper">
                    <div className="budget-details-info-row">
                      <div className="budget-cat-info">
                        <span className="budget-cat-name-label">Category Allocation</span>
                        <span className="budget-cat-name-val">{selectedBudgetCategory}</span>
                      </div>
                      <div className="budget-limit-info">
                        <span className="budget-limit-label">Monthly Limit</span>
                        <span className="budget-limit-val">{formatMoney(selectedBudgetLimit)}</span>
                      </div>
                    </div>

                    <div className="budget-meter-track-bg">
                      <div 
                        className={`budget-meter-bar-fill ${selectedBudgetPercent > 80 ? 'critical' : selectedBudgetPercent > 65 ? 'warning' : 'safe'}`} 
                        style={{ width: `${selectedBudgetPercent}%` }}
                      />
                    </div>

                    <div className="budget-assessment-footer">
                      <span className="budget-consumption-text">
                        Used to date: <strong>{formatMoney(selectedBudgetUsed)}</strong> ({selectedBudgetPercent}%)
                      </span>
                      
                      {selectedBudgetPercent > 70 ? (
                        <div className="budget-warning-advisory critical">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                          <span><strong>Budget Warning:</strong> Approving this expense will deplete category headroom below 30%.</span>
                        </div>
                      ) : (
                        <div className="budget-warning-advisory safe">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          <span>Category allocation is healthy. Sufficient headroom remains for this cycle.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. Audit Action Footer Panel */}
                <div className="detail-block-card actions-footer-card">
                  <div className="actions-button-group">
                    <button 
                      className="btn-trash-action" 
                      title="Permanently Delete Records"
                      onClick={() => handleDelete(selectedExpense.id)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>

                    <button 
                      className="btn-reject-submit"
                      onClick={() => handleReject(selectedExpense.id)}
                      disabled={selectedStatus !== 'PENDING'}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      <span>Reject Request</span>
                    </button>

                    <button 
                      className="btn-approve-submit"
                      onClick={() => handleApprove(selectedExpense.id)}
                      disabled={selectedStatus !== 'PENDING'}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Verify & Approve</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="empty-details-box">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                <span>Select a submission from the left list to review detailed invoice parameters</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
