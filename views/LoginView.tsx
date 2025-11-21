
import React from 'react';
import { HardHat, Check, ArrowRight } from 'lucide-react';
import { Page, UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface LoginViewProps {
  setPage: (page: Page) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ setPage }) => {
  const { login } = useAuth();

  const handleDemoLogin = (role: UserRole) => {
    login(role);
    setPage(Page.IMAGINE);
  };

  const demoAccounts = [
    { label: 'Principal Admin', role: UserRole.SUPER_ADMIN, email: 'john@buildcorp.com' },
    { label: 'Company Admin', role: UserRole.COMPANY_ADMIN, email: 'sarah@buildcorp.com' },
    { label: 'Supervisor', role: UserRole.SUPERVISOR, email: 'mike@buildcorp.com' },
    { label: 'Operative', role: UserRole.OPERATIVE, email: 'david@buildcorp.com' },
  ];

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex w-[45%] bg-[#0f5c82] text-white flex-col p-16 relative overflow-hidden">
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-12">
            <HardHat size={40} fill="white" className="text-[#0f5c82]" />
            <span className="text-4xl font-bold tracking-tight">BuildPro</span>
          </div>

          <h2 className="text-3xl font-medium leading-snug mb-12">
            Complete Construction Management Platform for Modern Builders
          </h2>

          <div className="space-y-6 mb-12">
            <h3 className="text-lg font-semibold mb-4">Features:</h3>
            {[
              'Real-time Project Tracking',
              'Team Management & GPS Tracking',
              'AI-Powered Tools',
              'Financial Management',
              'Safety & Compliance'
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-blue-100">
                <Check size={20} strokeWidth={3} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Decorative Circle */}
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#166ba1] rounded-full opacity-50 blur-3xl" />
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center p-8 lg:p-24 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Welcome Back</h1>
          <p className="text-zinc-500 mb-10">Sign in to your account to continue</p>

          <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 mb-8">
            <p className="text-sm font-semibold text-zinc-900 mb-4">Select Role to Login (Demo)</p>
            <div className="space-y-3">
              {demoAccounts.map((account) => (
                <button 
                  key={account.email}
                  onClick={() => handleDemoLogin(account.role)}
                  className="w-full flex items-center justify-between text-xs group hover:bg-white p-3 rounded border border-transparent hover:border-zinc-200 transition-all shadow-sm hover:shadow"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-zinc-700 text-sm">{account.label}</span>
                    <span className="text-zinc-500">{account.email}</span>
                  </div>
                  <ArrowRight size={14} className="text-zinc-400 group-hover:text-[#0f5c82]" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginView;
