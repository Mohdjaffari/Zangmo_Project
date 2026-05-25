import React, { useState, useEffect } from 'react';

// Icons
const ChevronDown = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>;
const BellIcon = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
const StoreIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><rect x="3" y="3" width="18" height="8" rx="2"/></svg>;
const ClockIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const PrinterIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>;
const WifiIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>;

export default function Topbar({ title }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPrinterConnected, setIsPrinterConnected] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [loggedBranch, setLoggedBranch] = useState(() => {
    return localStorage.getItem('zangmo_logged_branch') || 'Mehdi Kitchen (Main)';
  });

  useEffect(() => {
    const handleStorage = () => {
      setLoggedBranch(localStorage.getItem('zangmo_logged_branch') || 'Mehdi Kitchen (Main)');
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "System fully sync'd with offline printer spooler.", time: "Just now", type: "success" },
    { id: 2, text: "New menu category 'Beverages' added successfully.", time: "10 mins ago", type: "info" },
    { id: 3, text: "Database automatically compiled with backup server.", time: "1 hour ago", type: "info" }
  ]);

  // Strict physical local hardware connection check (No localhost/development bypass)
  const verifyPrinterConnection = async () => {
    try {
      // 1. Check WebUSB wired/wireless devices (works 100% offline)
      if ('usb' in navigator) {
        const usbDevices = await navigator.usb.getDevices();
        // Class 7 is Printer Class
        const hasUsbPrinter = usbDevices.some(d => 
          d.deviceClass === 7 || 
          d.configuration?.interfaces.some(i => i.alternate.interfaceClass === 7)
        );
        if (hasUsbPrinter) return true;
      }

      // 2. Check WebSerial ports (wired COM receipt printers, works offline)
      if ('serial' in navigator) {
        const ports = await navigator.serial.getPorts();
        if (ports.length > 0) return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  };

  // Poll printer connection status state automatically every 3 seconds (even offline)
  useEffect(() => {
    const pollPrinter = async () => {
      const isConnected = await verifyPrinterConnection();
      setIsPrinterConnected(isConnected);
    };

    pollPrinter();
    const interval = setInterval(pollPrinter, 3000);
    return () => clearInterval(interval);
  }, []);

  // Pair a new printer (launches browser secure permission dialog)
  const handlePairPrinter = async () => {
    try {
      if ('usb' in navigator) {
        const device = await navigator.usb.requestDevice({ filters: [] });
        alert(`USB Device Linked: ${device.productName || 'Thermal Printer'}`);
        const isConnected = await verifyPrinterConnection();
        setIsPrinterConnected(isConnected);
      } else if ('serial' in navigator) {
        const port = await navigator.serial.requestPort();
        alert("Serial/Wired Printer Connected!");
        const isConnected = await verifyPrinterConnection();
        setIsPrinterConnected(isConnected);
      } else {
        alert("Your browser does not support physical device connection APIs.");
      }
    } catch (err) {
      console.log("Connection cancelled or printer not found.", err);
    }
  };

  // Clock ticks
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pos-topbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: '64px', background: 'white', borderBottom: '1px solid #e0e3e6', flexShrink: 0, width: '100%', boxSizing: 'border-box' }}>
      <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
        {title}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Real-time Offline-compatible Printer Status Badge */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: isPrinterConnected ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${isPrinterConnected ? '#10b981' : '#ef4444'}`,
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '700',
            color: isPrinterConnected ? '#065f46' : '#991b1b',
            transition: 'all 0.2s',
            marginRight: '8px'
          }}
        >
          <PrinterIcon />
          <span>{isPrinterConnected ? "PRINTER: CONNECTED (WIRED)" : "PRINTER: OFFLINE"}</span>
          {!isPrinterConnected && (
            <button
              onClick={handlePairPrinter}
              style={{
                marginLeft: '6px',
                background: '#991b1b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '9px',
                fontWeight: '700',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              Link
            </button>
          )}
        </div>

        <button 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            background: 'white',
            color: '#334155',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <StoreIcon /> {loggedBranch}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '13px', fontWeight: '500' }}>
          <ClockIcon /> {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>

        <div style={{ color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><WifiIcon /></div>

        {/* Premium Notification Bell with Dropdown */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            style={{ 
              color: '#64748b', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1px solid #e2e8f0',
              justifyContent: 'center',
              background: isNotificationOpen ? '#f1f5f9' : 'white',
              transition: 'all 0.2s',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
            className="notification-bell-btn"
          >
            <BellIcon />
            {notifications.length > 0 && (
              <div 
                style={{ 
                  background: '#ef4444', 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  position: 'absolute', 
                  top: '8px', 
                  right: '8px',
                  boxShadow: '0 0 0 2px white',
                  animation: 'pulse 1.5s infinite'
                }} 
              />
            )}
          </div>

          {isNotificationOpen && (
            <>
              <div 
                onClick={() => setIsNotificationOpen(false)}
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
              />
              <div 
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '320px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                  zIndex: 1000,
                  overflow: 'hidden',
                  animation: 'slideDown 0.2s ease-out'
                }}
              >
                <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '14px' }}>Notifications</span>
                  <span 
                    onClick={() => setNotifications([])} 
                    style={{ fontSize: '11px', color: '#ef4444', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Clear all
                  </span>
                </div>
                <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f8fafc', transition: 'background-color 0.2s', cursor: 'pointer' }} className="notification-item">
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#334155', fontWeight: '500', lineHeight: '1.4' }}>{n.text}</p>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{n.time}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                      No notifications.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
