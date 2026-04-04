import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getComplaintsWithDepartments, mockDepartments, mockAdmins } from '@/data/mockData';
import { FileText, Clock, CheckCircle, AlertCircle, Building2, Users } from 'lucide-react';
import { StatusBadge } from '@/components/complaints/StatusBadge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
const AdminDashboard = () => {
  const { user, isSuperAdmin } = useAuth();
  
  const allComplaints = getComplaintsWithDepartments();
  const complaints = isSuperAdmin
    ? allComplaints
    : allComplaints.filter(c => c.departmentId === user?.departmentId);
  const stats = {
    total: complaints.length,
    notOpened: complaints.filter(c => c.status === 'NOT_OPENED').length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    done: complaints.filter(c => c.status === 'DONE').length,
  };
  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold">Welcome back, {user?.name}</h2>
        <p className="text-muted-foreground">
          {isSuperAdmin
            ? 'You have access to all departments and system settings.'
            : `Managing complaints for ${mockDepartments.find(d => d.id === user?.departmentId)?.name || 'your department'}.`}
        </p>
      </div>
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Opened</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notOpened}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.done}</div>
          </CardContent>
        </Card>
      </div>
      {/* Super Admin Extra Stats */}
      {isSuperAdmin && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockDepartments.length}</div>
              <Link to="/admin/departments" className="text-xs text-primary hover:underline">
                Manage departments →
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAdmins.length}</div>
              <Link to="/admin/users" className="text-xs text-primary hover:underline">
                Manage admins →
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
      {/* Recent Complaints */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentComplaints.map(complaint => (
              <div
                key={complaint.id}
                className="flex items-start justify-between gap-4 pb-4 border-b last:border-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium truncate">{complaint.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {complaint.department?.name} • {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <StatusBadge status={complaint.status} />
              </div>
            ))}
            {recentComplaints.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No complaints yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default AdminDashboard;