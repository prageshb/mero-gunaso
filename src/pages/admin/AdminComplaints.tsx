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
import { Badge } from '@/components/ui/badge';
import { Complaint, ComplaintStatus, Department } from '@/types';
import { format } from 'date-fns';
import { Search, Eye, Trash2, Lock, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';

const AdminComplaints = () => {
  const { user, isSuperAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['complaints', page], // Refetch when page changes
    queryFn: () => api.get<any>(`/complaints?page=${page}&size=20`)
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get<Department[]>('/departments')
  });

  // Extract complaints and pagination info from the Page object
  const complaintsList = Array.isArray(data) ? data : (data?.content || []);
  const totalPages = data?.totalPages || 1;

  // Local filtering (for search/status within the current page)
  const filteredComplaints = complaintsList.filter((complaint: any) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (complaint.ticketId && complaint.ticketId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };

  const handleStatusChange = async (complaintId: string, newStatus: ComplaintStatus) => {
    try {
      await api.patch(`/complaints/${complaintId}/status`, { status: newStatus });
      toast.success('Status updated');
      refetch();
      
      setSelectedComplaint(prev => {
        const pId = prev?.stringId || (prev?.id as any)?.toString() || prev?.id;
        return pId === complaintId ? { ...prev!, status: newStatus } : prev;
      });
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAddNote = async (complaintId: string, note: string) => {
    try {
      const updatedComplaint = await api.post<Complaint>(`/complaints/${complaintId}/notes`, { content: note });
      toast.success('Note added');
      refetch();
      setSelectedComplaint(updatedComplaint);
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  const handleDelete = async (complaintId: string) => {
    if (!isSuperAdmin) return;
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    
    try {
      await api.delete(`/complaints/${complaintId}`);
      toast.success('Complaint deleted');
      refetch();
    } catch (error) {
      toast.error('Failed to delete complaint');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in mb-20">
      <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-6 pt-6">
          <div className="flex items-center gap-3">
             <Filter className="h-5 w-5 text-primary/60" />
             <CardTitle className="text-xl font-bold">
               {isSuperAdmin ? 'All Complaints' : 'Department Complaints'}
             </CardTitle>
          </div>
          <Badge variant="outline" className="px-3 py-1 font-bold rounded-lg border-primary/20 bg-primary/5 text-primary">
            {data?.totalElements || 0} Total Records
          </Badge>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Enhanced Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                placeholder="Search by title, name, TID or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl border-border/60 bg-muted/20"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-xl border-border/60 font-medium">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/40 shadow-lg">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="NOT_OPENED">Not Opened</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Optimized Table */}
          <div className="rounded-xl border border-border/60 overflow-hidden bg-card/50">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[100px] font-bold text-xs uppercase tracking-widest text-muted-foreground py-4">ID</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4">Title & Name</TableHead>
                  <TableHead className="hidden md:table-cell font-bold text-xs uppercase tracking-widest text-muted-foreground py-4">Department</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4">Status</TableHead>
                  <TableHead className="hidden lg:table-cell font-bold text-xs uppercase tracking-widest text-muted-foreground py-4">Submitted Date</TableHead>
                  <TableHead className="text-right font-bold text-xs uppercase tracking-widest text-muted-foreground py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.map((complaint: any) => (
                  <TableRow key={complaint.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <span className="font-mono text-[10px] font-black px-2 py-1 rounded-lg bg-primary/5 text-primary border border-primary/10">
                        {complaint.ticketId || (complaint.id?.toString().substring(0, 6).toUpperCase())}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{complaint.title}</span>
                          {!complaint.isPublic && (
                            <Badge variant="outline" className="text-[9px] h-4 px-1 gap-1 border-amber-200 bg-amber-50 text-amber-700 font-bold uppercase tracking-widest">
                              <Lock className="h-2 w-2" />
                              Private
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">{complaint.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell py-4">
                       <span className="text-sm font-medium text-muted-foreground">
                        {departments.find(d => (d.stringId || d.id) === complaint.departmentId)?.name || 'Department'}
                       </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <StatusBadge status={complaint.status} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell py-4">
                      <span className="text-sm font-medium text-muted-foreground">
                        {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <div className="flex justify-end gap-1.5 px-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl hover:bg-primary/5 hover:text-primary transition-all"
                          onClick={() => handleViewComplaint(complaint)}
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </Button>
                        {isSuperAdmin && (
                           <Button
                             variant="ghost"
                             size="icon"
                             className="h-9 w-9 rounded-xl text-destructive/60 hover:text-destructive hover:bg-destructive/5 transition-all"
                             onClick={() => handleDelete(complaint.stringId || (complaint.id as any)?.$oid || (complaint.id as any)?.toString() || complaint.id!)}
                           >
                             <Trash2 className="h-4.5 w-4.5" />
                           </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredComplaints.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20">
                      <div className="flex flex-col items-center gap-3">
                         <div className="h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center">
                            <Search className="h-6 w-6 text-muted-foreground/30" />
                         </div>
                         <p className="text-muted-foreground font-bold">No results found for your search</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                
                {isLoading && (
                  <TableRow>
                     <TableCell colSpan={6} className="text-center py-32">
                        <div className="animate-pulse space-y-4">
                           <div className="h-4 w-1/2 bg-muted mx-auto rounded-full"></div>
                           <div className="h-3 w-1/3 bg-muted/60 mx-auto rounded-full"></div>
                        </div>
                     </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Modern Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 p-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">
                Page <span className="text-primary">{page + 1}</span> of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                  className="rounded-xl border-border/60 font-bold h-10 px-4 gap-2 transition-all hover:bg-primary hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                  PREVIOUS
                </Button>
                <div className="flex items-center gap-1.5 px-2">
                   {[...Array(totalPages)].map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setPage(i)}
                        className={`h-2 w-2 rounded-full transition-all ${page === i ? 'bg-primary w-6' : 'bg-muted-foreground/20 hover:bg-muted-foreground/40'}`}
                      />
                   ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                  disabled={page === totalPages - 1}
                  className="rounded-xl border-border/60 font-bold h-10 px-4 gap-2 transition-all hover:bg-primary hover:text-white"
                >
                  NEXT
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
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