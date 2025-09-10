export interface Attachment {
  attachmentId: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

export interface Complaint {
  complaintId: number;
  contactName?: string;
  contactEmail: string;
  contactPhone?: string;
  subject: string;
  message: string;
  submissionDate: string;
  currentStatus: string;
  isAnonymous: boolean;
  ticketId: string;
  attachments: Attachment[];
}

export interface ComplaintLog {
  logId: number;
  complaintId: number;
  timestamp: string;
  action: string;
  notes?: string;
  userId?: number;
  departmentId?: number;
  departmentName?: string;
  previousStatus: string;
  newStatus: string;
}

export interface ComplaintTracking {
  complaintId: number;
  ticketId: string;
  currentStatus: string;
  submissionDate: string;
  logs: ComplaintLog[];
}

export interface ComplaintTrackingResponse {
  complaintId: number;
  ticketId: string;
  subject: string;
  currentStatus: string;
  timeline: ComplaintLog[];
  currentAssignment?: {
    assignmentId: number;
    departmentId: number;
    departmentName: string;
    assignedDate: string;
    status: string;
    assignedToUserId?: number;
    assignedToUserName?: string;
    forwardingNotes?: string;
    processingNotes?: string;
    receivedDate?: string;
    completedDate?: string;
    closedDate?: string;
  };
}

export type ComplaintStatus = 
  | 'Submitted'
  | 'Forwarded' 
  | 'Received'
  | 'InProgress'
  | 'Completed'
  | 'Closed'
  | 'Rejected';

export const StatusDisplayNames: Record<ComplaintStatus, string> = {
  'Submitted': 'ส่งเรื่องแล้ว',
  'Forwarded': 'ส่งต่อแล้ว',
  'Received': 'รับเรื่องแล้ว',
  'InProgress': 'กำลังดำเนินการ',
  'Completed': 'ดำเนินการเสร็จ',
  'Closed': 'ปิดเรื่อง',
  'Rejected': 'ปฏิเสธ'
};

export const ActionDisplayNames: Record<string, string> = {
  'Submit': 'ส่งเรื่องร้องเรียน',
  'Forward': 'ส่งต่อเรื่อง',
  'Receive': 'รับเรื่อง',
  'StartProgress': 'เริ่มดำเนินการ',
  'Complete': 'ดำเนินการเสร็จ',
  'Close': 'ปิดเรื่อง',
  'Reject': 'ปฏิเสธเรื่อง'
};
