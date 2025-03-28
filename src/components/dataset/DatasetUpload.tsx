
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, FileCog, Check, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnimateOnMount } from "@/lib/animations";
import { DatasetFile, processDatasetFile, removeDataset, clearDatasets } from "@/services/datasetService";

export function DatasetUpload() {
  const [files, setFiles] = useState<DatasetFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { styles } = useAnimateOnMount({
    type: 'fade',
    duration: 500
  });
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };
  
  const handleFiles = async (newFiles: File[]) => {
    // Filter valid file types (CSV, JSONL, TXT)
    const validTypes = ["text/csv", "application/json", "text/plain"];
    const validExtensions = [".csv", ".jsonl", ".json", ".txt"];
    
    const validFiles = newFiles.filter(file => {
      const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      return validTypes.includes(file.type) || validExtensions.some(ext => extension.includes(ext));
    });
    
    if (validFiles.length !== newFiles.length) {
      // Some files were skipped due to unsupported formats
    }
    
    setIsProcessing(true);
    
    // Process each file using the service
    for (const file of validFiles) {
      const newDataset = await processDatasetFile(file);
      setFiles(prev => {
        // Replace if file with same name exists, otherwise add
        const exists = prev.some(f => f.name === file.name);
        return exists 
          ? prev.map(f => f.name === file.name ? newDataset : f)
          : [...prev, newDataset];
      });
    }
    
    setIsProcessing(false);
  };
  
  const removeFile = useCallback((id: string) => {
    removeDataset(id);
    setFiles(prev => prev.filter(item => item.id !== id));
  }, []);
  
  const clearAll = useCallback(() => {
    clearDatasets();
    setFiles([]);
  }, []);
  
  const getFileIcon = (fileName: string) => {
    const extension = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
    
    if (extension.includes(".csv")) {
      return <FileText size={24} className="text-emerald-500" />;
    } else if (extension.includes(".json") || extension.includes(".jsonl")) {
      return <FileCog size={24} className="text-blue-500" />;
    } else {
      return <FileText size={24} className="text-gray-500" />;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
        return <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />;
      case "validating":
        return <div className="h-5 w-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />;
      case "success":
        return <Check size={20} className="text-emerald-500" />;
      case "error":
        return <AlertCircle size={20} className="text-destructive" />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="border shadow-sm" style={styles}>
      <CardHeader>
        <CardTitle>Upload Dataset</CardTitle>
        <CardDescription>
          Upload your datasets for fine-tuning. We support CSV, JSONL, and TXT files.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div 
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20",
            "transition-all duration-200"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-3">
            <Upload size={36} className={cn(
              "text-muted-foreground",
              isDragging ? "text-primary animate-pulse" : ""
            )} />
            <h3 className="text-lg font-medium">Drag & Drop Files</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Supported formats: CSV, JSONL, and TXT files. Files will be automatically validated for format compatibility.
            </p>
            <label className="mt-4">
              <Button className="btn-transition" variant="outline" disabled={isProcessing}>
                Select Files
                <input
                  type="file"
                  multiple
                  accept=".csv,.jsonl,.json,.txt,text/csv,application/json,text/plain"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                />
              </Button>
            </label>
          </div>
        </div>
        
        {files.length > 0 && (
          <div className="border rounded-lg divide-y">
            {files.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3">
                {getFileIcon(item.name)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(item.size / 1024).toFixed(2)} KB • 
                    {item.status === "error" ? (
                      <span className="text-destructive ml-1">{item.error}</span>
                    ) : (
                      <span className="capitalize ml-1">{item.status}</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeFile(item.id)}
                    className="h-7 w-7"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={clearAll} disabled={files.length === 0}>Clear All</Button>
        <Button 
          disabled={files.length === 0 || !files.some(f => f.status === "success")}
          onClick={() => window.location.href = "/training"}
        >
          Continue to Training
        </Button>
      </CardFooter>
    </Card>
  );
}
