"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { ArrowRight, BarChart3, Brain, Zap } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/sentiment-analysis")
    } else {
      router.push("/login")
    }
  }

  const handleSignUp = () => {
    router.push("/signup")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50/30 dark:to-blue-950/20">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto animate-in fade-in-50 duration-1000">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Welcome to <span className="text-blue-600 dark:text-blue-400">Sentiment Analyzer</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Analyze your reviews with AI-powered sentiment analysis and gain valuable insights from customer feedback
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-in fade-in-50 duration-1000 delay-300">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {isAuthenticated ? "Go to Analysis" : "Get Started"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {!isAuthenticated && (
              <Button
                onClick={handleSignUp}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 bg-transparent"
              >
                Create Account
              </Button>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto animate-in fade-in-50 duration-1000 delay-500">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Analysis</h3>
              <p className="text-muted-foreground">
                Advanced machine learning algorithms analyze sentiment with high accuracy and confidence scores
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Batch Processing</h3>
              <p className="text-muted-foreground">
                Upload CSV files and analyze hundreds of reviews at once with detailed results and insights
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Results</h3>
              <p className="text-muted-foreground">
                Get instant sentiment analysis results with color-coded classifications and confidence metrics
              </p>
            </div>
          </div>
        </div>

        {/* How it Works Section */}
        <div className="max-w-4xl mx-auto text-center animate-in fade-in-50 duration-1000 delay-700">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Input Your Text</h3>
              <p className="text-muted-foreground text-sm">
                Paste your review or upload a CSV file with multiple reviews
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-muted-foreground text-sm">
                Our AI processes the text and determines sentiment with confidence scores
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Get Results</h3>
              <p className="text-muted-foreground text-sm">
                View detailed results with sentiment classification and insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
