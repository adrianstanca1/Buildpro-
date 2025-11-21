import React, { useState, useEffect, useRef } from 'react';
import { 
  Map as MapIcon, Layers, Upload, Crosshair, Users, Navigation, 
  FileText, Loader2, ZoomIn, ZoomOut, Eye, MoreVertical, CheckCircle2,
  Cpu, Scan, FileCode, AlertCircle, XCircle, Maximize, Grid, Ruler,
  FolderOpen, Clock, File, ChevronRight, X, Image as ImageIcon, Search, Filter, Briefcase, RefreshCw, ShieldCheck,
  PlusSquare, PenTool, ShieldAlert, Sparkles, MousePointer2, ChevronDown, UserCircle
} from 'lucide-react';
import * as L from 'leaflet';
import { useProjects } from '../contexts/ProjectContext';
import { runRawPrompt } from '../services/geminiService';
import { Zone } from '../types';

// --- Types ---
type MapMode = 'REAL_WORLD' | 'VIRTUAL_SITE';
type ProcessingStatus = 'IDLE' | 'PROCESSING' | 'ERROR' | 'SUCCESS';

interface MapUser {
  id: string;
  name: string;
  role: 'Manager' | 'Foreman' | 'Labor';
  lat: number; // 0-100% for relative, lat for real
  lng: number; // 0-100% for relative, lng for real
  lastActive: string;
  status: 'Active' | 'Idle';
}

interface Drawing {
  id: string;
  name: string;
  type: string; // PDF, DWG, DXF, etc.
  category: 'Structural' | 'Architectural' | 'MEP' | 'Site';
  date: string;
  size: string;
  uploader: string;
  preview: string; // Mock URL for preview
  project: string;
}

const LiveProjectMapView: React.FC = () => {
  const { projects, addZone } = useProjects();
  const [mode, setMode] = useState<MapMode>('VIRTUAL_SITE');
  
  // Default to first project for demo if exists, otherwise null
  const activeProject = projects.length > 0 ? projects[0] : null;
  
  // Processing State
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>('IDLE');
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null); // Store for retry
  const [pendingDrawing, setPendingDrawing] = useState<Drawing | null>(null); // Store for retry

  const [drawingUploaded, setDrawingUploaded] = useState(false); 
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  
  // Zone Creation State
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [pendingZoneRect, setPendingZoneRect] = useState<{top: number, left: number, width: number, height: number} | null>(null);
  const [newZoneData, setNewZoneData] = useState({ label: '', type: 'warning' as const, protocol: '', trigger: 'Entry' });
  const [isGeneratingProtocol, setIsGeneratingProtocol] = useState(false);

  // Library State
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryFilter, setLibraryFilter] = useState('All');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('All Projects');
  
  // User & Filtering State
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [users, setUsers] = useState<MapUser[]>([
    { id: '1', name: 'John Anderson', role: 'Manager', lat: 45, lng: 30, lastActive: 'Just now', status: 'Active' },
    { id: '2', name: 'Mike Thompson', role: 'Foreman', lat: 60, lng: 65, lastActive: '2m ago', status: 'Active' },
    { id: '3', name: 'David Chen', role: 'Foreman', lat: 25, lng: 80, lastActive: '5m ago', status: 'Active' },
    { id: '4', name: 'Team Alpha', role: 'Labor', lat: 70, lng: 20, lastActive: '1m ago', status: 'Active' },
    { id: '5', name: 'Team Beta', role: 'Labor', lat: 75, lng: 25, lastActive: '1m ago', status: 'Active' },
    { id: '6', name: 'Sarah Mitchell', role: 'Manager', lat: 15, lng: 15, lastActive: '10m ago', status: 'Idle' },
  ]);

  // Mock Previous Drawings
  const availableDrawings: Drawing[] = [
    { id: 'd1', name: 'Ground Floor Structural.pdf', type: 'PDF', category: 'Structural', date: '2025-10-15', size: '4.2 MB', uploader: 'Mike Thompson', preview: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&w=1000&q=80', project: 'City Centre Plaza' },
    { id: 'd2', name: 'Site Layout Plan v3.dwg', type: 'DWG', category: 'Site', date: '2025-11-02', size: '8.5 MB', uploader: 'Sarah Mitchell', preview: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80', project: 'City Centre Plaza' },
    { id: 'd3', name: 'HVAC Schematics L2.pdf', type: 'PDF', category: 'MEP', date: '2025-11-05', size: '2.1 MB', uploader: 'David Chen', preview: 'https://images.unsplash.com/photo-1599708153386-51e2b8895249?auto=format&fit=crop&w=1000&q=80', project: 'City Centre Plaza' },
    { id: 'd4', name: 'Electrical Grid Alpha.dxf', type: 'DXF', category: 'MEP', date: '2025-11-08', size: '3.4 MB', uploader: 'System', preview: 'https://images.unsplash.com/photo-1558402347-9539d93d7f0e?auto=format&fit=crop&w=1000&q=80', project: 'Westside Heights' },
    { id: 'd5', name: 'Elevation View North.jpg', type: 'JPG', category: 'Architectural', date: '2025-11-10', size: '1.8 MB', uploader: 'Mike Thompson', preview: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80', project: 'Westside Heights' },
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate Live Tracking (Jitter)
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prev => prev.map(u => ({
        ...u,
        lat: Math.max(0, Math.min(100, u.lat + (Math.random() - 0.5) * 1.5)),
        lng: Math.max(0, Math.min(100, u.lng + (Math.random() - 0.5) * 1.5))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const startProcessingSimulation = async (file?: File, demoMode = false, drawing?: Drawing) => {
      setProcessingStatus('PROCESSING');
      setError(null);
      setShowLibrary(false);
      
      // Store for retry
      if (file) setPendingFile(file);
      if (drawing) setPendingDrawing(drawing);
      
      const isCad = file 
        ? (file.name.toLowerCase().endsWith('.dwg') || file.name.toLowerCase().endsWith('.dxf')) 
        : (drawing && (drawing.type === 'DWG' || drawing.type === 'DXF'));
        
      const isPdf = file
        ? file.name.toLowerCase().endsWith('.pdf')
        : (drawing && drawing.type === 'PDF');

      try {
        setProcessingSteps(demoMode 
          ? ['Loading demo blueprint...', 'Initializing Gemini Vision AI...']
          : ['Uploading Drawing to Gemini Vision AI...', 'Analyzing visual structure...']
        );

        // Handle File or Library Selection
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                 await delay(500);
                 throw new Error("Upload failed: File size exceeds the 50MB limit.");
            }
            // Mock read
            await new Promise<void>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (typeof e.target?.result === 'string') {
                        setMapImage(e.target.result);
                        resolve();
                    } else reject(new Error("Failed to read file data."));
                };
                reader.readAsDataURL(file);
            });
        } else if (drawing) {
            setMapImage(drawing.preview);
        } else if (!demoMode) {
             setMapImage(null); 
        }
        
        await delay(800);
        setProcessingSteps(prev => [...prev, 'Security Scan: Verifying document integrity...']);
        await delay(600);

        if (isCad) setProcessingSteps(prev => [...prev, 'Gemini: Parsing vector entities & block definitions...']);
        else if (isPdf) setProcessingSteps(prev => [...prev, 'Gemini Vision: Extracting vector layers from PDF...']);
        else setProcessingSteps(prev => [...prev, 'Gemini Vision: Analyzing floor plan geometry...']);
        
        await delay(1000);
        setProcessingSteps(prev => [...prev, 'AI Analysis: Identifying hazard zones (stairs, shafts, exits)...']);
        
        await delay(800);
        setProcessingSteps(prev => [...prev, 'Safety Protocol: Applying default zoning rules...']);
        
        // Pre-generate some zones if new
        if (activeProject && (!activeProject.zones || activeProject.zones.length === 0)) {
             const defaultZones: Zone[] = [
                { id: 'z1', label: 'Hazard: Excavation', type: 'danger', top: 20, left: 20, width: 30, height: 25, protocol: 'Tie-off required', trigger: 'Entry' },
                { id: 'z2', label: 'Material Staging', type: 'info', top: 60, left: 65, width: 25, height: 30, protocol: 'Helmet required', trigger: 'Loitering' },
            ];
            defaultZones.forEach(z => addZone(activeProject.id, z));
        }

        await delay(1000);
        setProcessingSteps(prev => [...prev, 'Finalizing: Calibrating virtual scale & coordinates...']);
        await delay(800);
        
        setProcessingStatus('SUCCESS');
        await delay(1000);
        
        setProcessingStatus('IDLE');
        setDrawingUploaded(true);
        setMode('VIRTUAL_SITE');
        setProcessingSteps([]);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 4000);

      } catch (err) {
          setError(err instanceof Error ? err.message : "An unexpected error occurred.");
          setProcessingStatus('ERROR');
      }
  };

  const handleRetry = () => {
      if (pendingFile) startProcessingSimulation(pendingFile);
      else if (pendingDrawing) startProcessingSimulation(undefined, false, pendingDrawing);
      else startProcessingSimulation(undefined, true);
  };

  const handleCancel = () => {
      setProcessingStatus('IDLE');
      setError(null);
      setProcessingSteps([]);
      setPendingFile(null);
      setPendingDrawing(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) startProcessingSimulation(file);
    e.target.value = '';
  };

  const handleDemoLoad = () => startProcessingSimulation(undefined, true);
  const handleLibrarySelect = (drawing: Drawing) => startProcessingSimulation(undefined, false, drawing);

  // --- Zone Drawing Handlers ---
  const handleZoneDrawn = (rect: { top: number, left: number, width: number, height: number }) => {
    setPendingZoneRect(rect);
    setNewZoneData({ label: '', type: 'warning', protocol: '', trigger: 'Entry' });
    setShowZoneModal(true);
  };

  const handleGenerateProtocol = async () => {
      if (!newZoneData.label) return;
      setIsGeneratingProtocol(true);
      try {
          const prompt = `Generate a concise safety protocol (max 15 words) for a construction zone labeled '${newZoneData.label}' which is classified as '${newZoneData.type}'. Format as a plain string.`;
          const protocol = await runRawPrompt(prompt, { temperature: 0.3, model: 'gemini-2.5-flash' });
          setNewZoneData(prev => ({ ...prev, protocol: protocol.trim() }));
      } catch (e) {
          console.error("Protocol gen failed", e);
      } finally {
          setIsGeneratingProtocol(false);
      }
  };

  const handleSaveZone = () => {
      if (pendingZoneRect && newZoneData.label && activeProject) {
          const newZone: Zone = {
              id: `z-${Date.now()}`,
              ...pendingZoneRect,
              ...newZoneData
          };
          addZone(activeProject.id, newZone);
          setShowZoneModal(false);
          setPendingZoneRect(null);
      }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Manager': return 'bg-slate-800 text-white border-slate-600';
      case 'Foreman': return 'bg-orange-500 text-white border-orange-600';
      case 'Labor': return 'bg-green-500 text-white border-green-600';
      default: return 'bg-blue-500 text-white';
    }
  };

  const filteredDrawings = availableDrawings.filter(d => {
     const matchesSearch = d.name.toLowerCase().includes(librarySearch.toLowerCase()) || d.uploader.toLowerCase().includes(librarySearch.toLowerCase());
     const matchesType = libraryFilter === 'All' || 
                         (libraryFilter === 'CAD' && ['DWG', 'DXF'].includes(d.type)) ||
                         (libraryFilter === 'PDF' && d.type === 'PDF') ||
                         (libraryFilter === 'Images' && ['JPG', 'PNG'].includes(d.type));
     const matchesProject = selectedProjectFilter === 'All Projects' || d.project === selectedProjectFilter;
     return matchesSearch && matchesType && matchesProject;
  });

  const projectsList = ['All Projects', ...Array.from(new Set(availableDrawings.map(d => d.project)))];
  const filteredUsers = users.filter(u => roleFilter === 'All' || u.role === roleFilter);

  // Active zones from project context
  const activeZones = activeProject?.zones || [];

  return (
    <div className="flex h-full flex-col bg-zinc-50 relative">
      {/* Header Controls */}
      <div className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between shadow-sm z-20 sticky top-0">
        <div className="flex items-center gap-4">
           <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
             <Crosshair className="text-[#0f5c82]" /> Live Project Map
           </h1>
           {drawingUploaded && (
             <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded animate-pulse flex items-center gap-1">
               <div className="w-1.5 h-1.5 bg-green-600 rounded-full" /> LIVE
             </span>
           )}
           {activeProject && <span className="text-sm text-zinc-500 border-l border-zinc-200 pl-4">{activeProject.name}</span>}
        </div>

        <div className="flex items-center gap-4">
           <div className="bg-zinc-100 p-1 rounded-lg flex items-center border border-zinc-200">
              <button 
                onClick={() => setMode('VIRTUAL_SITE')}
                disabled={!drawingUploaded}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    mode === 'VIRTUAL_SITE' ? 'bg-white text-[#0f5c82] shadow-sm' : 'text-zinc-500 hover:text-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <FileText size={14} /> Virtual Site
              </button>
              <button 
                onClick={() => setMode('REAL_WORLD')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === 'REAL_WORLD' ? 'bg-white text-[#0f5c82] shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                <MapIcon size={14} /> Real World
              </button>
           </div>

           <div className="h-6 w-px bg-zinc-200" />
           
           <div className="relative min-w-[140px]">
               <select 
                   value={roleFilter}
                   onChange={(e) => setRoleFilter(e.target.value)}
                   className="w-full pl-4 pr-8 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f5c82] outline-none appearance-none font-medium text-zinc-700 cursor-pointer hover:bg-zinc-50 shadow-sm"
               >
                   <option value="All">All Roles</option>
                   <option value="Manager">Manager</option>
                   <option value="Foreman">Foreman</option>
                   <option value="Labor">Labor</option>
               </select>
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={14} />
           </div>

           <div className="flex gap-2">
               <button 
                 onClick={() => setShowLibrary(true)}
                 className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 shadow-sm"
               >
                 <FolderOpen size={16} /> Library
               </button>
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
                     !drawingUploaded 
                     ? 'bg-[#0f5c82] text-white hover:bg-[#0c4a6e] ring-2 ring-[#0f5c82] ring-offset-2' 
                     : 'bg-[#0f5c82] text-white hover:bg-[#0c4a6e]'
                 }`}
               >
                 <Upload size={16} /> {drawingUploaded ? 'Update Drawing' : 'Upload PDF'}
               </button>
           </div>
           <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,application/pdf,.dwg,.dxf,.png,.jpg,.jpeg,.svg" onChange={handleFileUpload} />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar / Legend */}
        <div className="w-80 bg-white border-r border-zinc-200 flex flex-col z-10 shadow-lg flex-shrink-0">
           <div className="p-4 border-b border-zinc-100">
              <h3 className="font-semibold text-zinc-800 flex items-center gap-2">
                <Users size={16} /> Active Personnel ({filteredUsers.length})
              </h3>
           </div>
           
           <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {filteredUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 hover:bg-zinc-50 rounded-lg border border-transparent hover:border-zinc-100 transition-colors group cursor-pointer">
                   <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getRoleColor(user.role).split(' ')[0]} ring-2 ring-white shadow-sm`} />
                      <div>
                        <div className="font-medium text-sm text-zinc-900">{user.name}</div>
                        <div className="text-xs text-zinc-500 flex items-center gap-1">
                           {user.role} • <span className="text-green-600">{user.status}</span>
                        </div>
                      </div>
                   </div>
                   <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-zinc-200 rounded text-zinc-500 transition-opacity">
                      <Navigation size={14} />
                   </button>
                </div>
              ))}
           </div>

           <div className="p-4 border-t border-zinc-200 bg-zinc-50">
              <h4 className="text-xs font-bold text-zinc-400 uppercase mb-3">Map Legend</h4>
              <div className="space-y-2 text-sm">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-800" /> <span className="text-zinc-600">Manager</span></div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500" /> <span className="text-zinc-600">Foreman</span></div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /> <span className="text-zinc-600">Labor / Operator</span></div>
              </div>
           </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-zinc-100 overflow-hidden">
           
           {/* Zone Creation Modal */}
           {showZoneModal && (
               <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center animate-in fade-in">
                   <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 border border-zinc-200">
                       <div className="flex items-center gap-3 mb-6">
                           <div className="p-3 bg-blue-50 text-[#0f5c82] rounded-xl"><PlusSquare size={24} /></div>
                           <div>
                               <h3 className="text-lg font-bold text-zinc-900">Configure New Zone</h3>
                               <p className="text-xs text-zinc-500">Define safety parameters for this area.</p>
                           </div>
                       </div>
                       
                       <div className="space-y-4">
                           <div>
                               <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Zone Label</label>
                               <input 
                                 type="text" 
                                 value={newZoneData.label}
                                 onChange={e => setNewZoneData({...newZoneData, label: e.target.value})}
                                 className="w-full p-3 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0f5c82] focus:border-[#0f5c82] outline-none transition-all"
                                 placeholder="e.g., Excavation Area A"
                                 autoFocus
                               />
                           </div>
                           
                           <div>
                               <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Zone Type</label>
                               <div className="flex gap-2">
                                   {['danger', 'warning', 'info', 'success'].map(type => (
                                       <button
                                          key={type}
                                          onClick={() => setNewZoneData({...newZoneData, type: type as any})}
                                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase border transition-all ${
                                              newZoneData.type === type 
                                              ? (type === 'danger' ? 'bg-red-100 border-red-500 text-red-700 shadow-sm' : 
                                                 type === 'warning' ? 'bg-orange-100 border-orange-500 text-orange-700 shadow-sm' :
                                                 type === 'success' ? 'bg-green-100 border-green-500 text-green-700 shadow-sm' :
                                                 'bg-blue-100 border-blue-500 text-blue-700 shadow-sm')
                                              : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                                          }`}
                                       >
                                           {type}
                                       </button>
                                   ))}
                               </div>
                           </div>

                           <div>
                               <label className="block text-xs font-bold text-zinc-500 uppercase mb-1 flex justify-between">
                                   Safety Protocol
                                   <button 
                                      onClick={handleGenerateProtocol}
                                      disabled={!newZoneData.label || isGeneratingProtocol}
                                      className="text-[#0f5c82] hover:underline flex items-center gap-1 disabled:opacity-50"
                                   >
                                       {isGeneratingProtocol ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />} AI Suggest
                                   </button>
                               </label>
                               <textarea 
                                 value={newZoneData.protocol}
                                 onChange={e => setNewZoneData({...newZoneData, protocol: e.target.value})}
                                 className="w-full p-3 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0f5c82] focus:border-[#0f5c82] outline-none resize-none h-24 transition-all placeholder:text-zinc-400"
                                 placeholder="e.g., Hard hats required. No unauthorized entry."
                               />
                           </div>

                           <div>
                               <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Alert Trigger</label>
                               <div className="relative">
                                   <select 
                                     value={newZoneData.trigger}
                                     onChange={e => setNewZoneData({...newZoneData, trigger: e.target.value})}
                                     className="w-full p-3 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0f5c82] outline-none bg-white appearance-none cursor-pointer"
                                   >
                                       <option value="Entry">On Entry</option>
                                       <option value="Exit">On Exit</option>
                                       <option value="Loitering">Loitering (>5 mins)</option>
                                       <option value="Capacity">Capacity Limit Exceeded</option>
                                   </select>
                                   <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 rotate-90" size={16} />
                               </div>
                           </div>
                       </div>

                       <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-zinc-100">
                           <button 
                             onClick={() => { setShowZoneModal(false); setPendingZoneRect(null); }}
                             className="px-6 py-2.5 text-zinc-600 font-medium hover:bg-zinc-100 rounded-xl transition-colors"
                           >
                               Cancel
                           </button>
                           <button 
                             onClick={handleSaveZone}
                             disabled={!newZoneData.label}
                             className="px-6 py-2.5 bg-[#0f5c82] text-white font-medium rounded-xl hover:bg-[#0c4a6e] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/10 transition-all"
                           >
                               Create Zone
                           </button>
                       </div>
                   </div>
               </div>
           )}

           {/* Processing Modal */}
           {processingStatus !== 'IDLE' && (
             <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in">
                <div className="bg-white p-10 rounded-3xl shadow-2xl border border-zinc-100 flex flex-col items-center text-center max-w-md w-full mx-4 relative overflow-hidden">
                   {processingStatus === 'PROCESSING' && (
                       <>
                           <div className="relative mb-8">
                               <div className="w-24 h-24 rounded-full border-4 border-zinc-50 flex items-center justify-center bg-zinc-50">
                                   <Cpu size={40} className="text-[#0f5c82] animate-pulse" />
                               </div>
                               <div className="absolute inset-0 border-4 border-[#0f5c82] border-t-transparent rounded-full animate-spin" />
                           </div>
                           <h3 className="text-2xl font-bold text-zinc-900 mb-8">AI Processing Blueprint</h3>
                           <div className="w-full space-y-4 text-left">
                               {processingSteps.map((step, i) => (
                                   <div key={i} className="flex items-center gap-4 text-sm animate-in slide-in-from-bottom-2 fade-in duration-500">
                                       <div className={`p-1 rounded-full ${step.includes('Gemini') ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                                           {step.includes('Gemini') ? <Sparkles size={14} /> : <CheckCircle2 size={14} />}
                                       </div>
                                       <span className={i === processingSteps.length - 1 ? "text-zinc-800 font-semibold" : "text-zinc-400"}>
                                           {step}
                                       </span>
                                   </div>
                               ))}
                           </div>
                       </>
                   )}
                   {processingStatus === 'ERROR' && (
                       <div className="animate-in zoom-in-95 duration-300 w-full">
                           <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                               <XCircle size={48} className="text-red-500" />
                           </div>
                           <h3 className="text-2xl font-bold text-zinc-900 mb-2">Processing Failed</h3>
                           <p className="text-zinc-500 text-sm mb-8 leading-relaxed px-4">{error}</p>
                           <div className="flex gap-4 justify-center">
                               <button onClick={handleCancel} className="px-6 py-3 border border-zinc-200 text-zinc-600 rounded-xl font-medium hover:bg-zinc-50">Cancel</button>
                               <button onClick={handleRetry} className="px-6 py-3 bg-[#0f5c82] text-white rounded-xl font-medium hover:bg-[#0c4a6e] flex items-center gap-2"><RefreshCw size={18} /> Retry</button>
                           </div>
                       </div>
                   )}
                   {processingStatus === 'SUCCESS' && (
                       <div className="animate-in zoom-in-95 duration-300">
                           <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                               <CheckCircle2 size={48} className="text-green-500" />
                           </div>
                           <h3 className="text-2xl font-bold text-zinc-900 mb-2">Virtual Map Ready</h3>
                           <p className="text-zinc-500 text-sm">AI analysis complete. Loading environment...</p>
                       </div>
                   )}
                </div>
             </div>
           )}

           {/* Library Overlay */}
           {showLibrary && (
               <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center animate-in fade-in">
                   <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col h-[85%] animate-in zoom-in-95 slide-in-from-bottom-4">
                       <div className="p-8 border-b border-zinc-100 flex flex-col gap-6">
                           <div className="flex justify-between items-start">
                               <div><h3 className="text-2xl font-bold text-zinc-900">Project Drawing Library</h3><p className="text-zinc-500 mt-1">Select a previously uploaded drawing.</p></div>
                               <button onClick={() => setShowLibrary(false)} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500"><X size={24} /></button>
                           </div>
                           <div className="flex flex-col md:flex-row gap-4 items-center">
                               <div className="relative flex-1 w-full">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                   <input type="text" placeholder="Search..." value={librarySearch} onChange={(e) => setLibrarySearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0f5c82] outline-none" />
                               </div>
                               <div className="flex items-center gap-2 bg-zinc-50 p-1.5 rounded-xl border border-zinc-200 overflow-x-auto max-w-full">
                                    {['All', 'PDF', 'CAD', 'Images'].map(filter => (
                                        <button key={filter} onClick={() => setLibraryFilter(filter)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${libraryFilter === filter ? 'bg-white text-[#0f5c82] shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}>{filter}</button>
                                    ))}
                               </div>
                               <div className="relative min-w-[200px]">
                                   <select value={selectedProjectFilter} onChange={(e) => setSelectedProjectFilter(e.target.value)} className="w-full pl-10 pr-8 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0f5c82] outline-none appearance-none font-medium text-zinc-700">
                                       {projectsList.map(p => <option key={p} value={p}>{p}</option>)}
                                   </select>
                                   <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                   <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 rotate-90" size={16} />
                               </div>
                           </div>
                       </div>
                       <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-zinc-50/30">
                           <div onClick={() => { setShowLibrary(false); fileInputRef.current?.click(); }} className="border-2 border-dashed border-zinc-200 rounded-2xl p-6 flex flex-col items-center justify-center text-zinc-400 hover:border-[#0f5c82] hover:text-[#0f5c82] cursor-pointer transition-all bg-white hover:bg-blue-50/20 min-h-[160px] group">
                                <div className="p-4 bg-zinc-50 rounded-full mb-4 group-hover:bg-blue-100 transition-colors"><Upload size={28} /></div>
                                <span className="font-bold text-sm">Upload New Drawing</span>
                           </div>
                           {filteredDrawings.map(drawing => (
                               <div key={drawing.id} onClick={() => handleLibrarySelect(drawing)} className="bg-white border border-zinc-200 rounded-2xl p-5 hover:shadow-lg hover:border-blue-200 cursor-pointer transition-all group flex flex-col relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide bg-blue-100 text-blue-700">{drawing.type}</span>
                                        <div className="bg-zinc-100 text-zinc-500 text-[10px] px-2 py-1 rounded font-medium truncate max-w-[120px]">{drawing.project}</div>
                                    </div>
                                    <div className="h-32 bg-zinc-100 rounded-xl overflow-hidden relative mb-4 border border-zinc-100 group-hover:border-blue-100 transition-colors">
                                        <img src={drawing.preview} alt="Preview" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors"><Eye size={28} className="text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all" /></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-zinc-900 text-sm truncate mb-1">{drawing.name}</h4>
                                        <p className="text-xs text-zinc-500 mb-3">{drawing.category} • {drawing.size}</p>
                                        <div className="flex items-center gap-2 text-xs text-zinc-400 pt-3 border-t border-zinc-50"><Clock size={12} /> {drawing.date} <span className="mx-1">•</span> <Users size={12} /> {drawing.uploader}</div>
                                    </div>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
           )}

           {/* VIRTUAL SITE MAP */}
           {mode === 'VIRTUAL_SITE' && drawingUploaded && (
             <VirtualSiteMap 
                users={filteredUsers} 
                getRoleColor={getRoleColor} 
                mapImage={mapImage} 
                zones={activeZones} 
                onZoneDraw={handleZoneDrawn}
             />
           )}

           {/* REAL WORLD MAP */}
           {mode === 'REAL_WORLD' && (
             <RealWorldMap users={filteredUsers} getRoleColor={getRoleColor} />
           )}

           {/* Empty State */}
           {mode === 'VIRTUAL_SITE' && !drawingUploaded && processingStatus === 'IDLE' && (
              <EmptyState 
                onUpload={() => fileInputRef.current?.click()} 
                onDemo={handleDemoLoad} 
                onLibrary={() => setShowLibrary(true)}
              />
           )}
        </div>
      </div>

      {showSuccessToast && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-bottom-4 fade-in z-50">
            <CheckCircle2 size={20} className="text-green-400" /> Virtual Site Map Generated
        </div>
      )}
    </div>
  );
};

interface VirtualSiteMapProps {
    users: MapUser[];
    getRoleColor: (role: string) => string;
    mapImage: string | null;
    zones: Zone[];
    onZoneDraw: (rect: { top: number, left: number, width: number, height: number }) => void;
}

const VirtualSiteMap: React.FC<VirtualSiteMapProps> = ({ users, getRoleColor, mapImage, zones, onZoneDraw }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawStart, setDrawStart] = useState<{x: number, y: number} | null>(null);
  const [currentMousePos, setCurrentMousePos] = useState<{x: number, y: number} | null>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setScale(1); setPosition({ x: 0, y: 0 }); }, [mapImage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && drawingMode) {
            setDrawingMode(false); setDrawStart(null); setCurrentMousePos(null);
        }
        if (e.key === 'Escape' && !drawingMode) setActiveUserId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawingMode]);

  const handleWheel = (e: React.WheelEvent) => {
    if (drawingMode) return;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(s => Math.min(Math.max(0.5, s * delta), 4));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!drawingMode && activeUserId) setActiveUserId(null);
    if (drawingMode) {
        if (!mapRef.current) return;
        const rect = mapRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 100;
        const y = (e.clientY - rect.top) / rect.height * 100;
        setDrawStart({ x, y }); setCurrentMousePos({ x, y });
    } else {
        isDragging.current = true; lastPos.current = { x: e.clientX, y: e.clientY };
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (drawingMode && drawStart && mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect();
        let x = (e.clientX - rect.left) / rect.width * 100;
        let y = (e.clientY - rect.top) / rect.height * 100;
        x = Math.max(0, Math.min(100, x)); y = Math.max(0, Math.min(100, y));
        setCurrentMousePos({ x, y });
    } else if (isDragging.current) {
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        setPosition(p => ({ x: p.x + dx, y: p.y + dy }));
        lastPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    if (drawingMode && drawStart && currentMousePos) {
        const left = Math.min(drawStart.x, currentMousePos.x);
        const top = Math.min(drawStart.y, currentMousePos.y);
        const width = Math.abs(drawStart.x - currentMousePos.x);
        const height = Math.abs(drawStart.y - currentMousePos.y);
        if (width > 2 && height > 2) onZoneDraw({ top, left, width, height });
        setDrawStart(null); setCurrentMousePos(null); setDrawingMode(false);
    }
    isDragging.current = false;
  };
  
  return (
    <div className="w-full h-full relative bg-zinc-50 overflow-hidden flex flex-col select-none">
       <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
            <button onClick={() => setDrawingMode(!drawingMode)} className={`p-2 rounded-lg shadow-sm border transition-colors ${drawingMode ? 'bg-red-600 text-white border-red-700 shadow-md animate-pulse ring-2 ring-red-200' : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'}`} title="Draw Zone"><PlusSquare size={20} /></button>
            <div className="h-px bg-zinc-300 my-1" />
            <button onClick={() => setScale(s => Math.min(4, s + 0.2))} className="p-2 bg-white text-zinc-600 rounded-lg hover:bg-zinc-50 shadow-sm border border-zinc-200"><ZoomIn size={20} /></button>
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="p-2 bg-white text-zinc-600 rounded-lg hover:bg-zinc-50 shadow-sm border border-zinc-200"><ZoomOut size={20} /></button>
            <button onClick={() => { setPosition({x:0,y:0}); setScale(1); }} className="p-2 bg-white text-zinc-600 rounded-lg hover:bg-zinc-50 shadow-sm border border-zinc-200" title="Reset View"><Maximize size={20} /></button>
            <button onClick={() => setShowGrid(!showGrid)} className={`p-2 rounded-lg shadow-sm border transition-colors ${showGrid ? 'bg-[#0f5c82] text-white border-[#0f5c82]' : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'}`} title="Toggle Grid"><Grid size={20} /></button>
            <button onClick={() => setShowZones(!showZones)} className={`p-2 rounded-lg shadow-sm border transition-colors ${showZones ? 'bg-[#0f5c82] text-white border-[#0f5c82]' : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'}`} title="Toggle Zones"><Layers size={20} /></button>
       </div>

       {drawingMode && (
           <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-4 fade-in">
               <PenTool size={18} className="text-red-400" /> <span>Click and drag to define a zone. Press <b>ESC</b> to cancel.</span>
           </div>
       )}

       <div className={`flex-1 flex items-center justify-center overflow-hidden bg-zinc-100/50 ${drawingMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`} onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            <div ref={mapRef} style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, transition: isDragging.current || drawingMode ? 'none' : 'transform 0.1s ease-out' }} className="relative w-[1000px] h-[600px] bg-white border border-zinc-200 shadow-2xl origin-center">
                {mapImage ? (
                    <>
                        {!imageLoaded && <div className="absolute inset-0 flex items-center justify-center z-10 bg-white"><Loader2 size={32} className="text-blue-500 animate-spin" /></div>}
                        <img src={mapImage} alt="Site Map" className={`w-full h-full object-contain pointer-events-none transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setImageLoaded(true)} />
                    </>
                ) : (
                    <svg className="absolute inset-0 w-full h-full bg-white pointer-events-none" preserveAspectRatio="none">
                        <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1"/></pattern></defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        <g stroke="#334155" strokeWidth="2" fill="none" strokeLinecap="round"><path d="M50,50 L950,50 L950,550 L50,550 Z" strokeWidth="3" /><path d="M300,50 L300,550" strokeDasharray="8,8" strokeOpacity="0.5" /><path d="M600,50 L600,550" strokeDasharray="8,8" strokeOpacity="0.5" /><rect x="50" y="250" width="250" height="300" stroke="#94a3b8" strokeWidth="1" /><rect x="600" y="50" width="350" height="200" stroke="#94a3b8" strokeWidth="1" /></g>
                        <text x="100" y="100" fill="#64748b" className="text-xs font-mono tracking-widest font-bold">ZONE A: STRUCTURAL</text>
                    </svg>
                )}
                {showGrid && <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(#0f5c82 1px, transparent 1px), linear-gradient(90deg, #0f5c82 1px, transparent 1px)', backgroundSize: '50px 50px' }} />}
                {drawingMode && drawStart && currentMousePos && (
                    <div className="absolute border-2 border-red-500 bg-red-500/10 z-50 backdrop-blur-sm" style={{ left: `${Math.min(drawStart.x, currentMousePos.x)}%`, top: `${Math.min(drawStart.y, currentMousePos.y)}%`, width: `${Math.abs(drawStart.x - currentMousePos.x)}%`, height: `${Math.abs(drawStart.y - currentMousePos.y)}%` }} />
                )}
                {showZones && zones.map(zone => (
                    <div key={zone.id} className={`absolute border-2 border-dashed hover:opacity-100 animate-in fade-in zoom-in duration-1000 flex items-center justify-center group/zone cursor-pointer ${zone.type === 'danger' ? 'border-red-500 bg-red-50' : zone.type === 'warning' ? 'border-orange-500 bg-orange-50' : zone.type === 'success' ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'}`} style={{ top: `${zone.top}%`, left: `${zone.left}%`, width: `${zone.width}%`, height: `${zone.height}%`, opacity: 0.6 }}>
                        <div className="flex flex-col items-center">
                            <span className={`text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm px-2 py-1 rounded shadow-sm border ${zone.type === 'danger' ? 'text-red-700 bg-white border-red-200' : zone.type === 'warning' ? 'text-orange-700 bg-white border-orange-200' : zone.type === 'success' ? 'text-green-700 bg-white border-green-200' : 'text-blue-700 bg-white border-blue-200'}`}>{zone.label}</span>
                            {zone.protocol && <div className="hidden group-hover/zone:block absolute top-full mt-2 z-20"><div className="bg-zinc-800 text-white text-xs p-2 rounded-lg shadow-xl max-w-[200px] text-center leading-snug"><div className="font-bold mb-1 border-b border-zinc-600 pb-1">{zone.label} Protocol</div>{zone.protocol}</div><div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 rotate-45"></div></div>}
                        </div>
                    </div>
                ))}
                {users.map(user => (
                    <div key={user.id} className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear ${activeUserId === user.id ? 'z-50' : 'z-20'}`} style={{ left: `${user.lng}%`, top: `${user.lat}%` }} onClick={(e) => { e.stopPropagation(); setActiveUserId(activeUserId === user.id ? null : user.id); }}>
                        <div className="relative group">
                            <div className={`w-4 h-4 rounded-full ${getRoleColor(user.role)} border-2 border-white shadow-md cursor-pointer transition-transform ${activeUserId === user.id ? 'scale-125 ring-4 ring-blue-400/30' : 'group-hover:scale-110'}`} />
                            {user.status === 'Active' && <div className={`absolute inset-0 rounded-full ${getRoleColor(user.role).split(' ')[0]} animate-ping opacity-30`} />}
                            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-white rounded-xl shadow-xl border border-zinc-100 overflow-hidden transition-all origin-bottom duration-200 ${activeUserId === user.id ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0'}`}>
                                <div className="bg-zinc-50 px-4 py-3 border-b border-zinc-100 flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${user.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-zinc-400'}`} />
                                    <div><div className="font-bold text-sm text-zinc-900 leading-none">{user.name}</div><div className="text-[10px] text-zinc-500 font-medium mt-0.5">{user.role}</div></div>
                                </div>
                                <div className="p-3 space-y-2">
                                    <div className="flex justify-between items-center text-xs"><span className="text-zinc-400">Status</span><span className={`font-medium px-2 py-0.5 rounded-full bg-opacity-10 ${user.status === 'Active' ? 'bg-green-500 text-green-700' : 'bg-zinc-500 text-zinc-700'}`}>{user.status}</span></div>
                                    <div className="flex justify-between items-center text-xs"><span className="text-zinc-400">Last Active</span><span className="font-mono text-zinc-700">{user.lastActive}</span></div>
                                    <button className="w-full mt-1 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors">View Profile</button>
                                </div>
                                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-b border-r border-zinc-100"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
       </div>
       <div className="absolute bottom-0 left-0 right-0 p-2 bg-white border-t border-zinc-200 text-[10px] text-zinc-400 font-mono flex justify-between px-6 z-20"><span>Gemini Vision AI Map v2.5</span><span>Coordinates: {Math.round(position.x)}, {Math.round(position.y)} | Zoom: {Math.round(scale * 100)}%</span></div>
    </div>
  );
};

const RealWorldMap = ({ users, getRoleColor }: { users: MapUser[], getRoleColor: (role: string) => string }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{[id: string]: L.Marker}>({});
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, { zoomControl: false, attributionControl: false }).setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapInstanceRef.current);
      L.control.zoom({ position: 'topright' }).addTo(mapInstanceRef.current);
    }
    const map = mapInstanceRef.current;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => { const { latitude, longitude } = position.coords; setCenter([latitude, longitude]); map.setView([latitude, longitude], 18); L.circle([latitude, longitude], { color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, radius: 50 }).addTo(map); },
        (error) => { setLocationError("Using default site location"); const fallback: [number, number] = [40.7128, -74.0060]; setCenter(fallback); map.setView(fallback, 18); },
        { enableHighAccuracy: true }
      );
    } else { setLocationError("Geolocation not supported"); const fallback: [number, number] = [40.7128, -74.0060]; setCenter(fallback); map.setView(fallback, 18); }
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !center) return;
    const map = mapInstanceRef.current;
    Object.keys(markersRef.current).forEach(id => { if (!users.find(u => u.id === id)) { markersRef.current[id].remove(); delete markersRef.current[id]; } });
    users.forEach(user => {
      const latOffset = (user.lat - 50) / 100 * 0.002; 
      const lngOffset = (user.lng - 50) / 100 * 0.002;
      const position: L.LatLngExpression = [center[0] + latOffset, center[1] + lngOffset];
      const roleColorClass = getRoleColor(user.role);
      const createCustomIcon = () => L.divIcon({ className: 'custom-marker-icon', html: `<div class="${roleColorClass} w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all transform hover:scale-125 relative cursor-pointer"><div class="absolute inset-0 rounded-full animate-ping opacity-20 bg-white"></div></div>`, iconSize: [16, 16], iconAnchor: [8, 8], popupAnchor: [0, -10] });
      const popupContent = `<div style="min-width: 180px; font-family: 'Inter', sans-serif; background: white; padding: 2px;"><div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #f4f4f5;"><div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${user.status === 'Active' ? '#22c55e' : '#f59e0b'};"></div><div><div style="font-size: 14px; font-weight: 700;">${user.name}</div><div style="font-size: 10px; color: #71717a;">${user.role}</div></div></div></div>`;
      if (markersRef.current[user.id]) { markersRef.current[user.id].setLatLng(position); markersRef.current[user.id].setPopupContent(popupContent); } else { const marker = L.marker(position, { icon: createCustomIcon() }).addTo(map); marker.bindPopup(popupContent, { closeButton: false, offset: [0, -5], minWidth: 200 }); markersRef.current[user.id] = marker; }
    });
  }, [users, center, getRoleColor]);

  return (
    <div className="w-full h-full relative">
       <div ref={mapContainerRef} className="w-full h-full z-0" />
       {locationError && <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur text-zinc-600 text-xs px-3 py-2 rounded-lg shadow-md z-[400] flex items-center gap-2"><Navigation size={12} className="text-orange-500" />{locationError}</div>}
       {!locationError && center && <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur text-zinc-800 text-xs px-3 py-2 rounded-lg shadow-md z-[400] flex items-center gap-2 font-medium"><Navigation size={12} className="text-blue-500" />GPS Tracking Active</div>}
    </div>
  );
};

const EmptyState = ({ onUpload, onDemo, onLibrary }: { onUpload: () => void, onDemo: () => void, onLibrary: () => void }) => (
    <div className="flex items-center justify-center h-full flex-col text-zinc-500 animate-in fade-in zoom-in duration-300">
        <div className="bg-white p-8 rounded-full mb-6 shadow-sm border border-zinc-100 relative"><FileCode size={64} className="text-zinc-300" strokeWidth={1} /><div className="absolute bottom-2 right-2 bg-red-100 text-red-600 p-2 rounded-full border-2 border-white shadow-sm"><FileText size={16} /></div></div>
        <h3 className="text-xl font-bold text-zinc-800 mb-2">No Virtual Map Generated</h3>
        <p className="max-w-md text-center text-sm mb-8 text-zinc-400 leading-relaxed">Upload a PDF construction drawing or select one from your project library to generate an interactive virtual site map using Gemini Vision AI.</p>
        <div className="flex flex-wrap justify-center gap-4">
             <button onClick={onLibrary} className="px-6 py-3 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-semibold hover:bg-zinc-50 transition-colors flex items-center gap-2"><FolderOpen size={20} /> Select from Library</button>
            <button onClick={onUpload} className="px-8 py-3 bg-[#0f5c82] text-white rounded-xl font-semibold hover:bg-[#0c4a6e] shadow-lg shadow-[#0f5c82]/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"><Upload size={20} /> Upload Drawing (PDF)</button>
            <button onClick={onDemo} className="px-6 py-3 bg-zinc-100 text-zinc-600 rounded-xl font-semibold hover:bg-zinc-200 transition-colors">View Demo Map</button>
        </div>
    </div>
);

export default LiveProjectMapView;