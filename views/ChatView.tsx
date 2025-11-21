
import React, { useState, useRef, useEffect } from 'react';
import { Send, ImagePlus, Loader2, Bot, User, X, Paperclip, Sparkles, Mic, Volume2, Brain, Globe, Map as MapIcon, Zap } from 'lucide-react';
import { Message, Page } from '../types';
import { streamChatResponse, transcribeAudio, generateSpeech, ChatConfig } from '../services/geminiService';

interface ChatViewProps {
  setPage: (page: Page) => void;
}

type ChatMode = 'PRO' | 'THINKING' | 'SEARCH' | 'MAPS' | 'LITE';

const ChatView: React.FC<ChatViewProps> = ({ setPage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'intro',
      role: 'model',
      text: "Hello! I'm Gemini, your advanced BuildPro assistant. I can help with reasoning, analysis, and finding real-time information.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState<ChatMode>('PRO');
  const [groundingMetadata, setGroundingMetadata] = useState<any>(null);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, groundingMetadata]);

  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && 
                    date.getMonth() === now.getMonth() && 
                    date.getFullYear() === now.getFullYear();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Audio Recording Handling
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); 
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(',')[1];
            setIsLoading(true);
            try {
                const transcript = await transcribeAudio(base64Audio, 'audio/webm');
                setInput(prev => prev + " " + transcript);
            } catch (e) {
                console.error("Transcription error", e);
            } finally {
                setIsLoading(false);
            }
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) {
      console.error("Error accessing microphone", e);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    }
  };

  const handlePlayTTS = async (text: string) => {
      try {
          const audioBuffer = await generateSpeech(text);
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);
          source.start(0);
      } catch (e) {
          console.error("TTS play error", e);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: selectedImage || undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const currentImage = selectedImage;
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsLoading(true);
    setGroundingMetadata(null);

    // Placeholder for model response
    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: modelMsgId,
      role: 'model',
      text: currentImage ? 'Analyzing...' : '',
      timestamp: Date.now(),
      isThinking: true
    }]);

    try {
      let fullText = "";
      const mimeType = currentImage ? currentImage.split(';')[0].split(':')[1] : undefined;
      const base64Data = currentImage ? currentImage.split(',')[1] : undefined;

      // Determine Config based on Mode
      const config: ChatConfig = {
          model: 'gemini-3-pro-preview' // Default
      };

      if (mode === 'THINKING') {
          config.model = 'gemini-3-pro-preview';
          config.thinkingBudget = 32768; // Max for Pro
      } else if (mode === 'SEARCH') {
          config.model = 'gemini-2.5-flash';
          config.tools = [{ googleSearch: {} }];
      } else if (mode === 'MAPS') {
          config.model = 'gemini-2.5-flash';
          config.tools = [{ googleMaps: {} }];
      } else if (mode === 'LITE') {
          config.model = 'gemini-2.5-flash-lite';
      }

      const response = await streamChatResponse(
        messages, 
        userMsg.text,
        base64Data,
        mimeType,
        (chunk) => {
           fullText += chunk;
           setMessages(prev => prev.map(m => 
             m.id === modelMsgId 
               ? { ...m, text: fullText, isThinking: false } 
               : m
           ));
        },
        config
      );
      
      // Handle Grounding Metadata (Search/Maps)
      if (response.candidates?.[0]?.groundingMetadata) {
         setGroundingMetadata(response.candidates[0].groundingMetadata);
      }

    } catch (error) {
      setMessages(prev => prev.map(m => 
        m.id === modelMsgId 
          ? { ...m, text: "Sorry, I encountered an error processing your request.", isThinking: false } 
          : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header & Mode Selector */}
      <div className="h-16 border-b border-zinc-200 flex items-center px-6 bg-white sticky top-0 z-10 justify-between shadow-sm">
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm transition-colors ${
                mode === 'THINKING' ? 'bg-purple-600' : mode === 'SEARCH' ? 'bg-blue-600' : mode === 'MAPS' ? 'bg-green-600' : mode === 'LITE' ? 'bg-orange-500' : 'bg-[#0f5c82]'
            }`}>
                {mode === 'THINKING' ? <Brain size={18} /> : mode === 'SEARCH' ? <Globe size={18} /> : mode === 'MAPS' ? <MapIcon size={18} /> : mode === 'LITE' ? <Zap size={18} /> : <Sparkles size={18} />}
            </div>
            <div>
                <h2 className="text-sm font-bold text-zinc-900">Gemini Assistant</h2>
                <div className="text-xs text-zinc-500">
                    {mode === 'THINKING' ? 'Gemini 3.0 Pro (Reasoning)' : mode === 'SEARCH' ? 'Gemini 2.5 Flash (Search)' : mode === 'MAPS' ? 'Gemini 2.5 Flash (Maps)' : mode === 'LITE' ? 'Gemini 2.5 Flash Lite' : 'Gemini 3.0 Pro'}
                </div>
            </div>
        </div>

        {/* Mode Toggles */}
        <div className="flex bg-zinc-100 p-1 rounded-lg">
            <button onClick={() => setMode('PRO')} className={`p-2 rounded-md transition-all ${mode === 'PRO' ? 'bg-white shadow text-[#0f5c82]' : 'text-zinc-400 hover:text-zinc-600'}`} title="Standard Pro">
                <Sparkles size={16} />
            </button>
            <button onClick={() => setMode('THINKING')} className={`p-2 rounded-md transition-all ${mode === 'THINKING' ? 'bg-white shadow text-purple-600' : 'text-zinc-400 hover:text-zinc-600'}`} title="Deep Thinking">
                <Brain size={16} />
            </button>
            <button onClick={() => setMode('SEARCH')} className={`p-2 rounded-md transition-all ${mode === 'SEARCH' ? 'bg-white shadow text-blue-600' : 'text-zinc-400 hover:text-zinc-600'}`} title="Google Search">
                <Globe size={16} />
            </button>
            <button onClick={() => setMode('MAPS')} className={`p-2 rounded-md transition-all ${mode === 'MAPS' ? 'bg-white shadow text-green-600' : 'text-zinc-400 hover:text-zinc-600'}`} title="Google Maps">
                <MapIcon size={16} />
            </button>
             <button onClick={() => setMode('LITE')} className={`p-2 rounded-md transition-all ${mode === 'LITE' ? 'bg-white shadow text-orange-500' : 'text-zinc-400 hover:text-zinc-600'}`} title="Flash Lite">
                <Zap size={16} />
            </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth bg-zinc-50/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 max-w-3xl mx-auto ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
              msg.role === 'user' ? 'bg-white border border-zinc-200 text-[#0f5c82]' : 'bg-[#0f5c82] text-white'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div className={`flex flex-col max-w-[80%] md:max-w-[70%] space-y-2 ${
                msg.role === 'user' ? 'items-end' : 'items-start'
            }`}>
              {msg.image && (
                <div className="relative group rounded-2xl overflow-hidden border border-zinc-200 shadow-md max-w-xs">
                    <img src={msg.image} alt="Upload" className="w-full h-auto object-cover" />
                </div>
              )}
              <div
                className={`px-5 py-3.5 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm relative group ${
                  msg.role === 'user'
                    ? 'bg-white border border-zinc-200 text-zinc-800 rounded-tr-none'
                    : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none'
                }`}
              >
                {msg.role === 'model' && !msg.isThinking && (
                    <button 
                        onClick={() => handlePlayTTS(msg.text)}
                        className="absolute -right-8 top-2 p-1.5 text-zinc-300 hover:text-[#0f5c82] hover:bg-zinc-100 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <Volume2 size={16} />
                    </button>
                )}

                {msg.isThinking ? (
                    <div className="flex items-center gap-3 text-zinc-500">
                        <Loader2 size={16} className="animate-spin text-[#0f5c82]" />
                        <span className="animate-pulse">{mode === 'THINKING' ? 'Reasoning deeply...' : 'Thinking...'}</span>
                    </div>
                ) : (
                    <div className="whitespace-pre-wrap break-words markdown-body">
                      {msg.text}
                    </div>
                )}
              </div>
              <span className="text-[10px] text-zinc-400 px-1 select-none">
                {formatTimestamp(msg.timestamp)}
              </span>
            </div>
          </div>
        ))}
        
        {/* Grounding Metadata Display */}
        {groundingMetadata && (
            <div className="max-w-3xl mx-auto mt-2 p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-600">
                <h4 className="font-bold mb-2 flex items-center gap-2"><Globe size={12} /> Sources & Grounding</h4>
                {/* Search Chunks */}
                {groundingMetadata.groundingChunks?.map((chunk: any, i: number) => (
                    <div key={i} className="mb-1">
                        {chunk.web?.uri && (
                            <a href={chunk.web.uri} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                <span className="truncate max-w-xs">{chunk.web.title || chunk.web.uri}</span>
                            </a>
                        )}
                    </div>
                ))}
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-zinc-200">
        <div className="max-w-3xl mx-auto">
            {selectedImage && (
                <div className="mb-3 flex items-center gap-3 bg-blue-50 p-2.5 rounded-xl border border-blue-100 w-fit animate-in slide-in-from-bottom-2">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-blue-200">
                        <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <button onClick={clearImage} className="p-1.5 hover:bg-blue-100 rounded-full text-blue-500 transition-colors ml-2"><X size={14} /></button>
                </div>
            )}
            
            <form 
                onSubmit={handleSubmit} 
                className={`relative flex items-end gap-2 bg-zinc-50 p-2 rounded-3xl border transition-all shadow-sm ${isLoading ? 'opacity-50 pointer-events-none' : 'border-zinc-200 focus-within:ring-2 focus-within:ring-[#0f5c82] focus-within:border-transparent'}`}
            >
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />
                
                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-zinc-400 hover:text-[#0f5c82] hover:bg-zinc-100 rounded-full transition-colors flex-shrink-0">
                    <Paperclip size={20} />
                </button>

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isRecording ? "Listening..." : selectedImage ? "Ask about this image..." : "Message Gemini..."}
                    className="flex-1 bg-transparent border-none focus:ring-0 py-3 px-2 text-zinc-900 placeholder-zinc-400 min-w-0"
                />
                
                <button 
                    type="button"
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onMouseLeave={stopRecording}
                    className={`p-3 rounded-full flex-shrink-0 transition-colors ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100'}`}
                >
                    <Mic size={20} />
                </button>

                <button 
                    type="submit"
                    disabled={(!input.trim() && !selectedImage) || isLoading}
                    className={`p-3 rounded-full flex-shrink-0 transition-all duration-200 ${(!input.trim() && !selectedImage) || isLoading ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-[#0f5c82] text-white hover:bg-[#0c4a6e] shadow-md'}`}
                >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
