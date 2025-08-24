/**
 * Single Sentiment Analysis Page
 * 
 * This page allows users to analyze the sentiment of individual text inputs.
 * Features:
 * - Real-time sentiment analysis
 * - Confidence scoring with neutral detection
 * - Professional UI with loading states
 * - Error handling and user feedback
 * - Responsive design for all devices
 * 
 * @author Prudhvi2702
 * @version 1.0.0
 * @component
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { SentimentAPI, type SentimentResult } from "@/lib/sentiment-api"
import { SentimentBadge } from "@/components/sentiment-badge"
import { Loader2, BarChart3, MessageSquare, TrendingUp } from "lucide-react"

/**
 * Sentiment Normalization Function
 * 
 * Normalizes sentiment values from the API and applies confidence-based neutral detection.
 * This function ensures consistent sentiment classification across the application.
 * 
 * Features:
 * - Handles uppercase/lowercase sentiment values
 * - Implements confidence threshold for neutral classification
 * - Supports multiple sentiment value formats
 * 
 * @param sentiment - Raw sentiment value from API (e.g., "POSITIVE", "NEGATIVE")
 * @param confidence - Confidence score from 0-1 (optional)
 * @returns Normalized sentiment: "Positive", "Negative", or "Neutral"
 * 
 * @example
 * normalizeSentiment("POSITIVE", 0.8) // Returns "Positive"
 * normalizeSentiment("POSITIVE", 0.6) // Returns "Neutral" (low confidence)
 */
const normalizeSentiment = (sentiment: string, confidence?: number): "Positive" | "Negative" | "Neutral" => {
  const normalized = sentiment?.toLowerCase();
  
  // If confidence is low (< 0.7), classify as neutral regardless of sentiment
  if (confidence !== undefined && confidence < 0.7) {
    return "Neutral";
  }
  
  if (normalized === "positive" || normalized === "pos") return "Positive";
  if (normalized === "negative" || normalized === "neg") return "Negative";
  return "Neutral";
};

/**
 * Main Sentiment Analysis Page Component
 * 
 * Provides a complete interface for single text sentiment analysis.
 * Handles user input, API communication, and result display.
 * 
 * State Management:
 * - text: User input text for analysis
 * - isAnalyzing: Loading state during API calls
 * - result: Analysis results from the API
 * 
 * @returns JSX element with the complete sentiment analysis interface
 */
export default function SentimentAnalysisPage() {
  // State for user input text
  const [text, setText] = useState("")
  
  // Loading state during analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // Analysis results from API
  const [result, setResult] = useState<SentimentResult | null>(null)
  
  // Authentication and utility hooks
  const { isAuthenticated, isLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to analyze",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      const analysisResult = await SentimentAPI.analyzeSentiment(text.trim())
      
      // Apply sentiment normalization with confidence-based neutral detection
      const normalizedResult = {
        ...analysisResult,
        sentiment: normalizeSentiment(analysisResult.sentiment, analysisResult.confidence)
      }
      
      setResult(normalizedResult)
      toast({
        title: "Success",
        description: "Sentiment analysis completed!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Analysis failed",
        variant: "destructive",
      })
      if (error instanceof Error && error.message.includes("Session expired")) {
        router.push("/login")
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleClear = () => {
    setText("")
    setResult(null)
  }

  if (isLoading) {
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
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">Please log in to continue with sentiment analysis</p>
          <Button onClick={() => router.push("/login")} className="bg-blue-600 hover:bg-blue-700">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sentiment Analysis</h1>
        <p className="text-muted-foreground">
          Analyze the sentiment of customer reviews and feedback with AI-powered insights
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Review Input
            </CardTitle>
            <CardDescription>Enter the customer review or feedback text you want to analyze</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="review-text">Customer Review</Label>
              <Textarea
                id="review-text"
                placeholder="Enter customer review or feedback here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[150px] resize-none"
                disabled={isAnalyzing}
              />
              <div className="text-sm text-muted-foreground">{text.length} characters</div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !text.trim()}
                className="bg-blue-600 hover:bg-blue-700 flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analyze Sentiment
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={isAnalyzing}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Analysis Results
            </CardTitle>
            <CardDescription>
              {result ? "Sentiment analysis results with confidence score" : "Results will appear here after analysis"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                {/* Sentiment Result */}
                <div className="text-center">
                  <div className="mb-4">
                    <SentimentBadge sentiment={result.sentiment} className="text-lg px-4 py-2" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{result.sentiment} Sentiment</h3>
                </div>

                {/* Confidence Score */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Confidence Score</Label>
                    <span className="text-sm font-bold">{Math.round(result.confidence * 100)}%</span>
                  </div>
                  <Progress value={result.confidence * 100} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    Higher confidence indicates more certainty in the sentiment classification
                  </p>
                </div>

                {/* Interpretation */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Interpretation</h4>
                  <p className="text-sm text-muted-foreground">
                    {result.sentiment === "Positive" &&
                      "This review expresses positive sentiment, indicating customer satisfaction or approval."}
                    {result.sentiment === "Negative" &&
                      "This review expresses negative sentiment, indicating customer dissatisfaction or concerns."}
                    {result.sentiment === "Neutral" &&
                      "This review expresses neutral sentiment, indicating a balanced or factual tone without strong emotions."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter text and click "Analyze Sentiment" to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
