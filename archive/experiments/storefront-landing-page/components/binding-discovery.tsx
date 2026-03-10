"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Radar,
  Cloud,
  Server,
  Radio,
  Check,
  Loader2,
  Shield,
} from "lucide-react"

interface BindingDiscoveryProps {
  onScanComplete: () => void
  isScanning: boolean
  setIsScanning: (scanning: boolean) => void
}

export function BindingDiscovery({
  onScanComplete,
  isScanning,
  setIsScanning,
}: BindingDiscoveryProps) {
  const [scanStage, setScanStage] = useState(0)
  const [discoveredHost, setDiscoveredHost] = useState(false)

  const scanStages = [
    { label: "Initializing Cloudflare Tunnel...", icon: Cloud },
    { label: "Scanning for Parent Anchor...", icon: Radar },
    { label: "Authenticating Connection...", icon: Shield },
    { label: "Establishing Tether...", icon: Server },
  ]

  const startDiscovery = () => {
    setIsScanning(true)
    setScanStage(0)
    setDiscoveredHost(false)

    // Simulate scanning stages
    const stageInterval = setInterval(() => {
      setScanStage((prev) => {
        if (prev >= scanStages.length - 1) {
          clearInterval(stageInterval)
          setDiscoveredHost(true)
          setTimeout(() => {
            setIsScanning(false)
            onScanComplete()
          }, 1000)
          return prev
        }
        return prev + 1
      })
    }, 1500)
  }

  return (
    <Card className="glass-card p-6 relative overflow-hidden">
      {/* Animated Background */}
      {isScanning && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-48 h-48 rounded-full border border-primary/30 animate-scan-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-primary/40 animate-scan-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-primary/50 animate-scan-pulse" style={{ animationDelay: "1s" }} />
          </div>
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Binding Discovery</h3>
            <p className="text-sm text-muted-foreground">
              Scan for Parent Anchor via Cloudflare Tunnel
            </p>
          </div>
          {discoveredHost && (
            <Badge variant="outline" className="border-host/50 text-host">
              <Check className="w-3 h-3 mr-1" />
              Host Found
            </Badge>
          )}
        </div>

        {/* Scan Stages */}
        {isScanning && (
          <div className="space-y-3 mb-6">
            {scanStages.map((stage, index) => {
              const StageIcon = stage.icon
              const isActive = index === scanStage
              const isComplete = index < scanStage

              return (
                <div
                  key={stage.label}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary/10 border border-primary/30"
                      : isComplete
                      ? "bg-host/10 border border-host/30"
                      : "bg-secondary/30 border border-transparent"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive
                        ? "bg-primary/20"
                        : isComplete
                        ? "bg-host/20"
                        : "bg-secondary/50"
                    }`}
                  >
                    {isActive ? (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    ) : isComplete ? (
                      <Check className="w-4 h-4 text-host" />
                    ) : (
                      <StageIcon className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      isActive
                        ? "text-primary font-medium"
                        : isComplete
                        ? "text-host"
                        : "text-muted-foreground"
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Discovery Result */}
        {discoveredHost && !isScanning && (
          <div className="p-4 rounded-lg bg-host/10 border border-host/30 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-host/20 flex items-center justify-center">
                <Server className="w-6 h-6 text-host" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">Parent Host Discovered</h4>
                <p className="text-sm text-muted-foreground">host-primary.tetherops.local</p>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-satellite" />
                <span className="text-sm text-satellite font-medium">Tethered</span>
              </div>
            </div>
          </div>
        )}

        {/* Discovery Button */}
        <Button
          onClick={startDiscovery}
          disabled={isScanning}
          className={`w-full ${
            isScanning
              ? "bg-secondary text-muted-foreground"
              : "bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
          }`}
        >
          {isScanning ? (
            <>
              <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 border-t-primary animate-spin mr-2" />
              Scanning...
            </>
          ) : (
            <>
              <Radar className="w-4 h-4 mr-2" />
              Start Binding Discovery
            </>
          )}
        </Button>

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          This will scan your network through Cloudflare Tunnel to locate available Parent Anchors
        </p>
      </div>
    </Card>
  )
}
