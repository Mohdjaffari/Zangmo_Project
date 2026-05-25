import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerSidebar from './ManagerSidebar';
import Topbar from '../../components/Topbar';
import '../../assets/styles/users.css';
import '../../assets/styles/events.css';

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
const PrinterIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><path d="M6 14h12v8H6z" /></svg>;


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
  const navigate = useNavigate();
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
  
  // Dynamic Event Types state loaded from localStorage
  const [eventTypes, setEventTypes] = useState(() => {
    const saved = localStorage.getItem('zangmo_event_types');
    return saved ? JSON.parse(saved) : ['Wedding', 'Corporate', 'Birthday', 'Private Dining'];
  });

  // Event filters state dynamically initialized from eventTypes
  const [filters, setFilters] = useState(() => {
    const savedTypes = localStorage.getItem('zangmo_event_types');
    const types = savedTypes ? JSON.parse(savedTypes) : ['Wedding', 'Corporate', 'Birthday', 'Private Dining'];
    const initialFilters = {};
    types.forEach(t => {
      initialFilters[t] = true;
    });
    return initialFilters;
  });

  // State to hold the new event type inputs
  const [showFilterNewTypeInput, setShowFilterNewTypeInput] = useState(false);
  const [filterNewTypeName, setFilterNewTypeName] = useState('');
  const [showNewTypeInput, setShowNewTypeInput] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');

  // Save eventTypes to localStorage
  useEffect(() => {
    localStorage.setItem('zangmo_event_types', JSON.stringify(eventTypes));
  }, [eventTypes]);

  const handleAddEventType = (newType) => {
    if (!newType.trim()) return;
    const trimmed = newType.trim();
    if (eventTypes.includes(trimmed)) return;
    const updatedTypes = [...eventTypes, trimmed];
    setEventTypes(updatedTypes);
    setFilters(prev => ({
      ...prev,
      [trimmed]: true
    }));
  };

  // Modal & Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuoteReviewModalOpen, setIsQuoteReviewModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptEvent, setReceiptEvent] = useState(null);
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

  const visibleDays = React.useMemo(() => {
    if (viewMode === 'Month') {
      return calendarDays;
    }
    
    if (viewMode === 'Week') {
      const pivotDate = selectedDate || new Date();
      const startOfWeek = new Date(pivotDate);
      const day = pivotDate.getDay();
      startOfWeek.setDate(pivotDate.getDate() - day);
      
      const days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        days.push({
          date: d,
          isCurrentMonth: d.getMonth() === currentMonth
        });
      }
      return days;
    }
    
    if (viewMode === 'Day') {
      const pivotDate = selectedDate || new Date();
      return [{
        date: new Date(pivotDate),
        isCurrentMonth: pivotDate.getMonth() === currentMonth
      }];
    }
    
    return calendarDays;
  }, [viewMode, calendarDays, selectedDate, currentMonth]);

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
  const handlePrev = () => {
    const pivotDate = selectedDate || new Date();
    if (viewMode === 'Month') {
      const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
      
      const targetDate = new Date(newYear, newMonth, Math.min(pivotDate.getDate(), new Date(newYear, newMonth + 1, 0).getDate()));
      setSelectedDate(targetDate);
    } else if (viewMode === 'Week') {
      const newDate = new Date(pivotDate);
      newDate.setDate(pivotDate.getDate() - 7);
      setSelectedDate(newDate);
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    } else if (viewMode === 'Day') {
      const newDate = new Date(pivotDate);
      newDate.setDate(pivotDate.getDate() - 1);
      setSelectedDate(newDate);
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    }
  };

  const handleNext = () => {
    const pivotDate = selectedDate || new Date();
    if (viewMode === 'Month') {
      const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
      
      const targetDate = new Date(newYear, newMonth, Math.min(pivotDate.getDate(), new Date(newYear, newMonth + 1, 0).getDate()));
      setSelectedDate(targetDate);
    } else if (viewMode === 'Week') {
      const newDate = new Date(pivotDate);
      newDate.setDate(pivotDate.getDate() + 7);
      setSelectedDate(newDate);
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    } else if (viewMode === 'Day') {
      const newDate = new Date(pivotDate);
      newDate.setDate(pivotDate.getDate() + 1);
      setSelectedDate(newDate);
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
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
    if (pkgName === 'Custom') return 0;
    const items = builderDrafts[pkgName] || [];
    if (items.length === 0) {
      if (curSymbol === '$') {
        return pkgName === 'Economy' ? 45 : pkgName === 'Standard' ? 75 : pkgName === 'Premium' ? 110 : 0;
      } else {
        return pkgName === 'Economy' ? 1850 : pkgName === 'Standard' ? 3200 : pkgName === 'Premium' ? 4800 : 0;
      }
    }
    const foodCost = items.reduce((sum, item) => sum + (item.price * (item.unitsPerPerson || 1.0)), 0);
    const labor = foodCost * 0.15;
    const basePrice = foodCost + labor;
    
    if (curSymbol === '$') {
      return basePrice / 80;
    }
    return basePrice;
  };

  const getPackageMargin = (pkgName) => {
    const items = builderDrafts[pkgName] || [];
    if (items.length === 0) {
      return pkgName === 'Economy' ? 32 : pkgName === 'Standard' ? 40 : pkgName === 'Premium' ? 48 : 0;
    }
    const foodCost = items.reduce((sum, item) => sum + (item.price * (item.unitsPerPerson || 1.0)), 0);
    const labor = foodCost * 0.15;
    const pricePerPerson = foodCost + labor;
    const costRatio = pkgName === 'Economy' ? 0.45 : pkgName === 'Standard' ? 0.40 : 0.35;
    const costFactorPerPerson = (foodCost * costRatio) + labor;
    
    if (pricePerPerson === 0) return 0;
    return Math.max(0, Math.round(((pricePerPerson - costFactorPerPerson) / pricePerPerson) * 100));
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
    
    if (eventObj.selectedPackage) {
      setSelectedPackage(eventObj.selectedPackage);
    } else {
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
      balance: (parseFloat(price) || 0) - finalPaidAmount,
      selectedPackage
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
    const currentDraftItems = builderDrafts[selectedBuilderPackage] || [];
    if (currentDraftItems.length === 0) {
      showToast(`Cannot save empty draft. Please add at least one item to the ${selectedBuilderPackage} Package.`, 'error');
      return;
    }
    localStorage.setItem('zangmo_package_drafts', JSON.stringify(builderDrafts));
    showToast(`${selectedBuilderPackage} Package Draft saved successfully!`, 'success');
  };

  const handleExportQuote = () => {
    const currentDraftItems = builderDrafts[selectedBuilderPackage] || [];
    if (currentDraftItems.length === 0) {
      showToast(`Cannot export empty package. Please add at least one item to the ${selectedBuilderPackage} Package.`, 'error');
      return;
    }
    setIsQuoteReviewModalOpen(true);
  };

  const handlePrintQuote = () => {
    setIsQuoteReviewModalOpen(false);
    showToast("Preparing document printing...", "info");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const getEventPackageName = (evt) => {
    if (evt.selectedPackage) return evt.selectedPackage;
    const perPerson = evt.guests > 0 ? Math.round(evt.price / evt.guests) : 0;
    const economyPrice = getPackagePriceVal('Economy', currency);
    const standardPrice = getPackagePriceVal('Standard', currency);
    const premiumPrice = getPackagePriceVal('Premium', currency);
    
    if (perPerson === economyPrice || perPerson === 45 || perPerson === 1850) {
      return 'Economy';
    } else if (perPerson === standardPrice || perPerson === 75 || perPerson === 3200) {
      return 'Standard';
    } else if (perPerson === premiumPrice || perPerson === 110 || perPerson === 4800) {
      return 'Premium';
    } else {
      return 'Custom';
    }
  };

  const handlePrintEventReceipt = async (evt) => {
    showToast("Preparing booking receipt...", "info");
    
    const pkgName = getEventPackageName(evt);
    const items = pkgName !== 'Custom' ? (builderDrafts[pkgName] || []) : [];
    const { paid, balance, statusText } = getEventPaymentInfo(evt);

    let receiptStatus = statusText.toUpperCase();
    let color = '#d97706'; // Orange/Amber
    let bg = '#fef3c7'; // Light orange/amber
    
    if (receiptStatus === 'COMPLETED' || (receiptStatus === 'CONFIRMED' && balance === 0)) {
      receiptStatus = 'PAID IN FULL';
      color = '#10b981'; // Green
      bg = '#d1fae5'; // Light green
    } else if (receiptStatus === 'UNPAID' || receiptStatus === 'PENDING PAYMENT') {
      receiptStatus = 'UNPAID';
      color = '#dc2626'; // Red
      bg = '#fee2e2'; // Light red
    } else if (receiptStatus === 'PARTIALLY PAID' || receiptStatus === 'CONFIRMED') {
      receiptStatus = 'PARTIALLY PAID';
      color = '#d97706';
      bg = '#fef3c7';
    }

    const htmlContent = `
      <div style="font-family: 'Courier New', Courier, monospace; width: 280px; padding: 10px; margin: 0 auto; color: #000; font-size: 12px; line-height: 1.4;">
        <div style="text-align: center; margin-bottom: 12px;">
          <h2 style="font-size: 16px; margin: 0 0 4px 0; font-weight: bold; color: #843c0c;">Z&M CATERING & EVENTS</h2>
          <p style="font-size: 10px; margin: 0 0 4px 0; color: #555;">${localStorage.getItem('zangmo_logged_branch') || 'Mehdi Kitchen (Main)'} - Event Services</p>
          <p style="font-size: 10px; margin: 0; color: #555;">Date Printed: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>

        <div style="border-top: 1px dashed #000; margin: 8px 0;"></div>

        <div style="margin-bottom: 10px;">
          <div style="font-weight: bold; font-size: 13px; margin-bottom: 6px; text-align: center; color: #843c0c;">EVENT RECEIPT</div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Client Event:</span>
            <span style="font-weight: bold; text-align: right; max-width: 175px; word-break: break-all;">${evt.title}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Event Date:</span>
            <span>${evt.date} @ ${evt.time}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Guests/Headcount:</span>
            <span style="font-weight: bold;">${evt.guests} Pax</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Service Style:</span>
            <span>${evt.serviceType}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Package Choice:</span>
            <span style="font-weight: bold;">${pkgName} Package</span>
          </div>
        </div>

        <div style="border-top: 1px dashed #000; margin: 8px 0;"></div>

        ${items.length > 0 ? `
          <div style="margin-bottom: 8px;">
            <div style="font-weight: bold; font-size: 10px; text-transform: uppercase; margin-bottom: 6px;">Menu Items Breakdown</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              ${items.map(item => `
                <div style="display: flex; justify-content: space-between; font-size: 11px;">
                  <span style="max-width: 190px;">${item.name} (${item.unitsPerPerson.toFixed(1)}x)</span>
                  <span>${formatCurrencyVal(item.price * item.unitsPerPerson, currency)}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div style="border-top: 1px dashed #000; margin: 8px 0;"></div>
        ` : ''}

        <div style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span>Total Cost Due:</span>
            <span style="font-weight: bold;">${formatCurrencyVal(evt.price, currency)}</span>
          </div>
          
          <div style="border-top: 1px dashed #000; margin: 6px 0;"></div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; padding: 6px 8px; background-color: ${bg}; border-radius: 4px; align-items: center;">
            <span style="font-weight: bold; color: ${color}; font-size: 11px;">STATUS:</span>
            <span style="font-weight: bold; color: ${color}; font-size: 11px; letter-spacing: 0.5px;">${receiptStatus}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Amount Paid:</span>
            <span style="font-weight: bold; color: #10b981;">${formatCurrencyVal(paid, currency)}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Balance Due:</span>
            <span style="font-weight: bold; color: ${balance > 0 ? '#b45309' : '#555'};">${formatCurrencyVal(balance, currency)}</span>
          </div>
        </div>

        <div style="border-top: 1px dashed #000; margin: 10px 0 6px 0;"></div>

        <div style="text-align: center; font-size: 9px; color: #555; margin-top: 12px;">
          <p style="margin: 0 0 3px 0; font-weight: bold;">THANK YOU FOR BOOKING WITH Z&M</p>
          <p style="margin: 0;">WWW.ZM-KITCHEN.COM</p>
        </div>
      </div>
    `;

    if (window.electronAPI) {
      try {
        const printers = await window.electronAPI.getPrinters();
        if (!printers || printers.length === 0) {
          showToast("Printer Error: No connected printers found! Please check connections.", "error");
          return;
        }

        const result = await window.electronAPI.printReceipt({
          printerName: '',
          htmlContent: htmlContent
        });
        if (result.success) {
          showToast("Receipt printed successfully!", "success");
        } else {
          console.error("Silent print failed:", result.error);
          showToast("Printer Error: Print failed. Verify printer status.", "error");
        }
      } catch (err) {
        console.error("Error invoking print API:", err);
        showToast("Error sending data to printer.", "error");
      }
    } else {
      const printWindow = window.open('', '_blank', 'width=400,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Booking Receipt</title>
              <style>
                body { margin: 0; padding: 20px; }
              </style>
            </head>
            <body>
              ${htmlContent}
              <script>
                window.onload = function() {
                  window.print();
                  window.close();
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        showToast("Popup blocked! Enable popups to print in browser.", "error");
      }
    }
  };


  // Cost and price calculation variables
  const currentDraftItems = builderDrafts[selectedBuilderPackage] || [];
  const ingredientCost = currentDraftItems.reduce((sum, item) => sum + (item.price * (item.unitsPerPerson || 1.0)), 0);
  const laborAllocation = ingredientCost * 0.15;
  const bulkDiscount = builderHeadcount > 100 ? (ingredientCost + laborAllocation) * (builderDiscount / 100) : 0;
  
  const conversionRate = currency === '$' ? 80 : 1;
  const hasItems = currentDraftItems.length > 0;
  const pricePerPerson = hasItems ? (ingredientCost + laborAllocation - bulkDiscount) / conversionRate : 0;
  const totalRevenue = hasItems ? pricePerPerson * builderHeadcount + (builderServiceFee / conversionRate) : 0;
  
  const costRatio = selectedBuilderPackage === 'Economy' ? 0.45 : selectedBuilderPackage === 'Standard' ? 0.40 : 0.35;
  const costFactorPerPerson = hasItems 
    ? ((ingredientCost * costRatio) + laborAllocation - bulkDiscount) / conversionRate + (builderServiceFee / builderHeadcount) * 0.4 / conversionRate 
    : 0;
  const estMarginPercentage = hasItems && pricePerPerson > 0 ? Math.max(0, Math.round(((pricePerPerson - costFactorPerPerson) / pricePerPerson) * 100)) : 0;

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
      <ManagerSidebar activePage="events" />

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
                  {viewMode === 'Day' 
                    ? (selectedDate || new Date()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
                    : `${MONTH_NAMES[currentMonth]} ${currentYear}`}
                </div>

                <div className="calendar-controls">
                  <button className="btn-nav" onClick={handlePrev} title={`Previous ${viewMode}`}>
                    <ChevronLeft />
                  </button>
                  <button className="btn-today" onClick={handleToday}>
                    Today
                  </button>
                  <button className="btn-nav" onClick={handleNext} title={`Next ${viewMode}`}>
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
              <div 
                className="calendar-grid"
                style={{
                  gridTemplateColumns: viewMode === 'Day' ? '1fr' : 'repeat(7, minmax(0, 1fr))'
                }}
              >
                {/* Header Days of Week */}
                {viewMode === 'Day' ? (
                  <div className="grid-header-cell" style={{ textAlign: 'left', paddingLeft: '16px' }}>
                    {(selectedDate || new Date()).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}
                  </div>
                ) : (
                  ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                    <div className="grid-header-cell" key={day}>{day}</div>
                  ))
                )}

                {/* Day cells */}
                {visibleDays.map((cell, idx) => {
                  const dayEvents = getEventsForDate(cell.date);
                  const isSelected = selectedDate && formatDateKey(cell.date) === formatDateKey(selectedDate);
                  const isToday = formatDateKey(cell.date) === formatDateKey(new Date());

                  return (
                    <div 
                      key={idx}
                      className={`grid-day-cell ${cell.isCurrentMonth ? '' : 'outside-month'} ${isToday ? 'today' : ''}`}
                      style={{
                        border: isSelected ? '2px solid #843c0c' : undefined,
                        cursor: 'pointer',
                        minHeight: viewMode === 'Day' ? '280px' : undefined,
                        padding: viewMode === 'Day' ? '24px' : undefined
                      }}
                      onClick={() => {
                        setSelectedDate(cell.date);
                        setCurrentMonth(cell.date.getMonth());
                        setCurrentYear(cell.date.getFullYear());
                      }}
                    >
                      <div className="day-number" style={{
                        fontSize: viewMode === 'Day' ? '18px' : undefined,
                        width: viewMode === 'Day' ? '32px' : undefined,
                        height: viewMode === 'Day' ? '32px' : undefined,
                        marginBottom: viewMode === 'Day' ? '16px' : undefined
                      }}>
                        {cell.date.getDate()}
                      </div>
                      
                      {viewMode === 'Day' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                                style={{
                                  padding: '16px',
                                  fontSize: '12px',
                                  borderRadius: '8px',
                                  whiteSpace: 'normal',
                                  overflow: 'visible',
                                  textOverflow: 'clip'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                  <span className="badge-title" style={{ fontSize: '13px' }}>{evt.title}</span>
                                  <span className="badge-time" style={{ fontSize: '11px', fontWeight: 'bold' }}>{evt.time}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.9 }}>
                                  <span>{evt.guests} Guests • {evt.serviceType}</span>
                                  <span>Status: {statusText} • {formatCurrencyVal(evt.price, currency)}</span>
                                </div>
                              </div>
                            );
                          })}
                          {dayEvents.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
                              No events scheduled for this day. Click "Add New Event" to schedule one.
                            </div>
                          )}
                        </div>
                      ) : (
                        dayEvents.map(evt => {
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
                        })
                      )}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0 }}>Event Filters</h3>
                  {!showFilterNewTypeInput && (
                    <button 
                      type="button" 
                      onClick={() => setShowFilterNewTypeInput(true)} 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#843c0c', 
                        fontSize: '11px', 
                        fontWeight: '700', 
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      + Add Type
                    </button>
                  )}
                </div>
                
                {showFilterNewTypeInput && (
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="New event type..." 
                      value={filterNewTypeName}
                      onChange={(e) => setFilterNewTypeName(e.target.value)}
                      style={{ flex: 1, height: '32px', padding: '0 8px', fontSize: '12px' }}
                    />
                    <button 
                      type="button" 
                      className="btn-create" 
                      onClick={() => {
                        const trimmed = filterNewTypeName.trim();
                        if (!trimmed) {
                          showToast('Please enter a type name', 'error');
                          return;
                        }
                        if (eventTypes.includes(trimmed)) {
                          showToast('Type already exists', 'error');
                          return;
                        }
                        handleAddEventType(trimmed);
                        setFilterNewTypeName('');
                        setShowFilterNewTypeInput(false);
                        showToast(`Event type "${trimmed}" added!`);
                      }}
                      style={{ background: '#843c0c', padding: '0 10px', fontSize: '11px', height: '32px', borderRadius: '6px' }}
                    >
                      Save
                    </button>
                    <button 
                      type="button" 
                      className="btn-cancel" 
                      onClick={() => {
                        setFilterNewTypeName('');
                        setShowFilterNewTypeInput(false);
                      }}
                      style={{ padding: '0 10px', fontSize: '11px', height: '32px', borderRadius: '6px' }}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <div className="filter-group">
                  <span className="filter-label">EVENT TYPE</span>
                  {eventTypes.map(type => (
                    <label className="checkbox-label" key={type}>
                      <input 
                        type="checkbox" 
                        checked={filters[type] ?? true} 
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

                        <div className="card-pricing-row" style={{ border: 'none', paddingTop: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {isFullyPaid ? (
                            <span className="paid-badge">
                              <CheckCircleIcon /> Paid in Full
                            </span>
                          ) : (
                            <span className="price-text" style={{ fontSize: '11px', fontWeight: '600' }}>
                              <WalletIcon /> Balance: <span className="price-value" style={{ fontWeight: '800', color: '#b45309' }}>{formatCurrencyVal(balance, currency)}</span>
                            </span>
                          )}
                          <button
                            type="button"
                            className="print-receipt-card-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setReceiptEvent(evt);
                              setIsReceiptModalOpen(true);
                            }}
                            title="Print Booking Receipt"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#843c0c',
                              cursor: 'pointer',
                              padding: '4px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fffbeb'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <PrinterIcon />
                          </button>
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
                {/* Print Only Header */}
                <div className="print-only-header">
                  <h2>Zangmo POS - Event Catering Quote</h2>
                  <div className="print-meta-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #843c0c', paddingBottom: '8px', marginBottom: '20px' }}>
                    <span style={{ fontWeight: '700' }}>Package: {selectedBuilderPackage} Package</span>
                    <span style={{ fontWeight: '700' }}>Headcount: {builderHeadcount} Guests</span>
                  </div>
                </div>

                <div className="right-section-title-row no-print">
                  <h3>{selectedBuilderPackage} Package</h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="drafting-badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                      {builderHeadcount} Pax
                    </span>
                    <span className="drafting-badge">Drafting</span>
                  </div>
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
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="8" y1="12" x2="16" y2="12"/>
                        </svg>
                      </button>
                      <div className="draft-item-details">
                        <span className="draft-item-name">{item.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                          <span className={`draft-item-category-badge ${item.category.toLowerCase().replace(' ', '-')}`}>{item.category}</span>
                          <div className="qty-selector-container">
                            <button 
                              type="button" 
                              className="qty-btn minus"
                              onClick={() => {
                                const newVal = Math.max(0.1, parseFloat((item.unitsPerPerson - 0.1).toFixed(1)));
                                const updatedList = currentDraftItems.map(i => i.id === item.id ? { ...i, unitsPerPerson: newVal } : i);
                                const updatedDrafts = { ...builderDrafts, [selectedBuilderPackage]: updatedList };
                                setBuilderDrafts(updatedDrafts);
                              }}
                            >
                              -
                            </button>
                            <span className="qty-value">{item.unitsPerPerson.toFixed(1)}</span>
                            <button 
                              type="button" 
                              className="qty-btn plus"
                              onClick={() => {
                                const newVal = parseFloat((item.unitsPerPerson + 0.1).toFixed(1));
                                const updatedList = currentDraftItems.map(i => i.id === item.id ? { ...i, unitsPerPerson: newVal } : i);
                                const updatedDrafts = { ...builderDrafts, [selectedBuilderPackage]: updatedList };
                                setBuilderDrafts(updatedDrafts);
                              }}
                            >
                              +
                            </button>
                          </div>
                          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600' }}> qty/pp</span>
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

                {/* Kitchen-Only Profitability Analysis (Hidden in Print) */}
                <div className="draft-pricing-summary kitchen-only" style={{ marginBottom: '16px' }}>
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

                {/* Client-Facing Invoice/Quote Summary (Printed & Screen) */}
                <div className="draft-pricing-summary client-quote-summary" style={{ marginTop: '0px' }}>
                  <div className="draft-summary-row">
                    <span>Event Headcount</span>
                    <span style={{ fontWeight: '700' }}>{builderHeadcount} Guests</span>
                  </div>
                  <div className="draft-summary-row">
                    <span>Base Price /person</span>
                    <span>{formatCurrencyVal(pricePerPerson, currency)}</span>
                  </div>
                  <div className="draft-summary-row" style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '4px' }}>
                    <span>Catering Subtotal</span>
                    <span>{formatCurrencyVal(pricePerPerson * builderHeadcount, currency)}</span>
                  </div>
                  <div className="draft-summary-row">
                    <span>Fixed Service Fee</span>
                    <span>{formatCurrencyVal(builderServiceFee / conversionRate, currency)}</span>
                  </div>
                  <div className="draft-summary-row total" style={{ borderTop: '1px solid #0f172a', paddingTop: '10px' }}>
                    <span>Grand Total Quote</span>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#843c0c' }}>{formatCurrencyVal(totalRevenue, currency)}</span>
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
                <div className="header-icon-wrapper">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
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
                    <input 
                      type="number" 
                      value={builderServiceFee}
                      onChange={(e) => setBuilderServiceFee(Math.max(0, parseInt(e.target.value) || 0))}
                    />
                    <span className="adjustment-prefix-label">Rs.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
              <div className="modal-body" style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto', padding: '0 24px 24px 24px', scrollbarGutter: 'stable' }}>
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
                        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>EVENT TYPE</span>
                          {!showNewTypeInput && (
                            <button 
                              type="button" 
                              onClick={() => setShowNewTypeInput(true)} 
                              style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: '#843c0c', 
                                fontSize: '10px', 
                                fontWeight: '700', 
                                cursor: 'pointer',
                                padding: 0
                              }}
                            >
                              + Add Type
                            </button>
                          )}
                        </label>
                        
                        {showNewTypeInput ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <input 
                              type="text" 
                              className="input-field" 
                              placeholder="New type name..." 
                              value={newTypeName}
                              onChange={(e) => setNewTypeName(e.target.value)}
                              style={{ flex: 1, height: '38px' }}
                            />
                            <button 
                              type="button" 
                              className="btn-create" 
                              onClick={() => {
                                const trimmed = newTypeName.trim();
                                if (!trimmed) {
                                  showToast('Please enter a type name', 'error');
                                  return;
                                }
                                if (eventTypes.includes(trimmed)) {
                                  showToast('Type already exists', 'error');
                                  return;
                                }
                                handleAddEventType(trimmed);
                                setType(trimmed); // Select the new type
                                setNewTypeName('');
                                setShowNewTypeInput(false);
                                showToast(`Event type "${trimmed}" added!`);
                              }}
                              style={{ background: '#843c0c', padding: '0 12px', fontSize: '11px', height: '38px', borderRadius: '6px' }}
                            >
                              Save
                            </button>
                            <button 
                              type="button" 
                              className="btn-cancel" 
                              onClick={() => {
                                setNewTypeName('');
                                setShowNewTypeInput(false);
                              }}
                              style={{ padding: '0 12px', fontSize: '11px', height: '38px', borderRadius: '6px' }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <select className="input-field" value={type} onChange={(e) => setType(e.target.value)}>
                            {eventTypes.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        )}
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
                            <span className="metric-val green">{getPackageMargin('Economy')}%</span>
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
                            <span className="metric-val green">{getPackageMargin('Standard')}%</span>
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
                            <span className="metric-val green">{getPackageMargin('Premium')}%</span>
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
                        type="button" 
                        className="btn-cancel" 
                        onClick={() => {
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

                          const mockEvt = {
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
                            balance: (parseFloat(price) || 0) - finalPaidAmount,
                            selectedPackage
                          };
                          handlePrintEventReceipt(mockEvt);
                        }}
                        style={{ borderColor: '#843c0c', color: '#843c0c', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <PrinterIcon /> Print Receipt
                      </button>
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

      {/* Quote Review Modal */}
      {isQuoteReviewModalOpen && (
        <div className="modal-overlay" onClick={() => setIsQuoteReviewModalOpen(false)}>
          <div className="modal" style={{ width: '560px', maxWidth: '95vw' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ background: '#1e293b' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Review Package Quote</h3>
              <button type="button" className="close-btn" onClick={() => setIsQuoteReviewModalOpen(false)}>
                <XIcon />
              </button>
            </div>
            
            <div className="modal-body" style={{ padding: '24px', maxHeight: 'calc(100vh - 220px)', overflowY: 'auto', scrollbarGutter: 'stable' }}>
              <div style={{ background: '#fffbeb', border: '1px solid #fed7aa', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '10px', color: '#843c0c', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Package Config</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{selectedBuilderPackage} Package</span>
                  <span style={{ fontSize: '14px', color: '#475569', fontWeight: '700' }}>{builderHeadcount} Guests</span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '10px' }}>Selected Menu Breakdown</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentDraftItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#334155' }}>
                      <span style={{ fontWeight: '500' }}>{item.name} <span style={{ fontSize: '11px', color: '#64748b' }}>({item.unitsPerPerson}x)</span></span>
                      <span style={{ fontFamily: 'monospace', fontWeight: '700' }}>{formatCurrencyVal(item.price * item.unitsPerPerson, currency)}</span>
                    </div>
                  ))}
                  {currentDraftItems.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', padding: '12px 0' }}>No items in package</div>
                  )}
                </div>
              </div>

              {/* Cost Summary */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                  <span>Ingredient Cost /pp</span>
                  <span style={{ fontWeight: '600', color: '#334155' }}>{formatCurrencyVal(ingredientCost, currency)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                  <span>Labor Allocation (15%)</span>
                  <span style={{ fontWeight: '600', color: '#334155' }}>{formatCurrencyVal(laborAllocation, currency)}</span>
                </div>
                {builderHeadcount > 100 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#10b981' }}>
                    <span>Bulk Discount ({builderDiscount}%)</span>
                    <span style={{ fontWeight: '600' }}>-{formatCurrencyVal(bulkDiscount, currency)}</span>
                  </div>
                )}
                
                <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#0f172a', fontWeight: '700' }}>
                  <span>Base Price /person</span>
                  <span style={{ color: '#843c0c' }}>{formatCurrencyVal(pricePerPerson, currency)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                  <span>Subtotal ({builderHeadcount} pax)</span>
                  <span style={{ fontWeight: '600', color: '#334155' }}>{formatCurrencyVal(pricePerPerson * builderHeadcount, currency)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                  <span>Fixed Service Fee</span>
                  <span style={{ fontWeight: '600', color: '#334155' }}>{formatCurrencyVal(builderServiceFee / conversionRate, currency)}</span>
                </div>
                
                <div style={{ borderTop: '2px solid #0f172a', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '18px', color: '#0f172a', fontWeight: '800' }}>
                  <span>Grand Total Quote</span>
                  <span style={{ color: '#843c0c' }}>{formatCurrencyVal(totalRevenue, currency)}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              <button type="button" className="btn-cancel" onClick={() => setIsQuoteReviewModalOpen(false)}>Back to Edit</button>
              <button 
                type="button" 
                className="btn-create" 
                onClick={handlePrintQuote}
                style={{ background: '#843c0c' }}
              >
                Print Quote Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Printed Thermal Receipt Modal Dialog */}
      {isReceiptModalOpen && receiptEvent && (() => {
        const pkgName = getEventPackageName(receiptEvent);
        const items = pkgName !== 'Custom' ? (builderDrafts[pkgName] || []) : [];
        const { paid, balance, statusText } = getEventPaymentInfo(receiptEvent);

        let receiptStatus = statusText.toUpperCase();
        let color = '#d97706'; // Orange/Amber
        let bg = '#fef3c7'; // Light orange/amber
        
        if (receiptStatus === 'COMPLETED' || (receiptStatus === 'CONFIRMED' && balance === 0)) {
          receiptStatus = 'PAID IN FULL';
          color = '#10b981'; // Green
          bg = '#d1fae5'; // Light green
        } else if (receiptStatus === 'UNPAID' || receiptStatus === 'PENDING PAYMENT') {
          receiptStatus = 'UNPAID';
          color = '#dc2626'; // Red
          bg = '#fee2e2'; // Light red
        } else if (receiptStatus === 'PARTIALLY PAID' || receiptStatus === 'CONFIRMED') {
          receiptStatus = 'PARTIALLY PAID';
          color = '#d97706';
          bg = '#fef3c7';
        }

        return (
          <div className="order-modal-overlay" style={{ background: 'rgba(0,0,0,0.65)' }}>
            <div className="thermal-receipt-modal" onClick={e => e.stopPropagation()} style={{ width: '400px' }}>
              <button type="button" className="close-receipt-btn" onClick={() => {
                setIsReceiptModalOpen(false);
                setReceiptEvent(null);
              }}>
                <XIcon />
              </button>

              <div className="receipt-paper-content" style={{ maxHeight: 'calc(100vh - 160px)', overflowY: 'auto', scrollbarGutter: 'stable' }}>
                <div className="receipt-paper-header" style={{ textAlign: 'center' }}>
                  <h2 style={{ fontSize: '18px', margin: '0 0 4px 0', color: '#843c0c', fontWeight: '800' }}>Z&M CATERING</h2>
                  <p className="branch-meta" style={{ fontSize: '11px', margin: '0 0 2px 0', fontWeight: 'bold' }}>{localStorage.getItem('zangmo_logged_branch') || 'Mehdi Kitchen (Main)'} - Event Services</p>
                  <p className="date-meta" style={{ fontSize: '10px', margin: '0' }}>Date: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="receipt-items-dashed-divider" />

                <div style={{ marginBottom: '10px', fontSize: '12px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '13px', margin: '0 auto 8px auto', textAlign: 'center', color: '#843c0c' }}>EVENT RECEIPT PREVIEW</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Event Name:</span>
                    <span style={{ fontWeight: 'bold', textAlign: 'right', maxWidth: '200px', wordBreak: 'break-all' }}>{receiptEvent.title}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Event Date:</span>
                    <span>{receiptEvent.date} @ {receiptEvent.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Guests:</span>
                    <span style={{ fontWeight: 'bold' }}>{receiptEvent.guests} Pax</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Service:</span>
                    <span>{receiptEvent.serviceType}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Package:</span>
                    <span style={{ fontWeight: 'bold' }}>{pkgName} Package</span>
                  </div>
                </div>

                <div className="receipt-items-dashed-divider" />

                {items.length > 0 ? (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase', marginBottom: '6px' }}>Menu Details</div>
                    <div className="receipt-items-table">
                      {items.map((item, idx) => (
                        <div className="receipt-item-line" key={idx}>
                          <span className="qty-name">{item.name} ({item.unitsPerPerson.toFixed(1)}x)</span>
                          <span className="price">{formatCurrencyVal(item.price * item.unitsPerPerson, currency)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="receipt-items-dashed-divider" />
                  </div>
                ) : null}

                <div className="receipt-pricing-block" style={{ fontSize: '12px' }}>
                  <div className="receipt-price-row">
                    <span>Total Cost:</span>
                    <span style={{ fontWeight: 'bold' }}>{formatCurrencyVal(receiptEvent.price, currency)}</span>
                  </div>
                  
                  <div className="receipt-items-dashed-divider" style={{ margin: '8px 0' }} />

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px', 
                    padding: '6px 8px', 
                    backgroundColor: bg, 
                    borderRadius: '4px', 
                    alignItems: 'center' 
                  }}>
                    <span style={{ fontWeight: 'bold', color: color, fontSize: '11px' }}>PAYMENT STATUS:</span>
                    <span style={{ fontWeight: 'bold', color: color, fontSize: '11px', letterSpacing: '0.5px' }}>{receiptStatus}</span>
                  </div>

                  <div className="receipt-price-row">
                    <span>Amount Paid:</span>
                    <span style={{ fontWeight: 'bold', color: '#10b981' }}>{formatCurrencyVal(paid, currency)}</span>
                  </div>
                  <div className="receipt-price-row">
                    <span>Balance Due:</span>
                    <span style={{ fontWeight: 'bold', color: balance > 0 ? '#b45309' : '#475569' }}>{formatCurrencyVal(balance, currency)}</span>
                  </div>
                </div>

                <div className="receipt-items-dashed-divider" />

                <div className="receipt-paper-footer">
                  <p>THANK YOU FOR BOOKING WITH US</p>
                  <p style={{ fontSize: '9px', fontWeight: '500', marginTop: '4px' }}>WWW.ZM-KITCHEN.COM</p>
                </div>
              </div>

              <button 
                type="button"
                className="btn-finalize-and-print-receipt" 
                onClick={() => {
                  handlePrintEventReceipt(receiptEvent);
                  setIsReceiptModalOpen(false);
                  setReceiptEvent(null);
                }}
                style={{ background: '#843c0c' }}
              >
                FINALIZE & PRINT RECEIPT
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
