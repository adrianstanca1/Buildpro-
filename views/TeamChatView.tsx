import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Hash, Lock, Users, Sparkles, MoreVertical, Phone, Video, Search, Smile } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
  role?: string;
  avatar?: string;
}

interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private';
  unread: number;
}

const TeamChatView: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState('c1');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels: Channel[] = [
    { id: 'c1', name: 'city-centre-plaza', type: 'public', unread: 0 },
    { id: 'c2', name: 'residential-complex', type: 'public', unread: 3 },
    { id: 'c3', name: 'safety-alerts', type: 'public', unread: 0 },
    { id: 'c4', name: 'site-logistics', type: 'public', unread: 0 },
    { id: 'c5', name: 'managers-only', type: 'private', unread: 0 },
  ];

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    'c1': [
      { id: '1', sender: 'Mike Thompson', role: 'Project Manager', text: 'Foundation work is progressing well. Should be done by Friday.', time: '09:30 AM', isMe: false, avatar: 'MT' },
      { id: '2', sender: 'David Chen', role: 'Foreman', text: 'Great! I\'ll schedule the inspection for Saturday morning.', time: '09:45 AM', isMe: false, avatar: 'DC' },
      { id: '3', sender: 'John Anderson', role: 'Admin', text: 'Do we have the concrete delivery confirmed for Phase 2?', time: '10:15 AM', isMe: true, avatar: 'JA' },
    ],
    'c2': [
        { id: '4', sender: 'Sarah Mitchell', role: 'Company Admin', text: 'Updated the blueprints for the east wing.', time: 'Yesterday', isMe: false, avatar: 'SM' }
    ]
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChannel]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'John Anderson',
      role: 'Admin',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      avatar: 'JA'
    };

    setMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMsg]
    }));
    setInputText('');
    
    // Simulate reply
    if (Math.random() > 0.5) {
        setTimeout(() => setIsTyping(true), 1000);
        setTimeout(() => {
            setIsTyping(false);
            const reply: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'David Chen',
                role: 'Foreman',
                text: 'Copy that. I will update the log.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: false,
                avatar: 'DC'
            };
            setMessages(prev => ({
                ...prev,
                [activeChannel]: [...(prev[activeChannel] || []), reply]
            }));
        }, 3000);
    }
  };

  const handleAIDraft = () => {
      setInputText("Based on the recent progress reports, we are on track for the milestone. Please ensure all safety checks are logged by EOD.");
  };

  const currentChannelName = channels.find(c => c.id === activeChannel)?.name;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex-1 bg-white border border-zinc-200 rounded-2xl overflow-hidden flex shadow-xl">
          {/* Channels Sidebar */}
          <div className="w-64 bg-zinc-50 border-r border-zinc-200 flex flex-col">
              <div className="p-4 border-b border-zinc-200">
                  <h2 className="font-bold text-zinc-800 flex items-center gap-2">
                      <Users size={20} className="text-[#0f5c82]" /> Team Chat
                  </h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-6">
                  <div>
                      <h3 className="text-xs font-bold text-zinc-400 uppercase px-3 mb-2">Projects</h3>
                      <div className="space-y-0.5">
                          {channels.filter(c => c.type === 'public').map(c => (
                              <button
                                  key={c.id}
                                  onClick={() => setActiveChannel(c.id)}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                                      activeChannel === c.id 
                                      ? 'bg-white text-[#0f5c82] shadow-sm font-medium' 
                                      : 'text-zinc-600 hover:bg-zinc-200/50'
                                  }`}
                              >
                                  <div className="flex items-center gap-2">
                                      <Hash size={14} className="opacity-50" />
                                      <span className="truncate">{c.name}</span>
                                  </div>
                                  {c.unread > 0 && (
                                      <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{c.unread}</span>
                                  )}
                              </button>
                          ))}
                      </div>
                  </div>

                  <div>
                      <h3 className="text-xs font-bold text-zinc-400 uppercase px-3 mb-2">Direct Messages</h3>
                      <div className="space-y-0.5">
                          {channels.filter(c => c.type === 'private').map(c => (
                              <button
                                  key={c.id}
                                  onClick={() => setActiveChannel(c.id)}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                                      activeChannel === c.id 
                                      ? 'bg-white text-[#0f5c82] shadow-sm font-medium' 
                                      : 'text-zinc-600 hover:bg-zinc-200/50'
                                  }`}
                              >
                                  <div className="flex items-center gap-2">
                                      <Lock size={14} className="opacity-50" />
                                      <span className="truncate">{c.name}</span>
                                  </div>
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
              
              <div className="p-4 border-t border-zinc-200 bg-zinc-100/50">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#0f5c82] rounded-full flex items-center justify-center text-white text-xs font-bold">JA</div>
                      <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-zinc-900 truncate">John Anderson</div>
                          <div className="text-xs text-green-600 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white relative">
              {/* Chat Header */}
              <div className="h-16 border-b border-zinc-100 flex items-center justify-between px-6">
                  <div className="flex items-center gap-2">
                      <Hash size={20} className="text-zinc-400" />
                      <div>
                          <div className="font-bold text-zinc-900">{currentChannelName}</div>
                          <div className="text-xs text-zinc-500">24 members • Topic: General construction updates</div>
                      </div>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-400">
                      <button className="hover:text-[#0f5c82] hover:bg-zinc-50 p-2 rounded-full transition-colors"><Search size={20} /></button>
                      <button className="hover:text-[#0f5c82] hover:bg-zinc-50 p-2 rounded-full transition-colors"><Phone size={20} /></button>
                      <button className="hover:text-[#0f5c82] hover:bg-zinc-50 p-2 rounded-full transition-colors"><Video size={20} /></button>
                      <div className="w-px h-6 bg-zinc-200"></div>
                      <button className="hover:text-zinc-700"><MoreVertical size={20} /></button>
                  </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc]">
                  {(messages[activeChannel] || []).map((msg) => (
                      <div key={msg.id} className={`flex gap-4 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm ${msg.isMe ? 'bg-[#0f5c82]' : 'bg-zinc-400'}`}>
                              {msg.avatar}
                          </div>
                          <div className={`flex flex-col max-w-[60%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                              <div className="flex items-baseline gap-2 mb-1 px-1">
                                  <span className="text-sm font-bold text-zinc-900">{msg.sender}</span>
                                  <span className="text-[10px] text-zinc-400">{msg.time}</span>
                              </div>
                              <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                  msg.isMe 
                                  ? 'bg-[#0f5c82] text-white rounded-tr-sm' 
                                  : 'bg-white border border-zinc-200 text-zinc-700 rounded-tl-sm'
                              }`}>
                                  {msg.text}
                              </div>
                          </div>
                      </div>
                  ))}
                  {isTyping && (
                      <div className="flex gap-4">
                          <div className="w-10 h-10 bg-zinc-400 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">...</div>
                          <div className="bg-white border border-zinc-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                          </div>
                      </div>
                  )}
                  <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-zinc-100">
                  <form onSubmit={handleSendMessage} className="relative flex items-end gap-2 bg-zinc-50 p-2 rounded-2xl border border-zinc-200 focus-within:ring-2 focus-within:ring-[#0f5c82] focus-within:border-transparent transition-all shadow-sm">
                      <button type="button" className="p-3 text-zinc-400 hover:text-[#0f5c82] hover:bg-zinc-100 rounded-xl transition-colors">
                          <Paperclip size={20} />
                      </button>
                      
                      <textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendMessage();
                              }
                          }}
                          placeholder={`Message #${currentChannelName}...`}
                          className="flex-1 bg-transparent border-none focus:ring-0 py-3 px-2 text-zinc-900 placeholder-zinc-400 min-h-[24px] max-h-32 resize-none text-sm"
                          rows={1}
                      />
                      
                      <button 
                          type="button"
                          onClick={handleAIDraft}
                          className="p-2 mr-1 text-[#0f5c82] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold"
                          title="AI Smart Compose"
                      >
                          <Sparkles size={16} /> AI
                      </button>

                      <button type="button" className="p-3 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors">
                          <Smile size={20} />
                      </button>

                      <button 
                          type="submit"
                          disabled={!inputText.trim()}
                          className={`p-3 rounded-xl transition-all duration-200 ${
                              !inputText.trim()
                              ? 'bg-zinc-200 text-zinc-400' 
                              : 'bg-[#0f5c82] text-white hover:bg-[#0c4a6e] shadow-md'
                          }`}
                      >
                          <Send size={18} />
                      </button>
                  </form>
                  <div className="text-center mt-2">
                      <p className="text-[10px] text-zinc-400">
                          <strong>Tip:</strong> Use @Gemini to ask the AI assistant directly in chat.
                      </p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default TeamChatView;