import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/users.css';
import '../../assets/styles/settings.css';

// SVG Icons
const TuningIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8v-2m0 2a2 2 0 100 4m0-4a2 2 0 110 4m12-2v-2m0 2a2 2 0 100 4m0-4a2 2 0 110 4M6 12v-2m0 2a2 2 0 100 4m0-4a2 2 0 110 4m12-6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4M6 4v2m0 0a2 2 0 100 4m0-4a2 2 0 110 4m12 10v2m0-2a2 2 0 100 4m0-4a2 2 0 110 4"/></svg>;
const MapPinIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const CloudUploadIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>;
const PrinterIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-12 0v4h8v-4m-8 0h8"/></svg>;
const WarningIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const InfoIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
const StoreIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="8" rx="2"/><path d="M4 21v-6a2 2 0 012-2h12a2 2 0 012 2v6M9 13v8M15 13v8"/></svg>;
const ChevronDown = () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>;

const defaultSettings = {
  'Mehdi Kitchen (Main)': {
    uid: 'ZM-LON-08',
    gstRate: '18.00',
    serviceCharge: '5.00',
    inclusiveTaxes: true,
    maxDiscount: '25',
    minSpend: '500.00',
    phone: '+44 20 7946 0123',
    email: 'downtown@zmkitchen.co',
    address: '124 Baker Street, Marylebone, London NW1 6XE, United Kingdom. Ground Floor Unit B.',
    printerDevice: 'EPSON TM-T88VI (USB)',
    printerStatus: 'ONLINE',
    backupSchedule: 'Daily at Night',
    lastBackup: 'Today, 04:30 AM (UTC)',
    status: 'Operational',
    hours: '06:00 - 23:00'
  },
  'Zangmo Kitchen': {
    uid: 'ZM-THI-02',
    gstRate: '15.00',
    serviceCharge: '7.00',
    inclusiveTaxes: true,
    maxDiscount: '20',
    minSpend: '400.00',
    phone: '+975 2 334455',
    email: 'uptown@zmkitchen.co',
    address: 'Uptown Galleria Rd, Block C, Thimphu, Bhutan. Second Floor Suite 202.',
    printerDevice: 'STAR TSP143III (LAN)',
    printerStatus: 'ONLINE',
    backupSchedule: 'Weekly',
    lastBackup: 'Yesterday, 11:15 PM (UTC)',
    status: 'Operational',
    hours: '04:00 - 20:00'
  }
};

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [selectedBranch, setSelectedBranch] = useState('Mehdi Kitchen (Main)');
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showBackupDropdown, setShowBackupDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPrinterDropdown, setShowPrinterDropdown] = useState(false);

  // Load database settings
  const [settingsDB, setSettingsDB] = useState(() => {
    const saved = localStorage.getItem('zangmo_branch_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return defaultSettings;
  });

  // Form States (Bind to active branch data)
  const currentBranchConfig = settingsDB[selectedBranch] || defaultSettings['Mehdi Kitchen (Main)'];

  const [gstRate, setGstRate] = useState(currentBranchConfig.gstRate);
  const [serviceCharge, setServiceCharge] = useState(currentBranchConfig.serviceCharge);
  const [inclusiveTaxes, setInclusiveTaxes] = useState(currentBranchConfig.inclusiveTaxes);
  const [maxDiscount, setMaxDiscount] = useState(currentBranchConfig.maxDiscount);
  const [minSpend, setMinSpend] = useState(currentBranchConfig.minSpend);
  const [phone, setPhone] = useState(currentBranchConfig.phone);
  const [email, setEmail] = useState(currentBranchConfig.email);
  const [address, setAddress] = useState(currentBranchConfig.address);
  const [printerDevice, setPrinterDevice] = useState(currentBranchConfig.printerDevice);
  const [backupSchedule, setBackupSchedule] = useState(currentBranchConfig.backupSchedule);
  
  // Tab 2 fields
  const [branchStatus, setBranchStatus] = useState(currentBranchConfig.status);
  const [branchHours, setBranchHours] = useState(currentBranchConfig.hours);

  // Modal / Alert states
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [printerTestModal, setPrinterTestModal] = useState(false);

  // Sync Form States when active branch changes
  useEffect(() => {
    const config = settingsDB[selectedBranch] || defaultSettings['Mehdi Kitchen (Main)'];
    setGstRate(config.gstRate);
    setServiceCharge(config.serviceCharge);
    setInclusiveTaxes(config.inclusiveTaxes);
    setMaxDiscount(config.maxDiscount);
    setMinSpend(config.minSpend);
    setPhone(config.phone);
    setEmail(config.email);
    setAddress(config.address);
    setPrinterDevice(config.printerDevice);
    setBackupSchedule(config.backupSchedule);
    setBranchStatus(config.status);
    setBranchHours(config.hours);
  }, [selectedBranch, settingsDB]);

  // Check if there are unsaved changes
  const hasChanges = 
    gstRate !== currentBranchConfig.gstRate ||
    serviceCharge !== currentBranchConfig.serviceCharge ||
    inclusiveTaxes !== currentBranchConfig.inclusiveTaxes ||
    maxDiscount !== currentBranchConfig.maxDiscount ||
    minSpend !== currentBranchConfig.minSpend ||
    phone !== currentBranchConfig.phone ||
    email !== currentBranchConfig.email ||
    address !== currentBranchConfig.address ||
    printerDevice !== currentBranchConfig.printerDevice ||
    backupSchedule !== currentBranchConfig.backupSchedule ||
    branchStatus !== currentBranchConfig.status ||
    branchHours !== currentBranchConfig.hours;

  const handleDiscard = () => {
    // Reset to current branch settings
    setGstRate(currentBranchConfig.gstRate);
    setServiceCharge(currentBranchConfig.serviceCharge);
    setInclusiveTaxes(currentBranchConfig.inclusiveTaxes);
    setMaxDiscount(currentBranchConfig.maxDiscount);
    setMinSpend(currentBranchConfig.minSpend);
    setPhone(currentBranchConfig.phone);
    setEmail(currentBranchConfig.email);
    setAddress(currentBranchConfig.address);
    setPrinterDevice(currentBranchConfig.printerDevice);
    setBackupSchedule(currentBranchConfig.backupSchedule);
    setBranchStatus(currentBranchConfig.status);
    setBranchHours(currentBranchConfig.hours);

    setToast({ show: true, type: 'info', message: 'Changes discarded.' });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 2000);
  };

  const handleSaveSettings = () => {
    const updatedDB = {
      ...settingsDB,
      [selectedBranch]: {
        ...currentBranchConfig,
        gstRate,
        serviceCharge,
        inclusiveTaxes,
        maxDiscount,
        minSpend,
        phone,
        email,
        address,
        printerDevice,
        backupSchedule,
        status: branchStatus,
        hours: branchHours
      }
    };

    localStorage.setItem('zangmo_branch_settings', JSON.stringify(updatedDB));
    setSettingsDB(updatedDB);

    setToast({ show: true, type: 'success', message: 'Settings successfully pushed live!' });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
  };

  // Database Backup Actions
  const handleBackupExport = () => {
    const backupData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      backupData[key] = localStorage.getItem(key);
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `zangmo_database_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setToast({ show: true, type: 'success', message: 'Database backup downloaded successfully!' });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 2000);
  };

  const handlePrinterTest = () => {
    setPrinterTestModal(true);
  };

  return (
    <div className="dashboard">
      <AdminSidebar activePage="settings" />

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Topbar title="System Configuration Hub" />

        <div className="page-content" style={{ overflowY: 'auto' }}>
          {/* Header with branch selector */}
          <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="page-title">
              <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                Configuration Hub
              </h1>
              <p>Manage global kitchen rules, branch identities, and technical integrations.</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Select Branch Target</span>
              <button 
                className="settings-branch-dropdown-btn" 
                onClick={() => setShowBranchDropdown(!showBranchDropdown)}
              >
                <StoreIcon />
                <span>{selectedBranch}</span>
                <ChevronDown />
              </button>
              {showBranchDropdown && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setShowBranchDropdown(false)} />
                  <div className="settings-branch-dropdown-menu">
                    {['Mehdi Kitchen (Main)', 'Zangmo Kitchen'].map(opt => (
                      <div 
                        key={opt}
                        className={`settings-branch-option ${selectedBranch === opt ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedBranch(opt);
                          setShowBranchDropdown(false);
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="settings-layout">
            {/* Left Column: Side Tabs */}
            <div className="settings-tabs-list">
              <button 
                className={`settings-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                onClick={() => setActiveTab('general')}
              >
                <div className="settings-tab-icon">
                  <TuningIcon />
                </div>
                <div className="settings-tab-details">
                  <h4>General</h4>
                  <p>Tax &amp; Discounts</p>
                </div>
              </button>

              <button 
                className={`settings-tab-btn ${activeTab === 'branch' ? 'active' : ''}`}
                onClick={() => setActiveTab('branch')}
              >
                <div className="settings-tab-icon">
                  <MapPinIcon />
                </div>
                <div className="settings-tab-details">
                  <h4>Branch Settings</h4>
                  <p>Location Info</p>
                </div>
              </button>

              <button 
                className={`settings-tab-btn ${activeTab === 'backup' ? 'active' : ''}`}
                onClick={() => setActiveTab('backup')}
              >
                <div className="settings-tab-icon">
                  <CloudUploadIcon />
                </div>
                <div className="settings-tab-details">
                  <h4>Backup</h4>
                  <p>Data Safety</p>
                </div>
              </button>

              <button 
                className={`settings-tab-btn ${activeTab === 'printer' ? 'active' : ''}`}
                onClick={() => setActiveTab('printer')}
              >
                <div className="settings-tab-icon">
                  <PrinterIcon />
                </div>
                <div className="settings-tab-details">
                  <h4>Printer</h4>
                  <p>Thermal Config</p>
                </div>
              </button>
            </div>

            {/* Right Column: Active Tab Panels */}
            <div className="settings-panels-container">
              
              {/* Tab 1: General (Tax & Discounts, Branch Identity, Printer, Backup) */}
              {activeTab === 'general' && (
                <div className="settings-panels-grid">
                  
                  {/* Left Column in General */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Taxation Rules */}
                    <div className="settings-card">
                      <div className="settings-card-header">
                        <h3 className="settings-card-title">
                          <span className="material-symbols-outlined">percent</span> Taxation Rules
                        </h3>
                      </div>
                      <div className="settings-form-group">
                        <label>Standard GST/VAT (%)</label>
                        <input 
                          type="text" 
                          className="settings-input" 
                          value={gstRate} 
                          onChange={e => setGstRate(e.target.value)} 
                        />
                      </div>
                      <div className="settings-form-group">
                        <label>Service Charge (%)</label>
                        <input 
                          type="text" 
                          className="settings-input" 
                          value={serviceCharge} 
                          onChange={e => setServiceCharge(e.target.value)} 
                        />
                      </div>
                      <label className="settings-checkbox-row">
                        <input 
                          type="checkbox" 
                          checked={inclusiveTaxes} 
                          onChange={e => setInclusiveTaxes(e.target.checked)} 
                        />
                        <span>Prices are inclusive of taxes</span>
                      </label>
                    </div>

                    {/* Branch Identity */}
                    <div className="settings-card">
                      <div className="settings-card-header" style={{ justifyContent: 'space-between' }}>
                        <h3 className="settings-card-title">
                          <span className="material-symbols-outlined">storefront</span> Branch Identity
                        </h3>
                        <span className="settings-uid-badge">UID: {currentBranchConfig.uid}</span>
                      </div>
                      <div className="settings-form-group">
                        <label>Primary Contact No.</label>
                        <input 
                          type="text" 
                          className="settings-input" 
                          value={phone} 
                          onChange={e => setPhone(e.target.value)} 
                        />
                      </div>
                      <div className="settings-form-group">
                        <label>Operations Email</label>
                        <input 
                          type="email" 
                          className="settings-input" 
                          value={email} 
                          onChange={e => setEmail(e.target.value)} 
                        />
                      </div>
                      <div className="settings-form-group">
                        <label>Physical Address</label>
                        <textarea 
                          className="settings-input" 
                          rows="4" 
                          style={{ resize: 'none' }}
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column in General */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Discount Thresholds */}
                    <div className="settings-card">
                      <div className="settings-card-header">
                        <h3 className="settings-card-title">
                          <span className="material-symbols-outlined">sell</span> Discount Thresholds
                        </h3>
                      </div>
                      <div className="settings-form-group">
                        <label>Max Manager Discount (%)</label>
                        <input 
                          type="text" 
                          className="settings-input" 
                          value={maxDiscount} 
                          onChange={e => setMaxDiscount(e.target.value)} 
                        />
                      </div>
                      <div className="settings-form-group">
                        <label>Auto-Apply Min Spend ($)</label>
                        <input 
                          type="text" 
                          className="settings-input" 
                          value={minSpend} 
                          onChange={e => setMinSpend(e.target.value)} 
                        />
                      </div>
                      <div className="settings-info-alert">
                        <span className="material-symbols-outlined">info</span>
                        <p>Setting these thresholds prevents unauthorized discount abuse and triggers automatic kitchen loyalty perks.</p>
                      </div>
                    </div>

                    {/* Kitchen Printer (Dark Panel) */}
                    <div className="settings-card dark-panel">
                      <div className="settings-card-header">
                        <h3 className="settings-card-title">
                          <span className="material-symbols-outlined">print</span> Kitchen Printer
                        </h3>
                      </div>
                      <div className="dark-status-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: '11px', display: 'block', opacity: 0.6 }}>DEFAULT DEVICE</span>
                          <strong style={{ fontSize: '14px' }}>{printerDevice}</strong>
                        </div>
                        <span className="status-indicator-badge">ONLINE</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={handlePrinterTest}
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '1.5px solid rgba(255,255,255,0.1)',
                          padding: '12px',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontWeight: '700',
                          fontSize: '13px',
                          cursor: 'pointer',
                          fontFamily: 'var(--font)'
                        }}
                      >
                        TRIGGER TEST PRINT
                      </button>
                    </div>

                    {/* Data Backup */}
                    <div className="settings-card">
                      <div className="settings-card-header">
                        <h3 className="settings-card-title">
                          <span className="material-symbols-outlined">backup</span> Data Backup
                        </h3>
                      </div>
                      
                      <div className="backup-info-box">
                        <div className="backup-info-icon">
                          <span className="material-symbols-outlined">cloud_done</span>
                        </div>
                        <div className="backup-info-txt">
                          <h5>Last Sync Complete</h5>
                          <p>{currentBranchConfig.lastBackup}</p>
                        </div>
                      </div>

                      <div className="settings-form-group">
                        <label>Cloud Schedule</label>
                        <div className="settings-custom-select-container">
                          <button 
                            type="button"
                            className="settings-custom-select-btn"
                            onClick={() => setShowBackupDropdown(!showBackupDropdown)}
                          >
                            <span>{backupSchedule}</span>
                            <ChevronDown />
                          </button>
                          {showBackupDropdown && (
                            <>
                              <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setShowBackupDropdown(false)} />
                              <div className="settings-custom-select-menu">
                                {['Daily at Night', 'Weekly', 'Monthly'].map(opt => (
                                  <div 
                                    key={opt}
                                    className={`settings-custom-select-option ${backupSchedule === opt ? 'active' : ''}`}
                                    onClick={() => {
                                      setBackupSchedule(opt);
                                      setShowBackupDropdown(false);
                                    }}
                                  >
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 2: Branch Settings (Operational status, timings, location notes) */}
              {activeTab === 'branch' && (
                <div className="settings-card">
                  <div className="settings-card-header">
                    <h3 className="settings-card-title">
                      <span className="material-symbols-outlined">store</span> Branch Location operational Parameters
                    </h3>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-field">
                      <label>Node Status</label>
                      <div className="settings-custom-select-container">
                        <button 
                          type="button"
                          className="settings-custom-select-btn"
                          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        >
                          <span>{branchStatus === 'Maintenance' ? 'Maintenance / Prep Block' : branchStatus}</span>
                          <ChevronDown />
                        </button>
                        {showStatusDropdown && (
                          <>
                            <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setShowStatusDropdown(false)} />
                            <div className="settings-custom-select-menu">
                              {[
                                { value: 'Operational', label: 'Operational' },
                                { value: 'Maintenance', label: 'Maintenance / Prep Block' },
                                { value: 'Closed', label: 'Closed' }
                              ].map(opt => (
                                <div 
                                  key={opt.value}
                                  className={`settings-custom-select-option ${branchStatus === opt.value ? 'active' : ''}`}
                                  onClick={() => {
                                    setBranchStatus(opt.value);
                                    setShowStatusDropdown(false);
                                  }}
                                >
                                  {opt.label}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Hours of Operation</label>
                      <input 
                        type="text" 
                        value={branchHours} 
                        onChange={e => setBranchHours(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Backup (Download local DB state or restore) */}
              {activeTab === 'backup' && (
                <div className="settings-card">
                  <div className="settings-card-header">
                    <h3 className="settings-card-title">
                      <span className="material-symbols-outlined">database</span> Database Safety &amp; Export
                    </h3>
                  </div>
                  <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>
                    Download the complete state of local transactions, menus, inventory item matrices, hiring requests, and employee accounts to local JSON storage for database integrity checks.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button 
                      type="button" 
                      onClick={handleBackupExport}
                      style={{
                        padding: '12px 24px',
                        background: '#111827',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Export Database (JSON)
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 4: Printer Layout Details */}
              {activeTab === 'printer' && (
                <div className="settings-card">
                  <div className="settings-card-header">
                    <h3 className="settings-card-title">
                      <span className="material-symbols-outlined">print_connect</span> Receipt Thermal layout
                    </h3>
                  </div>
                  <div className="settings-form-group">
                    <label>Printer Hardware Profile</label>
                    <div className="settings-custom-select-container">
                      <button 
                        type="button"
                        className="settings-custom-select-btn"
                        onClick={() => setShowPrinterDropdown(!showPrinterDropdown)}
                      >
                        <span>{printerDevice}</span>
                        <ChevronDown />
                      </button>
                      {showPrinterDropdown && (
                        <>
                          <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setShowPrinterDropdown(false)} />
                          <div className="settings-custom-select-menu">
                            {['EPSON TM-T88VI (USB)', 'STAR TSP143III (LAN)', 'Bixolon SRP-350III (USB)'].map(opt => (
                              <div 
                                key={opt}
                                className={`settings-custom-select-option ${printerDevice === opt ? 'active' : ''}`}
                                onClick={() => {
                                  setPrinterDevice(opt);
                                  setShowPrinterDropdown(false);
                                }}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="settings-info-alert" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
                    <span className="material-symbols-outlined" style={{ color: '#166534' }}>check_circle</span>
                    <p style={{ color: '#15803d' }}>Printer connection has been configured successfully. Triggering invoices prints to this profile.</p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Floating warning drawer at the bottom */}
          {hasChanges && (
            <div className="unsaved-alert-bar">
              <div className="unsaved-alert-left">
                <div className="unsaved-alert-icon">
                  <WarningIcon />
                </div>
                <div className="unsaved-alert-txt">
                  <h4>Unsaved Changes Detected</h4>
                  <p>You have modified taxation rules and branch contact information. These changes will affect live billing immediately upon saving.</p>
                </div>
              </div>
              <div className="unsaved-alert-actions">
                <button type="button" className="btn-discard" onClick={handleDiscard}>Discard</button>
                <button type="button" className="btn-push-live" onClick={handleSaveSettings}>Confirm &amp; Push Live</button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Printer Test Modal */}
      {printerTestModal && (
        <div className="modal-overlay" onClick={() => setPrinterTestModal(false)}>
          <div className="modal" style={{ width: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Simulated Test Receipt</h3>
              <button className="close-btn" onClick={() => setPrinterTestModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-body" style={{ background: '#f1f5f9', padding: '16px' }}>
              <div style={{
                background: 'white',
                padding: '24px',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#000000',
                border: '1px dashed #cbd5e1',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
              }}>
                <h4 style={{ textAlign: 'center', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Z&amp;M Kitchen</h4>
                <p style={{ textAlign: 'center', margin: '0 0 16px 0' }}>{selectedBranch}</p>
                <p>Date: {new Date().toLocaleString()}</p>
                <p>Receipt: #TEST-001</p>
                <div style={{ borderBottom: '1px dashed #000000', margin: '12px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>1x Test Product</span>
                  <span>$10.00</span>
                </div>
                <div style={{ borderBottom: '1px dashed #000000', margin: '12px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>Subtotal</span>
                  <span>$10.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tax ({gstRate}%)</span>
                  <span>${(10 * parseFloat(gstRate) / 100).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Service ({serviceCharge}%)</span>
                  <span>${(10 * parseFloat(serviceCharge) / 100).toFixed(2)}</span>
                </div>
                <div style={{ borderBottom: '1px dashed #000000', margin: '12px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px' }}>
                  <span>TOTAL</span>
                  <span>${(10 + (10 * parseFloat(gstRate) / 100) + (10 * parseFloat(serviceCharge) / 100)).toFixed(2)}</span>
                </div>
                <p style={{ textAlign: 'center', marginTop: '24px', margin: '24px 0 0 0' }}>*** TEST OK ***</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setPrinterTestModal(false)}>Close Preview</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast popup */}
      {toast.show && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <span className="material-symbols-outlined">check_circle</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
