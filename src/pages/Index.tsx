import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ComplaintCard } from '@/components/complaints/ComplaintCard';
import { Button } from '@/components/ui/button';
import { Complaint, Department, ComplaintStats } from '@/types';
import { Send, Search, FileText, Users, CheckCircle, ArrowRight, ShieldCheck, Sparkles, MessageSquarePlus, Activity, Landmark, Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: paginatedData, isLoading: complaintsLoading } = useQuery({
    queryKey: ['complaints', 6],
    queryFn: () => api.get<any>('/complaints?page=0&size=6', { requireAuth: false })
  });

  const allComplaints: Complaint[] = Array.isArray(paginatedData) ? paginatedData : (paginatedData?.content || []);

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get<Department[]>('/departments', { requireAuth: false })
  });

  const { data: globalStats } = useQuery({
    queryKey: ['complaint-stats'],
    queryFn: () => api.get<ComplaintStats>('/complaints/stats', { requireAuth: false })
  });

  const stats = {
    total: globalStats?.total || 0,
    inProgress: globalStats?.inProgress || 0,
    resolved: globalStats?.resolved || 0,
  };

  const complaints = allComplaints.map(c => ({
    ...c,
    department: departments.find(d => (d.stringId || d.id) === c.departmentId)
  }));

  const handleComplaintClick = (complaint: Complaint) => {
    const id = complaint.stringId || (complaint.id as any)?.toString() || complaint.id;
    navigate(`/complaints/${id}`);
  };

  return (
    <PublicLayout>
      <div className="relative min-h-screen mesh-gradient overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
          <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-primary/5 rounded-full blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-blue-400/5 rounded-full blur-[150px] animate-float-slow" />
        </div>

        {/* --- HERO SECTION --- */}
        <section className="relative pt-24 pb-20 lg:pt-40 lg:pb-32 px-6">
          <div className="container max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-10">
              {/* Dynamic Badge */}
              <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border-primary/20 text-primary scale-90 md:scale-100">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">The Pulse of the Community</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.95]">
                  Civil Action. <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-indigo-600">Visible results.</span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed font-medium">
                  Mero Gunaso is the digital bridge between citizens and government. Report local issues, track investigations, and witness the transformation in real-time.
                </p>
              </div>

              {/* CTA Group */}
              <div className="flex flex-col sm:flex-row gap-5 items-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <Link to="/submit">
                  <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold gap-3 shadow-[0_20px_50px_-15px_rgba(37,99,235,0.4)] hover:shadow-[0_25px_60px_-10px_rgba(37,99,235,0.5)] active:scale-95 transition-all bg-primary">
                    <MessageSquarePlus className="h-6 w-6" />
                    Submit Complaint
                  </Button>
                </Link>
                <Link to="/complaints">
                  <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold gap-3 bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-all border border-primary/20 hover:border-primary/40 shadow-sm active:scale-95">
                    <Search className="h-6 w-6 text-primary" />
                    View Complaints
                  </Button>
                </Link>
              </div>

              {/* Floating Live Stats Pills */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 pt-12 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                {[
                  { label: 'Citizen Reports', value: stats.total, icon: FileText, color: 'text-primary' },
                  { label: 'In Progress', value: stats.inProgress, icon: Activity, color: 'text-blue-500' },
                  { label: 'Issues Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-emerald-500' },
                ].map((stat, i) => (
                  <div key={i} className="glass-pill px-6 py-4 border-white/40 shadow-xl group hover:border-primary/30 transition-colors">
                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                    <div className="flex flex-col items-start leading-tight">
                       <span className="text-xl font-black tabular-nums">{stat.value}</span>
                       <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- THE PROCESS (Timeline) --- */}
        <section className="py-24 relative">
          <div className="container max-w-5xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              {/* Left Side: Text */}
              <div className="lg:w-1/3 sticky top-32 space-y-4">
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary tracking-widest uppercase font-black text-[10px] px-3 py-1">Workflow</Badge>
                <h2 className="text-4xl font-black tracking-tight leading-tight">How we <br/><span className="text-primary italic">Resolve</span>.</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">We've built a multi-layered verification system to ensure your voice reaches the right desk, every time.</p>
              </div>

              {/* Right Side: Timeline cards */}
              <div className="lg:w-2/3 space-y-12 pl-4">
                {[
                  { title: 'Data Submission', desc: 'Detail your concern via our secure portal. Upload photos and location data for precise investigation.', icon: Send, tag: 'Citizen Action' },
                  { title: 'Department Allocation', desc: 'Our system automatically routes your case to the responsible authority, from Public Works to Social Services.', icon: Landmark, tag: 'Distribution' },
                  { title: 'Citizen Audit', desc: 'Track every step. From "Not Opened" to "Done", you can monitor the status updates and departmental actions in real-time.', icon: Sparkles, tag: 'Transparency' },
                ].map((step, i) => (
                  <div key={i} className="relative pl-12 group">
                    {/* Line decoration */}
                    <div className="absolute left-[1.35rem] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 to-transparent group-last:from-primary/30 group-last:to-primary/0" />
                    <div className="absolute left-0 top-0 h-11 w-11 rounded-2xl glass-card border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-md">
                       <step.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-2 pb-8">
                       <div className="text-[10px] uppercase tracking-widest font-black text-primary/50">{step.tag}</div>
                       <h3 className="text-xl font-bold">{step.title}</h3>
                       <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* --- RECENT REPORTS --- */}
        <section className="py-24 container max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12 animate-fade-up">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <h2 className="text-4xl font-black tracking-tighter">Live Updates</h2>
                 <Badge className="bg-red-500 hover:bg-red-500 animate-pulse text-[10px] rounded-md px-1.5 h-5 border-none">LIVE</Badge>
              </div>
              <p className="text-sm text-muted-foreground max-w-xl font-medium">
                The latest reports from active citizens across all government departments.
              </p>
            </div>
            <Link to="/complaints">
              <Button variant="ghost" className="group text-primary font-bold text-xs gap-2 p-0 h-auto hover:bg-transparent uppercase tracking-[0.2em] transition-all hover:tracking-[0.25em]">
                View All Complaints
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 whitespace-nowrap" />
              </Button>
            </Link>
          </div>

          {complaintsLoading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 rounded-3xl bg-muted/20 animate-pulse border-border/40" />
              ))}
            </div>
          ) : complaints.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {complaints.map((complaint, index) => (
                <div key={complaint.id} className="animate-fade-up" style={{ animationDelay: `${0.1 * index}s` }}>
                  <ComplaintCard
                    complaint={complaint}
                    onClick={() => handleComplaintClick(complaint)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass-card rounded-3xl border border-dashed border-border/60">
              <div className="mb-6 h-16 w-16 bg-muted/40 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Search className="h-8 w-8 text-muted-foreground opacity-40" />
              </div>
              <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs">No active reports found</p>
            </div>
          )}
        </section>

        {/* CTA Footer Section */}
        <section className="py-32 container max-w-5xl mx-auto px-6 text-center animate-fade-up">
           <div className="p-12 md:p-24 rounded-[3.5rem] bg-[#06122d] border border-white/5 relative overflow-hidden group shadow-2xl">
              {/* Sophisticated Background Glows */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[120px] -z-0 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-500/10 blur-[100px] -z-0 pointer-events-none" />
              
              <div className="relative z-10 space-y-12">
                 <div className="space-y-6">
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight animate-fade-up">Ready to make an <br/><span className="text-primary italic">impact?</span></h2>
                    <p className="text-blue-100/60 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
                      Join thousands of citizens helping local authorities build a more responsive, <br className="hidden md:block"/>
                      transparent community for everyone.
                    </p>
                 </div>
                 
                 <div className="pt-2 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                    <Link to="/submit">
                      <Button size="lg" variant="secondary" className="h-16 px-14 rounded-2xl text-xl font-bold gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_-10px_rgba(37,99,235,0.3)] bg-white text-primary hover:bg-white/95">
                         Submit Complaint
                         <ArrowRight className="h-6 w-6" />
                      </Button>
                    </Link>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default Index;

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`rounded-xl border bg-card text-card-foreground shadow ${className}`}>
    {children}
  </div>
);