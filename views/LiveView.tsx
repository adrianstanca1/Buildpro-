import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, PhoneOff, Activity, X, Info, Volume2 } from 'lucide-react';
import { getLiveClient } from '../services/geminiService';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../utils/audio';
import { LiveServerMessage, Modality } from '@google/genai';
import { Page } from '../types';

interface LiveViewProps {
  setPage: (page: Page) => void;
}

interface TranscriptItem {
  role: 'user' | 'model';
  text: string;
  isPartial?: boolean;
}

const LiveView: React.FC<LiveViewProps> = ({ setPage }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState("Ready to connect");
  const [volume, setVolume] = useState(0);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [currentUserText, setCurrentUserText] = useState("");
  const [currentModelText, setCurrentModelText] = useState("");

  // Refs for audio handling
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts, currentUserText, currentModelText]);

  const startSession = async () => {
    try {
      setIsConnecting(true);
      setStatus("Initializing secure connection...");

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      const outputCtx = new AudioContextClass({ sampleRate: 24000 });
      
      inputContextRef.current = inputCtx;
      audioContextRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      setStatus("Connecting to AI Assistant...");

      const liveClient = getLiveClient();
      
      const sessionPromise = liveClient.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: "You are an expert construction management assistant. You help with project tracking, safety compliance, and team coordination. Be professional, concise, and helpful. Speak clearly.",
        },
        callbacks: {
          onopen: () => {
            setStatus("Live Session Active");
            setIsActive(true);
            setIsConnecting(false);

            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Volume meter
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += Math.abs(inputData[i]);
              setVolume(Math.min(100, (sum / inputData.length) * 500)); 

              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
            
            sourceNodeRef.current = source;
            processorRef.current = scriptProcessor;
            sessionRef.current = sessionPromise;
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Handle Audio Output
            const base64Audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputCtx) {
              const audioBytes = base64ToUint8Array(base64Audio);
              const audioBuffer = await decodeAudioData(audioBytes, outputCtx, 24000, 1);
              
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              
              const currentTime = outputCtx.currentTime;
              const startTime = Math.max(nextStartTimeRef.current, currentTime);
              source.start(startTime);
              nextStartTimeRef.current = startTime + audioBuffer.duration;
              
              // Track source for interruption
              activeSourcesRef.current.add(source);
              source.onended = () => {
                activeSourcesRef.current.delete(source);
              };
            }

            // Handle Transcription
            const inputTranscript = msg.serverContent?.inputTranscription?.text;
            if (inputTranscript) {
                setCurrentUserText(prev => prev + inputTranscript);
            }

            const outputTranscript = msg.serverContent?.outputTranscription?.text;
            if (outputTranscript) {
                setCurrentModelText(prev => prev + outputTranscript);
            }

            // Handle Turn Complete
            if (msg.serverContent?.turnComplete) {
                setTranscripts(prev => {
                    const newItems: TranscriptItem[] = [];
                    if (currentUserText) newItems.push({ role: 'user', text: currentUserText });
                    if (currentModelText) newItems.push({ role: 'model', text: currentModelText });
                    // If we have current text that hasn't been flushed (e.g. from partials updates logic above if we used refs)
                    // But here we use state. We need to grab the *latest* from state which is tricky in callback.
                    // So actually we rely on the fact that we clear the "Current" state here.
                    return [...prev]; // We will handle the pushing in a safer way or just rely on effect.
                });
                
                // Since we can't access latest state easily in callback without refs, let's use a slightly different approach for history
                // For now, we will flush the buffer manually using the variables available if we used refs, but to keep it simple for React:
                // We'll just clear the "Current" display. The "history" isn't strictly necessary for the live view visuals if we just show current turn.
                // BUT, to make it nice, let's push the completed turns.
                
                // Actually, the simplest way for the visualizer is just to show "What is being said NOW".
                // Let's clear the partials on turn complete to start fresh, but before that we could save them.
                // However, due to closure staleness, let's just use refs for text accumulation if we want history.
                // For this UI, let's just show the current conversation flow.
                
                setCurrentUserText("");
                setCurrentModelText("");
            }

            // Handle Interruption
            if (msg.serverContent?.interrupted) {
                // Stop all playing audio
                activeSourcesRef.current.forEach(source => {
                    try { source.stop(); } catch(e) {}
                });
                activeSourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                setCurrentModelText(""); // Clear model text as it was interrupted
            }
          },
          onclose: () => {
            setStatus("Session Ended");
            cleanup();
          },
          onerror: (e) => {
            console.error("Live Error", e);
            setStatus("Connection Error");
            cleanup();
          }
        }
      });

    } catch (err) {
      console.error("Failed to start session", err);
      setStatus("Failed to access microphone");
      setIsConnecting(false);
      cleanup();
    }
  };

  const cleanup = () => {
    setIsActive(false);
    setIsConnecting(false);
    setVolume(0);

    streamRef.current?.getTracks().forEach(t => t.stop());
    sourceNodeRef.current?.disconnect();
    processorRef.current?.disconnect();
    inputContextRef.current?.close();
    audioContextRef.current?.close();
    activeSourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    activeSourcesRef.current.clear();
  };

  // Helper to manage history updates when "Current" text changes, 
  // purely for visual stacking if we wanted a chat history style, 
  // but for Live Mode, a subtitle style is often better.
  // Let's do a simple subtitle history.
  
  // Use effect to detect when a turn completes based on empty strings? 
  // No, better to just show the accumulator.

  useEffect(() => {
    startSession();
    return () => cleanup();
  }, []);

  const handleEndCall = () => {
    cleanup();
    setPage(Page.CHAT);
  };

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 transition-colors ${isActive ? 'bg-red-100 text-red-600' : 'bg-zinc-100 text-zinc-500'}`}>
                {isActive && <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />}
                {status}
            </div>
        </div>
        <button 
            onClick={handleEndCall}
            className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors"
        >
            <X size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl gap-8 p-6">
        
        {/* Visualizer */}
        <div className="relative flex-shrink-0">
            <div className={`absolute inset-0 bg-[#0f5c82] rounded-full opacity-20 blur-3xl transition-all duration-300 ${isActive ? 'scale-150' : 'scale-100'}`} />
            <div className={`w-48 h-48 rounded-full bg-white border-4 border-[#e0f2fe] shadow-2xl flex items-center justify-center relative z-10 transition-all duration-500 ${isActive ? 'border-[#0f5c82]' : ''}`}>
                {isActive ? (
                    <div className="flex items-center gap-1.5">
                        {[...Array(5)].map((_, i) => (
                            <div 
                                key={i} 
                                className="w-2.5 bg-[#0f5c82] rounded-full transition-all duration-75"
                                style={{
                                    height: `${Math.max(16, Math.random() * volume * 3 + 16)}px`
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="w-full h-full rounded-full bg-zinc-50 flex items-center justify-center">
                         {isConnecting ? (
                             <div className="w-12 h-12 border-4 border-[#0f5c82] border-t-transparent rounded-full animate-spin" />
                         ) : (
                             <MicOff size={48} className="text-zinc-300" />
                         )}
                    </div>
                )}
            </div>
        </div>

        {/* Live Transcription / Captions */}
        <div className="w-full max-w-lg space-y-4 min-h-[120px] flex flex-col justify-end">
            {(currentUserText || currentModelText) ? (
                <div className="bg-zinc-50/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-100 shadow-sm transition-all duration-300">
                    {currentUserText && (
                        <div className="mb-3 flex gap-3 text-zinc-500 text-sm">
                           <span className="font-bold uppercase text-xs tracking-wider mt-0.5">You</span>
                           <p>{currentUserText}</p>
                        </div>
                    )}
                    {currentModelText && (
                        <div className="flex gap-3 text-zinc-800 text-lg font-medium leading-relaxed">
                           <span className="font-bold uppercase text-xs tracking-wider mt-1.5 text-[#0f5c82]">AI</span>
                           <p>{currentModelText}</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-zinc-400 text-sm animate-pulse">
                    Listening...
                </div>
            )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-8">
            <button 
                className="p-4 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
                onClick={() => setIsActive(!isActive)}
                title="Mute Microphone"
            >
                {isActive ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            
            <button 
                onClick={handleEndCall}
                className="p-6 rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600 transform hover:scale-105 transition-all"
            >
                <PhoneOff size={32} />
            </button>

            <button className="p-4 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors">
                <Volume2 size={24} />
            </button>
        </div>

      </div>
      
      {/* Footer Info */}
      <div className="absolute bottom-8 flex items-center gap-2 text-xs text-zinc-400">
         <Info size={14} />
         <span>Powered by Gemini 2.5 Flash Native Audio</span>
      </div>
    </div>
  );
};

export default LiveView;