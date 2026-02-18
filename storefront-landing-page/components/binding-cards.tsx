"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Server,
  Radio,
  Cpu,
  HardDrive,
  Thermometer,
  Zap,
  Wifi,
  Link,
  Unlink,
  RefreshCw,
} from "lucide-react"

interface BindingCardsProps {
  isScanning: boolean
}

export function BindingCards({ isScanning }: BindingCardsProps) {
  const [hostMetrics, setHostMetrics] = useState({
    cpuUsage: 45,
    gpuUsage: 72,
    vramUsed: 18.4,
    vramTotal: 24,
    memoryUsed: 48,
    memoryTotal: 64,
    temperature: 67,
    powerDraw: 285,
  })

  const [satelliteMetrics, setSatelliteMetrics] = useState({
    tokensUsed: 12450,
    tokensLimit: 50000,
    activeStreams: 2,
    latency: 12,
    bandwidth: 856,
    uptime: 99.9,
  })

  const [tethered, setTethered] = useState(true)

  // Simulate metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHostMetrics((prev) => ({
        ...prev,
        cpuUsage: Math.min(100, Math.max(20, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        gpuUsage: Math.min(100, Math.max(40, prev.gpuUsage + (Math.random() - 0.5) * 8)),
        vramUsed: Math.min(24, Math.max(8, prev.vramUsed + (Math.random() - 0.5) * 2)),
        temperature: Math.min(85, Math.max(55, prev.temperature + (Math.random() - 0.5) * 4)),
        powerDraw: Math.min(350, Math.max(200, prev.powerDraw + (Math.random() - 0.5) * 20)),
      }))

      setSatelliteMetrics((prev) => ({
        ...prev,
        tokensUsed: Math.min(50000, prev.tokensUsed + Math.floor(Math.random() * 50)),
        latency: Math.min(50, Math.max(5, prev.latency + (Math.random() - 0.5) * 4)),
        bandwidth: Math.min(1000, Math.max(500, prev.bandwidth + (Math.random() - 0.5) * 50)),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const vramPercentage = (hostMetrics.vramUsed / hostMetrics.vramTotal) * 100
  const tokenPercentage = (satelliteMetrics.tokensUsed / satelliteMetrics.tokensLimit) * 100

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Host Machine Card (Parent) */}
        <Card className="glass-card p-6 glow-host relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-host/5 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-host/20 flex items-center justify-center">
                  <Server className="w-6 h-6 text-host" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Host Machine</h3>
                  <p className="text-sm text-muted-foreground">Parent Anchor</p>
                </div>
              </div>
              <Badge variant="outline" className="border-host/50 text-host">
                Primary
              </Badge>
            </div>

            {/* Hardware Metrics */}
            <div className="space-y-4">
              {/* CPU */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> CPU Usage
                  </span>
                  <span className="text-foreground font-medium">{hostMetrics.cpuUsage.toFixed(1)}%</span>
                </div>
                <Progress value={hostMetrics.cpuUsage} className="h-2 bg-secondary" />
              </div>

              {/* GPU */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Zap className="w-4 h-4" /> GPU Usage
                  </span>
                  <span className="text-foreground font-medium">{hostMetrics.gpuUsage.toFixed(1)}%</span>
                </div>
                <Progress value={hostMetrics.gpuUsage} className="h-2 bg-secondary" />
              </div>

              {/* VRAM - Main Focus */}
              <div className="space-y-2 p-3 rounded-lg bg-host/10 border border-host/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-host flex items-center gap-2 font-medium">
                    <HardDrive className="w-4 h-4" /> GPU VRAM
                  </span>
                  <span className="text-foreground font-medium">
                    {hostMetrics.vramUsed.toFixed(1)} / {hostMetrics.vramTotal} GB
                  </span>
                </div>
                <Progress value={vramPercentage} className="h-3 bg-secondary" />
                <p className="text-xs text-muted-foreground">
                  {(hostMetrics.vramTotal - hostMetrics.vramUsed).toFixed(1)} GB available for tethering
                </p>
              </div>

              {/* Temperature & Power */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Thermometer className="w-3 h-3" /> Temperature
                  </div>
                  <span className="text-lg font-semibold text-foreground">{hostMetrics.temperature}°C</span>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Zap className="w-3 h-3" /> Power Draw
                  </div>
                  <span className="text-lg font-semibold text-foreground">{hostMetrics.powerDraw}W</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Satellite Device Card (Child) */}
        <Card className="glass-card p-6 glow-satellite relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-satellite/5 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-satellite/20 flex items-center justify-center">
                  <Radio className="w-6 h-6 text-satellite" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Satellite Device</h3>
                  <p className="text-sm text-muted-foreground">Child Node</p>
                </div>
              </div>
              <Badge variant="outline" className="border-satellite/50 text-satellite">
                Tethered
              </Badge>
            </div>

            {/* Token Metrics */}
            <div className="space-y-4">
              {/* Tokens Used */}
              <div className="space-y-2 p-3 rounded-lg bg-satellite/10 border border-satellite/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-satellite flex items-center gap-2 font-medium">
                    <Zap className="w-4 h-4" /> Token Usage
                  </span>
                  <span className="text-foreground font-medium">
                    {satelliteMetrics.tokensUsed.toLocaleString()} / {satelliteMetrics.tokensLimit.toLocaleString()}
                  </span>
                </div>
                <Progress value={tokenPercentage} className="h-3 bg-secondary" />
                <p className="text-xs text-muted-foreground">
                  {(satelliteMetrics.tokensLimit - satelliteMetrics.tokensUsed).toLocaleString()} tokens remaining
                </p>
              </div>

              {/* Active Streams */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Wifi className="w-4 h-4" /> Active Streams
                  </span>
                  <span className="text-foreground font-medium">{satelliteMetrics.activeStreams}</span>
                </div>
                <Progress value={satelliteMetrics.activeStreams * 33} className="h-2 bg-secondary" />
              </div>

              {/* Connection Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <RefreshCw className="w-3 h-3" /> Latency
                  </div>
                  <span className="text-lg font-semibold text-foreground">{satelliteMetrics.latency.toFixed(0)}ms</span>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Wifi className="w-3 h-3" /> Bandwidth
                  </div>
                  <span className="text-lg font-semibold text-foreground">{satelliteMetrics.bandwidth.toFixed(0)} Mbps</span>
                </div>
              </div>

              {/* Uptime */}
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Uptime</span>
                  <span className="text-host font-semibold">{satelliteMetrics.uptime}%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Visual Tether */}
      <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
        <svg
          width="200"
          height="120"
          viewBox="0 0 200 120"
          className="overflow-visible"
        >
          {/* Main Tether Line */}
          <defs>
            <linearGradient id="tetherGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--host))" />
              <stop offset="50%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--satellite))" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Line */}
          <path
            d="M 0 60 Q 100 60 200 60"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Animated Data Flow */}
          {tethered && (
            <>
              <path
                d="M 0 60 Q 100 60 200 60"
                fill="none"
                stroke="url(#tetherGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="10 5"
                filter="url(#glow)"
                className="animate-flow-data"
              />
              
              {/* VRAM Flow Indicator */}
              <g className="animate-pulse-tether">
                <circle cx="100" cy="60" r="8" fill="hsl(var(--primary))" opacity="0.5" />
                <circle cx="100" cy="60" r="4" fill="hsl(var(--primary))" />
              </g>
            </>
          )}

          {/* Connection Nodes */}
          <circle cx="0" cy="60" r="6" fill="hsl(var(--host))" filter="url(#glow)" />
          <circle cx="200" cy="60" r="6" fill="hsl(var(--satellite))" filter="url(#glow)" />

          {/* VRAM Label */}
          <text x="100" y="40" textAnchor="middle" className="fill-muted-foreground text-xs">
            GPU VRAM
          </text>
          <text x="100" y="90" textAnchor="middle" className="fill-primary text-xs font-medium">
            {(hostMetrics.vramTotal - hostMetrics.vramUsed).toFixed(1)} GB
          </text>
        </svg>
      </div>

      {/* Tether Control */}
      <div className="flex justify-center mt-6 lg:mt-8">
        <Button
          variant={tethered ? "outline" : "default"}
          onClick={() => setTethered(!tethered)}
          className={tethered ? "border-primary/50 text-primary hover:bg-primary/10" : "bg-primary text-primary-foreground"}
          disabled={isScanning}
        >
          {tethered ? (
            <>
              <Unlink className="w-4 h-4 mr-2" />
              Disconnect Tether
            </>
          ) : (
            <>
              <Link className="w-4 h-4 mr-2" />
              Establish Tether
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
