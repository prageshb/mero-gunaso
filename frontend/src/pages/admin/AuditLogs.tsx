import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockAuditLogs } from '@/data/mockData';
import { format } from 'date-fns';
import { History } from 'lucide-react';
const AuditLogs = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold">Audit Logs</h2>
        <p className="text-muted-foreground">System activity and change history</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="hidden md:table-cell">Changed By</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAuditLogs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <History className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline">{log.action}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.action === 'STATUS_CHANGE' && (
                        <span className="text-sm">
                          {log.oldStatus} → {log.newStatus}
                        </span>
                      )}
                      {log.details && (
                        <span className="text-sm text-muted-foreground">{log.details}</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{log.changedBy}</TableCell>
                    <TableCell>
                      {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default AuditLogs;