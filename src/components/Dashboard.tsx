import { useState, useEffect, useMemo } from 'react';
import { Plus, Upload, Filter, Languages } from 'lucide-react';
import { Student, StudentStats, RiskLevel } from '@/types/student';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/storage';
import { assessRisk } from '@/lib/risk-calculator';
import { mergeStudents } from '@/lib/csv-import';
import { RiskChart } from '@/components/RiskChart';
import { StudentCard } from '@/components/StudentCard';
import { StudentForm } from '@/components/StudentForm';
import { CSVImport } from '@/components/CSVImport';
import { SampleDataLoader } from '@/components/SampleDataLoader';
import { useToast } from '@/hooks/use-toast';

type FilterType = 'all' | 'high' | 'medium' | 'low';

export function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { toast } = useToast();

  // Load students on component mount
  useEffect(() => {
    const loadedStudents = storage.getStudents();
    setStudents(loadedStudents);
  }, []);

  // Get risk config and calculate stats
  const riskConfig = storage.getRiskConfig();
  
  const studentsWithRisk = useMemo(() => {
    return students.map(student => ({
      student,
      risk: assessRisk(student, riskConfig)
    }));
  }, [students, riskConfig]);

  const stats: StudentStats = useMemo(() => {
    const total = students.length;
    const high = studentsWithRisk.filter(s => s.risk.level === 'high').length;
    const medium = studentsWithRisk.filter(s => s.risk.level === 'medium').length;
    const low = studentsWithRisk.filter(s => s.risk.level === 'low').length;
    return { total, high, medium, low };
  }, [studentsWithRisk]);

  // Filter students based on current filter
  useEffect(() => {
    if (currentFilter === 'all') {
      setFilteredStudents(students);
    } else {
      const filtered = studentsWithRisk
        .filter(s => s.risk.level === currentFilter)
        .map(s => s.student);
      setFilteredStudents(filtered);
    }
  }, [students, studentsWithRisk, currentFilter]);

  const handleSaveStudent = (student: Student) => {
    if (editingStudent) {
      storage.updateStudent(student);
      toast({
        title: "Student Updated",
        description: `${student.name} has been updated successfully.`,
      });
    } else {
      storage.addStudent(student);
      toast({
        title: "Student Added",
        description: `${student.name} has been added successfully.`,
      });
    }
    
    setStudents(storage.getStudents());
    setEditingStudent(null);
    setShowAddForm(false);
  };

  const handleDeleteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    storage.deleteStudent(id);
    setStudents(storage.getStudents());
    
    if (student) {
      toast({
        title: "Student Deleted",
        description: `${student.name} has been removed.`,
        variant: "destructive",
      });
    }
  };

  const handleMarkFeesPaid = (id: string) => {
    const student = students.find(s => s.id === id);
    if (student) {
      const updatedStudent = { ...student, feesPaid: true };
      storage.updateStudent(updatedStudent);
      setStudents(storage.getStudents());
      
      toast({
        title: "Fees Marked as Paid",
        description: `${student.name}'s fees have been marked as paid.`,
      });
    }
  };

  const handleImport = (result: any) => {
    if (result.success) {
      const currentStudents = storage.getStudents();
      const mergedStudents = mergeStudents(currentStudents, result.students);
      storage.saveStudents(mergedStudents);
      setStudents(mergedStudents);
      setShowImport(false);
      
      toast({
        title: "Import Successful",
        description: `${result.studentsImported} students imported successfully.`,
      });
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const getStudentRisk = (student: Student): RiskLevel => {
    const assessment = studentsWithRisk.find(s => s.student.id === student.id);
    return assessment?.risk.level || 'low';
  };

  const texts = {
    en: {
      title: "Student Risk Tracker",
      subtitle: "Monitor at-risk students and track their progress",
      addStudent: "Add Student",
      importCSV: "Import CSV",
      statsTitle: "Risk Overview",
      total: "Total Students",
      highRisk: "High Risk",
      mediumRisk: "Medium Risk", 
      lowRisk: "Low Risk",
      all: "All",
      high: "High",
      medium: "Medium",
      low: "Low",
      students: "Students",
      noStudents: "No students found",
      addFirstStudent: "Add your first student to get started!"
    },
    hi: {
      title: "छात्र जोखिम ट्रैकर",
      subtitle: "जोखिम वाले छात्रों की निगरानी करें और उनकी प्रगति को ट्रैक करें",
      addStudent: "छात्र जोड़ें",
      importCSV: "CSV आयात करें",
      statsTitle: "जोखिम अवलोकन",
      total: "कुल छात्र",
      highRisk: "उच्च जोखिम",
      mediumRisk: "मध्यम जोखिम",
      lowRisk: "कम जोखिम", 
      all: "सभी",
      high: "उच्च",
      medium: "मध्यम",
      low: "कम",
      students: "छात्र",
      noStudents: "कोई छात्र नहीं मिला",
      addFirstStudent: "शुरुआत करने के लिए अपना पहला छात्र जोड़ें!"
    }
  };

  const t = texts[language];

  if (showAddForm || editingStudent) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <StudentForm
            student={editingStudent || undefined}
            onSave={handleSaveStudent}
            onCancel={() => {
              setShowAddForm(false);
              setEditingStudent(null);
            }}
          />
        </div>
      </div>
    );
  }

  if (showImport) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <CSVImport
            onImport={handleImport}
            onClose={() => setShowImport(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
              <p className="text-muted-foreground">{t.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-touch"
                onClick={toggleLanguage}
                title="Toggle Language"
              >
                <Languages className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="touch"
                onClick={() => setShowImport(true)}
              >
                <Upload className="w-4 h-4" />
                {t.importCSV}
              </Button>
              <Button
                size="touch"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="w-4 h-4" />
                {t.addStudent}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Chart */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {t.statsTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RiskChart stats={stats} />
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="text-sm text-muted-foreground">{t.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-risk-high">{stats.high}</div>
                <div className="text-sm text-muted-foreground">{t.highRisk}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-risk-medium">{stats.medium}</div>
                <div className="text-sm text-muted-foreground">{t.mediumRisk}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-risk-low">{stats.low}</div>
                <div className="text-sm text-muted-foreground">{t.lowRisk}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all' as FilterType, label: t.all, count: stats.total },
            { key: 'high' as FilterType, label: t.high, count: stats.high },
            { key: 'medium' as FilterType, label: t.medium, count: stats.medium },
            { key: 'low' as FilterType, label: t.low, count: stats.low },
          ].map(filter => (
            <Button
              key={filter.key}
              variant={currentFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentFilter(filter.key)}
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>

        {/* Students List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t.students}</h2>
            <span className="text-sm text-muted-foreground">
              {filteredStudents.length} {currentFilter !== 'all' ? currentFilter : ''} {t.students.toLowerCase()}
            </span>
          </div>

          {filteredStudents.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  {students.length === 0 ? t.addFirstStudent : t.noStudents}
                </div>
                {students.length === 0 && (
                  <div className="mt-4 space-y-4">
                    <Button
                      size="touch"
                      onClick={() => setShowAddForm(true)}
                    >
                      <Plus className="w-4 h-4" />
                      {t.addStudent}
                    </Button>
                    <div className="text-sm text-muted-foreground">or</div>
                    <SampleDataLoader onDataLoaded={() => setStudents(storage.getStudents())} />
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  riskLevel={getStudentRisk(student)}
                  onEdit={setEditingStudent}
                  onDelete={handleDeleteStudent}
                  onMarkFeesPaid={handleMarkFeesPaid}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}