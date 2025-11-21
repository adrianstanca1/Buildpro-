import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Monitor, X, Minus, Square, Power, Search, Grid, 
  Folder, Terminal, Activity, FileText, Globe, 
  Settings, Calculator, Video, Type, 
  MessageSquare, Briefcase, HardHat, Layers, Shield,
  Wand2, Navigation, ChevronLeft, ChevronRight, ArrowUp,
  Save, MoreVertical, RefreshCw, Wifi, Battery, Volume2,
  Calendar as CalendarIcon, Trash2, Plus, Code
} from 'lucide-react';
import { Page } from '../types';
import DevSandboxView from './DevSandboxView';
import MarketplaceView from './MarketplaceView';
import ProjectsView from './ProjectsView';
import TeamView from './TeamView';
import SafetyView from './SafetyView';
import ChatView from './ChatView';
import ImagineView from './ImagineView';
import LiveProjectMapView from './LiveProjectMapView';

interface MyDesktopViewProps {
  installedApps: string[];
  setPage: (page: Page) => void;
}

// --- Window Types ---
interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { w: number; h: number };
  zIndex: number;
}

// --- Virtual File System Types ---
type FileType = 'file' | 'folder';

interface FileNode {
  id: string;
  name: string;
  type: FileType;
  content?: string;
  parentId: string | null;
  children?: string[]; // IDs of children
  created: number;
}

const MyDesktopView: React.FC<MyDesktopViewProps> = ({ installedApps, setPage }) => {
  // --- File System State ---
  const [fileSystem, setFileSystem] = useState<Record<string, FileNode>>({
    'root': { id: 'root', name: 'C:', type: 'folder', parentId: null, children: ['home', 'sys', 'docs'], created: Date.now() },
    'home': { id: 'home', name: 'Users', type: 'folder', parentId: 'root', children: ['admin'], created: Date.now() },
    'admin': { id: 'admin', name: 'Admin', type: 'folder', parentId: 'home', children: ['documents', 'desktop', 'downloads'], created: Date.now() },
    'documents': { id: 'documents', name: 'Documents', type: 'folder', parentId: 'admin', children: ['project_alpha', 'budget_2025'], created: Date.now() },
    'desktop': { id: 'desktop', name: 'Desktop', type: 'folder', parentId: 'admin', children: ['note1'], created: Date.now() },
    'downloads': { id: 'downloads', name: 'Downloads', type: 'folder', parentId: 'admin', children: [], created: Date.now() },
    'sys': { id: 'sys', name: 'System', type: 'folder', parentId: 'root', children: ['logs'], created: Date.now() },
    'logs': { id: 'logs', name: 'Logs', type: 'folder', parentId: 'sys', children: ['boot_log'], created: Date.now() },
    'docs': { id: 'docs', name: 'Documentation', type: 'folder', parentId: 'root', children: ['readme'], created: Date.now() },
    
    // Files
    'project_alpha': { id: 'project_alpha', name: 'Project_Alpha.txt', type: 'file', content: 'Project Alpha Status: ON TRACK\nTimeline: Phase 2 initiated.\nBudget: 85% remaining.', parentId: 'documents', created: Date.now() },
    'budget_2025': { id: 'budget_2025', name: 'Budget_2025.csv', type: 'file', content: 'Category,Amount\nLabor,500000\nMaterials,350000\nOverhead,100000', parentId: 'documents', created: Date.now() },
    'note1': { id: 'note1', name: 'Meeting_Notes.txt', type: 'file', content: '- Review safety protocols\n- Discuss Q4 roadmap\n- Team lunch at 12:30', parentId: 'desktop', created: Date.now() },
    'boot_log': { id: 'boot_log', name: 'boot.log', type: 'file', content: '[SYSTEM] Kernel loaded.\n[SYSTEM] UI Subsystem initialized.\n[SYSTEM] Network connected.', parentId: 'logs', created: Date.now() },
    'readme': { id: 'readme', name: 'README.md', type: 'file', content: '# BuildOS v2.5\nWelcome to the next generation construction OS.', parentId: 'docs', created: Date.now() },
  });

  // --- Desktop State ---
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, show: boolean} | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  
  // Refs
  const dragRef = useRef<{ id: string, startX: number, startY: number, initX: number, initY: number } | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  // --- Helpers ---
  const getPath = (nodeId: string): string => {
    let path = '';
    let current = fileSystem[nodeId];
    while (current && current.parentId) {
      path = '/' + current.name + path;
      current = fileSystem[current.parentId];
    }
    return path || '/';
  };

  const resolvePath = (cwdId: string, pathStr: string): string | null => {
    if (pathStr === '/') return 'root';
    const parts = pathStr.split('/').filter(p => p && p !== '.');
    let currentId = pathStr.startsWith('/') ? 'root' : cwdId;

    for (const part of parts) {
      if (part === '..') {
        const parent = fileSystem[currentId].parentId;
        if (parent) currentId = parent;
      } else {
        const children = fileSystem[currentId].children || [];
        const found = children.find(childId => fileSystem[childId].name === part);
        if (found) currentId = found;
        else return null;
      }
    }
    return currentId;
  };

  const createFile = (parentId: string, name: string, type: FileType, content: string = '') => {
    const newId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNode: FileNode = {
      id: newId,
      name,
      type,
      content: type === 'file' ? content : undefined,
      parentId,
      children: type === 'folder' ? [] : undefined,
      created: Date.now()
    };

    setFileSystem(prev => ({
      ...prev,
      [newId]: newNode,
      [parentId]: {
        ...prev[parentId],
        children: [...(prev[parentId].children || []), newId]
      }
    }));
    return newId;
  };

  const updateFile = (id: string, content: string) => {
    setFileSystem(prev => ({
      ...prev,
      [id]: { ...prev[id], content }
    }));
  };

  const deleteNode = (id: string) => {
    const node = fileSystem[id];
    if (!node || !node.parentId) return;
    
    setFileSystem(prev => {
      const next = { ...prev };
      // Remove from parent's children
      const parent = next[node.parentId!];
      next[node.parentId!] = {
        ...parent,
        children: parent.children?.filter(c => c !== id)
      };
      // Delete node (and simplistic recursive delete)
      delete next[id];
      return next;
    });
  };

  // --- Clock ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Dragging Logic ---
  const handleMouseDown = (e: React.MouseEvent, winId: string) => {
    e.stopPropagation();
    if (desktopRef.current) {
       const win = windows.find(w => w.id === winId);
       if (win && !win.isMaximized) {
         dragRef.current = {
           id: winId,
           startX: e.clientX,
           startY: e.clientY,
           initX: win.position.x,
           initY: win.position.y
         };
       }
       focusWindow(winId);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragRef.current) {
      const { id, startX, startY, initX, initY } = dragRef.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      setWindows(prev => prev.map(w => 
        w.id === id ? { ...w, position: { x: initX + deltaX, y: initY + deltaY } } : w
      ));
    }
  };

  const handleMouseUp = () => {
    dragRef.current = null;
  };

  // --- Window Management ---
  const openApp = (appId: string, title: string, icon: React.ElementType, content: React.ReactNode, defaultWidth = 800, defaultHeight = 600, uniqueId?: string) => {
    setStartMenuOpen(false);
    setContextMenu(null);

    // If app allows single instance or we want to focus existing
    const existingId = uniqueId || appId;
    const existing = windows.find(w => w.id === existingId);
    
    if (existing) {
      setWindows(prev => prev.map(w => w.id === existingId ? { ...w, isMinimized: false, isOpen: true } : w));
      focusWindow(existingId);
      return;
    }

    const newWindow: WindowState = {
      id: existingId,
      appId,
      title,
      icon,
      content,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { x: 50 + (windows.length * 30), y: 50 + (windows.length * 30) },
      size: { w: defaultWidth, h: defaultHeight },
      zIndex: maxZIndex + 1
    };

    setWindows(prev => [...prev, newWindow]);
    setMaxZIndex(prev => prev + 1);
    setActiveWindowId(existingId);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null);
  };

  const toggleMaximize = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w));
    setMaxZIndex(prev => prev + 1);
  };

  // --- Internal Apps Components ---

  const FileExplorer = ({ initialPathId = 'root' }: { initialPathId?: string }) => {
    const [currentPathId, setCurrentPathId] = useState(initialPathId);
    const [history, setHistory] = useState<string[]>([initialPathId]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const currentNode = fileSystem[currentPathId];
    const childrenIds = currentNode?.children || [];
    
    const handleNavigate = (id: string) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(id);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCurrentPathId(id);
    };

    const handleBack = () => {
      if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        setCurrentPathId(history[historyIndex - 1]);
      }
    };

    const handleForward = () => {
      if (historyIndex < history.length - 1) {
        setHistoryIndex(historyIndex + 1);
        setCurrentPathId(history[historyIndex + 1]);
      }
    };

    const handleUp = () => {
      if (currentNode.parentId) {
        handleNavigate(currentNode.parentId);
      }
    };

    const handleItemClick = (id: string) => {
      const item = fileSystem[id];
      if (item.type === 'folder') {
        handleNavigate(id);
      } else {
        // Open File
        openApp('notepad', `Notepad - ${item.name}`, Type, <NotepadApp fileId={id} />, 600, 400, `notepad-${id}`);
      }
    };

    const filteredChildren = childrenIds
      .map(id => fileSystem[id])
      .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      <div className="flex h-full bg-zinc-50 text-zinc-800 flex-col">
        {/* Toolbar */}
        <div className="h-12 bg-white border-b border-zinc-200 flex items-center px-2 gap-2">
           <div className="flex items-center gap-1">
             <button onClick={handleBack} disabled={historyIndex === 0} className="p-1.5 hover:bg-zinc-100 rounded disabled:opacity-30"><ChevronLeft size={16} /></button>
             <button onClick={handleForward} disabled={historyIndex === history.length - 1} className="p-1.5 hover:bg-zinc-100 rounded disabled:opacity-30"><ChevronRight size={16} /></button>
             <button onClick={handleUp} disabled={!currentNode.parentId} className="p-1.5 hover:bg-zinc-100 rounded disabled:opacity-30"><ArrowUp size={16} /></button>
           </div>
           <div className="flex-1 bg-zinc-100 border border-zinc-200 rounded px-3 py-1 text-sm flex items-center gap-2">
              <Folder size={14} className="text-zinc-400" />
              <span className="text-zinc-600">{getPath(currentPathId)}</span>
           </div>
           <div className="w-48 bg-zinc-100 border border-zinc-200 rounded px-2 py-1 flex items-center">
              <Search size={14} className="text-zinc-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent border-none text-sm focus:outline-none w-full"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
           </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
           {/* Sidebar */}
           <div className="w-48 bg-white border-r border-zinc-200 p-2 flex-shrink-0 hidden sm:block">
              <div className="text-xs font-bold text-zinc-400 px-2 py-1 uppercase mb-1">Favorites</div>
              <button onClick={() => handleNavigate('desktop')} className="w-full text-left flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-100 rounded text-sm text-zinc-600">
                 <Monitor size={14} /> Desktop
              </button>
              <button onClick={() => handleNavigate('documents')} className="w-full text-left flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-100 rounded text-sm text-zinc-600">
                 <FileText size={14} /> Documents
              </button>
              <button onClick={() => handleNavigate('downloads')} className="w-full text-left flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-100 rounded text-sm text-zinc-600">
                 <ArrowUp size={14} className="rotate-180" /> Downloads
              </button>
              <button onClick={() => handleNavigate('root')} className="w-full text-left flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-100 rounded text-sm text-zinc-600">
                 <Grid size={14} /> This PC
              </button>
           </div>

           {/* Content */}
           <div className="flex-1 bg-white p-4 overflow-y-auto">
              {filteredChildren.length === 0 ? (
                <div className="text-center text-zinc-400 mt-10">This folder is empty</div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-4">
                   {filteredChildren.map(item => (
                      <div 
                        key={item.id}
                        onDoubleClick={() => handleItemClick(item.id)}
                        className="flex flex-col items-center gap-1 p-2 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded cursor-pointer group text-center"
                      >
                         {item.type === 'folder' ? (
                            <Folder size={40} className="text-yellow-400 drop-shadow-sm" fill="currentColor" />
                         ) : (
                            <FileText size={40} className="text-zinc-400 drop-shadow-sm" />
                         )}
                         <span className="text-xs text-zinc-700 group-hover:text-blue-700 break-words w-full line-clamp-2 leading-tight">
                           {item.name}
                         </span>
                      </div>
                   ))}
                </div>
              )}
           </div>
        </div>
        {/* Status Bar */}
        <div className="h-6 bg-white border-t border-zinc-200 flex items-center px-3 text-xs text-zinc-500">
           {filteredChildren.length} items
        </div>
      </div>
    );
  };

  const TerminalApp = () => {
    const [lines, setLines] = useState<string[]>(['BuildOS v2.5.0', 'Copyright (c) 2025 BuildPro Inc.', '', 'Type "help" for commands.']);
    const [cmd, setCmd] = useState('');
    const [cwdId, setCwdId] = useState('admin'); // Current Working Directory ID
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [lines]);

    const execute = (input: string) => {
      const args = input.trim().split(' ');
      const command = args[0].toLowerCase();
      const output = [];
      
      // Mock Delay for realism
      // setTimeout(() => {}, 10);

      switch (command) {
        case 'help':
           output.push('Available commands:', '  ls - List directory contents', '  cd <path> - Change directory', '  mkdir <name> - Create directory', '  touch <name> - Create file', '  rm <name> - Remove file/directory', '  cat <name> - Display file content', '  whoami - Current user', '  date - Current system time', '  clear - Clear terminal');
           break;
        case 'ls':
           const children = fileSystem[cwdId].children || [];
           const names = children.map(id => {
             const node = fileSystem[id];
             return node.type === 'folder' ? `[${node.name}]` : node.name;
           });
           output.push(names.join('  '));
           break;
        case 'cd':
           if (!args[1]) break;
           const targetId = resolvePath(cwdId, args[1]);
           if (targetId && fileSystem[targetId].type === 'folder') {
             setCwdId(targetId);
           } else {
             output.push(`cd: no such file or directory: ${args[1]}`);
           }
           break;
        case 'mkdir':
           if (args[1]) {
             createFile(cwdId, args[1], 'folder');
             output.push(`Directory created: ${args[1]}`);
           }
           break;
        case 'touch':
           if (args[1]) {
             createFile(cwdId, args[1], 'file');
             output.push(`File created: ${args[1]}`);
           }
           break;
        case 'rm':
           if (args[1]) {
             const targetToDelete = (fileSystem[cwdId].children || []).find(id => fileSystem[id].name === args[1]);
             if (targetToDelete) {
               deleteNode(targetToDelete);
               output.push(`Deleted: ${args[1]}`);
             } else {
               output.push(`rm: cannot remove '${args[1]}': No such file or directory`);
             }
           }
           break;
        case 'cat':
           if (args[1]) {
             const targetFile = (fileSystem[cwdId].children || []).find(id => fileSystem[id].name === args[1]);
             if (targetFile && fileSystem[targetFile].type === 'file') {
                output.push(fileSystem[targetFile].content || '');
             } else {
                output.push(`cat: ${args[1]}: No such file or directory`);
             }
           }
           break;
        case 'whoami':
           output.push('root');
           break;
        case 'date':
           output.push(new Date().toString());
           break;
        case 'clear':
           setLines([]);
           return;
        case '':
           break;
        default:
           output.push(`command not found: ${command}`);
      }
      
      setLines(prev => [...prev, `root@buildos:${getPath(cwdId)}$ ${input}`, ...output]);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      execute(cmd);
      setCmd('');
    };

    return (
      <div className="h-full bg-black text-green-400 font-mono text-sm p-2 overflow-y-auto flex flex-col" onClick={() => document.getElementById('term-input')?.focus()}>
        {lines.map((l, i) => <div key={i} className="whitespace-pre-wrap break-all leading-snug">{l}</div>)}
        <form onSubmit={handleSubmit} className="flex gap-0 mt-1">
          <span className="flex-shrink-0">root@buildos:{getPath(cwdId)}$&nbsp;</span>
          <input 
            id="term-input"
            type="text" 
            value={cmd} 
            onChange={e => setCmd(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-green-400 focus:ring-0 p-0"
            autoFocus
            autoComplete="off"
          />
        </form>
        <div ref={bottomRef} />
      </div>
    );
  };

  const NotepadApp = ({ fileId }: { fileId?: string }) => {
    const [text, setText] = useState('');
    const [currentId, setCurrentId] = useState<string | null>(fileId || null);
    const [status, setStatus] = useState('Ready');

    useEffect(() => {
      if (fileId && fileSystem[fileId]) {
        setText(fileSystem[fileId].content || '');
        setStatus('Loaded');
      }
    }, [fileId]);

    const handleSave = () => {
      if (currentId) {
        updateFile(currentId, text);
        setStatus('Saved ' + new Date().toLocaleTimeString());
      } else {
        // Save as new file in Desktop by default if no ID
        const newId = createFile('desktop', `Untitled_${Date.now()}.txt`, 'file', text);
        setCurrentId(newId);
        setStatus('Saved to Desktop');
      }
    };

    return (
      <div className="flex flex-col h-full bg-white text-zinc-900">
         <div className="h-8 border-b border-zinc-200 flex items-center gap-2 px-2 bg-zinc-50 select-none">
            <button onClick={handleSave} className="flex items-center gap-1 px-2 py-1 hover:bg-zinc-200 rounded text-xs">
               <Save size={12} /> Save
            </button>
            <button className="flex items-center gap-1 px-2 py-1 hover:bg-zinc-200 rounded text-xs">
               <Type size={12} /> Format
            </button>
            <div className="ml-auto text-xs text-zinc-400">{status}</div>
         </div>
         <textarea 
            className="flex-1 p-4 resize-none outline-none border-none font-mono text-sm text-zinc-800"
            value={text}
            onChange={e => { setText(e.target.value); setStatus('Unsaved'); }}
            spellCheck={false}
         />
      </div>
    );
  };

  const BrowserApp = () => {
    const [url, setUrl] = useState('https://en.wikipedia.org/wiki/Construction_management');
    const [inputUrl, setInputUrl] = useState(url);
    const [loading, setLoading] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const navigate = (e: React.FormEvent) => {
       e.preventDefault();
       let target = inputUrl;
       if (!target.startsWith('http')) target = 'https://' + target;
       setUrl(target);
       setLoading(true);
    };

    return (
       <div className="flex flex-col h-full bg-white">
          <div className="h-10 border-b border-zinc-200 flex items-center px-2 gap-2 bg-zinc-50">
             <div className="flex gap-1">
                <button className="p-1.5 hover:bg-zinc-200 rounded text-zinc-600"><ChevronLeft size={16} /></button>
                <button className="p-1.5 hover:bg-zinc-200 rounded text-zinc-600"><ChevronRight size={16} /></button>
                <button onClick={() => { setUrl(inputUrl); setLoading(true); }} className="p-1.5 hover:bg-zinc-200 rounded text-zinc-600"><RefreshCw size={14} /></button>
             </div>
             <form onSubmit={navigate} className="flex-1">
                <input 
                   type="text" 
                   value={inputUrl}
                   onChange={(e) => setInputUrl(e.target.value)}
                   className="w-full h-8 px-3 rounded-full bg-white border border-zinc-300 text-sm focus:ring-2 focus:ring-[#0f5c82] focus:border-transparent focus:outline-none"
                />
             </form>
          </div>
          <div className="flex-1 relative bg-white">
             {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                   <div className="w-6 h-6 border-2 border-[#0f5c82] border-t-transparent rounded-full animate-spin" />
                </div>
             )}
             <iframe 
                ref={iframeRef}
                src={url} 
                className="w-full h-full border-none"
                title="Browser"
                onLoad={() => setLoading(false)}
                sandbox="allow-scripts allow-same-origin allow-forms"
             />
          </div>
       </div>
    );
  };

  const CalculatorApp = () => {
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');

    const handleBtn = (val: string) => {
      if (val === 'C') {
        setDisplay('0');
        setEquation('');
      } else if (val === '=') {
        try {
          // eslint-disable-next-line no-eval
          setDisplay(eval(equation).toString());
          setEquation('');
        } catch {
          setDisplay('Error');
        }
      } else {
        if (display === '0' && !['+', '-', '*', '/'].includes(val)) {
          setDisplay(val);
          setEquation(val);
        } else {
          setDisplay(prev => prev + val);
          setEquation(prev => prev + val);
        }
      }
    };

    return (
      <div className="h-full bg-zinc-900 text-white p-4 flex flex-col">
        <div className="bg-black/30 rounded-lg p-4 mb-4 text-right font-mono text-3xl h-20 flex items-end justify-end overflow-hidden">
          {display}
        </div>
        <div className="grid grid-cols-4 gap-2 flex-1">
          {['7','8','9','/', '4','5','6','*', '1','2','3','-', 'C','0','=','+'].map(btn => (
            <button 
              key={btn} 
              onClick={() => handleBtn(btn)}
              className={`rounded-lg font-bold text-xl transition-colors active:scale-95 ${
                btn === 'C' ? 'bg-red-500 hover:bg-red-600' : 
                ['/','*','-','+','='].includes(btn) ? 'bg-orange-500 hover:bg-orange-600' : 
                'bg-zinc-700 hover:bg-zinc-600'
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const SiteCamsApp = () => {
    return (
      <div className="h-full bg-zinc-900 p-2 grid grid-cols-2 gap-2 overflow-y-auto">
        {[1, 2, 3, 4].map(id => (
          <div key={id} className="relative bg-black rounded-lg overflow-hidden group aspect-video border border-zinc-800">
            <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono text-white bg-black/50 px-1 rounded">CAM-{id.toString().padStart(2,'0')}</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
              <Video size={32} />
            </div>
             {/* Simulated Static Overlay */}
             <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif')] opacity-5 pointer-events-none mix-blend-overlay bg-cover"></div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-xs text-zinc-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
              Rec: 24h • Motion Detected
            </div>
          </div>
        ))}
      </div>
    );
  };

  const SystemMonitor = () => (
    <div className="h-full bg-zinc-950 text-zinc-100 p-6 font-mono overflow-y-auto">
      <h2 className="text-xl font-bold mb-6 border-b border-zinc-800 pb-2 flex items-center gap-2">
          <Activity size={20} className="text-green-500" /> System Resources
      </h2>
      
      <div className="space-y-8">
        <div>
          <div className="flex justify-between mb-1">
            <span>CPU Usage</span>
            <span className="text-blue-400 animate-pulse">14%</span>
          </div>
          <div className="w-full bg-zinc-900 h-4 rounded overflow-hidden border border-zinc-800">
             <div className="h-full bg-blue-500 w-[14%]"></div>
          </div>
          <div className="flex gap-0.5 mt-2 h-12 items-end opacity-50">
             {[20,40,30,50,20,10,15,60,40,30,20,10,5,10,25,30,45,10,5,15].map((h, i) => (
               <div key={i} className="flex-1 bg-blue-500" style={{height: `${h}%`}}></div>
             ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span>Memory</span>
            <span className="text-purple-400">8.2 GB / 16 GB</span>
          </div>
          <div className="w-full bg-zinc-900 h-4 rounded overflow-hidden border border-zinc-800">
             <div className="h-full bg-purple-500 w-[51%]"></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span>Network (Up/Down)</span>
            <span className="text-green-400">45 Mbps / 120 Mbps</span>
          </div>
          <div className="h-24 border border-zinc-800 bg-zinc-900 rounded relative overflow-hidden">
             <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
               <path d="M0,50 Q50,20 100,60 T200,40 T300,80" fill="none" stroke="#4ade80" strokeWidth="1.5" />
               <path d="M0,60 Q50,90 100,40 T200,70 T300,30" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 4" />
             </svg>
          </div>
        </div>
      </div>
    </div>
  );

  // --- App Definitions ---
  const desktopApps = useMemo(() => [
    { id: 'explorer', title: 'File Explorer', icon: Folder, content: <FileExplorer />, width: 800, height: 500 },
    { id: 'browser', title: 'Web Browser', icon: Globe, content: <BrowserApp />, width: 1000, height: 700 },
    { id: 'marketplace', title: 'Marketplace', icon: Grid, content: <MarketplaceView installedApps={installedApps} toggleInstall={() => {}} />, width: 900, height: 600 },
    { id: 'terminal', title: 'Terminal', icon: Terminal, content: <TerminalApp />, width: 600, height: 400 },
    { id: 'monitor', title: 'SysMonitor', icon: Activity, content: <SystemMonitor />, width: 500, height: 450 },
    { id: 'sandbox', title: 'Dev Sandbox', icon: Code, content: <DevSandboxView />, width: 900, height: 700 },
    { id: 'calc', title: 'Calculator', icon: Calculator, content: <CalculatorApp />, width: 320, height: 460 },
    { id: 'notepad', title: 'Notepad', icon: Type, content: <NotepadApp />, width: 500, height: 400 },
    { id: 'cams', title: 'Site Cams', icon: Video, content: <SiteCamsApp />, width: 600, height: 400 },
    { id: 'imagine', title: 'Imagine Studio', icon: Wand2, content: <div className="h-full w-full bg-zinc-950 overflow-hidden"><ImagineView /></div>, width: 1100, height: 750 },
    { id: 'live-map', title: 'Live Map', icon: Navigation, content: <div className="h-full w-full bg-zinc-50 overflow-hidden"><LiveProjectMapView /></div>, width: 1000, height: 700 },
    
    // Main Platform Views as Windows
    { id: 'projects', title: 'Projects', icon: Briefcase, content: <div className="h-full overflow-y-auto bg-zinc-50"><ProjectsView /></div>, width: 1000, height: 700 },
    { id: 'team', title: 'Team Hub', icon: Layers, content: <div className="h-full overflow-y-auto bg-zinc-50"><TeamView /></div>, width: 900, height: 600 },
    { id: 'safety', title: 'Safety Mgr', icon: Shield, content: <div className="h-full overflow-y-auto bg-zinc-50"><SafetyView /></div>, width: 900, height: 600 },
    { id: 'chat', title: 'AI Chat', icon: MessageSquare, content: <ChatView setPage={() => {}} />, width: 500, height: 700 },
  ], [fileSystem, installedApps]); // Re-create if FS changes for new Notepad instances

  const handleIconClick = (app: any) => {
    openApp(app.id, app.title, app.icon, app.content, app.width, app.height);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, show: true });
  };

  const closeContextMenu = () => setContextMenu(null);

  const toggleQuickSettings = () => {
    setShowQuickSettings(!showQuickSettings);
    setShowCalendar(false);
    setStartMenuOpen(false);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    setShowQuickSettings(false);
    setStartMenuOpen(false);
  };

  return (
    <div 
      ref={desktopRef}
      className="absolute inset-0 overflow-hidden flex flex-col select-none"
      style={{ 
        background: 'linear-gradient(135deg, #0f5c82 0%, #0284c7 50%, #e0f2fe 100%)',
        backgroundSize: 'cover'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={closeContextMenu}
      onContextMenu={handleContextMenu}
    >
      {/* Desktop Grid */}
      <div className="flex-1 relative p-6 grid grid-cols-[repeat(auto-fill,100px)] grid-rows-[repeat(auto-fill,100px)] gap-4 content-start">
        {desktopApps.map(app => (
          <div 
            key={app.id}
            onClick={() => handleIconClick(app)}
            className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg hover:bg-white/10 hover:backdrop-blur-sm cursor-pointer transition-all group"
          >
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform text-white border border-white/20 backdrop-blur-sm">
              <app.icon size={32} strokeWidth={1.5} />
            </div>
            <span className="text-white text-xs font-medium drop-shadow-md text-center leading-tight line-clamp-2">
              {app.title}
            </span>
          </div>
        ))}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div 
           style={{ top: contextMenu.y, left: contextMenu.x }}
           className="absolute w-48 bg-white/90 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl py-1 z-[1000] animate-in fade-in zoom-in-95 duration-100"
        >
           <button onClick={() => { createFile('desktop', `New Folder ${Date.now()}`, 'folder'); closeContextMenu(); }} className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-[#0f5c82] hover:text-white flex items-center gap-2">
              <Folder size={14} /> New Folder
           </button>
           <button onClick={() => { openApp('notepad', 'Notepad', Type, <NotepadApp />); closeContextMenu(); }} className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-[#0f5c82] hover:text-white flex items-center gap-2">
              <Type size={14} /> New Text Document
           </button>
           <div className="h-px bg-zinc-200 my-1" />
           <button onClick={() => window.location.reload()} className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-[#0f5c82] hover:text-white flex items-center gap-2">
              <RefreshCw size={14} /> Refresh
           </button>
           <button className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-[#0f5c82] hover:text-white flex items-center gap-2">
              <Settings size={14} /> Personalize
           </button>
        </div>
      )}

      {/* Windows Layer */}
      {windows.map(win => (
        <div
          key={win.id}
          onMouseDown={(e) => handleMouseDown(e, win.id)}
          style={{
            left: win.isMaximized ? 0 : win.position.x,
            top: win.isMaximized ? 0 : win.position.y,
            width: win.isMaximized ? '100%' : win.size.w,
            height: win.isMaximized ? 'calc(100% - 48px)' : win.size.h,
            zIndex: win.zIndex,
            display: win.isMinimized ? 'none' : 'flex',
          }}
          className={`absolute flex flex-col bg-white rounded-lg shadow-2xl overflow-hidden border border-zinc-400/30 transition-all duration-75 ${activeWindowId === win.id ? 'ring-1 ring-[#0f5c82]/50' : 'opacity-95'}`}
        >
          {/* Title Bar */}
          <div className="h-10 bg-zinc-100 border-b border-zinc-200 flex items-center justify-between px-3 flex-shrink-0 select-none" onDoubleClick={() => toggleMaximize(win.id)}>
            <div className="flex items-center gap-2">
              <win.icon size={14} className="text-[#0f5c82]" />
              <span className="text-xs font-semibold text-zinc-700">{win.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }} className="p-1.5 hover:bg-zinc-200 rounded text-zinc-500">
                <Minus size={12} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); toggleMaximize(win.id); }} className="p-1.5 hover:bg-zinc-200 rounded text-zinc-500">
                <Square size={10} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }} className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded text-zinc-500">
                <X size={12} />
              </button>
            </div>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-hidden relative cursor-default" onMouseDown={(e) => e.stopPropagation()}>
             {win.content}
          </div>
        </div>
      ))}

      {/* Start Menu */}
      {startMenuOpen && (
        <div className="absolute bottom-14 left-4 w-80 bg-white/90 backdrop-blur-xl border border-zinc-200/50 rounded-xl shadow-2xl p-4 z-[2000] animate-in slide-in-from-bottom-5">
           <div className="mb-4">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                 <input type="text" placeholder="Search apps..." className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f5c82] focus:border-transparent outline-none" />
              </div>
           </div>
           <div className="grid grid-cols-4 gap-2 mb-4 max-h-64 overflow-y-auto custom-scrollbar">
              {desktopApps.map(app => (
                 <button key={app.id} onClick={() => openApp(app.id, app.title, app.icon, app.content, app.width, app.height)} className="flex flex-col items-center gap-1 p-2 hover:bg-zinc-100 rounded-lg transition-colors group">
                    <div className="p-2 bg-[#0f5c82]/10 rounded-lg text-[#0f5c82] group-hover:bg-[#0f5c82] group-hover:text-white transition-colors"><app.icon size={20} /></div>
                    <span className="text-[10px] text-zinc-600 truncate w-full text-center">{app.title}</span>
                 </button>
              ))}
           </div>
           <div className="border-t border-zinc-200 pt-3 flex justify-between items-center px-2">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-[#0f5c82] rounded-full flex items-center justify-center text-white text-xs font-bold">JA</div>
                 <div className="text-xs">
                    <div className="font-bold text-zinc-800">John Anderson</div>
                    <div className="text-zinc-500">Administrator</div>
                 </div>
              </div>
              <button onClick={() => { setPage(Page.LOGIN); }} className="p-2 hover:bg-zinc-100 rounded text-zinc-500 hover:text-red-600"><Power size={18} /></button>
           </div>
        </div>
      )}

      {/* Calendar Popover */}
      {showCalendar && (
         <div className="absolute bottom-14 right-4 w-80 bg-white/90 backdrop-blur-xl border border-zinc-200/50 rounded-xl shadow-2xl p-6 z-[2000] animate-in slide-in-from-bottom-5">
             <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg">{currentTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                 <div className="flex gap-2">
                    <button className="p-1 hover:bg-zinc-100 rounded"><ChevronLeft size={16} /></button>
                    <button className="p-1 hover:bg-zinc-100 rounded"><ChevronRight size={16} /></button>
                 </div>
             </div>
             <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2 font-medium text-zinc-400">
                {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
             </div>
             <div className="grid grid-cols-7 gap-2 text-center text-sm">
                 {[...Array(30)].map((_, i) => (
                     <button key={i} className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 ${i + 1 === currentTime.getDate() ? 'bg-[#0f5c82] text-white hover:bg-[#0f5c82]' : ''}`}>
                         {i + 1}
                     </button>
                 ))}
             </div>
         </div>
      )}

       {/* Quick Settings Popover */}
      {showQuickSettings && (
         <div className="absolute bottom-14 right-4 w-80 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4 z-[2000] text-white animate-in slide-in-from-bottom-5">
             <div className="grid grid-cols-3 gap-4 mb-6">
                 <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
                    <Wifi size={20} className="text-blue-400" />
                    <span className="text-xs">Wi-Fi</span>
                 </button>
                 <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
                    <Battery size={20} className="text-green-400" />
                    <span className="text-xs">Power</span>
                 </button>
                 <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#0f5c82] hover:bg-[#0c4a6e] transition-colors">
                    <Settings size={20} className="text-white" />
                    <span className="text-xs">Settings</span>
                 </button>
             </div>
             <div className="space-y-4">
                 <div className="flex items-center gap-3">
                     <Volume2 size={16} className="text-zinc-400" />
                     <input type="range" className="flex-1 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-white" />
                 </div>
                 <div className="flex items-center gap-3">
                     <Monitor size={16} className="text-zinc-400" />
                     <input type="range" className="flex-1 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-white" />
                 </div>
             </div>
         </div>
      )}

      {/* Taskbar */}
      <div className="h-12 bg-white/80 backdrop-blur-md border-t border-white/20 flex items-center justify-between px-4 z-[2000] relative">
        <div className="flex items-center gap-2">
           <button 
              onClick={() => { setStartMenuOpen(!startMenuOpen); setShowCalendar(false); setShowQuickSettings(false); }}
              className={`p-2 rounded-lg transition-colors ${startMenuOpen ? 'bg-[#0f5c82] text-white' : 'hover:bg-white/50 text-zinc-800'}`}
           >
              <Grid size={20} />
           </button>
           
           <div className="h-6 w-px bg-zinc-300 mx-2" />
           
           {/* Taskbar Items */}
           <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
             {windows.map(win => (
               <button
                 key={win.id}
                 onClick={() => win.isMinimized ? focusWindow(win.id) : win.id === activeWindowId ? minimizeWindow(win.id) : focusWindow(win.id)}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all max-w-[200px] flex-shrink-0 group ${
                    win.id === activeWindowId 
                    ? 'bg-white shadow-sm text-[#0f5c82]' 
                    : 'hover:bg-white/50 text-zinc-600'
                 } ${win.isMinimized ? 'opacity-50' : 'opacity-100'}`}
               >
                 <win.icon size={16} />
                 <span className="text-xs font-medium truncate hidden sm:block">{win.title}</span>
                 {/* Hover Preview (Simple) */}
                 <div className="absolute bottom-full mb-2 left-0 hidden group-hover:block bg-zinc-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
                    {win.title}
                 </div>
               </button>
             ))}
           </div>
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-3 text-zinc-600 pl-4 border-l border-zinc-300/50 h-full">
           <button onClick={toggleQuickSettings} className={`hidden sm:flex items-center gap-2 px-2 py-1 rounded hover:bg-white/50 ${showQuickSettings ? 'bg-white/50' : ''}`}>
              <Wifi size={14} />
              <Volume2 size={14} />
              <Battery size={14} />
           </button>
           <div 
              onClick={toggleCalendar}
              className={`text-xs font-medium text-right cursor-pointer hover:bg-white/50 px-2 py-1 rounded select-none ${showCalendar ? 'bg-white/50' : ''}`}
            >
              <div>{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              <div className="text-[10px] text-zinc-500">{currentTime.toLocaleDateString()}</div>
           </div>
           <button onClick={() => setWindows(prev => prev.map(w => ({...w, isMinimized: true})))} className="w-1.5 h-8 border-l border-zinc-300 ml-1 hover:bg-zinc-200 rounded-full" title="Show Desktop"></button>
        </div>
      </div>
    </div>
  );
};

export default MyDesktopView;