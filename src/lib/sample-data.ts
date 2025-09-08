import { Student, WeeklySnapshot } from '@/types/student';
import { v4 as uuidv4 } from 'uuid';

// Sample students data for demo purposes
export const sampleStudents: Student[] = [
  {
    id: uuidv4(),
    name: "राज कुमार",
    attendancePercent: 45,
    marksPercent: 35,
    feesPaid: false,
    guardianPhone: "9123456789",
    lastUpdated: new Date().toISOString(),
    history: [
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        attendancePercent: 48,
        marksPercent: 32,
        feesPaid: false
      },
      {
        date: new Date().toISOString(),
        attendancePercent: 45,
        marksPercent: 35,
        feesPaid: false
      }
    ]
  },
  {
    id: uuidv4(),
    name: "प्रिया सिंह",
    attendancePercent: 85,
    marksPercent: 76,
    feesPaid: true,
    guardianPhone: "9876543210",
    lastUpdated: new Date().toISOString(),
    history: [
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        attendancePercent: 82,
        marksPercent: 74,
        feesPaid: true
      },
      {
        date: new Date().toISOString(),
        attendancePercent: 85,
        marksPercent: 76,
        feesPaid: true
      }
    ]
  },
  {
    id: uuidv4(),
    name: "अमित शर्मा",
    attendancePercent: 65,
    marksPercent: 58,
    feesPaid: true,
    guardianPhone: "9555444333",
    lastUpdated: new Date().toISOString(),
    history: [
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        attendancePercent: 62,
        marksPercent: 55,
        feesPaid: false
      },
      {
        date: new Date().toISOString(),
        attendancePercent: 65,
        marksPercent: 58,
        feesPaid: true
      }
    ]
  },
  {
    id: uuidv4(),
    name: "सुनीता पटेल",
    attendancePercent: 92,
    marksPercent: 89,
    feesPaid: true,
    guardianPhone: "9888777666",
    lastUpdated: new Date().toISOString(),
    history: [
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        attendancePercent: 90,
        marksPercent: 87,
        feesPaid: true
      },
      {
        date: new Date().toISOString(),
        attendancePercent: 92,
        marksPercent: 89,
        feesPaid: true
      }
    ]
  },
  {
    id: uuidv4(),
    name: "रोहित गुप्ता",
    attendancePercent: 55,
    marksPercent: 42,
    feesPaid: false,
    guardianPhone: "9777888999",
    lastUpdated: new Date().toISOString(),
    history: [
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        attendancePercent: 58,
        marksPercent: 45,
        feesPaid: false
      },
      {
        date: new Date().toISOString(),
        attendancePercent: 55,
        marksPercent: 42,
        feesPaid: false
      }
    ]
  }
];

export const sampleCSV = `name,attendance,marks,fees_paid,guardian_phone
राज कुमार,72,54,No,9123456789
प्रिया सिंह,85,76,Yes,9876543210
अमित शर्मा,68,61,Yes,9555444333
सुनीता पटेल,92,89,Yes,9888777666
रोहित गुप्ता,58,45,No,9777888999`;