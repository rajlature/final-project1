import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: "primary" | "accent" | "green" | "orange";
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, color = "primary" }: StatsCardProps) {
  const colorStyles = {
    primary: "from-primary/20 to-primary/5 text-primary border-primary/20",
    accent: "from-accent/20 to-accent/5 text-accent border-accent/20",
    green: "from-green-500/20 to-green-500/5 text-green-500 border-green-500/20",
    orange: "from-orange-500/20 to-orange-500/5 text-orange-500 border-orange-500/20",
  };

  return (
    <Card className="bg-card/50 border-border/50 overflow-hidden relative group hover:border-border transition-all duration-300">
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", colorStyles[color])} />
      
      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start">
          <div className={cn("p-3 rounded-xl bg-background/50 border backdrop-blur-sm", colorStyles[color])}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <span className={cn("text-xs font-medium px-2 py-1 rounded-full bg-background/50 border", trendUp ? "text-green-500 border-green-500/20" : "text-red-500 border-red-500/20")}>
              {trend}
            </span>
          )}
        </div>
        
        <div className="mt-4">
          <h3 className="text-3xl font-bold font-display tracking-tight text-foreground">{value}</h3>
          <p className="text-sm text-muted-foreground font-medium mt-1">{title}</p>
        </div>
      </div>
    </Card>
  );
}
