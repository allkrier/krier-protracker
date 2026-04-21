import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, PlusCircle, History, LineChart, User } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/log", label: "Log Food", icon: PlusCircle },
    { href: "/history", label: "History", icon: History },
    { href: "/insights", label: "Insights", icon: LineChart },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-[100dvh] bg-background text-foreground pb-16 md:pb-0 md:pl-64 flex flex-col">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed top-0 bottom-0 left-0 bg-card border-r border-border">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary tracking-tight">ProTracker</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
                data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-8 animate-in fade-in duration-300">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around p-2 pb-safe z-50">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid={`nav-mobile-${item.label.toLowerCase().replace(" ", "-")}`}
            >
              <div className={`p-1.5 rounded-full ${isActive ? "bg-primary/10" : ""}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
