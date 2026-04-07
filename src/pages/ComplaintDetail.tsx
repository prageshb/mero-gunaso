import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Complaint, Department } from '@/types';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { StatusBadge } from '@/components/complaints/StatusBadge';
import { format } from 'date-fns';
import { 
  Calendar, 
  Building2, 
  ArrowLeft, 
  Clock, 
  ShieldAlert, 
  FileText,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const ComplaintDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: complaint, isLoading, isError } = useQuery({
    queryKey: ['complaint', id],
    queryFn: () => api.get<Complaint>(`/complaints/${id}`, { requireAuth: false }),
    enabled: !!id,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get<Department[]>('/departments', { requireAuth: false }),
  });

  const department = departments.find(d => (d.stringId || d.id) === complaint?.departmentId);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container py-20">
          <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
            <div className="h-4 w-32 bg-muted rounded"></div>
            <div className="h-12 w-3/4 bg-muted rounded"></div>
            <div className="flex gap-4">
              <div className="h-6 w-24 bg-muted rounded"></div>
              <div className="h-6 w-32 bg-muted rounded"></div>
            </div>
            <div className="h-64 w-full bg-muted rounded"></div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (isError || !complaint) {
    return (
      <PublicLayout>
        <div className="container py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Complaint Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The complaint you are looking for does not exist, is private, or has been removed.
            </p>
            <Button onClick={() => navigate('/complaints')} variant="outline">
              Back to Complaints
            </Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-muted/30 min-h-screen pb-20">
        <div className="container py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/complaints" className="hover:text-foreground">Complaints</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {complaint.title}
            </span>
          </nav>

          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              className="mb-6 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-sm">
                  <CardContent className="pt-8 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={complaint.status} />
                        {!complaint.isPublic && (
                          <Badge variant="outline" className="gap-1 border-amber-200 bg-amber-50 text-amber-700">
                            <ShieldAlert className="h-3 w-3" />
                            Private Report
                          </Badge>
                        )}
                      </div>
                      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                        {complaint.title}
                      </h1>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-4 w-4" />
                          <span>{department?.name || 'Department Loading...'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(complaint.createdAt), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{format(new Date(complaint.createdAt), 'h:mm a')}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="prose prose-slate max-w-none">
                      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Detailed Description
                      </h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {complaint.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-primary/5">
                  <CardContent className="pt-6 space-y-4">
                    <h3 className="font-bold text-lg">Tracking Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Ticket ID</span>
                        <span className="font-mono bg-background px-2 py-0.5 rounded border text-xs font-bold text-primary">
                          {complaint.ticketId || id?.substring(0, 8).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Visibility</span>
                        <span className="capitalize">{complaint.isPublic ? 'Public' : 'Private'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span>{format(new Date(complaint.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <div className="p-4 rounded-lg bg-background border border-primary/20 text-xs leading-relaxed">
                        <p className="font-bold mb-1">Status: {complaint.status.replace('_', ' ')}</p>
                        <p className="text-muted-foreground">
                          {complaint.status === 'NOT_OPENED' && 'This report has been submitted and is awaiting review by the department.'}
                          {complaint.status === 'IN_PROGRESS' && 'The department has acknowledged this report and is currently working on a resolution.'}
                          {complaint.status === 'DONE' && 'This issue has been addressed and the ticket is now closed.'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ComplaintDetail;
