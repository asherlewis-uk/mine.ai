"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server, Radio, Cloud, Wifi, ArrowRight } from "lucide-react"

interface NetworkMapProps {
  isScanning: boolean
}

export function NetworkMap({ isScanning }: NetworkMapProps) {
  return (
    <Card className="glass-card p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Network Topology</h3>
          <p className="text-sm text-muted-foreground">Parent-to-Child Hierarchy</p>
        </div>
        {isScanning && (
          <Badge variant="outline" className="border-primary/50 text-primary animate-pulse">
            Scanning...
          </Badge>
        )}
      </div>

      <div className="relative min-h-[300px]">
        <svg
          className="w-full h-full absolute inset-0"
          viewBox="0 0 600 300"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--host))" />
              <stop offset="100%" stopColor="hsl(var(--primary))" />
            </linearGradient>
            <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--satellite))" />
            </linearGradient>
            <filter id="glowFilter">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connection Lines */}
          {/* Host to Cloudflare */}
          <path
            d="M 100 150 C 200 150 200 75 300 75"
            fill="none"
            stroke="url(#lineGradient1)"
            strokeWidth="2"
            strokeDasharray={isScanning ? "5 5" : "0"}
            className={isScanning ? "animate-flow-data" : ""}
            filter="url(#glowFilter)"
          />

          {/* Cloudflare to Satellite */}
          <path
            d="M 300 75 C 400 75 400 150 500 150"
            fill="none"
            stroke="url(#lineGradient2)"
            strokeWidth="2"
            strokeDasharray={isScanning ? "5 5" : "0"}
            className={isScanning ? "animate-flow-data" : ""}
            filter="url(#glowFilter)"
          />

          {/* Direct Tether Line (dashed) */}
          <path
            d="M 100 150 Q 300 220 500 150"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.5"
          />

          {/* Data Flow Particles */}
          {isScanning && (
            <>
              <circle r="4" fill="hsl(var(--primary))" filter="url(#glowFilter)">
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  path="M 100 150 C 200 150 200 75 300 75"
                />
              </circle>
              <circle r="4" fill="hsl(var(--satellite))" filter="url(#glowFilter)">
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  path="M 300 75 C 400 75 400 150 500 150"
                />
              </circle>
            </>
          )}
        </svg>

        {/* Network Nodes */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          {/* Host Node */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-2xl glass-card flex items-center justify-center glow-host">
              <Server className="w-10 h-10 text-host" />
            </div>
            <span className="text-sm font-medium text-foreground">Host</span>
            <Badge variant="outline" className="border-host/50 text-host text-xs">
              Parent
            </Badge>
          </div>

          {/* Cloudflare Tunnel Node */}
          <div className="flex flex-col items-center gap-2 -mt-20">
            <div className="w-16 h-16 rounded-xl glass-card flex items-center justify-center border-primary/50">
              <Cloud className="w-8 h-8 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">Cloudflare</span>
            <Badge variant="outline" className="border-primary/50 text-primary text-xs">
              Tunnel
            </Badge>
          </div>

          {/* Satellite Node */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-2xl glass-card flex items-center justify-center glow-satellite">
              <Radio className="w-10 h-10 text-satellite" />
            </div>
            <span className="text-sm font-medium text-foreground">Satellite</span>
            <Badge variant="outline" className="border-satellite/50 text-satellite text-xs">
              Child
            </Badge>
          </div>
        </div>
      </div>

      {/* Connection Details */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/30">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">Protocol</div>
          <div className="font-medium text-foreground">QUIC/HTTP3</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">Encryption</div>
          <div className="font-medium text-foreground">TLS 1.3</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">Tunnel ID</div>
          <div className="font-mono text-sm text-primary">cf-t7x9k2m1</div>
        </div>
      </div>
    </Card>
  )
}
