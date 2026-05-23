import React, { useState, useEffect } from 'react';
import '../assets/styles/users.css';
import '../assets/styles/components.css';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const SearchIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const PlusIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>;
const XIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const LockIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const EyeIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOffIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const UserIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const GridIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const SettingsIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
const EditIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>;

const CustomersIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
const OrdersIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const ExpensesIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
const JournalIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
const ReportsIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const BellIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
const UserCircleIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const ActiveIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981"><circle cx="12" cy="12" r="8"/></svg>;
const IdIcon = () => <svg width="16" height="16" fill="none" stroke="#d97706" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
const HealthIcon = () => <svg width="16" height="16" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M6 12h.01M10 12h.01M14 12h.01M6 16h.01M10 16h.01M14 16h.01M18 8h.01M18 12h.01M18 16h.01"/></svg>;
const ShieldIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const POSIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg>;


const initialStaff = [
  { id: 1, name: 'Zangmo Wangchuck', role: 'Manager', branch: 'Main City Mall', lastLogin: '2023-12-28 09:12', avatarClass: 'avatar-1' },
  { id: 2, name: 'Rahul Sharma', role: 'Staff', branch: 'Downtown', lastLogin: '2023-12-28 08:45', avatarClass: 'avatar-2' },
  { id: 3, name: 'Sunita Rai', role: 'Staff', branch: 'Westside', lastLogin: '2023-12-28 06:30', avatarClass: 'avatar-3' },
  { id: 4, name: 'Asad Khan', role: 'Staff', branch: 'Main City Mall', lastLogin: '2023-12-28 02:40', avatarClass: 'avatar-4' }
];

export default function Users() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Closed by default
  const [staffList, setStaffList] = useState(() => {
    const saved = localStorage.getItem('zangmo_staff_list');
    return saved ? JSON.parse(saved) : initialStaff;
  });

  useEffect(() => {
    localStorage.setItem('zangmo_staff_list', JSON.stringify(staffList));
  }, [staffList]);
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Staff');
  const [branch, setBranch] = useState('Main City Mall');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);

  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (parts[0]?.[0] || 'N').toUpperCase();
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!fullName.trim()) return alert("Full Name is required.");

    const avatarClasses = ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4'];
    const randomAvatar = avatarClasses[Math.floor(Math.random() * avatarClasses.length)];

    const newUser = {
      id: Date.now(),
      name: fullName,
      role: role,
      branch: branch,
      lastLogin: 'Never',
      initials: getInitials(fullName),
      avatarClass: randomAvatar
    };

    // Add new user to the top of the list
    setStaffList([newUser, ...staffList]);
    
    // Reset form
    setFullName('');
    setRole('Staff');
    setBranch('Main City Mall');
    setPassword('');
    setSendEmail(false);
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard">
      <Sidebar activePage="users" />
      
      <div className="main-content">
        <Topbar title="User Management" />
        
        <div className="page-content">
          <div className="page-header">
            <div className="page-title">
              <h1>User Management</h1>
              <p>Manage staff access levels, branch assignments, and POS security.</p>
            </div>
            <button className="btn-orange" onClick={() => setIsModalOpen(true)}>
              <PlusIcon /> Add New User
            </button>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-title"><span>TOTAL STAFF</span><div className="stat-icon"><UserIcon /></div></div>
              <div className="stat-value">24</div>
              <div className="stat-subtitle">+1 this month</div>
            </div>
            <div className="stat-card">
              <div className="stat-title"><span>ACTIVE NOW</span><div className="stat-icon"><ActiveIcon /></div></div>
              <div className="stat-value">12</div>
            </div>
            <div className="stat-card">
              <div className="stat-title"><span>PENDING SETUP</span><div className="stat-icon"><IdIcon /></div></div>
              <div className="stat-value">3</div>
            </div>
            <div className="stat-card">
              <div className="stat-title"><span>SYSTEM HEALTH</span><div className="stat-icon"><HealthIcon /></div></div>
              <div className="stat-value">100%</div>
              <div className="stat-subtitle text-muted">All services operational</div>
            </div>
          </div>
          
          <div className="table-container">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map(staff => (
                  <tr key={staff.id}>
                    <td>
                      <div className="staff-name-cell">
                        <div className={`staff-avatar ${staff.avatarClass || 'avatar-1'}`}>
                          {staff.initials || getInitials(staff.name)}
                        </div>
                        <div className="staff-details">
                          <h5>{staff.name}</h5>
                          <p>{staff.role} • {staff.branch}</p>
                        </div>
                      </div>
                    </td>
                    <td className="staff-login">{staff.lastLogin}</td>
                    <td>
                      <div className="staff-actions">
                        <EditIcon />
                        <TrashIcon />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="role-permissions-container">
            <div className="role-permissions-header">
              <ShieldIcon /> <h3>Role Permissions</h3>
            </div>
            <div className="role-cards">
              <div className="role-card">
                <div className="role-badge-row">
                  <span className="badge manager">Manager</span>
                  <h4>Full Access</h4>
                </div>
                <p>Absolute access to all dashboard features including inventory, cost analysis, and system configurations. Can override POS restrictions.</p>
              </div>
              <div className="role-card">
                <div className="role-badge-row">
                  <span className="badge staff">Staff</span>
                  <h4>POS Operator</h4>
                </div>
                <p>Restricted to POS operations, order entry, and processing payments. Requires Manager PIN for refunds and voids.</p>
              </div>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <form className="modal" onSubmit={handleCreateUser}>
              <div className="modal-header">
                <h3>Add New Staff Member</h3>
                <button type="button" className="close-btn" onClick={() => setIsModalOpen(false)}>
                  <XIcon />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name <span className="required-dot">•</span></label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. John Doe" 
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="row">
                  <div className="col">
                    <label className="form-label">Role Assignment</label>
                    <select className="input-field" value={role} onChange={e => setRole(e.target.value)}>
                      <option>Staff</option>
                      <option>Manager</option>
                    </select>
                  </div>
                  <div className="col">
                    <label className="form-label">Primary Branch</label>
                    <select className="input-field" value={branch} onChange={e => setBranch(e.target.value)}>
                      <option>Main City Mall</option>
                      <option>Downtown</option>
                      <option>Westside</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Account Password <span className="required-dot">•</span></label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="input-field" 
                      placeholder="Enter secure password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required 
                      style={{ paddingRight: '40px' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <p className="pin-desc" style={{ marginTop: '8px' }}>Password is required for dashboard and POS access.</p>
                </div>

                <div className="checkbox-group">
                  <input 
                    type="checkbox" 
                    id="sendEmail" 
                    checked={sendEmail}
                    onChange={e => setSendEmail(e.target.checked)}
                  />
                  <label htmlFor="sendEmail">Send invitation email for dashboard access setup.</label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-create">Create User</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

