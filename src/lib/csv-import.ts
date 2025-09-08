import { Student, WeeklySnapshot } from '@/types/student';
import { v4 as uuidv4 } from 'uuid';

export interface ImportError {
  row: number;
  field: string;
  message: string;
  value: string;
}

export interface ImportResult {
  success: boolean;
  studentsImported: number;
  errors: ImportError[];
  students: Student[];
}

function validateAttendance(value: string): number | null {
  const num = parseFloat(value);
  if (isNaN(num) || num < 0 || num > 100) return null;
  return num;
}

function validateMarks(value: string): number | null {
  const num = parseFloat(value);
  if (isNaN(num) || num < 0 || num > 100) return null;
  return num;
}

function validateFeesPaid(value: string): boolean | null {
  const lower = value.toLowerCase().trim();
  if (lower === 'yes' || lower === 'true' || lower === '1') return true;
  if (lower === 'no' || lower === 'false' || lower === '0') return false;
  return null;
}

function validatePhone(value: string): string | null {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 10) return cleaned;
  return null;
}

export function parseCSV(csvContent: string): ImportResult {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    return {
      success: false,
      studentsImported: 0,
      errors: [{ row: 0, field: 'file', message: 'CSV must have header and at least one data row', value: '' }],
      students: []
    };
  }

  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const requiredFields = ['name', 'attendance', 'marks', 'fees_paid', 'guardian_phone'];
  
  // Check for required headers
  const missingFields = requiredFields.filter(field => !header.includes(field));
  if (missingFields.length > 0) {
    return {
      success: false,
      studentsImported: 0,
      errors: [{ 
        row: 0, 
        field: 'header', 
        message: `Missing required columns: ${missingFields.join(', ')}`, 
        value: header.join(', ') 
      }],
      students: []
    };
  }

  const errors: ImportError[] = [];
  const students: Student[] = [];
  const now = new Date().toISOString();

  for (let i = 1; i < lines.length; i++) {
    const rowData = lines[i].split(',').map(cell => cell.trim());
    const rowErrors: ImportError[] = [];
    
    if (rowData.length !== header.length) {
      errors.push({
        row: i + 1,
        field: 'row',
        message: 'Column count mismatch',
        value: rowData.join(', ')
      });
      continue;
    }

    const rowObject: { [key: string]: string } = {};
    header.forEach((col, idx) => {
      rowObject[col] = rowData[idx];
    });

    // Validate each field
    const name = rowObject.name?.trim();
    if (!name) {
      rowErrors.push({ row: i + 1, field: 'name', message: 'Name is required', value: rowObject.name || '' });
    }

    const attendance = validateAttendance(rowObject.attendance);
    if (attendance === null) {
      rowErrors.push({ row: i + 1, field: 'attendance', message: 'Attendance must be 0-100', value: rowObject.attendance });
    }

    const marks = validateMarks(rowObject.marks);
    if (marks === null) {
      rowErrors.push({ row: i + 1, field: 'marks', message: 'Marks must be 0-100', value: rowObject.marks });
    }

    const feesPaid = validateFeesPaid(rowObject.fees_paid);
    if (feesPaid === null) {
      rowErrors.push({ row: i + 1, field: 'fees_paid', message: 'Fees paid must be Yes/No', value: rowObject.fees_paid });
    }

    const guardianPhone = validatePhone(rowObject.guardian_phone);
    if (!guardianPhone) {
      rowErrors.push({ row: i + 1, field: 'guardian_phone', message: 'Phone must be 10 digits', value: rowObject.guardian_phone });
    }

    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
      continue;
    }

    // Create weekly snapshot
    const snapshot: WeeklySnapshot = {
      date: now,
      attendancePercent: attendance!,
      marksPercent: marks!,
      feesPaid: feesPaid!
    };

    // Create student record
    const student: Student = {
      id: uuidv4(),
      name: name!,
      attendancePercent: attendance!,
      marksPercent: marks!,
      feesPaid: feesPaid!,
      guardianPhone: guardianPhone!,
      lastUpdated: now,
      history: [snapshot]
    };

    students.push(student);
  }

  return {
    success: errors.length === 0,
    studentsImported: students.length,
    errors,
    students
  };
}

export function mergeStudents(existingStudents: Student[], newStudents: Student[]): Student[] {
  const merged = [...existingStudents];
  const now = new Date().toISOString();

  for (const newStudent of newStudents) {
    // Try to find existing student by phone first, then by exact name match
    let existingIndex = merged.findIndex(s => s.guardianPhone === newStudent.guardianPhone);
    if (existingIndex === -1) {
      existingIndex = merged.findIndex(s => s.name.toLowerCase() === newStudent.name.toLowerCase());
    }

    if (existingIndex !== -1) {
      // Update existing student with new snapshot
      const existing = merged[existingIndex];
      const newSnapshot: WeeklySnapshot = {
        date: now,
        attendancePercent: newStudent.attendancePercent,
        marksPercent: newStudent.marksPercent,
        feesPaid: newStudent.feesPaid
      };

      merged[existingIndex] = {
        ...existing,
        attendancePercent: newStudent.attendancePercent,
        marksPercent: newStudent.marksPercent,
        feesPaid: newStudent.feesPaid,
        lastUpdated: now,
        history: [...existing.history, newSnapshot]
      };
    } else {
      // Add as new student
      merged.push(newStudent);
    }
  }

  return merged;
}