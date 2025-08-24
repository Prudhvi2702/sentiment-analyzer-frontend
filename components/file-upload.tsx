"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Upload, File, X } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
  disabled?: boolean
}

export function FileUpload({ onFileSelect, selectedFile, disabled }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        if (file.type === "text/csv" || file.name.endsWith(".csv")) {
          onFileSelect(file)
        } else {
          // Handle invalid file type
          alert("Please select a CSV file")
        }
      }
      setDragActive(false)
    },
    [onFileSelect],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
    disabled,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  })

  const removeFile = () => {
    onFileSelect(null)
  }

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <Card
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed transition-colors cursor-pointer",
            isDragActive || dragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
              : "border-muted-foreground/25 hover:border-blue-400",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            <input {...getInputProps()} />
            <Upload className={cn("h-12 w-12 mb-4", isDragActive ? "text-blue-500" : "text-muted-foreground")} />
            <div className="text-center">
              <p className="text-lg font-medium mb-2">{isDragActive ? "Drop your CSV file here" : "Upload CSV File"}</p>
              <p className="text-sm text-muted-foreground mb-4">Drag and drop your CSV file here, or click to browse</p>
              <Button variant="outline" disabled={disabled}>
                Choose File
              </Button>
            </div>
            <div className="mt-4 text-xs text-muted-foreground text-center">
              <p>Supported format: CSV files only</p>
              <p>Maximum file size: 10MB</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={removeFile} disabled={disabled}>
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
