import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Play, AlertCircle, CheckCircle, Database, Server, Activity, Code, Cpu, Settings, Zap, Image as ImageIcon, X } from 'lucide-react';
import { runRawPrompt, GenConfig } from '../services/geminiService';

const DevSandboxView: React.FC = () => {
  const [prompt, setPrompt] = useState('Explain the concept of BIM (Building Information Modeling) in one sentence.');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Configuration State
  const [temperature, setTemperature] = useState(1.0);
  const [topP, setTopP] = useState(0.95);
  const [jsonMode, setJsonMode] = useState(false);
  const [systemInstruction, setSystemInstruction] = useState('');
  
  // Image Support
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 19)]);
  };

  useEffect(() => {
    addLog('DevSandbox initialized');
    addLog('Environment: Production');
    addLog('API Connection: Stable');
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
        addLog(`Image loaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunPrompt = async () => {
    if ((!prompt.trim() && !selectedImage) || isLoading) return;
    
    setIsLoading(true);
    addLog(`Sending request to gemini-2.5-flash...`);
    addLog(`Params: Temp=${temperature}, TopP=${topP}, JSON=${jsonMode}`);
    if (systemInstruction) addLog(`System: ${systemInstruction.substring(0, 20)}...`);
    
    setResponse('');
    
    try {
      const start = Date.now();
      
      const config: GenConfig = {
          temperature,
          topP,
          responseMimeType: jsonMode ? 'application/json' : 'text/plain',
          systemInstruction: systemInstruction || undefined
      };

      // Strip base64 prefix if image exists
      const rawImage = selectedImage ? selectedImage.split(',')[1] : undefined;

      const result = await runRawPrompt(prompt, config, rawImage);
      const duration = Date.now() - start;
      
      setResponse(result);
      addLog(`Response received in ${duration}ms`);
      addLog(`Tokens generated: ${Math.ceil(result.length / 4)} (est)`);
    } catch (e) {
      addLog(`Error: ${(e as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJsonModeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setJsonMode(isChecked);
      if (isChecked) {
          setPrompt('List 5 construction safety gear items with their average price in JSON format: { "items": [{ "name": string, "price": number }] }');
      } else {
          setPrompt('Explain the concept of BIM (Building Information Modeling) in one sentence.');
      }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1 flex items-center gap-3">
           <Terminal className="text-[#0f5c82]" /> Developer Sandbox
        </h1>
        <p className="text-zinc-500">System diagnostics, API playground, and multimodal inspection.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Diagnostics & Settings */}
        <div className="space-y-6 flex flex-col overflow-y-auto pr-2">
           {/* Configuration Panel */}
           <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-zinc-800 mb-4 flex items-center gap-2">
                  <Settings size={18} /> Model Configuration
              </h3>
              
              <div className="space-y-6">
                  <div className="space-y-2">
                      <div className="flex justify-between text-xs text-zinc-600">
                          <span>Temperature</span>
                          <span className="font-mono">{temperature}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="2" step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#0f5c82]"
                      />
                  </div>

                  <div className="space-y-2">
                      <div className="flex justify-between text-xs text-zinc-600">
                          <span>Top P</span>
                          <span className="font-mono">{topP}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="1" step="0.05"
                        value={topP}
                        onChange={(e) => setTopP(parseFloat(e.target.value))}
                        className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#0f5c82]"
                      />
                  </div>

                  <div className="space-y-2">
                      <label className="text-xs text-zinc-600 font-medium">System Instructions</label>
                      <textarea 
                          value={systemInstruction}
                          onChange={(e) => setSystemInstruction(e.target.value)}
                          className="w-full p-2 text-xs border border-zinc-200 rounded-md h-20 resize-none focus:ring-1 focus:ring-[#0f5c82] focus:border-[#0f5c82]"
                          placeholder="You are a code reviewer..."
                      />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-zinc-200 rounded-lg bg-zinc-50">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                          <Code size={16} className={jsonMode ? 'text-[#0f5c82]' : 'text-zinc-400'} />
                          JSON Mode
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                          <input 
                            type="checkbox" 
                            name="toggle" 
                            id="toggle" 
                            checked={jsonMode}
                            onChange={handleJsonModeToggle}
                            className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300"
                            style={{ right: jsonMode ? '0' : '50%', transform: jsonMode ? 'translateX(0)' : 'translateX(0)', borderColor: jsonMode ? '#0f5c82' : '#d4d4d8' }}
                          />
                          <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${jsonMode ? 'bg-[#0f5c82]' : 'bg-zinc-300'}`}></label>
                      </div>
                  </div>
              </div>
           </div>

           {/* System Logs */}
           <div className="bg-zinc-900 text-zinc-100 rounded-xl p-4 flex-1 overflow-hidden flex flex-col shadow-sm font-mono text-xs min-h-[200px]">
              <div className="border-b border-zinc-700 pb-2 mb-2 font-bold flex justify-between">
                  <span>SYSTEM LOGS</span>
                  <span className="text-green-400 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/> LIVE</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar">
                  {logs.map((log, i) => (
                      <div key={i} className="break-all border-b border-zinc-800/50 pb-1">
                          <span className="text-zinc-500 mr-2">&gt;</span>
                          {log}
                      </div>
                  ))}
              </div>
           </div>
        </div>

        {/* Right Column: Playground */}
        <div className="lg:col-span-2 flex flex-col bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center">
                <h3 className="font-semibold text-zinc-800 flex items-center gap-2">
                    <Zap size={18} className="text-amber-500" /> Prompt Lab
                </h3>
                <span className="text-xs bg-zinc-200 text-zinc-600 px-2 py-1 rounded font-mono">gemini-2.5-flash</span>
            </div>
            
            <div className="flex-1 p-6 flex flex-col gap-4">
                <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-medium text-zinc-700 flex justify-between items-center">
                        <span>Input Prompt</span>
                        {jsonMode && <span className="text-xs text-[#0f5c82] font-bold">JSON Schema Enforced</span>}
                    </label>
                    
                    <div className="relative flex-1">
                         <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className={`w-full h-full p-4 bg-zinc-50 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-[#0f5c82] focus:border-transparent resize-none transition-colors min-h-[160px] ${jsonMode ? 'border-[#0f5c82] bg-blue-50/20' : 'border-zinc-200'}`}
                            placeholder="Enter your prompt here..."
                        />
                        
                        {/* Image Preview Overlay */}
                        {selectedImage && (
                            <div className="absolute bottom-4 right-4 w-24 h-24 rounded-lg border-2 border-zinc-300 bg-white shadow-lg overflow-hidden group">
                                <img src={selectedImage} alt="Input" className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => { setSelectedImage(null); if(fileInputRef.current) fileInputRef.current.value=''; }}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center border-t border-zinc-100 pt-4">
                    <div className="flex items-center gap-2">
                         <input 
                             type="file" 
                             ref={fileInputRef} 
                             className="hidden" 
                             accept="image/*" 
                             onChange={handleImageSelect} 
                         />
                         <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                         >
                             <ImageIcon size={16} /> {selectedImage ? 'Change Image' : 'Add Image'}
                         </button>
                    </div>

                    <button 
                        onClick={handleRunPrompt}
                        disabled={isLoading}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white transition-all shadow-sm hover:shadow-md active:scale-95 ${isLoading ? 'bg-zinc-400 cursor-not-allowed' : 'bg-[#0f5c82] hover:bg-[#0c4a6e]'}`}
                    >
                        {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Play size={16} />}
                        Execute
                    </button>
                </div>

                <div className="flex-1 flex flex-col gap-2 min-h-[250px]">
                    <label className="text-sm font-medium text-zinc-700">Output</label>
                    <div className="flex-1 bg-zinc-900 rounded-lg p-4 overflow-auto border border-zinc-800 shadow-inner relative group">
                        {response ? (
                            <pre className={`font-mono text-sm whitespace-pre-wrap ${jsonMode ? 'text-amber-300' : 'text-green-400'}`}>{response}</pre>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-2">
                                <Terminal size={32} className="opacity-20" />
                                <span className="text-sm italic opacity-50">Ready for execution...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default DevSandboxView;