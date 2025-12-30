import { Sidebar } from "./Sidebar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  header?: ReactNode;
}

export function Layout({ children, header }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground pl-64">
      <Sidebar />
      <div className="p-8">
        {header && <div className="mb-8">{header}</div>}
        <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
