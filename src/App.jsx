import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import OwnerDashboard from './pages/admin/OwnerDashboard';
import AdminExpenses from './pages/admin/AdminExpenses';
import AdminBranches from './pages/admin/AdminBranches';
import AdminHiring from './pages/admin/AdminHiring';
import AdminManagerHiring from './pages/admin/AdminManagerHiring';
import AdminSettings from './pages/admin/AdminSettings';
import AdminReports from './pages/admin/AdminReports';
import AdminPayroll from './pages/admin/AdminPayroll';
import AdminCreditJournal from './pages/admin/AdminCreditJournal';
import BranchComparison from './pages/admin/BranchComparison';
import AdminProfile from './pages/admin/AdminProfile';

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

  const userRole = (localStorage.getItem('zangmo_user_role') || 'Manager').trim().toLowerCase();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={userRole === 'admin' ? <OwnerDashboard /> : <ManagerDashboard />} />

        {/* Manager-only routes */}
        <Route path="/pos" element={userRole === 'manager' ? <POS /> : <Navigate to="/dashboard" replace />} />
        <Route path="/inventory" element={userRole === 'manager' ? <Inventory /> : <Navigate to="/dashboard" replace />} />
        <Route path="/customers" element={userRole === 'manager' ? <Customers /> : <Navigate to="/dashboard" replace />} />
        <Route path="/tables" element={userRole === 'manager' ? <TableManagement /> : <Navigate to="/dashboard" replace />} />
        <Route path="/menu-management" element={userRole === 'manager' ? <MenuManagement /> : <Navigate to="/dashboard" replace />} />
        <Route path="/events" element={userRole === 'manager' ? <Events /> : <Navigate to="/dashboard" replace />} />
        <Route path="/expenses" element={userRole === 'manager' ? <Expenses /> : <Navigate to="/dashboard" replace />} />
        <Route path="/hiring" element={userRole === 'manager' ? <ManagerHiring /> : <Navigate to="/dashboard" replace />} />
        <Route path="/profile" element={userRole === 'manager' ? <ManagerProfile /> : <Navigate to="/dashboard" replace />} />

        {/* Admin-only routes */}
        <Route path="/admin/owner" element={<Navigate to="/dashboard" replace />} />
        <Route path="/admin/expenses" element={userRole === 'admin' ? <AdminExpenses /> : <Navigate to="/dashboard" replace />} />
        <Route path="/admin/reports" element={userRole === 'admin' ? <BranchComparison /> : <Navigate to="/dashboard" replace />} />
        <Route path="/admin/reports-detailed" element={userRole === 'admin' ? <AdminReports /> : <Navigate to="/dashboard" replace />} />
        <Route path="/admin/branches" element={userRole === 'admin' ? <AdminBranches /> : <Navigate to="/dashboard" replace />} />
        <Route path="/admin/hiring" element={userRole === 'admin' ? <AdminHiring /> : <Navigate to="/dashboard" replace />} />
        <Route path="/admin/managers" element={userRole === 'admin' ? <AdminManagerHiring /> : <Navigate to="/dashboard" replace />} />
        <Route path="/admin/payroll" element={userRole === 'admin' ? <AdminPayroll /> : <Navigate to="/dashboard" replace />} />
        <Route path="/admin/journal" element={userRole === 'admin' ? <AdminCreditJournal /> : <Navigate to="/dashboard" replace />} />
        <Route path="/admin/settings" element={userRole === 'admin' ? <AdminSettings /> : <Navigate to="/dashboard" replace />} />
        <Route path="/admin/profile" element={userRole === 'admin' ? <AdminProfile /> : <Navigate to="/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

