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
  summary: string;
  company: string;
  category: string;
  language: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  fullContent: string;
  englishTranslation?: string; // Optional field for non-English comments
  stakeholderType: 'Normal User' | 'Industrialist/Businessmen';
  confidence: number;
  tags: string[];
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
      summary: 'Expressed concerns about air pollution affecting local community health and requested stricter regulations.',
      company: 'GreenTech Industries',
      category: 'Environmental Impact',
      language: 'English',
      date: '2024-01-15',
      sentiment: 'negative',
      fullContent: 'I am deeply concerned about the increasing air pollution in our locality due to industrial activities. The smoke emissions from nearby factories are affecting the health of children and elderly residents. We need stricter environmental regulations and regular monitoring to ensure companies comply with pollution control norms. This is not just about business profits but about the wellbeing of our community.',
      stakeholderType: 'Normal User',
      confidence: 0.89,
      tags: ['environment', 'health', 'regulation', 'community']
    },
    {
      id: 'comment-002',
      summary: 'Praised the company for implementing sustainable practices and creating local employment opportunities.',
      company: 'EcoSolutions Pvt Ltd',
      category: 'Social Impact',
      language: 'English',
      date: '2024-01-12',
      sentiment: 'positive',
      fullContent: 'I would like to appreciate EcoSolutions for their commitment to sustainable business practices. They have not only created employment opportunities for local youth but also invested in renewable energy sources. Their waste management system is exemplary and serves as a model for other companies in the region.',
      stakeholderType: 'Normal User',
      confidence: 0.92,
      tags: ['sustainability', 'employment', 'renewable-energy', 'waste-management']
    },
    {
      id: 'comment-003',
      summary: 'Raised concerns about water scarcity due to industrial water usage and demanded fair water distribution.',
      company: 'AquaTech Manufacturing',
      category: 'Water Resources',
      language: 'Hindi',
      date: '2024-01-10',
      sentiment: 'negative',
      fullContent: 'हमारे क्षेत्र में औद्योगिक गतिविधियों के कारण पानी की भारी कमी हो रही है। कंपनियां बड़ी मात्रा में पानी का उपयोग कर रही हैं जबकि स्थानीय लोगों को पीने के पानी के लिए संघर्ष करना पड़ रहा है। सरकार को उचित जल वितरण नीति बनानी चाहिए और कंपनियों पर जल संरक्षण के नियम लागू करने चाहिए।',
      englishTranslation: 'There is a severe water shortage in our area due to industrial activities. Companies are using large amounts of water while local people have to struggle for drinking water. The government should create proper water distribution policies and implement water conservation rules for companies.',
      stakeholderType: 'Normal User',
      confidence: 0.85,
      tags: ['water-scarcity', 'resource-management', 'policy', 'conservation']
    },
    {
      id: 'comment-004',
      summary: 'Business owner suggesting policy reforms to support small-scale industries and reduce regulatory burden.',
      company: 'TechStart Solutions',
      category: 'Policy & Regulation',
      language: 'English',
      date: '2024-01-08',
      sentiment: 'neutral',
      fullContent: 'As a small business owner in the tech sector, I believe there is a need for policy reforms that support small-scale industries. The current regulatory framework, while necessary, often creates barriers for startups and small enterprises. We need streamlined processes, reduced compliance costs, and more support for innovation-driven businesses.',
      stakeholderType: 'Industrialist/Businessmen',
      confidence: 0.78,
      tags: ['policy-reform', 'small-business', 'regulation', 'innovation']
    },
    {
      id: 'comment-005',
      summary: 'Appreciated government initiatives for digital transformation and skill development programs.',
      company: 'Digital India Initiative',
      category: 'Technology & Innovation',
      language: 'English',
      date: '2024-01-05',
      sentiment: 'positive',
      fullContent: 'The government\'s focus on digital transformation and skill development is commendable. Programs like Digital India and Skill India are creating opportunities for young professionals and helping businesses adopt modern technologies. This will boost economic growth and make our industries more competitive globally.',
      stakeholderType: 'Industrialist/Businessmen',
      confidence: 0.91,
      tags: ['digital-transformation', 'skill-development', 'economic-growth', 'competitiveness']
    },
    {
      id: 'comment-006',
      summary: 'Complained about excessive noise pollution from factory operations disrupting daily life.',
      company: 'MetalWorks Industries',
      category: 'Environmental Impact',
      language: 'English',
      date: '2024-01-20',
      sentiment: 'negative',
      fullContent: 'The noise levels from MetalWorks Industries have become unbearable, especially during night shifts. The constant hammering and machinery sounds are disturbing our sleep and affecting our children\'s studies. We request immediate action to implement proper noise control measures and limit operations during sensitive hours.',
      stakeholderType: 'Normal User',
      confidence: 0.88,
      tags: ['noise-pollution', 'quality-of-life', 'regulation', 'community-welfare']
    },
    {
      id: 'comment-007',
      summary: 'Praised the company for excellent corporate social responsibility initiatives and community development.',
      company: 'CommunityFirst Corp',
      category: 'Social Impact',
      language: 'Hindi',
      date: '2024-01-18',
      sentiment: 'positive',
      fullContent: 'कम्युनिटीफर्स्ट कॉर्प ने हमारे गांव में स्कूल और अस्पताल बनवाया है। उन्होंने स्थानीय युवाओं को रोजगार भी दिया है। यह कंपनी वास्तव में समाज की भलाई के लिए काम कर रही है। हमें इस तरह की और कंपनियों की जरूरत है जो मुनाफे के साथ-साथ समाज की सेवा भी करें।',
      englishTranslation: 'CommunityFirst Corp has built schools and hospitals in our village. They have also provided employment to local youth. This company is truly working for the welfare of society. We need more companies like this that serve society along with making profits.',
      stakeholderType: 'Normal User',
      confidence: 0.94,
      tags: ['corporate-social-responsibility', 'education', 'healthcare', 'employment']
    },
    {
      id: 'comment-008',
      summary: 'Suggested improvements in transportation infrastructure to support industrial growth.',
      company: 'Industrial Development Authority',
      category: 'Infrastructure',
      language: 'English',
      date: '2024-01-22',
      sentiment: 'neutral',
      fullContent: 'Our industrial zone faces significant challenges due to inadequate transportation infrastructure. The roads are in poor condition, causing delays in supply chain operations and increasing logistics costs. Investment in better road connectivity, railway links, and port facilities would significantly benefit all businesses in the region.',
      stakeholderType: 'Industrialist/Businessmen',
      confidence: 0.82,
      tags: ['infrastructure', 'transportation', 'logistics', 'economic-development']
    },
    {
      id: 'comment-009',
      summary: 'Criticized poor waste management practices leading to environmental degradation.',
      company: 'ChemProcess Ltd',
      category: 'Environmental Impact',
      language: 'Bengali',
      date: '2024-01-16',
      sentiment: 'negative',
      fullContent: 'কেমপ্রসেস লিমিটেড তাদের বর্জ্য সঠিকভাবে নিষ্কাশন করছে না। এর ফলে আমাদের এলাকার মাটি ও পানি দূষিত হচ্ছে। কৃষি জমিতে ফসল ভালো হচ্ছে না এবং মাছ মরে যাচ্ছে। সরকারের উচিত এই কোম্পানির বিরুদ্ধে কঠোর ব্যবস্থা নেওয়া।',
      englishTranslation: 'ChemProcess Ltd is not disposing of their waste properly. This is polluting the soil and water in our area. Crops are not growing well in agricultural land and fish are dying. The government should take strict action against this company.',
      stakeholderType: 'Normal User',
      confidence: 0.87,
      tags: ['waste-management', 'pollution', 'agriculture', 'environmental-violation']
    },
    {
      id: 'comment-010',
      summary: 'Appreciated tax incentives and business-friendly policies for startups and MSMEs.',
      company: 'Startup India Program',
      category: 'Policy & Regulation',
      language: 'English',
      date: '2024-01-25',
      sentiment: 'positive',
      fullContent: 'The recent tax incentives and simplified regulatory processes under the Startup India program have been incredibly helpful for our business. The reduced compliance burden and easier access to funding have allowed us to focus more on innovation and growth. These policies are encouraging more entrepreneurs to start their ventures.',
      stakeholderType: 'Industrialist/Businessmen',
      confidence: 0.93,
      tags: ['startup-support', 'tax-incentives', 'policy-support', 'entrepreneurship']
    },
    {
      id: 'comment-011',
      summary: 'Raised concerns about child labor practices in textile manufacturing units.',
      company: 'TextileMart Industries',
      category: 'Labor Rights',
      language: 'Hindi',
      date: '2024-01-14',
      sentiment: 'negative',
      fullContent: 'टेक्सटाइलमार्ट इंडस्ट्रीज में बाल मजदूरी का उपयोग हो रहा है। छोटे बच्चों को कम मजदूरी पर काम करने के लिए मजबूर किया जा रहा है। यह अमानवीय है और कानून के खिलाफ है। श्रम विभाग को इसकी जांच करनी चाहिए और तुरंत कार्रवाई करनी चाहिए।',
      englishTranslation: 'Child labor is being used in TextileMart Industries. Small children are being forced to work for low wages. This is inhumane and against the law. The Labor Department should investigate this and take immediate action.',
      stakeholderType: 'Normal User',
      confidence: 0.91,
      tags: ['child-labor', 'labor-rights', 'exploitation', 'legal-violation']
    },
    {
      id: 'comment-012',
      summary: 'Praised renewable energy initiatives and their positive impact on reducing carbon footprint.',
      company: 'SolarTech Solutions',
      category: 'Technology & Innovation',
      language: 'English',
      date: '2024-01-28',
      sentiment: 'positive',
      fullContent: 'SolarTech Solutions has installed solar panels throughout our industrial park, significantly reducing our dependence on conventional electricity. Their initiative has not only cut down operational costs but also contributed to environmental sustainability. This is an excellent example of how businesses can be profitable while being environmentally responsible.',
      stakeholderType: 'Industrialist/Businessmen',
      confidence: 0.89,
      tags: ['renewable-energy', 'sustainability', 'cost-reduction', 'environmental-responsibility']
    },
    {
      id: 'comment-013',
      summary: 'Criticized inadequate safety measures leading to workplace accidents and injuries.',
      company: 'HeavyEquip Manufacturing',
      category: 'Worker Safety',
      language: 'English',
      date: '2024-01-12',
      sentiment: 'negative',
      fullContent: 'There have been multiple workplace accidents at HeavyEquip Manufacturing due to inadequate safety protocols. Workers are not provided with proper safety equipment, and safety training is insufficient. Last month, three workers were seriously injured due to machinery malfunction. The management needs to prioritize worker safety over production targets.',
      stakeholderType: 'Normal User',
      confidence: 0.86,
      tags: ['workplace-safety', 'accidents', 'safety-equipment', 'worker-rights']
    },
    {
      id: 'comment-014',
      summary: 'Suggested collaboration between industry and academia for research and development.',
      company: 'Tech Innovation Hub',
      category: 'Technology & Innovation',
      language: 'English',
      date: '2024-01-30',
      sentiment: 'neutral',
      fullContent: 'There is tremendous potential for collaboration between our industries and local universities. Joint research projects, internship programs, and knowledge sharing initiatives could accelerate innovation in our region. We should establish formal partnerships that benefit both industry needs and academic research goals.',
      stakeholderType: 'Industrialist/Businessmen',
      confidence: 0.79,
      tags: ['industry-academia', 'research-development', 'collaboration', 'innovation']
    },
    {
      id: 'comment-015',
      summary: 'Complained about water contamination affecting agricultural produce and livestock.',
      company: 'AgriChem Industries',
      category: 'Water Resources',
      language: 'Tamil',
      date: '2024-01-08',
      sentiment: 'negative',
      fullContent: 'அக்ரிகெம் இண்டஸ்ட்ரீஸ் நீர் மாசுபாட்டால் எங்கள் விவசாய நிலங்கள் பாதிக்கப்பட்டுள்ளன. பயிர்கள் நன்றாக வளரவில்லை மற்றும் கால்நடைகள் நோய்வாய்ப்பட்டுள்ளன. இந்த நிறுவனம் தங்கள் கழிவுநீரை சரியாக சுத்திகரிக்காமல் ஆற்றில் கலக்கிறது. உடனடியாக நடவடிக்கை எடுக்க வேண்டும்.',
      englishTranslation: 'Our agricultural lands have been affected by water pollution from AgriChem Industries. Crops are not growing well and livestock are getting sick. This company is mixing their wastewater into the river without proper treatment. Immediate action needs to be taken.',
      stakeholderType: 'Normal User',
      confidence: 0.88,
      tags: ['water-contamination', 'agriculture', 'livestock', 'industrial-pollution']
    },
    {
      id: 'comment-016',
      summary: 'Appreciated flexible work policies and employee welfare programs during challenging times.',
      company: 'FlexiWork Technologies',
      category: 'Labor Rights',
      language: 'English',
      date: '2024-01-26',
      sentiment: 'positive',
      fullContent: 'FlexiWork Technologies has been exemplary in their employee welfare programs. During the pandemic, they provided work-from-home options, mental health support, and maintained job security for all employees. Their flexible policies have helped maintain work-life balance while ensuring business continuity. Other companies should learn from their approach.',
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