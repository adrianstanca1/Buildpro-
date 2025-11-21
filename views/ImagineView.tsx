
import React, { useState, useRef, useEffect } from 'react';
import { 
  Wand2, Download, Share2, Loader2, RefreshCw, 
  ScanEye, ShieldAlert, HardHat, Search, AlertTriangle, 
  CheckCircle2, FileText, Upload, X, ImageIcon, Layers,
  Map, ClipboardCheck, Check, Calculator, Activity,
  Info, AlertOctagon, HelpCircle, Briefcase, Save, CheckSquare,
  Video, Play
} from 'lucide-react';
import { generateImage, generateVideo, runRawPrompt } from '../services/geminiService';
import { GeneratedImage, ProjectDocument, Task } from '../types';
import { useProjects } from '../contexts/ProjectContext';

type Mode = 'CREATE_IMAGE' | 'CREATE_VIDEO' | 'INSPECT';

const ImagineView: React.FC = () => {
  const { projects, addDocument, addTask } = useProjects();
  const [mode, setMode] = useState<Mode>('CREATE_IMAGE');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  // --- Image Gen State ---
  const [imgPrompt, setImgPrompt] = useState('');
  const [imgAspectRatio, setImgAspectRatio] = useState('1:1');
  const [isImgGenerating, setIsImgGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  // --- Video Gen State ---
  const [vidPrompt, setVidPrompt] = useState('');
  const [vidAspectRatio, setVidAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isVidGenerating, setIsVidGenerating] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  // --- Analysis State ---
  const [analyzeMedia, setAnalyzeMedia] = useState<string | null>(null); // Data URL
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Image Generator ---
  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imgPrompt.trim() || isImgGenerating) return;

    setIsImgGenerating(true);
    try {
      const imageUrl = await generateImage(imgPrompt, imgAspectRatio);
      const newImage = { url: imageUrl, prompt: imgPrompt };
      setCurrentImage(newImage);
      setHistory(prev => [newImage, ...prev]);
    } catch (error) {
      console.error("Image Gen failed", error);
      showNotification("Failed to generate image.");
    } finally {
      setIsImgGenerating(false);
    }
  };

  // --- Video Generator ---
  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidPrompt.trim() || isVidGenerating) return;

    setIsVidGenerating(true);
    try {
      const videoUrl = await generateVideo(vidPrompt, vidAspectRatio);
      setCurrentVideoUrl(videoUrl);
    } catch (error) {
      console.error("Video Gen failed", error);
      showNotification("Failed to generate video.");
    } finally {
      setIsVidGenerating(false);
    }
  };

  const handleSaveToProject = (url: string, type: 'Image' | 'Video') => {
    if (!selectedProjectId) return;
    const project = projects.find(p => p.id === selectedProjectId);
    const newDoc: ProjectDocument = {
        id: `doc-${Date.now()}`,
        name: `AI ${type}: ${new Date().toLocaleTimeString()}`,
        type: type === 'Image' ? 'Image' : 'Other',
        projectId: selectedProjectId,
        projectName: project?.name,
        size: '---',
        date: new Date().toLocaleDateString(),
        status: 'Approved',
        url: url
    };
    addDocument(newDoc);
    showNotification(`Saved to ${project?.name || 'Project'}`);
  };

  // --- Analysis ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      setMediaType(isVideo ? 'video' : 'image');
      setMimeType(file.type);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnalyzeMedia(reader.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (promptTemplate: string) => {
    if (!analyzeMedia || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const base64Data = analyzeMedia.split(',')[1];
      const jsonPrompt = `${promptTemplate} Provide response as JSON array: [{"title": "", "description": "", "severity": "High"|"Medium"|"Low"|"Info", "mitigation": ""}]. No markdown code blocks.`;
      
      const response = await runRawPrompt(
          jsonPrompt, 
          { 
            temperature: 0.4,
            responseMimeType: 'application/json',
            model: 'gemini-3-pro-preview'
          }, 
          base64Data,
          mimeType // Pass the dynamic mime type (e.g. video/mp4 or image/png)
      );
      setAnalysisResult(response);
    } catch (error) {
      console.error("Analysis failed", error);
      setAnalysisResult("Failed to analyze media.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;
    let parsedData = null;
    try { parsedData = JSON.parse(analysisResult); } catch (e) {}

    if (Array.isArray(parsedData)) {
        return (
            <div className="space-y-3">
                {parsedData.map((item: any, idx: number) => (
                    <div key={idx} className="bg-white border border-zinc-200 p-4 rounded-xl hover:shadow-md transition-all">
                        <div className="flex items-start gap-3">
                            <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${item.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                {item.severity === 'High' ? <AlertOctagon size={16} /> : <Info size={16} />}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-zinc-900">{item.title}</h4>
                                <p className="text-xs text-zinc-500 mt-1">{item.description}</p>
                                {item.mitigation && <p className="text-xs text-green-600 mt-1 font-medium">Action: {item.mitigation}</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    return <div className="whitespace-pre-wrap text-sm text-zinc-700">{analysisResult}</div>;
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 text-zinc-900 overflow-hidden relative">
      
      {notification && (
        <div className="absolute top-20 right-8 z-50 bg-zinc-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in">
            <Check size={16} className="text-green-400" />
            <span className="text-sm">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="px-8 py-6 border-b border-zinc-200 flex items-center justify-between bg-white sticky top-0 z-20">
        <div>
            <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-3">
                <Wand2 className="text-[#0f5c82]" /> Imagine Studio
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Powered by Gemini 3.0 Pro & Veo</p>
        </div>
        
        <div className="flex items-center gap-4">
            <select 
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm min-w-[200px]"
            >
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>

            <div className="bg-zinc-100 p-1 rounded-lg border border-zinc-200 flex gap-1">
                <button onClick={() => setMode('CREATE_IMAGE')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === 'CREATE_IMAGE' ? 'bg-white text-[#0f5c82] shadow-sm' : 'text-zinc-500'}`}>
                    <ImageIcon size={16} /> Image
                </button>
                <button onClick={() => setMode('CREATE_VIDEO')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === 'CREATE_VIDEO' ? 'bg-white text-[#0f5c82] shadow-sm' : 'text-zinc-500'}`}>
                    <Video size={16} /> Video
                </button>
                <button onClick={() => setMode('INSPECT')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === 'INSPECT' ? 'bg-white text-[#0f5c82] shadow-sm' : 'text-zinc-500'}`}>
                    <ScanEye size={16} /> Analyze
                </button>
            </div>
        </div>
      </div>

      {/* IMAGE CREATION */}
      {mode === 'CREATE_IMAGE' && (
        <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-6xl mx-auto w-full flex flex-col">
            <div className="bg-white p-1.5 rounded-2xl border border-zinc-200 shadow-sm mb-6">
                <form onSubmit={handleGenerateImage} className="flex flex-col md:flex-row items-center gap-2 p-2">
                    <div className="relative flex-1 w-full">
                        <Wand2 size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input 
                            type="text" 
                            value={imgPrompt}
                            onChange={(e) => setImgPrompt(e.target.value)}
                            placeholder="Describe the construction image..."
                            className="w-full bg-transparent border-none text-zinc-900 pl-12 pr-4 py-3 focus:ring-0"
                        />
                    </div>
                    <select 
                        value={imgAspectRatio}
                        onChange={(e) => setImgAspectRatio(e.target.value)}
                        className="bg-zinc-50 border-none rounded-lg text-sm text-zinc-700 py-3 pl-3 pr-8 focus:ring-0 cursor-pointer"
                    >
                        {['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3', '21:9'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <button type="submit" disabled={isImgGenerating} className="bg-[#0f5c82] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#0c4a6e] disabled:opacity-50 transition-colors flex items-center gap-2">
                        {isImgGenerating ? <Loader2 className="animate-spin" /> : 'Generate'}
                    </button>
                </form>
            </div>

            <div className="flex-1 flex gap-8 min-h-[400px]">
                <div className="flex-1 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                    {currentImage ? (
                        <>
                            <img src={currentImage.url} alt="Generated" className="w-full h-full object-contain" />
                            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleSaveToProject(currentImage.url, 'Image')} className="px-4 py-2 bg-[#0f5c82] rounded-lg text-white text-sm font-medium shadow-lg">Save</button>
                            </div>
                        </>
                    ) : (
                        <div className="text-zinc-400 flex flex-col items-center">
                            {isImgGenerating ? <Loader2 size={48} className="animate-spin text-[#0f5c82]" /> : <ImageIcon size={48} />}
                            <p className="mt-4">{isImgGenerating ? 'Generating with Gemini 3 Pro...' : 'Enter prompt to generate'}</p>
                        </div>
                    )}
                </div>
                {/* History */}
                <div className="w-48 flex flex-col gap-3 overflow-y-auto">
                    {history.map((img, idx) => (
                        <div key={idx} onClick={() => setCurrentImage(img)} className="aspect-square rounded-lg overflow-hidden border border-zinc-200 cursor-pointer hover:border-[#0f5c82]">
                            <img src={img.url} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* VIDEO CREATION (Veo) */}
      {mode === 'CREATE_VIDEO' && (
        <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-4xl mx-auto w-full flex flex-col">
             <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-8 rounded-2xl text-white shadow-xl mb-8">
                 <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-white/10 rounded-lg"><Video size={24} /></div>
                     <h2 className="text-xl font-bold">Veo Video Studio</h2>
                 </div>
                 <form onSubmit={handleGenerateVideo} className="space-y-4">
                     <textarea 
                        value={vidPrompt}
                        onChange={(e) => setVidPrompt(e.target.value)}
                        placeholder="Describe the video scene (e.g. 'Drone shot of a modern skyscraper at sunset, 4k')"
                        className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 outline-none h-24 resize-none"
                     />
                     <div className="flex gap-4">
                         <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/10 cursor-pointer" onClick={() => setVidAspectRatio('16:9')}>
                             <div className={`w-4 h-4 rounded-full border ${vidAspectRatio === '16:9' ? 'bg-white border-white' : 'border-white/50'}`} />
                             <span>16:9 Landscape</span>
                         </div>
                         <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/10 cursor-pointer" onClick={() => setVidAspectRatio('9:16')}>
                             <div className={`w-4 h-4 rounded-full border ${vidAspectRatio === '9:16' ? 'bg-white border-white' : 'border-white/50'}`} />
                             <span>9:16 Portrait</span>
                         </div>
                         <button type="submit" disabled={isVidGenerating} className="ml-auto px-8 py-2 bg-white text-purple-900 font-bold rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50">
                             {isVidGenerating ? 'Generating...' : 'Create Video'}
                         </button>
                     </div>
                 </form>
             </div>

             {/* Output Area */}
             <div className="flex-1 bg-black rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center min-h-[400px] relative">
                 {isVidGenerating ? (
                     <div className="text-center">
                         <Loader2 size={48} className="animate-spin text-purple-500 mx-auto mb-4" />
                         <p className="text-zinc-400">Veo is rendering your video...</p>
                         <p className="text-zinc-600 text-sm mt-2">This may take 1-2 minutes.</p>
                     </div>
                 ) : currentVideoUrl ? (
                     <div className="relative w-full h-full group">
                        <video src={currentVideoUrl} controls className="w-full h-full object-contain" />
                        <button 
                            onClick={() => handleSaveToProject(currentVideoUrl!, 'Video')}
                            className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                            Save to Project
                        </button>
                     </div>
                 ) : (
                     <div className="text-zinc-600 flex flex-col items-center">
                         <Play size={64} className="opacity-20" />
                         <p className="mt-4">Generated videos will appear here.</p>
                     </div>
                 )}
             </div>
        </div>
      )}

      {/* INSPECT & ANALYZE */}
      {mode === 'INSPECT' && (
         <div className="flex-1 flex overflow-hidden">
             <div className="flex-1 bg-zinc-100 p-6 flex flex-col justify-center items-center border-r border-zinc-200 relative">
                 {analyzeMedia ? (
                     mediaType === 'video' ? (
                         <video src={analyzeMedia} controls className="max-w-full max-h-full rounded-lg shadow-lg" />
                     ) : (
                         <img src={analyzeMedia} className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
                     )
                 ) : (
                     <div className="text-center text-zinc-400">
                         <Upload size={48} className="mx-auto mb-4 opacity-50" />
                         <p className="mb-4">Upload Image or Video for Gemini Analysis</p>
                         <button onClick={() => fileInputRef.current?.click()} className="bg-[#0f5c82] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#0c4a6e] transition-colors">Select File</button>
                     </div>
                 )}
                 {analyzeMedia && (
                     <button onClick={() => { setAnalyzeMedia(null); setAnalysisResult(null); }} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow text-zinc-500 hover:text-red-500"><X size={20} /></button>
                 )}
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
             </div>

             <div className="w-96 bg-white p-6 flex flex-col shadow-xl z-10">
                 <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><ScanEye className="text-[#0f5c82]" /> Analysis Tools</h3>
                 <div className="grid grid-cols-2 gap-3 mb-6">
                     <button onClick={() => runAnalysis('Analyze for safety hazards.')} disabled={!analyzeMedia} className="p-3 border rounded-xl hover:bg-zinc-50 text-left text-xs font-medium">
                         <ShieldAlert size={18} className="text-red-500 mb-2" /> Safety Scan
                     </button>
                     <button onClick={() => runAnalysis('Estimate progress.')} disabled={!analyzeMedia} className="p-3 border rounded-xl hover:bg-zinc-50 text-left text-xs font-medium">
                         <Layers size={18} className="text-blue-500 mb-2" /> Progress
                     </button>
                     <button onClick={() => runAnalysis('Identify materials.')} disabled={!analyzeMedia} className="p-3 border rounded-xl hover:bg-zinc-50 text-left text-xs font-medium">
                         <HardHat size={18} className="text-orange-500 mb-2" /> Materials
                     </button>
                     <button onClick={() => runAnalysis('Check for defects.')} disabled={!analyzeMedia} className="p-3 border rounded-xl hover:bg-zinc-50 text-left text-xs font-medium">
                         <Search size={18} className="text-purple-500 mb-2" /> Defects
                     </button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                     {isAnalyzing ? (
                         <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                             <Loader2 size={24} className="animate-spin mb-2" />
                             <p className="text-xs">Gemini 3 Pro is thinking...</p>
                         </div>
                     ) : (
                         renderAnalysisResult() || <p className="text-zinc-400 text-xs text-center mt-10">Select a tool to begin analysis.</p>
                     )}
                 </div>
             </div>
         </div>
      )}
    </div>
  );
};

export default ImagineView;
