import React, { useState, useEffect } from 'react';
import ManagerSidebar from './ManagerSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/users.css';
import '../../assets/styles/components.css';

export default function ManagerHiring() {
  const [loggedBranch, setLoggedBranch] = useState(() => {
    return localStorage.getItem('zangmo_logged_branch') || 'Mehdi Kitchen (Main)';
  });
  
  const [hiringRequests, setHiringRequests] = useState(() => {
    const saved = localStorage.getItem('zangmo_hiring_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: 1, name: 'Tandin Dorji', role: 'Kitchen Helper', branch: 'Mehdi Kitchen (Main)', wage: 12, justification: 'Need help with morning prep shifts.', status: 'Pending', date: 'May 24, 2026' },
      { id: 2, name: 'Dechen Wangmo', role: 'Head Chef', branch: 'Zangmo Kitchen', wage: 25, justification: 'Senior chef resigned, need immediate replacement.', status: 'Pending', date: 'May 23, 2026' },
      { id: 3, name: 'Passang Tshering', role: 'Waiter', branch: 'Mehdi Kitchen (Main)', wage: 10, justification: 'Weekend rush coverage.', status: 'Approved', date: 'May 18, 2026' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('zangmo_hiring_requests', JSON.stringify(hiringRequests));
  }, [hiringRequests]);

  useEffect(() => {
    const handleStorage = () => {
      setLoggedBranch(localStorage.getItem('zangmo_logged_branch') || 'Mehdi Kitchen (Main)');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('Waiter');
  const [wage, setWage] = useState('');
  const [justification, setJustification] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!name.trim() || !wage.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newRequest = {
      id: Date.now(),
      name: name,
      role: role,
      branch: loggedBranch,
      wage: parseFloat(wage),
      justification: justification || 'No justification provided.',
      status: 'Pending',
      date: formattedDate
    };

    setHiringRequests([newRequest, ...hiringRequests]);
    setName('');
    setWage('');
    setJustification('');
    triggerToast('Hiring request submitted to Administrator for review!');
  };

  // Filter requests to only show those of the manager's logged branch
  const branchRequests = hiringRequests.filter(req => req.branch.toLowerCase().includes(loggedBranch.toLowerCase()) || loggedBranch.toLowerCase().includes(req.branch.toLowerCase()));

  return (
    <div className="dashboard">
      <ManagerSidebar activePage="hiring" />

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Topbar title="Staff Hiring Portal" />

        <div className="page-content" style={{ padding: '24px', backgroundColor: '#f7f9fc', minHeight: 'calc(100vh - 64px)' }}>
          <div className="page-header" style={{ marginBottom: '24px' }}>
            <h1>Staff Hiring & Approvals</h1>
            <p>Request budget approval and personnel provisioning for <strong>{loggedBranch}</strong>.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
            {/* Left Column: Form */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#162839' }}>New Hire Request</h3>
              <form onSubmit={handleSubmitRequest}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">CANDIDATE NAME / TBD <span style={{ color: '#dc2626' }}>*</span></label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Jigme Singye or TBD" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">ROLE <span style={{ color: '#dc2626' }}>*</span></label>
                    <select className="input-field" value={role} onChange={e => setRole(e.target.value)}>
                      <option value="Waiter">Waiter/Waitress</option>
                      <option value="Cook">Line Cook</option>
                      <option value="Head Chef">Head Chef</option>
                      <option value="Kitchen Helper">Kitchen Helper</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Dishwasher">Dishwasher</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">PROPOSED WAGE ($/HR) <span style={{ color: '#dc2626' }}>*</span></label>
                    <input 
                      type="number" 
                      className="input-field" 
                      placeholder="e.g. 15.00" 
                      value={wage} 
                      onChange={e => setWage(e.target.value)} 
                      min="1" 
                      step="any"
                      required 
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">JUSTIFICATION / REASON</label>
                  <textarea 
                    className="input-field" 
                    rows="3" 
                    placeholder="e.g. Friday and Saturday night dining room shifts are understaffed..."
                    value={justification}
                    onChange={e => setJustification(e.target.value)}
                    style={{ resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-create-item" 
                  style={{ width: '100%', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#b45309', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Submit Request
                </button>
              </form>
            </div>

            {/* Right Column: List */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#162839' }}>Active & Past Requests</h3>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px' }}>
                {branchRequests.length > 0 ? branchRequests.map(req => (
                  <div key={req.id} style={{ padding: '16px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{req.name}</h4>
                        <span style={{ fontSize: '11px', background: '#e2e8f0', padding: '2px 8px', borderRadius: '30px', fontWeight: '600', color: '#475569' }}>{req.role}</span>
                      </div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#64748b' }}>Rate: <strong>${req.wage}/hr</strong> • Justification: {req.justification}</p>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>Submitted: {req.date}</span>
                    </div>
                    <div>
                      <span 
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          background: req.status === 'Approved' ? '#d1fae5' : req.status === 'Rejected' ? '#fee2e2' : '#fef3c7',
                          color: req.status === 'Approved' ? '#065f46' : req.status === 'Rejected' ? '#991b1b' : '#d97706'
                        }}
                      >
                        {req.status}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '32px', marginBottom: '8px', color: '#cbd5e1' }}>assignment</span>
                    <p style={{ margin: 0, fontSize: '13px' }}>No hiring requests created yet for this branch.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="toast-alert">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
