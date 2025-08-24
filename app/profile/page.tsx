"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { AuthService, type User } from "@/lib/auth"
import { UserIcon, Mail, Calendar, LogOut, Settings } from "lucide-react"

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<User | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return

      try {
        const profile = await AuthService.getUserProfile()
        setProfileData(profile)
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load profile",
          variant: "destructive",
        })
        if (error instanceof Error && error.message.includes("Session expired")) {
          router.push("/login")
        }
      } finally {
        setIsLoadingProfile(false)
      }
    }

    if (!isLoading) {
      fetchProfile()
    }
  }, [isAuthenticated, isLoading, toast, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "Not available"
    }
  }

  if (isLoading || isLoadingProfile) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">Please log in to view your profile</p>
          <Button onClick={() => router.push("/login")} className="bg-blue-600 hover:bg-blue-700">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  const displayUser = profileData || user

  if (!displayUser) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">Unable to load profile information</p>
          <Button onClick={() => router.push("/")} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar and Name */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                  {getInitials(displayUser.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{displayUser.name}</h2>
                <p className="text-muted-foreground">Sentiment Analyzer User</p>
              </div>
            </div>

            <Separator />

            {/* Profile Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="font-medium">{displayUser.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                  <p className="font-medium">{displayUser.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p className="font-medium">{formatDate(displayUser.memberSince)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <Settings className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account ID</p>
                  <p className="font-medium font-mono text-sm">{displayUser.id}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Manage your account settings and session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Sign Out</h3>
                  <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-950 bg-transparent"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Button onClick={() => router.push("/sentiment-analysis")} variant="outline" className="h-auto p-4">
            <div className="text-center">
              <div className="font-medium">Sentiment Analysis</div>
              <div className="text-sm text-muted-foreground">Analyze individual reviews</div>
            </div>
          </Button>
          <Button onClick={() => router.push("/batch-uploads")} variant="outline" className="h-auto p-4">
            <div className="text-center">
              <div className="font-medium">Batch Upload</div>
              <div className="text-sm text-muted-foreground">Upload CSV files</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
