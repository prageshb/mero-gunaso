import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ComplaintCard } from '@/components/complaints/ComplaintCard';
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
import { getComplaintsWithDepartments, mockDepartments } from '@/data/mockData';
import { Complaint, ComplaintStatus } from '@/types';
import { Send, Search, FileText, Users, CheckCircle } from 'lucide-react';
const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const complaints = getComplaintsWithDepartments();
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesDepartment =
      departmentFilter === 'all' || complaint.departmentId === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });
  const stats = {
    total: complaints.length,
    resolved: complaints.filter(c => c.status === 'DONE').length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
  };
  const handleComplaintClick = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="hero-gradient text-primary-foreground py-16 lg:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              Your Voice Matters
            </h1>
            <p className="text-lg lg:text-xl opacity-90 mb-8">
              Mero Gunaso is your platform to report civic issues and track their resolution.
              Submit complaints, monitor progress, and help build a better community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/submit">
                <Button size="lg" variant="accent" className="gap-2 w-full sm:w-auto">
                  <Send className="h-5 w-5" />
                  Submit a Complaint
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground"
                onClick={() => document.getElementById('complaints')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Search className="h-5 w-5" />
                View Complaints
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-12 bg-card border-b">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-muted/50">
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Complaints</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-muted/50">
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-full bg-warning/10">
                  <Users className="h-6 w-6 text-warning" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stats.inProgress}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-muted/50">
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-full bg-success/10">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stats.resolved}</div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </div>
          </div>
        </div>
      </section>
      {/* Complaints Feed */}
      <section id="complaints" className="py-12">
        <div className="container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Public Complaints</h2>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search complaints..."
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
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {mockDepartments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Complaints Grid */}
          {filteredComplaints.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredComplaints.map(complaint => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onClick={() => handleComplaintClick(complaint)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No complaints found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
      {/* Detail Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </PublicLayout>
  );
};
export default Index;