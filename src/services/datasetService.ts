
import { toast } from "sonner";

export interface DatasetFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'idle' | 'uploading' | 'validating' | 'success' | 'error';
  error?: string;
  content?: string | Record<string, any>[];
}

// In-memory storage for datasets in this demo
let datasets: DatasetFile[] = [];

// Validate different file formats
const validateCSV = (content: string): boolean => {
  // Basic CSV validation - check if it has rows and columns
  const lines = content.trim().split('\n');
  if (lines.length < 2) return false; // Need at least header and one data row
  
  const headerCols = lines[0].split(',').length;
  // Check if all rows have the same number of columns
  return lines.slice(1).every(line => line.split(',').length === headerCols);
};

const validateJSONL = (content: string): boolean => {
  // Check if each line is valid JSON
  const lines = content.trim().split('\n');
  if (lines.length === 0) return false;
  
  try {
    for (const line of lines) {
      if (line.trim()) {
        JSON.parse(line);
      }
    }
    return true;
  } catch (e) {
    return false;
  }
};

const validateJSON = (content: string): boolean => {
  try {
    const data = JSON.parse(content);
    // Ensure it's an array of objects or has a "data" field that's an array
    return (Array.isArray(data) && data.length > 0) || 
           (data.data && Array.isArray(data.data) && data.data.length > 0);
  } catch (e) {
    return false;
  }
};

const validateTXT = (content: string): boolean => {
  // Text files should have content with at least some lines
  return content.trim().length > 0 && content.includes('\n');
};

// Process and validate dataset files
export const processDatasetFile = async (file: File): Promise<DatasetFile> => {
  const id = Math.random().toString(36).substring(2, 9);
  
  const dataset: DatasetFile = {
    id,
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    status: 'uploading'
  };
  
  // Add to datasets collection
  datasets.push(dataset);
  
  try {
    // Read file content
    const content = await file.text();
    
    // Update status to validating
    dataset.status = 'validating';
    updateDataset(dataset);
    
    // Validate based on file type
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    let isValid = false;
    
    if (extension.includes('.csv')) {
      isValid = validateCSV(content);
      if (isValid) {
        // Parse CSV to structured data
        const lines = content.trim().split('\n');
        const headers = lines[0].split(',');
        dataset.content = lines.slice(1).map(line => {
          const values = line.split(',');
          const obj: Record<string, string> = {};
          headers.forEach((header, i) => {
            obj[header] = values[i];
          });
          return obj;
        });
      }
    } else if (extension.includes('.jsonl')) {
      isValid = validateJSONL(content);
      if (isValid) {
        // Parse JSONL to array of objects
        dataset.content = content.trim()
          .split('\n')
          .filter(line => line.trim())
          .map(line => JSON.parse(line));
      }
    } else if (extension.includes('.json')) {
      isValid = validateJSON(content);
      if (isValid) {
        const data = JSON.parse(content);
        dataset.content = Array.isArray(data) ? data : (data.data || []);
      }
    } else if (extension.includes('.txt')) {
      isValid = validateTXT(content);
      if (isValid) {
        dataset.content = content;
      }
    } else {
      isValid = false;
    }
    
    // Update status based on validation result
    if (isValid) {
      dataset.status = 'success';
      toast.success(`Successfully validated ${file.name}`);
    } else {
      dataset.status = 'error';
      dataset.error = 'File format validation failed';
      toast.error(`Validation failed for ${file.name}`);
    }
    
    return updateDataset(dataset);
  } catch (error) {
    dataset.status = 'error';
    dataset.error = 'Error processing file';
    toast.error(`Error processing ${file.name}`);
    return updateDataset(dataset);
  }
};

// Get all datasets
export const getDatasets = (): DatasetFile[] => {
  return [...datasets];
};

// Get a specific dataset by ID
export const getDataset = (id: string): DatasetFile | undefined => {
  return datasets.find(d => d.id === id);
};

// Update a dataset
export const updateDataset = (updatedDataset: DatasetFile): DatasetFile => {
  datasets = datasets.map(d => 
    d.id === updatedDataset.id ? updatedDataset : d
  );
  return updatedDataset;
};

// Remove a dataset
export const removeDataset = (id: string): void => {
  datasets = datasets.filter(d => d.id !== id);
};

// Clear all datasets
export const clearDatasets = (): void => {
  datasets = [];
};

// Get dataset statistics
export const getDatasetStats = (id: string): Record<string, any> => {
  const dataset = getDataset(id);
  if (!dataset || !dataset.content) {
    return {};
  }
  
  if (typeof dataset.content === 'string') {
    // Text file
    const content = dataset.content as string;
    const lines = content.split('\n');
    return {
      lines: lines.length,
      characters: content.length,
      words: content.split(/\s+/).length
    };
  } else {
    // Structured data
    const records = dataset.content as Record<string, any>[];
    const fields = records.length > 0 ? Object.keys(records[0]).length : 0;
    return {
      records: records.length,
      fields
    };
  }
};
