import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { navigationItems } from './navigation';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const filteredMenu = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="hidden md:flex flex-col h-full bg-primary text-white w-64 shadow-xl">
      <div className="p-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <img
            src="/joglo_icon.png"
            alt="Tahmis"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span>Tahmis</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-3 rounded-lg transition-all group",
              isActive 
                ? "bg-accent text-primary font-semibold" 
                : "text-gray-300 hover:bg-[#633041] hover:text-white"
            )}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
            <ChevronRight 
              size={16} 
              className={cn(
                "ml-auto opacity-0 group-hover:opacity-100 transition-opacity",
                "group-[.active]:opacity-100"
              )} 
            />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#633041]">
        <div className="flex items-center gap-3 px-3 py-2 mb-4">
          {user?.photoUrl ? (
            <img
              src={`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}${user.photoUrl}`}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover border border-white/30"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-primary font-bold">
              {user?.name.charAt(0)}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate capitalize">{user?.role.toLowerCase()}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 text-gray-300 hover:bg-red-900/30 hover:text-red-400 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
