/**
 * Root Layout Component
 * 
 * This is the main layout wrapper for the entire application.
 * It provides:
 * - Global styling and fonts
 * - Theme provider for dark/light mode
 * - Authentication context
 * - Navigation bar
 * - Toast notifications
 * - Health check monitoring
 * 
 * @author Prudhvi2702
 * @version 1.0.0
 */

import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"
import { HealthCheck } from "@/components/health-check"

/**
 * Application Metadata
 * 
 * Defines the metadata for the application including:
 * - Page title for browser tabs
 * - Description for SEO and social sharing
 * - Generator information
 */
export const metadata: Metadata = {
  title: "Sentiment Analyzer",
  description: "Analyze your reviews with AI-powered sentiment analysis",
  generator: "v0.app",
}

/**
 * Root Layout Component
 * 
 * Main layout wrapper that provides:
 * - HTML structure with proper lang attribute
 * - Font family configuration
 * - Theme provider for dark/light mode switching
 * - Authentication context for user state management
 * - Navigation bar across all pages
 * - Health check component for API monitoring
 * - Toast notifications system
 * 
 * @param children - React components to be rendered inside the layout
 * @returns JSX element with the complete application structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main>
                <HealthCheck />
                {children}
              </main>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
