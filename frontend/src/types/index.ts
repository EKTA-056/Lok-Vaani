export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface Dataset {
  id: string;
  name: string;
  recordCount: number;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'error';
  userId: string;
}

export interface KPIData {
  totalDatasets: number;
  recordsProcessed: number;
  anomaliesFixed: number;
  jobCodesMatched: number;
}


export interface CleaningResult {
  totalRecords: number;
  errorsFound: number;
  anomaliesRemoved: number;
  duplicatesRemoved: number;
  processingTime: number;
}

export interface CommentProps {
    id?: string;
    raw_comment?: string;
    language?: string;
    categoryType?: string;
    bussiness_category?: string;
    sentiment?: 'Positive' | 'Negative' | 'Neutral';
    date?: string;
    state?: string;
    summary?: string;
    company?: string;
    updatedAt?: string;
    createdAt?: string;
}