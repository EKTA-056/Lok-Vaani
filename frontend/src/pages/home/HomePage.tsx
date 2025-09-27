import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { 
  MessageCircle, 
  BarChart3, 
  Globe, 
  Users, 
  Brain, 
  FileText,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Zap
} from 'lucide-react';

const HomePage: React.FC = () => {
  const [counters, setCounters] = useState({
    comments: 12458,
    drafts: 247,
    insights: 1876
  });

  useEffect(() => {
    // Animate counters
    const interval = setInterval(() => {
      setCounters(prev => ({
        comments: prev.comments + Math.floor(Math.random() * 3),
        drafts: prev.drafts + (Math.random() > 0.9 ? 1 : 0),
        insights: prev.insights + Math.floor(Math.random() * 2)
      }));
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-white font-['Inter',sans-serif] overflow-x-hidden">
      {/* Hero Section - Immersive with Animated 3D Visualization */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-8" style={{
        background: `linear-gradient(135deg, 
          #1e3a8a 0%, 
          #1e40af 25%, 
          #0d9488 50%, 
          #06b6d4 75%, 
          #8b5cf6 100%)`
      }}>
        {/* Asymmetrical Gradient Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large asymmetrical blob - top left */}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-500/20 rounded-full transform rotate-12 animate-pulse"></div>
          
          {/* Medium asymmetrical shape - top right */}
          <div className="absolute top-32 -right-16 w-80 h-64 bg-gradient-to-bl from-yellow-400/25 to-orange-500/15 transform rotate-45 rounded-3xl animate-bounce" style={{ animationDuration: '8s' }}></div>
          
          {/* Small floating shape - middle left */}
          <div className="absolute top-1/3 left-10 w-40 h-40 bg-gradient-to-tr from-green-400/30 to-teal-500/20 transform -rotate-12 rounded-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Irregular shape - bottom right */}
          <div className="absolute bottom-20 right-20 w-72 h-48 bg-gradient-to-tl from-blue-400/25 to-indigo-500/15 transform rotate-25 animate-pulse" style={{ 
            clipPath: 'polygon(20% 0%, 80% 10%, 100% 60%, 75% 100%, 25% 90%, 0% 40%)',
            animationDelay: '4s'
          }}></div>
          
          {/* Thin vertical shape - left side */}
          <div className="absolute top-1/2 left-0 w-32 h-96 bg-gradient-to-b from-cyan-400/20 to-blue-500/10 transform -rotate-6 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>
          
          {/* Diamond shape - center bottom */}
          <div className="absolute bottom-32 left-1/2 w-56 h-56 bg-gradient-to-tr from-violet-400/25 to-purple-500/15 transform rotate-45 animate-bounce" style={{ 
            animationDuration: '12s',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
          }}></div>

          {/* Animated Wave Overlay */}
          <svg className="w-full h-full opacity-10" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path d="M0,200 Q300,100 600,200 T1200,200 L1200,800 L0,800 Z" fill="white" className="animate-pulse">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;50,0;0,0"
                dur="20s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Centered Content */}
          <div className="text-center space-y-8 text-white mb-20">
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Lok Vaani
                </span>
                <span className="text-3xl lg:text-4xl font-medium text-blue-200 block mt-2">
                  Giving Voice to Public Opinion in Policy Making
                </span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                AI-driven sentiment analysis platform transforming how governments understand 
                public opinion on draft legislations through intelligent data processing.
              </p>
            </div>

            <div className="flex justify-center">
              <Link to="/drafts">
                <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600 px-12 py-4 text-lg font-bold rounded-full transition-all transform hover:scale-105 shadow-xl">
                  Explore Drafts <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Carousel Section */}
          <div className="relative max-w-5xl mx-auto mb-16">
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={4000}
              arrows={false}
              fade={true}
              pauseOnHover={false}
              cssEase="cubic-bezier(0.87, 0, 0.13, 1)"
            >
              {/* Image 1 - Document Analysis */}
              <div className="px-6">
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="p-8 flex items-center">
                      <div className="text-white">
                        <h3 className="text-3xl font-bold mb-4">Document Analysis</h3>
                        <p className="text-blue-200 text-lg leading-relaxed">
                          Advanced AI algorithms analyze policy documents and legislative drafts, extracting key themes and preparing them for public consultation.
                        </p>
                        <div className="mt-6 flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-blue-300 text-sm">Document Processing</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative h-80 lg:h-96">
                      <img 
                        src="/src/assets/1.png" 
                        alt="Document analysis process"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to gradient background if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 hidden items-center justify-center">
                        <FileText className="h-20 w-20 text-white opacity-80" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image 2 - Policy Documents */}
              <div className="px-6">
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="p-8 flex items-center">
                      <div className="text-white">
                        <h3 className="text-3xl font-bold mb-4">Policy Documents</h3>
                        <p className="text-blue-200 text-lg leading-relaxed">
                          Comprehensive digital transformation of traditional policy papers into interactive, analyzable formats for enhanced public engagement.
                        </p>
                        <div className="mt-6 flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-green-300 text-sm">Digital Transformation</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative h-80 lg:h-96">
                      <img 
                        src="/src/assets/2.png" 
                        alt="Policy documents processing"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      {/* <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-600 hidden items-center justify-center">
                        <BarChart3 className="h-20 w-20 text-white opacity-80" />
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image 3 - AI Processing Visualization */}
              <div className="px-6">
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="p-8 flex items-center">
                      <div className="text-white">
                        <h3 className="text-3xl font-bold mb-4">AI Processing</h3>
                        <p className="text-blue-200 text-lg leading-relaxed">
                          Machine learning models process thousands of comments simultaneously, extracting sentiment patterns and key insights in real-time.
                        </p>
                        <div className="mt-6 flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-purple-300 text-sm">Real-time Processing</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative h-80 lg:h-96">
                      <img 
                        src="/src/assets/3.png" 
                        alt="Policy documents processing"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      {/* <div className="relative h-80 lg:h-96">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                          <Brain className="h-20 w-20 text-white opacity-80 animate-pulse" />
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image 4 - Analytics Dashboard */}
              <div className="px-6">
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="p-8 flex items-center">
                      <div className="text-white">
                        <h3 className="text-3xl font-bold mb-4">Analytics Dashboard</h3>
                        <p className="text-blue-200 text-lg leading-relaxed">
                          Interactive dashboards provide real-time insights into public sentiment, engagement metrics, and policy impact assessments.
                        </p>
                        <div className="mt-6 flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span className="text-orange-300 text-sm">Live Analytics</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative h-80 lg:h-96">
                      <img 
                        src="/src/assets/4.png" 
                        alt="Policy documents processing"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                    </div>
                    {/* <div className="relative h-80 lg:h-96">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                        <TrendingUp className="h-20 w-20 text-white opacity-80" />
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Image 5 - Stakeholder Engagement */}
              <div className="px-6">
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="p-8 flex items-center">
                      <div className="text-white">
                        <h3 className="text-3xl font-bold mb-4">Stakeholder Engagement</h3>
                        <p className="text-blue-200 text-lg leading-relaxed">
                          Multi-stakeholder platform enabling citizens, businesses, and organizations to participate meaningfully in policy-making processes.
                        </p>
                        <div className="mt-6 flex items-center space-x-2">
                          <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                          <span className="text-teal-300 text-sm">Multi-stakeholder</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative h-80 lg:h-96">
                      <img 
                        src="/src/assets/5.png" 
                        alt="Policy documents processing"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      </div>
                    {/* <div className="relative h-80 lg:h-96">
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
                        <Users className="h-20 w-20 text-white opacity-80" />
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </Slider>

            {/* Floating Animation Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 animate-ping"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-1/2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-60 animate-bounce"></div>
          </div>
        </div>

      </section>

      {/* Interactive "How It Works" Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Asymmetrical Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Organic blob - top right */}
          <div className="absolute -top-16 right-20 w-64 h-80 bg-gradient-to-bl from-blue-200/40 to-purple-300/20 transform rotate-12 animate-pulse" style={{
            clipPath: 'polygon(30% 0%, 100% 20%, 80% 100%, 0% 80%)',
            animationDuration: '8s'
          }}></div>
          
          {/* Curved shape - left side */}
          <div className="absolute top-32 -left-10 w-48 h-96 bg-gradient-to-r from-teal-200/30 to-green-300/15 transform -rotate-6 animate-bounce" style={{
            borderRadius: '50% 20% 80% 30%',
            animationDuration: '10s'
          }}></div>
          
          {/* Small floating elements */}
          <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-gradient-to-tr from-yellow-200/25 to-orange-300/15 transform rotate-45 animate-pulse" style={{
            clipPath: 'circle(70% at 30% 30%)',
            animationDelay: '3s'
          }}></div>
        </div>

        {/* Curved Wave Divider */}
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C150,120 350,0 500,80 C650,160 850,40 1200,100 L1200,0 Z" fill="white"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              How <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Lok Vaani</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the seamless journey from public comments to actionable policy insights
            </p>
          </div>

          {/* Horizontal Step-by-Step Process */}
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-teal-200 to-purple-200 transform -translate-y-1/2 hidden lg:block"></div>

            <div className="grid lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Citizens Comment",
                  description: "Citizens share their opinions on draft legislations through our platform",
                  icon: MessageCircle,
                  color: "from-blue-500 to-blue-600",
                  delay: "0s"
                },
                {
                  step: "02", 
                  title: "AI Processing",
                  description: "Lok Vaani processes comments with advanced NLP and sentiment analysis",
                  icon: Brain,
                  color: "from-teal-500 to-teal-600",
                  delay: "0.2s"
                },
                {
                  step: "03",
                  title: "Real-time Insights",
                  description: "Insights appear instantly in comprehensive dashboards and visualizations",
                  icon: BarChart3,
                  color: "from-purple-500 to-purple-600",
                  delay: "0.4s"
                },
                {
                  step: "04",
                  title: "Data-Driven Decisions",
                  description: "Policymakers access actionable insights for informed decision making",
                  icon: CheckCircle,
                  color: "from-green-500 to-green-600",
                  delay: "0.6s"
                }
              ].map((step, index) => (
                <div 
                  key={index}
                  className="relative group"
                  style={{ animationDelay: step.delay }}
                >
                  {/* Step Circle */}
                  <div className="relative z-10 mx-auto w-20 h-20 mb-6 lg:mb-8">
                    <div className={`w-full h-full bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    {/* Step Number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700 shadow-md">
                      {step.step}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow Connector (hidden on mobile) */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-10 -right-8 transform -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          
        </div>
      </section>

      {/* Key Features Section - Flowing Layout */}
      <section className="relative py-24 overflow-hidden">
        {/* Diagonal Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50 transform -skew-y-2 origin-top-left"></div>
        
        {/* Additional Asymmetrical Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Wavy shape - top left */}
          <div className="absolute -top-12 left-10 w-72 h-48 bg-gradient-to-br from-indigo-200/30 to-blue-300/15 transform -rotate-12 animate-pulse" style={{
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            animationDuration: '12s'
          }}></div>
          
          {/* Irregular pentagon - right side */}
          <div className="absolute top-1/4 -right-8 w-56 h-64 bg-gradient-to-bl from-emerald-200/25 to-teal-300/15 transform rotate-25 animate-bounce" style={{
            clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
            animationDuration: '15s'
          }}></div>
          
          {/* Flowing ribbon - bottom */}
          <div className="absolute bottom-10 left-1/3 w-96 h-24 bg-gradient-to-r from-purple-200/20 to-pink-300/15 transform rotate-3 animate-pulse" style={{
            borderRadius: '50px',
            animationDelay: '5s'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Powerful <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">AI Capabilities</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced features designed to transform public consultation analysis
            </p>
          </div>

          {/* Flowing Features Layout */}
          <div className="space-y-20">
            {[
              {
                title: "Multilingual Sentiment Analysis",
                description: "Process comments in English, Hindi, and Hinglish with advanced NLP models trained specifically for Indian languages and contexts.",
                icon: Globe,
                gradient: "from-blue-500 to-purple-600",
                position: "left"
              },
              {
                title: "Stakeholder Classification", 
                description: "Automatically identify and categorize comments from citizens, industry representatives, and other stakeholders for balanced analysis.",
                icon: Users,
                gradient: "from-teal-500 to-green-600",
                position: "right"
              },
              {
                title: "Real-time Analytics Dashboard",
                description: "Live visualization of sentiment trends, comment volumes, and key insights with interactive charts and word clouds.",
                icon: BarChart3,
                gradient: "from-purple-500 to-pink-600",
                position: "left"
              },
              {
                title: "Downloadable Policy Reports",
                description: "Generate comprehensive reports with insights, recommendations, and data summaries for policymakers and administrators.",
                icon: Download,
                gradient: "from-green-500 to-blue-600",
                position: "right"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`flex items-center ${feature.position === 'right' ? 'flex-row-reverse' : ''} gap-12`}
              >
                {/* Feature Panel */}
                <div className="flex-1">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {feature.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Feature highlight */}
                    <div className="mt-6 flex items-center space-x-2">
                      <div className={`w-2 h-2 bg-gradient-to-r ${feature.gradient} rounded-full`}></div>
                      <span className="text-sm font-medium text-gray-500">Active & Live</span>
                    </div>
                  </div>
                </div>

                {/* Visual Element */}
                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    <div className={`w-64 h-64 bg-gradient-to-r ${feature.gradient} rounded-full opacity-10 animate-pulse`}></div>
                    <div className={`absolute inset-4 bg-gradient-to-r ${feature.gradient} rounded-full opacity-20 animate-ping`}></div>
                    <div className="absolute inset-16 bg-white rounded-full shadow-2xl flex items-center justify-center">
                      <feature.icon className={`h-16 w-16 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-6 h-6 bg-teal-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-3 h-3 bg-purple-400 rounded-full opacity-40 animate-ping"></div>
      </section>

      {/* Live Data Snapshot Section */}
      <section className="relative py-20 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 overflow-hidden">
        {/* Asymmetrical Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Glowing orb - top left */}
          <div className="absolute -top-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-500/10 rounded-full animate-pulse" style={{
            filter: 'blur(40px)',
            animationDuration: '8s'
          }}></div>
          
          {/* Geometric shape - right side */}
          <div className="absolute top-1/4 -right-12 w-64 h-96 bg-gradient-to-bl from-purple-400/15 to-pink-500/10 transform rotate-12 animate-bounce" style={{
            clipPath: 'polygon(30% 0%, 100% 30%, 70% 100%, 0% 70%)',
            animationDuration: '12s'
          }}></div>
          
          {/* Flowing wave - bottom */}
          <div className="absolute bottom-0 left-1/4 w-96 h-32 bg-gradient-to-r from-teal-400/10 to-green-500/5 transform -rotate-3 animate-pulse" style={{
            borderRadius: '50% 50% 0 0',
            animationDelay: '4s'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Live Platform <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">Analytics</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Real-time insights from ongoing consultations across India
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Live Stats */}
              <div className="lg:col-span-1">
                <h3 className="text-2xl font-bold text-white mb-6">Platform Statistics</h3>
                <div className="space-y-6">
                  {[
                    { label: "Comments Analyzed", value: counters.comments.toLocaleString(), icon: MessageCircle, color: "text-blue-400" },
                    { label: "Active Drafts", value: counters.drafts.toString(), icon: FileText, color: "text-green-400" },
                    { label: "AI Insights Generated", value: counters.insights.toLocaleString(), icon: Brain, color: "text-purple-400" }
                  ].map((stat, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center space-x-3">
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        <div>
                          <div className={`text-2xl font-bold ${stat.color}`}>
                            {stat.value}
                          </div>
                          <div className="text-white/70 text-sm">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sentiment Visualization */}
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-white mb-6">Current Sentiment Analysis</h3>
                
                {/* Mock Pie Chart */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Sentiment Distribution</h4>
                      {[
                        { label: "Positive", percentage: 45, color: "bg-green-400" },
                        { label: "Neutral", percentage: 35, color: "bg-yellow-400" },
                        { label: "Negative", percentage: 20, color: "bg-red-400" }
                      ].map((sentiment, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-4 h-4 ${sentiment.color} rounded-full`}></div>
                          <span className="text-white flex-1">{sentiment.label}</span>
                          <span className="text-white font-bold">{sentiment.percentage}%</span>
                          <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${sentiment.color} rounded-full transition-all duration-1000`}
                              style={{ width: `${sentiment.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Word Cloud Mockup */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Trending Keywords</h4>
                      <div className="bg-white/10 rounded-xl p-4 flex flex-wrap gap-3">
                        {[
                          { word: "transparency", size: "text-lg", color: "text-blue-300" },
                          { word: "accountability", size: "text-base", color: "text-green-300" },
                          { word: "digital", size: "text-xl", color: "text-purple-300" },
                          { word: "reform", size: "text-sm", color: "text-yellow-300" },
                          { word: "governance", size: "text-lg", color: "text-pink-300" },
                          { word: "innovation", size: "text-base", color: "text-teal-300" }
                        ].map((keyword, index) => (
                          <span 
                            key={index}
                            className={`${keyword.size} ${keyword.color} font-medium opacity-80 hover:opacity-100 cursor-pointer transition-opacity`}
                          >
                            {keyword.word}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Activity Feed */}
            <div className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Live Activity Feed
              </h3>
              <div className="space-y-3">
                {[
                  { action: "New comment analyzed", draft: "Digital India Policy", time: "2 seconds ago" },
                  { action: "Sentiment pattern detected", draft: "Corporate Governance", time: "45 seconds ago" },
                  { action: "Report generated", draft: "Data Protection Framework", time: "2 minutes ago" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-white">{activity.action}</span>
                      <span className="text-blue-300 font-medium">• {activity.draft}</span>
                    </div>
                    <span className="text-white/60 text-sm">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Storytelling Section */}
      <section className="relative py-20 bg-white overflow-hidden">
        {/* Asymmetrical Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Abstract shape - top right */}
          <div className="absolute -top-16 right-10 w-72 h-64 bg-gradient-to-bl from-red-200/25 to-orange-300/15 transform rotate-25 animate-pulse" style={{
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            animationDuration: '10s'
          }}></div>
          
          {/* Curved element - left side */}
          <div className="absolute top-1/3 -left-8 w-48 h-80 bg-gradient-to-r from-green-200/20 to-emerald-300/10 transform -rotate-12 animate-bounce" style={{
            clipPath: 'ellipse(50% 80% at 50% 50%)',
            animationDuration: '14s'
          }}></div>
          
          {/* Scattered dots pattern */}
          <div className="absolute bottom-20 right-1/4 w-40 h-40 animate-pulse" style={{ animationDelay: '6s' }}>
            <div className="absolute top-0 left-0 w-4 h-4 bg-blue-300/30 rounded-full"></div>
            <div className="absolute top-8 left-12 w-6 h-6 bg-purple-300/25 rounded-full"></div>
            <div className="absolute top-16 left-4 w-3 h-3 bg-teal-300/35 rounded-full"></div>
            <div className="absolute bottom-8 right-0 w-5 h-5 bg-pink-300/20 rounded-full"></div>
            <div className="absolute bottom-0 right-8 w-4 h-4 bg-yellow-300/30 rounded-full"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              From <span className="text-red-500">Challenges</span> to <span className="text-green-500">Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how Lok Vaani transforms traditional policy consultation processes
            </p>
          </div>

          {/* Split Screen Comparison */}
          <div className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
            {/* Challenges Today */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-12 relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 to-red-600"></div>
              <h3 className="text-3xl font-bold text-red-800 mb-8">Challenges Today</h3>
              
              <div className="space-y-6">
                {[
                  { icon: Clock, title: "Manual Review Process", desc: "Weeks to process thousands of comments manually" },
                  { icon: Eye, title: "Limited Visibility", desc: "Key insights buried in unstructured feedback" },
                  { icon: FileText, title: "Delayed Decisions", desc: "Policy delays due to analysis bottlenecks" }
                ].map((challenge, index) => (
                  <div key={index} className="flex items-start space-x-4 opacity-70">
                    <div className="w-12 h-12 bg-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <challenge.icon className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-red-800 mb-1">{challenge.title}</h4>
                      <p className="text-red-700">{challenge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Visual Element */}
              <div className="mt-8 opacity-30">
                <div className="flex justify-center items-center space-x-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-16 h-20 bg-red-300 rounded-lg"></div>
                  ))}
                </div>
                <p className="text-center text-red-600 mt-4 font-medium">Piles of unprocessed feedback</p>
              </div>
            </div>

            {/* With Lok Vaani */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-12 relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
              <h3 className="text-3xl font-bold text-green-800 mb-8">With Lok Vaani</h3>
              
              <div className="space-y-6">
                {[
                  { icon: Zap, title: "Instant AI Processing", desc: "Real-time analysis of all incoming comments" },
                  { icon: BarChart3, title: "Clear Visual Insights", desc: "Comprehensive dashboards and reports" },
                  { icon: TrendingUp, title: "Faster Decisions", desc: "Data-driven policy making in real-time" }
                ].map((solution, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <solution.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-green-800 mb-1">{solution.title}</h4>
                      <p className="text-green-700">{solution.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Visual Element */}
              <div className="mt-8">
                <div className="flex justify-center items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center animate-pulse">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <ArrowRight className="h-6 w-6 text-green-600" />
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center animate-pulse">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                </div>
                <p className="text-center text-green-600 mt-4 font-medium">AI-powered transformation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Diagonal Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 transform skew-y-2 origin-bottom-left"></div>
        
        {/* Additional Asymmetrical CTA Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large organic shape - left */}
          <div className="absolute -left-20 top-10 w-80 h-72 bg-gradient-to-br from-yellow-400/20 to-orange-500/10 transform -rotate-15 animate-pulse" style={{
            borderRadius: '40% 60% 60% 40% / 60% 40% 40% 60%',
            animationDuration: '18s'
          }}></div>
          
          {/* Spiral-like shape - right */}
          <div className="absolute -right-16 bottom-16 w-64 h-64 bg-gradient-to-tl from-pink-400/25 to-purple-500/15 transform rotate-30 animate-bounce" style={{
            clipPath: 'polygon(50% 0%, 80% 50%, 50% 100%, 20% 50%)',
            animationDuration: '14s'
          }}></div>
          
          {/* Flowing element - top center */}
          <div className="absolute top-5 left-1/2 w-48 h-32 bg-gradient-to-b from-cyan-400/15 to-blue-500/10 transform -translate-x-1/2 rotate-6 animate-pulse" style={{
            borderRadius: '80% 20% 60% 40%',
            animationDelay: '7s'
          }}></div>
        </div>
        
        {/* Flowing Wave Animation */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Be Part of Transparent
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Governance
            </span>
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of citizens and policymakers in shaping India's digital future through data-driven public consultation.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/drafts">
              <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600 px-12 py-4 text-xl font-bold rounded-full transition-all transform hover:scale-105 shadow-2xl">
                Explore Drafts <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-6 h-6 bg-yellow-300 rounded-full opacity-60 animate-bounce"></div>
          <div className="absolute bottom-10 right-10 w-8 h-8 bg-pink-300 rounded-full opacity-60 animate-ping"></div>
          <div className="absolute top-1/2 left-20 w-4 h-4 bg-green-300 rounded-full opacity-60 animate-pulse"></div>
        </div>
      </section>


    </div>
  );
};

export default HomePage;
