import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Department } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Loader2, User, Mail, Phone, Building2, FileText, Info, Globe, Lock } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const complaintSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email address').max(255),
  phone: z.string().trim().min(10, 'Please enter a valid phone number').max(20),
  departmentId: z.string().min(1, 'Please select a department'),
  title: z.string().trim().min(10, 'Title must be at least 10 characters').max(200),
  description: z.string().trim().min(50, 'Description must be at least 50 characters').max(2000),
  isPublic: z.boolean().default(true),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

export function ComplaintForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const form = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      departmentId: '',
      title: '',
      description: '',
      isPublic: true,
    },
  });

  const { data: departments, isLoading: isDepartmentsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get<Department[]>('/departments', { requireAuth: false })
  });

  const onSubmit = async (data: ComplaintFormData) => {
    setIsSubmitting(true);
    
    try {
      await api.post('/complaints', data, { requireAuth: false });
      
      toast.success('Complaint submitted successfully!', {
        description: 'Your complaint has been registered and will be reviewed by the relevant department.',
      });
      
      navigate('/');
    } catch (error: any) {
      toast.error('Failed to submit complaint', {
        description: error.message || 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
               <User className="h-4 w-4 text-primary" />
               <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Personal Details</h3>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight opacity-70">Full Name</FormLabel>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                      <FormControl>
                        <Input placeholder="Enter your full name" className="pl-10 h-11 rounded-xl bg-muted/20 border-border/60" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight opacity-70">Email Address</FormLabel>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" className="pl-10 h-11 rounded-xl bg-muted/20 border-border/60" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight opacity-70">Phone Number</FormLabel>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                      <FormControl>
                        <Input placeholder="+977-98XXXXXXXX" className="pl-10 h-11 rounded-xl bg-muted/20 border-border/60" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight opacity-70">Target Department</FormLabel>
                    <div className="relative group">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 z-10 group-focus-within:text-primary transition-colors" />
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isDepartmentsLoading}>
                        <FormControl>
                          <SelectTrigger className="pl-10 h-11 rounded-xl bg-muted/20 border-border/60">
                            <SelectValue placeholder={isDepartmentsLoading ? "Loading..." : "Select a department"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          {departments?.map(dept => (
                            <SelectItem key={dept.stringId || dept.id?.toString() || dept.id} value={(dept.stringId || dept.id?.toString() || dept.id) as string}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section 2: Complaint Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
               <FileText className="h-4 w-4 text-primary" />
               <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Report Details</h3>
            </div>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-tight opacity-70">Title</FormLabel>
                  <div className="relative group">
                    <Info className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                    <FormControl>
                      <Input placeholder="Describe the issue in one sentence" className="pl-10 h-11 rounded-xl bg-muted/20 border-border/60" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-tight opacity-70">Full Context</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please provide specific details, including locations and times..." 
                      className="min-h-[160px] rounded-xl bg-muted/20 border-border/60 p-4 focus-visible:ring-primary/20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section 3: Privacy with Selection Cards */}
          <div className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <div className="flex items-center justify-between">
                     <FormLabel className="text-sm font-bold text-foreground">Privacy Preference</FormLabel>
                     <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-2 py-0.5 rounded bg-muted">Secure Choice</span>
                  </div>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(val) => field.onChange(val === 'true')}
                      defaultValue={field.value ? 'true' : 'false'}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="relative">
                        <RadioGroupItem value="true" id="public" className="sr-only" />
                        <Label
                          htmlFor="public"
                          className={cn(
                            "flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:border-primary/40",
                            field.value === true ? "border-primary bg-primary/5 shadow-sm" : "border-border/60"
                          )}
                        >
                          <div className={cn("p-2 rounded-xl border bg-card", field.value === true ? "border-primary/20 text-primary" : "text-muted-foreground")}>
                            <Globe className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">Citizen Transparency</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Visible on the public dashboard to help others track similar issues.</p>
                          </div>
                        </Label>
                      </div>

                      <div className="relative">
                        <RadioGroupItem value="false" id="private" className="sr-only" />
                        <Label
                          htmlFor="private"
                          className={cn(
                            "flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:border-primary/40",
                            field.value === false ? "border-primary bg-primary/5 shadow-sm" : "border-border/60"
                          )}
                        >
                          <div className={cn("p-2 rounded-xl border bg-card", field.value === false ? "border-primary/20 text-primary" : "text-muted-foreground")}>
                            <Lock className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">Direct & Confidential</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Only visible to internal investigators and management.</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" size="lg" className="w-full h-12 rounded-xl font-bold uppercase tracking-widest gap-2 bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing Report...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Report
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}