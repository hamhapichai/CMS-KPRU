// Common types and interfaces

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

export interface Department {
  departmentId: number;
  departmentName: string;
  description?: string;
  isDeleted?: boolean;
}

export interface TableColumn<T = unknown> {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  sorter?: boolean | ((a: T, b: T) => number);
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    fullName: string;
    email: string;
    role: string;
    department?: string;
  };
}

export interface AISuggestion {
  suggestionId: number;
  complaintId: number;
  suggestion: string;
  category: string;
  confidence: number;
  createdAt: string;
  summarizedByAI: boolean;
}

export interface JwtPayload {
  id: string;
  username: string;
  role: string;
  exp: number;
  iat: number;
}

export interface ComplaintFormData {
  contactName?: string;
  contactEmail: string;
  contactPhone?: string;
  subject: string;
  message: string;
  isAnonymous: boolean;
  attachments?: File[];
}

// Event handler types
export type FormChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
export type FormSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;
export type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
export type FileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;

// Error types
export interface ErrorResponse {
  message: string;
  status?: number;
  code?: string;
}
