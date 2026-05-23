import React, { useState, useEffect } from 'react';
import '../assets/styles/users.css';
import '../assets/styles/branches.css';

import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../assets/styles/components.css';

// SVGs
const SearchIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const GridIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const UserIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const SettingsIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
const POSIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14M8 10h8M8 14h8M8 6h8"/></svg>;
const CustomersIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
const EventsIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const ExpensesIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>;
const InventoryIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const UsersGroupIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
const LogoutIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const BellIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
const WifiIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>;
const MapPinIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const DotsIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const HomeIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const ClockIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const LightbulbIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21h6M12 21v-4M9.5 9.5L7 12M14.5 9.5l2.5 2.5"/><path d="M12 17a5 5 0 100-10 5 5 0 000 10z"/></svg>;
const BuildingIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l8-4v18M13 3l8 4v14"/><path d="M9 10h.01M9 14h.01M17 10h.01M17 14h.01M17 18h.01"/></svg>;
const EditIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>;
const CheckIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>;

function AddBranch({ onCancel }) {
  const [branchName, setBranchName] = useState('Downtown Central Hub');
  const [address, setAddress] = useState('1248 Enterprise Way, Ste 400');
  const [manager, setManager] = useState('Marcus Sterling');
  
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
                  <option>Marcus Sterling</option>
                  <option>Elena Lopez</option>
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
                    <input type="text" className="input-field" defaultValue="08:00 AM" />
                  </div>
                  <span style={{fontSize: '13px'}}>to</span>
                  <div className="input-with-icon time-input">
                    <ClockIcon />
                    <input type="text" className="input-field" defaultValue="10:00 PM" />
                  </div>
                </div>
                
                <div className="time-row">
                  <div className="time-label">Weekend</div>
                  <div className="input-with-icon time-input">
                    <ClockIcon />
                    <input type="text" className="input-field" defaultValue="10:00 AM" />
                  </div>
                  <span style={{fontSize: '13px'}}>to</span>
                  <div className="input-with-icon time-input">
                    <ClockIcon />
                    <input type="text" className="input-field" defaultValue="11:30 PM" />
                  </div>
                </div>
              </div>
              
              <div className="fiscal-column">
                <label className="form-label">TAX & CURRENCY</label>
                <div className="currency-row">
                  <div className="currency-label">Default Currency</div>
                  <div className="currency-val">USD ($)</div>
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
            <button className="btn-orange-large" onClick={() => onCancel()}>Finalize & Deploy Branch</button>
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
                <div className="preview-stat-val">M. Sterling</div>
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
          
          <div className="map-card">
            <div className="map-pin-large">
              <MapPinIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const initialBranchesData = [
  {
    id: 1,
    title: 'Downtown Hub',
    address: '1204 Metro Ave, Suite 100',
    status: 'Operational',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=600&auto=format&fit=crop',
    monthlyRev: '$142,500',
    staff: '24',
    manager: 'Marcus Reed',
    managerInitials: 'MR',
    avatarClass: 'mr',
    hours: '06:00 - 23:00'
  },
  {
    id: 2,
    title: 'Westside Commissary',
    address: '890 Industrial Pkwy',
    status: 'Maintenance',
    image: 'https://images.unsplash.com/photo-1581622558667-3419a8dc5f83?q=80&w=600&auto=format&fit=crop',
    monthlyRev: '$98,200',
    staff: '18',
    manager: 'Elena Lopez',
    managerInitials: 'EL',
    avatarClass: 'el',
    hours: '04:00 - 20:00'
  },
  {
    id: 3,
    title: 'Northgate Plaza',
    address: '4500 Northgate Mall, Unit B',
    status: 'Operational',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop',
    monthlyRev: '$215,400',
    staff: '32',
    manager: 'Tom Chen',
    managerInitials: 'TC',
    avatarClass: 'tc',
    hours: '08:00 - 24:00'
  }
];

export default function Branches() {
  const [currentView, setCurrentView] = useState('list');
  const [branches, setBranches] = useState(initialBranchesData);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handlers
  const toggleDropdown = (id) => setActiveDropdown(activeDropdown === id ? null : id);
  const handleDelete = (id) => {
    setBranches(branches.filter(b => b.id !== id));
    setActiveDropdown(null);
  };
  
  // Search Filter logic
  const filteredBranches = branches.filter(branch => 
    branch.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    branch.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard">
      <Sidebar activePage="settings" />
      
      <div className="main-content">
        <Topbar title="Branch Settings" />
        
        <div className="page-content">
          {currentView === 'list' ? (
            <>
              <div className="page-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="page-title">
                  <h1>Branch Management</h1>
                  <p>Overview and metrics for all active kitchen locations.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div className="pos-search-wrapper" style={{ margin: 0, height: '42px', width: '280px' }}>
                    <SearchIcon />
                    <input 
                      type="text" 
                      placeholder="Search branches..." 
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
                          <div style={{ color: '#9ca3af', cursor: 'pointer', padding: '4px' }} onClick={() => toggleDropdown(branch.id)}>
                            <DotsIcon />
                          </div>
                          {activeDropdown === branch.id && (
                            <div className="branch-dropdown">
                              <div className="branch-dropdown-item"><EditIcon /> Edit Branch</div>
                              <div className="branch-dropdown-item delete" onClick={() => handleDelete(branch.id)}><TrashIcon /> Delete Branch</div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="branch-metrics">
                        <div className="metric-box">
                          <div className="metric-label">Monthly Rev</div>
                          <div className="metric-value">{branch.monthlyRev}</div>
                        </div>
                        <div className="metric-box">
                          <div className="metric-label">Total Staff</div>
                          <div className="metric-value">{branch.staff}</div>
                        </div>
                      </div>
                      
                      <div className="branch-footer">
                        <div className="manager-info">
                          <div className={`manager-avatar ${branch.avatarClass}`}>{branch.managerInitials}</div>
                          <div className="manager-details">
                            <h5>{branch.manager}</h5>
                            <p>Branch Manager</p>
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
                    <p style={{fontSize: '16px', fontWeight: '500'}}>No branches matched your search query.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <AddBranch onCancel={() => setCurrentView('list')} />
          )}
        </div>
      </div>
    </div>
  );
}
