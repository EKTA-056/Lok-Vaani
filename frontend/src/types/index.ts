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

export interface Post {
  id: string;
  title: string;
  description: string;
  standardTitle: string | null;
  standardDescription: string | null;
  postType: string | null;
  issuedBy: string | null;
  issueDate: string | null;
  deadline: string | null;
  language: string | null;
  pdfBase64: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    comments: number;
    summaries: number;
  };
}

export interface CommentStats {
  positive: number;
  negative: number;
  neutral: number;
}

export interface StakeholderData {
  totalComments: number;
  stats: CommentStats;
}

export interface TrendData {
  week: string;
  positive: number;
  negative: number;
  neutral: number;
}

export interface WeightageData {
  category: string;
  positive: number;
  negative: number;
  neutral: number;
}

export interface CommentData {
  id: string;
  raw_comment?: string;
  language?: string;
  categoryType?: string;
  bussiness_category?: string;
  sentiment?: 'Positive' | 'Negative' | 'Neutral';
  date?: string;
  state?: string;
  summary?: string;
  company?: string;
  createdAt?: string;
}

export interface AlertData {
  id: string;
  title: string;
  description: string;
  count: number;
  alertType: 'warning' | 'error' | 'info';
}

export interface SummaryInsightsData {
  positiveHighlights: string;
  keyConcerns: string;
  neutralObservations: string;
}

export interface PolicyInsightsData {
  highPriorityActions: string[];
  mediumPriority: string[];
  strategicConsiderations: string[];
  topIssuesRaised: string[];
  topSuggestions: string[];
}

export interface OverallInsightsData {
  summary: SummaryInsightsData;
  policyInsights: PolicyInsightsData;
}

export interface DashboardData {
  totalComments: number;
  commentsProcessed: string;
  stats: CommentStats;
  stakeholders: {
    normalUsers: StakeholderData;
    industrialists: StakeholderData;
  };
  trendData: TrendData[];
  weightageData: WeightageData[];
  comments: CommentData[];
  alerts: AlertData[];
  insights: OverallInsightsData;
}

