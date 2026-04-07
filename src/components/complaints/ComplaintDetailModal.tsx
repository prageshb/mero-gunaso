import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from './StatusBadge';
import { Complaint, ComplaintStatus } from '@/types';
import { format } from 'date-fns';
import { Calendar, Building2, User, Mail, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin?: boolean;
  onStatusChange?: (complaintId: string, status: ComplaintStatus) => void;
  onAddNote?: (complaintId: string, note: string) => void;
}
export function ComplaintDetailModal({
  complaint,
  open,
  onOpenChange,
  isAdmin = false,
  onStatusChange,
  onAddNote,
}: ComplaintDetailModalProps) {
  const [newNote, setNewNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | null>(null);
  if (!complaint) return null;
  const handleStatusChange = () => {
    if (selectedStatus && onStatusChange) {
      const id = complaint.stringId || (complaint.id as any)?.toString() || (complaint as any).id?.$oid || complaint.id;
      onStatusChange(id as string, selectedStatus);
      toast.success('Status updated successfully');
      setSelectedStatus(null);
    }
  };
  const handleAddNote = () => {
    if (newNote.trim() && onAddNote) {
      const id = complaint.stringId || (complaint.id as any)?.toString() || (complaint as any).id?.$oid || complaint.id;
      onAddNote(id as string, newNote.trim());
      toast.success('Note added successfully');
      setNewNote('');
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-xl leading-tight pr-4">
              {complaint.title}
            </DialogTitle>
            <StatusBadge status={complaint.status} />
          </div>
        </DialogHeader>
        <div className="space-y-6">
          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {complaint.department && (
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                <span>{complaint.department.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(complaint.createdAt), 'MMMM d, yyyy • h:mm a')}</span>
            </div>
          </div>
          <Separator />
          {/* Description */}
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {complaint.description}
            </p>
          </div>
          {/* Contact Info (visible to admins) */}
          {isAdmin && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-3">Contact Information</h4>
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{complaint.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{complaint.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{complaint.phone}</span>
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Admin Actions */}
          {isAdmin && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-3">Update Status</h4>
                <div className="flex gap-2">
                  <Select
                    value={selectedStatus || complaint.status}
                    onValueChange={(value) => setSelectedStatus(value as ComplaintStatus)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NOT_OPENED">Not Opened</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="DONE">Done</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleStatusChange}
                    disabled={!selectedStatus || selectedStatus === complaint.status}
                  >
                    Update
                  </Button>
                </div>
              </div>
              {/* Internal Notes */}
              <div>
                <h4 className="font-medium mb-3">Internal Notes</h4>
                {complaint.internalNotes && complaint.internalNotes.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {complaint.internalNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 rounded-lg bg-muted text-sm"
                      >
                        <p className="mb-1">{note.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {note.createdBy} • {format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add an internal note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    variant="secondary"
                  >
                    Add Note
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}