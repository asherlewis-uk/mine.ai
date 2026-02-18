"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Container,
  Play,
  Square,
  RotateCw,
  Trash2,
  Plus,
  Server,
  Radio,
  MoreVertical,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ContainerInstance {
  id: string
  name: string
  image: string
  status: "running" | "stopped" | "restarting"
  cpu: number
  memory: number
  ports: string
  anchoredTo: "host"
  managedBy: "satellite"
}

export function DockerGrid() {
  const [containers, setContainers] = useState<ContainerInstance[]>([
    {
      id: "c1",
      name: "nginx-proxy",
      image: "nginx:latest",
      status: "running",
      cpu: 2.4,
      memory: 128,
      ports: "80:80, 443:443",
      anchoredTo: "host",
      managedBy: "satellite",
    },
    {
      id: "c2",
      name: "postgres-db",
      image: "postgres:15",
      status: "running",
      cpu: 8.2,
      memory: 512,
      ports: "5432:5432",
      anchoredTo: "host",
      managedBy: "satellite",
    },
    {
      id: "c3",
      name: "redis-cache",
      image: "redis:alpine",
      status: "running",
      cpu: 1.1,
      memory: 64,
      ports: "6379:6379",
      anchoredTo: "host",
      managedBy: "satellite",
    },
    {
      id: "c4",
      name: "ollama-inference",
      image: "ollama/ollama:latest",
      status: "running",
      cpu: 45.8,
      memory: 4096,
      ports: "11434:11434",
      anchoredTo: "host",
      managedBy: "satellite",
    },
    {
      id: "c5",
      name: "grafana-metrics",
      image: "grafana/grafana:latest",
      status: "stopped",
      cpu: 0,
      memory: 0,
      ports: "3000:3000",
      anchoredTo: "host",
      managedBy: "satellite",
    },
    {
      id: "c6",
      name: "prometheus",
      image: "prom/prometheus:latest",
      status: "running",
      cpu: 3.2,
      memory: 256,
      ports: "9090:9090",
      anchoredTo: "host",
      managedBy: "satellite",
    },
  ])

  const toggleContainer = (id: string) => {
    setContainers((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "running" ? "stopped" : "running" }
          : c
      )
    )
  }

  const restartContainer = (id: string) => {
    setContainers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "restarting" } : c
      )
    )
    setTimeout(() => {
      setContainers((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "running" } : c
        )
      )
    }, 2000)
  }

  const removeContainer = (id: string) => {
    setContainers((prev) => prev.filter((c) => c.id !== id))
  }

  const getStatusColor = (status: ContainerInstance["status"]) => {
    switch (status) {
      case "running":
        return "bg-host text-host-foreground"
      case "stopped":
        return "bg-destructive/20 text-destructive"
      case "restarting":
        return "bg-satellite/20 text-satellite"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Docker Instances</h3>
          <p className="text-sm text-muted-foreground">
            Anchored to Host, Managed by Satellite
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          New Container
        </Button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-host" />
          <span className="text-muted-foreground">Anchored to Host</span>
        </div>
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-satellite" />
          <span className="text-muted-foreground">Managed by Satellite</span>
        </div>
      </div>

      {/* Container Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {containers.map((container) => (
          <Card
            key={container.id}
            className="glass-card p-4 relative overflow-hidden group"
          >
            {/* Anchor Indicator */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-host via-primary to-satellite" />

            <div className="pl-3">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                    <Container className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{container.name}</h4>
                    <p className="text-xs text-muted-foreground">{container.image}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass">
                    <DropdownMenuItem onClick={() => restartContainer(container.id)}>
                      <RotateCw className="w-4 h-4 mr-2" />
                      Restart
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => removeContainer(container.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className={getStatusColor(container.status)}>
                  {container.status === "restarting" && (
                    <RotateCw className="w-3 h-3 mr-1 animate-spin" />
                  )}
                  {container.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{container.ports}</span>
              </div>

              {/* Metrics */}
              {container.status === "running" && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-2 rounded bg-secondary/30">
                    <p className="text-xs text-muted-foreground">CPU</p>
                    <p className="text-sm font-medium text-foreground">{container.cpu}%</p>
                  </div>
                  <div className="p-2 rounded bg-secondary/30">
                    <p className="text-xs text-muted-foreground">Memory</p>
                    <p className="text-sm font-medium text-foreground">{container.memory} MB</p>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Server className="w-3 h-3 text-host" />
                  <span className="text-xs text-muted-foreground">→</span>
                  <Radio className="w-3 h-3 text-satellite" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleContainer(container.id)}
                  className={
                    container.status === "running"
                      ? "text-destructive hover:bg-destructive/10"
                      : "text-host hover:bg-host/10"
                  }
                >
                  {container.status === "running" ? (
                    <>
                      <Square className="w-3 h-3 mr-1" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 mr-1" />
                      Start
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
