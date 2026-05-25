import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/users.css';
import '../../assets/styles/branches.css';
import '../../assets/styles/components.css';

// SVGs
const SearchIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const MapPinIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const DotsIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const HomeIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const ClockIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const LightbulbIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21h6M12 21v-4M9.5 9.5L7 12M14.5 9.5l2.5 2.5"/><path d="M12 17a5 5 0 100-10 5 5 0 000 10z"/></svg>;
const EditIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>;

const initialBranchesData = [
  {
    id: 1,
    title: 'Mehdi Kitchen (Main)',
    address: 'Downtown Main St, Suite 100',
    status: 'Operational',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=600&auto=format&fit=crop',
    monthlyRev: '$142,500',
    staff: '24',
    manager: 'Mehdi Khan',
    managerInitials: 'MK',
    avatarClass: 'mr',
    hours: '06:00 - 23:00'
  },
  {
    id: 2,
    title: 'Zangmo Kitchen',
    address: 'Uptown Galleria Rd, Block C',
    status: 'Operational',
    image: 'https://images.unsplash.com/photo-1581622558667-3419a8dc5f83?q=80&w=600&auto=format&fit=crop',
    monthlyRev: '$98,200',
    staff: '18',
    manager: 'Branch Manager',
    managerInitials: 'BM',
    avatarClass: 'el',
    hours: '04:00 - 20:00'
  }
];

export default function AdminBranches() {
  const [currentView, setCurrentView] = useState('list');
  const [branches, setBranches] = useState(() => {
    const saved = localStorage.getItem('zangmo_branches');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialBranchesData;
      }
    }
    return initialBranchesData;
  });

  useEffect(() => {
    localStorage.setItem('zangmo_branches', JSON.stringify(branches));
  }, [branches]);

  // Load staff to fetch managers dynamically
  const [managersList, setManagersList] = useState([]);
  useEffect(() => {
    const savedStaff = localStorage.getItem('zangmo_staff_list');
    if (savedStaff) {
      const parsed = JSON.parse(savedStaff);
      // Filter out users who are Managers or Admin role to assign them as branch managers
      const managers = parsed.filter(u => u.role === 'Manager' || u.role === 'Admin');
      setManagersList(managers);
    } else {
      // Default fallback managers
      setManagersList([
        { name: 'Marcus Sterling' },
        { name: 'Elena Lopez' },
        { name: 'Zangmo Wangchuck' }
      ]);
    }
  }, [currentView]);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('zangmo_default_currency') || 'Rs.';
  });

  // Assign Manager Modal State
  const [assigningBranchId, setAssigningBranchId] = useState(null);
  const [selectedManagerName, setSelectedManagerName] = useState('');

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleStorage = () => {
      setCurrency(localStorage.getItem('zangmo_default_currency') || 'Rs.');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handlers
  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleDelete = (id) => {
    setBranches(branches.filter(b => b.id !== id));
    setActiveDropdown(null);
  };

  const handleOpenAssignManager = (branch, e) => {
    e.stopPropagation();
    setAssigningBranchId(branch.id);
    setSelectedManagerName(branch.manager);
    setActiveDropdown(null);
  };

  const handleSaveManagerAssignment = () => {
    const initials = selectedManagerName.split(' ').map(p => p[0]).join('').toUpperCase();
    setBranches(prev => prev.map(b => {
      if (b.id === assigningBranchId) {
        return {
          ...b,
          manager: selectedManagerName,
          managerInitials: initials || 'M'
        };
      }
      return b;
    }));
    setAssigningBranchId(null);
  };

  // Search Filter logic
  const filteredBranches = branches.filter(branch => 
    branch.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    branch.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.manager.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard">
      <AdminSidebar activePage="branches" />
      
      <div className="main-content">
        <Topbar title="Branch Settings (Admin Mode)" />
        
        <div className="page-content">
          {currentView === 'list' ? (
            <>
              <div className="page-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="page-title">
                  <h1>Branch Management</h1>
                  <p>Overview, configurations, and manager assignments for all operational kitchen nodes.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div className="pos-search-wrapper" style={{ margin: 0, height: '42px', width: '280px' }}>
                    <SearchIcon />
                    <input 
                      type="text" 
                      placeholder="Search name, address, manager..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="btn-dark" onClick={() => setCurrentView('add')} style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px', borderRadius: '6px' }}>
                    <HomeIcon /> Add New Branch
                  </button>
                </div>
              </div>
              
              <div className="branch-grid">
                {filteredBranches.length > 0 ? filteredBranches.map(branch => (
                  <div className="branch-card" key={branch.id}>
                    <div className="branch-image-container" style={{ backgroundImage: `url(${branch.image})` }}>
                      <div className={`status-pill ${branch.status.toLowerCase()}`}>
                        {branch.status}
                      </div>
                    </div>
                    <div className="branch-content">
                      <div className="branch-header">
                        <div>
                          <h3 className="branch-title">{branch.title}</h3>
                          <p className="branch-address"><MapPinIcon /> {branch.address}</p>
                        </div>
                        <div className="branch-actions-container" onClick={(e) => e.stopPropagation()}>
                          <div style={{ color: '#9ca3af', cursor: 'pointer', padding: '4px' }} onClick={(e) => toggleDropdown(branch.id, e)}>
                            <DotsIcon />
                          </div>
                          {activeDropdown === branch.id && (
                            <div className="branch-dropdown">
                              <div className="branch-dropdown-item" onClick={(e) => handleOpenAssignManager(branch, e)}><EditIcon /> Set Manager</div>
                              <div className="branch-dropdown-item delete" onClick={() => handleDelete(branch.id)}><TrashIcon /> Delete Branch</div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="branch-metrics">
                        <div className="metric-box">
                          <div className="metric-label">Monthly Rev</div>
                          <div className="metric-value">
                            {branch.monthlyRev.replace('$', currency === 'Rs.' ? 'Rs. ' : '$')}
                          </div>
                        </div>
                        <div className="metric-box">
                          <div className="metric-label">Total Staff</div>
                          <div className="metric-value">{branch.staff}</div>
                        </div>
                      </div>
                      
                      <div className="branch-footer" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '12px' }}>
                        <div className="manager-info" style={{ cursor: 'pointer' }} onClick={(e) => handleOpenAssignManager(branch, e)} title="Click to assign manager">
                          <div className="manager-avatar" style={{ background: '#b45309', color: 'white', fontWeight: '700' }}>
                            {branch.managerInitials}
                          </div>
                          <div className="manager-details">
                            <h5 style={{ margin: '0 0 2px 0', fontSize: '13px' }}>{branch.manager}</h5>
                            <p style={{ margin: 0, fontSize: '11px', color: '#b45309', fontWeight: '600' }}>Assign Manager ⚙</p>
                          </div>
                        </div>
                        <div className="hours-info">
                          <h5 className="hours-time">{branch.hours}</h5>
                          <p className="hours-label">Daily Hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#6b7280', background: 'white', borderRadius: '8px', border: '1px dashed #d1d5db' }}>
                    <p style={{fontSize: '16px', fontWeight: '500'}}>No branches found matching search parameters.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <AddBranch 
              managers={managersList}
              onCancel={() => setCurrentView('list')} 
              onSave={(newB) => {
                setBranches([newB, ...branches]);
                setCurrentView('list');
              }}
            />
          )}
        </div>
      </div>

      {/* Assign Manager Modal popup */}
      {assigningBranchId !== null && (
        <div className="modal-overlay" onClick={() => setAssigningBranchId(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ background: 'white', width: '400px', padding: '24px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Assign Branch Manager</h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Select a manager from the staff record database to supervise operations for this branch location.
            </p>
            
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontSize: '11px', fontWeight: '700', color: '#4b5563' }}>Select Staff Manager</label>
              <select 
                className="input-field" 
                value={selectedManagerName}
                onChange={e => setSelectedManagerName(e.target.value)}
                style={{ width: '100%', marginTop: '6px' }}
              >
                {managersList.map((m, idx) => (
                  <option key={idx} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                className="btn-outline" 
                onClick={() => setAssigningBranchId(null)}
                style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', border: '1px solid #cbd5e1', background: 'white', fontSize: '13px', fontWeight: '600' }}
              >
                Cancel
              </button>
              <button 
                className="btn-orange" 
                onClick={handleSaveManagerAssignment}
                style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', border: 'none', background: '#b45309', color: 'white', fontSize: '13px', fontWeight: '600' }}
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Dedicated branch adding module
function AddBranch({ managers, onCancel, onSave }) {
  const [branchName, setBranchName] = useState('Downtown Central Hub');
  const [address, setAddress] = useState('1248 Enterprise Way, Ste 400');
  const [manager, setManager] = useState(managers[0]?.name || 'Marcus Sterling');
  const [hoursOpen, setHoursOpen] = useState('08:00');
  const [hoursClose, setHoursClose] = useState('22:00');
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('zangmo_default_currency') || 'Rs.';
  });
  
  const handleCurrencyChange = (val) => {
    setCurrency(val);
    localStorage.setItem('zangmo_default_currency', val);
    window.dispatchEvent(new Event('storage'));
  };

  const handleSave = () => {
    const initials = manager.split(' ').map(p => p[0]).join('').toUpperCase();
    const newBranch = {
      id: Date.now(),
      title: branchName,
      address: address,
      status: 'Operational',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop',
      monthlyRev: '$0',
      staff: '0',
      manager: manager,
      managerInitials: initials || 'M',
      avatarClass: 'mr',
      hours: `${hoursOpen} - ${hoursClose}`
    };
    onSave(newBranch);
  };
  
  return (
    <div className="add-branch-container">
      <div className="breadcrumb"><span style={{cursor: 'pointer'}} onClick={onCancel}>Settings</span> › <strong>Branch Management</strong></div>
      <div className="add-branch-header">
        <div>
          <h2 className="page-title">Provision New Branch</h2>
          <p className="page-subtitle">Configure physical location, operational metadata, and fiscal settings.</p>
        </div>
        <div className="draft-pill">DRAFTING MODE</div>
      </div>
      
      <div className="add-branch-content">
        <div className="form-column">
          <div className="form-card">
            <div className="card-title-row">
              <span className="step-number">01</span>
              <h3>Core Identity & Location</h3>
            </div>
            
            <div className="form-group">
              <label className="form-label">BRANCH NAME</label>
              <input type="text" className="input-field" value={branchName} onChange={e => setBranchName(e.target.value)} />
            </div>
            
            <div className="form-group">
              <label className="form-label">PHYSICAL ADDRESS</label>
              <div className="input-with-icon">
                <MapPinIcon />
                <input type="text" className="input-field" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
            </div>
            
            <div className="row">
              <div className="col">
                <label className="form-label">BRANCH MANAGER</label>
                <select className="input-field" value={manager} onChange={e => setManager(e.target.value)}>
                  {managers.map((m, idx) => (
                    <option key={idx} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="col">
                <label className="form-label">CONTACT PHONE</label>
                <input type="text" className="input-field" defaultValue="+1 (555) 000-0000" />
              </div>
            </div>
          </div>
          
          <div className="form-card">
            <div className="card-title-row">
              <span className="step-number">02</span>
              <h3>Operations & Fiscal Settings</h3>
            </div>
            
            <div className="ops-fiscal-layout">
              <div className="ops-column">
                <label className="form-label">OPERATING HOURS</label>
                
                <div className="time-row">
                  <div className="time-label">Weekdays</div>
                  <div className="input-with-icon time-input">
                    <ClockIcon />
                    <input type="text" className="input-field" value={`${hoursOpen} AM`} onChange={e => setHoursOpen(e.target.value.replace(' AM', ''))} />
                  </div>
                  <span style={{fontSize: '13px'}}>to</span>
                  <div className="input-with-icon time-input">
                    <ClockIcon />
                    <input type="text" className="input-field" value={`${hoursClose} PM`} onChange={e => setHoursClose(e.target.value.replace(' PM', ''))} />
                  </div>
                </div>
              </div>
              
              <div className="fiscal-column">
                <label className="form-label">TAX & CURRENCY</label>
                <div className="currency-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="currency-label">Default Currency</div>
                  <select 
                    value={currency} 
                    onChange={e => handleCurrencyChange(e.target.value)}
                    className="input-field"
                    style={{ 
                      width: '120px', 
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: '600',
                      marginTop: 0
                    }}
                  >
                    <option value="Rs.">Rs. (Rupees)</option>
                    <option value="$">USD ($)</option>
                  </select>
                </div>
                
                <label className="form-label" style={{marginTop: '20px'}}>BASE TAX RATE (%)</label>
                <div className="tax-row">
                  <input type="text" className="input-field tax-input" defaultValue="8.5" />
                  <span style={{fontSize: '13px', color: '#374151'}}>Standard Sales Tax</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button className="btn-outline" onClick={onCancel}>Discard Draft</button>
            <button className="btn-orange-large" onClick={handleSave}>Finalize & Deploy Branch</button>
          </div>
        </div>

        <div className="sidebar-column">
          <div className="preview-card">
            <div className="preview-pill">PREVIEW</div>
            <h4 className="preview-title">{branchName}</h4>
            <p className="preview-subtitle">{address}</p>
            
            <div className="preview-stats">
              <div>
                <div className="preview-stat-label">STATUS</div>
                <div className="preview-stat-val ready">Ready to Sync</div>
              </div>
              <div>
                <div className="preview-stat-label">MANAGER</div>
                <div className="preview-stat-val">{manager}</div>
              </div>
            </div>
            
            <div className="preview-progress">
              <div className="progress-label">PERFORMANCE GOAL</div>
              <div className="progress-bar"><div className="progress-fill"></div></div>
            </div>
          </div>
          
          <div className="tip-card">
            <div className="tip-header">
              <LightbulbIcon />
              <h4>Setup Tip</h4>
            </div>
            <p className="tip-text">
              Adding a branch will automatically generate a new <strong>Inventory Node</strong>. 
              Ensure your Manager selection has the correct 'Branch Admin' permissions enabled in the User Management tab.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
