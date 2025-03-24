
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, FileCog, Check, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnimateOnMount } from "@/lib/animations";
import { toast } from "sonner";

type FileStatus = "idle" | "uploading" | "validating" | "success" | "error";

interface FileItem {
  file: File;
  status: FileStatus;
  error?: string;
}

export function DatasetUpload() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
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
  
  const handleFiles = (newFiles: File[]) => {
    // Filter valid file types (CSV, JSONL, TXT)
    const validTypes = ["text/csv", "application/json", "text/plain"];
    const validExtensions = [".csv", ".jsonl", ".json", ".txt"];
    
    const validFiles = newFiles.filter(file => {
      const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      return validTypes.includes(file.type) || validExtensions.some(ext => extension.includes(ext));
    });
    
    if (validFiles.length !== newFiles.length) {
      toast.error("Some files were skipped due to unsupported formats.");
    }
    
    // Add new files to state
    const newFileItems = validFiles.map(file => ({
      file,
      status: "idle" as FileStatus
    }));
    
    setFiles(prev => [...prev, ...newFileItems]);
    
    // Simulate processing of files
    newFileItems.forEach((item, index) => {
      // Start uploading
      setTimeout(() => {
        setFiles(prev => {
          const updated = [...prev];
          const fileIndex = updated.findIndex(f => f.file.name === item.file.name);
          if (fileIndex !== -1) {
            updated[fileIndex].status = "uploading";
          }
          return updated;
        });
        
        // Start validating
        setTimeout(() => {
          setFiles(prev => {
            const updated = [...prev];
            const fileIndex = updated.findIndex(f => f.file.name === item.file.name);
            if (fileIndex !== -1) {
              updated[fileIndex].status = "validating";
            }
            return updated;
          });
          
          // Complete process
          setTimeout(() => {
            setFiles(prev => {
              const updated = [...prev];
              const fileIndex = updated.findIndex(f => f.file.name === item.file.name);
              if (fileIndex !== -1) {
                // Randomly show success or error for demo purposes
                const isSuccess = Math.random() > 0.3;
                updated[fileIndex].status = isSuccess ? "success" : "error";
                if (!isSuccess) {
                  updated[fileIndex].error = "File format validation failed";
                  toast.error(`Validation failed for ${item.file.name}`);
                } else {
                  toast.success(`Successfully validated ${item.file.name}`);
                }
              }
              return updated;
            });
          }, 1500);
        }, 1000);
      }, index * 500);
    });
  };
  
  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(item => item.file.name !== fileName));
  };
  
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
  
  const getStatusIcon = (status: FileStatus) => {
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
              <Button className="btn-transition" variant="outline">
                Select Files
                <input
                  type="file"
                  multiple
                  accept=".csv,.jsonl,.json,.txt,text/csv,application/json,text/plain"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </Button>
            </label>
          </div>
        </div>
        
        {files.length > 0 && (
          <div className="border rounded-lg divide-y">
            {files.map((item) => (
              <div key={item.file.name} className="flex items-center gap-3 p-3">
                {getFileIcon(item.file.name)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(item.file.size / 1024).toFixed(2)} KB • 
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
                    onClick={() => removeFile(item.file.name)}
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
        <Button variant="ghost">Clear All</Button>
        <Button disabled={files.length === 0 || !files.some(f => f.status === "success")}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
