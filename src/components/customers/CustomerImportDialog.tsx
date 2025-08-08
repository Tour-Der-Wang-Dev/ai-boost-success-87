import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Download, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  X,
  Users
} from 'lucide-react';

interface CustomerImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: any[]) => Promise<void>;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

export const CustomerImportDialog: React.FC<CustomerImportDialogProps> = ({
  open,
  onOpenChange,
  onImport
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);

  const sampleData = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Acme Corp',
      phone: '+1-555-0123',
      status: 'active',
      health_score: 85,
      monthly_revenue: 2500
    },
    {
      name: 'Jane Smith',
      email: 'jane@techco.com',
      company: 'TechCo',
      phone: '+1-555-0456',
      status: 'new',
      health_score: 90,
      monthly_revenue: 1800
    }
  ];

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }
    setFile(selectedFile);
    setImportResult(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const parseCSV = (content: string): any[] => {
    const lines = content.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim().replace(/['"]/g, ''));
        const obj: any = {};
        
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        
        // Convert numeric fields
        if (obj.health_score) obj.health_score = parseInt(obj.health_score);
        if (obj.monthly_revenue) obj.monthly_revenue = parseFloat(obj.monthly_revenue);
        
        data.push(obj);
      }
    }

    return data;
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setProgress(0);

    try {
      const content = await file.text();
      const data = parseCSV(content);
      
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await onImport(data);
      
      setImportResult({
        success: data.length,
        failed: 0,
        errors: []
      });
    } catch (error) {
      setImportResult({
        success: 0,
        failed: 1,
        errors: [error instanceof Error ? error.message : 'Import failed']
      });
    } finally {
      setImporting(false);
      setProgress(0);
    }
  };

  const downloadSample = () => {
    const csvContent = [
      'name,email,company,phone,status,health_score,monthly_revenue',
      ...sampleData.map(item => 
        `"${item.name}","${item.email}","${item.company}","${item.phone}","${item.status}",${item.health_score},${item.monthly_revenue}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-customers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetDialog = () => {
    setFile(null);
    setImportResult(null);
    setProgress(0);
    setImporting(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetDialog();
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Import Customers</span>
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple customers at once
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="sample">Download Sample</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            {!importResult && (
              <>
                {/* File Upload Area */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center transition-colors
                    ${dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
                    ${file ? 'border-accent bg-accent/5' : ''}
                  `}
                >
                  {file ? (
                    <div className="space-y-2">
                      <FileText className="w-12 h-12 mx-auto text-accent" />
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFile(null)}
                        className="mt-2"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                      <p className="font-medium">Drop your CSV file here</p>
                      <p className="text-sm text-muted-foreground">
                        or click to select a file
                      </p>
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <Input
                          id="file-upload"
                          type="file"
                          accept=".csv"
                          className="hidden"
                          onChange={(e) => {
                            const selectedFile = e.target.files?.[0];
                            if (selectedFile) handleFileSelect(selectedFile);
                          }}
                        />
                        <Button variant="outline" size="sm" className="mt-2">
                          Select File
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>

                {/* Import Progress */}
                {importing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Importing customers...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                {/* Instructions */}
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    CSV should include columns: name, email, company, phone, status, health_score, monthly_revenue
                  </AlertDescription>
                </Alert>
              </>
            )}

            {/* Import Results */}
            {importResult && (
              <div className="space-y-4">
                <Alert className={importResult.success > 0 ? 'border-accent' : 'border-destructive'}>
                  {importResult.success > 0 ? (
                    <CheckCircle className="h-4 w-4 text-accent" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                  <AlertDescription>
                    {importResult.success > 0 && (
                      <span className="text-accent font-medium">
                        Successfully imported {importResult.success} customers
                      </span>
                    )}
                    {importResult.failed > 0 && (
                      <span className="text-destructive font-medium">
                        {importResult.failed} customers failed to import
                      </span>
                    )}
                  </AlertDescription>
                </Alert>

                {importResult.errors.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-destructive">Errors:</Label>
                    <ul className="text-sm text-destructive space-y-1">
                      {importResult.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Badge variant="outline">
                    {importResult.success} Success
                  </Badge>
                  {importResult.failed > 0 && (
                    <Badge variant="destructive">
                      {importResult.failed} Failed
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sample" className="space-y-4">
            <div className="space-y-4">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Sample CSV Template</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download a sample CSV file with the correct format and example data
                </p>
                <Button onClick={downloadSample} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Sample CSV
                </Button>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Required columns:</strong> name, email<br />
                  <strong>Optional columns:</strong> company, phone, status, health_score, monthly_revenue
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Sample Data Preview:</Label>
                <div className="text-xs font-mono bg-muted p-3 rounded border overflow-x-auto">
                  <div>name,email,company,phone,status,health_score,monthly_revenue</div>
                  {sampleData.map((item, index) => (
                    <div key={index} className="text-muted-foreground">
                      "{item.name}","{item.email}","{item.company}","{item.phone}","{item.status}",{item.health_score},{item.monthly_revenue}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {!importResult && (
            <Button 
              onClick={handleImport} 
              disabled={!file || importing}
            >
              {importing ? 'Importing...' : 'Import Customers'}
            </Button>
          )}
          {importResult && (
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
