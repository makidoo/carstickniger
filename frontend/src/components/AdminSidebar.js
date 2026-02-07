import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  LayoutDashboard,
  Car,
  FileText,
  Settings,
  Users,
  BarChart3,
  ClipboardList,
  LogOut,
  Shield,
  Globe,
  ChevronRight,
  MapPin,
  Bell
} from 'lucide-react';

export const AdminSidebar = () => {
  const { user, logout, isSuperAdmin, isAdmin, isSupervisor, canManageUsers, canManageTaxConfig, canViewAuditLogs } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  // Role labels
  const roleLabels = {
    super_admin: 'Super Admin',
    admin: 'Administrateur',
    supervisor: 'Superviseur',
    agent: 'Agent'
  };

  const roleColors = {
    super_admin: 'bg-purple-500',
    admin: 'bg-blue-500',
    supervisor: 'bg-emerald-500',
    agent: 'bg-slate-500'
  };

  // Build menu items based on role
  const menuItems = [
    { path: '/admin/dashboard', label: t('dashboard'), icon: LayoutDashboard, roles: ['super_admin', 'admin', 'supervisor'] },
    { path: '/admin/vehicles', label: t('vehicles'), icon: Car, roles: ['super_admin', 'admin', 'supervisor'] },
    { path: '/admin/stickers', label: t('stickers'), icon: FileText, roles: ['super_admin', 'admin', 'supervisor'] },
    { path: '/admin/tax-config', label: t('tax_configuration'), icon: Settings, roles: ['super_admin', 'admin'] },
    { path: '/admin/users', label: t('user_management'), icon: Users, roles: ['super_admin', 'admin'] },
    { path: '/admin/notifications', label: 'Notifications', icon: Bell, roles: ['super_admin', 'admin'] },
    { path: '/admin/reports', label: t('reports'), icon: BarChart3, roles: ['super_admin', 'admin', 'supervisor'] },
    { path: '/admin/audit-logs', label: t('audit_logs'), icon: ClipboardList, roles: ['super_admin'] },
  ].filter(item => item.roles.includes(user?.role));

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col z-50">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#E05D26] to-[#C2410C] rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg block">DGI Niger</span>
            <span className="text-xs text-slate-400">Administration</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive(path)
                    ? 'bg-[#E05D26] text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
                {isActive(path) && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Agent Scanner Link */}
        {['super_admin', 'admin', 'supervisor'].includes(user?.role) && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <Link
              to="/agent/scanner"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">Scanner Agent</span>
            </Link>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 space-y-3">
        {/* Language Toggle */}
        <Button
          variant="ghost"
          onClick={toggleLanguage}
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <Globe className="w-4 h-4 mr-3" />
          {language === 'fr' ? 'Français' : 'English'}
        </Button>

        {/* User Info */}
        <div className="px-4 py-3 bg-slate-800 rounded-xl">
          <div className="flex items-center justify-between mb-1">
            <p className="font-medium text-sm">
              {user?.first_name} {user?.last_name}
            </p>
            <Badge className={`${roleColors[user?.role]} text-white text-xs`}>
              {roleLabels[user?.role]}
            </Badge>
          </div>
          {user?.region && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="w-3 h-3" />
              <span>{user.region}</span>
            </div>
          )}
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
        >
          <LogOut className="w-4 h-4 mr-3" />
          {t('logout')}
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
