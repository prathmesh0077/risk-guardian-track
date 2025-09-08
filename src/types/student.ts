export interface WeeklySnapshot {
  date: string;
  attendancePercent: number;
  marksPercent: number;
  feesPaid: boolean;
}

export interface Student {
  id: string;
  name: string;
  attendancePercent: number;
  marksPercent: number;
  feesPaid: boolean;
  guardianPhone: string;
  lastUpdated: string;
  history: WeeklySnapshot[];
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskConfig {
  attendanceWeight: number;
  marksWeight: number;
  feesWeight: number;
  highThreshold: number;
  mediumThreshold: number;
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number;
}

export interface StudentStats {
  total: number;
  high: number;
  medium: number;
  low: number;
}