"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { AuthService, type User } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const isAuthenticated = !!user

  useEffect(() => {
    const initAuth = async () => {
      const token = AuthService.getToken()
      if (token) {
        try {
          const userData = await AuthService.getUserProfile()
          setUser(userData)
        } catch (error) {
          AuthService.removeToken()
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { token, user: userData } = await AuthService.login(email, password)
      AuthService.setToken(token)
      setUser(userData)
      toast({
        title: "Success",
        description: "Logged in successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      })
      throw error
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      await AuthService.signup(name, email, password)
      toast({
        title: "Success",
        description: "Account created successfully! Please log in.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Signup failed",
        variant: "destructive",
      })
      throw error
    }
  }

  const logout = () => {
    AuthService.removeToken()
    setUser(null)
    toast({
      title: "Success",
      description: "Logged out successfully!",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
