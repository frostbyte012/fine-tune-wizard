
import { useState } from "react";
import { DatasetUpload } from "@/components/dataset/DatasetUpload";
import { DatasetPreview } from "@/components/dataset/DatasetPreview";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";

const Datasets = () => {
  const [activeTab, setActiveTab] = useState("upload");
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Datasets</h1>
        <Button className="btn-transition">
          <PlusCircle size={16} className="mr-2" />
          New Dataset
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4">
          <DatasetUpload />
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4">
          <DatasetPreview />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Datasets;
