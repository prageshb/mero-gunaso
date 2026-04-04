import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Home, LogIn, Send } from 'lucide-react';
interface PublicLayoutProps {
  children: ReactNode;
}
export function PublicLayout({ children }: PublicLayoutProps) {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/submit', label: 'Submit Complaint', icon: Send },
  ];
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Mero Gunaso
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
            <Link to="/login">
              <Button variant="outline" size="sm" className="gap-2 ml-2">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Admin Login</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1">{children}</main>
      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Mero Gunaso</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} Mero Gunaso. A public grievance management system.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}