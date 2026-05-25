import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ManagerSidebar from './ManagerSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/users.css';
import '../../assets/styles/pos.css';

// SVG Icons
const SearchIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>;
const ChevronDown = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>;
const TrashIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>;
const EditIcon = () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const PrinterIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><path d="M6 14h12v8H6z" /></svg>;
const CardIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>;
const InfoIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>;
const XIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>;

// Helper to format currency in PKR
const formatPKR = (amount) => {
  return "PKR " + Number(amount).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Menu Item Dataset matching custom requirements
const DEFAULT_MENU_ITEMS = [
  {
    id: 1,
    name: 'Wagyu Deluxe',
    category: 'Main Course',
    price: 2400.00,
    stock: '85/100',
    description: 'Medium Wagyu, aged cheddar, brioche, truffle mayo.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop',
    defaultModifiers: 'Medium Rare, No Onions'
  },
  {
    id: 2,
    name: 'Avocado Salad',
    category: 'Appetizers',
    price: 1250.00,
    stock: '42/50',
    description: 'Fresh Haas avocado slices, mixed greens, house dressing.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop',
    defaultModifiers: 'Dressing on side'
  },
  {
    id: 3,
    name: 'Margherita Pizza',
    category: 'Main Course',
    price: 1850.00,
    stock: '28/30',
    description: 'Stone-baked dough, house San Marzano sauce, fresh mozzarella.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop',
    defaultModifiers: 'Extra Cheese'
  },
  {
    id: 4,
    name: 'Smoked Ribs',
    category: 'Main Course',
    price: 3800.00,
    stock: '15/20',
    description: 'Hickory-smoked beef ribs glazed with house BBQ marinade.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop',
    defaultModifiers: 'Well Done'
  },
  {
    id: 5,
    name: 'Pesto Linguine',
    category: 'Main Course',
    price: 1950.00,
    stock: '30/40',
    description: 'Fresh linguine tossed in roasted pine nut basil pesto.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&auto=format&fit=crop',
    defaultModifiers: 'No Pine Nuts'
  },
  {
    id: 6,
    name: 'Molten Lava Cake',
    category: 'Desserts',
    price: 1200.00,
    stock: '25/25',
    description: 'Decadent dark chocolate shell filled with a liquid cacao center.',
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&auto=format&fit=crop',
    defaultModifiers: 'Extra Ice Cream'
  },
  {
    id: 7,
    name: 'Premium Salad Box',
    category: 'Appetizers',
    price: 1500.00,
    stock: '18/20',
    description: 'Assorted seasonal baby vegetables with grilled chicken strips.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop',
    defaultModifiers: 'Vinaigrette dressing'
  },
  {
    id: 8,
    name: 'Diet Cola',
    category: 'Beverages',
    price: 300.00,
    stock: '120/120',
    description: 'Crisp sugar-free carbonated drink served chilled.',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop',
    defaultModifiers: 'With Lemon & Ice'
  },
  {
    id: 9,
    name: 'Craft Lemonade',
    category: 'Beverages',
    price: 600.00,
    stock: '50/50',
    description: 'Freshly squeezed lemons with mint sprigs and pure honey.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop',
    defaultModifiers: 'No Sugar'
  },
  {
    id: 10,
    name: 'Iced Latte',
    category: 'Beverages',
    price: 750.00,
    stock: '45/45',
    description: 'Double espresso pulled over ice cold milk and simple syrup.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&auto=format&fit=crop',
    defaultModifiers: 'Almond Milk'
  }
];

export default function POS() {
  const location = useLocation();
  const navigate = useNavigate();

  // Selected Table passed from Table Management
  const selectedTableData = location.state || null; // tableId, tableName

  // Menu items loaded from localStorage if present, otherwise DEFAULT_MENU_ITEMS
  const [menuItems] = useState(() => {
    const saved = localStorage.getItem('zangmo_menu_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(item => {
            let parsedPrice = 0;
            if (typeof item.price === 'number') {
              parsedPrice = item.price;
            } else if (typeof item.price === 'string') {
              const cleaned = item.price.replace(/[^\d.]/g, '');
              parsedPrice = cleaned ? parseFloat(cleaned) : 0;
            }
            return {
              ...item,
              price: isNaN(parsedPrice) ? 0 : parsedPrice,
              stock: item.stock || '99/99',
              image: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
            };
          });
        }
      } catch (err) {
        console.error('Error parsing menu items:', err);
      }
    }
    return DEFAULT_MENU_ITEMS;
  });

  // Category list loaded from localStorage if present, otherwise standard defaults
  const [categoriesList] = useState(() => {
    const saved = localStorage.getItem('zangmo_menu_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return ['All Items', ...parsed.map(c => typeof c === 'string' ? c : c.name)];
        }
      } catch (err) {
        console.error('Error parsing categories:', err);
      }
    }
    return ['All Items', 'Main Course', 'Appetizers', 'Beverages', 'Desserts'];
  });

  // Active Category State
  const [activeTab, setActiveTab] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart / Order items list
  const [cartItems, setCartItems] = useState([]);

  // Modifiers edit modal states
  const [editingCartItemIndex, setEditingCartItemIndex] = useState(null);
  const [tempModifiers, setTempModifiers] = useState('');

  // Print Bill Receipt Modal state
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [lastBilledTicket, setLastBilledTicket] = useState('4210');

  // Load table-specific items if navigated directly from Table Management
  useEffect(() => {
    if (selectedTableData && selectedTableData.tableId) {
      // Mock loading the table's actual order
      const initialCart = [
        {
          name: 'Wagyu Deluxe',
          qty: 2,
          price: 2400.00,
          modifiers: 'Medium Rare, No Onions'
        },
        {
          name: 'Avocado Salad',
          qty: 1,
          price: 1250.00,
          modifiers: 'Dressing on side'
        }
      ];
      setCartItems(initialCart);
    }
  }, [selectedTableData]);

  // Add Item to Order list (Punching)
  const handlePunchItem = (menuItem) => {
    const existingIndex = cartItems.findIndex(item => item.name === menuItem.name);

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].qty += 1;
      setCartItems(updated);
    } else {
      setCartItems([...cartItems, {
        name: menuItem.name,
        qty: 1,
        price: menuItem.price,
        modifiers: menuItem.defaultModifiers || 'No Customizations'
      }]);
    }
  };

  // Adjust Cart Qty
  const handleQtyChange = (index, delta) => {
    const updated = [...cartItems];
    const newQty = updated[index].qty + delta;

    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].qty = newQty;
    }
    setCartItems(updated);
  };

  // Clear Current Order
  const handleClearOrder = () => {
    if (cartItems.length === 0) return;
    if (window.confirm("Are you sure you want to clear this order draft?")) {
      setCartItems([]);
    }
  };

  // Modifiers
  const openEditModifiers = (index) => {
    setEditingCartItemIndex(index);
    setTempModifiers(cartItems[index].modifiers);
  };

  const saveModifiers = () => {
    const updated = [...cartItems];
    updated[editingCartItemIndex].modifiers = tempModifiers;
    setCartItems(updated);
    setEditingCartItemIndex(null);
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const taxRate = 0.08; // 8% standard tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Print Action
  const triggerPrintReceipt = () => {
    if (cartItems.length === 0) {
      alert("Please add items to order before generating a bill.");
      return;
    }
    // Generate new random ticket number for the print out
    setLastBilledTicket(Math.floor(4000 + Math.random() * 500).toString());
    setIsReceiptModalOpen(true);
  };

  // Finish receipt processing
  const handleFinalizePrint = async () => {
    if (window.electronAPI) {
      // Build standard HTML content to print silently
      const htmlContent = `
        <div class="receipt-paper-header" style="text-align: center;">
          <h2 style="font-size: 16px; margin: 0 0 2px 0;">Z&M KITCHEN</h2>
          <p class="branch-meta" style="font-size: 10px; margin: 0 0 4px 0; color: #555;">${localStorage.getItem('zangmo_logged_branch') || 'Mehdi Kitchen (Main)'} - Terminal 01</p>
          <p class="date-meta" style="font-size: 10px; margin: 0 0 4px 0; color: #555;">Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p class="ticket-meta" style="font-size: 11px; margin: 0 0 10px 0; font-weight: bold;">Order: #${lastBilledTicket}</p>
        </div>

        <div class="divider" style="border-top: 1px dashed #000; margin: 5px 0;"></div>

        <div class="receipt-items-table" style="width: 100%;">
          ${cartItems.map(item => `
            <div class="receipt-item-line" style="display: flex; justify-content: space-between; font-size: 11px; margin: 3px 0;">
              <span class="qty-name">${item.qty}x ${item.name}</span>
              <span class="price">${Number(item.qty * item.price).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>

        <div class="divider" style="border-top: 1px dashed #000; margin: 5px 0;"></div>

        <div class="receipt-pricing-block" style="font-size: 11px;">
          <div class="receipt-price-row" style="display: flex; justify-content: space-between; margin: 2px 0;">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div class="receipt-price-row" style="display: flex; justify-content: space-between; margin: 2px 0;">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div class="receipt-price-row total" style="display: flex; justify-content: space-between; margin: 4px 0 0 0; font-weight: bold; font-size: 13px;">
            <span>TOTAL DUE</span>
            <span>PKR ${Number(total).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div class="divider" style="border-top: 1px dashed #000; margin: 10px 0 5px 0;"></div>

        <div class="receipt-paper-footer" style="text-align: center; font-size: 9px; margin-top: 10px; color: #555;">
          <p style="margin: 0 0 2px 0; font-weight: bold;">THANK YOU FOR DINING WITH US</p>
          <p style="margin: 0;">WWW.ZM-KITCHEN.COM</p>
        </div>
      `;

      try {
        const result = await window.electronAPI.printReceipt({
          printerName: '', // empty defaults to system default printer
          htmlContent: htmlContent
        });
        if (!result.success) {
          console.error('Silent print failed:', result.error);
        }
      } catch (err) {
        console.error('Error invoking print API:', err);
      }
    }

    // Log transaction to localStorage
    const usdAmount = total / 80;
    const newSale = {
      id: Date.now(),
      ticketNo: lastBilledTicket,
      branch: localStorage.getItem('zangmo_logged_branch') || 'Mehdi Kitchen (Main)',
      amount: usdAmount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      itemsCount: cartItems.reduce((acc, item) => acc + item.qty, 0)
    };
    try {
      const saved = localStorage.getItem('zangmo_sales_transactions');
      const sales = saved ? JSON.parse(saved) : [];
      sales.push(newSale);
      localStorage.setItem('zangmo_sales_transactions', JSON.stringify(sales));
    } catch (err) {
      console.error(err);
    }

    setIsReceiptModalOpen(false);
    alert(`Receipt for Ticket #${lastBilledTicket} printed successfully!`);
    setCartItems([]); // Reset after printing completes
    if (selectedTableData && selectedTableData.tableId) {
      // Return to Table Management page
      navigate('/tables');
    }
  };

  const isCategoryMatch = (itemCategory, tabCategory) => {
    if (tabCategory === 'All Items' || tabCategory === 'All') return true;

    const cleanItem = (itemCategory || '').trim().toLowerCase();
    const cleanTab = (tabCategory || '').trim().toLowerCase();

    if (cleanItem === cleanTab) return true;

    const synonyms = {
      'mains': ['main course', 'main', 'mains', 'entrees'],
      'main course': ['mains', 'main', 'main course', 'entrees'],
      'appetizers': ['starters', 'appetizer', 'appetizers', 'sides', 'sides (large)'],
      'starters': ['appetizers', 'appetizer', 'starters', 'sides', 'sides (large)'],
      'sides': ['sides', 'sides (large)', 'starters', 'appetizers'],
      'drinks': ['beverages', 'drink', 'drinks', 'beverage'],
      'beverages': ['drinks', 'drink', 'drinks', 'beverage'],
      'desserts': ['dessert', 'desserts', 'sweet', 'sweets']
    };

    const itemGroup = synonyms[cleanItem];
    const tabGroup = synonyms[cleanTab];

    if (itemGroup && itemGroup.includes(cleanTab)) return true;
    if (tabGroup && tabGroup.includes(cleanItem)) return true;

    return cleanItem.includes(cleanTab) || cleanTab.includes(cleanItem);
  };

  // Filtered menu items
  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = isCategoryMatch(item.category, activeTab);
    const matchesSearch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pos-layout-container">
      <ManagerSidebar activePage="pos" />

      <div className="pos-main-wrapper" style={{ flexDirection: 'column' }}>
        <Topbar title="POS Terminal" />

        <div className="pos-workspace">
          {/* Main interactive POS screen grid */}
          <div className="pos-billing-area">

            {/* Top navigation actions & offline alerts */}
            <div className="pos-header-actions-row">
              <div className="pos-search-box">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category Tabs list */}
            <div className="pos-categories-row">
              {categoriesList.map(cat => (
                <button
                  key={cat}
                  className={`category-pill ${activeTab === cat ? 'active' : ''}`}
                  onClick={() => setActiveTab(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid of Food Menu Items to click/punch */}
            <div className="pos-menu-items-grid">
              {filteredMenuItems.map(item => (
                <div
                  className="pos-item-card"
                  key={item.id}
                  onClick={() => handlePunchItem(item)}
                >
                  <div className="item-card-image-box">
                    <img src={item.image} alt={item.name} />
                    <span className="item-stock-tag">{item.stock} left</span>
                  </div>
                  <div className="item-card-details">
                    <span className="item-card-title">{item.name}</span>
                    <span className="item-card-price">{formatPKR(item.price)}</span>
                  </div>
                </div>
              ))}

              {filteredMenuItems.length === 0 && (
                <div className="no-items-placeholder">
                  No menu items found matching search queries.
                </div>
              )}
            </div>

          </div>

          {/* Right side checkout bill panel */}
          <div className="pos-order-sidebar">

            <div className="order-sidebar-header">
              <div className="order-title-block">
                <h3>Current Order</h3>
                <p>Ticket #{lastBilledTicket} {selectedTableData ? `— Table ${selectedTableData.tableName.replace('T-', '')}` : '— Direct POS'}</p>
              </div>
              <button className="clear-order-btn" onClick={handleClearOrder} title="Clear Draft">
                <TrashIcon />
              </button>
            </div>

            {/* Added cart items lists */}
            <div className="order-items-scroll-box">
              {cartItems.map((item, index) => (
                <div className="order-item-card-row" key={index}>
                  <div className="order-item-main-details">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className="order-item-title">{item.name}</span>
                      <span className="order-item-price-sum">{formatPKR(item.price * item.qty)}</span>
                    </div>
                    <span className="order-item-modifiers-label">{item.modifiers}</span>
                  </div>

                  <div className="order-item-controls-row">
                    <div className="qty-controls-box">
                      <button className="btn-qty-action" onClick={() => handleQtyChange(index, -1)}>-</button>
                      <span className="qty-value-label">{item.qty}</span>
                      <button className="btn-qty-action" onClick={() => handleQtyChange(index, 1)}>+</button>
                    </div>
                    <button className="edit-modifiers-link" onClick={() => openEditModifiers(index)}>
                      <EditIcon /> Edit Mods
                    </button>
                  </div>
                </div>
              ))}

              {cartItems.length === 0 && (
                <div className="empty-cart-placeholder">
                  <p>Order is empty.</p>
                  <span>Punch menu items from the left roster to add them to this ticket.</span>
                </div>
              )}
            </div>

            {/* Pricing Totals Section */}
            <div className="order-totals-dock">
              <div className="totals-line-row">
                <span className="label">Subtotal</span>
                <span className="value">{formatPKR(subtotal)}</span>
              </div>
              <div className="totals-line-row">
                <span className="label">Service Tax (8%)</span>
                <span className="value">{formatPKR(tax)}</span>
              </div>
              <div className="totals-total-row">
                <span className="label">Total Due</span>
                <span className="value">{formatPKR(total)}</span>
              </div>
            </div>

            {/* Checkout buttons */}
            <div className="order-checkout-buttons-row">
              <button className="btn-print-receipt-action" onClick={triggerPrintReceipt}>
                <PrinterIcon /> Print
              </button>
              <button className="btn-pay-now-action" onClick={triggerPrintReceipt}>
                <CardIcon /> Pay Now
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Edit Item Modifiers Modal dialog */}
      {editingCartItemIndex !== null && (
        <div className="order-modal-overlay" onClick={() => setEditingCartItemIndex(null)}>
          <div className="order-modal" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="order-modal-header">
              <h3>Customize Item Modifiers</h3>
              <button className="order-modal-close" onClick={() => setEditingCartItemIndex(null)}>
                <XIcon />
              </button>
            </div>

            <div className="order-modal-body" style={{ flexDirection: 'column', gap: '16px', padding: '24px' }}>
              <div className="form-group" style={{ width: '100%' }}>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '6px', display: 'block' }}>MODIFIERS & SPECIFICATIONS</label>
                <input
                  type="text"
                  className="input-field"
                  value={tempModifiers}
                  onChange={e => setTempModifiers(e.target.value)}
                  placeholder="e.g. Medium Rare, No Ice, Extra Sauce"
                  style={{ width: '100%', height: '40px', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0 12px' }}
                />
              </div>
            </div>

            <div className="order-modal-footer">
              <button className="btn-modal-cancel" onClick={() => setEditingCartItemIndex(null)}>Cancel</button>
              <button className="btn-modal-save" onClick={saveModifiers}>Save Modifiers</button>
            </div>
          </div>
        </div>
      )}

      {/* Courier printed thermal receipt overlay modal dialog */}
      {isReceiptModalOpen && (
        <div className="order-modal-overlay" style={{ background: 'rgba(0,0,0,0.65)' }}>
          <div className="thermal-receipt-modal" onClick={e => e.stopPropagation()}>
            <button className="close-receipt-btn" onClick={() => setIsReceiptModalOpen(false)}>
              <XIcon />
            </button>

            <div className="receipt-paper-content">
              <div className="receipt-paper-header">
                <h2>Z&M KITCHEN</h2>
                <p className="branch-meta">{localStorage.getItem('zangmo_logged_branch') || 'Mehdi Kitchen (Main)'} - Terminal 01</p>
                <p className="date-meta">Date: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="ticket-meta">Order: #{lastBilledTicket}</p>
              </div>

              <div className="receipt-items-dashed-divider" />

              <div className="receipt-items-table">
                {cartItems.map((item, idx) => (
                  <div className="receipt-item-line" key={idx}>
                    <span className="qty-name">{item.qty}x {item.name}</span>
                    <span className="price">{Number(item.qty * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="receipt-items-dashed-divider" />

              <div className="receipt-pricing-block">
                <div className="receipt-price-row">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)}</span>
                </div>
                <div className="receipt-price-row">
                  <span>Tax (8%)</span>
                  <span>{tax.toFixed(2)}</span>
                </div>
                <div className="receipt-price-row total">
                  <span>TOTAL DUE</span>
                  <span>{formatPKR(total)}</span>
                </div>
              </div>

              <div className="receipt-items-dashed-divider" />

              <div className="receipt-paper-footer">
                <p>THANK YOU FOR DINING WITH US</p>
                <p>WWW.ZM-KITCHEN.COM</p>
                <div className="barcode-mockup">
                  <div className="bar line-wide" />
                  <div className="bar line-narrow" />
                  <div className="bar line-wide" />
                  <div className="bar line-wide" />
                  <div className="bar line-narrow" />
                  <div className="bar line-wide" />
                  <div className="bar line-narrow" />
                  <div className="bar line-wide" />
                </div>
              </div>
            </div>

            <button className="btn-finalize-and-print-receipt" onClick={handleFinalizePrint}>
              FINALIZE & PRINT
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
