import React, { useState } from 'react';
import { Outlet, Navigate, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import { navigationItems } from './navigation';
import { UserRole } from '../../types';
import { Menu, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isMobileAdminMenuOpen, setIsMobileAdminMenuOpen] = useState(false);

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
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 relative z-20">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-sm font-semibold text-primary">
              Tahmis
            </Link>
            {isMuhaffizh ? (
              <Link to="/profile" className="text-xs font-medium text-gray-600">
                Muhaffizh
              </Link>
            ) : isAdmin ? (
              <button
                type="button"
                onClick={() => setIsMobileAdminMenuOpen((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-lg p-2 text-primary hover:bg-primary/10 transition-colors"
                aria-label={isMobileAdminMenuOpen ? 'Tutup menu' : 'Buka menu'}
                aria-expanded={isMobileAdminMenuOpen}
              >
                {isMobileAdminMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            ) : (
              <span className="text-xs text-gray-500 capitalize">{user?.role.toLowerCase()}</span>
            )}
          </div>

          {isAdmin && (
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isMobileAdminMenuOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
              }`}
            >
              <nav
                className={`rounded-lg border border-gray-100 bg-white shadow-sm transition-transform duration-300 ${
                  isMobileAdminMenuOpen ? 'translate-y-0' : '-translate-y-2'
                }`}
              >
                {filteredMenu.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileAdminMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2.5 text-sm border-b border-gray-100 last:border-b-0 transition-colors ${
                        isActive ? 'text-primary font-semibold bg-primary/5' : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    <item.icon size={16} />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
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
