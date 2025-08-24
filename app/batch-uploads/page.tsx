"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { SentimentAPI, type SentimentResult } from "@/lib/sentiment-api"; // Use the correct type from sentiment-api
import { FileUpload } from "@/components/file-upload";
import { ResultsTable as ImportedResultsTable } from "@/components/results-table";
import { Loader2, Upload, FileText, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Helper function to normalize sentiment values with confidence-based neutral detection
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

export default function BatchUploadsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{ results: SentimentResult[]; totalProcessed: number } | null>(null);
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a CSV file to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const batchResult = await SentimentAPI.analyzeBatch(selectedFile);
      console.log("Batch result received:", batchResult);
      console.log("Batch result type:", typeof batchResult);
      console.log("Batch result keys:", batchResult ? Object.keys(batchResult) : "null/undefined");
      
      // Handle the actual API response structure
      if (!batchResult) {
        console.error("No batch result received");
        throw new Error("No response from batch analysis API");
      }

      console.log("Processing batch result with structure:", Object.keys(batchResult));
      
      // The API returns reviews array, not results
      const reviews = batchResult.reviews;
      if (!reviews || !Array.isArray(reviews)) {
        console.error("Invalid batch result structure - no reviews array:", batchResult);
        throw new Error("Invalid response structure from batch analysis API");
      }

      setResults({
        results: reviews.map((result: any) => ({
          sentiment: normalizeSentiment(result.sentiment, result.confidence),
          confidence: result.confidence || 0.5,
          review: result.original_text || result.text || result.review || "",
        })),
        totalProcessed: reviews.length,
      });
              toast({
          title: "Success",
          description: `Successfully analyzed ${reviews.length} reviews!`,
        });
    } catch (error) {
      console.error("Batch analysis error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Batch analysis failed",
        variant: "destructive",
      });
      if (error instanceof Error && error.message.includes("Session expired")) {
        router.push("/login");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResults(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">Please log in to continue with batch uploads</p>
          <Button onClick={() => router.push("/login")} className="bg-blue-600 hover:bg-blue-700">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Batch Upload Analysis</h1>
        <p className="text-muted-foreground">Upload a CSV file with multiple reviews to analyze sentiment in bulk</p>
      </div>

      {!results ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                CSV Format Requirements
              </CardTitle>
              <CardDescription>Your CSV file should follow this format for best results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                <div className="font-bold mb-2">Expected CSV format:</div>
                <div>review</div>
                <div>"This product is amazing!"</div>
                <div>"Not satisfied with the quality"</div>
                <div>"Average product, nothing special"</div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  <li>First row should contain the header "review"</li>
                  <li>Each subsequent row should contain one review</li>
                  <li>Maximum file size: 10MB</li>
                  <li>Supported format: CSV files only</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload CSV File
              </CardTitle>
              <CardDescription>Select your CSV file containing customer reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload onFileSelect={setSelectedFile} selectedFile={selectedFile} disabled={isAnalyzing} />

              <div className="flex gap-2 mt-6">
                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Reviews...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analyze Batch
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset} disabled={isAnalyzing}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Analysis Complete</h2>
              <p className="text-muted-foreground">
                Processed {results.totalProcessed} reviews from {selectedFile?.name}
              </p>
            </div>
            <Button onClick={handleReset} variant="outline">
              Upload New File
            </Button>
          </div>

          <ImportedResultsTable results={results?.results || []} totalProcessed={results?.totalProcessed || 0} />
        </div>
      )}
    </div>
  );
}
