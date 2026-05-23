import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../assets/styles/users.css'; 
import '../assets/styles/tables.css';

// SVG Icons
const UsersIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
const ClockIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const TableIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h18v6H3V3zM3 9v12M21 9v12M7 9v12M17 9v12"/></svg>;
const ChevronDown = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>;
const BellIcon = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
const WifiIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>;
const XIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const PrinterIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>;
const CheckIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>;
const ExternalIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>;
const EyeIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const StoreIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><rect x="3" y="3" width="18" height="8" rx="2"/></svg>;
const TrashIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>;
const PlusIcon = () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;

// Helper to format currency in PKR with commas
const formatPKR = (amount) => {
  return "PKR " + Number(amount).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const AVAILABLE_MENU_ITEMS = [
  { name: 'Signature Wagyu Burger', price: 2400.00, category: 'Mains' },
  { name: 'Truffle Fries (Large)', price: 1250.00, category: 'Sides' },
  { name: 'Caesar Salad', price: 1425.00, category: 'Sides' },
  { name: 'Garlic Bread', price: 850.00, category: 'Sides' },
  { name: 'Spicy Chicken Wings', price: 1500.00, category: 'Sides' },
  { name: 'Molten Lava Cake', price: 1200.00, category: 'Desserts' },
  { name: 'Premium Salad Box', price: 1500.00, category: 'Mains' },
  { name: 'Craft Lemonade', price: 600.00, category: 'Drinks' },
  { name: 'Diet Cola', price: 300.00, category: 'Drinks' },
  { name: 'Iced Latte', price: 750.00, category: 'Drinks' }
];

export default function TableManagement() {
  const navigate = useNavigate();

  // Initial Tables State loaded from localStorage if present
  const [tables, setTables] = useState(() => {
    const saved = localStorage.getItem('zangmo_tables');
    return saved ? JSON.parse(saved) : [
      {
        id: 'T-01',
        name: 'T-01',
        status: 'Occupied', // Occupied, Available, Billed, Reserved
        guests: 4,
        capacity: 4,
        timeTag: '22 MINS',
        seatedAt: '17:35 PM',
        server: 'David K.',
        ticketNo: '8815',
        orderItems: [
          { name: 'Signature Wagyu Burger', qty: 2, price: 2400.00 },
          { name: 'Truffle Fries (Large)', qty: 1, price: 1250.00 },
          { name: 'Craft Lemonade', qty: 3, price: 600.00 }
        ]
      },
      {
        id: 'T-02',
        name: 'T-02',
        status: 'Available',
        guests: 0,
        capacity: 6,
        timeTag: null,
        seatedAt: '',
        server: '',
        ticketNo: '',
        orderItems: []
      },
      {
        id: 'T-03',
        name: 'T-03',
        status: 'Billed',
        guests: 3,
        capacity: 4,
        timeTag: 'BILLING',
        seatedAt: '17:10 PM',
        server: 'Sarah L.',
        ticketNo: '8802',
        orderItems: [
          { name: 'Premium Salad Box', qty: 3, price: 1500.00 },
          { name: 'Craft Lemonade', qty: 3, price: 600.00 }
        ]
      },
      {
        id: 'T-04',
        name: 'T-04',
        status: 'Reserved',
        guests: 2,
        capacity: 4,
        timeTag: '19:30 PM',
        seatedAt: '',
        server: '',
        ticketNo: '',
        orderItems: []
      },
      {
        id: 'T-05',
        name: 'T-05',
        status: 'Available',
        guests: 0,
        capacity: 2,
        timeTag: null,
        seatedAt: '',
        server: '',
        ticketNo: '',
        orderItems: []
      },
      {
        id: 'T-06',
        name: 'T-06',
        status: 'Occupied',
        guests: 3,
        capacity: 4,
        timeTag: '45 MINS',
        seatedAt: '17:57 PM',
        server: 'David K.',
        ticketNo: '8821',
        orderItems: [
          { name: 'Signature Wagyu Burger', qty: 2, price: 2400.00 },
          { name: 'Truffle Fries (Large)', qty: 1, price: 1250.00 },
          { name: 'Craft Lemonade', qty: 3, price: 600.00 },
          { name: 'Molten Lava Cake', qty: 1, price: 1200.00 },
          { name: 'Caesar Salad', qty: 1, price: 1425.00 },
          { name: 'Garlic Bread', qty: 1, price: 850.00 },
          { name: 'Diet Cola', qty: 2, price: 300.00 },
          { name: 'Iced Latte', qty: 2, price: 750.00 }
        ]
      },
      {
        id: 'T-07',
        name: 'T-07',
        status: 'Occupied',
        guests: 2,
        capacity: 2,
        timeTag: '10 MINS',
        seatedAt: '18:32 PM',
        server: 'Sarah L.',
        ticketNo: '8830',
        orderItems: [
          { name: 'Premium Salad Box', qty: 1, price: 1500.00 },
          { name: 'Diet Cola', qty: 2, price: 300.00 }
        ]
      },
      {
        id: 'T-08',
        name: 'T-08',
        status: 'Available',
        guests: 0,
        capacity: 4,
        timeTag: null,
        seatedAt: '',
        server: '',
        ticketNo: '',
        orderItems: []
      },
      {
        id: 'T-09',
        name: 'T-09',
        status: 'Billed',
        guests: 2,
        capacity: 4,
        timeTag: 'BILLING',
        seatedAt: '17:40 PM',
        server: 'David K.',
        ticketNo: '8818',
        orderItems: [
          { name: 'Signature Wagyu Burger', qty: 2, price: 2400.00 },
          { name: 'Diet Cola', qty: 2, price: 300.00 }
        ]
      },
      {
        id: 'T-10',
        name: 'T-10',
        status: 'Occupied',
        guests: 6,
        capacity: 6,
        timeTag: '1.2 HRS',
        seatedAt: '17:12 PM',
        server: 'Marcus S.',
        ticketNo: '8801',
        orderItems: [
          { name: 'Signature Wagyu Burger', qty: 4, price: 2400.00 },
          { name: 'Caesar Salad', qty: 2, price: 1425.00 },
          { name: 'Craft Lemonade', qty: 6, price: 600.00 }
        ]
      },
      {
        id: 'T-11',
        name: 'T-11',
        status: 'Available',
        guests: 0,
        capacity: 2,
        timeTag: null,
        seatedAt: '',
        server: '',
        ticketNo: '',
        orderItems: []
      },
      {
        id: 'T-12',
        name: 'T-12',
        status: 'Occupied',
        guests: 4,
        capacity: 4,
        timeTag: '55 MINS',
        seatedAt: '17:47 PM',
        server: 'Marcus S.',
        ticketNo: '8810',
        orderItems: [
          { name: 'Truffle Fries (Large)', qty: 2, price: 1250.00 },
          { name: 'Diet Cola', qty: 4, price: 300.00 }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('zangmo_tables', JSON.stringify(tables));
  }, [tables]);

  const [selectedTableId, setSelectedTableId] = useState('T-06');
  const [toastMessage, setToastMessage] = useState('');
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Order Items Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [tempOrderItems, setTempOrderItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Add Table states
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState(4);



  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const selectedTable = tables.find(t => t.id === selectedTableId);

  // Initialize temp cart items when modal opens
  const openOrderModal = () => {
    if (!selectedTable) return;
    setTempOrderItems(selectedTable.orderItems.map(item => ({ ...item })));
    setSelectedCategory('All');
    setIsOrderModalOpen(true);
  };

  // Add Item to Temporary Cart
  const handleAddTempItem = (menuItem) => {
    const exists = tempOrderItems.find(item => item.name === menuItem.name);
    if (exists) {
      setTempOrderItems(tempOrderItems.map(item => 
        item.name === menuItem.name ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setTempOrderItems([...tempOrderItems, { name: menuItem.name, qty: 1, price: menuItem.price }]);
    }
  };

  // Change Temporary Item quantity
  const handleTempQtyChange = (itemName, amount) => {
    setTempOrderItems(tempOrderItems.map(item => {
      if (item.name === itemName) {
        const newQty = item.qty + amount;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  // Save changes from Temporary Cart to Table State
  const handleSaveOrder = () => {
    if (!selectedTable) return;

    setTables(tables.map(t => {
      if (t.id === selectedTableId) {
        const hasItems = tempOrderItems.length > 0;
        let newStatus = t.status;
        let newSeatedAt = t.seatedAt;
        let newServer = t.server;
        let newTicketNo = t.ticketNo;
        let newGuests = t.guests;

        // Auto transition table states
        if (hasItems && t.status === 'Available') {
          newStatus = 'Occupied';
          newSeatedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' PM';
          newServer = 'David K.';
          newTicketNo = Math.floor(8800 + Math.random() * 100).toString();
          if (newGuests === 0) newGuests = 2; // Default to 2 guests if seated
        } else if (!hasItems && t.status === 'Occupied') {
          newStatus = 'Available';
          newSeatedAt = '';
          newServer = '';
          newTicketNo = '';
          newGuests = 0;
        }

        return {
          ...t,
          orderItems: tempOrderItems,
          status: newStatus,
          seatedAt: newSeatedAt,
          server: newServer,
          ticketNo: newTicketNo,
          guests: newGuests
        };
      }
      return t;
    }));

    setIsOrderModalOpen(false);
    triggerToast(`Order items updated for Table #${selectedTable.name.replace('T-', '')}!`);
  };

  // Dynamic calculations for stats
  const occupiedCount = tables.filter(t => t.status === 'Occupied').length;
  const billedCount = tables.filter(t => t.status === 'Billed').length;
  const totalOccupancyPercent = Math.round(((occupiedCount + billedCount) / tables.length) * 100);
  const activeTablesCount = occupiedCount + billedCount;

  // Helper to compute order details total
  const orderTotal = selectedTable
    ? selectedTable.orderItems.reduce((acc, item) => acc + (item.qty * item.price), 0)
    : 0;

  const orderItemsCount = selectedTable
    ? selectedTable.orderItems.reduce((acc, item) => acc + item.qty, 0)
    : 0;

  // Actions
  const handleGuestCountChange = (amount) => {
    if (!selectedTable) return;
    const currentGuests = selectedTable.guests;
    const newGuests = Math.max(0, currentGuests + amount);

    setTables(tables.map(t => {
      if (t.id === selectedTableId) {
        return {
          ...t,
          guests: newGuests,
          // Auto switch to available if guest count is 0
          status: newGuests === 0 && t.status === 'Occupied' ? 'Available' : t.status
        };
      }
      return t;
    }));
  };

  const verifyPrinterConnection = async () => {
    if (window.electronAPI) {
      try {
        const printers = await window.electronAPI.getPrinters();
        return printers.length > 0;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
    return true; 
  };

  const handleBillTable = () => {
    if (!selectedTable) return;
    if (selectedTable.orderItems.length === 0) {
      triggerToast("Error: Cannot bill an empty order.");
      return;
    }
    setIsReceiptModalOpen(true);
  };

  const handleFinalizePrintTable = async () => {
    if (!selectedTable) return;

    // Set table state to Billed
    setTables(tables.map(t => {
      if (t.id === selectedTableId) {
        return {
          ...t,
          status: 'Billed',
          timeTag: 'BILLING'
        };
      }
      return t;
    }));

    setIsReceiptModalOpen(false);
    triggerToast("Verifying printer connection...");
    
    const isConnected = await verifyPrinterConnection();

    if (isConnected) {
      if (window.electronAPI) {
        const subtotal = orderTotal;
        const taxRate = 0.08;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;
        const ticketNo = selectedTable.ticketNo || Math.floor(4000 + Math.random() * 500).toString();

        const htmlContent = `
          <div class="receipt-paper-header" style="text-align: center;">
            <h2 style="font-size: 16px; margin: 0 0 2px 0;">Z&M KITCHEN</h2>
            <p class="branch-meta" style="font-size: 10px; margin: 0 0 4px 0; color: #555;">Downtown Branch - Floor POS</p>
            <p class="date-meta" style="font-size: 10px; margin: 0 0 4px 0; color: #555;">Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p class="ticket-meta" style="font-size: 11px; margin: 0 0 10px 0; font-weight: bold;">Table: #${selectedTable.name.replace('T-', '')} — Order: #${ticketNo}</p>
          </div>

          <div class="divider" style="border-top: 1px dashed #000; margin: 5px 0;"></div>

          <div class="receipt-items-table" style="width: 100%;">
            ${selectedTable.orderItems.map(item => `
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
            printerName: '',
            htmlContent: htmlContent
          });
          if (result.success) {
            triggerToast(`Receipt for Table #${selectedTable.name.replace('T-', '')} printed successfully!`);
          } else {
            triggerToast(`Print failed: ${result.error || 'unknown error'}`);
          }
        } catch (err) {
          console.error(err);
          triggerToast("Failed to print receipt: API Error");
        }
      } else {
        const subtotal = orderTotal;
        const taxRate = 0.08;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;
        const printWindow = window.open('', '_blank', 'width=400,height=600');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Z&M Kitchen - Receipt Table #${selectedTable.name.replace('T-', '')}</title>
                <style>
                  body { font-family: 'Courier New', Courier, monospace; padding: 20px; color: #000; background: #fff; }
                  .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 15px; }
                  .header h2 { margin: 0; font-size: 20px; }
                  .header p { margin: 3px 0; font-size: 11px; }
                  .item-row { display: flex; justify-content: space-between; font-size: 12px; margin: 4px 0; }
                  .divider { border-top: 1px dashed #000; margin: 12px 0; }
                  .total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; }
                  .footer { text-align: center; margin-top: 25px; font-size: 11px; }
                </style>
              </head>
              <body>
                <div class="header">
                  <h2>Z&M KITCHEN</h2>
                  <p>Downtown Branch - Floor POS</p>
                  <p>TABLE: #${selectedTable.name.replace('T-', '')}</p>
                  <p>DATE: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div>
                  ${selectedTable.orderItems.map(item => `
                    <div class="item-row">
                      <span>${item.qty}x ${item.name}</span>
                      <span>${formatPKR(item.qty * item.price)}</span>
                    </div>
                  `).join('')}
                </div>
                <div class="divider"></div>
                <div class="total-row">
                  <span>TOTAL DUE</span>
                  <span>${formatPKR(total)}</span>
                </div>
                <div class="footer">
                  <p>Thank you for dining with us!</p>
                  <p>Powered by Zangmo POS</p>
                </div>
                <script>
                  window.onload = function() {
                    window.print();
                    window.close();
                  }
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
        } else {
          triggerToast("Browser print block: Please allow popups for printing preview.");
        }
      }
    } else {
      triggerToast("printer is not connected error: No receipt printer connected to POS node.");
    }
  };

  const handleSettleTable = () => {
    if (!selectedTable) return;
    setTables(tables.map(t => {
      if (t.id === selectedTableId) {
        return {
          ...t,
          status: 'Available',
          guests: 0,
          timeTag: null,
          seatedAt: '',
          server: '',
          ticketNo: '',
          orderItems: []
        };
      }
      return t;
    }));
    triggerToast(`Table #${selectedTable.name.replace('T-', '')} settled and marked available!`);
  };

  const handleOpenPOS = () => {
    if (!selectedTable) return;
    triggerToast(`Redirecting to POS Terminal for Table #${selectedTable.name.replace('T-', '')}...`);
    setTimeout(() => {
      navigate('/pos', { state: { tableId: selectedTable.id, tableName: selectedTable.name } });
    }, 800);
  };

  // Add Table function
  const handleAddTable = (name, capacity) => {
    const formattedName = name.trim().toUpperCase();
    if (tables.some(t => t.name.toUpperCase() === formattedName)) {
      triggerToast(`Error: Table ${formattedName} already exists.`);
      return;
    }
    
    const newTable = {
      id: formattedName,
      name: formattedName,
      status: 'Available',
      guests: 0,
      capacity: parseInt(capacity) || 4,
      timeTag: null,
      seatedAt: '',
      server: '',
      ticketNo: '',
      orderItems: []
    };

    setTables([...tables, newTable]);
    triggerToast(`Table ${formattedName} added successfully!`);
    setIsAddTableModalOpen(false);
  };

  // Remove Table function
  const handleRemoveTable = (tableId) => {
    const tableToRemove = tables.find(t => t.id === tableId);
    if (!tableToRemove) return;
    
    if (window.confirm(`Are you sure you want to permanently remove Table ${tableToRemove.name}?`)) {
      setTables(tables.filter(t => t.id !== tableId));
      setSelectedTableId(null);
      triggerToast(`Table ${tableToRemove.name} removed successfully.`);
    }
  };

  // Temporary cart computations
  const tempCartTotal = tempOrderItems.reduce((acc, item) => acc + (item.qty * item.price), 0);

  // Filtered menu items
  const filteredMenuItems = selectedCategory === 'All' 
    ? AVAILABLE_MENU_ITEMS 
    : AVAILABLE_MENU_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <div className="tables-container">
      <Sidebar activePage="tables" />

      <div className="tables-content">
        <Topbar title="Table Management" />

        {/* Body content */}
        <div className="tables-body">
          {/* Main Grid Area */}
          <div className="tables-grid-section">
            
            {/* Metrics cards row */}
            <div className="tables-metrics-row">
              <div className="tables-metric-card">
                <div className="tables-metric-icon">
                  <UsersIcon />
                </div>
                <div className="tables-metric-info">
                  <span className="tables-metric-label">Total Occupancy</span>
                  <span className="tables-metric-value">{totalOccupancyPercent}%</span>
                </div>
              </div>

              <div className="tables-metric-card">
                <div className="tables-metric-icon">
                  <ClockIcon />
                </div>
                <div className="tables-metric-info">
                  <span className="tables-metric-label">Avg. Dining Time</span>
                  <span className="tables-metric-value">42m</span>
                </div>
              </div>

              <div className="tables-metric-card">
                <div className="tables-metric-icon">
                  <TableIcon />
                </div>
                <div className="tables-metric-info">
                  <span className="tables-metric-label">Tables Active</span>
                  <span className="tables-metric-value">{activeTablesCount}/{tables.length}</span>
                </div>
              </div>
            </div>

            {/* Floor Map Layout Control Panel */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#475569', letterSpacing: '0.5px' }}>FLOOR LAYOUT MAP</div>
              <button 
                className="btn-create-item" 
                onClick={() => {
                  setNewTableName(`T-${String(tables.length + 1).padStart(2, '0')}`);
                  setNewTableCapacity(4);
                  setIsAddTableModalOpen(true);
                }}
                style={{ 
                  height: '32px', 
                  padding: '0 12px', 
                  fontSize: '12px', 
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '700'
                }}
              >
                <PlusIcon /> Add New Table
              </button>
            </div>

            {/* Floor Map Layout */}
            <div className="tables-floor-card">
              <div className="tables-grid">
                {tables.map(t => {
                  const isSelected = t.id === selectedTableId;
                  const statusClass = t.status.toLowerCase();
                  
                  return (
                    <div 
                      key={t.id} 
                      className={`table-card-wrapper ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedTableId(t.id)}
                    >
                      <div className={`table-card ${statusClass}`}>
                        {t.timeTag && (
                          <div className={`table-time-tag ${statusClass}`}>
                            {t.timeTag}
                          </div>
                        )}
                        <span className="table-card-title">{t.name}</span>
                        <span className="table-card-subtitle">
                          {t.status === 'Available' ? `${t.capacity} Seater` : 
                           t.status === 'Billed' ? 'Settling' : 
                           t.status === 'Reserved' ? t.timeTag || 'Reserved' :
                           `${t.guests} Guests`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status Legend */}
              <div className="tables-legend">
                <div className="legend-item">
                  <div className="legend-dot available" />
                  <span>Available</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot occupied" />
                  <span>Occupied</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot billed" />
                  <span>Billed</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot reserved" />
                  <span>Reserved</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right side Detail Drawer */}
          {selectedTable && (
            <div className="tables-detail-panel">
              <div className="tables-detail-header">
                <div className="tables-detail-title-block">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ margin: 0 }}>Table #{selectedTable.name.replace('T-', '')}</h3>
                    <button 
                      onClick={() => handleRemoveTable(selectedTable.id)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#ef4444', 
                        cursor: 'pointer', 
                        padding: '4px', 
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s'
                      }}
                      title="Remove Table"
                      onMouseOver={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                  <span className={`tables-status-badge ${selectedTable.status.toLowerCase()}`}>
                    {selectedTable.status.toUpperCase()}
                  </span>
                </div>
                <button className="btn-close-panel" onClick={() => setSelectedTableId(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  <XIcon />
                </button>
              </div>

              <div className="tables-detail-content">
                {/* Guest counter */}
                <div className="panel-row">
                  <label>Guest Count</label>
                  <div className="guest-counter">
                    <button className="btn-counter" onClick={() => handleGuestCountChange(-1)}>-</button>
                    <div className="counter-value">{selectedTable.guests}</div>
                    <button className="btn-counter" onClick={() => handleGuestCountChange(1)}>+</button>
                  </div>
                </div>

                {/* Info details */}
                <div className="panel-row">
                  <label>Seated At</label>
                  <span>{selectedTable.seatedAt || 'N/A'}</span>
                </div>

                <div className="panel-row">
                  <label>Server</label>
                  <span>{selectedTable.server || 'Unassigned'}</span>
                </div>

                {/* Current Order box */}
                <div className="current-order-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>Current Order</h4>
                    <button 
                      className="link-update-all" 
                      onClick={openOrderModal}
                      style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}
                    >
                      Manage Order
                    </button>
                  </div>
                  
                  {selectedTable.orderItems.slice(0, 3).map((item, idx) => (
                    <div className="order-item-row" key={idx}>
                      <span className="order-item-desc">{item.qty}x {item.name}</span>
                      <span className="order-item-price">{formatPKR(item.qty * item.price)}</span>
                    </div>
                  ))}

                  {selectedTable.orderItems.length > 3 && (
                    <div className="order-item-more" onClick={openOrderModal}>
                      <span>... and {selectedTable.orderItems.length - 3} other items</span>
                      <EyeIcon />
                    </div>
                  )}

                  {selectedTable.orderItems.length === 0 && (
                    <div style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', padding: '12px 0' }}>
                      No items ordered yet.
                    </div>
                  )}
                </div>

                {/* Total box */}
                {selectedTable.orderItems.length > 0 && (
                  <div className="order-total-section">
                    <div className="total-amount-block">
                      <label>Total Amount</label>
                      <span>{formatPKR(orderTotal)}</span>
                    </div>
                    <span className="total-items-badge">{orderItemsCount} Items</span>
                  </div>
                )}

                {/* Last ticket card */}
                {selectedTable.ticketNo && (
                  <div className="ticket-info-card">
                    <div className="ticket-info-icon">
                      <PrinterIcon />
                    </div>
                    <div className="ticket-info-body">
                      <span className="ticket-info-title">Last Ticket: #{selectedTable.ticketNo}</span>
                      <span className="ticket-info-desc">Order sent to Kitchen. All items served.</span>
                    </div>
                  </div>
                )}

                {/* Bottom actions */}
                <div className="tables-panel-actions">
                  <button className="btn-open-pos" onClick={handleOpenPOS}>
                    <ExternalIcon /> OPEN POS
                  </button>
                  <div className="tables-action-row">
                    <button className="btn-action-bill" onClick={handleBillTable}>
                      <PrinterIcon /> BILL
                    </button>
                    <button className="btn-action-settle" onClick={handleSettleTable}>
                      <CheckIcon /> SETTLE
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {!selectedTable && (
            <div style={{ width: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px', background: 'white', borderLeft: '1px solid #e2e8f0' }}>
              Select a table from the floor map to view details.
            </div>
          )}
        </div>
      </div>

      {/* Manage Order Items Modal */}
      {isOrderModalOpen && selectedTable && (
        <div className="order-modal-overlay" onClick={() => setIsOrderModalOpen(false)}>
          <div className="order-modal" onClick={e => e.stopPropagation()}>
            <div className="order-modal-header">
              <h3>Manage Guest Order — Table #{selectedTable.name.replace('T-', '')}</h3>
              <button className="order-modal-close" onClick={() => setIsOrderModalOpen(false)}>
                <XIcon />
              </button>
            </div>

            <div className="order-modal-body">
              {/* Left Column: Menu items list */}
              <div className="order-menu-section">
                <div className="menu-tabs">
                  {['All', 'Mains', 'Sides', 'Desserts', 'Drinks'].map(cat => (
                    <button 
                      key={cat} 
                      className={`menu-tab ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="menu-items-grid">
                  {filteredMenuItems.map((item, idx) => (
                    <div className="menu-item-card" key={idx}>
                      <div className="menu-item-info">
                        <span className="menu-item-name">{item.name}</span>
                        <span className="menu-item-price">{formatPKR(item.price)}</span>
                      </div>
                      <button className="btn-add-menu" onClick={() => handleAddTempItem(item)}>
                        <PlusIcon /> Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Cart preview */}
              <div className="order-cart-section">
                <h4>Selected Items</h4>
                <div className="cart-items-list">
                  {tempOrderItems.map((item, idx) => (
                    <div className="cart-item-row" key={idx}>
                      <div className="cart-item-name-col">
                        <span className="cart-item-title">{item.name}</span>
                        <span className="cart-item-subtotal">{formatPKR(item.qty * item.price)}</span>
                      </div>
                      
                      <div className="cart-item-actions">
                        <div className="guest-counter" style={{ border: '1px solid #cbd5e1' }}>
                          <button className="btn-counter" onClick={() => handleTempQtyChange(item.name, -1)}>-</button>
                          <div className="counter-value">{item.qty}</div>
                          <button className="btn-counter" onClick={() => handleTempQtyChange(item.name, 1)}>+</button>
                        </div>
                        <button className="btn-cart-remove" onClick={() => handleTempQtyChange(item.name, -item.qty)}>
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  ))}

                  {tempOrderItems.length === 0 && (
                    <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', marginTop: '40px' }}>
                      Cart is empty. Select items from the menu.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="order-modal-footer">
              <div className="order-modal-total">
                <label>Estimated Total</label>
                <span>{formatPKR(tempCartTotal)}</span>
              </div>
              <div className="order-modal-buttons">
                <button className="btn-modal-cancel" onClick={() => setIsOrderModalOpen(false)}>Cancel</button>
                <button className="btn-modal-save" onClick={handleSaveOrder}>Save Order Items</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {isAddTableModalOpen && (
        <div className="order-modal-overlay" onClick={() => setIsAddTableModalOpen(false)}>
          <div className="order-modal" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="order-modal-header">
              <h3>Add New Table</h3>
              <button className="order-modal-close" onClick={() => setIsAddTableModalOpen(false)}>
                <XIcon />
              </button>
            </div>
            
            <div className="order-modal-body" style={{ flexDirection: 'column', gap: '16px', padding: '24px' }}>
              <div className="form-group" style={{ width: '100%' }}>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '6px', display: 'block' }}>TABLE NAME / NUMBER</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={newTableName} 
                  onChange={e => setNewTableName(e.target.value)} 
                  placeholder="e.g. T-13" 
                  style={{ width: '100%', height: '40px', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0 12px' }}
                />
              </div>

              <div className="form-group" style={{ width: '100%' }}>
                <label className="form-label" style={{ fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '6px', display: 'block' }}>CAPACITY (SEATS)</label>
                <select 
                  className="input-field" 
                  value={newTableCapacity} 
                  onChange={e => setNewTableCapacity(parseInt(e.target.value))}
                  style={{ width: '100%', height: '40px', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0 12px', background: 'white' }}
                >
                  <option value={2}>2 Seater</option>
                  <option value={4}>4 Seater</option>
                  <option value={6}>6 Seater</option>
                  <option value={8}>8 Seater</option>
                  <option value={10}>10 Seater</option>
                </select>
              </div>
            </div>

            <div className="order-modal-footer">
              <button className="btn-modal-cancel" onClick={() => setIsAddTableModalOpen(false)}>Cancel</button>
              <button 
                className="btn-modal-save" 
                onClick={() => {
                  if (!newTableName.trim()) {
                    triggerToast("Please enter a table name.");
                    return;
                  }
                  handleAddTable(newTableName, newTableCapacity);
                }}
              >
                Add Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courier printed thermal receipt overlay modal dialog */}
      {isReceiptModalOpen && selectedTable && (
        <div className="order-modal-overlay" style={{ background: 'rgba(0,0,0,0.65)', zIndex: 1000 }}>
          <div className="thermal-receipt-modal" onClick={e => e.stopPropagation()}>
            <button className="close-receipt-btn" onClick={() => setIsReceiptModalOpen(false)}>
              <XIcon />
            </button>

            <div className="receipt-paper-content">
              <div className="receipt-paper-header">
                <h2>Z&M KITCHEN</h2>
                <p className="branch-meta">Downtown Branch - Floor POS</p>
                <p className="date-meta">Date: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="ticket-meta">Table: #{selectedTable.name.replace('T-', '')} {selectedTable.ticketNo ? `— Order: #${selectedTable.ticketNo}` : ''}</p>
              </div>

              <div className="receipt-items-dashed-divider" />

              <div className="receipt-items-table">
                {selectedTable.orderItems.map((item, idx) => (
                  <div className="receipt-item-line" key={idx}>
                    <span className="qty-name">{item.qty}x {item.name}</span>
                    <span className="price">{formatPKR(item.qty * item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="receipt-items-dashed-divider" />

              <div className="receipt-pricing-block">
                <div className="receipt-price-row">
                  <span>Subtotal</span>
                  <span>{formatPKR(orderTotal)}</span>
                </div>
                <div className="receipt-price-row">
                  <span>Tax (8%)</span>
                  <span>{formatPKR(orderTotal * 0.08)}</span>
                </div>
                <div className="receipt-price-row total">
                  <span>TOTAL DUE</span>
                  <span>{formatPKR(orderTotal * 1.08)}</span>
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

            <button className="btn-finalize-and-print-receipt" onClick={handleFinalizePrintTable}>
              FINALIZE & PRINT
            </button>
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
