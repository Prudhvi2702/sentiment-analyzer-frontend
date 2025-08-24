/**
 * Sentiment Analysis API Module
 * 
 * This module provides all API functions for sentiment analysis operations.
 * It handles communication with the backend sentiment analysis service
 * and provides a clean interface for the frontend components.
 * 
 * Features:
 * - Single text sentiment analysis
 * - Batch file processing
 * - Authentication token management
 * - Error handling and response validation
 * - Environment-based API configuration
 * 
 * @author Prudhvi2702
 * @version 1.0.0
 * @module
 */

import { AuthService } from "./auth"

// API base URL with environment variable fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://ox4zaij71h.execute-api.us-west-1.amazonaws.com/prod"

/**
 * Sentiment Analysis Result Interface
 * 
 * Defines the structure of sentiment analysis results returned by the API.
 * Used for both single text analysis and individual results in batch processing.
 * 
 * @interface SentimentResult
 * @property sentiment - The classified sentiment (Positive, Negative, or Neutral)
 * @property confidence - Confidence score from 0-1 indicating prediction certainty
 * @property review - Optional original text that was analyzed
 */
export interface SentimentResult {
  sentiment: "Positive" | "Negative" | "Neutral"
  confidence: number
  review?: string
}

/**
 * Batch Analysis Result Interface
 * 
 * Defines the structure of batch sentiment analysis results returned by the API.
 * Contains metadata about the batch processing and an array of individual results.
 * 
 * @interface BatchResult
 * @property file_name - Name of the uploaded CSV file
 * @property message - Status message from the batch processing
 * @property processing_timestamp - ISO timestamp of when processing completed
 * @property reviews - Array of individual sentiment analysis results
 * @property s3_key - S3 storage key for the uploaded file
 * @property summary - Optional summary statistics of the batch results
 */
export interface BatchResult {
  file_name: string
  message: string
  processing_timestamp: string
  reviews: Array<{
    sentiment: string
    confidence: number
    original_text?: string
    text?: string
    review?: string
    index?: number
    processed_text?: string
  }>
  s3_key: string
  summary?: {
    positive: number
    negative: number
    neutral: number
    positive_percentage: number
    negative_percentage: number
    neutral_percentage: number
    total_reviews: number
  }
}

export class SentimentAPI {
  static async analyzeSentiment(text: string): Promise<SentimentResult> {
    const token = AuthService.getToken()
    console.log("Token retrieved:", token ? "Token exists" : "No token found")
    console.log("Full token:", token)
    
    if (!token) throw new Error("Authentication required")

    console.log("Making request to:", `${API_BASE_URL}/api/sentiment`)
    console.log("Request headers:", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    })

    const response = await fetch(`${API_BASE_URL}/api/sentiment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    })

    console.log("Response status:", response.status)
    console.log("Response ok:", response.ok)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      if (response.status === 401) {
        console.log("401 Unauthorized - removing token")
        const errorText = await response.text()
        console.log("401 Error response:", errorText)
        AuthService.removeToken()
        throw new Error("Session expired. Please log in again.")
      }
      const error = await response.json()
      console.log("API Error:", error)
      throw new Error(error.message || "Analysis failed")
    }

    const result = await response.json()
    console.log("Analysis result:", result)
    return result
  }

  static async analyzeBatch(file: File): Promise<BatchResult> {
    const token = AuthService.getToken()
    console.log("Token for batch analysis:", token ? "Token exists" : "No token")
    if (!token) throw new Error("Authentication required")

    console.log("Starting batch analysis for file:", file.name)
    console.log("File size:", file.size, "bytes")
    console.log("File type:", file.type)

    const formData = new FormData()
    formData.append("file", file)
    console.log("FormData created with file")

    console.log("Making request to:", `${API_BASE_URL}/api/batch`)
    const response = await fetch(`${API_BASE_URL}/api/batch`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    console.log("Batch analysis response status:", response.status)
    console.log("Batch analysis response ok:", response.ok)
    console.log("Batch analysis response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      if (response.status === 401) {
        console.log("401 Unauthorized - removing token")
        AuthService.removeToken()
        throw new Error("Session expired. Please log in again.")
      }
      const errorText = await response.text()
      console.log("Batch analysis error response:", errorText)
      let error
      try {
        error = JSON.parse(errorText)
      } catch (e) {
        error = { message: errorText }
      }
      throw new Error(error.message || "Batch analysis failed")
    }

    const result = await response.json()
    console.log("Batch analysis result:", result)
    console.log("Result type:", typeof result)
    console.log("Result keys:", Object.keys(result))
    console.log("Result stringified:", JSON.stringify(result, null, 2))
    
    return result
  }
}
