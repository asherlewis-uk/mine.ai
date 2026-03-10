import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "TetherOps - Host-to-Satellite GPU Tethering Platform",
  description:
    "Unified workspace for parent-child device binding. Share GPU VRAM, manage Docker containers, and stream with Sunshine/Moonlight through secure Cloudflare Tunnels.",
  keywords: [
    "GPU tethering",
    "remote GPU",
    "Cloudflare Tunnel",
    "Sunshine",
    "Moonlight",
    "Docker",
    "VRAM sharing",
  ],
}

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
