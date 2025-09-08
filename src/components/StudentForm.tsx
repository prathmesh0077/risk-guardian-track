import { useState } from 'react';
import { Student, WeeklySnapshot } from '@/types/student';
import { Button } from '@/components/ui/button';  
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { v4 as uuidv4 } from 'uuid';

interface StudentFormProps {
  student?: Student;
  onSave: (student: Student) => void;
  onCancel: () => void;
}

export function StudentForm({ student, onSave, onCancel }: StudentFormProps) {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    attendancePercent: student?.attendancePercent || 0,
    marksPercent: student?.marksPercent || 0,
    feesPaid: student?.feesPaid || false,
    guardianPhone: student?.guardianPhone || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.attendancePercent < 0 || formData.attendancePercent > 100) {
      newErrors.attendancePercent = 'Attendance must be between 0 and 100';  
    }

    if (formData.marksPercent < 0 || formData.marksPercent > 100) {
      newErrors.marksPercent = 'Marks must be between 0 and 100';
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.guardianPhone)) {
      newErrors.guardianPhone = 'Phone number must be exactly 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const now = new Date().toISOString();
    
    // Create weekly snapshot
    const snapshot: WeeklySnapshot = {
      date: now,
      attendancePercent: formData.attendancePercent,
      marksPercent: formData.marksPercent,
      feesPaid: formData.feesPaid,
    };

    const updatedStudent: Student = {
      id: student?.id || uuidv4(),
      name: formData.name.trim(),
      attendancePercent: formData.attendancePercent,
      marksPercent: formData.marksPercent,
      feesPaid: formData.feesPaid,
      guardianPhone: formData.guardianPhone,
      lastUpdated: now,
      history: student ? [...student.history, snapshot] : [snapshot],
    };

    onSave(updatedStudent);
  };

  const copyFromLastWeek = () => {
    if (student && student.history.length > 0) {
      const lastSnapshot = student.history[student.history.length - 1];
      setFormData(prev => ({
        ...prev,
        attendancePercent: lastSnapshot.attendancePercent,
        marksPercent: lastSnapshot.marksPercent,
        feesPaid: lastSnapshot.feesPaid,
      }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{student ? 'Edit Student' : 'Add New Student'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Student Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter student name"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="attendance">Attendance (%)</Label>
              <Input
                id="attendance"
                type="number"
                min="0"
                max="100"
                value={formData.attendancePercent}
                onChange={(e) => setFormData(prev => ({ ...prev, attendancePercent: Number(e.target.value) }))}
                className={errors.attendancePercent ? 'border-destructive' : ''}
              />
              {errors.attendancePercent && <p className="text-sm text-destructive">{errors.attendancePercent}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="marks">Marks (%)</Label>
              <Input
                id="marks"
                type="number"
                min="0"
                max="100"
                value={formData.marksPercent}
                onChange={(e) => setFormData(prev => ({ ...prev, marksPercent: Number(e.target.value) }))}
                className={errors.marksPercent ? 'border-destructive' : ''}
              />
              {errors.marksPercent && <p className="text-sm text-destructive">{errors.marksPercent}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Guardian Phone</Label>
            <Input
              id="phone"
              value={formData.guardianPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, guardianPhone: e.target.value }))}
              placeholder="10-digit phone number"
              className={errors.guardianPhone ? 'border-destructive' : ''}
            />
            {errors.guardianPhone && <p className="text-sm text-destructive">{errors.guardianPhone}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="fees"
              checked={formData.feesPaid}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, feesPaid: checked }))}
            />
            <Label htmlFor="fees">Fees Paid</Label>
          </div>

          {student && student.history.length > 0 && (
            <div className="flex justify-center">
              <Button type="button" variant="outline" onClick={copyFromLastWeek}>
                Copy from Last Week
              </Button>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="submit" size="touch" className="flex-1">
              {student ? 'Update Student' : 'Add Student'}
            </Button>
            <Button type="button" variant="outline" size="touch" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}