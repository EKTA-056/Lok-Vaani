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
} from '@heroicons/react/24/outline';const HomePage: React.FC = () => {

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
      description: "Track sentiment trends in real-time with animated and responsive sentiment graphs.",
      category: "AI",
      Icon: ChartBarIcon,
      iconColor: "text-green-600",
    },
    {
      title: "Word Cloud Visualization",
      description: "Visualize key themes and topics in comments using an interactive and visually appealing word cloud.",
      category: "Comparison",
      Icon: SparklesIcon,
      iconColor: "text-teal-500",
    },
    {
      title: "AI-Generated Summaries",
      description: "Get concise summaries of large comment sets, presented with AI-generated graphics and key takeaway highlights.",
      category: "Reports",
      Icon: DocumentTextIcon,
      iconColor: "text-amber-600",
    },
    {
      title: "Draft Comparison Tool",
      description: "Compare sentiment across different policy drafts with a dynamic and interactive comparison tool.",
      category: "Analytics",
      Icon: DocumentDuplicateIcon,
      iconColor: "text-indigo-600",
    },
  ];

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <motion.div 
          className="@container"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="@[480px]:p-4">
            <div
              className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-start justify-end px-4 pb-10 @[480px]:px-10"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAGWapbh0ky-tQygu9lYI-ucSEXLkrfM4KsDhAFIff7d67Ru8PxTuYwxnZ08EnhyjmOr8ju_TKsPtOZdt-cHXS1cHOiXXE8n4FuJt_c0xHBLfA8_H2j_CqQP2cL0j1o5bW1fRaahJ4Wy-AHkVCmX6R959rucqqWh0B_NwQw2WEb1_xce9wX45FimZBNEBNFb32MkXQlVHpJNYORZ6QpbZCKr6JeAm84SgE-WbQj4tnvSL0uLo0wpd2cWrZxu7rSZJDs8nggn4nBHFY")`
              }}
            >
              <div className="flex flex-col gap-2 text-left">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                  Lok Vaani: Transforming Public Comments into Actionable Insights
                </h1>
                <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                  An advanced AI platform for e-governance, Lok Vaani empowers the Ministry of Corporate Affairs by converting public feedback into meaningful data for informed decision-making.
                </h2>
              </div>
              <div className="flex-wrap gap-3 flex">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#1380ec] text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] transition-all duration-300 hover:bg-[#0f6bbf] hover:shadow-lg hover:scale-105">
                  <span className="truncate">Explore Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 text-center">About Lok Vaani</h2>
          <p className="text-[#111418] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
            LokVaani is a comprehensive solution for government agencies seeking to understand public sentiment and feedback from online consultations. Our platform leverages advanced natural language processing (NLP) and machine learning (ML) techniques to analyze large volumes of comments, identify key themes and sentiments, and provide actionable insights.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, staggerChildren: 0.2 }}
        >
          <motion.div 
            className="flex flex-1 gap-3 rounded-lg border border-[#dbe0e6] bg-white p-4 flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="text-[#111418]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[#111418] text-base font-bold leading-tight">Data-Driven Insights</h2>
              <p className="text-[#617589] text-sm font-normal leading-normal">Uncover key trends and patterns in public feedback with powerful analytics.</p>
            </div>
          </motion.div>

          <motion.div 
            className="flex flex-1 gap-3 rounded-lg border border-[#dbe0e6] bg-white p-4 flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-[#111418]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[#111418] text-base font-bold leading-tight">Stakeholder Engagement</h2>
              <p className="text-[#617589] text-sm font-normal leading-normal">Understand the diverse perspectives of your constituents and stakeholders.</p>
            </div>
          </motion.div>

          <motion.div 
            className="flex flex-1 gap-3 rounded-lg border border-[#dbe0e6] bg-white p-4 flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-[#111418]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[#111418] text-base font-bold leading-tight">Efficient Analysis</h2>
              <p className="text-[#617589] text-sm font-normal leading-normal">Save time and resources with automated comment analysis and reporting.</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.h2 
          className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Why It Matters
        </motion.h2>
        <motion.div 
          className="flex flex-col gap-10 px-4 py-10 @container justify-center items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex flex-col gap-4  align-middle justify-center">
            <h1 className="text-[#111418] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px] text-center">
              Enhancing Public Participation and Governance
            </h1>
            <p className="text-[#111418] text-base font-normal leading-normal max-w-[720px] text-center">
              LokVaani empowers government agencies to make more informed decisions by providing a clear and comprehensive understanding of public feedback. By analyzing comments effectively, agencies can ensure that policies and initiatives are aligned with the needs and concerns of their constituents, leading to greater public trust and engagement.
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
            <div className="flex flex-col gap-3 pb-3">
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuD7TqVj0rDD-QlxvwlIMZ_Zsl5UcO4hDDHsLdk9JGK1o_YwvODYV3pGUEOVxXICB7lMfZhtrB0bLWQDleCknHLG_b9f6_YuEwhRsUGVgZKT97aZbgM0wIIvmER7yuVOP8XtALco5lnqP4sLv-I_PTQGGL-wa_iB0e0QUGNnYc19GmX8lqnXv6KAm6TH60ckwW4QIWak3YnK5BwtIAQaR19HB_uIp7kU5ue1Gi9BWYFZjpfvZqqtBOKaoEJevKBGPMeFGA1YcZwx2Fw")`
                }}
              ></div>
              <div>
                <p className="text-[#111418] text-base font-medium leading-normal">Make Informed Decisions</p>
                <p className="text-[#617589] text-sm font-normal leading-normal">
                  Gain a deeper understanding of public sentiment and feedback to inform policy development and implementation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 text-center">How It Works</h2>
        <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4">
          <div className="flex flex-col items-center gap-1 pt-3">
            <div className="text-[#111418]">
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
              </svg>
            </div>
            <div className="w-[1.5px] bg-[#dbe0e6] h-2 grow"></div>
          </div>
          <div className="flex flex-1 flex-col py-3">
            <p className="text-[#111418] text-base font-medium leading-normal">Data Collection</p>
            <p className="text-[#617589] text-base font-normal leading-normal">Gather comments from MCA E-Consultation Platform.</p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-[1.5px] bg-[#dbe0e6] h-2"></div>
            <div className="text-[#111418]">
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <div className="w-[1.5px] bg-[#dbe0e6] h-2 grow"></div>
          </div>
          <div className="flex flex-1 flex-col py-3">
            <p className="text-[#111418] text-base font-medium leading-normal">Analysis &amp; Insights</p>
            <p className="text-[#617589] text-base font-normal leading-normal">Utilize NLP and ML to identify key themes and sentiments.</p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-[1.5px] bg-[#dbe0e6] h-2"></div>
            <div className="text-[#111418]">
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"/>
              </svg>
            </div>
            <div className="w-[1.5px] bg-[#dbe0e6] h-2 grow"></div>
          </div>
          <div className="flex flex-1 flex-col py-3">
            <p className="text-[#111418] text-base font-medium leading-normal">Reporting &amp; Visualization</p>
            <p className="text-[#617589] text-base font-normal leading-normal">Generate interactive reports and visualizations.</p>
          </div>

          <div className="flex flex-col items-center gap-1 pb-3">
            <div className="w-[1.5px] bg-[#dbe0e6] h-2"></div>
            <div className="text-[#111418]">
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 14H4m6.5 3L8 20m5.5-3 2.5 3M4.88889 17H19.1111c.4909 0 .8889-.4157.8889-.9286V4.92857C20 4.41574 19.602 4 19.1111 4H4.88889C4.39797 4 4 4.41574 4 4.92857V16.0714c0 .5129.39797.9286.88889.9286ZM13 14v-3h4v3h-4Z"/>
              </svg>

            </div>
          </div>
          <div className="flex flex-1 flex-col py-3">
            <p className="text-[#111418] text-base font-medium leading-normal">Actionable Recommendations</p>
            <p className="text-[#617589] text-base font-normal leading-normal">Receive data-driven recommendations for policy adjustments.</p>
          </div>
        </div>

        {/* ==== UPDATED FEATURES SECTION START ==== */}
        <motion.h2 
          className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          What Features It Provides
        </motion.h2>
        <motion.div 
          className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 p-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
        >
        {features.map((feature, index) => (
        <motion.div 
          key={index} 
          className="flex flex-col text-left gap-4 p-6 bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
        <div className={feature.iconColor}>
        <feature.Icon className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col gap-1 flex-grow">
        <h3 className="text-[#111418] text-base font-bold leading-tight">{feature.title}</h3>
        <p className="text-[#617589] text-sm font-normal leading-normal">{feature.description}</p>
        </div>
        <p className="text-sm font-medium text-gray-500">{feature.category}</p>
        </motion.div>
        ))}
        </motion.div>
        {/* ==== UPDATED FEATURES SECTION END ==== */}


        <motion.div 
          className="@container"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col justify-end gap-6 px-4 py-10 @[480px]:gap-8 @[480px]:px-10 @[480px]:py-20">
            <div className="flex flex-col gap-2 text-center justify-center items-center">
              <h1 className="text-[#111418] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                Empowering Governance with Advanced AI
              </h1>
              <p className="text-[#111418] text-base font-normal leading-normal max-w-[720px] text-center">
                Lok Vaani integrates cutting-edge AI technologies to provide a comprehensive solution for analyzing public comments and extracting actionable insights.
              </p>
            </div>
            <div className="flex flex-1 justify-center">
              <div className="flex justify-center">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#1380ec] text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] transition-all duration-300 hover:bg-[#0f6bbf] hover:shadow-lg hover:scale-105 grow">
                  <span className="truncate">Explore Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;