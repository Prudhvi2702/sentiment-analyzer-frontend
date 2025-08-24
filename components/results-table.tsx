"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SentimentBadge } from "@/components/sentiment-badge";
import type { SentimentResult } from "@/lib/sentiment-api";
import { BarChart3 } from "lucide-react";
import { useState } from "react";
import axios from "axios";

interface ResultsTableProps {
  results: SentimentResult[];
  totalProcessed: number;
}

export function ResultsTable({ results, totalProcessed }: ResultsTableProps) {
  const getRowClassName = (sentiment: "Positive" | "Negative" | "Neutral") => {
    switch (sentiment) {
      case "Positive":
        return "bg-green-50 dark:bg-green-950/20 border-l-4 border-l-green-500";
      case "Negative":
        return "bg-red-50 dark:bg-red-950/20 border-l-4 border-l-red-500";
      case "Neutral":
        return "bg-gray-50 dark:bg-gray-950/20 border-l-4 border-l-gray-500";
      default:
        return "";
    }
  };

  if (!results || results.length === 0) {
    return <div>No data available. Please upload a valid CSV file.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{totalProcessed}</div>
            <div className="text-sm text-muted-foreground">Total Processed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {results.filter((result) => result.sentiment === "Positive").length}
            </div>
            <div className="text-sm text-muted-foreground">Positive</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {results.filter((result) => result.sentiment === "Negative").length}
            </div>
            <div className="text-sm text-muted-foreground">Negative</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {results.filter((result) => result.sentiment === "Neutral").length}
            </div>
            <div className="text-sm text-muted-foreground">Neutral</div>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analysis Results
          </CardTitle>
          <CardDescription>Detailed sentiment analysis results for each review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%]">Review</TableHead>
                  <TableHead className="w-[20%]">Sentiment</TableHead>
                  <TableHead className="w-[20%]">Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index} className={getRowClassName(result.sentiment)}>
                    <TableCell className="font-medium">
                      <div className="max-w-md truncate" title={result.review}>
                        {result.review || `Review ${index + 1}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <SentimentBadge sentiment={result.sentiment} />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {Math.round(result.confidence * 100)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ✅ NEW: Parent component that manages state and file upload
export function SentimentAnalyzer() {
  // Move the hooks INSIDE this component
  const [results, setResults] = useState<{ results: SentimentResult[]; totalProcessed: number } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      console.log("=== File Upload Started ===");
      setError(null); // Clear any previous errors
      
      const file = event.target.files?.[0];
      if (!file) {
        console.error("No file selected");
        setError("No file selected");
        return;
      }

      console.log("File selected:", {
        name: file.name,
        size: file.size,
        type: file.type
      });

      setSelectedFile(file);
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      console.log("=== Making API Call ===");
      
      const response = await axios.post(
        "https://ox4zaij7lh.execute-api.us-west-1.amazonaws.com",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Add any required headers here if needed
          },
        }
      );

      console.log("=== API Response Received ===");
      console.log("Full response:", response);
      console.log("Response data:", response.data);
      console.log("Response status:", response.status);

      // Validate response structure
      if (!response.data) {
        throw new Error("No data received from API");
      }

      if (!response.data.reviews || !Array.isArray(response.data.reviews)) {
        console.error("Invalid response structure:", response.data);
        throw new Error("Invalid API response: reviews array not found");
      }

      console.log("=== Processing API Response ===");
      console.log("Reviews count:", response.data.reviews.length);

      // Map the API response to our component's expected format
      const parsedResults = response.data.reviews.map((review: any, index: number) => {
        console.log(`Processing review ${index}:`, review);
        
        // Convert API sentiment format to our component format
        let sentiment: "Positive" | "Negative" | "Neutral" = "Neutral";
        if (review.sentiment === "POSITIVE") {
          sentiment = "Positive";
        } else if (review.sentiment === "NEGATIVE") {
          sentiment = "Negative";
        } else {
          sentiment = "Neutral";
        }
        
        return {
          review: review.original_text || `Review ${index + 1}`,
          sentiment: sentiment,
          confidence: review.confidence || 0,
        };
      });

      console.log("=== Final Parsed Results ===");
      console.log("Parsed results:", parsedResults);
      
      setResults({
        results: parsedResults,
        totalProcessed: response.data.summary?.total_reviews || parsedResults.length,
      });
      
      console.log("=== Processing Complete ===");

    } catch (error) {
      console.error("=== Error in handleFileUpload ===");
      console.error("Error type:", typeof error);
      console.error("Error object:", error);
      
      let errorMessage = "An unexpected error occurred";
      
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:");
        console.error("- Response:", error.response);
        console.error("- Request:", error.request);
        console.error("- Message:", error.message);
        
        if (error.response) {
          console.error("- Status:", error.response.status);
          console.error("- Data:", error.response.data);
          errorMessage = `API Error (${error.response.status}): ${error.response.data?.message || error.message}`;
        } else if (error.request) {
          errorMessage = "Network error: Unable to reach the API server";
        } else {
          errorMessage = `Request setup error: ${error.message}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      } else {
        console.error("Non-Error object:", error);
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      console.log("=== File Upload Process Finished ===");
    }
  };

  return (
    <div className="space-y-4">
      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>Select a CSV file containing reviews for sentiment analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isLoading}
          />
          {isLoading && <div className="mt-2 text-sm text-gray-600">Processing...</div>}
          {selectedFile && (
            <div className="mt-2 text-sm text-gray-600">
              Selected: {selectedFile.name}
            </div>
          )}
          {error && (
            <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Error: {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {results && (
        <ResultsTable
          results={results.results}
          totalProcessed={results.totalProcessed}
        />
      )}
    </div>
  );
}