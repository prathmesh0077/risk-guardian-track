import { Phone, MessageSquare, Edit, MoreVertical } from 'lucide-react';
import { Student, RiskLevel } from '@/types/student';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getRiskBadgeVariant } from '@/lib/risk-calculator';

interface StudentCardProps {
  student: Student;
  riskLevel: RiskLevel;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onMarkFeesPaid: (id: string) => void;
}

export function StudentCard({ student, riskLevel, onEdit, onDelete, onMarkFeesPaid }: StudentCardProps) {
  const handleCall = () => {
    window.open(`tel:${student.guardianPhone}`, '_self');
  };

  const handleSMS = () => {
    window.open(`sms:${student.guardianPhone}`, '_self');
  };

  const getRiskLabel = (level: RiskLevel): string => {
    switch (level) {
      case 'high': return 'High Risk';
      case 'medium': return 'Medium Risk';
      case 'low': return 'Low Risk';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-base truncate">{student.name}</h3>
              <Badge variant={getRiskBadgeVariant(riskLevel) as any}>
                {getRiskLabel(riskLevel)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {student.attendancePercent}% attendance • {student.marksPercent}% marks
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium">{student.guardianPhone}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                student.feesPaid 
                  ? 'bg-risk-low text-risk-low-foreground' 
                  : 'bg-risk-high text-risk-high-foreground'
              }`}>
                {student.feesPaid ? 'Fees Paid' : 'Fees Due'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="call"
                size="sm"
                onClick={handleCall}
                className="flex-1"
              >
                <Phone className="w-4 h-4" />
                Call
              </Button>
              <Button
                variant="message"
                size="sm"
                onClick={handleSMS}
                className="flex-1"
              >
                <MessageSquare className="w-4 h-4" />
                SMS
              </Button>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(student)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Student
              </DropdownMenuItem>
              {!student.feesPaid && (
                <DropdownMenuItem onClick={() => onMarkFeesPaid(student.id)}>
                  Mark Fees Paid
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => onDelete(student.id)}
                className="text-destructive"
              >
                Delete Student
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}