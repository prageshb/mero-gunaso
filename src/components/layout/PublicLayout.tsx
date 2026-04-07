import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Home, LogIn, LayoutDashboard, Send, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/complaints', label: 'Complaints', icon: FileText },
    { path: '/submit', label: 'Report Issue', icon: Send },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 transition-all duration-300">
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xl border-b border-border/40" />
        <div className="container relative flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group transition-transform active:scale-95">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-400 shadow-lg shadow-primary/20 group-hover:rotate-3 transition-all duration-300">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-foreground leading-none">
                Mero Gunaso
              </span>
              {/* <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/70 leading-normal mt-0.5">
                Civic Portal
              </span> */}
            </div>
          </Link>

          <nav className="flex items-center gap-1 bg-muted/30 p-1 rounded-2xl border border-border/40">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 h-9 px-4 rounded-xl transition-all duration-300 ${isActive
                      ? 'bg-background text-primary shadow-sm font-bold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                      }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
                    <span className="hidden md:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated && isAdmin ? (
              <Link to="/admin">
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2 rounded-xl h-10 px-5 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/30"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Admin<span className="hidden md:inline"> Dashboard</span></span>
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:text-foreground h-10 px-3 md:px-4 rounded-xl"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden md:inline">Sign In</span>
                </Button>
              </Link>
            )}

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">{children}</main>

      {/* Modern Footer */}
      <footer className="bg-background border-t border-border/40 py-8 mt-auto">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] text-muted-foreground tracking-widest font-black uppercase">
              © {new Date().getFullYear()} PRAGESH BHANDARI. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-6 text-[10px] font-black tracking-widest text-muted-foreground">
              <a href="#" className="hover:text-primary transition-all active:scale-95">TWITTER</a>
              <a href="#" className="hover:text-primary transition-all active:scale-95">FACEBOOK</a>
              <a href="https://www.linkedin.com/in/prageshbhandari/" className="hover:text-primary transition-all active:scale-95">LINKEDIN</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Separator component if not available, otherwise import it
const Separator = ({ className }: { className?: string }) => (
  <div className={`h-[1px] w-full ${className}`} />
);