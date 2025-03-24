
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, Download, Copy, ExternalLink, Server, Cloud, Code } from "lucide-react";
import { useAnimateOnMount } from "@/lib/animations";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface FileIconProps {
  extension: string;
}

const FileIcon = ({ extension }: FileIconProps) => {
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 text-primary">
      <span className="text-xs font-bold uppercase">{extension}</span>
    </div>
  );
};

interface ExportFormatOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  size?: string;
}

const localExportFormats: ExportFormatOption[] = [
  {
    id: "pytorch",
    name: "PyTorch Model",
    description: "Standard PyTorch model format with full weights",
    icon: <FileIcon extension="pt" />,
    size: "2.8 GB"
  },
  {
    id: "safetensors",
    name: "SafeTensors",
    description: "Safe format for storing tensors, faster loading",
    icon: <FileIcon extension="st" />,
    size: "2.7 GB"
  },
  {
    id: "gguf",
    name: "GGUF Format",
    description: "Optimized format for local inference with llama.cpp",
    icon: <FileIcon extension="gguf" />,
    size: "1.9 GB"
  },
  {
    id: "onnx",
    name: "ONNX Format",
    description: "Open standard for machine learning models",
    icon: <FileIcon extension="onnx" />,
    size: "2.6 GB"
  }
];

const cloudOptions: ExportFormatOption[] = [
  {
    id: "vertex_ai",
    name: "Vertex AI",
    description: "Deploy to Google Cloud Vertex AI as a prediction endpoint",
    icon: <Cloud size={24} className="text-primary" />
  },
  {
    id: "cloud_storage",
    name: "Google Cloud Storage",
    description: "Export model artifacts to your GCS bucket",
    icon: <Server size={24} className="text-primary" />
  },
  {
    id: "huggingface",
    name: "Hugging Face Hub",
    description: "Publish your model to Hugging Face Hub repository",
    icon: <Code size={24} className="text-primary" />
  }
];

interface CodeSnippetProps {
  language: string;
  code: string;
}

const CodeSnippet = ({ language, code }: CodeSnippetProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative mt-4">
      <div className="absolute top-2 right-2 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleCopy}
          className="h-8 w-8 bg-background/80 backdrop-blur-sm"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </Button>
      </div>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export function ModelExport() {
  const [selectedLocalFormat, setSelectedLocalFormat] = useState("gguf");
  const [selectedCloudOption, setSelectedCloudOption] = useState("vertex_ai");
  
  const { styles } = useAnimateOnMount({
    type: 'slide',
    direction: 'up',
    duration: 500
  });
  
  const handleExportModel = () => {
    toast.success("Export initiated", {
      description: "Your model export has started. This may take a few minutes."
    });
  };
  
  const pythonCode = `
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load the fine-tuned model
model = AutoModelForCausalLM.from_pretrained("path/to/exported/model")
tokenizer = AutoTokenizer.from_pretrained("path/to/exported/model")

# Prepare input
prompt = "What is the best way to help customers with billing issues?"
inputs = tokenizer(prompt, return_tensors="pt")

# Generate response
with torch.no_grad():
    outputs = model.generate(
        inputs.input_ids,
        max_length=512,
        temperature=0.7,
        top_p=0.9,
    )
    
# Decode and print the response
response = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(response)
`.trim();
  
  const nodeJSCode = `
import { pipeline } from '@huggingface/transformers';

async function main() {
  // Load the model
  const generator = await pipeline(
    'text-generation',
    'path/to/exported/model'
  );
  
  // Generate text
  const result = await generator(
    'What is the best way to help customers with billing issues?',
    {
      max_length: 512,
      temperature: 0.7,
      top_p: 0.9,
    }
  );
  
  console.log(result[0].generated_text);
}

main().catch(console.error);
`.trim();
  
  return (
    <Card className="border shadow-sm" style={styles}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Export Model</CardTitle>
            <CardDescription>
              Export your fine-tuned model for deployment or inference
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400">
            Training Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="local" className="w-full">
          <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
            <TabsTrigger value="local">Local Export</TabsTrigger>
            <TabsTrigger value="cloud">Cloud Deploy</TabsTrigger>
            <TabsTrigger value="code">Usage Examples</TabsTrigger>
          </TabsList>
          
          <TabsContent value="local" className="space-y-4 pt-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Select Export Format</h3>
              <RadioGroup 
                value={selectedLocalFormat} 
                onValueChange={setSelectedLocalFormat}
                className="space-y-3"
              >
                {localExportFormats.map((format) => (
                  <div 
                    key={format.id}
                    className="flex items-start space-x-3 border rounded-lg p-3 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedLocalFormat(format.id)}
                  >
                    <RadioGroupItem value={format.id} id={format.id} className="mt-1" />
                    <div className="flex flex-1 items-start space-x-3">
                      {format.icon}
                      <div className="flex-1">
                        <Label 
                          htmlFor={format.id} 
                          className="font-medium cursor-pointer flex items-center justify-between"
                        >
                          {format.name}
                          {format.size && (
                            <span className="text-xs text-muted-foreground ml-2">
                              {format.size}
                            </span>
                          )}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Export Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Model Name</Label>
                  <div className="border rounded px-3 py-2 mt-1 text-sm bg-muted/30">
                    gemma-7b-ft-customer-support-v1
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Quantization</Label>
                  <div className="border rounded px-3 py-2 mt-1 text-sm bg-muted/30">
                    FP16 (Default)
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cloud" className="space-y-4 pt-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Select Deployment Target</h3>
              <RadioGroup 
                value={selectedCloudOption} 
                onValueChange={setSelectedCloudOption}
                className="space-y-3"
              >
                {cloudOptions.map((option) => (
                  <div 
                    key={option.id}
                    className="flex items-start space-x-3 border rounded-lg p-3 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedCloudOption(option.id)}
                  >
                    <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                    <div className="flex flex-1 items-start space-x-3">
                      {option.icon}
                      <div className="flex-1">
                        <Label 
                          htmlFor={option.id} 
                          className="font-medium cursor-pointer"
                        >
                          {option.name}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Connection Settings</h3>
              <div className="text-sm text-muted-foreground mb-3">
                Configure settings for deploying to Google Cloud Vertex AI
              </div>
              
              <div className="bg-muted/30 border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Google Cloud Authentication</span>
                  <Badge variant="outline" className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400">
                    Not Connected
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  You need to authenticate with Google Cloud to deploy your model.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Connect Account
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="space-y-4 pt-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Python Example</h3>
              <p className="text-sm text-muted-foreground">
                Load and use your model with Python and the Transformers library
              </p>
              <CodeSnippet language="python" code={pythonCode} />
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">JavaScript Example</h3>
              <p className="text-sm text-muted-foreground">
                Use your model with JavaScript and the Transformers.js library
              </p>
              <CodeSnippet language="javascript" code={nodeJSCode} />
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Additional Resources</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ExternalLink size={16} className="text-primary" />
                  <a href="#" className="text-sm text-primary hover:underline">
                    Gemma fine-tuning documentation
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink size={16} className="text-primary" />
                  <a href="#" className="text-sm text-primary hover:underline">
                    Vertex AI deployment guide
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink size={16} className="text-primary" />
                  <a href="#" className="text-sm text-primary hover:underline">
                    Optimizing inference performance
                  </a>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">
          Cancel
        </Button>
        <Button onClick={handleExportModel} className="bg-primary btn-transition">
          <Download size={16} className="mr-2" />
          Export Model
        </Button>
      </CardFooter>
    </Card>
  );
}
