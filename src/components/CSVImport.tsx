import { useState } from 'react';
import { Upload, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { parseCSV, ImportResult, ImportError } from '@/lib/csv-import';

interface CSVImportProps {
  onImport: (result: ImportResult) => void;
  onClose: () => void;
}

export function CSVImport({ onImport, onClose }: CSVImportProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (file: File) => {
    setIsProcessing(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const result = parseCSV(text);
      setImportResult(result);
      
      if (result.success) {
        onImport(result);
      }
    } catch (error) {
      setImportResult({
        success: false,
        studentsImported: 0,
        errors: [{ row: 0, field: 'file', message: 'Failed to read file', value: '' }],
        students: []
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => 
      file.type === 'text/csv' || 
      file.name.endsWith('.csv') ||
      file.type === 'application/vnd.ms-excel'
    );

    if (csvFile) {
      handleFile(csvFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const renderErrors = (errors: ImportError[]) => {
    if (errors.length === 0) return null;

    return (
      <div className="mt-4 space-y-2">
        <h4 className="font-semibold text-destructive">Import Errors:</h4>
        <div className="max-h-40 overflow-y-auto space-y-1">
          {errors.map((error, index) => (
            <Alert key={index} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Row {error.row}, {error.field}: {error.message}
                {error.value && ` (got: "${error.value}")`}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Import Students from CSV</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Upload a CSV file with the following required columns:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li><strong>name</strong> - Student name</li>
            <li><strong>attendance</strong> - Attendance percentage (0-100)</li>
            <li><strong>marks</strong> - Marks percentage (0-100)</li>
            <li><strong>fees_paid</strong> - Yes/No</li>
            <li><strong>guardian_phone</strong> - 10-digit phone number</li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Example CSV format:</p>
          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
{`name,attendance,marks,fees_paid,guardian_phone
Raj Kumar,72,54,No,9123456789
Priya Singh,85,76,Yes,9876543210`}
          </pre>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isProcessing ? 'Processing...' : 'Drop CSV file here'}
            </p>
            <p className="text-sm text-muted-foreground">or</p>
            <label className="inline-block">
              <Button variant="outline" size="touch" disabled={isProcessing} asChild>
                <span>
                  Choose File
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </span>
              </Button>
            </label>
          </div>
        </div>

        {importResult && (
          <div className="space-y-4">
            {importResult.success ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Successfully imported {importResult.studentsImported} students!
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Import failed. {importResult.studentsImported} students imported, {importResult.errors.length} errors found.
                </AlertDescription>
              </Alert>
            )}

            {renderErrors(importResult.errors)}

            {importResult.success && (
              <div className="flex justify-end">
                <Button onClick={onClose}>Close</Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}