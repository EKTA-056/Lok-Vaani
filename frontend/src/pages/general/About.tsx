import React from 'react';
import {
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CogIcon,
  CheckBadgeIcon,
  UsersIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Government Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 h-2"></div>
      <div className="bg-blue-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium">Government of India</div>
            <div className="h-4 w-px bg-white/30"></div>
            <div className="text-sm">Ministry of Statistics and Programme Implementation</div>
          </div>
          <div className="text-sm font-medium">Digital India Initiative</div>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            About Lok Vanni – E-Consultation Analysis Platform
          </h1>
          <div className="w-20 h-1 bg-blue-600 rounded"></div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        
        {/* Section 1: Introduction */}
        <section className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Lok Vaani is an AI-powered e-consultation analysis platform designed to transform how government agencies 
                process and analyze public feedback on policy drafts and legislative proposals. By leveraging advanced 
                natural language processing and machine learning algorithms, Lok Vaani automates the analysis of citizen 
                comments, enabling policymakers to make informed, data-driven decisions that truly reflect public sentiment 
                and concerns.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Problem Statement */}
        <section className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Problem Statement</h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                Traditional methods of analyzing public comments on draft legislations face significant challenges:
              </p>
              <div className="space-y-3 text-gray-700">
                <p>• <strong>Manual Review Burden:</strong> Thousands of public comments require extensive manual review, consuming valuable time and resources that could be better allocated to policy development.</p>
                <p>• <strong>Inherent Human Bias:</strong> Manual analysis is susceptible to reviewer bias, potentially skewing the interpretation of public sentiment and missing critical nuances in citizen feedback.</p>
                <p>• <strong>Lost Citizen Concerns:</strong> Important stakeholder concerns and minority opinions often get overlooked in the overwhelming volume of submissions, leading to incomplete policy assessments.</p>
                <p>• <strong>Inconsistent Analysis:</strong> Different reviewers may interpret similar feedback differently, resulting in inconsistent analysis standards across policy consultations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Our Solution */}
        <section className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CogIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Solution</h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                Lok Vaani addresses these challenges through comprehensive AI-driven analysis capabilities:
              </p>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>AI-Driven Sentiment Analysis:</strong> Advanced natural language processing algorithms automatically categorize comments by sentiment (positive, negative, neutral) with 95%+ accuracy, eliminating human bias and ensuring consistent evaluation.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>Multilingual Support:</strong> Native processing capabilities for Hindi and English languages, ensuring comprehensive analysis of feedback from diverse linguistic backgrounds across India.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>Stakeholder Classification:</strong> Intelligent categorization of feedback sources (individuals, NGOs, businesses, academic institutions) to provide demographic insights and ensure balanced policy consideration.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>Real-time Dashboard:</strong> Interactive visualization platform providing live analytics, trend identification, sentiment distribution charts, and comprehensive policy impact assessments for immediate decision-making support.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Key Benefits */}
        <section className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <CheckBadgeIcon className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Benefits</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">For Policymakers</h3>
                  <div className="space-y-2 text-gray-700">
                    <p>• Objective, data-driven policy insights free from human interpretation bias</p>
                    <p>• 90% reduction in analysis time from weeks to hours</p>
                    <p>• Comprehensive demographic breakdown of public opinion</p>
                    <p>• Early identification of controversial policy areas requiring attention</p>
                    <p>• Automated generation of detailed consultation reports</p>
                    <p>• Enhanced transparency in democratic decision-making processes</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">For Citizens</h3>
                  <div className="space-y-2 text-gray-700">
                    <p>• Guaranteed review and analysis of every submitted comment</p>
                    <p>• Equal weightage to feedback regardless of language or background</p>
                    <p>• Transparent tracking of how public input influences policy decisions</p>
                    <p>• Faster policy consultation cycles enabling more frequent engagement</p>
                    <p>• Increased confidence in government responsiveness to public concerns</p>
                    <p>• More inclusive participation in democratic governance processes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Target Users */}
        <section className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Target Users</h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                Lok Vaani is designed to serve various stakeholders in the democratic consultation process:
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Policy Development Teams</h3>
                  <p className="text-sm text-gray-600">Ministry officials responsible for drafting and refining policy proposals based on public feedback.</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Senior Decision-Makers</h3>
                  <p className="text-sm text-gray-600">Ministers and department heads requiring comprehensive public sentiment analysis for policy approval.</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Compliance Officers</h3>
                  <p className="text-sm text-gray-600">Personnel ensuring consultation processes meet legal requirements and democratic standards.</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Citizens & Civil Society</h3>
                  <p className="text-sm text-gray-600">Individual citizens, NGOs, and advocacy groups participating in public consultations.</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Business Community</h3>
                  <p className="text-sm text-gray-600">Private sector organizations providing feedback on policies affecting business operations.</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Research Institutions</h3>
                  <p className="text-sm text-gray-600">Academic and policy research organizations analyzing public policy consultation effectiveness.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Section */}
        <section className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
          <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
            Strengthening democratic governance by transforming citizen feedback into actionable insights.
          </p>
        </section>

      </div>
    </div>
  );
};

export default About;