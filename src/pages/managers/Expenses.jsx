import React, { useState, useEffect, useRef } from 'react';
import ManagerSidebar from './ManagerSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/users.css';
import '../../assets/styles/expenses.css';

// SVG Icons
const PDFIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const WarningIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const SortUpIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginLeft: '4px', verticalAlign: 'middle' }}>
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

const SortDownIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginLeft: '4px', verticalAlign: 'middle' }}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default function Expenses() {
  // Sync currency preference with dashboard
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('zangmo_default_currency') || 'Rs.';
  });

  const userRole = 'Manager';

  useEffect(() => {
    const handleStorage = () => {
      setCurrency(localStorage.getItem('zangmo_default_currency') || 'Rs.');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const formatValue = (amountUSD) => {
    if (currency === '$') {
      return `$${amountUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      const pkrAmount = amountUSD * 80;
      return `Rs. ${pkrAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
  };

  // State: List of expense transactions
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('zangmo_expenses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: 1, date: 'Oct 24, 2023', category: 'Utilities', description: 'Water bill - Main Kitchen', amount: 1240.00, status: 'PENDING', branch: 'Mehdi Kitchen (Main)', recurring: false, receiptName: 'water_invoice_downtown.pdf' },
      { id: 2, date: 'Oct 22, 2023', category: 'Salaries', description: 'Weekly Wages - Shift A', amount: 4500.00, status: 'APPROVED', branch: 'Mehdi Kitchen (Main)', recurring: true, receiptName: null },
      { id: 3, date: 'Oct 21, 2023', category: 'Inventory', description: 'Dry goods restock', amount: 840.50, status: 'APPROVED', branch: 'Mehdi Kitchen (Main)', recurring: false, receiptName: 'grocery_receipt_211023.jpg' },
      { id: 4, date: 'Oct 20, 2023', category: 'Maintenance', description: 'Oven repair - Unit 4', amount: 215.00, status: 'PENDING', branch: 'Mehdi Kitchen (Main)', recurring: false, receiptName: 'oven_fix_bill.png' },
      { id: 5, date: 'Oct 18, 2023', category: 'Marketing', description: 'Local flyers & posters distribution', amount: 320.00, status: 'APPROVED', branch: 'Zangmo Kitchen', recurring: false, receiptName: 'flyers_receipt.jpg' },
      { id: 6, date: 'Oct 15, 2023', category: 'Utilities', description: 'Gas supply cylinder refills', amount: 980.00, status: 'APPROVED', branch: 'Mehdi Kitchen (Main)', recurring: true, receiptName: null },
      { id: 7, date: 'Oct 12, 2023', category: 'Inventory', description: 'Vegetables & seasoning restock', amount: 1150.00, status: 'APPROVED', branch: 'Zangmo Kitchen', recurring: false, receiptName: 'veggies_invoice.pdf' },
      { id: 8, date: 'Oct 09, 2023', category: 'Maintenance', description: 'Exhaust fan duct cleaning service', amount: 350.00, status: 'APPROVED', branch: 'Mehdi Kitchen (Main)', recurring: false, receiptName: 'ventilation_clean.png' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('zangmo_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Form State
  const [branch, setBranch] = useState(() => localStorage.getItem('zangmo_logged_branch') || 'Mehdi Kitchen (Main)');
  const [category, setCategory] = useState('Utilities');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Sorting State
  const [sortField, setSortField] = useState('date'); // 'date' | 'category' | 'description' | 'amount' | 'status'
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showFiltersSubPanel, setShowFiltersSubPanel] = useState(false);

  // Active Transaction Details State
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Chart Toggle: 'Monthly' or 'Quarterly'
  const [chartTimeframe, setChartTimeframe] = useState('Monthly');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Toast notifications
  const [toast, setToast] = useState({ show: false, message: '' });

  // Refs for focusing inputs
  const branchSelectRef = useRef(null);
  const fileInputRef = useRef(null);

  // Show Toast Helper
  const triggerToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // Quick Record Button Handler
  const handleQuickRecord = () => {
    if (branchSelectRef.current) {
      branchSelectRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      branchSelectRef.current.focus();
      triggerToast("Form focused! Enter details to record an expense.");
    }
  };

  // PDF Export simulation
  const handleExportPDF = () => {
    triggerToast("Generating expense report PDF...");
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  // CSV Export utility
  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) {
      triggerToast("No transactions found to export.");
      return;
    }
    const headers = ['Date', 'Category', 'Description', 'Branch', 'Amount (USD)', 'Status', 'Recurring'];
    const rows = filteredExpenses.map(exp => [
      `"${exp.date}"`,
      `"${exp.category}"`,
      `"${exp.description.replace(/"/g, '""')}"`,
      `"${exp.branch}"`,
      exp.amount,
      `"${exp.status}"`,
      exp.recurring ? 'Yes' : 'No'
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Expenses_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("CSV file exported successfully!");
  };

  // Action Handlers
  const handleApprove = (id, e) => {
    e.stopPropagation();
    if (userRole !== 'Admin') {
      triggerToast("Access Denied: Only Admin users can approve expenses.");
      return;
    }
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, status: 'APPROVED' } : exp));
    if (selectedExpense && selectedExpense.id === id) {
      setSelectedExpense(prev => ({ ...prev, status: 'APPROVED' }));
    }
    triggerToast("Expense Approved successfully.");
  };

  const handleReject = (id, e) => {
    e.stopPropagation();
    if (userRole !== 'Admin') {
      triggerToast("Access Denied: Only Admin users can reject expenses.");
      return;
    }
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, status: 'REJECTED' } : exp));
    if (selectedExpense && selectedExpense.id === id) {
      setSelectedExpense(prev => ({ ...prev, status: 'REJECTED' }));
    }
    triggerToast("Expense Rejected.");
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to permanently delete this expense?")) {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      if (selectedExpense && selectedExpense.id === id) {
        setSelectedExpense(null);
      }
      triggerToast("Expense record deleted.");
    }
  };

  // Sorting Header Click Handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid expense amount.");
      return;
    }

    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

    const newExpense = {
      id: Date.now(),
      date: formattedDate,
      category: category,
      description: description || `${category} expenditure`,
      amount: amt,
      status: 'PENDING',
      branch: branch,
      recurring: recurring,
      receiptName: receiptFile ? receiptFile.name : null
    };

    setExpenses([newExpense, ...expenses]);
    setAmount('');
    setDescription('');
    setRecurring(false);
    setReceiptFile(null);
    setCurrentPage(1); // Return to page 1

    triggerToast(`Expense of ${formatValue(amt)} submitted for approval!`);
  };

  // Receipt File drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setReceiptFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const removeReceiptFile = () => {
    setReceiptFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Filter Logic
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exp.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exp.status.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'All' || exp.category === filterCategory;
    const matchesBranch = filterBranch === 'All' || exp.branch === filterBranch;
    const matchesStatus = filterStatus === 'All' || exp.status === filterStatus;

    return matchesSearch && matchesCategory && matchesBranch && matchesStatus;
  });

  // Date parsing helper for sorting
  const parseDateStr = (dateStr) => {
    return new Date(dateStr).getTime() || 0;
  };

  // Sort Logic
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === 'date') {
      valA = parseDateStr(a.date);
      valB = parseDateStr(b.date);
    }

    if (typeof valA === 'string') {
      return sortDirection === 'asc' 
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return sortDirection === 'asc'
        ? (valA - valB)
        : (valB - valA);
    }
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedExpenses.slice(indexOfFirstItem, indexOfLastItem);

  // Dynamic Budget & Spend Calculations
  const budgets = {
    Monthly: {
      Utilities: 1500,
      Salaries: 5000,
      Inventory: 2000,
      Marketing: 800,
      Other: 1200
    },
    Quarterly: {
      Utilities: 4500,
      Salaries: 15000,
      Inventory: 6000,
      Marketing: 2400,
      Other: 3600
    }
  };

  // Helper to map record categories to chart categories
  const mapToChartCategory = (cat) => {
    const standard = ['Utilities', 'Salaries', 'Inventory', 'Marketing'];
    if (standard.includes(cat)) return cat;
    return 'Other';
  };

  // Compute actual spending dynamically
  const getActualSpends = () => {
    const totals = {
      Utilities: 0,
      Salaries: 0,
      Inventory: 0,
      Marketing: 0,
      Other: 0
    };

    expenses.forEach(exp => {
      const chartCat = mapToChartCategory(exp.category);
      if (exp.status === 'APPROVED' || exp.status === 'PENDING') {
        totals[chartCat] += exp.amount;
      }
    });

    if (chartTimeframe === 'Quarterly') {
      return {
        Utilities: totals.Utilities * 2.8 + 400,
        Salaries: totals.Salaries * 2.9 + 200,
        Inventory: totals.Inventory * 2.7 + 600,
        Marketing: totals.Marketing * 2.5 + 100,
        Other: totals.Other * 2.8 + 300
      };
    }

    return totals;
  };

  const actuals = getActualSpends();
  const currentBudgets = budgets[chartTimeframe];

  // Helper to draw chart bar heights (cap at 100%)
  const getBarHeight = (value, max) => {
    if (max === 0) return '0%';
    const pct = (value / max) * 100;
    return `${Math.min(Math.max(pct, 4), 100)}%`;
  };

  const chartScaleMax = Math.max(...Object.values(currentBudgets), ...Object.values(actuals), 1000);

  // Sorting Indicator Renderer
  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <SortUpIcon /> : <SortDownIcon />;
  };

  return (
    <div className="expenses-container">
      <ManagerSidebar activePage="expenses" />

      <div className="expenses-content">
        <Topbar title="Expenses" />

        <div className="expenses-page-content">
          {/* Header Row */}
          <div className="expenses-header-row">
            <div className="expenses-title-block">
              <h1>Expense Management</h1>
              <p>Track, manage, and approve operational kitchen expenditures.</p>
            </div>
            
            {/* Header Actions: Export, Record */}
            <div className="expenses-header-actions">
              <button className="btn-export-pdf" onClick={handleExportPDF}>
                <PDFIcon /> Export PDF
              </button>
              <button className="btn-quick-record" onClick={handleQuickRecord}>
                <PlusIcon /> Quick Record
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="expenses-grid">
            
            {/* Left Column: Form Card */}
            <div className="expense-form-card">
              <h3>Record New Expense</h3>
              <form onSubmit={handleSubmit}>
                
                {/* Branch Select */}
                <div className="form-group">
                  <label className="form-label" htmlFor="branch-select">
                    Select Branch <span className="required-star">*</span>
                  </label>
                  <select 
                    id="branch-select"
                    className="form-select"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    ref={branchSelectRef}
                    required
                  >
                    <option value="Mehdi Kitchen (Main)">Mehdi Kitchen (Main)</option>
                    <option value="Zangmo Kitchen">Zangmo Kitchen</option>
                  </select>
                </div>

                {/* Category & Amount Row */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="category-select">
                      Category <span className="required-star">*</span>
                    </label>
                    <select 
                      id="category-select"
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="Utilities">Utilities</option>
                      <option value="Salaries">Salaries</option>
                      <option value="Inventory">Inventory</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="amount-input">
                      Amount (USD) <span className="required-star">*</span>
                    </label>
                    <input 
                      id="amount-input"
                      type="number"
                      step="any"
                      min="0.01"
                      className="form-input"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Description Textarea */}
                <div className="form-group">
                  <label className="form-label" htmlFor="desc-textarea">Description</label>
                  <textarea 
                    id="desc-textarea"
                    className="form-textarea"
                    placeholder="Describe the expenditure..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Receipt File Upload */}
                <div className="form-group">
                  <label className="form-label">Receipt Upload</label>
                  
                  {!receiptFile ? (
                    <div 
                      className={`receipt-upload-box ${isDragOver ? 'drag-over' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                        style={{ display: 'none' }}
                        accept=".png,.jpg,.jpeg,.pdf"
                      />
                      <span className="receipt-upload-icon"><UploadIcon /></span>
                      <p className="receipt-upload-text">Click to upload or drag & drop</p>
                      <p className="receipt-upload-subtext">PNG, JPG OR PDF UP TO 10MB</p>
                    </div>
                  ) : (
                    <div className="selected-file-box">
                      <div className="selected-file-info">
                        <FileIcon />
                        <span title={receiptFile.name}>{receiptFile.name.length > 25 ? receiptFile.name.substring(0, 22) + '...' : receiptFile.name}</span>
                      </div>
                      <button type="button" className="btn-remove-file" onClick={removeReceiptFile}>
                        <TrashIcon />
                      </button>
                    </div>
                  )}
                </div>

                {/* Recurring Checkbox */}
                <div className="form-group">
                  <label className="checkbox-container">
                    <input 
                      type="checkbox" 
                      checked={recurring}
                      onChange={(e) => setRecurring(e.target.checked)}
                    />
                    Mark as recurring monthly expense
                  </label>
                </div>

                {/* Submit button */}
                <button type="submit" className="btn-submit-approval">
                  Submit for Approval
                </button>
              </form>
            </div>

            {/* Right Column: Chart + Transactions Table */}
            <div className="expenses-right-col">
              
              {/* Budget vs Actual spend chart card */}
              <div className="chart-card">
                <div className="chart-card-header">
                  <h3>Budget vs Actual Spend</h3>
                  
                  {/* Monthly / Quarterly Toggle */}
                  <div className="toggle-tabs">
                    <button 
                      className={`toggle-tab ${chartTimeframe === 'Monthly' ? 'active' : ''}`}
                      onClick={() => setChartTimeframe('Monthly')}
                    >
                      Monthly
                    </button>
                    <button 
                      className={`toggle-tab ${chartTimeframe === 'Quarterly' ? 'active' : ''}`}
                      onClick={() => setChartTimeframe('Quarterly')}
                    >
                      Quarterly
                    </button>
                  </div>
                </div>

                <div className="chart-body">
                  <div className="chart-bars-wrapper">
                    {Object.keys(currentBudgets).map(catKey => {
                      const budgetValue = currentBudgets[catKey];
                      const actualValue = actuals[catKey];
                      
                      const budgetHeight = getBarHeight(budgetValue, chartScaleMax);
                      const actualHeight = getBarHeight(actualValue, chartScaleMax);

                      return (
                        <div className="chart-column" key={catKey}>
                          <div className="chart-bars-pair">
                            
                            {/* Budget Bar */}
                            <div 
                              className="chart-bar budget" 
                              style={{ height: budgetHeight }}
                            >
                              <div className="chart-bar-tooltip">
                                Budget: {formatValue(budgetValue)}
                              </div>
                            </div>

                            {/* Actual Bar */}
                            <div 
                              className="chart-bar actual" 
                              style={{ height: actualHeight }}
                            >
                              <div className="chart-bar-tooltip">
                                Actual: {formatValue(actualValue)}
                              </div>
                            </div>
                            
                          </div>
                          <span className="chart-category-label">{catKey}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Transactions Panel */}
              <div className="transactions-card">
                <div className="transactions-card-header">
                  <h3>Recent Transactions</h3>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {/* CSV Export */}
                    <button 
                      className="table-filter-btn"
                      onClick={handleExportCSV}
                      title="Export CSV"
                    >
                      <DownloadIcon />
                    </button>

                    {/* Filter Sub-panel toggle */}
                    <button 
                      className={`table-filter-btn ${showFiltersSubPanel ? 'active' : ''}`}
                      onClick={() => setShowFiltersSubPanel(!showFiltersSubPanel)}
                      title="Toggle filters drawer"
                    >
                      <FilterIcon />
                    </button>
                  </div>
                </div>

                {/* Live search input */}
                <div className="expenses-search-row">
                  <div className="expenses-search-wrapper">
                    <SearchIcon />
                    <input 
                      type="text"
                      placeholder="Search description, category, branch, status..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>

                {/* Filters Drawer (Sub-panel) */}
                {showFiltersSubPanel && (
                  <div className="filter-sub-panel">
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select 
                        className="form-select"
                        value={filterCategory}
                        onChange={(e) => {
                          setFilterCategory(e.target.value);
                          setCurrentPage(1);
                        }}
                      >
                        <option value="All">All Categories</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Salaries">Salaries</option>
                        <option value="Inventory">Inventory</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Branch</label>
                      <select 
                        className="form-select"
                        value={filterBranch}
                        onChange={(e) => {
                          setFilterBranch(e.target.value);
                          setCurrentPage(1);
                        }}
                      >
                        <option value="All">All Branches</option>
                        <option value="Mehdi Kitchen (Main)">Mehdi Kitchen (Main)</option>
                        <option value="Zangmo Kitchen">Zangmo Kitchen</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Status</label>
                      <select 
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => {
                          setFilterStatus(e.target.value);
                          setCurrentPage(1);
                        }}
                      >
                        <option value="All">All Statuses</option>
                        <option value="APPROVED">Approved</option>
                        <option value="PENDING">Pending</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Table Container */}
                <div className="expenses-table-wrapper">
                  <table className="expenses-table">
                    <thead>
                      <tr>
                        <th style={{ cursor: 'pointer' }} onClick={() => handleSort('date')}>
                          Date {renderSortIndicator('date')}
                        </th>
                        <th style={{ cursor: 'pointer' }} onClick={() => handleSort('category')}>
                          Category {renderSortIndicator('category')}
                        </th>
                        <th style={{ cursor: 'pointer' }} onClick={() => handleSort('description')}>
                          Description {renderSortIndicator('description')}
                        </th>
                        <th style={{ cursor: 'pointer' }} onClick={() => handleSort('amount')}>
                          Amount {renderSortIndicator('amount')}
                        </th>
                        <th style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>
                          Status {renderSortIndicator('status')}
                        </th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map(item => (
                        <tr 
                          key={item.id} 
                          onClick={() => setSelectedExpense(item)}
                          style={{ cursor: 'pointer' }}
                          title="Click to view details"
                        >
                          <td>{item.date}</td>
                          <td>{item.category}</td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.description}
                          </td>
                          <td className="amount-cell">{formatValue(item.amount)}</td>
                          <td>
                            <span className={`badge ${item.status.toLowerCase()}`}>
                              {item.status === 'PENDING' && <WarningIcon />}
                              {item.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                            <div className="table-actions-cell" style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                              {item.status === 'PENDING' ? (
                                userRole === 'Admin' ? (
                                  <>
                                    <button 
                                      onClick={(e) => handleApprove(item.id, e)}
                                      style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}
                                      title="Approve expense"
                                    >
                                      Approve
                                    </button>
                                    <button 
                                      onClick={(e) => handleReject(item.id, e)}
                                      style={{ background: '#fff7ed', border: '1px solid #ffedd5', color: '#c2410c', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}
                                      title="Reject expense"
                                    >
                                      Reject
                                    </button>
                                  </>
                                ) : (
                                  <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }} title="Admin approval required">
                                    🔒 Admin Only
                                  </span>
                                )
                              ) : (
                                <button 
                                  onClick={(e) => handleDelete(item.id, e)}
                                  style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '4px 6px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  title="Delete record"
                                >
                                  <TrashIcon />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {currentItems.length === 0 && (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                            No expenses found matching the selected filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer with Pagination */}
                {sortedExpenses.length > 0 && (
                  <div className="table-footer-row">
                    <span className="table-showing-text">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedExpenses.length)} of {sortedExpenses.length} transactions
                    </span>
                    {totalPages > 1 && (
                      <div className="pagination-btns">
                        <button 
                          className="pagination-arrow-btn"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeftIcon />
                        </button>
                        <button 
                          className="pagination-arrow-btn"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRightIcon />
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Transaction Details / Receipt Preview Modal */}
      {selectedExpense && (
        <div className="modal-overlay" onClick={() => setSelectedExpense(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div 
            className="modal" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              background: 'white', 
              width: '600px', 
              maxWidth: '90vw', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              height: '520px'
            }}
          >
            {/* Modal Left Pane: Metadata Info */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box', borderRight: '1px solid #f1f5f9' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ID: {selectedExpense.id}</span>
                  <span className={`badge ${selectedExpense.status.toLowerCase()}`}>{selectedExpense.status}</span>
                </div>
                
                <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '800', color: '#0f172a', lineHeight: '1.3' }}>{selectedExpense.description}</h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '12.5px', color: '#64748b', fontWeight: '500' }}>Branch: {selectedExpense.branch}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Date:</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>{selectedExpense.date}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Category:</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>{selectedExpense.category}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Recurring:</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>{selectedExpense.recurring ? 'Yes (Monthly)' : 'No'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Amount:</span>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{formatValue(selectedExpense.amount)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons in details */}
              <div style={{ marginTop: 'auto' }}>
                {selectedExpense.status === 'PENDING' && (
                  userRole === 'Admin' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <button 
                        onClick={(e) => handleApprove(selectedExpense.id, e)}
                        style={{ padding: '10px', background: '#047857', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', transition: 'opacity 0.2s' }}
                      >
                        Approve
                      </button>
                      <button 
                        onClick={(e) => handleReject(selectedExpense.id, e)}
                        style={{ padding: '10px', background: '#c2410c', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', transition: 'opacity 0.2s' }}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', textAlign: 'center', marginBottom: '12px', fontSize: '11.5px', fontWeight: '600', color: '#64748b' }}>
                      🔒 Approve/Reject restricted to Admin
                    </div>
                  )
                )}
                <button 
                  onClick={() => setSelectedExpense(null)}
                  style={{ width: '100%', padding: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}
                >
                  Close Window
                </button>
              </div>
            </div>

            {/* Modal Right Pane: Receipt Visualization */}
            <div style={{ background: '#f8fafc', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', boxSizing: 'border-box', position: 'relative' }}>
              
              {/* Receipt mockup */}
              <div style={{ background: 'white', width: '100%', height: '100%', padding: '20px 16px', borderRadius: '8px', border: '1px dashed #cbd5e1', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', fontFamily: 'Courier New, monospace', fontSize: '12px', color: '#1e293b' }}>
                <div style={{ textAlign: 'center', borderBottom: '1px dashed #e2e8f0', paddingBottom: '10px', marginBottom: '10px' }}>
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '800' }}>Z&M KITCHEN</h4>
                  <p style={{ margin: '0 0 1px 0', fontSize: '9px', color: '#64748b' }}>Branch: {selectedExpense.branch.toUpperCase()}</p>
                  <p style={{ margin: '0', fontSize: '9px', color: '#64748b' }}>DATE: {selectedExpense.date.toUpperCase()}</p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>ITEM / DESCRIPTION</span>
                  <span>QTY / PRICE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: '700', borderBottom: '1px dashed #e2e8f0', paddingBottom: '6px' }}>
                  <span style={{ maxWidth: '150px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{selectedExpense.description.toUpperCase()}</span>
                  <span>1x {formatValue(selectedExpense.amount)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', color: '#64748b' }}>
                  <span>SUBTOTAL:</span>
                  <span>{formatValue(selectedExpense.amount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', color: '#64748b' }}>
                  <span>TAXES (0.0%):</span>
                  <span>{formatValue(0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', borderTop: '2px dashed #94a3b8', paddingTop: '10px', fontSize: '13px', fontWeight: '900' }}>
                  <span>TOTAL PAID:</span>
                  <span>{formatValue(selectedExpense.amount)}</span>
                </div>

                {/* Stamped visual indicator */}
                <div style={{ 
                  border: `3px double ${selectedExpense.status === 'APPROVED' ? '#059669' : selectedExpense.status === 'REJECTED' ? '#dc2626' : '#d97706'}`,
                  color: selectedExpense.status === 'APPROVED' ? '#059669' : selectedExpense.status === 'REJECTED' ? '#dc2626' : '#d97706',
                  transform: 'rotate(-10deg) scale(1)',
                  padding: '6px 14px',
                  fontWeight: '900',
                  fontSize: '13px',
                  letterSpacing: '1px',
                  borderRadius: '6px',
                  position: 'absolute',
                  top: '55%',
                  left: '25%',
                  opacity: 0.8,
                  userSelect: 'none',
                  pointerEvents: 'none',
                  textTransform: 'uppercase',
                  textAlign: 'center'
                }}>
                  {selectedExpense.status}
                  <span style={{ display: 'block', fontSize: '7px', fontWeight: '500', marginTop: '2px' }}>
                    {selectedExpense.receiptName ? 'Receipt Link Verified' : 'Paperless Claim'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast alert popup */}
      {toast.show && (
        <div className="toast-alert">
          {toast.message}
        </div>
      )}
    </div>
  );
}
