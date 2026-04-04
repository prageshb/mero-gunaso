import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { Complaint } from '@/types';
import { Calendar, Building2 } from 'lucide-react';
import { format } from 'date-fns';
interface ComplaintCardProps {
  complaint: Complaint;
  onClick?: () => void;
}
export function ComplaintCard({ complaint, onClick }: ComplaintCardProps) {
  return (
    <Card
      className="card-interactive cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-semibold text-base leading-tight line-clamp-2">
            {complaint.title}
          </h3>
          <StatusBadge status={complaint.status} className="shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {complaint.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {complaint.department && (
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              <span>{complaint.department.name}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(complaint.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}