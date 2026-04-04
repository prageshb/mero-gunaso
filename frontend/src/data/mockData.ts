import { Admin, AuditLog, Complaint, Department } from '@/types';
export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Roads & Transportation',
    description: 'Issues related to roads, highways, and public transportation',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Water Supply',
    description: 'Water supply, drainage, and sewage related issues',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '3',
    name: 'Electricity',
    description: 'Power supply, street lights, and electrical infrastructure',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '4',
    name: 'Sanitation',
    description: 'Garbage collection, public cleanliness, and waste management',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '5',
    name: 'Health Services',
    description: 'Public health facilities and medical services',
    createdAt: '2024-01-15T10:00:00Z',
  },
];
export const mockComplaints: Complaint[] = [
  {
    id: '1',
    title: 'Pothole on Main Street causing accidents',
    description: 'There is a large pothole near the intersection. It has been there for over two months and has caused multiple accidents. The pothole is approximately 2 feet wide and 11 inches deep.',
    name: 'Mahendra Thapa',
    email: 'mahendrathapa@email.com',
    phone: '+977-9841234567',
    departmentId: '1',
    status: 'IN_PROGRESS',
    attachments: [],
    createdAt: '2024-12-01T08:30:00Z',
    internalNotes: [
      {
        id: 'n1',
        content: 'Inspection team dispatched. Confirmed pothole location.',
        createdBy: 'Admin Singh',
        createdAt: '2024-12-02T10:00:00Z',
      },
    ],
  },
  {
    id: '2',
    title: 'No water supply for 3 days',
    description: 'Our ward has not received water supply for the past three days. This is affecting over 50 households. We need immediate attention to resolve this issue.',
    name: 'Sita Thapa',
    email: 'sita.thapa@email.com',
    phone: '+977-9851234567',
    departmentId: '2',
    status: 'NOT_OPENED',
    attachments: [],
    createdAt: '2024-12-10T14:20:00Z',
  },
  {
    id: '3',
    title: 'Street light not working',
    description: 'The street light at the corner of Green Park has not been working for over a week. This creates safety concerns for pedestrians and residents in the evening.',
    name: 'Hari Prasad',
    email: 'hari.prasad@email.com',
    phone: '+977-9861234567',
    departmentId: '3',
    status: 'DONE',
    attachments: [],
    createdAt: '2024-11-20T09:15:00Z',
    internalNotes: [
      {
        id: 'n2',
        content: 'Light bulb replaced and tested.',
        createdBy: 'Admin Rai',
        createdAt: '2024-11-22T16:00:00Z',
      },
    ],
  },
  {
    id: '4',
    title: 'Garbage not collected for a week',
    description: "The garbage collection service has not visited our area for the past week. Waste is piling up and creating a health hazard. It seems Belun dai isn't actually the god.",
    name: 'Dipesh Karki',
    email: 'dipesh@email.com',
    phone: '+977-9871234567',
    departmentId: '4',
    status: 'IN_PROGRESS',
    attachments: [],
    createdAt: '2024-12-08T11:45:00Z',
  },
  {
    id: '5',
    title: 'Health center lacks basic medicines',
    description: 'The local health center has run out of basic medicines including paracetamol and antibiotics. Patients are being turned away or asked to buy from private pharmacies.',
    name: 'Lakesh Adhikari',
    email: 'adhikari@email.com',
    phone: '+977-9881234567',
    departmentId: '5',
    status: 'NOT_OPENED',
    attachments: [],
    createdAt: '2024-12-12T16:30:00Z',
  },
  {
    id: '6',
    title: 'Broken water pipe flooding street',
    description: 'A main water pipe has burst on Ring Road near the hospital. Water is flooding the street and making it difficult for vehicles to pass. Immediate repair needed.',
    name: 'Roshan Pathak',
    email: 'roshan@email.com',
    phone: '+977-9801234567',
    departmentId: '2',
    status: 'IN_PROGRESS',
    attachments: [],
    createdAt: '2024-12-11T07:00:00Z',
  },
];
export const mockAdmins: Admin[] = [
  {
    id: '1',
    email: 'superadmin@merogunaso.gov.np',
    name: 'Super Administrator',
    role: 'ROLE_SUPER_ADMIN',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'mahendra@merogunaso.gov.np',
    name: 'Mahendra Thapa',
    role: 'ROLE_ADMIN',
    departmentId: '1',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '3',
    email: 'dipesh@merogunaso.gov.np',
    name: 'Dipesh Karki',
    role: 'ROLE_ADMIN',
    departmentId: '2',
    createdAt: '2024-01-15T10:00:00Z',
  },
];
export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    complaintId: '1',
    action: 'STATUS_CHANGE',
    oldStatus: 'NOT_OPENED',
    newStatus: 'IN_PROGRESS',
    changedBy: 'Dipesh Karki',
    timestamp: '2024-12-02T10:00:00Z',
  },
  {
    id: '2',
    complaintId: '3',
    action: 'STATUS_CHANGE',
    oldStatus: 'IN_PROGRESS',
    newStatus: 'DONE',
    changedBy: 'Mahendra Thapa',
    timestamp: '2024-11-22T16:00:00Z',
  },
  {
    id: '3',
    action: 'ADMIN_CREATED',
    changedBy: 'Super Administrator',
    timestamp: '2024-01-15T10:00:00Z',
    details: 'Created admin: Mahendra Thapa',
  },
];
// Helper to get department by ID
export const getDepartmentById = (id: string): Department | undefined => {
  return mockDepartments.find(d => d.id === id);
};
// Get complaints with department info
export const getComplaintsWithDepartments = (): Complaint[] => {
  return mockComplaints.map(c => ({
    ...c,
    department: getDepartmentById(c.departmentId),
  }));
};
// Get admins with department info
export const getAdminsWithDepartments = (): Admin[] => {
  return mockAdmins.map(a => ({
    ...a,
    department: a.departmentId ? getDepartmentById(a.departmentId) : undefined,
  }));
};