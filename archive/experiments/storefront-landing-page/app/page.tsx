"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { Dashboard } from "@/components/dashboard"

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (isAuthenticated) {
    return <Dashboard onLogout={() => setIsAuthenticated(false)} />
  }

  return <LandingPage onLogin={() => setIsAuthenticated(true)} />
}
