import { Link, useLocation } from "wouter";
import { LayoutDashboard, Map, Video, Settings, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/analysis", label: "Video Analysis", icon: Video },
    { href: "/map", label: "Global Map", icon: Map },
    { href: "/settings", label: "System", icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-display tracking-tight text-foreground">TrafficAI</h1>
          <p className="text-xs text-muted-foreground font-medium">Analytics Platform</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => {
          const isActive = location === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium",
                isActive
                  ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "group-hover:text-primary")} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t border-border/50">
        <div className="p-4 rounded-xl bg-gradient-to-br from-secondary to-card border border-border">
          <p className="text-sm font-medium text-foreground">System Status</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
