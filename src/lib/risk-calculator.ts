import { Student, RiskLevel, RiskAssessment, RiskConfig } from '@/types/student';

export function calculateRiskScore(student: Student, config: RiskConfig): number {
  const attendanceScore = 100 - student.attendancePercent;
  const marksScore = 100 - student.marksPercent;
  const feesScore = student.feesPaid ? 0 : 100;

  return (
    config.attendanceWeight * attendanceScore +
    config.marksWeight * marksScore +
    config.feesWeight * feesScore
  );
}

export function getRiskLevel(score: number, config: RiskConfig): RiskLevel {
  if (score >= config.highThreshold) return 'high';
  if (score >= config.mediumThreshold) return 'medium';
  return 'low';
}

export function assessRisk(student: Student, config: RiskConfig): RiskAssessment {
  const score = calculateRiskScore(student, config);
  const level = getRiskLevel(score, config);
  return { level, score };
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'high': return 'hsl(var(--risk-high))';
    case 'medium': return 'hsl(var(--risk-medium))';
    case 'low': return 'hsl(var(--risk-low))';
  }
}

export function getRiskBadgeVariant(level: RiskLevel): string {
  switch (level) {
    case 'high': return 'risk-high';
    case 'medium': return 'risk-medium';
    case 'low': return 'risk-low';
  }
}