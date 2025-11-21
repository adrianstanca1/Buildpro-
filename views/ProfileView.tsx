import React, { useState, useRef } from 'react';
import { Loader2, Check, Camera, Upload, MapPin, Mail, Phone, Award, Briefcase, Calendar, Star, ShieldCheck, FileText, Plus, Edit2 } from 'lucide-react';

const ProfileView: React.FC = () => {
  // Mock Initial State - would normally come from AuthContext or API
  const [profile, setProfile] = useState({
    fullName: 'John Anderson',
    email: 'john@buildcorp.com',
    phone: '+44 7700 900001',
    role: 'Principal Admin',
    location: 'London, United Kingdom',
    bio: 'Senior Construction Manager with over 20 years of experience in commercial and infrastructure projects. Passionate about safety leadership and digital transformation in construction.',
    avatar: null as string | null,
    skills: ['Strategic Planning', 'Budget Management', 'Stakeholder Relations', 'Contract Negotiation', 'Risk Assessment'],
    certifications: [
        { id: 1, name: 'PMP - Project Management Professional', issuer: 'PMI', date: '2020-05-15', expiry: '2026-05-15', status: 'Valid' },
        { id: 2, name: 'PRINCE2 Practitioner', issuer: 'Axelos', date: '2022-01-10', expiry: '2025-01-10', status: 'Expiring' },
        { id: 3, name: 'NEBOSH Construction Certificate', issuer: 'NEBOSH', date: '2019-08-22', expiry: '2024-08-22', status: 'Expired' }
    ]
  });

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'QUALIFICATIONS' | 'SETTINGS'>('OVERVIEW');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsSaving(false);
      setSuccessMessage('Profile Updated');
      setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Profile Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden mb-8 relative">
          <div className="h-40 bg-gradient-to-r from-[#0f5c82] to-[#1e3a8a]"></div>
          
          <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6 gap-6">
                  <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                      <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg bg-white flex items-center justify-center overflow-hidden text-4xl font-bold text-[#0f5c82]">
                          {profile.avatar ? (
                              <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                              getInitials(profile.fullName)
                          )}
                      </div>
                      <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                          <Camera className="text-white" size={24} />
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>
                  
                  <div className="flex-1">
                      <h1 className="text-3xl font-bold text-zinc-900 mb-1">{profile.fullName}</h1>
                      <div className="flex flex-wrap items-center gap-4 text-zinc-500 text-sm font-medium">
                          <span className="text-[#0f5c82]">{profile.role}</span>
                          <span className="flex items-center gap-1"><MapPin size={14} /> {profile.location}</span>
                          <span className="flex items-center gap-1"><Calendar size={14} /> Joined Jan 2018</span>
                      </div>
                  </div>

                  <div className="flex gap-3">
                      <button className="px-4 py-2 bg-white border border-zinc-300 rounded-lg font-medium text-zinc-700 hover:bg-zinc-50 shadow-sm">
                          Public View
                      </button>
                      <button onClick={handleSave} className="px-6 py-2 bg-[#0f5c82] text-white rounded-lg font-bold hover:bg-[#0c4a6e] shadow-sm flex items-center gap-2">
                          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                          Save Changes
                      </button>
                  </div>
              </div>

              <div className="flex border-b border-zinc-200">
                  <button 
                    onClick={() => setActiveTab('OVERVIEW')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'OVERVIEW' ? 'border-[#0f5c82] text-[#0f5c82]' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
                  >
                      Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab('QUALIFICATIONS')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'QUALIFICATIONS' ? 'border-[#0f5c82] text-[#0f5c82]' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
                  >
                      Qualifications & Skills
                  </button>
                  <button 
                    onClick={() => setActiveTab('SETTINGS')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'SETTINGS' ? 'border-[#0f5c82] text-[#0f5c82]' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
                  >
                      Account Settings
                  </button>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
              
              {activeTab === 'OVERVIEW' && (
                  <>
                      {/* Bio Section */}
                      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                          <div className="flex justify-between items-center mb-4">
                              <h3 className="font-bold text-zinc-900 text-lg">Professional Summary</h3>
                              <button className="text-zinc-400 hover:text-[#0f5c82]"><Edit2 size={16} /></button>
                          </div>
                          <p className="text-zinc-600 leading-relaxed">
                              {profile.bio}
                          </p>
                      </div>

                      {/* Current Stats */}
                      <div className="grid grid-cols-3 gap-4">
                          <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm text-center">
                              <div className="text-3xl font-bold text-[#0f5c82] mb-1">42</div>
                              <div className="text-xs text-zinc-500 uppercase font-bold">Projects Completed</div>
                          </div>
                          <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm text-center">
                              <div className="text-3xl font-bold text-green-600 mb-1">98%</div>
                              <div className="text-xs text-zinc-500 uppercase font-bold">Safety Score</div>
                          </div>
                          <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm text-center">
                              <div className="text-3xl font-bold text-amber-500 mb-1">4.9</div>
                              <div className="text-xs text-zinc-500 uppercase font-bold">Peer Rating</div>
                          </div>
                      </div>

                      {/* Activity Feed Mockup */}
                      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                          <h3 className="font-bold text-zinc-900 text-lg mb-6">Recent Activity</h3>
                          <div className="space-y-6">
                              <div className="flex gap-4">
                                  <div className="flex flex-col items-center">
                                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                      <div className="w-px h-full bg-zinc-200 my-1"></div>
                                  </div>
                                  <div>
                                      <p className="text-sm text-zinc-800 font-medium">Approved Budget for <span className="text-[#0f5c82]">City Plaza Phase 2</span></p>
                                      <p className="text-xs text-zinc-500">2 hours ago</p>
                                  </div>
                              </div>
                              <div className="flex gap-4">
                                  <div className="flex flex-col items-center">
                                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                      <div className="w-px h-full bg-zinc-200 my-1"></div>
                                  </div>
                                  <div>
                                      <p className="text-sm text-zinc-800 font-medium">Uploaded 3 new compliance documents</p>
                                      <p className="text-xs text-zinc-500">Yesterday at 4:30 PM</p>
                                  </div>
                              </div>
                              <div className="flex gap-4">
                                  <div className="flex flex-col items-center">
                                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                  </div>
                                  <div>
                                      <p className="text-sm text-zinc-800 font-medium">Flagged safety concern at <span className="text-[#0f5c82]">Westside Heights</span></p>
                                      <p className="text-xs text-zinc-500">Nov 10, 2025</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </>
              )}

              {activeTab === 'QUALIFICATIONS' && (
                  <>
                      {/* Certifications */}
                      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                          <div className="flex justify-between items-center mb-6">
                              <h3 className="font-bold text-zinc-900 text-lg flex items-center gap-2"><Award className="text-orange-500" /> Certifications & Licenses</h3>
                              <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-sm font-medium text-zinc-700 transition-colors">
                                  <Plus size={16} /> Add New
                              </button>
                          </div>
                          <div className="space-y-4">
                              {profile.certifications.map(cert => (
                                  <div key={cert.id} className="border border-zinc-100 rounded-xl p-4 flex items-center justify-between hover:border-zinc-300 transition-colors group">
                                      <div className="flex items-center gap-4">
                                          <div className="p-3 bg-zinc-50 rounded-lg text-zinc-500 group-hover:text-[#0f5c82] transition-colors">
                                              <ShieldCheck size={24} />
                                          </div>
                                          <div>
                                              <div className="font-bold text-zinc-900">{cert.name}</div>
                                              <div className="text-sm text-zinc-500">{cert.issuer}</div>
                                          </div>
                                      </div>
                                      <div className="text-right">
                                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                              cert.status === 'Valid' ? 'bg-green-100 text-green-700' :
                                              cert.status === 'Expiring' ? 'bg-orange-100 text-orange-700' :
                                              'bg-red-100 text-red-700'
                                          }`}>
                                              {cert.status}
                                          </span>
                                          <div className="text-xs text-zinc-400 mt-1">Expires: {cert.expiry}</div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Skills */}
                      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                          <div className="flex justify-between items-center mb-6">
                              <h3 className="font-bold text-zinc-900 text-lg flex items-center gap-2"><Star className="text-yellow-500" /> Skills & Endorsements</h3>
                              <button className="text-zinc-400 hover:text-[#0f5c82]"><Edit2 size={16} /></button>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-6">
                              {profile.skills.map(skill => (
                                  <div key={skill} className="px-4 py-2 bg-blue-50 text-blue-800 rounded-full text-sm font-medium border border-blue-100 flex items-center gap-2">
                                      {skill}
                                      <span className="bg-blue-200 text-blue-800 text-[10px] px-1.5 py-0.5 rounded-full">12</span>
                                  </div>
                              ))}
                              <button className="px-4 py-2 border border-dashed border-zinc-300 text-zinc-500 rounded-full text-sm hover:border-zinc-400 hover:text-zinc-600">
                                  + Add Skill
                              </button>
                          </div>
                      </div>
                  </>
              )}

              {activeTab === 'SETTINGS' && (
                  <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                      <h3 className="font-bold text-zinc-900 text-lg mb-6">Profile Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
                              <input type="text" value={profile.fullName} readOnly className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-600" />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-zinc-700 mb-1">Job Title</label>
                              <input type="text" value={profile.role} readOnly className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-600" />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
                              <input type="email" value={profile.email} readOnly className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-600" />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-zinc-700 mb-1">Phone Number</label>
                              <input type="text" value={profile.phone} readOnly className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-600" />
                          </div>
                      </div>
                      
                      <div className="border-t border-zinc-100 mt-8 pt-8">
                          <h4 className="font-bold text-red-600 mb-4">Danger Zone</h4>
                          <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50">
                              Deactivate Account
                          </button>
                      </div>
                  </div>
              )}
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-zinc-900 mb-4">Contact Details</h3>
                  <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm">
                          <div className="p-2 bg-zinc-100 rounded-lg text-zinc-500"><Mail size={16} /></div>
                          <div className="flex-1 overflow-hidden">
                              <div className="text-zinc-500 text-xs">Email</div>
                              <div className="font-medium text-zinc-900 truncate">{profile.email}</div>
                          </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                          <div className="p-2 bg-zinc-100 rounded-lg text-zinc-500"><Phone size={16} /></div>
                          <div className="flex-1">
                              <div className="text-zinc-500 text-xs">Mobile</div>
                              <div className="font-medium text-zinc-900">{profile.phone}</div>
                          </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                          <div className="p-2 bg-zinc-100 rounded-lg text-zinc-500"><MapPin size={16} /></div>
                          <div className="flex-1">
                              <div className="text-zinc-500 text-xs">Office</div>
                              <div className="font-medium text-zinc-900">HQ - London</div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Documentation Status */}
              <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-zinc-900 mb-4">Documentation Status</h3>
                  <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                          <span className="text-zinc-600">Right to Work</span>
                          <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-0.5 rounded">VERIFIED</span>
                      </div>
                      <div className="flex justify-between text-sm">
                          <span className="text-zinc-600">Tax Forms</span>
                          <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-0.5 rounded">VERIFIED</span>
                      </div>
                      <div className="flex justify-between text-sm">
                          <span className="text-zinc-600">Background Check</span>
                          <span className="text-orange-600 font-bold text-xs bg-orange-50 px-2 py-0.5 rounded">PENDING</span>
                      </div>
                  </div>
                  <button className="w-full mt-4 py-2 bg-zinc-50 text-zinc-600 border border-zinc-200 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2">
                      <Upload size={14} /> Upload Documents
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ProfileView;