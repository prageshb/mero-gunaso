import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Home, LogIn, LayoutDashboard, Send, ShieldCheck, Instagram, Facebook, Linkedin, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
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

          <nav className="hidden md:flex items-center gap-1 bg-muted/30 p-1 rounded-2xl border border-border/40">
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
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && isAdmin ? (
              <Link to="/admin">
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2 rounded-xl h-10 px-5 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/30"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:text-foreground h-10 px-4 rounded-xl"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl">
                  <Menu className="h-7 w-7" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[350px] flex flex-col pt-12">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-2">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link key={item.path} to={item.path}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start gap-3 h-12 rounded-xl transition-all duration-300 ${isActive
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                        >
                          <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                          <span className="text-base">{item.label}</span>
                        </Button>
                      </Link>
                    );
                  })}
                </div>
                
                <div className="mt-4 border-t pt-4">
                  {isAuthenticated && isAdmin ? (
                    <Link to="/admin">
                      <Button
                        variant="default"
                        className="w-full gap-2 rounded-xl h-12 shadow-lg shadow-primary/20"
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Admin Dashboard</span>
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/login">
                      <Button
                        variant="outline"
                        className="w-full gap-2 h-12 rounded-xl"
                      >
                        <LogIn className="h-5 w-5" />
                        <span>Sign In</span>
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">{children}</main>

      {/* Modern Footer */}
      <footer className="bg-[#06122d] py-12 mt-auto text-white">
        <div className="container px-6">
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="flex items-center gap-8">
              <a href="#" className="text-slate-400 hover:text-white transition-all hover:-translate-y-1" aria-label="Instagram">
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-all hover:-translate-y-1" aria-label="Facebook">
                <Facebook className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a href="https://www.linkedin.com/in/prageshbhandari/" className="text-slate-400 hover:text-white transition-all hover:-translate-y-1" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" strokeWidth={1.5} />
              </a>
            </div>
            <p className="text-[10px] text-slate-500 tracking-widest font-bold uppercase text-center">
              © {new Date().getFullYear()} PRAGESH BHANDARI. ALL RIGHTS RESERVED.
            </p>
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