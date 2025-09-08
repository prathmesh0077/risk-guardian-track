import { Student, RiskConfig } from '@/types/student';

const STUDENTS_KEY = 'students';
const RISK_CONFIG_KEY = 'risk_config';

export const defaultRiskConfig: RiskConfig = {
  attendanceWeight: 0.5,
  marksWeight: 0.35,
  feesWeight: 0.15,
  highThreshold: 60,
  mediumThreshold: 30,
};

export const storage = {
  getStudents(): Student[] {
    const data = localStorage.getItem(STUDENTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveStudents(students: Student[]): void {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  },

  addStudent(student: Student): void {
    const students = this.getStudents();
    students.push(student);
    this.saveStudents(students);
  },

  updateStudent(updatedStudent: Student): void {
    const students = this.getStudents();
    const index = students.findIndex(s => s.id === updatedStudent.id);
    if (index !== -1) {
      students[index] = updatedStudent;
      this.saveStudents(students);
    }
  },

  deleteStudent(id: string): void {
    const students = this.getStudents().filter(s => s.id !== id);
    this.saveStudents(students);
  },

  getRiskConfig(): RiskConfig {
    const data = localStorage.getItem(RISK_CONFIG_KEY);
    return data ? JSON.parse(data) : defaultRiskConfig;
  },

  saveRiskConfig(config: RiskConfig): void {
    localStorage.setItem(RISK_CONFIG_KEY, JSON.stringify(config));
  },

  exportData(): string {
    const students = this.getStudents();
    const config = this.getRiskConfig();
    return JSON.stringify({ students, config }, null, 2);
  },

  importData(jsonData: string): { success: boolean; error?: string } {
    try {
      const data = JSON.parse(jsonData);
      if (data.students) {
        this.saveStudents(data.students);
      }
      if (data.config) {
        this.saveRiskConfig(data.config);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid JSON format' };
    }
  }
};