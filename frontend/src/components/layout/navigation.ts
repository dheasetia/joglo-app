import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  User,
  UserSquare2,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { UserRole } from '../../types';

export interface NavigationItem {
  name: string;
  path: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    roles: [UserRole.ADMIN, UserRole.MUHAFFIZH],
  },
  {
    name: 'Halaqah',
    path: '/halaqah',
    icon: Users,
    roles: [UserRole.ADMIN, UserRole.MUHAFFIZH],
  },
  {
    name: 'Santri',
    path: '/student',
    icon: GraduationCap,
    roles: [UserRole.ADMIN, UserRole.MUHAFFIZH],
  },
  {
    name: "Tasmi'",
    path: '/session',
    icon: BookOpen,
    roles: [UserRole.ADMIN, UserRole.MUHAFFIZH],
  },
  {
    name: 'Ujian',
    path: '/exam',
    icon: ClipboardCheck,
    roles: [UserRole.ADMIN, UserRole.MUHAFFIZH],
  },
  {
    name: 'Laporan',
    path: '/reports',
    icon: BarChart3,
    roles: [UserRole.ADMIN, UserRole.MUHAFFIZH],
  },
  {
    name: 'Profilku',
    path: '/profile',
    icon: User,
    roles: [UserRole.MUHAFFIZH],
  },
  {
    name: 'Muhaffizh',
    path: '/teacher',
    icon: UserSquare2,
    roles: [UserRole.ADMIN],
  },
  {
    name: 'Pengguna',
    path: '/users',
    icon: UserSquare2,
    roles: [UserRole.ADMIN],
  },
];