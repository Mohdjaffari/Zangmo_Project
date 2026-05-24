import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../assets/styles/users.css';
import '../assets/styles/events.css';

// SVG Icons
const ChevronLeft = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevronRight = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>;
const PlusIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const WalletIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/></svg>;
const CheckCircleIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const ForkKnifeIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 2v20M21 15V2a5 5 0 00-5 5v6a2 2 0 002 2h3zm0 0v7M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20"/></svg>;
const RefreshIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 8a10 10 0 10-3.6 7.85"/></svg>;
const XIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const ArrowLeftIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const CheckIcon = () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const formatDateKey = (dateObj) => {
  if (!dateObj) return '';
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export default function Events() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today); // Initialize selectedDate to today
  const [viewMode, setViewMode] = useState('Month'); // Month | Week | Day
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  // Event filters state
  const [filters, setFilters] = useState({
    Wedding: true,
    Corporate: true,
    Birthday: true,
    "Private Dining": true
  });

  // Modal & Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // null means Add, otherwise event object
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(formatDateKey(today));
  const [eventTime, setEventTime] = useState('12:00 PM');
  const [status, setStatus] = useState('Confirmed');
  const [type, setType] = useState('Corporate');
  const [guests, setGuests] = useState(10);
  const [serviceType, setServiceType] = useState('Buffet Setup');
  const [price, setPrice] = useState(1500);
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState('Standard');
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' | 'builder'
  
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('zangmo_default_currency') || 'Rs.';
  });

  useEffect(() => {
    const handleStorage = () => {
      setCurrency(localStorage.getItem('zangmo_default_currency') || 'Rs.');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const [paymentOption, setPaymentOption] = useState('full'); // full | half | advance
  const [customAdvancePercent, setCustomAdvancePercent] = useState(25);
  const [depositPaid, setDepositPaid] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);
  
  // Package Builder States
  const [selectedBuilderPackage, setSelectedBuilderPackage] = useState('Economy');
  const [builderCategory, setBuilderCategory] = useState('All Items');
  const [builderSearch, setBuilderSearch] = useState('');
  const [builderHeadcount, setBuilderHeadcount] = useState(150);
  const [builderDiscount, setBuilderDiscount] = useState(5);
  const [builderServiceFee, setBuilderServiceFee] = useState(45000);

  const MENU_ITEMS = [
    {
      id: 1,
      name: "Signature Slider Trio",
      category: "Appetizers",
      price: 450,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80",
      description: "Beef, Chicken, and Falafel sliders with house slaw."
    },
    {
      id: 2,
      name: "Garden Harvest Bowl",
      category: "Appetizers",
      price: 320,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80",
      description: "Organic greens, roasted roots, and tahini drizzle."
    },
    {
      id: 3,
      name: "Herb-Crusted Lamb",
      category: "Main Course",
      price: 875,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80",
      description: "Australian lamb with mint salsa verde and roasted..."
    },
    {
      id: 4,
      name: "Petite Dessert Duo",
      category: "Desserts",
      price: 250,
      image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&auto=format&fit=crop&q=80",
      description: "Dark chocolate truffle and seasonal macaron."
    },
    {
      id: 5,
      name: "Artisan Bread Rolls",
      category: "Appetizers",
      price: 110,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80",
      description: "Warm, freshly baked sourdough rolls with salted butter."
    },
    {
      id: 6,
      name: "Seasonal Fruit Platter",
      category: "Desserts",
      price: 180,
      image: "https://images.unsplash.com/photo-1519996521430-02b798c1d881?w=400&auto=format&fit=crop&q=80",
      description: "Fresh sliced melons, berries, and mint garnish."
    },
    {
      id: 7,
      name: "Craft Soda Selection",
      category: "Beverages",
      price: 150,
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80",
      description: "Artisanal sodas made with natural cane sugar."
    },
    {
      id: 8,
      name: "Premium Coffee & Tea",
      category: "Beverages",
      price: 220,
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop&q=80",
      description: "Single-origin pour overs and organic herbal teas."
    }
  ];

  const [builderDrafts, setBuilderDrafts] = useState(() => {
    const saved = localStorage.getItem('zangmo_package_drafts');
    if (saved) return JSON.parse(saved);
    return {
      Economy: [
        { id: 1, name: 'Signature Slider Trio', category: 'Appetizers', price: 450, unitsPerPerson: 1.5 },
        { id: 2, name: 'Garden Harvest Bowl', category: 'Appetizers', price: 320, unitsPerPerson: 1.0 },
        { id: 5, name: 'Artisan Bread Rolls', category: 'Appetizers', price: 110, unitsPerPerson: 2.0 },
      ],
      Standard: [
        { id: 1, name: 'Signature Slider Trio', category: 'Appetizers', price: 450, unitsPerPerson: 1.5 },
        { id: 2, name: 'Garden Harvest Bowl', category: 'Appetizers', price: 320, unitsPerPerson: 1.0 },
        { id: 3, name: 'Herb-Crusted Lamb', category: 'Main Course', price: 875, unitsPerPerson: 1.0 },
      ],
      Premium: [
        { id: 1, name: 'Signature Slider Trio', category: 'Appetizers', price: 450, unitsPerPerson: 1.5 },
        { id: 2, name: 'Garden Harvest Bowl', category: 'Appetizers', price: 320, unitsPerPerson: 1.0 },
        { id: 3, name: 'Herb-Crusted Lamb', category: 'Main Course', price: 875, unitsPerPerson: 1.0 },
        { id: 4, name: 'Petite Dessert Duo', category: 'Desserts', price: 250, unitsPerPerson: 1.0 },
      ]
    };
  });

  // Events list state
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('zangmo_events');
    const parsed = saved ? JSON.parse(saved) : null;
    
    const curYear = today.getFullYear();
    const curMonth = String(today.getMonth() + 1).padStart(2, '0');
    const prefix = `${curYear}-${curMonth}`;

    if (parsed && parsed.length > 0) {
      // If the saved events are from October 2024, migrate them to the current month
      const hasOnly2024 = parsed.every(e => typeof e.date === 'string' && e.date.startsWith('2024-10'));
      if (hasOnly2024) {
        return parsed.map(evt => ({
          ...evt,
          date: evt.date.replace('2024-10', prefix)
        }));
      }
      return parsed;
    }

    return [
      {
        id: 1,
        title: "Baron Birthday Dinner",
        date: `${prefix}-02`,
        time: "07:00 PM",
        status: "Completed",
        type: "Birthday",
        guests: 12,
        serviceType: "Custom Menu",
        price: 950.00
      },
      {
        id: 2,
        title: "Corporate Lunch",
        date: `${prefix}-02`,
        time: "12:30 PM",
        status: "Completed",
        type: "Corporate",
        guests: 45,
        serviceType: "Buffet Setup",
        price: 1800.00
      },
      {
        id: 3,
        title: "Wedding Reception",
        date: `${prefix}-04`,
        time: "06:00 PM",
        status: "Confirmed",
        type: "Wedding",
        guests: 120,
        serviceType: "Full Service",
        price: 4250.00
      },
      {
        id: 4,
        title: "Birthday Party",
        date: `${prefix}-08`,
        time: "03:00 PM",
        status: "Pending Payment",
        type: "Birthday",
        guests: 25,
        serviceType: "Custom Menu",
        price: 950.00
      },
      {
        id: 5,
        title: "Chef's Table",
        date: `${prefix}-08`,
        time: "07:30 PM",
        status: "Confirmed",
        type: "Private Dining",
        guests: 10,
        serviceType: "Degustation",
        price: 1500.00
      },
      {
        id: 6,
        title: "Smith Wedding Gala",
        date: `${prefix}-11`,
        time: "05:00 PM",
        status: "Confirmed",
        type: "Wedding",
        guests: 120,
        serviceType: "Full Service",
        price: 4250.00
      },
      {
        id: 7,
        title: "Product Launch",
        date: `${prefix}-12`,
        time: "10:00 AM",
        status: "Completed",
        type: "Corporate",
        guests: 80,
        serviceType: "Cocktail Service",
        price: 3200.00
      },
      {
        id: 8,
        title: "TechCorp Annual Lunch",
        date: `${prefix}-15`,
        time: "12:00 PM",
        status: "Pending Payment",
        type: "Corporate",
        guests: 45,
        serviceType: "Buffet Setup",
        price: 1800.00
      },
      {
        id: 9,
        title: "Annual Gala",
        date: `${prefix}-17`,
        time: "07:00 PM",
        status: "Confirmed",
        type: "Corporate",
        guests: 150,
        serviceType: "Plated Dinner",
        price: 6500.00
      },
      {
        id: 10,
        title: "Private Tasting",
        date: `${prefix}-23`,
        time: "05:00 PM",
        status: "Pending Payment",
        type: "Private Dining",
        guests: 8,
        serviceType: "Wine Pairing",
        price: 1200.00
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('zangmo_events', JSON.stringify(events));
  }, [events]);

  // Generate calendar days
  const calendarDays = React.useMemo(() => {
    const date = new Date(currentYear, currentMonth, 1);
    const days = [];
    const startDay = date.getDay();

    // Previous month padding
    const prevMonthDate = new Date(currentYear, currentMonth, 0);
    const prevMonthDaysCount = prevMonthDate.getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, prevMonthDaysCount - i),
        isCurrentMonth: false
      });
    }

    // Current month
    const currentMonthDaysCount = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 1; i <= currentMonthDaysCount; i++) {
      days.push({
        date: new Date(currentYear, currentMonth, i),
        isCurrentMonth: true
      });
    }

    // Next month padding
    const totalCells = days.length > 35 ? 42 : 35;
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: new Date(currentYear, currentMonth + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
  }, [currentMonth, currentYear]);

  // Filter handlers
  const toggleFilter = (type) => {
    setFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const getEventsForDate = (dateObj) => {
    const key = formatDateKey(dateObj);
    return events.filter(e => e.date === key && filters[e.type]);
  };

  // Navigations
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(today);
  };

  // Helper to format values dynamically
  const getPackagePriceVal = (pkgName, curSymbol) => {
    if (curSymbol === '$') {
      return pkgName === 'Economy' ? 45 : pkgName === 'Standard' ? 75 : pkgName === 'Premium' ? 110 : 0;
    } else {
      return pkgName === 'Economy' ? 1850 : pkgName === 'Standard' ? 3200 : pkgName === 'Premium' ? 4800 : 0;
    }
  };

  const formatCurrencyVal = (amount, curSymbol) => {
    return `${curSymbol} ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getEventPaymentInfo = (evt) => {
    const isCompleted = evt.status === 'Completed';
    const paid = evt.paidAmount !== undefined ? evt.paidAmount : (isCompleted ? evt.price : 0);
    const balance = evt.balance !== undefined ? evt.balance : (isCompleted ? 0 : evt.price);
    
    let statusText = evt.status;
    if (paid > 0 && paid < evt.price) {
      statusText = 'Partially Paid';
    } else if (paid === evt.price) {
      statusText = 'Completed';
    } else if (paid === 0) {
      statusText = 'Unpaid';
    }
    
    return { paid, balance, statusText };
  };

  // Modal functions
  const openAddModal = (dateObj = null) => {
    setEditingEvent(null);
    setTitle('');
    setEventDate(dateObj ? formatDateKey(dateObj) : formatDateKey(new Date()));
    setEventTime('06:00 PM');
    setStatus('Confirmed');
    setType('Corporate');
    setGuests(100);
    setSelectedPackage('Standard');
    setServiceType('Executive Banquet');
    setPrice(100 * getPackagePriceVal('Standard', currency));
    setStep(1);
    setPaymentOption('full');
    setCustomAdvancePercent(25);
    setDepositPaid(false);
    setPaidAmount(0);
    setIsModalOpen(true);
  };

  const openEditModal = (eventObj) => {
    setEditingEvent(eventObj);
    setTitle(eventObj.title);
    setEventDate(eventObj.date);
    setEventTime(eventObj.time);
    setStatus(eventObj.status);
    setType(eventObj.type);
    setGuests(eventObj.guests);
    setServiceType(eventObj.serviceType);
    setPrice(eventObj.price);
    
    // Payment details loading
    setPaymentOption(eventObj.paymentOption || 'full');
    setCustomAdvancePercent(eventObj.customAdvancePercent || 25);
    setDepositPaid(eventObj.depositPaid || (eventObj.status === 'Completed' || (eventObj.paidAmount && eventObj.paidAmount > 0)));
    setPaidAmount(eventObj.paidAmount !== undefined ? eventObj.paidAmount : (eventObj.status === 'Completed' ? eventObj.price : 0));
    
    // Guess the package based on unit price
    const perPerson = eventObj.guests > 0 ? Math.round(eventObj.price / eventObj.guests) : 0;
    const economyPrice = getPackagePriceVal('Economy', currency);
    const standardPrice = getPackagePriceVal('Standard', currency);
    const premiumPrice = getPackagePriceVal('Premium', currency);
    
    if (perPerson === economyPrice || perPerson === 45 || perPerson === 1850) {
      setSelectedPackage('Economy');
    } else if (perPerson === standardPrice || perPerson === 75 || perPerson === 3200) {
      setSelectedPackage('Standard');
    } else if (perPerson === premiumPrice || perPerson === 110 || perPerson === 4800) {
      setSelectedPackage('Premium');
    } else {
      setSelectedPackage('Custom');
    }
    
    setStep(1);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter an event title.', 'error');
      return;
    }

    let finalPaidAmount = 0;
    let finalStatus = status;

    if (paymentOption === 'full') {
      if (depositPaid) {
        finalPaidAmount = price;
        finalStatus = 'Completed';
      } else {
        finalPaidAmount = 0;
        finalStatus = 'Pending Payment';
      }
    } else {
      const calculatedDeposit = paymentOption === 'half' ? (price * 0.5) : (price * (customAdvancePercent / 100));
      if (depositPaid) {
        finalPaidAmount = calculatedDeposit;
        finalStatus = 'Confirmed';
      } else {
        finalPaidAmount = 0;
        finalStatus = 'Pending Payment';
      }
    }

    const eventPayload = {
      title,
      date: eventDate,
      time: eventTime,
      status: finalStatus,
      type,
      guests: parseInt(guests) || 0,
      serviceType,
      price: parseFloat(price) || 0,
      paymentOption,
      customAdvancePercent: parseInt(customAdvancePercent) || 0,
      depositPaid,
      paidAmount: finalPaidAmount,
      balance: (parseFloat(price) || 0) - finalPaidAmount
    };

    if (editingEvent) {
      const updated = events.map(evt => {
        if (evt.id === editingEvent.id) {
          return {
            ...evt,
            ...eventPayload
          };
        }
        return evt;
      });
      setEvents(updated);
      showToast('Event updated successfully.', 'success');
    } else {
      const newEvtObj = {
        id: Date.now(),
        ...eventPayload
      };
      setEvents([newEvtObj, ...events]);
      showToast('Event created successfully.', 'success');
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updated = events.filter(evt => evt.id !== id);
      setEvents(updated);
      setIsModalOpen(false);
    }
  };

  // Calculate capacity percentage dynamically
  const displayCapacity = React.useMemo(() => {
    // If a specific date is selected, calculate based on that date's guests
    const targetDateKey = selectedDate ? formatDateKey(selectedDate) : formatDateKey(new Date());
    const dayGuests = events
      .filter(e => e.date === targetDateKey && e.status !== 'Completed')
      .reduce((sum, e) => sum + e.guests, 0);
    
    if (dayGuests === 0) return 84; // Mock standard capacity if zero events on date
    const capVal = Math.min(Math.round((dayGuests / 150) * 100), 100);
    return capVal > 0 ? capVal : 84;
  }, [selectedDate, events]);

  // Get active filters events list
  const filteredEventsList = events
    .filter(e => filters[e.type])
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Determine badge styling classes
  const getBadgeClass = (statusStr) => {
    const lower = statusStr.toLowerCase();
    if (lower === 'confirmed') return 'badge-confirmed';
    if (lower === 'completed') return 'badge-completed';
    return 'badge-pending';
  };

  const getStatusClass = (statusStr) => {
    const lower = statusStr.toLowerCase();
    if (lower === 'confirmed') return 'status-confirmed';
    if (lower === 'completed') return 'status-completed';
    return 'status-pending';
  };

  const handleAddItemToDraft = (item) => {
    const activeList = builderDrafts[selectedBuilderPackage] || [];
    if (activeList.some(i => i.id === item.id)) {
      showToast(`${item.name} is already in the ${selectedBuilderPackage} Package.`, 'info');
      return;
    }
    const updated = {
      ...builderDrafts,
      [selectedBuilderPackage]: [
        ...activeList,
        { ...item, unitsPerPerson: 1.0 }
      ]
    };
    setBuilderDrafts(updated);
    localStorage.setItem('zangmo_package_drafts', JSON.stringify(updated));
    showToast(`Added ${item.name} to the ${selectedBuilderPackage} Package.`, 'success');
  };

  const handleRemoveItemFromDraft = (itemId) => {
    const activeList = builderDrafts[selectedBuilderPackage] || [];
    const item = activeList.find(i => i.id === itemId);
    const updated = {
      ...builderDrafts,
      [selectedBuilderPackage]: activeList.filter(i => i.id !== itemId)
    };
    setBuilderDrafts(updated);
    localStorage.setItem('zangmo_package_drafts', JSON.stringify(updated));
    if (item) {
      showToast(`Removed ${item.name} from the ${selectedBuilderPackage} Package.`, 'info');
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('zangmo_package_drafts', JSON.stringify(builderDrafts));
    showToast(`${selectedBuilderPackage} Package Draft saved successfully!`, 'success');
  };

  const handleExportQuote = () => {
    showToast(`Preparing PDF export for the ${selectedBuilderPackage} Package Quote...`, 'info');
    setTimeout(() => {
      window.print();
    }, 600);
  };

  // Cost and price calculation variables
  const currentDraftItems = builderDrafts[selectedBuilderPackage] || [];
  const ingredientCost = currentDraftItems.reduce((sum, item) => sum + (item.price * (item.unitsPerPerson || 1.0)), 0);
  const laborAllocation = ingredientCost * 0.15;
  const bulkDiscount = builderHeadcount > 100 ? (ingredientCost + laborAllocation) * (builderDiscount / 100) : 0;
  
  const baseSellingPrice = currency === '$' 
    ? (selectedBuilderPackage === 'Economy' ? 45 : selectedBuilderPackage === 'Standard' ? 75 : 110)
    : (selectedBuilderPackage === 'Economy' ? 1850 : selectedBuilderPackage === 'Standard' ? 3200 : 4800);
  const pricePerPerson = baseSellingPrice;
  const totalRevenue = pricePerPerson * builderHeadcount;
  
  const costFactorPerPerson = ingredientCost + laborAllocation - bulkDiscount + (builderServiceFee / builderHeadcount) * 0.4;
  const estMarginPercentage = Math.max(0, Math.round(((pricePerPerson - costFactorPerPerson) / pricePerPerson) * 100));

  return (
    <div className="events-container">
      {toast && (
        <div className={`custom-toast ${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' && (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {toast.type === 'info' && (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
          </div>
          <span className="toast-message">{toast.message}</span>
          <button type="button" className="toast-close" onClick={() => setToast(null)}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <Sidebar activePage="events" />

      <div className="events-content">
        <Topbar title={activeTab === 'calendar' ? "Events Calendar" : "Event Package Builder"} />

        {/* Navigation Tabs */}
        <div className="events-sub-tabs" style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: 'white', padding: '0 32px' }}>
          <button 
            type="button"
            className={`sub-tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
            style={{
              padding: '16px 24px',
              fontSize: '14px',
              fontWeight: '700',
              color: activeTab === 'calendar' ? '#843c0c' : '#64748b',
              border: 'none',
              borderBottom: activeTab === 'calendar' ? '3px solid #843c0c' : '3px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Events Calendar
          </button>
          <button 
            type="button"
            className={`sub-tab-btn ${activeTab === 'builder' ? 'active' : ''}`}
            onClick={() => setActiveTab('builder')}
            style={{
              padding: '16px 24px',
              fontSize: '14px',
              fontWeight: '700',
              color: activeTab === 'builder' ? '#843c0c' : '#64748b',
              border: 'none',
              borderBottom: activeTab === 'builder' ? '3px solid #843c0c' : '3px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Event Package Builder
          </button>
        </div>

        {activeTab === 'calendar' ? (
          <div className="events-body">
            {/* Main Calendar Grid Section */}
            <div className="calendar-section">
              <div className="calendar-header">
                <div className="month-title">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </div>

                <div className="calendar-controls">
                  <button className="btn-nav" onClick={handlePrevMonth} title="Previous Month">
                    <ChevronLeft />
                  </button>
                  <button className="btn-today" onClick={handleToday}>
                    Today
                  </button>
                  <button className="btn-nav" onClick={handleNextMonth} title="Next Month">
                    <ChevronRight />
                  </button>

                  <div className="toggle-group" style={{ marginLeft: '12px' }}>
                    <button 
                      className={`toggle-tab ${viewMode === 'Month' ? 'active' : ''}`}
                      onClick={() => setViewMode('Month')}
                    >
                      Month
                    </button>
                    <button 
                      className={`toggle-tab ${viewMode === 'Week' ? 'active' : ''}`}
                      onClick={() => setViewMode('Week')}
                    >
                      Week
                    </button>
                    <button 
                      className={`toggle-tab ${viewMode === 'Day' ? 'active' : ''}`}
                      onClick={() => setViewMode('Day')}
                    >
                      Day
                    </button>
                  </div>
                </div>

                <button className="btn-add-event" onClick={() => openAddModal(selectedDate)}>
                  <PlusIcon /> Add New Event
                </button>
              </div>

              {/* Grid Days Calendar */}
              <div className="calendar-grid">
                {/* Header Days of Week */}
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                  <div className="grid-header-cell" key={day}>{day}</div>
                ))}

                {/* Day cells */}
                {calendarDays.map((cell, idx) => {
                  const dayEvents = getEventsForDate(cell.date);
                  const isSelected = selectedDate && formatDateKey(cell.date) === formatDateKey(selectedDate);
                  const isToday = formatDateKey(cell.date) === formatDateKey(new Date());

                  return (
                    <div 
                      key={idx}
                      className={`grid-day-cell ${cell.isCurrentMonth ? '' : 'outside-month'} ${isToday ? 'today' : ''}`}
                      style={{
                        border: isSelected ? '2px solid #843c0c' : undefined,
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedDate(cell.date)}
                    >
                      <div className="day-number">{cell.date.getDate()}</div>
                      {dayEvents.map(evt => {
                        const { paid, statusText } = getEventPaymentInfo(evt);
                        let badgeClass = 'badge-pending';
                        if (paid === evt.price || evt.status === 'Completed') badgeClass = 'badge-completed';
                        else if (paid > 0 && paid < evt.price) badgeClass = 'badge-confirmed';

                        return (
                          <div 
                            key={evt.id}
                            className={`event-badge ${badgeClass}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(evt);
                            }}
                          >
                            <span className="badge-title">{evt.title}</span>
                            <span className="badge-time">{evt.time} • {statusText}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Color Legend Row */}
              <div className="legend-row">
                <div className="legend-item">
                  <span className="dot completed"></span> Paid in Full
                </div>
                <div className="legend-item">
                  <span className="dot confirmed"></span> Partially Paid
                </div>
                <div className="legend-item">
                  <span className="dot pending"></span> Unpaid / Pending
                </div>
              </div>
            </div>

            {/* Right Column: Event Filters & List */}
            <div className="filters-section">
              <div className="panel-card">
                <h3>Event Filters</h3>
                <div className="filter-group">
                  <span className="filter-label">EVENT TYPE</span>
                  {['Wedding', 'Corporate', 'Birthday', 'Private Dining'].map(type => (
                    <label className="checkbox-label" key={type}>
                      <input 
                        type="checkbox" 
                        checked={filters[type]} 
                        onChange={() => toggleFilter(type)} 
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className="panel-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3>
                  Upcoming Events 
                  <span className="badge-total">{filteredEventsList.length} Total</span>
                </h3>
                <div className="upcoming-list" style={{ flex: 1 }}>
                  {filteredEventsList.map(evt => {
                    const { paid, balance, statusText } = getEventPaymentInfo(evt);
                    const isFullyPaid = paid === evt.price || evt.status === 'Completed';
                    const isPartiallyPaid = paid > 0 && paid < evt.price;
                    
                    let statusBadgeClass = 'status-pending';
                    if (isFullyPaid) statusBadgeClass = 'status-completed';
                    else if (isPartiallyPaid) statusBadgeClass = 'status-confirmed';

                    return (
                      <div className="event-card" key={evt.id} onClick={() => openEditModal(evt)}>
                        <div className="card-header-row">
                          <span className={`card-status ${statusBadgeClass}`}>
                            {statusText}
                          </span>
                          <span className="card-date">
                            {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <h4>{evt.title}</h4>
                        <div className="details" style={{ marginBottom: '8px' }}>
                          {evt.guests} Guests • {evt.serviceType}
                        </div>
                        
                        {/* Detailed invoice metrics in card */}
                        <div className="card-payment-breakdown" style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '4px',
                          fontSize: '11px',
                          background: '#f1f5f9',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          marginBottom: '10px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b', fontWeight: '500' }}>Total Cost:</span>
                            <span style={{ fontWeight: '700', color: '#1e293b' }}>{formatCurrencyVal(evt.price, currency)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b', fontWeight: '500' }}>Paid:</span>
                            <span style={{ fontWeight: '700', color: isFullyPaid ? '#10b981' : isPartiallyPaid ? '#b45309' : '#dc2626' }}>
                              {formatCurrencyVal(paid, currency)}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '4px', marginTop: '2px' }}>
                            <span style={{ color: '#475569', fontWeight: '600' }}>Balance Due:</span>
                            <span style={{ fontWeight: '800', color: balance > 0 ? '#b45309' : '#475569' }}>
                              {formatCurrencyVal(balance, currency)}
                            </span>
                          </div>
                        </div>

                        <div className="card-pricing-row" style={{ border: 'none', paddingTop: 0 }}>
                          {isFullyPaid ? (
                            <span className="paid-badge">
                              <CheckCircleIcon /> Paid in Full
                            </span>
                          ) : (
                            <span className="price-text" style={{ fontSize: '11px', fontWeight: '600' }}>
                              <WalletIcon /> Balance: <span className="price-value" style={{ fontWeight: '800', color: '#b45309' }}>{formatCurrencyVal(balance, currency)}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {filteredEventsList.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', padding: '24px 0' }}>
                      No matching upcoming events.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="package-builder-wrapper">
            <div className="builder-content-row">
              {/* Left Column: Menu Items list */}
              <div className="builder-left-section">
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="builder-search-wrapper" style={{ flex: 1 }}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input 
                      type="text" 
                      className="builder-search-bar" 
                      placeholder="Search main menu items..." 
                      value={builderSearch}
                      onChange={(e) => setBuilderSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="builder-categories-tabs">
                  {['All Items', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'].map(cat => (
                    <button 
                      key={cat}
                      type="button" 
                      className={`builder-category-btn ${builderCategory === cat ? 'active' : ''}`}
                      onClick={() => setBuilderCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Menu items grid */}
                <div className="builder-menu-grid">
                  {MENU_ITEMS
                    .filter(item => {
                      if (builderCategory !== 'All Items' && item.category !== builderCategory) return false;
                      if (builderSearch.trim() !== '') {
                        return item.name.toLowerCase().includes(builderSearch.toLowerCase()) || 
                               item.description.toLowerCase().includes(builderSearch.toLowerCase());
                      }
                      return true;
                    })
                    .map(item => (
                      <div className="builder-menu-card" key={item.id}>
                        <div className="card-image-box">
                          <img src={item.image} alt={item.name} />
                          <span className="card-pp-badge">Rs. {item.price.toFixed(2)}/pp</span>
                        </div>
                        <div className="card-details-box">
                          <h4>{item.name}</h4>
                          <p>{item.description}</p>
                          <button 
                            type="button" 
                            className="card-add-package-btn"
                            onClick={() => handleAddItemToDraft(item)}
                          >
                            + Add to Package
                          </button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Right Column: Drafting Box */}
              <div className="builder-right-section">
                <div className="right-section-title-row">
                  <h3>{selectedBuilderPackage} Package</h3>
                  <span className="drafting-badge">Drafting</span>
                </div>

                {/* Package select tabs */}
                <div className="builder-package-tabs">
                  {['Economy', 'Standard', 'Premium'].map(pkg => (
                    <button 
                      key={pkg}
                      type="button" 
                      className={`builder-package-tab-btn ${selectedBuilderPackage === pkg ? 'active' : ''}`}
                      onClick={() => setSelectedBuilderPackage(pkg)}
                    >
                      {pkg}
                    </button>
                  ))}
                </div>

                {/* Selected Package Menu List */}
                <div className="draft-added-items-list">
                  {currentDraftItems.map(item => (
                    <div className="draft-added-item-row" key={item.id}>
                      <button 
                        type="button" 
                        className="draft-item-remove-btn"
                        onClick={() => handleRemoveItemFromDraft(item.id)}
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="8" y1="12" x2="16" y2="12"/>
                        </svg>
                      </button>
                      <div className="draft-item-details">
                        <span className="draft-item-name">{item.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <span style={{ fontSize: '10px', color: '#64748b' }}>{item.category} • </span>
                          <input 
                            type="number" 
                            value={item.unitsPerPerson}
                            step="0.1"
                            min="0.1"
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 1.0;
                              const updatedList = currentDraftItems.map(i => i.id === item.id ? { ...i, unitsPerPerson: val } : i);
                              const updatedDrafts = { ...builderDrafts, [selectedBuilderPackage]: updatedList };
                              setBuilderDrafts(updatedDrafts);
                            }}
                            style={{ 
                              width: '38px', 
                              border: '1px solid #cbd5e1', 
                              borderRadius: '4px', 
                              fontSize: '10px', 
                              padding: '1px 2px', 
                              textAlign: 'center',
                              fontWeight: '600'
                            }}
                          />
                          <span style={{ fontSize: '10px', color: '#64748b' }}> units/pp</span>
                        </div>
                      </div>
                      <span className="draft-item-price">Rs. {(item.price * (item.unitsPerPerson || 1.0)).toFixed(2)}</span>
                    </div>
                  ))}
                  {currentDraftItems.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', padding: '32px 0' }}>
                      No items added to this package yet. Click '+ Add to Package' from the list.
                    </div>
                  )}
                </div>

                {/* Price and Cost Summary */}
                <div className="draft-pricing-summary">
                  <div className="draft-summary-row">
                    <span>Ingredient Cost /pp</span>
                    <span>Rs. {ingredientCost.toFixed(2)}</span>
                  </div>
                  <div className="draft-summary-row">
                    <span>Labor Allocation (15%)</span>
                    <span>Rs. {laborAllocation.toFixed(2)}</span>
                  </div>
                  {builderHeadcount > 100 && (
                    <div className="draft-summary-row" style={{ color: '#10b981' }}>
                      <span>Bulk Discount ({builderDiscount}%)</span>
                      <span>-Rs. {bulkDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="draft-summary-row total">
                    <span>Price /person</span>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Rs. {pricePerPerson.toFixed(2)}</span>
                  </div>
                </div>

                {/* Dynamic Metrics */}
                <div className="draft-split-cards">
                  <div className="draft-split-card">
                    <span className="lbl">Est. Margin</span>
                    <span className="val" style={{ color: '#10b981' }}>{estMarginPercentage}% ~</span>
                  </div>
                  <div className="draft-split-card">
                    <span className="lbl">Total Revenue</span>
                    <span className="val">Rs. {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="draft-action-buttons">
                  <button 
                    type="button" 
                    className="draft-action-btn primary"
                    onClick={handleSaveDraft}
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/>
                      <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Save Package Draft
                  </button>
                  <button 
                    type="button" 
                    className="draft-action-btn secondary"
                    onClick={handleExportQuote}
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                      <polyline points="6 9 6 2 18 2 18 9"/>
                      <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                      <rect x="6" y="14" width="12" height="8"/>
                    </svg>
                    Export Quote PDF
                  </button>
                </div>

                {/* Profitability Tip */}
                <div className="profitability-tip-box">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-.304 0-.604-.04-.896-.12l-.548-.547z"/>
                  </svg>
                  <div>
                    <div className="tip-title">Profitability Tip</div>
                    <p className="tip-text">
                      Adding "Seasonal Fruit Platters" could increase your margin by 4% while maintaining the {selectedBuilderPackage} price point.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Adjustments Bottom Panel */}
            <div className="adjustments-panel-card">
              <div className="adjustments-header-row">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <h3>Bulk Pricing Adjustments</h3>
              </div>
              <div className="adjustments-inputs-grid">
                <div className="adjustment-field-group">
                  <label>Event Headcount</label>
                  <div className="adjustment-input-box">
                    <input 
                      type="number" 
                      value={builderHeadcount}
                      onChange={(e) => setBuilderHeadcount(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                    <span className="adjustment-suffix-label">pax</span>
                  </div>
                </div>
                <div className="adjustment-field-group">
                  <label>Tiered Discount (%)</label>
                  <div className="adjustment-input-box">
                    <input 
                      type="number" 
                      value={builderDiscount}
                      onChange={(e) => setBuilderDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                    />
                    <span className="adjustment-suffix-label">%</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', fontStyle: 'italic' }}>
                    Applied to orders &gt; 100 pax
                  </span>
                </div>
                <div className="adjustment-field-group">
                  <label>Fixed Service Fee</label>
                  <div className="adjustment-input-box has-prefix">
                    <span className="adjustment-prefix-label">Rs.</span>
                    <input 
                      type="number" 
                      value={builderServiceFee}
                      onChange={(e) => setBuilderServiceFee(Math.max(0, parseInt(e.target.value) || 0))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Capacity & Sync Bar */}
      <div className="floating-status-bar">
        <div className="status-item">
          <ForkKnifeIcon /> Daily Capacity <span className="value" style={{ marginLeft: '6px' }}>{displayCapacity}%</span>
        </div>
        <div className="divider"></div>
        <div className="status-item">
          <RefreshIcon /> Kitchen Sync <span className="value" style={{ marginLeft: '6px', color: '#10b981' }}>Live</span>
        </div>
      </div>

      {/* Event Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div 
            className="modal" 
            style={{ 
              width: step === 2 ? '920px' : step === 3 ? '600px' : '520px', 
              maxWidth: '95vw',
              boxSizing: 'border-box',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>
                  {editingEvent ? 'Edit Event Details' : 'Create New Event'}
                </h3>
                <button type="button" className="close-btn" onClick={() => setIsModalOpen(false)}>
                  <XIcon />
                </button>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                Step {step} of 3: {step === 1 ? 'Details' : step === 2 ? 'Package Selection' : 'Review'}
              </span>
            </div>

            {/* Step Progress Indicator */}
            <div className="wizard-steps">
              <div className={`step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                <div className="step-circle">
                  {step > 1 ? <CheckIcon /> : "1"}
                </div>
                <span className="step-label">Details</span>
              </div>
              <div className="step-connector" style={{ background: step > 1 ? '#10b981' : '#cbd5e1', width: '32px', height: '2px', margin: '0 12px' }}></div>
              <div className={`step-item ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                <div className="step-circle">
                  {step > 2 ? <CheckIcon /> : "2"}
                </div>
                <span className="step-label">Package</span>
              </div>
              <div className="step-connector" style={{ background: step > 2 ? '#10b981' : '#cbd5e1', width: '32px', height: '2px', margin: '0 12px' }}></div>
              <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
                <div className="step-circle">3</div>
                <span className="step-label">Review</span>
              </div>
            </div>

            <form onSubmit={handleSaveEvent}>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', padding: '0 24px 24px 24px' }}>
                {step === 1 && (
                  <div className="step-1-content">
                    <div className="form-group">
                      <label className="form-label">EVENT TITLE *</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="e.g. Smith Wedding Gala" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                      />
                    </div>

                    <div className="row">
                      <div className="col">
                        <label className="form-label">DATE</label>
                        <input 
                          type="date" 
                          className="input-field" 
                          value={eventDate} 
                          onChange={(e) => setEventDate(e.target.value)} 
                          required
                        />
                      </div>
                      <div className="col">
                        <label className="form-label">TIME</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          placeholder="e.g. 05:00 PM" 
                          value={eventTime} 
                          onChange={(e) => setEventTime(e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col">
                        <label className="form-label">EVENT TYPE</label>
                        <select className="input-field" value={type} onChange={(e) => setType(e.target.value)}>
                          <option value="Wedding">Wedding</option>
                          <option value="Corporate">Corporate</option>
                          <option value="Birthday">Birthday</option>
                          <option value="Private Dining">Private Dining</option>
                        </select>
                      </div>
                      <div className="col">
                        <label className="form-label">BILLING STATUS</label>
                        <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Pending Payment">Pending Payment</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">EXPECTED GUESTS</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        value={guests} 
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setGuests(val);
                          // Re-calculate price based on package type if not custom
                          if (selectedPackage !== 'Custom') {
                            setPrice(val * getPackagePriceVal(selectedPackage, currency));
                          }
                        }} 
                        min="1"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="step-2-content">
                    <div className="packages-row">
                      {/* Economy Card */}
                      <div 
                        className={`package-card ${selectedPackage === 'Economy' ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedPackage('Economy');
                          setServiceType('Standard Bistro');
                          setPrice(guests * getPackagePriceVal('Economy', currency));
                        }}
                      >
                        <span className="package-type-badge economy">Economy</span>
                        <h4>Standard Bistro</h4>
                        <div className="core-menu-section">
                          <div className="core-menu-title">Core Menu Items</div>
                          <ul className="core-menu-list">
                            {(builderDrafts.Economy || []).map((item, idx) => (
                              <li className="core-menu-item" key={idx}>
                                {item.name} ({item.unitsPerPerson || 1.0}x)
                              </li>
                            ))}
                            {(builderDrafts.Economy || []).length === 0 && (
                              <li className="core-menu-item" style={{ fontStyle: 'italic', listStyle: 'none' }}>No items in package</li>
                            )}
                          </ul>
                        </div>
                        <hr className="package-divider" />
                        <div className="price-row">
                          <span className="price-label">Per Person</span>
                          <span className="price-val">{formatCurrencyVal(getPackagePriceVal('Economy', currency), currency)}</span>
                        </div>
                        <div className="metrics-row">
                          <div className="metric-box">
                            <span className="metric-lbl">Total Cost</span>
                            <span className="metric-val">{formatCurrencyVal(guests * getPackagePriceVal('Economy', currency), currency)}</span>
                          </div>
                          <div className="metric-box">
                            <span className="metric-lbl">Est. Margin</span>
                            <span className="metric-val green">32%</span>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          className={`card-select-btn ${selectedPackage === 'Economy' ? 'selected' : 'unselected'}`}
                        >
                          {selectedPackage === 'Economy' ? 'Selected' : 'Select'}
                        </button>
                      </div>

                      {/* Standard Card */}
                      <div 
                        className={`package-card ${selectedPackage === 'Standard' ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedPackage('Standard');
                          setServiceType('Executive Banquet');
                          setPrice(guests * getPackagePriceVal('Standard', currency));
                        }}
                      >
                        <span className="popular-badge">Most Popular</span>
                        <span className="package-type-badge standard">Standard</span>
                        <h4>Executive Banquet</h4>
                        <div className="core-menu-section">
                          <div className="core-menu-title">Core Menu Items</div>
                          <ul className="core-menu-list">
                            {(builderDrafts.Standard || []).map((item, idx) => (
                              <li className="core-menu-item" key={idx}>
                                {item.name} ({item.unitsPerPerson || 1.0}x)
                              </li>
                            ))}
                            {(builderDrafts.Standard || []).length === 0 && (
                              <li className="core-menu-item" style={{ fontStyle: 'italic', listStyle: 'none' }}>No items in package</li>
                            )}
                          </ul>
                        </div>
                        <hr className="package-divider" />
                        <div className="price-row">
                          <span className="price-label">Per Person</span>
                          <span className="price-val" style={{ color: selectedPackage === 'Standard' ? '#843c0c' : undefined }}>
                            {formatCurrencyVal(getPackagePriceVal('Standard', currency), currency)}
                          </span>
                        </div>
                        <div className="metrics-row">
                          <div className="metric-box">
                            <span className="metric-lbl">Total Cost</span>
                            <span className="metric-val" style={{ color: selectedPackage === 'Standard' ? '#843c0c' : undefined }}>
                              {formatCurrencyVal(guests * getPackagePriceVal('Standard', currency), currency)}
                            </span>
                          </div>
                          <div className="metric-box">
                            <span className="metric-lbl">Est. Margin</span>
                            <span className="metric-val green">40%</span>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          className={`card-select-btn ${selectedPackage === 'Standard' ? 'selected' : 'unselected'}`}
                        >
                          {selectedPackage === 'Standard' ? 'Selected Package' : 'Select'}
                        </button>
                      </div>

                      {/* Premium Card */}
                      <div 
                        className={`package-card ${selectedPackage === 'Premium' ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedPackage('Premium');
                          setServiceType('Royal Signature');
                          setPrice(guests * getPackagePriceVal('Premium', currency));
                        }}
                      >
                        <span className="package-type-badge premium">Premium</span>
                        <h4>Royal Signature</h4>
                        <div className="core-menu-section">
                          <div className="core-menu-title">Core Menu Items</div>
                          <ul className="core-menu-list">
                            {(builderDrafts.Premium || []).map((item, idx) => (
                              <li className="core-menu-item" key={idx}>
                                {item.name} ({item.unitsPerPerson || 1.0}x)
                              </li>
                            ))}
                            {(builderDrafts.Premium || []).length === 0 && (
                              <li className="core-menu-item" style={{ fontStyle: 'italic', listStyle: 'none' }}>No items in package</li>
                            )}
                          </ul>
                        </div>
                        <hr className="package-divider" />
                        <div className="price-row">
                          <span className="price-label">Per Person</span>
                          <span className="price-val">{formatCurrencyVal(getPackagePriceVal('Premium', currency), currency)}</span>
                        </div>
                        <div className="metrics-row">
                          <div className="metric-box">
                            <span className="metric-lbl">Total Cost</span>
                            <span className="metric-val">{formatCurrencyVal(guests * getPackagePriceVal('Premium', currency), currency)}</span>
                          </div>
                          <div className="metric-box">
                            <span className="metric-lbl">Est. Margin</span>
                            <span className="metric-val green">48%</span>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          className={`card-select-btn ${selectedPackage === 'Premium' ? 'selected' : 'unselected'}`}
                        >
                          {selectedPackage === 'Premium' ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>

                    {/* Custom Package Form */}
                    {selectedPackage === 'Custom' && (
                      <div className="custom-package-section" style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h4 style={{ margin: 0, fontSize: '13px', color: '#0f172a', fontWeight: '700' }}>Customize Package Configuration</h4>
                          <button 
                            type="button" 
                            className="btn-cancel" 
                            style={{ 
                              padding: '4px 10px', 
                              fontSize: '11px', 
                              color: '#ba1a1a', 
                              background: '#fef2f2', 
                              border: '1px solid #fee2e2',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '600'
                            }}
                            onClick={() => {
                              setSelectedPackage('Standard');
                              setServiceType('Executive Banquet');
                              setPrice(guests * getPackagePriceVal('Standard', currency));
                            }}
                          >
                            Remove Customization
                          </button>
                        </div>
                        <div className="row" style={{ margin: 0, gap: '12px' }}>
                          <div className="col">
                            <label className="form-label" style={{ fontSize: '10px' }}>Custom Menu / Package Title</label>
                            <input 
                              type="text" 
                              className="input-field" 
                              placeholder="e.g. Customized Buffet & Decor" 
                              value={serviceType} 
                              onChange={(e) => setServiceType(e.target.value)} 
                              required
                            />
                          </div>
                          <div className="col">
                            <label className="form-label" style={{ fontSize: '10px' }}>Custom Per Person Price ({currency})</label>
                            <input 
                              type="number" 
                              className="input-field" 
                              placeholder={currency === '$' ? "e.g. 80" : "e.g. 3500"} 
                              value={guests > 0 ? Math.round(price / guests) : 0} 
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setPrice(val * guests);
                              }} 
                              min="0"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="step-3-content review-section">
                    <div className="review-card">
                      <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#843c0c', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Event Summary</h4>
                      <div className="review-grid">
                        <div className="review-item">
                          <span className="review-lbl">Event Title</span>
                          <span className="review-val">{title}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-lbl">Event Date & Time</span>
                          <span className="review-val">{eventDate} @ {eventTime}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-lbl">Event Type</span>
                          <span className="review-val">{type}</span>
                        </div>
                        <div className="review-item">
                          <span className="review-lbl">Expected Guests</span>
                          <span className="review-val">{guests} Guests</span>
                        </div>
                      </div>
                    </div>

                    <div className="review-card">
                      <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#843c0c', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Payment & Billing Structure</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div className="review-item">
                          <span className="review-lbl">Selected Package</span>
                          <span className="review-val" style={{ fontWeight: '700' }}>
                            {selectedPackage === 'Custom' ? 'Custom Configuration' : `${selectedPackage} Package`} ({serviceType})
                          </span>
                        </div>
                        
                        {/* Interactive Payment Option Selector */}
                        <div style={{ marginTop: '8px' }}>
                          <span className="review-lbl" style={{ display: 'block', marginBottom: '8px' }}>SELECT PAYMENT TERMS</span>
                          <div className="payment-options-row" style={{ display: 'flex', gap: '12px' }}>
                            <button
                              type="button"
                              className={`payment-term-btn ${paymentOption === 'full' ? 'active' : ''}`}
                              onClick={() => {
                                setPaymentOption('full');
                                setDepositPaid(true);
                              }}
                              style={{
                                flex: 1,
                                padding: '10px 12px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '700',
                                background: paymentOption === 'full' ? '#fffbeb' : 'white',
                                borderColor: paymentOption === 'full' ? '#843c0c' : '#cbd5e1',
                                color: paymentOption === 'full' ? '#843c0c' : '#475569',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              Full Payment (100%)
                            </button>
                            <button
                              type="button"
                              className={`payment-term-btn ${paymentOption === 'half' ? 'active' : ''}`}
                              onClick={() => {
                                setPaymentOption('half');
                                setDepositPaid(true);
                              }}
                              style={{
                                flex: 1,
                                padding: '10px 12px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '700',
                                background: paymentOption === 'half' ? '#fffbeb' : 'white',
                                borderColor: paymentOption === 'half' ? '#843c0c' : '#cbd5e1',
                                color: paymentOption === 'half' ? '#843c0c' : '#475569',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              Half Payment (50%)
                            </button>
                            <button
                              type="button"
                              className={`payment-term-btn ${paymentOption === 'advance' ? 'active' : ''}`}
                              onClick={() => {
                                setPaymentOption('advance');
                                setDepositPaid(true);
                              }}
                              style={{
                                flex: 1,
                                padding: '10px 12px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '700',
                                background: paymentOption === 'advance' ? '#fffbeb' : 'white',
                                borderColor: paymentOption === 'advance' ? '#843c0c' : '#cbd5e1',
                                color: paymentOption === 'advance' ? '#843c0c' : '#475569',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              Advanced Deposit
                            </button>
                          </div>
                        </div>

                        {/* Custom Advance Percentage Input */}
                        {paymentOption === 'advance' && (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            background: '#f8fafc', 
                            padding: '12px', 
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            marginTop: '4px'
                          }}>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Deposit Percentage:</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <input 
                                type="number" 
                                value={customAdvancePercent}
                                onChange={(e) => setCustomAdvancePercent(Math.min(99, Math.max(1, parseInt(e.target.value) || 10)))}
                                style={{ 
                                  width: '60px', 
                                  padding: '4px 8px', 
                                  border: '1px solid #cbd5e1', 
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  textAlign: 'center'
                                }}
                              />
                              <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>%</span>
                            </div>
                            <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                              (Calculated Deposit: {formatCurrencyVal(price * (customAdvancePercent / 100), currency)})
                            </span>
                          </div>
                        )}

                        {/* Deposit Paid Checkbox */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          marginTop: '8px',
                          background: '#fcfcfc',
                          padding: '10px 12px',
                          border: '1px solid #f1f5f9',
                          borderRadius: '8px'
                        }}>
                          <input 
                            type="checkbox" 
                            id="depositPaidCheck" 
                            checked={depositPaid}
                            onChange={(e) => setDepositPaid(e.target.checked)}
                            style={{ width: '16px', height: '16px', accentColor: '#843c0c', cursor: 'pointer' }}
                          />
                          <label htmlFor="depositPaidCheck" style={{ fontSize: '12px', fontWeight: '700', color: '#334155', cursor: 'pointer' }}>
                            {paymentOption === 'full' ? 'Mark Total Invoice as Paid (100% Paid)' : `Confirm Payment of Deposit/Advance (${paymentOption === 'half' ? '50%' : `${customAdvancePercent}%`})`}
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Calculated Invoice Summary Box */}
                    <div className="review-card" style={{ background: '#fffbeb', borderColor: '#fef3c7' }}>
                      <div className="review-grid" style={{ gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px' }}>
                        <div className="review-item">
                          <span className="review-lbl" style={{ color: '#b45309' }}>Total Cost</span>
                          <span className="review-val" style={{ fontSize: '18px', fontWeight: '800', color: '#843c0c' }}>
                            {formatCurrencyVal(price, currency)}
                          </span>
                        </div>
                        <div className="review-item">
                          <span className="review-lbl" style={{ color: '#b45309' }}>Paid Amount</span>
                          <span className="review-val" style={{ fontSize: '18px', fontWeight: '800', color: depositPaid ? '#10b981' : '#dc2626' }}>
                            {formatCurrencyVal(depositPaid ? (paymentOption === 'full' ? price : paymentOption === 'half' ? price * 0.5 : price * (customAdvancePercent / 100)) : 0, currency)}
                          </span>
                        </div>
                        <div className="review-item">
                          <span className="review-lbl" style={{ color: '#b45309' }}>Remaining Balance</span>
                          <span className="review-val" style={{ fontSize: '18px', fontWeight: '800', color: '#475569' }}>
                            {formatCurrencyVal(price - (depositPaid ? (paymentOption === 'full' ? price : paymentOption === 'half' ? price * 0.5 : price * (customAdvancePercent / 100)) : 0), currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="footer-left">
                  {step === 1 && editingEvent && (
                    <button 
                      type="button" 
                      className="btn-cancel" 
                      onClick={() => handleDeleteEvent(editingEvent.id)} 
                      style={{ background: '#fef2f2', color: '#ba1a1a', border: '1px solid #fee2e2' }}
                    >
                      Delete Event
                    </button>
                  )}
                  {step > 1 && (
                    <button 
                      type="button" 
                      className="btn-cancel" 
                      onClick={() => setStep(step - 1)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <ArrowLeftIcon /> Back
                    </button>
                  )}
                </div>

                <div className="footer-right" style={{ display: 'flex', gap: '10px' }}>
                  {step === 1 && (
                    <>
                      <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                      <button 
                        type="button" 
                        className="btn-create" 
                        onClick={() => {
                          if (!title.trim()) {
                            showToast('Please enter an event title.', 'error');
                            return;
                          }
                          setStep(2);
                        }} 
                        style={{ background: '#843c0c' }}
                      >
                        Next Step
                      </button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <button 
                        type="button" 
                        className="btn-cancel" 
                        onClick={() => {
                          setSelectedPackage('Custom');
                          setServiceType('Custom Bistro Config');
                        }}
                        style={{ color: '#843c0c', borderColor: '#843c0c' }}
                      >
                        Customize Package
                      </button>
                      <button 
                        type="button" 
                        className="btn-create" 
                        onClick={() => setStep(3)}
                        style={{ background: '#843c0c' }}
                      >
                        Next Step
                      </button>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                      <button 
                        type="submit" 
                        className="btn-create" 
                        style={{ background: '#843c0c' }}
                      >
                        {editingEvent ? 'Save Changes' : 'Create Event'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
