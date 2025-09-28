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

// Dashboard statistics - this object can be used across the application
export const dashboardData: DashboardData = {
  totalComments: 2548,
  commentsProcessed: "Comments Processed",
  stats: {
    positive: 1148,
    negative: 1022,
    neutral: 448,
  },
  stakeholders: {
    normalUsers: {
      totalComments: 1380,
      stats: {
        positive: 552, // 40%
        negative: 552, // 40%
        neutral: 276,  // 20%
      }
    },
    industrialists: {
      totalComments: 1168,
      stats: {
        positive: 467, // 40%
        negative: 467, // 40%
        neutral: 234,  // 20%
      }
    }
  },
  trendData: [
    { week: 'Jan 1', positive: 45, negative: 20, neutral: 35 },
    { week: 'Jan 8', positive: 52, negative: 18, neutral: 30 },
    { week: 'Jan 15', positive: 48, negative: 25, neutral: 27 },
    { week: 'Jan 22', positive: 65, negative: 15, neutral: 20 },
    { week: 'Jan 29', positive: 58, negative: 22, neutral: 20 },
    { week: 'Feb 5', positive: 70, negative: 12, neutral: 18 },
    { week: 'Feb 12', positive: 62, negative: 28, neutral: 10 },
  ],
  weightageData: [
    { category: 'Normal User', positive: 420, negative: 180, neutral: 120 },
    { category: 'Industrialist/Businessmen', positive: 728, negative: 842, neutral: 328 },
  ],
  comments: [
    {
      id: 'comment-001',
      raw_comment: 'I am deeply concerned about the increasing air pollution in our locality due to industrial activities. The smoke emissions from nearby factories are affecting the health of children and elderly residents. We need stricter environmental regulations and regular monitoring to ensure companies comply with pollution control norms. This is not just about business profits but about the wellbeing of our community.',
      language: 'English',
      categoryType: 'Environmental Impact',
      bussiness_category: 'Normal User',
      sentiment: 'Negative',
      date: '2024-01-15',
      summary: 'Expressed concerns about air pollution affecting local community health and requested stricter regulations.',
      company: 'GreenTech Industries',
      createdAt: '2023-10-01T12:34:56Z',
      state: 'Published'
    },
    {
      id: 'comment-002',
      raw_comment: 'I would like to appreciate EcoSolutions for their commitment to sustainable business practices. They have not only created employment opportunities for local youth but also invested in renewable energy sources. Their waste management system is exemplary and serves as a model for other companies in the region.',
      language: 'English',
      categoryType: 'Social Impact',
      bussiness_category: 'Normal User',
      sentiment: 'Positive',
      date: '2024-01-12',
      summary: 'Praised the company for implementing sustainable practices and creating local employment opportunities.',
      company: 'EcoSolutions Pvt Ltd',
      createdAt: '2023-10-01T12:34:56Z',
      state: 'Published'
    },
    {
      id: 'comment-003',
      raw_comment: 'हमारे क्षेत्र में औद्योगिक गतिविधियों के कारण पानी की भारी कमी हो रही है। कंपनियां बड़ी मात्रा में पानी का उपयोग कर रही हैं जबकि स्थानीय लोगों को पीने के पानी के लिए संघर्ष करना पड़ रहा है। सरकार को उचित जल वितरण नीति बनानी चाहिए और कंपनियों पर जल संरक्षण के नियम लागू करने चाहिए।',
      language: 'Hindi',
      categoryType: 'Water Resources',
      bussiness_category: 'Normal User',
      sentiment: 'Negative',
      date: '2024-01-10',
      summary: 'Raised concerns about water scarcity due to industrial water usage and demanded fair water distribution.',
      company: 'AquaTech Manufacturing',
      createdAt: '2023-10-01T12:34:56Z',
      state: 'Published'
    },
    {
      id: 'comment-004',
      raw_comment: 'As a small business owner in the tech sector, I believe there is a need for policy reforms that support small-scale industries. The current regulatory framework, while necessary, often creates barriers for startups and small enterprises. We need streamlined processes, reduced compliance costs, and more support for innovation-driven businesses.',
      language: 'English',
      categoryType: 'Policy & Regulation',
      bussiness_category: 'Industrialist/Businessmen',
      sentiment: 'Neutral',
      date: '2024-01-08',
      summary: 'Business owner suggesting policy reforms to support small-scale industries and reduce regulatory burden.',
      company: 'TechStart Solutions',
      createdAt: '2023-10-01T12:34:56Z',
      state: 'Published'
    },
    {
      id: 'comment-005',
      raw_comment: 'The government\'s focus on digital transformation and skill development is commendable. Programs like Digital India and Skill India are creating opportunities for young professionals and helping businesses adopt modern technologies. This will boost economic growth and make our industries more competitive globally.',
      language: 'English',
      categoryType: 'Technology & Innovation',
      bussiness_category: 'Industrialist/Businessmen',
      sentiment: 'Positive',
      date: '2024-01-05',
      summary: 'Appreciated government initiatives for digital transformation and skill development programs.',
      company: 'Digital India Initiative',
      createdAt: '2023-10-01T12:34:56Z',
      state: 'Published'
    },
    {
      id: 'comment-006',
      summary: 'Complained about excessive noise pollution from factory operations disrupting daily life.',
      company: 'MetalWorks Industries',
  categoryType: 'Environmental Impact',
      language: 'English',
      date: '2024-01-20',
      sentiment: 'Negative',
  // fullContent removed to match CommentData interface
  // stakeholderType removed to match CommentData interface
  // confidence removed to match CommentData interface
  // tags removed to match CommentData interface
    },
    {
      id: 'comment-007',
      summary: 'Praised the company for excellent corporate social responsibility initiatives and community development.',
      company: 'CommunityFirst Corp',
  categoryType: 'Social Impact',
      language: 'Hindi',
      date: '2024-01-18',
      sentiment: 'Positive',
  // fullContent removed to match CommentData interface
  // englishTranslation removed to match CommentData interface
      stakeholderType: 'Normal User',
      confidence: 0.94,
  // tags removed to match CommentData interface
    },
    {
      id: 'comment-008',
      summary: 'Suggested improvements in transportation infrastructure to support industrial growth.',
      company: 'Industrial Development Authority',
  categoryType: 'Infrastructure',
      language: 'English',
      date: '2024-01-22',
      sentiment: 'Neutral',
  // fullContent removed to match CommentData interface
  // stakeholderType removed to match CommentData interface
  // confidence removed to match CommentData interface
  // tags removed to match CommentData interface
    },
    {
      id: 'comment-009',
      summary: 'Criticized poor waste management practices leading to environmental degradation.',
      company: 'ChemProcess Ltd',
  categoryType: 'Environmental Impact',
      language: 'Bengali',
      date: '2024-01-16',
      sentiment: 'Negative',
  // fullContent removed to match CommentData interface
  // englishTranslation removed to match CommentData interface
      stakeholderType: 'Normal User',
      confidence: 0.87,
  // tags removed to match CommentData interface
    },
    {
      id: 'comment-010',
      summary: 'Appreciated tax incentives and business-friendly policies for startups and MSMEs.',
      company: 'Startup India Program',
  categoryType: 'Policy & Regulation',
      language: 'English',
      date: '2024-01-25',
      sentiment: 'Positive',
  // fullContent removed to match CommentData interface
  // stakeholderType removed to match CommentData interface
  // confidence removed to match CommentData interface
  // tags removed to match CommentData interface
    },
    {
      id: 'comment-011',
      summary: 'Raised concerns about child labor practices in textile manufacturing units.',
      company: 'TextileMart Industries',
  categoryType: 'Labor Rights',
      language: 'Hindi',
      date: '2024-01-14',
      sentiment: 'Negative',
  // fullContent removed to match CommentData interface
  // englishTranslation removed to match CommentData interface
      stakeholderType: 'Normal User',
      confidence: 0.91,
  // tags removed to match CommentData interface
    },
    {
      id: 'comment-012',
      summary: 'Praised renewable energy initiatives and their positive impact on reducing carbon footprint.',
      company: 'SolarTech Solutions',
  categoryType: 'Technology & Innovation',
      language: 'English',
      date: '2024-01-28',
      sentiment: 'Positive',
  // fullContent removed to match CommentData interface
  // stakeholderType removed to match CommentData interface
  // confidence removed to match CommentData interface
  // tags removed to match CommentData interface
    },
    {
      id: 'comment-013',
      summary: 'Criticized inadequate safety measures leading to workplace accidents and injuries.',
      company: 'HeavyEquip Manufacturing',
  categoryType: 'Worker Safety',
      language: 'English',
      date: '2024-01-12',
      sentiment: 'Negative',
  // fullContent removed to match CommentData interface
  // stakeholderType removed to match CommentData interface
  // confidence removed to match CommentData interface
  // tags removed to match CommentData interface
    },
    {
      id: 'comment-014',
      summary: 'Suggested collaboration between industry and academia for research and development.',
      company: 'Tech Innovation Hub',
  categoryType: 'Technology & Innovation',
      language: 'English',
      date: '2024-01-30',
      sentiment: 'Neutral',
  // fullContent removed to match CommentData interface
  // stakeholderType removed to match CommentData interface
  // confidence removed to match CommentData interface
  // tags removed to match CommentData interface
    },
    {
      id: 'comment-015',
      summary: 'Complained about water contamination affecting agricultural produce and livestock.',
      company: 'AgriChem Industries',
  categoryType: 'Water Resources',
      language: 'Tamil',
      date: '2024-01-08',
      sentiment: 'Negative',
  // fullContent removed to match CommentData interface
  // englishTranslation removed to match CommentData interface
  // stakeholderType removed to match CommentData interface
  // confidence removed to match CommentData interface
  // tags removed to match CommentData interface
    },
    {
      id: 'comment-016',
      summary: 'Appreciated flexible work policies and employee welfare programs during challenging times.',
      company: 'FlexiWork Technologies',
  categoryType: 'Labor Rights',
      language: 'English',
      date: '2024-01-26',
      sentiment: 'Positive',
  // fullContent removed to match CommentData interface
      stakeholderType: 'Normal User',
      confidence: 0.92,
      tags: ['employee-welfare', 'work-life-balance', 'job-security', 'flexible-policies']
    }
  ],
  alerts: [
    {
      id: 'alert-001',
      title: 'Potential Spam',
      description: 'Flagged 3 comments as potential spam.',
      count: 3,
      alertType: 'warning'
    },
    {
      id: 'alert-002',
      title: 'Duplicate Comments',
      description: 'Identified 2 duplicate comments.',
      count: 2,
      alertType: 'warning'
    },
    {
      id: 'alert-003',
      title: 'Unprocessed Comments',
      description: '5 comments awaiting processing.',
      count: 5,
      alertType: 'info'
    }
  ],
  insights: {
    summary: {
      positiveHighlights: "Citizens widely appreciate the infrastructure development initiatives, particularly the focus on digital governance and transparent policy implementation. The job creation programs have received substantial support, with many commenting on improved economic opportunities in rural areas.",
      keyConcerns: "Environmental impact assessments need strengthening, particularly for large-scale industrial projects. Budget allocation transparency requires improvement, and implementation timelines are perceived as overly ambitious in some sectors.",
      neutralObservations: "Mixed responses on healthcare reforms, with urban areas showing satisfaction while rural regions express need for enhanced accessibility. Technology adoption varies significantly across different demographic groups."
    },
    policyInsights: {
      highPriorityActions: [
        "Accelerate digital infrastructure rollout and establish clearer environmental guidelines for industrial projects."
      ],
      mediumPriority: [
        "Enhance rural healthcare accessibility and improve budget transparency communication channels."
      ],
      strategicConsiderations: [
        "Balance industrial growth with environmental protection. Consider phased implementation approaches for complex reforms."
      ],
      topIssuesRaised: [
        "Public Transportation",
        "Environmental Regulations", 
        "Healthcare Access"
      ],
      topSuggestions: [
        "Increase bus frequency",
        "Strengthen emission standards",
        "Expand clinic hours"
      ]
    }
  }
};

// Helper function to calculate percentages
export const calculatePercentage = (value: number, total: number): string => {
  return ((value / total) * 100).toFixed(2);
};

// Helper function to get percentage for each comment type
export const getCommentPercentages = (data: DashboardData) => {
  const { totalComments, stats } = data;
  return {
    positive: calculatePercentage(stats.positive, totalComments),
    negative: calculatePercentage(stats.negative, totalComments),
    neutral: calculatePercentage(stats.neutral, totalComments),
  };
};

// Helper function to get stakeholder percentages
export const getStakeholderPercentages = (stakeholderData: StakeholderData) => {
  const { totalComments, stats } = stakeholderData;
  return {
    positive: calculatePercentage(stats.positive, totalComments),
    negative: calculatePercentage(stats.negative, totalComments),
    neutral: calculatePercentage(stats.neutral, totalComments),
  };
};