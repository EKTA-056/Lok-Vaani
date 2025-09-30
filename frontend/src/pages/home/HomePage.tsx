'use client'

import React from 'react';
import { motion } from 'framer-motion';

import {
  LanguageIcon,
  ScaleIcon,
  ChartBarIcon,
  SparklesIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const features = [
    {
      title: "Multilingual Support",
      description: "Analyze comments in multiple languages with interactive language selection and translation features.",
      category: "Analytics",
      Icon: LanguageIcon,
      iconColor: "text-blue-600",
    },
    {
      title: "Weighted Sentiment Analysis",
      description: "Prioritize feedback based on influence and impact, visualized with dynamic weight indicators.",
      category: "Speech Bubbles",
      Icon: ScaleIcon,
      iconColor: "text-orange-600",
    },
    {
      title: "Live Sentiment Graphs",
      description: "Visualize real-time sentiment trends with interactive charts and graphs.",
      category: "Visualization",
      Icon: ChartBarIcon,
      iconColor: "text-green-600",
    },
    {
      title: "AI-Powered Highlights",
      description: "Automatically surface the most impactful comments and feedback using AI.",
      category: "AI",
      Icon: SparklesIcon,
      iconColor: "text-purple-600",
    },
    {
      title: "Comprehensive Reports",
      description: "Generate detailed reports and summaries for policy makers.",
      category: "Reporting",
      Icon: DocumentTextIcon,
      iconColor: "text-pink-600",
    },
    {
      title: "Easy Export",
      description: "Export insights and data in multiple formats for further analysis.",
      category: "Export",
      Icon: DocumentDuplicateIcon,
      iconColor: "text-yellow-600",
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-7xl mx-auto px-4 flex flex-col gap-10">
        {/* Hero Section */}
        <motion.div 
          className="relative rounded-3xl overflow-hidden shadow-xl mb-8"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/60 via-blue-400/40 to-blue-900/60 z-0" />
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGWapbh0ky-tQygu9lYI-ucSEXLkrfM4KsDhAFIff7d67Ru8PxTuYwxnZ08EnhyjmOr8ju_TKsPtOZdt-cHXS1cHOiXXE8n4FuJt_c0xHBLfA8_H2j_CqQP2cL0j1o5bW1fRaahJ4Wy-AHkVCmX6R959rucqqWh0B_NwQw2WEb1_xce9wX45FimZBNEBNFb32MkXQlVHpJNYORZ6QpbZCKr6JeAm84SgE-WbQj4tnvSL0uLo0wpd2cWrZxu7rSZJDs8nggn4nBHFY" alt="LokVaani Hero" className="w-full h-[420px] object-cover object-center z-0" />
          <div className="absolute inset-0 flex flex-col justify-end items-start p-10 z-10">
            <h1 className="text-white text-5xl font-extrabold mb-2 drop-shadow-lg">Lok Vaani: Transforming Public Comments into Actionable Insights</h1>
            <h2 className="text-white text-lg font-medium mb-6 drop-shadow-md max-w-2xl">An advanced AI platform for e-governance, Lok Vaani empowers the Ministry of Corporate Affairs by converting public feedback into meaningful data for informed decision-making.</h2>
            <button onClick={() => navigate('/drafts')} className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 text-lg">Explore Dashboard</button>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-blue-900 text-3xl font-bold text-center mb-4">Platform Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-md p-6 flex flex-col items-start gap-4 border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className={`rounded-full p-2 ${feature.iconColor} bg-blue-50 shadow-md mb-2`}>
                  <feature.Icon className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-blue-900 text-lg font-bold">{feature.title}</h3>
                <p className="text-gray-700 text-sm mb-2">{feature.description}</p>
                <span className="text-xs font-semibold text-blue-400 bg-blue-100 px-2 py-1 rounded-full">{feature.category}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-md p-8 mt-10">
            <h2 className="text-blue-900 text-2xl font-bold mb-2 text-center">About Lok Vaani</h2>
            <p className="text-gray-700 text-base text-center max-w-3xl mx-auto">
              LokVaani is a comprehensive solution for government agencies seeking to understand public sentiment and feedback from online consultations. Our platform leverages advanced natural language processing (NLP) and machine learning (ML) techniques to analyze large volumes of comments, identify key themes and sentiments, and provide actionable insights.
            </p>
          </div>
        </motion.div>

        {/* Why It Matters Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-blue-100 to-blue-300 rounded-2xl shadow-md p-8 mt-10">
            <h2 className="text-blue-900 text-2xl font-bold mb-2 text-center">Why It Matters</h2>
            <h1 className="text-blue-900 text-3xl font-bold mb-2 text-center">Enhancing Public Participation and Governance</h1>
            <p className="text-gray-700 text-base text-center max-w-3xl mx-auto mb-4">
              LokVaani empowers government agencies to make more informed decisions by providing a clear and comprehensive understanding of public feedback. By analyzing comments effectively, agencies can ensure that policies and initiatives are aligned with the needs and concerns of their constituents, leading to greater public trust and engagement.
            </p>
            <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg mb-4" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD7TqVj0rDD-QlxvwlIMZ_Zsl5UcO4hDDHsLdk9JGK1o_YwvODYV3pGUEOVxXICB7lMfZhtrB0bLWQDleCknHLG_b9f6_YuEwhRsUGVgZKT97aZbgM0wIIvmER7yuVOP8XtALco5lnqP4sLv-I_PTQGGL-wa_iB0e0QUGNnYc19GmX8lqnXv6KAm6TH60ckwW4QIWak3YnK5BwtIAQaR19HB_uIp7kU5ue1Gi9BWYFZjpfvZqqtBOKaoEJevKBGPMeFGA1YcZwx2Fw')` }}></div>
            <p className="text-blue-900 text-base font-medium text-center">Make Informed Decisions</p>
            <p className="text-gray-700 text-sm text-center">
              Gain a deeper understanding of public sentiment and feedback to inform policy development and implementation.
            </p>
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-md p-8 mt-10">
            <h2 className="text-blue-900 text-2xl font-bold mb-2 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                  <span className="font-semibold text-blue-700">Data Collection</span>
                </div>
                <p className="text-gray-700 text-base">Gather comments from MCA E-Consultation Platform.</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                  <span className="font-semibold text-blue-700">Analysis & Insights</span>
                </div>
                <p className="text-gray-700 text-base">Utilize NLP and ML to identify key themes and sentiments.</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                  <span className="font-semibold text-blue-700">Reporting & Visualization</span>
                </div>
                <p className="text-gray-700 text-base">Generate interactive reports and visualizations.</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                  <span className="font-semibold text-blue-700">Actionable Recommendations</span>
                </div>
                <p className="text-gray-700 text-base">Receive data-driven recommendations for policy adjustments.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HomePage;