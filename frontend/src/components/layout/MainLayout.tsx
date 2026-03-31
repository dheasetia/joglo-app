import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import { navigationItems } from './navigation';
import { UserRole } from '../../types';

const MainLayout: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const filteredMenu = navigationItems.filter((item) => user && item.roles.includes(user.role));
  const isMuhaffizh = user?.role === UserRole.MUHAFFIZH;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-semibold text-primary">Tahmis</h1>
            {isMuhaffizh ? (
              <Link to="/profile" className="text-xs font-medium text-gray-600">
                Muhaffizh
              </Link>
            ) : (
              <span className="text-xs text-gray-500 capitalize">{user?.role.toLowerCase()}</span>
            )}
          </div>
        </header>
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className={`py-4 px-4 sm:px-6 lg:px-8 ${isMuhaffizh ? 'pb-24 md:pb-6' : 'pb-6'}`}>
            <Outlet />
          </div>
        </main>
      </div>

      {isMuhaffizh && <MobileBottomNav menuItems={filteredMenu} />}
    </div>
  );
};

export default MainLayout;
