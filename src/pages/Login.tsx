import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { PublicLayout } from '@/components/layout/PublicLayout';
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
type LoginFormData = z.infer<typeof loginSchema>;
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const success = await login(data.email, data.password);
    setIsLoading(false);
    if (success) {
      toast.success('Login successful!');
      navigate('/admin');
    } else {
      toast.error('Invalid credentials', {
        description: 'Please check your email and password.',
      });
    }
  };
  return (
    <PublicLayout>
      <div className="relative min-h-[calc(100vh-80px)] flex flex-col mesh-gradient overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
          <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-pulse-soft" />
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] animate-float-slow" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 relative z-10">
          <div className="w-full max-w-md animate-fade-up">
            <div className="text-center mb-8 md:mb-10">
              <div className="mx-auto h-12 w-12 md:h-16 md:w-16 bg-gradient-to-tr from-primary to-blue-400 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4 md:mb-6 group hover:rotate-3 transition-transform duration-300">
                <Lock className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-2 md:mb-3 tracking-tight text-foreground">Secure Portal</h1>
              <p className="text-muted-foreground font-medium text-xs md:text-sm px-4">
                Enter your credentials to access the administrative dashboard.
              </p>
            </div>
            
            <Card className="glass-card rounded-3xl border-white/40 p-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)]">
              <CardContent className="pt-6 px-6 pb-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Official Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-white/70 border border-black/20 dark:border-white/20 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all text-sm md:text-base px-4 md:px-5 shadow-inner"
                              placeholder="admin@merogunaso.gov.np"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-white/70 border border-black/20 dark:border-white/20 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all text-sm md:text-base px-4 md:px-5 shadow-inner" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl text-sm md:text-base font-bold shadow-[0_10px_30px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_40px_-10px_rgba(37,99,235,0.5)] active:scale-95 transition-all mt-4 md:mt-6" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Authenticating...
                        </>
                      ) : (
                        'Login to Dashboard'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
export default Login;