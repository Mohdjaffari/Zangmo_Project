import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminExpenses from './pages/admin/AdminExpenses';
import AdminBranches from './pages/admin/AdminBranches';
import AdminHiring from './pages/admin/AdminHiring';
import AdminManagerHiring from './pages/admin/AdminManagerHiring';
import AdminSettings from './pages/admin/AdminSettings';

// Manager Pages
import ManagerDashboard from './pages/managers/ManagerDashboard';
import POS from './pages/managers/POS';
import Inventory from './pages/managers/Inventory';
import Customers from './pages/managers/Customers';
import TableManagement from './pages/managers/TableManagement';
import MenuManagement from './pages/managers/MenuManagement';
import Events from './pages/managers/Events';
import Expenses from './pages/managers/Expenses';
import ManagerHiring from './pages/managers/ManagerHiring';
import ManagerProfile from './pages/managers/ManagerProfile';

import Login from './pages/Login';
import SplashScreen from './components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('zangmo_logged_in') === 'true';
  });

  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const userRole = localStorage.getItem('zangmo_user_role') || 'Manager';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={userRole === 'Admin' ? <AdminDashboard /> : <ManagerDashboard />} />
        
        {/* Manager-only routes */}
        <Route path="/pos" element={userRole === 'Manager' ? <POS /> : <Navigate to="/dashboard" replace />} />
        <Route path="/inventory" element={userRole === 'Manager' ? <Inventory /> : <Navigate to="/dashboard" replace />} />
        <Route path="/customers" element={userRole === 'Manager' ? <Customers /> : <Navigate to="/dashboard" replace />} />
        <Route path="/tables" element={userRole === 'Manager' ? <TableManagement /> : <Navigate to="/dashboard" replace />} />
        <Route path="/menu-management" element={userRole === 'Manager' ? <MenuManagement /> : <Navigate to="/dashboard" replace />} />
        <Route path="/events" element={userRole === 'Manager' ? <Events /> : <Navigate to="/dashboard" replace />} />
        <Route path="/expenses" element={userRole === 'Manager' ? <Expenses /> : <Navigate to="/dashboard" replace />} />
        <Route path="/hiring" element={userRole === 'Manager' ? <ManagerHiring /> : <Navigate to="/dashboard" replace />} />
        <Route path="/profile" element={userRole === 'Manager' ? <ManagerProfile /> : <Navigate to="/dashboard" replace />} />

        {/* Admin-only routes */}
        <Route path="/admin/expenses" element={userRole === 'Admin' ? <AdminExpenses /> : <Navigate to="/dashboard" replace />} />
        <Route path="/admin/branches" element={userRole === 'Admin' ? <AdminBranches /> : <Navigate to="/dashboard" replace />} />
        <Route path="/admin/hiring" element={userRole === 'Admin' ? <AdminHiring /> : <Navigate to="/dashboard" replace />} />
        <Route path="/admin/managers" element={userRole === 'Admin' ? <AdminManagerHiring /> : <Navigate to="/dashboard" replace />} />
        <Route path="/admin/settings" element={userRole === 'Admin' ? <AdminSettings /> : <Navigate to="/dashboard" replace />} />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

