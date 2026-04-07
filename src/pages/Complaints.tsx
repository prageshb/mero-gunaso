import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ComplaintCard } from '@/components/complaints/ComplaintCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Complaint, Department, ComplaintStats } from '@/types';
import { Search, FileText, Filter, X, ChevronLeft, ChevronRight, LayoutGrid, ListFilter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Badge } from '@/components/ui/badge';

const Complaints = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Pagination constants
  const pageSize = 21;

  const { data: paginatedData, isLoading: complaintsLoading } = useQuery({
    queryKey: ['complaints', currentPage, pageSize],
    queryFn: async () => {
      const response = await api.get<any>(`/complaints?page=${currentPage - 1}&size=${pageSize}`, { requireAuth: false });
      return response;
    }
  });

  const allComplaints = Array.isArray(paginatedData) ? paginatedData : (paginatedData?.content || []);
  const totalPages = paginatedData?.totalPages || (Array.isArray(paginatedData) ? 1 : 0);

  const { data: departments = [], isLoading: deptsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get<Department[]>('/departments', { requireAuth: false })
  });

  const { data: globalStats } = useQuery({
    queryKey: ['complaint-stats'],
    queryFn: () => api.get<ComplaintStats>('/complaints/stats', { requireAuth: false })
  });

  const totalReportsCount = globalStats?.total || 0;
  const resolvedCount = globalStats?.resolved || 0;

  const complaints = allComplaints.map(c => ({
    ...c,
    department: departments.find(d => (d.stringId || d.id) === c.departmentId)
  }));

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (complaint.ticketId?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesDepartment =
      departmentFilter === 'all' || complaint.departmentId === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const handleComplaintClick = (complaint: Complaint) => {
    const id = complaint.stringId || (complaint.id as any)?.toString() || complaint.id;
    navigate(`/complaints/${id}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDepartmentFilter('all');
  };

  const activeFiltersCount = 
    (statusFilter !== 'all' ? 1 : 0) + 
    (departmentFilter !== 'all' ? 1 : 0) + 
    (searchQuery !== '' ? 1 : 0);

  return (
    <PublicLayout>
      <div className="bg-background min-h-screen pb-32">
        {/* Modern Header Section */}
        <section className="bg-muted/30 border-b border-border/40 pt-10 pb-6">
          <div className="container px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
              <div className="space-y-2">
                <Badge variant="outline" className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
                  Citizen Hub
                </Badge>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Community Dashboard</h1>
                <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
                  Transparency in action. Monitor public grievances, track government responses, and see how your community is evolving.
                </p>
              </div>
              <div className="flex items-center gap-4 bg-card p-4 rounded-xl shadow-sm border border-border/40">
                <div className="text-right">
                  <div className="text-xl font-bold tracking-tight">{totalReportsCount}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">Total Reports</div>
                </div>
                <div className="h-8 w-[1px] bg-border/60"></div>
                <div className="text-right">
                  <div className="text-xl font-bold tracking-tight text-emerald-600">
                    {resolvedCount}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">Resolved Cases</div>
                </div>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-3 p-2 rounded-2xl bg-card border border-border/40 shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input
                  placeholder="Search by keywords, TID, or title..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-11 h-11 bg-transparent border-none shadow-none text-base focus-visible:ring-0 placeholder:text-muted-foreground/40"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground px-3 uppercase tracking-widest">
                  <ListFilter className="h-3.5 w-3.5" />
                  Filter By
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] h-9 bg-muted/40 border-none rounded-lg shadow-none font-bold text-[10px] uppercase tracking-wider">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40 shadow-lg">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="NOT_OPENED">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="DONE">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[170px] h-9 bg-muted/40 border-none rounded-lg shadow-none font-bold text-[10px] uppercase tracking-wider">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40 shadow-lg">
                    <SelectItem value="all" className="font-bold">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept.stringId || (dept.id as any)?.toString() || dept.id} value={(dept.stringId || (dept.id as any)?.toString() || dept.id) as string}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {activeFiltersCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-all"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Content Grid */}
        <section className="container px-6 py-12">
          <div className="flex items-center gap-3 mb-6">
            <LayoutGrid className="h-4 w-4 text-primary/60" />
            <span className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground/70">Showing {filteredComplaints.length} Records</span>
          </div>

          {complaintsLoading || deptsLoading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 rounded-[2.5rem] bg-muted/50 animate-pulse border border-border/20"></div>
              ))}
            </div>
          ) : filteredComplaints.length > 0 ? (
            <>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mb-12">
                {filteredComplaints.map(complaint => (
                  <div key={complaint.id} className="animate-fade-up">
                    <ComplaintCard
                      complaint={complaint}
                      onClick={() => handleComplaintClick(complaint)}
                    />
                  </div>
                ))}
              </div>

              {/* Enhanced Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-4 mt-8 bg-card/40 p-6 rounded-2xl border border-border/40">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="h-10 w-10 rounded-xl border-border/30 transition-all hover:bg-primary hover:text-white disabled:opacity-30"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-muted/60 rounded-xl">
                      <span className="text-[10px] font-bold tracking-widest text-foreground/60">PAGE</span>
                      <span className="text-base font-bold text-primary">{currentPage}</span>
                      <span className="text-[10px] font-bold tracking-widest text-muted-foreground">/</span>
                      <span className="text-xs font-bold text-muted-foreground">{totalPages}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="h-10 w-10 rounded-xl border-border/30 transition-all hover:bg-primary hover:text-white disabled:opacity-30"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="h-24 w-24 bg-muted/50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-dashed border-border/60">
                <Search className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2">No Matching Records</h3>
              <p className="text-muted-foreground max-w-sm font-medium leading-relaxed">
                We couldn't find any complaints matching your current filters. Try refining your search keywords or clearing the filters.
              </p>
              <Button onClick={clearFilters} variant="default" className="mt-8 rounded-2xl h-12 px-8 font-bold">
                Clear Filters
              </Button>
            </div>
          )}
        </section>
      </div>
    </PublicLayout>
  );
};

export default Complaints;
