import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/users.css';
import '../../assets/styles/profile.css';

// SVG Icons
const CameraIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const SaveIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const UserCheckIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M17 11l2 2 4-4"/></svg>;
const KeyIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
const ShieldCheckIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 11 11 13 15 9"/></svg>;
const UploadIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>;

const avatarOptions = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAHIsYFXVtI2Nd1e5XZOoQ1xoyvN01OzoOzxbklay6ftS1H-uiC1o0dJAW6cGx_Yi7APORkALIWEGCSldZj6AvkR6CIIG7781_kQ7EJRGTZQRdw0c8B_LAxVUawI5_94LHUlBjvGg847wIojJfOH3JDzfH2DOtOFG8rndcs4eNZ_KV-O0T44ZYGXkVlj5pBe2i_3pCgiqRfiUOrDjN0ytRUox0zbrqCcWLRw_JYgzC2tmOe-XDJt56ZHGSoGWEv-g0nM-fUygIOkWJb',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDTi88UDGOYNnLNHAXTMW6lUeoUeMiETB6hyvzFdviTfQKEviPWhhOpWQuQsuxtUv0rET8oq-6cMWHHFKcVp-6jnJAOETs-PRK1e1z-OQdwCchlWeo5AEWs4TVwlZy3xepZlbqIixGvysmrrFnfFYd3abHjU_ZvrykVblV0UkEyEuNafCfCRT69aVjFP_AoekbJHOiwgZub-mH_Fdg0U35IqAf0ByDmH8tYTDgpiasosEwHL2UVAOqynDsDZEmVgKXXFfk-OOqvRiQ0',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBdW6_X0KqO5kZzRvXkLdtnli-R_d-gsSaaClD3LB3tt9aDjuKqrmkfiUwMDyzHPVl0FBDlVH935Oaec8Oz1Zs-6-779bXN8LO49SC0nfqSG4AsSTySX7xS0ATB5a8OYF6ONIIc91pZY6p4XPP8s5aMGJSjI0nZ9ECR0ZYmR4Bc1rX6p5PAIxG39_cyTChfoZihnylxnC3mRO37m8avzG4rZbKLhwa4B1SQv6SN6rfW0eMWiJurjJ0NutbznjI5k6DBAUXpTmlobbNB',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBIRvLepukoo6Fd4JmmPv5rV8W8MpoEYpC9ayNXCVv67RrsakhswpB6fHVU_PJGy4XSJXuG9pYkHvfrMXEsRdtJ1GPVS5bo4hgn4qHGWqOaf0-Uca9oyP1dFdqmC7_uqqGMFPUCVmrq3tqeAH4UIOxeZpK7ha9foDOSWKLs5xnMwIh93T13agtSYy1tvjqomPCrpbnbNbCnjIcRZJoYujOU974C8tbd7dRMQh-IXV-EHi608-zc-3080fEQ-2SE9dryJNpl57oAoAf8'
];

export default function AdminProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Load accounts from localStorage
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('zangmo_user_accounts');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const loggedName = localStorage.getItem('zangmo_logged_user_name') || 'Mehdi Khan';
  
  // Resolve current admin account
  const resolvedAccount = accounts.find(acc => acc.username === 'admin' || acc.name === loggedName) || {
    username: 'admin',
    name: loggedName,
    role: 'Admin',
    branch: 'Mehdi Kitchen (Main)',
    password: 'admin'
  };

  // Profile Form States
  const [fullName, setFullName] = useState(resolvedAccount.name);
  const [username, setUsername] = useState(resolvedAccount.username);
  const [role, setRole] = useState(resolvedAccount.role);
  const [email, setEmail] = useState(resolvedAccount.email || 'mehdi@zmkitchen.com');
  const [phone, setPhone] = useState(resolvedAccount.phone || '+92 300 1234567');
  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem('zangmo_logged_user_avatar') || resolvedAccount.avatar || avatarOptions[0];
  });

  // Password Settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preference Settings
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('zangmo_default_currency') || 'Rs.';
  });

  // Dynamic Statistics States
  const [branchesCount, setBranchesCount] = useState(2);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [receivablesSum, setReceivablesSum] = useState(0);
  const [adminCount, setAdminCount] = useState(1);

  // Modal & Toast States
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  // Load real-time database stats on mount
  useEffect(() => {
    // 1. Branches Count
    const savedBranches = localStorage.getItem('zangmo_branches');
    if (savedBranches) {
      try {
        const parsed = JSON.parse(savedBranches);
        setBranchesCount(parsed.length);
      } catch (e) {}
    }

    // 2. Employees Count
    const savedEmployees = localStorage.getItem('zangmo_staff_list');
    if (savedEmployees) {
      try {
        const parsed = JSON.parse(savedEmployees);
        setEmployeesCount(parsed.length);
      } catch (e) {}
    }

    // 3. Receivables Outstanding Sum
    const savedCredit = localStorage.getItem('zangmo_credit_entries');
    if (savedCredit) {
      try {
        const parsed = JSON.parse(savedCredit);
        const outstanding = parsed
          .filter(c => c && c.status !== 'Paid')
          .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
        setReceivablesSum(outstanding);
      } catch (e) {}
    }

    // 4. Admin Accounts Count
    const admins = accounts.filter(acc => acc.role === 'Admin' || acc.role === 'admin').length;
    setAdminCount(admins || 1);
  }, [accounts]);

  // Synchronize currency preferences immediately
  useEffect(() => {
    localStorage.setItem('zangmo_default_currency', currency);
  }, [currency]);

  // Handle custom photo file selector
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target.result;
      setAvatar(base64Url);
      setToast({ show: true, type: 'success', message: 'Custom profile image uploaded!' });
      setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      alert("Name field cannot be empty.");
      return;
    }

    // Load fresh accounts from localStorage to avoid race conditions
    const savedAccounts = localStorage.getItem('zangmo_user_accounts');
    let currentAccounts = [];
    if (savedAccounts) {
      try { currentAccounts = JSON.parse(savedAccounts); } catch (e) {}
    }

    const accountIndex = currentAccounts.findIndex(acc => acc.username === username);

    if (accountIndex === -1) {
      alert("Account not found in system.");
      return;
    }

    // Password Update validation
    if (currentPassword || newPassword || confirmPassword) {
      if (currentAccounts[accountIndex].password !== currentPassword) {
        alert("Validation Failed: Current password does not match.");
        return;
      }
      if (newPassword !== confirmPassword) {
        alert("Validation Failed: New passwords do not match.");
        return;
      }
      if (newPassword.length < 4) {
        alert("Validation Failed: New password must be at least 4 characters.");
        return;
      }
      currentAccounts[accountIndex].password = newPassword;
    }

    // Update accounts in DB
    currentAccounts[accountIndex].name = fullName;
    currentAccounts[accountIndex].email = email;
    currentAccounts[accountIndex].phone = phone;
    currentAccounts[accountIndex].avatar = avatar;

    localStorage.setItem('zangmo_user_accounts', JSON.stringify(currentAccounts));
    localStorage.setItem('zangmo_logged_user_name', fullName);
    localStorage.setItem('zangmo_logged_user_avatar', avatar);
    localStorage.setItem('zangmo_default_currency', currency);

    setAccounts(currentAccounts);

    // Clear password fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    // Trigger toast success
    setToast({ show: true, type: 'success', message: 'Admin profile updated successfully!' });
    
    // Dispatch storage event to sync other panels immediately
    window.dispatchEvent(new Event('storage'));

    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 3000);
  };

  const handleAvatarSelect = (url) => {
    setAvatar(url);
    setIsAvatarModalOpen(false);
  };

  return (
    <div className="dashboard">
      <AdminSidebar activePage="profile" />

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Topbar title="Admin Profile Settings" />

        <div className="page-content" style={{ overflowY: 'auto', background: '#f4f6fa' }}>
          <div className="page-header" style={{ marginBottom: '12px' }}>
            <div className="page-title">
              <h1 style={{ color: '#162839', fontWeight: 800 }}>Admin Settings Portal</h1>
              <p style={{ color: '#64748b' }}>Configure your administrator profile, credential tokens, currency unit, and security parameters.</p>
            </div>
          </div>

          <div className="profile-grid-layout">
            {/* Left Column: Form Elements */}
            <div className="profile-main-card" style={{ border: '1px solid #e4e8ef' }}>
              <div className="profile-banner" style={{ background: 'linear-gradient(135deg, #162839 0%, #1e354f 100%)' }}>
                <div className="profile-banner-pattern" />
              </div>

              <div className="profile-header-info" style={{ borderBottom: '1px solid #e4e8ef' }}>
                <div className="profile-avatar-container" onClick={() => setIsAvatarModalOpen(true)} style={{ border: '4px solid #ffffff' }}>
                  <img src={avatar} alt="Profile" />
                  <div className="avatar-edit-overlay">
                    <CameraIcon /> EDIT PHOTO
                  </div>
                </div>

                <div className="profile-title-area">
                  <h2 style={{ color: '#162839', fontWeight: 800 }}>{fullName}</h2>
                  <p style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="role-badge" style={{ background: '#162839', color: '#ffffff' }}>{role.toUpperCase()}</span>
                    <span className="branch-badge" style={{ background: '#ecfdf5', color: '#047857' }}>Consolidated Control</span>
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="profile-content-body">
                {/* Account Details */}
                <h3 className="section-title" style={{ fontSize: '15px', color: '#162839', borderBottom: '1.5px solid #edf2f7' }}>
                  <span className="material-symbols-outlined" style={{ color: '#fc8f34' }}>badge</span> Administrator Credentials
                </h3>
                
                <div className="form-grid">
                  <div className="form-field">
                    <label style={{ color: '#4a5568', fontWeight: 700 }}>Display Name</label>
                    <input 
                      type="text" 
                      value={fullName} 
                      onChange={e => setFullName(e.target.value)} 
                      required 
                      style={{ border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div className="form-field">
                    <label style={{ color: '#4a5568', fontWeight: 700 }}>Account Username</label>
                    <input 
                      type="text" 
                      value={username} 
                      readOnly 
                      style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', cursor: 'not-allowed' }}
                    />
                    <div className="form-field-info">Username is managed by primary authentication.</div>
                  </div>
                  <div className="form-field">
                    <label style={{ color: '#4a5568', fontWeight: 700 }}>Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                      style={{ border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div className="form-field">
                    <label style={{ color: '#4a5568', fontWeight: 700 }}>Mobile Connection</label>
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      required 
                      style={{ border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                {/* System Preferences */}
                <h3 className="section-title" style={{ fontSize: '15px', color: '#162839', borderBottom: '1.5px solid #edf2f7' }}>
                  <span className="material-symbols-outlined" style={{ color: '#fc8f34' }}>tune</span> Localization & Parameters
                </h3>
                
                <div className="form-grid">
                  <div className="form-field">
                    <label style={{ color: '#4a5568', fontWeight: 700 }}>Default Currency</label>
                    <select 
                      value={currency} 
                      onChange={e => setCurrency(e.target.value)}
                      style={{ border: '1px solid #cbd5e1', cursor: 'pointer' }}
                    >
                      <option value="Rs.">PKR Rupee (Rs. - x80 conversion)</option>
                      <option value="$">USD Dollar ($ - base standard)</option>
                    </select>
                    <div className="form-field-info">Global conversion prefix modifier across dashboard reports and summaries.</div>
                  </div>
                  <div className="form-field">
                    <label style={{ color: '#4a5568', fontWeight: 700 }}>Access Scope</label>
                    <input 
                      type="text" 
                      value="All Branches (Consolidated)" 
                      readOnly 
                      style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', cursor: 'not-allowed' }}
                    />
                    <div className="form-field-info">Administrator scopes have full write privileges over all branches.</div>
                  </div>
                </div>

                {/* Security Passwords */}
                <h3 className="section-title" style={{ fontSize: '15px', color: '#162839', borderBottom: '1.5px solid #edf2f7' }}>
                  <span className="material-symbols-outlined" style={{ color: '#fc8f34' }}>security</span> Password Configurations
                </h3>
                
                <div className="form-grid" style={{ marginBottom: '20px' }}>
                  <div className="form-field">
                    <label style={{ color: '#4a5568', fontWeight: 700 }}>Current Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      style={{ border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div className="form-field">
                    <label style={{ color: '#4a5568', fontWeight: 700 }}>New Secure Password</label>
                    <input 
                      type="password" 
                      placeholder="Min 4 characters" 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      style={{ border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div className="form-field" style={{ gridColumn: 'span 2' }}>
                    <label style={{ color: '#4a5568', fontWeight: 700 }}>Confirm New Password</label>
                    <input 
                      type="password" 
                      placeholder="Confirm new credentials match" 
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      style={{ border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                {/* Save Buttons */}
                <div className="action-row" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                  <button 
                    type="button" 
                    onClick={() => navigate('/dashboard')}
                    style={{
                      padding: '10px 20px',
                      background: 'white',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      background: '#162839',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(22, 40, 57, 0.2)'
                    }}
                  >
                    <SaveIcon /> Save Credentials
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Performance Stats */}
            <div className="profile-side-card" style={{ height: 'fit-content', border: '1px solid #e4e8ef' }}>
              <div className="side-card-header" style={{ borderBottom: '1px solid #e4e8ef' }}>
                <h3 style={{ color: '#162839', fontWeight: 800 }}>Administrative Status</h3>
              </div>
              <div className="side-card-body">
                <div className="perf-stat-list">
                  
                  <div className="perf-stat-item" style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <div className="perf-stat-icon" style={{ border: '1px solid #cbd5e1', color: '#162839' }}>
                      <ShieldCheckIcon />
                    </div>
                    <div className="perf-stat-details">
                      <p className="perf-stat-lbl">Active Branches</p>
                      <p className="perf-stat-val" style={{ color: '#162839' }}>{branchesCount} Kitchens Live</p>
                    </div>
                  </div>

                  <div className="perf-stat-item" style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <div className="perf-stat-icon" style={{ border: '1px solid #cbd5e1', color: '#162839' }}>
                      <UserCheckIcon />
                    </div>
                    <div className="perf-stat-details">
                      <p className="perf-stat-lbl">Managed Staff</p>
                      <p className="perf-stat-val" style={{ color: '#162839' }}>{employeesCount} Employees</p>
                    </div>
                  </div>

                  <div className="perf-stat-item" style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <div className="perf-stat-icon" style={{ border: '1px solid #cbd5e1', color: '#162839' }}>
                      <KeyIcon />
                    </div>
                    <div className="perf-stat-details">
                      <p className="perf-stat-lbl">Credit Receivables</p>
                      <p className="perf-stat-val" style={{ color: '#162839' }}>
                        {currency === '$' 
                          ? `$${receivablesSum.toLocaleString(undefined, { maximumFractionDigits: 0 })}` 
                          : `Rs. ${(receivablesSum * 80).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                        }
                      </p>
                    </div>
                  </div>

                  <div className="perf-stat-item" style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <div className="perf-stat-icon" style={{ border: '1px solid #cbd5e1', color: '#162839' }}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                    </div>
                    <div className="perf-stat-details">
                      <p className="perf-stat-lbl">System Administrators</p>
                      <p className="perf-stat-val" style={{ color: '#162839' }}>{adminCount} Active Token</p>
                    </div>
                  </div>

                </div>

                <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#4a5568', textTransform: 'uppercase', marginBottom: '12px' }}>Operational Scope</h4>
                  <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '12px', color: '#4a5568', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li>Full credit ledger management</li>
                    <li>Vendor invoices execution</li>
                    <li>Employee hiring & payroll access</li>
                    <li>System backups & security parameters</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      {isAvatarModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAvatarModalOpen(false)}>
          <div className="modal" style={{ width: '450px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#162839', fontWeight: 800 }}>Choose Profile Avatar</h3>
              <button className="close-btn" onClick={() => setIsAvatarModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="avatar-grid">
                {avatarOptions.map((opt, idx) => (
                  <div 
                    key={idx}
                    className={`avatar-option ${opt === avatar ? 'selected' : ''}`}
                    onClick={() => handleAvatarSelect(opt)}
                  >
                    <img src={opt} alt={`Avatar Option ${idx + 1}`} />
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#4a5568', textTransform: 'uppercase' }}>Upload Custom Photo</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    padding: '10px 16px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#475569',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                >
                  <UploadIcon /> Choose Image File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`} style={{ background: '#162839' }}>
            <span className="material-symbols-outlined" style={{ color: '#10b981' }}>check_circle</span>
            <span style={{ fontWeight: 600 }}>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
