"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Sun,
  Moon,
  Play,
  Pause,
  Monitor,
  Wifi,
  Gauge,
  Maximize2,
  Volume2,
  Settings,
} from "lucide-react"

export function StreamMonitor() {
  const [sunshineActive, setSunshineActive] = useState(true)
  const [moonlightConnected, setMoonlightConnected] = useState(true)

  const [streamMetrics, setStreamMetrics] = useState({
    fps: 60,
    bitrate: 45.2,
    latency: 8,
    packetLoss: 0.1,
    resolution: "1920x1080",
    codec: "HEVC",
    clients: 1,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStreamMetrics((prev) => ({
        ...prev,
        fps: Math.min(60, Math.max(55, prev.fps + (Math.random() - 0.5) * 4)),
        bitrate: Math.min(60, Math.max(30, prev.bitrate + (Math.random() - 0.5) * 5)),
        latency: Math.min(20, Math.max(5, prev.latency + (Math.random() - 0.5) * 3)),
        packetLoss: Math.min(1, Math.max(0, prev.packetLoss + (Math.random() - 0.5) * 0.2)),
      }))
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  const getQualityColor = (fps: number) => {
    if (fps >= 58) return "text-host"
    if (fps >= 50) return "text-satellite"
    return "text-destructive"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Stream Monitor</h3>
          <p className="text-sm text-muted-foreground">Sunshine / Moonlight Status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sunshine Server Card */}
        <Card className="glass-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-satellite/5 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-satellite/20 flex items-center justify-center">
                  <Sun className="w-6 h-6 text-satellite" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Sunshine Server</h4>
                  <p className="text-sm text-muted-foreground">Host Streaming</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={
                  sunshineActive
                    ? "border-host/50 text-host"
                    : "border-muted-foreground/50 text-muted-foreground"
                }
              >
                {sunshineActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Monitor className="w-3 h-3" /> Resolution
                  </div>
                  <span className="text-sm font-medium text-foreground">{streamMetrics.resolution}</span>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Settings className="w-3 h-3" /> Codec
                  </div>
                  <span className="text-sm font-medium text-foreground">{streamMetrics.codec}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-sm flex items-center gap-2">
                    <Wifi className="w-4 h-4" /> Bitrate
                  </span>
                  <span className="text-foreground font-medium">{streamMetrics.bitrate.toFixed(1)} Mbps</span>
                </div>
                <Progress value={(streamMetrics.bitrate / 60) * 100} className="h-2 bg-secondary" />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={sunshineActive ? "outline" : "default"}
                  onClick={() => setSunshineActive(!sunshineActive)}
                  className={sunshineActive ? "flex-1 border-destructive/50 text-destructive hover:bg-destructive/10" : "flex-1 bg-host hover:bg-host/90 text-background"}
                >
                  {sunshineActive ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" /> Stop Server
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" /> Start Server
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Moonlight Client Card */}
        <Card className="glass-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Moon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Moonlight Client</h4>
                  <p className="text-sm text-muted-foreground">Satellite Receiver</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={
                  moonlightConnected
                    ? "border-host/50 text-host"
                    : "border-muted-foreground/50 text-muted-foreground"
                }
              >
                {moonlightConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Gauge className="w-3 h-3" /> FPS
                  </div>
                  <span className={`text-lg font-semibold ${getQualityColor(streamMetrics.fps)}`}>
                    {streamMetrics.fps.toFixed(0)}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Wifi className="w-3 h-3" /> Latency
                  </div>
                  <span className="text-lg font-semibold text-foreground">{streamMetrics.latency.toFixed(0)}ms</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-sm">Packet Loss</span>
                  <span className={streamMetrics.packetLoss > 0.5 ? "text-destructive" : "text-host"}>
                    {streamMetrics.packetLoss.toFixed(2)}%
                  </span>
                </div>
                <Progress value={streamMetrics.packetLoss * 100} className="h-2 bg-secondary" />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-border/50 bg-transparent"
                >
                  <Maximize2 className="w-4 h-4 mr-2" /> Fullscreen
                </Button>
                <Button
                  variant="outline"
                  className="border-border/50 bg-transparent"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Stream Quality Overview */}
      <Card className="glass-card p-6">
        <h4 className="font-semibold text-foreground mb-4">Stream Quality Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-secondary/30">
            <div className={`text-2xl font-bold ${getQualityColor(streamMetrics.fps)}`}>
              {streamMetrics.fps.toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">FPS</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-secondary/30">
            <div className="text-2xl font-bold text-foreground">{streamMetrics.bitrate.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground mt-1">Mbps</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-secondary/30">
            <div className="text-2xl font-bold text-foreground">{streamMetrics.latency.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground mt-1">ms Latency</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-secondary/30">
            <div className="text-2xl font-bold text-foreground">{streamMetrics.clients}</div>
            <div className="text-xs text-muted-foreground mt-1">Connected</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
