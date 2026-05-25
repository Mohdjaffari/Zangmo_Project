import React, { useState, useEffect } from 'react';
import ManagerSidebar from './ManagerSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/users.css'; 
import '../../assets/styles/customers.css';

// SVG Icons
const SearchIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const ChevronDown = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>;
const BellIcon = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
const HelpIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const XIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const PlusIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const ReorderIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>;
const BusinessIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="10" width="20" height="12" rx="2"/><path d="M6 10V4a2 2 0 012-2h8a2 2 0 012 2v6"/><path d="M10 14h4"/></svg>;

export default function Customers() {
  // Initial Customers State loaded from localStorage if present
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('zangmo_customers');
    return saved ? JSON.parse(saved) : [
      {
        id: 'C-001',
        name: 'Sarah Jenkins',
        phone: '+44 7700 900123',
        type: 'REGULAR',
        totalSpent: 1240.50,
        whatsapp: '+44 7700 900123',
        contactPerson: 'Sarah Jenkins',
        address: '12 Abbey Road, St John\'s Wood, London, NW8 9AY',
        recentOrders: [
          { id: 'ORD-7001', date: '01 Oct, 12:15', title: '2x Premium Salad Box', amount: 26.00, reorderable: true }
        ],
        unpaidInvoices: []
      },
      {
        id: 'TN-0042',
        name: 'TechNova Solutions',
        phone: '+44 20 7946 0001',
        type: 'CORPORATE',
        totalSpent: 5890.00,
        whatsapp: '+44 20 7946 0001',
        contactPerson: 'Marcus Aurelius',
        address: '42 Silicon Way, Canary Wharf, London, E14 5JJ',
        recentOrders: [
          { id: 'ORD-9021', date: '12 Oct, 14:30', title: '12x Corporate Lunch Set B', amount: 210.30, reorderable: true },
          { id: 'ORD-8854', date: '05 Oct, 11:15', title: '5x Premium Salad Box', amount: 65.00, reorderable: false }
        ],
        unpaidInvoices: [
          { id: 'INV-4001', due: '15 Oct 2023', amount: 120.00 },
          { id: 'INV-4015', due: '22 Oct 2023', amount: 90.30 }
        ]
      },
      {
        id: 'C-002',
        name: 'David Thompson',
        phone: '+44 7700 900456',
        type: 'REGULAR',
        totalSpent: 432.20,
        whatsapp: '+44 7700 900456',
        contactPerson: 'David Thompson',
        address: '78 Baker Street, London, W1U 6GB',
        recentOrders: [
          { id: 'ORD-8112', date: '28 Sep, 19:30', title: '1x Classic Pepperoni Pizza', amount: 18.50, reorderable: true }
        ],
        unpaidInvoices: []
      },
      {
        id: 'C-003',
        name: 'Elena Rodriguez',
        phone: '+44 7700 900789',
        type: 'REGULAR',
        totalSpent: 87.00,
        whatsapp: '+44 7700 900789',
        contactPerson: 'Elena Rodriguez',
        address: '105 Piccadilly, London, W1J 7ND',
        recentOrders: [
          { id: 'ORD-6523', date: '15 Sep, 13:00', title: '1x Veggie Wrap & Cappuccino', amount: 12.50, reorderable: true }
        ],
        unpaidInvoices: []
      },
      {
        id: 'GL-0002',
        name: 'Global Logistics Ltd',
        phone: '+44 20 7946 0002',
        type: 'CORPORATE',
        totalSpent: 2100.00,
        whatsapp: '+44 20 7946 0002',
        contactPerson: 'Sarah McConnor',
        address: '15 Shipwright Yard, London, SE1 2BY',
        recentOrders: [
          { id: 'ORD-8991', date: '08 Oct, 10:00', title: '8x Breakfast Platter Set', amount: 160.00, reorderable: true }
        ],
        unpaidInvoices: [
          { id: 'INV-3982', due: '12 Oct 2023', amount: 350.00 }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('zangmo_customers', JSON.stringify(customers));
  }, [customers]);

  // Selected customer and active tab
  const [selectedCustomerId, setSelectedCustomerId] = useState('TN-0042');
  const [activeTab, setActiveTab] = useState('Profile'); // Profile | OrderHistory | Settlements
  const [searchQuery, setSearchQuery] = useState('');

  // New Customer Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newType, setNewType] = useState('REGULAR');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newAddress, setNewAddress] = useState('');

  // Edit details form states
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editType, setEditType] = useState('REGULAR');
  const [editContactPerson, setEditContactPerson] = useState('');
  const [editWhatsapp, setEditWhatsapp] = useState('');
  const [editAddress, setEditAddress] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState('');

  // Initialize edit fields when customer changes
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  React.useEffect(() => {
    if (selectedCustomer) {
      setEditCompanyName(selectedCustomer.name);
      setEditPhone(selectedCustomer.phone || '');
      setEditType(selectedCustomer.type || 'REGULAR');
      setEditContactPerson(selectedCustomer.contactPerson || '');
      setEditWhatsapp(selectedCustomer.whatsapp || selectedCustomer.email || '');
      setEditAddress(selectedCustomer.address || '');
    }
  }, [selectedCustomerId]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Search filtering
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form edit submission
  const handleUpdateDetails = (e) => {
    if (e) e.preventDefault();
    if (!selectedCustomer) return;

    const updated = customers.map(c => {
      if (c.id === selectedCustomerId) {
        return {
          ...c,
          name: editCompanyName,
          phone: editPhone,
          type: editType,
          contactPerson: editContactPerson,
          whatsapp: editWhatsapp,
          address: editAddress
        };
      }
      return c;
    });

    setCustomers(updated);
    triggerToast('Customer details updated successfully!');
  };

  // Pay Invoice
  const handlePayInvoice = (invoiceId, amount) => {
    const updated = customers.map(c => {
      if (c.id === selectedCustomerId) {
        return {
          ...c,
          totalSpent: parseFloat((c.totalSpent + amount).toFixed(2)),
          unpaidInvoices: c.unpaidInvoices.filter(i => i.id !== invoiceId)
        };
      }
      return c;
    });

    setCustomers(updated);
    triggerToast(`Invoice ${invoiceId} paid successfully!`);
  };

  // Reorder Order
  const handleReorder = (orderId) => {
    triggerToast(`Order ${orderId} has been re-placed successfully!`);
  };

  // Add new customer submission
  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      alert('Name and Phone are required.');
      return;
    }

    const nextId = `${newType === 'CORPORATE' ? 'TN' : 'C'}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCustomerObj = {
      id: nextId,
      name: newName,
      phone: newPhone,
      type: newType,
      totalSpent: 0,
      whatsapp: newWhatsapp,
      contactPerson: newContact || newName,
      address: newAddress,
      recentOrders: [],
      unpaidInvoices: []
    };

    setCustomers([newCustomerObj, ...customers]);
    setSelectedCustomerId(nextId);
    setActiveTab('Profile');
    setIsModalOpen(false);

    // Reset inputs
    setNewName('');
    setNewPhone('');
    setNewType('REGULAR');
    setNewWhatsapp('');
    setNewContact('');
    setNewAddress('');

    triggerToast(`Customer ${newName} created successfully!`);
  };

  // Calculate unpaid debt for selected customer
  const totalDebt = selectedCustomer
    ? selectedCustomer.unpaidInvoices.reduce((acc, inv) => acc + inv.amount, 0)
    : 0;

  return (
    <div className="customers-container">
      <ManagerSidebar activePage="customers" />

      <div className="customers-content">
        <Topbar title="Customers" />

        {/* Page Body */}
        <div className="customers-body">
          {/* Customer List Column */}
          <div className="customers-list-section">
            <div className="customers-list-header">
              <h1>Customer Directory</h1>
              <p>Managing {customers.length} active customer profiles.</p>
            </div>

            <div className="customers-search-section" style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
              <div className="customers-search-wrapper" style={{ flex: 1 }}>
                <SearchIcon />
                <input 
                  type="text" 
                  placeholder="Search by name or phone..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="btn-new-customer" onClick={() => setIsModalOpen(true)}>
                <PlusIcon /> New Customer
              </button>
            </div>

            <div className="customers-table-card">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Type</th>
                    <th>Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map(c => (
                    <tr 
                      key={c.id} 
                      className={c.id === selectedCustomerId ? 'selected' : ''}
                      onClick={() => setSelectedCustomerId(c.id)}
                    >
                      <td>
                        <div className="customer-name-cell">
                          {c.type === 'CORPORATE' ? (
                            <div className="panel-avatar"><BusinessIcon /></div>
                          ) : (
                            <div className="customer-avatar-placeholder">
                              {c.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                          <span>{c.name}</span>
                        </div>
                      </td>
                      <td className="phone-col">{c.phone}</td>
                      <td>
                        <span className={`badge-type ${c.type.toLowerCase()}`}>
                          {c.type}
                        </span>
                      </td>
                      <td className="spent-col">£{c.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                        No customers found matching search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Details Column Panel */}
          {selectedCustomer && (
            <div className="customers-detail-panel">
              {/* Panel Header */}
              <div className="panel-header">
                <div className="panel-header-profile">
                  <div className="panel-avatar">
                    {selectedCustomer.type === 'CORPORATE' ? <BusinessIcon /> : <span>{selectedCustomer.name.split(' ').map(n => n[0]).join('')}</span>}
                  </div>
                  <div className="panel-title-info">
                    <h3>{selectedCustomer.name}</h3>
                    <p>{selectedCustomer.type === 'CORPORATE' ? 'Corporate Account' : 'Regular Customer'} • ID: {selectedCustomer.id}</p>
                  </div>
                </div>
                <button className="btn-close-panel" onClick={() => setSelectedCustomerId(null)}>
                  <XIcon />
                </button>
              </div>

              {/* Tabs */}
              <div className="panel-tabs">
                <button 
                  className={`panel-tab ${activeTab === 'Profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('Profile')}
                >
                  Profile
                </button>
                <button 
                  className={`panel-tab ${activeTab === 'OrderHistory' ? 'active' : ''}`}
                  onClick={() => setActiveTab('OrderHistory')}
                >
                  Order History
                </button>
                <button 
                  className={`panel-tab ${activeTab === 'Settlements' ? 'active' : ''}`}
                  onClick={() => setActiveTab('Settlements')}
                >
                  Settlements 
                  {selectedCustomer.unpaidInvoices.length > 0 && (
                    <span className="tab-badge">{selectedCustomer.unpaidInvoices.length}</span>
                  )}
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'Profile' && (
                <div className="panel-content">
                  
                  {/* Edit Details Section */}
                  <div>
                    <div className="section-title-row">
                      <h4>Edit Details</h4>
                      <button className="link-update-all" onClick={handleUpdateDetails}>
                        Update All
                      </button>
                    </div>

                    <form onSubmit={handleUpdateDetails} className="edit-details-form">
                      <div className="detail-group">
                        <label>Company Name / Full Name</label>
                        <input 
                          type="text" 
                          className="detail-input" 
                          value={editCompanyName}
                          onChange={(e) => setEditCompanyName(e.target.value)}
                        />
                      </div>

                      <div className="detail-form-row">
                        <div className="detail-group">
                          <label>Phone Number</label>
                          <input 
                            type="text" 
                            className="detail-input" 
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                          />
                        </div>
                        <div className="detail-group">
                          <label>Account Type</label>
                          <select 
                            className="detail-input" 
                            value={editType}
                            onChange={(e) => setEditType(e.target.value)}
                          >
                            <option value="REGULAR">REGULAR</option>
                            <option value="CORPORATE">CORPORATE</option>
                          </select>
                        </div>
                      </div>

                      <div className="detail-form-row">
                        <div className="detail-group">
                          <label>Contact Person</label>
                          <input 
                            type="text" 
                            className="detail-input" 
                            value={editContactPerson}
                            onChange={(e) => setEditContactPerson(e.target.value)}
                          />
                        </div>

                        <div className="detail-group">
                          <label>WhatsApp Number</label>
                          <input 
                            type="text" 
                            className="detail-input" 
                            value={editWhatsapp}
                            onChange={(e) => setEditWhatsapp(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="detail-group">
                        <label>Physical Address</label>
                        <textarea 
                          className="detail-textarea" 
                          value={editAddress}
                          onChange={(e) => setEditAddress(e.target.value)}
                        />
                      </div>
                    </form>
                  </div>

                  {/* Recent Orders Section */}
                  <div>
                    <div className="section-title-row">
                      <h4>Recent Orders</h4>
                    </div>
                    <div className="recent-orders-list">
                      {selectedCustomer.recentOrders.map(order => (
                        <div className="order-box-card" key={order.id}>
                          <div className="order-box-info">
                            <span className="order-box-meta">#{order.id} • {order.date}</span>
                            <span className="order-box-title">{order.title}</span>
                            <span className="order-box-amount">£{order.amount.toFixed(2)}</span>
                          </div>
                          <button 
                            className={`btn-reorder ${!order.reorderable ? 'disabled' : ''}`}
                            disabled={!order.reorderable}
                            onClick={() => handleReorder(order.id)}
                          >
                            <ReorderIcon /> Reorder
                          </button>
                        </div>
                      ))}
                      {selectedCustomer.recentOrders.length === 0 && (
                        <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '12px' }}>
                          No recent orders.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Unpaid Invoices Section */}
                  {selectedCustomer.unpaidInvoices.length > 0 && (
                    <div className="unpaid-section">
                      <div className="unpaid-title-row">
                        <h4>Unpaid Invoices</h4>
                        <span className="badge-debt">Total Debt: £{totalDebt.toFixed(2)}</span>
                      </div>
                      <div className="invoices-list">
                        {selectedCustomer.unpaidInvoices.map(inv => (
                          <div className="invoice-item-card" key={inv.id}>
                            <div className="invoice-item-info">
                              <h5>{inv.id}</h5>
                              <p>Due: {inv.due}</p>
                            </div>
                            <div className="invoice-item-action">
                              <span className="invoice-item-amount">£{inv.amount.toFixed(2)}</span>
                              <button className="btn-pay-now" onClick={() => handlePayInvoice(inv.id, inv.amount)}>
                                Pay Now
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {activeTab === 'OrderHistory' && (
                <div className="panel-content">
                  <div className="section-title-row">
                    <h4>Order History Timeline</h4>
                  </div>
                  <div className="history-timeline">
                    {selectedCustomer.recentOrders.map(order => (
                      <div className="history-item" key={order.id}>
                        <span className="history-date">{order.date}</span>
                        <div className="history-desc">{order.title}</div>
                        <div className="history-amount">Amount: £{order.amount.toFixed(2)} - Order #{order.id}</div>
                      </div>
                    ))}
                    {selectedCustomer.recentOrders.length === 0 && (
                      <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center' }}>
                        No order history found for this customer.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'Settlements' && (
                <div className="panel-content">
                  <div className="section-title-row">
                    <h4>Settlement Details</h4>
                  </div>

                  <div className="settlement-summary-card">
                    <label>Unresolved Debt</label>
                    <span className="value">£{totalDebt.toFixed(2)}</span>
                  </div>

                  <div className="unpaid-section" style={{ marginTop: '12px' }}>
                    <div className="unpaid-title-row">
                      <h4>Unpaid Invoices</h4>
                    </div>
                    <div className="invoices-list">
                      {selectedCustomer.unpaidInvoices.map(inv => (
                        <div className="invoice-item-card" key={inv.id}>
                          <div className="invoice-item-info">
                            <h5>{inv.id}</h5>
                            <p>Due: {inv.due}</p>
                          </div>
                          <div className="invoice-item-action">
                            <span className="invoice-item-amount">£{inv.amount.toFixed(2)}</span>
                            <button className="btn-pay-now" onClick={() => handlePayInvoice(inv.id, inv.amount)}>
                              Pay Now
                            </button>
                          </div>
                        </div>
                      ))}
                      {selectedCustomer.unpaidInvoices.length === 0 && (
                        <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '12px' }}>
                          No unpaid invoices. Account is fully settled!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Detail Panel Closed / Placeholder State */}
          {!selectedCustomer && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>
              Select a customer from the directory to view details.
            </div>
          )}
        </div>
      </div>

      {/* New Customer Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Customer</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleCreateCustomer}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">CUSTOMER NAME <span className="required-dot">*</span></label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Sarah Jenkins or TechNova Solutions" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>

                <div className="row" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: 0 }}>
                  <div className="form-group">
                    <label className="form-label">PHONE NUMBER <span className="required-dot">*</span></label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="e.g. +44 7700 900123" 
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ACCOUNT TYPE</label>
                    <select 
                      className="input-field" 
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                    >
                      <option value="REGULAR">REGULAR</option>
                      <option value="CORPORATE">CORPORATE</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">WHATSAPP NUMBER</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. +44 7700 900123" 
                    value={newWhatsapp}
                    onChange={(e) => setNewWhatsapp(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CONTACT PERSON</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Primary contact name" 
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">PHYSICAL ADDRESS</label>
                  <textarea 
                    className="input-field" 
                    style={{ minHeight: '60px', fontFamily: 'inherit' }}
                    placeholder="Billing/delivery address" 
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ padding: '0 24px 24px 24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-cancel" style={{ padding: '10px 20px', borderRadius: '4px', border: '1px solid #c4c6cd', background: 'white', cursor: 'pointer' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-create" style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', background: '#b45309', color: 'white', cursor: 'pointer' }}>Create Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-alert">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
