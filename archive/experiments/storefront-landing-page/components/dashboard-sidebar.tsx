"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Network,
  Server,
  Container,
  Activity,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Radio,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  onLogout: () => void
}

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "bindings", label: "Bindings", icon: Network },
  { id: "host", label: "Host Machine", icon: Server },
  { id: "satellite", label: "Satellite", icon: Radio },
  { id: "containers", label: "Containers", icon: Container },
  { id: "stream", label: "Stream Monitor", icon: Activity },
]

const bottomItems = [
  { id: "settings", label: "Settings", icon: Settings },
]

export function DashboardSidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  onLogout,
}: DashboardSidebarProps) {
  return (
    <aside
      className={cn(
        "h-screen flex flex-col glass-card border-r border-border/30 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-border/30">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <Cpu className="w-5 h-5 text-primary" />
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold text-foreground">TetherOps</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
              activeTab === item.id
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-border/30 space-y-1">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
              activeTab === item.id
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
        
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-border/30">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
