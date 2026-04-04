import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ComplaintDetailModal } from '@/components/complaints/ComplaintDetailModal';
import { StatusBadge } from '@/components/complaints/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getComplaintsWithDepartments, mockDepartments } from '@/data/mockData';
import { Complaint, ComplaintStatus } from '@/types';
import { format } from 'date-fns';
import { Search, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
const AdminComplaints = () => {
  const { user, isSuperAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [complaints, setComplaints] = useState(() => {
    const all = getComplaintsWithDepartments();
    return isSuperAdmin ? all : all.filter(c => c.departmentId === user?.departmentId);
  });
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };
  const handleStatusChange = (complaintId: string, newStatus: ComplaintStatus) => {
    setComplaints(prev =>
      prev.map(c =>
        c.id === complaintId ? { ...c, status: newStatus } : c
      )
    );
    setSelectedComplaint(prev =>
      prev?.id === complaintId ? { ...prev, status: newStatus } : prev
    );
  };
  const handleAddNote = (complaintId: string, note: string) => {
    const newNote = {
      id: `n${Date.now()}`,
      content: note,
      createdBy: user?.name || 'Admin',
      createdAt: new Date().toISOString(),
    };
    setComplaints(prev =>
      prev.map(c =>
        c.id === complaintId
          ? { ...c, internalNotes: [...(c.internalNotes || []), newNote] }
          : c
      )
    );
    setSelectedComplaint(prev =>
      prev?.id === complaintId
        ? { ...prev, internalNotes: [...(prev.internalNotes || []), newNote] }
        : prev
    );
  };
  const handleDelete = (complaintId: string) => {
    if (!isSuperAdmin) return;
    setComplaints(prev => prev.filter(c => c.id !== complaintId));
    toast.success('Complaint deleted');
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>
            {isSuperAdmin ? 'All Complaints' : 'Department Complaints'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, name, or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="NOT_OPENED">Not Opened</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden sm:table-cell">Submitted By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.map(complaint => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {complaint.title}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {complaint.department?.name}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {complaint.name}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={complaint.status} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewComplaint(complaint)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {isSuperAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(complaint.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredComplaints.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No complaints found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <ComplaintDetailModal
        complaint={selectedComplaint}
        open={modalOpen}
        onOpenChange={setModalOpen}
        isAdmin
        onStatusChange={handleStatusChange}
        onAddNote={handleAddNote}
      />
    </div>
  );
};
export default AdminComplaints;