import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Users from './pages/Users';
import Branches from './pages/Branches';
import POS from './pages/POS';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import TableManagement from './pages/TableManagement';
import MenuManagement from './pages/MenuManagement';
import Events from './pages/Events';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/branches" replace />} />
        <Route path="/users" element={<Users />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/tables" element={<TableManagement />} />
        <Route path="/menu-management" element={<MenuManagement />} />
        <Route path="/events" element={<Events />} />
      </Routes>
    </Router>
  );
}

