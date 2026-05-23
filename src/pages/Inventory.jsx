import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../assets/styles/users.css'; // Importing general layout variables if any
import '../assets/styles/inventory.css';

// SVG Icons
const SearchIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>;
const ChevronDown = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>;
const BellIcon = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>;
const ClockIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const WifiIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0114.08 0" /><path d="M1.42 9a16 16 0 0121.16 0" /><path d="M8.53 16.11a6 6 0 016.95 0" /></svg>;
const PlusIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const ClipboardIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>;
const FilterIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
const WarningIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
const ExternalLinkIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>;
const XIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>;

export default function Inventory() {
  // State variables for inventory items loaded from localStorage if present
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('zangmo_inventory_items');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Basmati Rice (Export)', category: 'Dry Goods', sku: 'SKU-BR-001', unit: 'kg', stock: 450.00, reorderPoint: 100.00, valuePerUnit: 1540.389 },
      { id: 2, name: 'Chicken Breast (Skinless)', category: 'Meat', sku: 'SKU-MT-012', unit: 'kg', stock: 12.50, reorderPoint: 15.00, valuePerUnit: 1200 },
      { id: 3, name: 'Saffron (Premium)', category: 'Dry Goods', sku: 'SKU-SP-099', unit: 'g', stock: 0.045, reorderPoint: 0.500, valuePerUnit: 20000 },
      { id: 4, name: 'Cooking Oil (Sunflower)', category: 'Dry Goods', sku: 'SKU-DG-005', unit: 'ltr', stock: 85.00, reorderPoint: 20.00, valuePerUnit: 500 },
      { id: 5, name: 'Organic Tomatoes', category: 'Produce', sku: 'SKU-PR-404', unit: 'kg', stock: 0.00, reorderPoint: 10.00, valuePerUnit: 250 },
      { id: 6, name: 'Full Cream Milk', category: 'Beverages', sku: 'SKU-BV-022', unit: 'ltr', stock: 120.00, reorderPoint: 30.00, valuePerUnit: 220 },
      { id: 7, name: 'Aged Cheddar Cheese', category: 'Dairy', sku: 'SKU-DY-007', unit: 'kg', stock: 25.00, reorderPoint: 10.00, valuePerUnit: 1400 },
      { id: 8, name: 'White Flour (Maida)', category: 'Dry Goods', sku: 'SKU-BR-002', unit: 'kg', stock: 336.59, reorderPoint: 100.00, valuePerUnit: 110 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('zangmo_inventory_items', JSON.stringify(items));
  }, [items]);

  // Global search, Category filter, Status filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals state
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isCreatePOOpen, setIsCreatePOOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Add Stock state
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.id || 1);
  const [stockToAdd, setStockToAdd] = useState('');

  // Create Purchase Order form state
  const [poVendor, setPoVendor] = useState('');
  const [poItem, setPoItem] = useState(items[0]?.name || '');
  const [poQuantity, setPoQuantity] = useState('');
  const [poExpectedDate, setPoExpectedDate] = useState('');

  // Toast helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Helper to determine status dynamically
  const getStatus = (item) => {
    if (item.stock === 0) return 'OUT OF STOCK';
    if (item.stock < item.reorderPoint * 0.5) return 'CRITICAL';
    if (item.stock < item.reorderPoint) return 'LOW STOCK';
    return 'IN STOCK';
  };

  // Helper to get status class for badge styling
  const getStatusClass = (status) => {
    if (status === 'OUT OF STOCK') return 'out-of-stock';
    if (status === 'CRITICAL') return 'critical';
    if (status === 'LOW STOCK') return 'low-stock';
    return 'in-stock';
  };

  // Handle reordering all low stock/critical/out of stock items
  const handleReorderAll = () => {
    const updatedItems = items.map(item => {
      const status = getStatus(item);
      if (status !== 'IN STOCK') {
        // Restock logically based on reorderPoint size
        const increment = item.reorderPoint < 1 ? parseFloat((item.reorderPoint * 2).toFixed(3)) : 50;
        return {
          ...item,
          stock: parseFloat((item.stock + increment).toFixed(3))
        };
      }
      return item;
    });
    setItems(updatedItems);
    triggerToast('Purchase orders triggered & stock updated for all short items!');
  };

  // Handle adding stock to a specific item
  const handleAddStockSubmit = (e) => {
    e.preventDefault();
    const quantity = parseFloat(stockToAdd);
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid stock quantity.');
      return;
    }

    const updatedItems = items.map(item => {
      if (item.id === parseInt(selectedItemId)) {
        return {
          ...item,
          stock: parseFloat((item.stock + quantity).toFixed(3))
        };
      }
      return item;
    });

    const targetItem = items.find(i => i.id === parseInt(selectedItemId));
    setItems(updatedItems);
    setStockToAdd('');
    setIsAddStockOpen(false);
    triggerToast(`Added ${quantity} ${targetItem?.unit || 'units'} to ${targetItem?.name}!`);
  };

  // Handle PO submit
  const handleCreatePOSubmit = (e) => {
    e.preventDefault();
    if (!poVendor.trim() || !poQuantity) {
      alert('Please fill out all required fields.');
      return;
    }
    setIsCreatePOOpen(false);
    triggerToast(`Purchase Order created successfully for ${poQuantity} units of ${poItem}!`);
    setPoVendor('');
    setPoQuantity('');
  };

  // Calculate dynamic Total Stock Value
  const totalStockValue = items.reduce((acc, item) => acc + (item.stock * item.valuePerUnit), 0);

  // Filter items
  const filteredItems = items.filter(item => {
    const status = getStatus(item);
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All Categories' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStatus = selectedStatus === 'All Statuses' ||
      status.replace(' ', '').toLowerCase() === selectedStatus.replace(' ', '').toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Paginated items
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Stock Alert list (Critical and Out of Stock)
  const alertItems = items.filter(item => {
    const status = getStatus(item);
    return status === 'CRITICAL' || status === 'OUT OF STOCK';
  });

  // Hardcoded percentages from the user's design breakdown
  const breakdowns = [
    { label: 'Dry Goods', value: 62 },
    { label: 'Produce', value: 18 },
    { label: 'Meat & Poultry', value: 12 },
    { label: 'Beverages', value: 8 }
  ];

  return (
    <div className="inventory-container">
      <Sidebar activePage="inventory" />

      <div className="inventory-content">
        <Topbar title="Inventory" />

        {/* Page Content */}
        <div className="inventory-page-content">
          <div className="inventory-header-row">
            <div className="inventory-title-block">
              <h1>Inventory Management</h1>
              <p>Monitor and manage kitchen stock levels across departments.</p>
            </div>
            <div className="inventory-header-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="pos-search-wrapper" style={{ margin: 0, height: '42px', width: '240px' }}>
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Global Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="btn-create-po" onClick={() => setIsCreatePOOpen(true)} style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardIcon /> Create PO
              </button>
              <button className="btn-add-stock" onClick={() => setIsAddStockOpen(true)} style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusIcon /> Add Stock
              </button>
            </div>
          </div>

          {/* Overview & Filters row */}
          <div className="inventory-overview-row">
            <div className="value-card">
              <span className="label">Total Stock Value</span>
              <div className="value-wrapper">
                <span className="value">PKR {totalStockValue.toLocaleString()}</span>
                <span className="trend">~4.2%</span>
              </div>
            </div>

            <div className="filters-card">
              <div className="filter-group">
                <label>Category</label>
                <select
                  className="filter-dropdown"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All Categories">All Categories</option>
                  <option value="Dry Goods">Dry Goods</option>
                  <option value="Meat">Meat</option>
                  <option value="Produce">Produce</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Dairy">Dairy</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Stock Level</label>
                <select
                  className="filter-dropdown"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Critical">Critical</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <button className="btn-filter-icon">
                <FilterIcon />
              </button>
            </div>
          </div>

          {/* Two columns grid */}
          <div className="inventory-grid">

            {/* Left Column: Table */}
            <div className="inventory-left-col">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>SKU</th>
                    <th>Unit</th>
                    <th>Current Stock</th>
                    <th>Reorder Pt</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(item => {
                    const status = getStatus(item);
                    const statusClass = getStatusClass(status);
                    return (
                      <tr key={item.id}>
                        <td className="item-name-cell">{item.name}</td>
                        <td>{item.category}</td>
                        <td>{item.sku}</td>
                        <td>{item.unit}</td>
                        <td className={status === 'CRITICAL' ? 'stock-value-critical' : status === 'LOW STOCK' ? 'stock-value-low' : ''}>
                          {item.stock}
                        </td>
                        <td>{item.reorderPoint}</td>
                        <td>
                          <span className={`badge ${statusClass}`}>{status}</span>
                        </td>
                      </tr>
                    );
                  })}
                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                        No items found matching the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="table-footer">
                  <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} items</span>
                  <div className="pagination-wrapper">
                    <button
                      className="page-btn"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      className="page-btn"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Widgets */}
            <div className="inventory-right-col">

              {/* Critical Alert Panel */}
              <div className="alert-card">
                <div className="alert-header">
                  <WarningIcon /> CRITICAL STOCK ALERT
                </div>
                <div className="alert-body">
                  {alertItems.slice(0, 2).map(item => {
                    const status = getStatus(item);
                    return (
                      <div className="alert-item" key={item.id}>
                        <div className="alert-info">
                          <h4>{item.name}</h4>
                          <p>{status === 'OUT OF STOCK' ? 'Out of Stock' : `${item.stock}${item.unit} remaining`}</p>
                          <span>Reorder Point: {item.reorderPoint}{item.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                  {alertItems.length === 0 && (
                    <div style={{ color: '#96a9be', fontSize: '13px', textAlign: 'center', padding: '12px 0' }}>
                      All items healthy! No critical alerts.
                    </div>
                  )}
                  <button className="btn-reorder-all" onClick={handleReorderAll}>
                    REORDER ALL ITEMS
                  </button>
                </div>
              </div>

              {/* Stock Breakdown */}
              <div className="breakdown-card">
                <h3>STOCK BREAKDOWN</h3>
                {breakdowns.map(row => (
                  <div className="breakdown-row" key={row.label}>
                    <div className="breakdown-label-row">
                      <span>{row.label}</span>
                      <span>{row.value}%</span>
                    </div>
                    <div className="breakdown-bar-bg">
                      <div className="breakdown-bar-fill" style={{ width: `${row.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Inventory Help */}
              <div className="help-card">
                <h4>
                  <span style={{ background: '#b45309', width: '20px', height: '20px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>?</span>
                  Inventory Help
                </h4>
                <p>Need help adjusting stock or setting reorder points?</p>
                <a href="#doc" onClick={(e) => { e.preventDefault(); alert('Help document opened.'); }}>
                  View Documentation <ExternalLinkIcon />
                </a>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Add Stock Modal */}
      {isAddStockOpen && (
        <div className="modal-overlay" onClick={() => setIsAddStockOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Stock Item</h3>
              <button className="close-btn" onClick={() => setIsAddStockOpen(false)}>
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleAddStockSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">SELECT INVENTORY ITEM <span className="required-dot">*</span></label>
                  <select
                    className="input-field"
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                  >
                    {items.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.sku}) - Current: {item.stock} {item.unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">QUANTITY TO ADD <span className="required-dot">*</span></label>
                  <input
                    type="number"
                    step="any"
                    className="input-field"
                    placeholder="e.g. 50"
                    value={stockToAdd}
                    onChange={(e) => setStockToAdd(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ padding: '0 24px 24px 24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-cancel" style={{ padding: '10px 20px', borderRadius: '4px', border: '1px solid #c4c6cd', background: 'white', cursor: 'pointer' }} onClick={() => setIsAddStockOpen(false)}>Cancel</button>
                <button type="submit" className="btn-create" style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', background: '#b45309', color: 'white', cursor: 'pointer' }}>Update Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Purchase Order Modal */}
      {isCreatePOOpen && (
        <div className="modal-overlay" onClick={() => setIsCreatePOOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Purchase Order</h3>
              <button className="close-btn" onClick={() => setIsCreatePOOpen(false)}>
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleCreatePOSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">VENDOR NAME <span className="required-dot">*</span></label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Karachi Groceries Ltd"
                    value={poVendor}
                    onChange={(e) => setPoVendor(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">SELECT ITEM <span className="required-dot">*</span></label>
                  <select
                    className="input-field"
                    value={poItem}
                    onChange={(e) => setPoItem(e.target.value)}
                  >
                    {items.map(item => (
                      <option key={item.id} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </div>

                <div className="row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: 0 }}>
                  <div className="form-group">
                    <label className="form-label">QUANTITY <span className="required-dot">*</span></label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="e.g. 100"
                      value={poQuantity}
                      onChange={(e) => setPoQuantity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">EXPECTED DELIVERY</label>
                    <input
                      type="date"
                      className="input-field"
                      value={poExpectedDate}
                      onChange={(e) => setPoExpectedDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ padding: '0 24px 24px 24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-cancel" style={{ padding: '10px 20px', borderRadius: '4px', border: '1px solid #c4c6cd', background: 'white', cursor: 'pointer' }} onClick={() => setIsCreatePOOpen(false)}>Cancel</button>
                <button type="submit" className="btn-create" style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', background: '#b45309', color: 'white', cursor: 'pointer' }}>Submit PO</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast alert */}
      {toastMessage && (
        <div className="toast-alert">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
