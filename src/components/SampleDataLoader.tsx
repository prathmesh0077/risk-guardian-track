import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sampleStudents } from '@/lib/sample-data';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface SampleDataLoaderProps {
  onDataLoaded: () => void;
}

export function SampleDataLoader({ onDataLoaded }: SampleDataLoaderProps) {
  const { toast } = useToast();

  const loadSampleData = () => {
    storage.saveStudents(sampleStudents);
    onDataLoaded();
    
    toast({
      title: "Sample Data Loaded",
      description: `${sampleStudents.length} sample students have been added to get you started.`,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Get Started</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Load sample student data to explore the features of the risk tracking system.
        </p>
        <Button 
          onClick={loadSampleData}
          size="touch"
          className="w-full"
        >
          Load Sample Students
        </Button>
      </CardContent>
    </Card>
  );
}