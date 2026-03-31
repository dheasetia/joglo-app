import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NavigationItem } from './navigation';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MobileBottomNavProps {
  menuItems: NavigationItem[];
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ menuItems }) => {
  const mobileMenuItems = menuItems.filter((item) =>
    ['/', '/halaqah', '/session', '/exam'].includes(item.path),
  );

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="grid grid-cols-4 gap-1 px-2 py-2">
        {mobileMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center rounded-lg py-2 text-[11px] font-medium transition-colors',
                isActive ? 'text-primary bg-primary/10' : 'text-gray-500',
              )
            }
          >
            <item.icon size={18} />
            <span className="mt-1 truncate max-w-[70px]">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileBottomNav;