// Core domain types for Mero Gunaso
export type ComplaintStatus = 'NOT_OPENED' | 'IN_PROGRESS' | 'DONE';
export type UserRole = 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN';
export interface Department {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}
export interface Complaint {
  id: string;
  title: string;
  description: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  department?: Department;
  status: ComplaintStatus;
  attachments: string[];
  createdAt: string;
  internalNotes?: InternalNote[];
}
export interface InternalNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}
export interface Admin {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  departmentId?: string;
  department?: Department;
  createdAt: string;
}
export interface AuditLog {
  id: string;
  complaintId?: string;
  action: string;
  oldStatus?: ComplaintStatus;
  newStatus?: ComplaintStatus;
  changedBy: string;
  timestamp: string;
  details?: string;
}
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  departmentId?: string;
  token: string;
}
// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}