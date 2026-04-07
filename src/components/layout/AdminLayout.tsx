import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  Users,
  Building2,
  ClipboardList,
  History,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
interface AdminLayoutProps {
  children: ReactNode;
}
export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout, isSuperAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/complaints', label: 'Complaints', icon: ClipboardList },
  ];
  const superAdminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/complaints', label: 'All Complaints', icon: ClipboardList },
    { path: '/admin/departments', label: 'Departments', icon: Building2 },
    { path: '/admin/users', label: 'Admins', icon: Users },
    { path: '/admin/audit-logs', label: 'Audit Logs', icon: History },
  ];
  const navItems = isSuperAdmin ? superAdminNavItems : adminNavItems;
  return (
    <div className="min-h-screen flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-200 lg:translate-x-0 lg:static',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-400 shadow-lg shadow-primary/20 transition-all duration-300">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-sidebar-foreground leading-none">
                Mero Gunaso
              </span>
            </div>
            <button
              className="ml-auto lg:hidden text-sidebar-foreground/50 hover:text-sidebar-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'nav-item',
                    isActive
                      ? 'nav-item-active'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {/* User Info */}
          <div className="p-6 border-t border-sidebar-border bg-sidebar-accent/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-lg border border-primary/20">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user?.name}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-sidebar-foreground/40 mt-0.5">
                  {isSuperAdmin ? 'Super Admin' : 'Admin'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-sidebar-foreground/60 hover:text-white hover:bg-destructive/10 hover:text-destructive rounded-xl h-11 px-4 transition-all duration-200"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="font-bold">Logout</span>
            </Button>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {navItems.find(item => item.path === location.pathname)?.label || 'Admin Panel'}
            </h1>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm">
              View Public Site
            </Button>
          </Link>
        </header>
        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 bg-background">{children}</main>
      </div>
    </div>
  );
}