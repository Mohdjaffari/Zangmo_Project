import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerSidebar from './ManagerSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/users.css';
import '../../assets/styles/profile.css';

// SVG Icons
const CameraIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const CheckIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>;
const SaveIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const UserCheckIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M17 11l2 2 4-4"/></svg>;
const KeyIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
const ShieldCheckIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 11 11 13 15 9"/></svg>;

const avatarOptions = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAHIsYFXVtI2Nd1e5XZOoQ1xoyvN01OzoOzxbklay6ftS1H-uiC1o0dJAW6cGx_Yi7APORkALIWEGCSldZj6AvkR6CIIG7781_kQ7EJRGTZQRdw0c8B_LAxVUawI5_94LHUlBjvGg847wIojJfOH3JDzfH2DOtOFG8rndcs4eNZ_KV-O0T44ZYGXkVlj5pBe2i_3pCgiqRfiUOrDjN0ytRUox0zbrqCcWLRw_JYgzC2tmOe-XDJt56ZHGSoGWEv-g0nM-fUygIOkWJb',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDTi88UDGOYNnLNHAXTMW6lUeoUeMiETB6hyvzFdviTfQKEviPWhhOpWQuQsuxtUv0rET8oq-6cMWHHFKcVp-6jnJAOETs-PRK1e1z-OQdwCchlWeo5AEWs4TVwlZy3xepZlbqIixGvysmrrFnfFYd3abHjU_ZvrykVblV0UkEyEuNafCfCRT69aVjFP_AoekbJHOiwgZub-mH_Fdg0U35IqAf0ByDmH8tYTDgpiasosEwHL2UVAOqynDsDZEmVgKXXFfk-OOqvRiQ0',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBdW6_X0KqO5kZzRvXkLdtnli-R_d-gsSaaClD3LB3tt9aDjuKqrmkfiUwMDyzHPVl0FBDlVH935Oaec8Oz1Zs-6-779bXN8LO49SC0nfqSG4AsSTySX7xS0ATB5a8OYF6ONIIc91pZY6p4XPP8s5aMGJSjI0nZ9ECR0ZYmR4Bc1rX6p5PAIxG39_cyTChfoZihnylxnC3mRO37m8avzG4rZbKLhwa4B1SQv6SN6rfW0eMWiJurjJ0NutbznjI5k6DBAUXpTmlobbNB',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBIRvLepukoo6Fd4JmmPv5rV8W8MpoEYpC9ayNXCVv67RrsakhswpB6fHVU_PJGy4XSJXuG9pYkHvfrMXEsRdtJ1GPVS5bo4hgn4qHGWqOaf0-Uca9oyP1dFdqmC7_uqqGMFPUCVmrq3tqeAH4UIOxeZpK7ha9foDOSWKLs5xnMwIh93T13agtSYy1tvjqomPCrpbnbNbCnjIcRZJoYujOU974C8tbd7dRMQh-IXV-EHi608-zc-3080fEQ-2SE9dryJNpl57oAoAf8'
];

export default function ManagerProfile() {
  const navigate = useNavigate();

  // Load accounts from localStorage
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('zangmo_user_accounts');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const loggedName = localStorage.getItem('zangmo_logged_user_name') || 'Branch Manager';
  
  // Resolve current account
  const resolvedAccount = accounts.find(acc => acc.name === loggedName || acc.username === 'manager') || {
    username: 'manager',
    name: loggedName,
    role: 'Manager',
    branch: localStorage.getItem('zangmo_logged_branch') || 'Mehdi Kitchen (Main)',
    password: 'manager'
  };

  // Profile Form States
  const [fullName, setFullName] = useState(resolvedAccount.name);
  const [username, setUsername] = useState(resolvedAccount.username);
  const [role, setRole] = useState(resolvedAccount.role);
  const [branch, setBranch] = useState(resolvedAccount.branch || 'Mehdi Kitchen (Main)');
  const [email, setEmail] = useState(resolvedAccount.email || `${resolvedAccount.username}@zmkitchen.com`);
  const [phone, setPhone] = useState(resolvedAccount.phone || '+975 17 654 321');
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

  // Modal & Toast States
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  // Update localStorage when avatar changes
  useEffect(() => {
    localStorage.setItem('zangmo_logged_user_avatar', avatar);
  }, [avatar]);

  // Synchronize dynamic currency switch immediately
  useEffect(() => {
    localStorage.setItem('zangmo_default_currency', currency);
  }, [currency]);

  const handleSaveProfile = (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      alert("Name field cannot be empty.");
      return;
    }

    // Load fresh accounts to avoid state race conditions
    const savedAccounts = localStorage.getItem('zangmo_user_accounts');
    let currentAccounts = [];
    if (savedAccounts) {
      try { currentAccounts = JSON.parse(savedAccounts); } catch (e) {}
    }

    const accountIndex = currentAccounts.findIndex(acc => acc.username === username);

    if (accountIndex === -1) {
      alert("Account not found in lookup.");
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

    // Update fields
    currentAccounts[accountIndex].name = fullName;
    currentAccounts[accountIndex].email = email;
    currentAccounts[accountIndex].phone = phone;
    currentAccounts[accountIndex].avatar = avatar;

    // Save back
    localStorage.setItem('zangmo_user_accounts', JSON.stringify(currentAccounts));
    localStorage.setItem('zangmo_logged_user_name', fullName);
    localStorage.setItem('zangmo_logged_user_avatar', avatar);
    localStorage.setItem('zangmo_default_currency', currency);

    // Update local accounts state
    setAccounts(currentAccounts);

    // Clear password fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    // Trigger toast success
    setToast({ show: true, type: 'success', message: 'Profile settings saved successfully!' });
    
    // Dispatch a storage event locally so the sidebar is notified immediately
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
      <ManagerSidebar activePage="profile" />

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Topbar title="Manager Profile Settings" />

        <div className="page-content" style={{ overflowY: 'auto' }}>
          <div className="page-header" style={{ marginBottom: '12px' }}>
            <div className="page-title">
              <h1>Personal Profile</h1>
              <p>Manage your account configurations, profile credentials, security passwords, and localized parameters.</p>
            </div>
          </div>

          <div className="profile-grid-layout">
            {/* Left Column: Form Elements */}
            <div className="profile-main-card">
              <div className="profile-banner">
                <div className="profile-banner-pattern" />
              </div>

              <div className="profile-header-info">
                <div className="profile-avatar-container" onClick={() => setIsAvatarModalOpen(true)}>
                  <img src={avatar} alt="Profile" />
                  <div className="avatar-edit-overlay">
                    <CameraIcon /> EDIT PHOTO
                  </div>
                </div>

                <div className="profile-title-area">
                  <h2>{fullName}</h2>
                  <p>
                    <span className="role-badge">{role}</span>
                    <span className="branch-badge">{branch}</span>
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="profile-content-body">
                {/* Account Details */}
                <h3 className="section-title">
                  <span className="material-symbols-outlined">person</span> Personal Credentials
                </h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label>Full Display Name</label>
                    <input 
                      type="text" 
                      value={fullName} 
                      onChange={e => setFullName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-field">
                    <label>Staff ID Badge (Username)</label>
                    <input type="text" value={username} readonly />
                    <div className="form-field-info">Resolved automatically at authentication login.</div>
                  </div>
                  <div className="form-field">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-field">
                    <label>Mobile Number</label>
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                {/* System Preferences */}
                <h3 className="section-title">
                  <span className="material-symbols-outlined">settings</span> System Parameters
                </h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label>Default Currency Unit</label>
                    <select value={currency} onChange={e => setCurrency(e.target.value)}>
                      <option value="Rs.">Rs. (PKR Rupee Converter x80)</option>
                      <option value="$">$ (USD standard conversion)</option>
                    </select>
                    <div className="form-field-info">Modifies display values on POS, Table Management, and Inventories.</div>
                  </div>
                  <div className="form-field">
                    <label>Assigned Branch Location</label>
                    <input type="text" value={branch} readonly />
                    <div className="form-field-info">Branch assignments must be modified by Admin accounts.</div>
                  </div>
                </div>

                {/* Security Passwords */}
                <h3 className="section-title">
                  <span className="material-symbols-outlined">lock</span> Security Settings
                </h3>
                <div className="form-grid" style={{ marginBottom: '20px' }}>
                  <div className="form-field">
                    <label>Current Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>New Secure Password</label>
                    <input 
                      type="password" 
                      placeholder="Min 4 characters" 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-field" style={{ gridColumn: 'span 2' }}>
                    <label>Confirm New Password</label>
                    <input 
                      type="password" 
                      placeholder="Confirm security match" 
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Save Buttons */}
                <div className="action-row" style={{ borderTop: '1px solid #f3f4f6', paddingTop: '24px' }}>
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
                      background: '#b45309',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <SaveIcon /> Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Performance Stats */}
            <div className="profile-side-card" style={{ height: 'fit-content' }}>
              <div className="side-card-header">
                <h3>Operational Stats</h3>
              </div>
              <div className="side-card-body">
                <div className="perf-stat-list">
                  <div className="perf-stat-item">
                    <div className="perf-stat-icon">
                      <ShieldCheckIcon />
                    </div>
                    <div className="perf-stat-details">
                      <p className="perf-stat-lbl">Rating Score</p>
                      <p className="perf-stat-val">Excellent (4.8 ★)</p>
                    </div>
                  </div>
                  <div className="perf-stat-item">
                    <div className="perf-stat-icon">
                      <UserCheckIcon />
                    </div>
                    <div className="perf-stat-details">
                      <p className="perf-stat-lbl">Shift Sizing Target</p>
                      <p className="perf-stat-val">104% Monthly Attendance</p>
                    </div>
                  </div>
                  <div className="perf-stat-item">
                    <div className="perf-stat-icon">
                      <KeyIcon />
                    </div>
                    <div className="perf-stat-details">
                      <p className="perf-stat-lbl">Joining Date</p>
                      <p className="perf-stat-val">October 14, 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      {isAvatarModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAvatarModalOpen(false)}>
          <div className="modal" style={{ width: '420px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Choose Profile Avatar</h3>
              <button className="close-btn" onClick={() => setIsAvatarModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-body">
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
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
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
