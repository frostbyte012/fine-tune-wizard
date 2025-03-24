
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pause, Play, RefreshCw, AlertCircle, StopCircle, Terminal } from "lucide-react";
import { useAnimateOnMount } from "@/lib/animations";
import { toast } from "sonner";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data for training progress
const generateTrainingData = (steps: number) => {
  const data = [];
  let trainingLoss = 1.8;
  let validationLoss = 2.2;
  
  for (let i = 0; i < steps; i++) {
    trainingLoss = Math.max(0.2, trainingLoss - 0.015 * Math.random());
    validationLoss = trainingLoss + 0.1 + (0.2 * Math.random());
    
    data.push({
      step: i * 10,
      trainingLoss: parseFloat(trainingLoss.toFixed(4)),
      validationLoss: parseFloat(validationLoss.toFixed(4)),
    });
  }
  
  return data;
};

// Generate initial data
const chartData = generateTrainingData(20);

// Sample console output lines
const consoleLines = [
  "INFO: Starting fine-tuning of gemma-7b model",
  "INFO: Loading dataset with 1250 examples",
  "INFO: Training with batch size 8, learning rate 2e-5",
  "INFO: Step 10/200: Training loss: 1.752, Validation loss: 1.931",
  "INFO: Step 20/200: Training loss: 1.623, Validation loss: 1.822",
  "INFO: Step 30/200: Training loss: 1.541, Validation loss: 1.769",
  "INFO: Step 40/200: Training loss: 1.485, Validation loss: 1.702",
  "INFO: Step 50/200: Training loss: 1.423, Validation loss: 1.654",
  "INFO: Saving checkpoint at step 50",
  "INFO: Evaluating model on validation set",
  "INFO: Validation metrics: Accuracy: 0.78, F1: 0.75",
  "INFO: Step 60/200: Training loss: 1.378, Validation loss: 1.589",
  "INFO: Step 70/200: Training loss: 1.312, Validation loss: 1.546",
  "INFO: Step 80/200: Training loss: 1.247, Validation loss: 1.485",
  "INFO: Step 90/200: Training loss: 1.203, Validation loss: 1.423",
  "INFO: Step 100/200: Training loss: 1.167, Validation loss: 1.387",
  "INFO: Saving checkpoint at step 100",
  "INFO: Evaluating model on validation set",
  "INFO: Validation metrics: Accuracy: 0.82, F1: 0.79",
];

const evaluationData = [
  { metric: "Accuracy", value: 0.82, previous: 0.76 },
  { metric: "F1 Score", value: 0.79, previous: 0.73 },
  { metric: "Precision", value: 0.81, previous: 0.75 },
  { metric: "Recall", value: 0.78, previous: 0.71 },
];

export function TrainingProgress() {
  const [progress, setProgress] = useState(50);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleConsoleLines, setVisibleConsoleLines] = useState<string[]>(consoleLines.slice(0, 5));
  const [currentStep, setCurrentStep] = useState(100);
  const totalSteps = 200;
  
  const { styles } = useAnimateOnMount({
    type: 'slide',
    direction: 'up',
    duration: 500
  });
  
  // Simulate console output
  useEffect(() => {
    if (isPaused) return;
    
    const consoleTimer = setInterval(() => {
      if (visibleConsoleLines.length < consoleLines.length) {
        setVisibleConsoleLines(prev => 
          [...prev, consoleLines[prev.length]]
        );
      } else {
        clearInterval(consoleTimer);
      }
    }, 2000);
    
    return () => clearInterval(consoleTimer);
  }, [visibleConsoleLines, isPaused]);
  
  // Simulate progress update
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
      
      setCurrentStep(prev => {
        if (prev >= totalSteps) {
          return totalSteps;
        }
        return prev + 2;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPaused]);
  
  const togglePause = () => {
    setIsPaused(prev => !prev);
    toast(isPaused ? "Training resumed" : "Training paused");
  };
  
  const stopTraining = () => {
    setIsPaused(true);
    toast.warning("Training stopped", {
      description: "Your model progress has been saved."
    });
  };
  
  return (
    <Card className="border shadow-sm" style={styles}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Training Progress</CardTitle>
            <CardDescription>
              Model: Gemma-7B • Dataset: customer_support.csv
            </CardDescription>
          </div>
          <Badge 
            variant={isPaused ? "outline" : "default"} 
            className={isPaused ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400" : "animate-pulse"}
          >
            {isPaused ? "Paused" : "Training"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress: {currentStep}/{totalSteps} steps</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Elapsed: 01:23:45</span>
            <span>ETA: 00:25:30</span>
          </div>
        </div>
        
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="space-y-4 pt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="step" 
                    label={{ value: 'Steps', position: 'insideBottomRight', offset: -5 }} 
                  />
                  <YAxis label={{ value: 'Loss', angle: -90, position: 'insideLeft' }} />
                  <RechartsTooltip 
                    formatter={(value: number) => [value.toFixed(4), '']}
                    labelFormatter={(label) => `Step ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="trainingLoss" 
                    name="Training Loss"
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="validationLoss" 
                    name="Validation Loss"
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="evaluation" className="space-y-4 pt-4">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary">
                    <th className="px-4 py-3 text-left font-medium">Metric</th>
                    <th className="px-4 py-3 text-left font-medium">Value</th>
                    <th className="px-4 py-3 text-left font-medium">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {evaluationData.map((item, index) => {
                    const change = parseFloat((item.value - item.previous).toFixed(2));
                    const isPositive = change > 0;
                    
                    return (
                      <tr key={index} className="hover:bg-secondary/50">
                        <td className="px-4 py-3">{item.metric}</td>
                        <td className="px-4 py-3 font-medium">{item.value.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={isPositive ? "text-emerald-500" : "text-red-500"}>
                            {isPositive ? "+" : ""}{change.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium mb-2">Evaluation Examples</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Input:</p>
                  <p className="text-sm bg-muted p-2 rounded">How can I reset my password if I've forgotten it?</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Model Output:</p>
                  <p className="text-sm bg-muted p-2 rounded">To reset your forgotten password, go to the login page and click on "Forgot Password". You'll receive an email with a link to create a new password. If you don't receive the email, check your spam folder or contact our support team for assistance.</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="logs" className="pt-4">
            <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg h-[300px] overflow-y-auto">
              {visibleConsoleLines.map((line, index) => (
                <div key={index} className="pb-1">{line}</div>
              ))}
              {visibleConsoleLines.length < consoleLines.length && (
                <div className="animate-pulse">▋</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={togglePause} className="space-x-1">
            {isPaused ? (
              <>
                <Play size={16} />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause size={16} />
                <span>Pause</span>
              </>
            )}
          </Button>
          <Button variant="outline" onClick={stopTraining} className="space-x-1">
            <StopCircle size={16} />
            <span>Stop</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="space-x-1">
            <Terminal size={16} />
            <span>View Details</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
