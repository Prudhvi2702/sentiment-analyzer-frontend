"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthService } from "@/lib/auth"
import { AlertTriangle } from "lucide-react"

export function HealthCheck() {
  const [isApiDown, setIsApiDown] = useState(false)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await AuthService.checkHealth()
        setIsApiDown(false)
      } catch (error) {
        setIsApiDown(true)
      }
    }

    checkHealth()
    // Check health every 5 minutes
    const interval = setInterval(checkHealth, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  if (!isApiDown) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>API is unavailable. Please try again later.</AlertDescription>
    </Alert>
  )
}
