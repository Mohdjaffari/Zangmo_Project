// f:\antigravityprojects\zangmo\frontend\src\pages\admin\AdminExpenses.jsx
import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case 'UTILITIES':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      );
    case 'MAINTENANCE':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case 'FRESH PRODUCE':
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBranchTab, setActiveBranchTab] = useState('Consolidated'); // 'Consolidated', 'Mehdi', 'Zangmo'
  
  // Advanced filters state
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Selected Card tracking state
  const [selectedId, setSelectedId] = useState(1);

  // Mock initial dataset aligning exactly with the screenshot amounts & submitting personnel
  // Mock initial dataset aligning exactly with the screenshot amounts & submitting personnel
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('zangmo_expenses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          // Safe migration of stale data structure to new premium UI details schema
          return parsed.map(exp => {
            const budgetLimit = exp.budgetLimit || 150000;
            // Map old USD amounts to PKR scaling if they look like USD numbers
            let finalAmount = exp.amount || 10000;
            if (finalAmount < 5000) {
              finalAmount = Math.round(finalAmount * 80);
            }
            const budgetUsed = exp.budgetUsed || Math.min(Math.round(finalAmount * 3.5), 144000);
            const budgetPercent = exp.budgetPercent || Math.min(Math.round((budgetUsed / budgetLimit) * 100), 100);

            return {
              id: exp.id,
              category: exp.category || 'KITCHEN SUPPLIES',
              amount: finalAmount,
              submittedBy: exp.submittedBy || 'Ahmed Khan',
              submitterAvatar: exp.submitterAvatar || 'https://i.pravatar.cc/150?img=68',
              receiptImg: exp.receiptImg || 'thermal_receipt.png',
              description: exp.description || 'General expense entry...',
              notes: exp.notes || 'We secured a 10% discount on this bulk purchase of oil. The supplier expects payment by Friday to maintain this rate. Recommended for immediate approval.',
              budgetCategory: exp.budgetCategory || exp.category || 'Kitchen Supplies',
              budgetLimit,
              budgetUsed,
              budgetPercent,
              status: exp.status || 'PENDING',
              date: exp.date || 'Oct 24, 2023',
              branch: exp.branch || 'Mehdi Kitchen (Main)'
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
        branch: 'Mehdi Kitchen (Main)'
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
        branch: 'Mehdi Kitchen (Main)'
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
        branch: 'Mehdi Kitchen (Main)'
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
        branch: 'Zangmo Kitchen'
      }
    ];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('zangmo_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter Expenses by Tab (Branch), Search query, and advanced parameters
  const filteredExpenses = expenses.filter(exp => {
    // 1. Branch Tab filter
    if (activeBranchTab === 'Mehdi' && !exp.branch.includes('Mehdi')) return false;
    if (activeBranchTab === 'Zangmo' && !exp.branch.includes('Zangmo')) return false;

    // 2. Search query filter
    const matchesSearch = (exp.description || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (exp.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (exp.submittedBy || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // 3. Category Advanced filter
    if (filterCategory !== 'All' && exp.category !== filterCategory) return false;

    // 4. Status Advanced filter
    if (filterStatus !== 'All' && exp.status !== filterStatus) return false;

    return true;
  });

  const selectedExpense = filteredExpenses.find(e => e.id === selectedId) || filteredExpenses[0] || null;

  // Defensive field mapping to prevent runtime type errors
  const selectedStatus = selectedExpense?.status || 'PENDING';
  const selectedNotes = selectedExpense?.notes || 'No manager notes available.';
  const selectedBudgetCategory = selectedExpense?.budgetCategory || selectedExpense?.category || 'General';
  const selectedBudgetLimit = selectedExpense?.budgetLimit || 150000;
  const selectedBudgetUsed = selectedExpense?.budgetUsed || 0;
  const selectedBudgetPercent = selectedExpense?.budgetPercent || 0;

  // Actions
  const handleApprove = (id) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, status: 'APPROVED' } : exp));
    alert('Expense request has been APPROVED successfully.');
  };

  const handleReject = (id) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, status: 'REJECTED' } : exp));
    alert('Expense request has been REJECTED.');
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense record permanently?")) {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  };

  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) {
      alert("No expense records found to export.");
      return;
    }
    const headers = ['ID', 'Date', 'Branch', 'Category', 'Description', 'Submitted By', 'Amount (PKR)', 'Status'];
    const rows = filteredExpenses.map(exp => [
      exp.id,
      `"${exp.date}"`,
      `"${exp.branch}"`,
      `"${exp.category}"`,
      `"${exp.description.replace(/"/g, '""')}"`,
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
    <div className="expenses-container">
      <AdminSidebar activePage="expenses" />

      <div className="expenses-content">
        {/* Customized Top Bar Header */}
        <div className="expense-header-bar">
          <div className="header-left">
            <span className="header-title">Kitchen Suite</span>
            <div className="header-search-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input 
                type="text" 
                placeholder="Search expenses..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="header-middle-tabs">
            <button 
              className={`header-tab ${activeBranchTab === 'Zangmo' ? 'active' : ''}`}
              onClick={() => { setActiveBranchTab('Zangmo'); setSelectedId(null); }}
            >
              Zangmo
            </button>
            <button 
              className={`header-tab ${activeBranchTab === 'Mehdi' ? 'active' : ''}`}
              onClick={() => { setActiveBranchTab('Mehdi'); setSelectedId(null); }}
            >
              Mehdi
            </button>
            <button 
              className={`header-tab ${activeBranchTab === 'Consolidated' ? 'active' : ''}`}
              onClick={() => { setActiveBranchTab('Consolidated'); setSelectedId(null); }}
            >
              Consolidated
            </button>
          </div>

          <div className="header-right">
            <button className="header-icon-btn" style={{ position: 'relative' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span style={{ position: 'absolute', top: '10px', right: '10px', width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%' }}></span>
            </button>

            <button className="header-icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <line x1="12" y1="20" x2="12.01" y2="20" />
              </svg>
            </button>

            <div className="header-time-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <div className="header-avatar">
              <img alt="Admin Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHIsYFXVtI2Nd1e5XZOoQ1xoyvN01OzoOzxbklay6ftS1H-uiC1o0dJAW6cGx_Yi7APORkALIWEGCSldZj6AvkR6CIIG7781_kQ7EJRGTZQRdw0c8B_LAxVUawI5_94LHUlBjvGg847wIojJfOH3JDzfH2DOtOFG8rndcs4eNZ_KV-O0T44ZYGXkVlj5pBe2i_3pCgiqRfiUOrDjN0ytRUox0zbrqCcWLRw_JYgzC2tmOe-XDJt56ZHGSoGWEv-g0nM-fUygIOkWJb" />
            </div>
          </div>
        </div>

        {/* Page Main Content Area */}
        <div className="expense-page-body">
          
          {/* Left Column: Submissions card list */}
          <div className="expense-list-column">
            <div className="list-header">
              <h2>Expense Approval</h2>
              <p>Review high-value submissions (&gt; 5,000 PKR)</p>
              
              <div className="list-actions">
                <button 
                  className={`btn-action-filter ${showFilters ? 'active' : ''}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  <span>Filter</span>
                </button>

                <button className="btn-action-export" onClick={handleExportCSV}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

            {/* Scrollable cards list container */}
            <div className="cards-scroll-container">
              {filteredExpenses.map(item => {
                const isActive = selectedExpense && selectedExpense.id === item.id;
                return (
                  <div 
                    key={item.id} 
                    className={`expense-item-card ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <div className="card-top-row">
                      <div className="card-category-info">
                        <div className="card-category-icon-box">
                          <CategoryIcon category={item.category} />
                        </div>
                        <span className="card-category-name">{item.category}</span>
                      </div>
                      {isActive && <span className="card-badge-selected">Selected</span>}
                    </div>

                    <div className="card-amount">
                      {item.amount.toLocaleString()} PKR
                    </div>

                    <div className="card-submitter-row">
                      <div className="card-submitter-avatar">
                        <img alt={item.submittedBy} src={item.submitterAvatar} />
                      </div>
                      <span className="card-submitter-txt">
                        Submitted by <strong>{item.submittedBy}</strong>
                      </span>
                    </div>

                    <div className="card-thumbnail-box">
                      <img alt="Receipt Attachment" src={receiptImageMap[item.receiptImg] || receiptImageMap['thermal_receipt.png']} />
                    </div>

                    <p className="card-desc-snippet">
                      "{item.description}"
                    </p>
                  </div>
                );
              })}

              {filteredExpenses.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: '13px' }}>
                  No submissions found.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Detailed review panel */}
          <div className="expense-details-column">
            {selectedExpense ? (
              <>
                <div className="details-header">
                  <h3>Submission Details</h3>
                  <span className={`details-status-badge ${selectedStatus.toLowerCase()}`}>
                    {selectedStatus === 'PENDING' ? 'Pending Verification' : selectedStatus}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span className="details-section-label">Receipt Evidence</span>
                  <div className="evidence-receipt-box">
                    <img 
                      className="evidence-receipt-image" 
                      alt="Receipt Invoice Evidence" 
                      src={receiptImageMap[selectedExpense.receiptImg] || receiptImageMap['thermal_receipt.png']} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span className="details-section-label">Manager's Notes</span>
                  <blockquote className="manager-notes-quote">
                    <p>"{selectedNotes}"</p>
                  </blockquote>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span className="details-section-label">Budget Analysis</span>
                  <div className="budget-analysis-box">
                    <div className="budget-top-row">
                      <span className="budget-category-badge">{selectedBudgetCategory}</span>
                      <span className="budget-limit-txt">
                        Monthly Budget <strong>{selectedBudgetLimit.toLocaleString()} PKR</strong>
                      </span>
                    </div>

                    <div className="budget-progress-container">
                      <div 
                        className="budget-progress-bar" 
                        style={{ width: `${selectedBudgetPercent}%` }}
                      ></div>
                    </div>

                    <div className="budget-status-row">
                      <span className="budget-status-left">
                        Used: {selectedBudgetUsed.toLocaleString()} PKR ({selectedBudgetPercent}%)
                      </span>
                      {selectedBudgetPercent > 70 && (
                        <span className="budget-status-right">Warning</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Confirm/Discard Footer Actions */}
                <div className="details-action-buttons">
                  <button 
                    className="btn-delete-expense" 
                    title="Delete record"
                    onClick={() => handleDelete(selectedExpense.id)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>

                  <button 
                    className="btn-reject-expense"
                    onClick={() => handleReject(selectedExpense.id)}
                    disabled={selectedStatus !== 'PENDING'}
                    style={{ opacity: selectedStatus !== 'PENDING' ? 0.5 : 1, cursor: selectedStatus !== 'PENDING' ? 'not-allowed' : 'pointer' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    <span>Reject</span>
                  </button>

                  <button 
                    className="btn-approve-expense"
                    onClick={() => handleApprove(selectedExpense.id)}
                    disabled={selectedStatus !== 'PENDING'}
                    style={{ opacity: selectedStatus !== 'PENDING' ? 0.5 : 1, cursor: selectedStatus !== 'PENDING' ? 'not-allowed' : 'pointer' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Approve</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-details-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span>Select an expense request to review details</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
