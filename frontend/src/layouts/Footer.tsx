import React from 'react';
import LokVaaniLogo from '../assets/logo.png';
const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      {/* Government Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 h-1"></div>
      
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* About Section with Logo */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <img src={LokVaaniLogo} alt="LokVaani" className="h-16 w-auto mr-4" />
              <div>
                <h3 className="text-slate-800 text-xl font-bold font-sans">E-Consultation Analysis</h3>
                <p className="text-slate-600 text-sm font-medium">Ministry of Corporate Affairs</p>
                <p className="text-slate-500 text-xs">Government of India</p>
              </div>
            </div>
            
            <p className="text-slate-600 text-sm mb-6 leading-relaxed max-w-md font-sans">
              LokVaani is an AI-powered sentiment analysis platform for government e-consultation processes, 
              providing comprehensive insights into public feedback and policy responses under the Digital India Initiative.
            </p>

            <div className="flex items-center space-x-4">
              <div className="text-slate-700 text-sm font-semibold">
                🇮🇳 भारत सरकार
              </div>
              <div className="w-px h-4 bg-slate-300"></div>
              <div className="text-blue-600 text-sm font-medium">
                Government of India
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-slate-800 font-semibold text-base mb-4 font-sans">Platform</h4>
            <ul className="space-y-2 text-slate-600 text-sm font-sans">
              <li><a href="/" className="hover:text-blue-600 transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-blue-600 transition-colors">About</a></li>
              <li><a href="/drafts" className="hover:text-blue-600 transition-colors">Drafts</a></li>
              <li><a href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</a></li>
              <li><a href="/contact" className="hover:text-blue-600 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Government Links */}
          <div>
            <h4 className="text-slate-800 font-semibold text-base mb-4 font-sans">Government</h4>
            <ul className="space-y-2 text-slate-600 text-sm font-sans">
              <li><a href="#" className="hover:text-blue-600 transition-colors">MCA Official</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">India.gov.in</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Digital India</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">RTI Portal</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Citizen Services</a></li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-slate-200 pt-6 mb-6">
          <div className="flex flex-wrap justify-center gap-6 text-slate-500 text-xs font-sans">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Copyright Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Disclaimer</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Accessibility</a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-4 md:mb-0">
              <p className="text-slate-600 text-sm font-medium mb-1 font-sans">
                © 2025 Ministry of Corporate Affairs, Government of India
              </p>
              <p className="text-slate-500 text-xs font-sans">
                All rights reserved. Content owned by MCA and managed by National Informatics Centre.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-slate-500 text-xs font-sans">Last Updated: September 2025</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 text-xs font-sans">Version 2.0</span>
              </div>
              <p className="text-slate-400 text-xs font-sans">
                Best viewed in Chrome, Firefox, Edge, Safari
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
