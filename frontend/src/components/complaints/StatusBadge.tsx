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
  { label: string; className: string; icon: typeof Circle }
> = {
  NOT_OPENED: {
    label: 'Not Opened',
    className: 'status-not-opened',
    icon: Circle,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'status-in-progress',
    icon: Clock,
  },
  DONE: {
    label: 'Done',
    className: 'status-done',
    icon: CheckCircle2,
  },
};
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <Badge
      variant="secondary"
      className={cn('gap-1.5 font-medium', config.className, className)}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}