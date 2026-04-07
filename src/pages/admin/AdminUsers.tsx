import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Admin, Department } from '@/types';
import { format } from 'date-fns';
import { Plus, User, Trash2, Pencil } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
const adminSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  departmentId: z.string().min(1, 'Please select a department'),
  role: z.string().min(1, 'Please select a role'),
});
type AdminFormData = z.infer<typeof adminSchema>;
const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  const form = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      departmentId: '',
      role: 'ROLE_ADMIN',
    },
  });

  const { data: allAdmins = [], refetch } = useQuery({
    queryKey: ['admins'],
    queryFn: () => api.get<Admin[]>('/admins')
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get<Department[]>('/departments')
  });

  // Helper to parse dates safely (Java LocalDateTime can sometimes come as an array)
  const parseDate = (dateData: any): Date => {
    if (!dateData) return new Date();
    if (dateData instanceof Date) return dateData;
    if (typeof dateData === 'string') return new Date(dateData);
    if (Array.isArray(dateData)) {
      // Handle [year, month, day, hour, minute, second]
      const [year, month, day, hour = 0, minute = 0, second = 0] = dateData;
      return new Date(year, month - 1, day, hour, minute, second);
    }
    return new Date();
  };

  // Map departments into admins
  const admins = Array.isArray(allAdmins) ? allAdmins.map(a => ({
    ...a,
    department: departments.find(d => (d.stringId || d.id) === a.departmentId)
  })) : [];

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    form.reset({
      name: admin.name,
      email: admin.email,
      password: '', // Password is never pre-filled for security
      departmentId: admin.departmentId,
      role: admin.role,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: AdminFormData) => {
    try {
      if (editingAdmin) {
        const adminId = editingAdmin.id as string;
        await api.put(`/admins/${adminId}`, data);
        toast.success('Admin updated successfully');
      } else {
        await api.post('/admins', data);
        toast.success('Admin created successfully');
      }
      
      form.reset();
      setEditingAdmin(null);
      setDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to ${editingAdmin ? 'update' : 'create'} admin`, {
        description: error.message
      });
    }
  };

  const handleDelete = async (adminId: string) => {
    if (!window.confirm('Are you sure you want to delete this admin account? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/admins/${adminId}`);
      toast.success('Admin deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error('Failed to delete admin', {
        description: error.message
      });
    }
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Admin Users</h2>
          <p className="text-muted-foreground">Manage admin accounts and assignments</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
                setEditingAdmin(null);
                form.reset({
                    name: '',
                    email: '',
                    password: '',
                    departmentId: '',
                    role: 'ROLE_ADMIN',
                });
            }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAdmin ? 'Edit Admin Account' : 'Create Admin Account'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Admin name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="admin@merogunaso.gov.np" {...field} />
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
                      <FormLabel>{editingAdmin ? 'New Password (Optional)' : 'Password'}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={editingAdmin ? "Leave blank to keep current" : "••••••••"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments?.map(dept => (
                            <SelectItem key={dept.stringId || (dept.id as any)?.toString() || dept.id} value={(dept.stringId || (dept.id as any)?.toString() || dept.id) as string}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ROLE_ADMIN">Department Admin</SelectItem>
                          <SelectItem value="ROLE_SUPER_ADMIN">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => {
                        setDialogOpen(false);
                        setEditingAdmin(null);
                        form.reset();
                    }}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingAdmin ? 'Update Admin' : 'Create Admin'}</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden sm:table-cell">Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map(admin => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{admin.name}</div>
                          <div className="text-sm text-muted-foreground">{admin.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={admin.role === 'ROLE_SUPER_ADMIN' ? 'default' : 'secondary'}>
                        {admin.role === 'ROLE_SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {admin.department?.name || '—'}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {format(parseDate(admin.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-primary hover:bg-primary/10"
                          onClick={() => handleEdit(admin)}
                          title="Edit Admin"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(admin.id as string)}
                          disabled={admin.id === currentUser?.id}
                          title={admin.id === currentUser?.id ? "You cannot delete your own account" : "Delete Admin"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default AdminUsers;