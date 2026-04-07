import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Department } from '@/types';
import { format } from 'date-fns';
import { Plus, Trash2, Building2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
const departmentSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().trim().max(500).optional(),
});
type DepartmentFormData = z.infer<typeof departmentSchema>;
const Departments = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  
  const { data: departments = [], refetch } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get<Department[]>('/departments')
  });

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleEdit = (dept: Department) => {
    setEditingDepartment(dept);
    form.reset({
      name: dept.name,
      description: dept.description || '',
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      if (editingDepartment) {
        const id = editingDepartment.stringId || editingDepartment.id;
        await api.put(`/departments/${id}`, data);
        toast.success('Department updated successfully');
      } else {
        await api.post('/departments', data);
        toast.success('Department created successfully');
      }
      
      form.reset();
      setEditingDepartment(null);
      setDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to ${editingDepartment ? 'update' : 'create'} department`, {
        description: error.message
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/departments/${id}`);
      toast.success('Department deleted');
      refetch();
    } catch (error: any) {
      toast.error('Failed to delete department');
    }
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Departments</h2>
          <p className="text-muted-foreground">Manage government departments</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
                setEditingDepartment(null);
                form.reset({ name: '', description: '' });
            }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDepartment ? 'Edit Department' : 'Create Department'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Public Works" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the department"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => {
                        setDialogOpen(false);
                        setEditingDepartment(null);
                        form.reset();
                    }}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingDepartment ? 'Update' : 'Create'}</Button>
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
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden sm:table-cell">Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map(dept => (
                  <TableRow key={dept.stringId || dept.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {dept.name}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground max-w-[300px] truncate">
                      {dept.description || '—'}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {format(new Date(dept.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-primary hover:bg-primary/10"
                          onClick={() => handleEdit(dept)}
                          title="Edit Department"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete((dept.stringId || dept.id) as string)}
                          title="Delete Department"
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
export default Departments;