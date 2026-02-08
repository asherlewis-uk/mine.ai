"use client";

import { useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, getSetting } from "@/lib/db";

// Helper to convert Hex to HSL (Tailwind often needs HSL numbers)
function hexToHSL(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);
  
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; 
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  // Return space separated values for Tailwind CSS variables (e.g. "24 95% 53%")
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function ThemeManager() {
  // Listen to DB changes in real-time
  const theme = useLiveQuery(() => db.settings.where("key").equals("theme_mode").first());
  const accent = useLiveQuery(() => db.settings.where("key").equals("accent_color").first());

  useEffect(() => {
    const root = document.documentElement;

    // 1. APPLY DARK/LIGHT MODE
    const mode = theme?.value || "dark"; // Default to dark
    
    let effectiveMode = mode;
    if (mode === "system") {
      // Check system preference
      effectiveMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    
    if (effectiveMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Listen for system theme changes when in "system" mode
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if ((theme?.value || "dark") === "system") {
        if (e.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    // 2. APPLY ACCENT COLOR
    const colorHex = (accent?.value as string) || "#3b82f6"; // Default Blue
    
    // Set the Hex variable (for simple use)
    root.style.setProperty("--primary-hex", colorHex);

    // Set the HSL variable (for Tailwind opacity support like bg-primary/20)
    const hsl = hexToHSL(colorHex);
    if (hsl) {
      root.style.setProperty("--primary", hsl);
      root.style.setProperty("--ring", hsl);
    }

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme, accent]);

  return null; // This component is invisible
}