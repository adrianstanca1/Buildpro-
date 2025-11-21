import React from 'react';
import { 
  FileSearch, FileText, Box, AlertTriangle, FileDigit, Search, 
  MessageSquare, Calculator, Calendar, ShieldAlert, FileBarChart, Activity, 
  Lightbulb, Upload
} from 'lucide-react';
import { Page } from '../types';

interface AIToolsViewProps {
  setPage: (page: Page) => void;
}

const AIToolsView: React.FC<AIToolsViewProps> = ({ setPage }) => {
  const tools = [
    { icon: FileSearch, title: 'Contract Analyzer', desc: 'Extract key dates, terms, liabilities from uploaded contracts' },
    { icon: FileText, title: 'Invoice Parser', desc: 'Auto-detect vendor, amounts, line items, payment terms' },
    { icon: Box, title: 'Blueprint Analyzer', desc: 'Extract dimensions, material quantities, detect risk areas' },
    { icon: AlertTriangle, title: 'Risk Assessment Engine', desc: 'Analyze project risks with confidence scoring' },
    { icon: FileDigit, title: 'Bid Generator', desc: 'Generate professional bid packages from templates' },
    { icon: Search, title: 'Grant Finder', desc: 'Search government construction grants and subsidies' },
    { icon: MessageSquare, title: 'AI Chat Assistant', desc: 'Natural language queries about projects, team, safety', action: () => setPage(Page.CHAT) },
    { icon: Calculator, title: 'Cost Estimator', desc: 'Predict project costs using historical ML models' },
    { icon: Calendar, title: 'Schedule Optimizer', desc: 'Optimize resource allocation with genetic algorithms' },
    { icon: ShieldAlert, title: 'Safety Predictor', desc: 'Predict potential incidents before they occur' },
    { icon: FileBarChart, title: 'Report Generator', desc: 'Auto-generate executive, safety, financial reports' },
    { icon: Activity, title: 'Sentiment Analysis', desc: 'Analyze chat/email sentiment for team morale tracking' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">AI-Powered Tools & Document Intelligence</h1>
        <p className="text-zinc-500">Leverage artificial intelligence and ML to enhance productivity</p>
      </div>

      {/* Hero Card */}
      <div className="bg-gradient-to-r from-[#e0f2fe] to-white border border-[#bae6fd] rounded-xl p-6 mb-8 flex items-center justify-between shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#0f5c82] rounded-lg text-white">
            <Lightbulb size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0c4a6e] mb-1">Intelligent Document Processing</h3>
            <p className="text-zinc-600 text-sm max-w-xl">
              Upload contracts, blueprints, or invoices for automated OCR, categorization, key information extraction, and risk analysis.
            </p>
          </div>
        </div>
        <button className="bg-[#1f7d98] hover:bg-[#166ba1] text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Upload size={16} /> Upload Document
        </button>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <div 
            key={index} 
            onClick={tool.action}
            className={`bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer group ${tool.action ? 'ring-1 ring-transparent hover:ring-[#0f5c82]' : ''}`}
          >
            <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
              <tool.icon size={20} className="text-[#0f5c82]" />
            </div>
            <h3 className="font-semibold text-zinc-900 mb-2">{tool.title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{tool.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIToolsView;