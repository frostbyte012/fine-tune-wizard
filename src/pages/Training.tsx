
import { HyperparameterConfig } from "@/components/training/HyperparameterConfig";
import { TrainingProgress } from "@/components/training/TrainingProgress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Training = () => {
  const [activeTab, setActiveTab] = useState("config");
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Training</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="config" className="space-y-4">
          <HyperparameterConfig />
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-4">
          <TrainingProgress />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Training;
