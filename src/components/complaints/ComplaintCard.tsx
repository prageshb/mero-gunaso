import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { Complaint } from '@/types';
import { Calendar, Building2, ExternalLink, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface ComplaintCardProps {
  complaint: Complaint;
  onClick?: () => void;
}

export function ComplaintCard({ complaint, onClick }: ComplaintCardProps) {
  return (
    <Card
      className="card-premium cursor-pointer group shadow-premium rounded-3xl overflow-hidden border-none"
      onClick={onClick}
    >
      <CardHeader className="pb-3 px-6 pt-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-primary/5 text-primary tracking-wider border border-primary/5">
            {complaint.ticketId || (complaint.id as any)?.toString().substring(0, 8).toUpperCase()}
          </span>
          <StatusBadge status={complaint.status} className="shrink-0" />
        </div>
        <h3 className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors text-foreground">
          {complaint.title}
        </h3>
      </CardHeader>
      <CardContent className="pt-0 px-6 pb-6">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {complaint.description}
        </p>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground uppercase tracking-widest border-t border-border/40 pt-3">
            {complaint.department && (
              <div className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span>{complaint.department.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>{format(new Date(complaint.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}