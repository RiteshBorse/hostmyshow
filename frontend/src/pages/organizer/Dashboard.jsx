import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => (
  <div className="flex min-h-screen text-white">
    {/* Sidebar */}
    <Sidebar />
    {/* Main Content (renders nested routes) */}
    <main className="flex-1 p-10">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
