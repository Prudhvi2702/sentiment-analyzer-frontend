// Authentication utilities and API functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://ox4zaij71h.execute-api.us-west-1.amazonaws.com/prod"

export interface User {
  id: string
  name: string
  email: string
  memberSince?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export class AuthService {
  private static TOKEN_KEY = "sentiment_analyzer_token"

  static getToken(): string | null {
    if (typeof window === "undefined") return null
    const token = localStorage.getItem(this.TOKEN_KEY)
    console.log("Getting token from localStorage:", token ? "Token exists" : "No token")
    return token
  }

  static setToken(token: string): void {
    if (typeof window === "undefined") return
    if (!token) {
      console.log("Warning: Attempting to set empty/undefined token")
      return
    }
    console.log("Setting token in localStorage:", token.substring(0, 20) + "...")
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  static removeToken(): void {
    if (typeof window === "undefined") return
    console.log("Removing token from localStorage")
    localStorage.removeItem(this.TOKEN_KEY)
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    console.log("Attempting login for:", email)
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    console.log("Login response status:", response.status)

    if (!response.ok) {
      const error = await response.json()
      console.log("Login error:", error)
      throw new Error(error.message || "Login failed")
    }

    const result = await response.json()
    console.log("=== LOGIN DEBUG ===")
    console.log("Full response:", JSON.stringify(result, null, 2))
    console.log("Access token exists:", !!result.access_token)
    console.log("Access token value:", result.access_token)
    console.log("Access token type:", typeof result.access_token)
    console.log("Access token length:", result.access_token ? result.access_token.length : 0)
    console.log("=== END DEBUG ===")
    
    // Check if token exists in response (API returns 'access_token' not 'token')
    if (!result.access_token || typeof result.access_token !== 'string' || result.access_token.length === 0) {
      console.error("No valid access_token received in login response")
      console.error("Available fields in response:", Object.keys(result))
      throw new Error("Login failed: No authentication token received")
    }
    
    console.log("Token check passed, proceeding with login")
    
    // Return the response with the correct token field name
    return {
      token: result.access_token,
      user: result.user
    }
  }

  static async signup(name: string, email: string, password: string): Promise<{ message: string }> {
    console.log("Attempting signup for:", email, "name:", name)
    console.log("Signup payload:", { name, email, password: "***" })
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      console.log("Signup response status:", response.status)
      console.log("Signup response ok:", response.ok)
      console.log("Signup response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.log("Signup error response text:", errorText)
        
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          errorData = { message: errorText || "Signup failed" }
        }
        
        console.log("Signup error data:", errorData)
        
        // Handle specific HTTP status codes
        if (response.status === 409) {
          throw new Error("An account with this email address already exists. Please try logging in instead.")
        } else if (response.status === 400) {
          throw new Error(errorData.message || "Invalid signup data. Please check your information.")
        } else if (response.status === 500) {
          throw new Error("Server error. Please try again later.")
        } else {
          throw new Error(errorData.message || "Signup failed")
        }
      }

      const result = await response.json()
      console.log("Signup successful, response:", result)
      console.log("Signup response keys:", Object.keys(result))
      return result
    } catch (error) {
      console.error("Signup network error:", error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error("Network error: Unable to connect to the server")
      }
      throw error
    }
  }

  static async getUserProfile(): Promise<User> {
    const token = this.getToken()
    if (!token) throw new Error("No token found")

    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        this.removeToken()
        throw new Error("Session expired")
      }
      throw new Error("Failed to fetch profile")
    }

    return response.json()
  }

  static async checkHealth(): Promise<{ message: string; status: string; version: string }> {
    const response = await fetch(`${API_BASE_URL}/health`)
    return response.json()
  }
}
