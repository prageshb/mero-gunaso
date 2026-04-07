import { Badge } from '@/components/ui/badge';
import { ComplaintStatus } from '@/types';
import { cn } from '@/lib/utils';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplaintStatus;
  className?: string;
}

const statusConfig: Record<
  ComplaintStatus,
  { label: string; className: string; icon: any }
> = {
  NOT_OPENED: {
    label: 'Not Opened',
    className: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100',
    icon: Circle,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-50',
    icon: Clock,
  },
  DONE: {
    label: 'Resolved',
    className: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50',
    icon: CheckCircle2,
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1.5 font-medium text-xs px-2.5 py-0.5 rounded-full border',
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}