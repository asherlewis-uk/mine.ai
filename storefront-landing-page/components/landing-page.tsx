"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Server,
  Cpu,
  Network,
  Shield,
  Zap,
  ArrowRight,
  Check,
  X,
} from "lucide-react"

interface LandingPageProps {
  onLogin: () => void
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <div className="min-h-screen obsidian-depth relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-host/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-satellite/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
            <Network className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-semibold text-foreground">TetherOps</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <a href="#docs" className="text-muted-foreground hover:text-foreground transition-colors">Docs</a>
        </div>
        <Button
          variant="outline"
          className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 bg-transparent"
          onClick={() => setShowLogin(true)}
        >
          Sign In
        </Button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
          <span className="w-2 h-2 rounded-full bg-host animate-pulse" />
          <span className="text-sm text-muted-foreground">Secure GPU Tethering Technology</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center text-foreground mb-6 text-balance">
          Unified Workspace for
          <br />
          <span className="text-primary">Host-to-Satellite</span> Operations
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mb-12 text-pretty">
          Bridge your Host Machine with Satellite Devices through Cloudflare Tunnels.
          Share GPU VRAM, manage Docker containers, and stream with Sunshine/Moonlight.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 glow-primary"
            onClick={() => setShowLogin(true)}
          >
            Get Started
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border/50 hover:bg-secondary/50 bg-transparent"
          >
            View Documentation
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          <div className="glass-card rounded-xl p-6">
            <div className="w-12 h-12 rounded-lg bg-host/20 flex items-center justify-center mb-4">
              <Server className="w-6 h-6 text-host" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Host Machine Control</h3>
            <p className="text-muted-foreground text-sm">
              Monitor hardware health, GPU utilization, and manage resources from a central dashboard.
            </p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">GPU VRAM Tethering</h3>
            <p className="text-muted-foreground text-sm">
              Pass GPU resources from Parent to Child devices with real-time bandwidth monitoring.
            </p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="w-12 h-12 rounded-lg bg-satellite/20 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-satellite" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Secure Tunnels</h3>
            <p className="text-muted-foreground text-sm">
              Cloudflare-powered tunnels ensure encrypted, low-latency connections between devices.
            </p>
          </div>
        </div>
      </main>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Choose the plan that fits your deployment scale
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Pilot Tier */}
          <div className="glass-card rounded-xl p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">PILOT</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">Free</div>
            <p className="text-muted-foreground text-sm mb-6">Perfect for getting started</p>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-host" /> 1 Parent Host
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-host" /> 1 Satellite Child
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-host" /> Basic VRAM Tethering
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-host" /> 3 Docker Containers
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <X className="w-4 h-4 text-muted-foreground" /> GPU Priority Queue
              </li>
            </ul>
            <Button variant="outline" className="w-full border-border/50 bg-transparent" onClick={() => setShowLogin(true)}>
              Start Free
            </Button>
          </div>

          {/* Admin Tier */}
          <div className="glass-card rounded-xl p-6 flex flex-col border-primary/30 glow-primary relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              Popular
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">ADMIN</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">$29<span className="text-lg text-muted-foreground">/mo</span></div>
            <p className="text-muted-foreground text-sm mb-6">For power users</p>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-primary" /> 3 Parent Hosts
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-primary" /> 5 Satellite Children
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-primary" /> Advanced VRAM Tethering
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-primary" /> 15 Docker Containers
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-primary" /> GPU Priority Queue
              </li>
            </ul>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setShowLogin(true)}>
              Get Pro
            </Button>
          </div>

          {/* Fleet Tier */}
          <div className="glass-card rounded-xl p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-5 h-5 text-satellite" />
              <span className="text-sm font-medium text-satellite">FLEET</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">$99<span className="text-lg text-muted-foreground">/mo</span></div>
            <p className="text-muted-foreground text-sm mb-6">Enterprise scale</p>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-satellite" /> Unlimited Hosts
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-satellite" /> Unlimited Satellites
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-satellite" /> Priority VRAM Allocation
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-satellite" /> Unlimited Containers
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-satellite" /> 24/7 Support + SLA
              </li>
            </ul>
            <Button variant="outline" className="w-full border-satellite/30 hover:bg-satellite/10 bg-transparent" onClick={() => setShowLogin(true)}>
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-8 w-full max-w-md mx-4 relative">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Network className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-semibold text-foreground">TetherOps</span>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground mb-6">Sign in to access your workspace</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@tetherops.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary/50 border-border/50 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary/50 border-border/50 focus:border-primary"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
              >
                Sign In
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {"Don't have an account? "}
              <button className="text-primary hover:underline">Sign up</button>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
