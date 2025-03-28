
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAttentionMap } from '@/contexts/AttentionMapContext';
import { Eye, Download, RefreshCw, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface ControlPanelProps {
  isAnalyzing: boolean;
  setIsAnalyzing: (value: boolean) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ isAnalyzing, setIsAnalyzing }) => {
  const { designImage, generateHeatmap, exportHeatmap } = useAttentionMap();
  const [userType, setUserType] = useState('general');
  const [device, setDevice] = useState('mobile');
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [contrastWeight, setContrastWeight] = useState([50]);
  const [textHierarchyWeight, setTextHierarchyWeight] = useState([50]);
  const [spacingWeight, setSpacingWeight] = useState([50]);
  
  const handleAnalyze = async () => {
    if (!designImage) {
      toast.error('Please upload a design image first');
      return;
    }
    
    setIsAnalyzing(true);
    toast.promise(
      generateHeatmap({
        userType,
        device,
        accessibilityMode,
        contrastWeight: contrastWeight[0] / 100,
        textHierarchyWeight: textHierarchyWeight[0] / 100,
        spacingWeight: spacingWeight[0] / 100
      }),
      {
        loading: 'Analyzing design...',
        success: 'Analysis complete',
        error: 'Failed to analyze design'
      }
    );
  };
  
  const handleExport = async () => {
    if (!designImage) {
      toast.error('Please upload a design image first');
      return;
    }
    
    if (!isAnalyzing) {
      toast.error('Please analyze the design first');
      return;
    }
    
    try {
      await exportHeatmap();
      toast.success('Heatmap exported successfully');
    } catch (error) {
      toast.error('Failed to export heatmap');
    }
  };
  
  return (
    <Card className="w-full lg:w-96 h-auto flex flex-col">
      <Tabs defaultValue="analyze" className="flex-1">
        <div className="border-b px-4 py-2 bg-gray-50">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="analyze" className="flex-1 p-4 space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-sm">User Demographics</h3>
            <div className="grid gap-2">
              <Label htmlFor="userType">User Type</Label>
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger id="userType">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Users</SelectItem>
                  <SelectItem value="tech-savvy">Tech-Savvy Users</SelectItem>
                  <SelectItem value="elderly">Elderly Users</SelectItem>
                  <SelectItem value="young">Young Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="device">Device Type</Label>
              <Select value={device} onValueChange={setDevice}>
                <SelectTrigger id="device">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="accessibilityMode" 
                checked={accessibilityMode} 
                onCheckedChange={setAccessibilityMode} 
              />
              <Label htmlFor="accessibilityMode">Accessibility Mode</Label>
            </div>
          </div>
          
          <div className="space-y-6 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="contrastWeight">Contrast Weight</Label>
                <span className="text-xs text-gray-500">{contrastWeight}%</span>
              </div>
              <Slider 
                id="contrastWeight" 
                defaultValue={[50]} 
                max={100} 
                step={1} 
                value={contrastWeight}
                onValueChange={setContrastWeight}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="textWeight">Text Hierarchy Weight</Label>
                <span className="text-xs text-gray-500">{textHierarchyWeight}%</span>
              </div>
              <Slider 
                id="textWeight" 
                defaultValue={[50]} 
                max={100} 
                step={1}
                value={textHierarchyWeight}
                onValueChange={setTextHierarchyWeight}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="spacingWeight">Spacing Weight</Label>
                <span className="text-xs text-gray-500">{spacingWeight}%</span>
              </div>
              <Slider 
                id="spacingWeight" 
                defaultValue={[50]} 
                max={100} 
                step={1}
                value={spacingWeight}
                onValueChange={setSpacingWeight}
              />
            </div>
          </div>
          
          <div className="pt-4 space-y-2">
            <Button 
              onClick={handleAnalyze} 
              className="w-full" 
              disabled={!designImage || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Analyze Attention
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleExport}
              variant="outline" 
              className="w-full"
              disabled={!isAnalyzing || !designImage}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="p-4 space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-sm">AI Model Settings</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="modelType">AI Model</Label>
              <Select defaultValue="default">
                <SelectTrigger id="modelType">
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default (Recommended)</SelectItem>
                  <SelectItem value="enhanced">Enhanced (Beta)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="aiConfidence">AI Confidence Threshold</Label>
                <span className="text-xs text-gray-500">75%</span>
              </div>
              <Slider id="aiConfidence" defaultValue={[75]} max={100} step={1} />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="realTimeAnalysis" />
              <Label htmlFor="realTimeAnalysis">Real-time Analysis (Beta)</Label>
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-sm">Visualization Settings</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="colorScheme">Heatmap Color Scheme</Label>
              <Select defaultValue="redBlue">
                <SelectTrigger id="colorScheme">
                  <SelectValue placeholder="Select color scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="redBlue">Red-Blue (Default)</SelectItem>
                  <SelectItem value="viridis">Viridis</SelectItem>
                  <SelectItem value="plasma">Plasma</SelectItem>
                  <SelectItem value="grayscale">Grayscale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="opacity">Overlay Opacity</Label>
                <span className="text-xs text-gray-500">65%</span>
              </div>
              <Slider id="opacity" defaultValue={[65]} max={100} step={1} />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="showLegend" defaultChecked />
              <Label htmlFor="showLegend">Show Heatmap Legend</Label>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ControlPanel;
