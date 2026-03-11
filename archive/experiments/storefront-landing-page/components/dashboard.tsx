"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { BindingCards } from "@/components/binding-cards"
import { DockerGrid } from "@/components/docker-grid"
import { NetworkMap } from "@/components/network-map"
import { StreamMonitor } from "@/components/stream-monitor"
import { BindingDiscovery } from "@/components/binding-discovery"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Server,
  Radio,
  Container,
  Cpu,
  HardDrive,
  Zap,
  Clock,
} from "lucide-react"

interface DashboardProps {
  onLogout: () => void
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [collapsed, setCollapsed] = useState(false)
  const [isScanning, setIsScanning] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab isScanning={isScanning} setIsScanning={setIsScanning} />
      case "bindings":
        return <BindingsTab isScanning={isScanning} setIsScanning={setIsScanning} />
      case "host":
        return <HostTab />
      case "satellite":
        return <SatelliteTab />
      case "containers":
        return <ContainersTab />
      case "stream":
        return <StreamMonitor />
      case "settings":
        return <SettingsTab />
      default:
        return <OverviewTab isScanning={isScanning} setIsScanning={setIsScanning} />
    }
  }

  return (
    <div className="flex h-screen obsidian-depth">
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

function OverviewTab({ isScanning, setIsScanning }: { isScanning: boolean; setIsScanning: (s: boolean) => void }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Unified Workspace</h1>
          <p className="text-muted-foreground">Host-to-Satellite Tether Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-host/50 text-host">
            <div className="w-2 h-2 rounded-full bg-host mr-2 animate-pulse" />
            Host Online
          </Badge>
          <Badge variant="outline" className="border-satellite/50 text-satellite">
            <div className="w-2 h-2 rounded-full bg-satellite mr-2 animate-pulse" />
            Satellite Connected
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-host/20 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-host" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CPU Usage</p>
              <p className="text-xl font-semibold text-foreground">45%</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">VRAM Tethered</p>
              <p className="text-xl font-semibold text-foreground">5.6 GB</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-satellite/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-satellite" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tokens Used</p>
              <p className="text-xl font-semibold text-foreground">12.4K</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Container className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Containers</p>
              <p className="text-xl font-semibold text-foreground">6 Active</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Binding Cards */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Parent-Child Binding</h2>
        <BindingCards isScanning={isScanning} />
      </div>

      {/* Network Map */}
      <NetworkMap isScanning={isScanning} />

      {/* Docker Grid Preview */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Container Instances</h2>
        <DockerGrid />
      </div>
    </div>
  )
}

function BindingsTab({ isScanning, setIsScanning }: { isScanning: boolean; setIsScanning: (s: boolean) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Binding Management</h1>
        <p className="text-muted-foreground">Configure Host-to-Satellite connections</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BindingCards isScanning={isScanning} />
        </div>
        <div>
          <BindingDiscovery
            onScanComplete={() => {}}
            isScanning={isScanning}
            setIsScanning={setIsScanning}
          />
        </div>
      </div>

      <NetworkMap isScanning={isScanning} />
    </div>
  )
}

function HostTab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Host Machine</h1>
        <p className="text-muted-foreground">Parent Anchor System Details</p>
      </div>

      <Card className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-host/20 flex items-center justify-center glow-host">
            <Server className="w-8 h-8 text-host" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Primary Host</h2>
            <p className="text-muted-foreground">host-primary.tetherops.local</p>
          </div>
          <Badge variant="outline" className="ml-auto border-host/50 text-host">
            Online
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">GPU</p>
            <p className="font-semibold text-foreground">RTX 4090</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">VRAM</p>
            <p className="font-semibold text-foreground">24 GB GDDR6X</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">CPU</p>
            <p className="font-semibold text-foreground">Ryzen 9 7950X</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">RAM</p>
            <p className="font-semibold text-foreground">64 GB DDR5</p>
          </div>
        </div>
      </Card>

      <BindingCards isScanning={false} />
    </div>
  )
}

function SatelliteTab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Satellite Device</h1>
        <p className="text-muted-foreground">Child Node Configuration</p>
      </div>

      <Card className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-satellite/20 flex items-center justify-center glow-satellite">
            <Radio className="w-8 h-8 text-satellite" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Satellite-01</h2>
            <p className="text-muted-foreground">satellite-01.tetherops.local</p>
          </div>
          <Badge variant="outline" className="ml-auto border-satellite/50 text-satellite">
            Tethered
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Device Type</p>
            <p className="font-semibold text-foreground">Thin Client</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Token Limit</p>
            <p className="font-semibold text-foreground">50,000/mo</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Connection</p>
            <p className="font-semibold text-foreground">Cloudflare</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Uptime</p>
            <p className="font-semibold text-foreground">99.9%</p>
          </div>
        </div>
      </Card>

      <StreamMonitor />
    </div>
  )
}

function ContainersTab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Docker Containers</h1>
        <p className="text-muted-foreground">Anchored to Host, Managed by Satellite</p>
      </div>

      <DockerGrid />
    </div>
  )
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure your workspace</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Tunnel Configuration</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-muted-foreground">Cloudflare Tunnel ID</span>
              <span className="font-mono text-sm text-primary">cf-t7x9k2m1</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-muted-foreground">Protocol</span>
              <span className="text-foreground">QUIC</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-muted-foreground">Encryption</span>
              <span className="text-foreground">TLS 1.3</span>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Subscription</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30">
              <span className="text-foreground font-medium">Admin Plan</span>
              <Badge className="bg-primary text-primary-foreground">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-muted-foreground">Hosts Allowed</span>
              <span className="text-foreground">3 / 3</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-muted-foreground">Satellites Allowed</span>
              <span className="text-foreground">2 / 5</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
