import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Complaint, Department, Admin } from '@/types';
import { FileText, Clock, CheckCircle, AlertCircle, Building2, Users } from 'lucide-react';
import { StatusBadge } from '@/components/complaints/StatusBadge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const AdminDashboard = () => {
  const { user, isSuperAdmin } = useAuth();
  
  // Fetch only 10 most recent complaints for the dashboard
  const { data: recentData } = useQuery({
    queryKey: ['complaints', 'recent'],
    queryFn: () => api.get<any>('/complaints?page=0&size=10')
  });

  const recentComplaints = Array.isArray(recentData) ? recentData : (recentData?.content || []);

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get<Department[]>('/departments')
  });

  // Helper to parse dates safely
  const parseDate = (dateData: any): Date => {
    if (!dateData) return new Date();
    if (dateData instanceof Date) return dateData;
    if (typeof dateData === 'string') return new Date(dateData);
    if (Array.isArray(dateData)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = dateData;
      return new Date(year, month - 1, day, hour, minute, second);
    }
    return new Date();
  };

  const { data: allAdmins = [] } = useQuery({
    queryKey: ['admins'],
    queryFn: () => api.get<Admin[]>('/admins'),
    enabled: isSuperAdmin // Only fetch admin info if they are super admin
  });

  // Optimized statistics fetch
  const { data: statsData } = useQuery({
    queryKey: ['complaint-stats', user?.departmentId],
    queryFn: () => api.get<any>('/complaints/stats')
  });

  const stats = {
    total: statsData?.total || 0,
    resolved: statsData?.resolved || 0,
    inProgress: statsData?.inProgress || 0,
    notOpened: (statsData?.total || 0) - (statsData?.resolved || 0) - (statsData?.inProgress || 0),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h2>
        <p className="text-muted-foreground text-sm">
          {isSuperAdmin
            ? 'You have access to all departments and system settings.'
            : `Managing complaints for ${departments.find(d => (d.stringId || d.id) === user?.departmentId)?.name || 'your department'}.`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-none shadow-sm bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-blue-600/70">Total Complaints</CardTitle>
            <FileText className="h-4 w-4 text-blue-600/50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight text-blue-700">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-none shadow-sm bg-amber-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-amber-600/70">New / Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600/50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight text-amber-700">{stats.notOpened}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm bg-indigo-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-indigo-600/70">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-indigo-600/50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight text-indigo-700">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm bg-emerald-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-emerald-600/70">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600/50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight text-emerald-700">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {isSuperAdmin && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Departments</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
              <Link to="/admin/departments" className="text-xs text-primary hover:underline font-semibold mt-2 inline-block">
                Manage departments →
              </Link>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Admins</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allAdmins.length}</div>
              <Link to="/admin/users" className="text-xs text-primary hover:underline font-semibold mt-2 inline-block">
                Manage admins →
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Complaints */}
      <Card className="rounded-2xl border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
          <CardTitle className="text-lg font-bold">Recent Complaints</CardTitle>
          <Link to="/admin/complaints" className="text-xs font-semibold text-primary hover:underline">
            View All →
          </Link>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {recentComplaints.map((complaint: any) => (
              <div
                key={complaint.stringId || complaint.id}
                className="flex items-center justify-between gap-4 pb-4 border-b border-dashed border-border/60 last:border-0 last:pb-0 group"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{complaint.title}</h4>
                  <p className="text-xs text-muted-foreground font-medium mt-1">
                    {departments.find(d => (d.stringId || d.id) === complaint.departmentId)?.name || 'Department'} • {format(parseDate(complaint.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <StatusBadge status={complaint.status} />
              </div>
            ))}
            {recentComplaints.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">No complaints yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;