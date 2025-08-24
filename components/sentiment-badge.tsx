import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SentimentBadgeProps {
  sentiment: "Positive" | "Negative" | "Neutral"
  className?: string
}

export function SentimentBadge({ sentiment, className }: SentimentBadgeProps) {
  const getVariant = () => {
    switch (sentiment) {
      case "Positive":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
      case "Negative":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
      case "Neutral":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800"
      default:
        return ""
    }
  }

  return (
    <Badge variant="outline" className={cn(getVariant(), className)}>
      {sentiment}
    </Badge>
  )
}
