
import React, { useState } from 'react';
import { 
  Rocket, Sparkles, ArrowRight, Building, PoundSterling, 
  Calendar, MapPin, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useProjects } from '../contexts/ProjectContext';
import { runRawPrompt } from '../services/geminiService';
import { Project, Page } from '../types';

interface ProjectLaunchpadProps {
  setPage: (page: Page) => void;
}

const ProjectLaunchpadView: React.FC<ProjectLaunchpadProps> = ({ setPage }) => {
  const { addProject } = useProjects();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<Partial<Project> | null>(null);
  const [step, setStep] = useState<'INPUT' | 'REVIEW' | 'SUCCESS'>('INPUT');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);

    const systemPrompt = `
      You are an expert construction project manager AI. 
      Based on the user's description, generate a realistic construction project object in JSON format.
      The JSON must strictly adhere to this structure (do not include markdown formatting, just raw JSON):
      {
        "name": "Project Name",
        "code": "PRJ-YYYY-XXX",
        "description": "Detailed description...",
        "location": "City, State or specific address",
        "type": "Commercial" | "Residential" | "Infrastructure" | "Industrial" | "Healthcare",
        "budget": number (estimated total budget in GBP),
        "startDate": "YYYY-MM-DD" (assume starting next month),
        "endDate": "YYYY-MM-DD" (realistic duration based on scope),
        "teamSize": number (estimated staff count),
        "weatherLocation": { "city": "City Name", "temp": "72°", "condition": "Sunny" },
        "aiAnalysis": "A brief AI strategic risk assessment and executive summary."
      }
      Ensure the budget and timeline are realistic for the described scope.
    `;

    try {
      // Using gemini-3-pro-preview for complex reasoning
      const response = await runRawPrompt(`Project Description: ${prompt}`, {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.7,
        model: 'gemini-3-pro-preview' 
      });

      const parsed = JSON.parse(response);
      setGeneratedProject(parsed);
      setStep('REVIEW');
    } catch (error) {
      console.error("Generation failed", error);
      alert("Failed to generate project. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirm = () => {
    if (generatedProject) {
      const newProject: Project = {
        id: `p-${Date.now()}`,
        name: generatedProject.name || 'New Project',
        code: generatedProject.code || 'NEW-001',
        description: generatedProject.description || '',
        location: generatedProject.location || 'Unknown',
        type: (generatedProject.type as any) || 'Commercial',
        status: 'Planning',
        health: 'Good',
        progress: 0,
        budget: generatedProject.budget || 0,
        spent: 0,
        startDate: generatedProject.startDate || new Date().toISOString().split('T')[0],
        endDate: generatedProject.endDate || new Date().toISOString().split('T')[0],
        manager: 'John Anderson', // Default to current user
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80', // Placeholder
        teamSize: generatedProject.teamSize || 10,
        tasks: { total: 0, completed: 0, overdue: 0 },
        weatherLocation: generatedProject.weatherLocation,
        aiAnalysis: generatedProject.aiAnalysis
      };

      addProject(newProject);
      setStep('SUCCESS');
    }
  };

  return (
    <div className="min-h-full bg-zinc-50 flex flex-col relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#0f5c82] to-zinc-50 -z-10" />
      
      <div className="p-8 max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md text-white mb-6 shadow-xl border border-white/20">
             <Rocket size={32} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Project Launchpad</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            Describe your vision, and our AI will architect the initial project structure, budget, and timeline instantly.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden flex-1 flex flex-col min-h-[400px]">
          
          {step === 'INPUT' && (
            <div className="p-8 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
              <div className="flex-1 flex flex-col justify-center">
                <label className="block text-sm font-bold text-zinc-700 mb-4 uppercase tracking-wide">
                  What are we building today?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., A 20-story luxury apartment complex in downtown Austin with a rooftop pool and underground parking, targeting LEED Gold certification..."
                  className="w-full h-48 p-6 text-lg bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#0f5c82] focus:border-transparent resize-none placeholder:text-zinc-400 transition-all"
                />
                <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
                   <Sparkles size={14} className="text-[#0f5c82]" />
                   <span>Powered by Gemini 3.0 Pro • Generates budget, schedule & risk assessment</span>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className={`px-8 py-4 rounded-xl font-bold text-white shadow-lg flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 ${
                    isGenerating ? 'bg-zinc-400 cursor-not-allowed' : 'bg-[#0f5c82] hover:bg-[#0c4a6e]'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> Architecting...
                    </>
                  ) : (
                    <>
                      Generate Project Blueprint <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'REVIEW' && generatedProject && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8">
               <div className="bg-[#f0f9ff] border-b border-blue-100 p-6">
                  <h2 className="text-4xl font-extrabold text-[#0f5c82] mb-3 tracking-tight">{generatedProject.name}</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-[#0f5c82]">
                      <span className="flex items-center gap-1"><Building size={16} /> {generatedProject.type}</span>
                      <span className="flex items-center gap-1"><MapPin size={16} /> {generatedProject.location}</span>
                      <span className="flex items-center gap-1"><Calendar size={16} /> {generatedProject.startDate} - {generatedProject.endDate}</span>
                  </div>
               </div>
               
               <div className="flex-1 p-8 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                          <div>
                              <h3 className="text-sm font-bold text-zinc-400 uppercase mb-2">Description</h3>
                              <p className="text-zinc-700 leading-relaxed">{generatedProject.description}</p>
                          </div>
                          <div>
                              <h3 className="text-sm font-bold text-zinc-400 uppercase mb-2">AI Strategic Analysis</h3>
                              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 text-sm italic">
                                  "{generatedProject.aiAnalysis}"
                              </div>
                          </div>
                      </div>
                      
                      <div className="space-y-4">
                          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                              <div className="text-xs text-zinc-500 uppercase mb-1">Estimated Budget</div>
                              <div className="text-3xl font-bold text-zinc-900 flex items-center gap-1">
                                  <PoundSterling size={24} className="text-green-600" />
                                  £{generatedProject.budget?.toLocaleString()}
                              </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                                  <div className="text-xs text-zinc-500 uppercase mb-1">Duration</div>
                                  <div className="text-lg font-bold text-zinc-900">
                                     {Math.ceil((new Date(generatedProject.endDate!).getTime() - new Date(generatedProject.startDate!).getTime()) / (1000 * 60 * 60 * 24 * 30))} Months
                                  </div>
                              </div>
                              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                                  <div className="text-xs text-zinc-500 uppercase mb-1">Team Size</div>
                                  <div className="text-lg font-bold text-zinc-900">{generatedProject.teamSize} Staff</div>
                              </div>
                          </div>
                      </div>
                  </div>
               </div>

               <div className="p-6 border-t border-zinc-200 flex justify-between bg-zinc-50">
                  <button 
                    onClick={() => setStep('INPUT')}
                    className="px-6 py-3 text-zinc-600 font-medium hover:bg-zinc-200 rounded-lg transition-colors"
                  >
                    Back to Editor
                  </button>
                  <button 
                    onClick={handleConfirm}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg flex items-center gap-2"
                  >
                    <CheckCircle2 size={20} /> Initialize Project
                  </button>
               </div>
            </div>
          )}

          {step === 'SUCCESS' && (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-12 animate-in zoom-in-95 duration-500">
                 <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                     <CheckCircle2 size={48} className="text-green-600" />
                 </div>
                 <h2 className="text-3xl font-bold text-zinc-900 mb-4">Project Launched Successfully!</h2>
                 <p className="text-zinc-500 max-w-md mb-8">
                   Your project has been initialized in the workspace. The AI has also prepared a preliminary schedule and budget breakdown.
                 </p>
                 <div className="flex gap-4">
                     <button 
                        onClick={() => setPage(Page.PROJECTS)}
                        className="px-6 py-3 bg-[#0f5c82] text-white rounded-xl font-medium hover:bg-[#0c4a6e]"
                     >
                        View All Projects
                     </button>
                     <button 
                        onClick={() => setStep('INPUT')}
                        className="px-6 py-3 bg-zinc-100 text-zinc-700 rounded-xl font-medium hover:bg-zinc-200"
                     >
                        Launch Another
                     </button>
                 </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProjectLaunchpadView;
