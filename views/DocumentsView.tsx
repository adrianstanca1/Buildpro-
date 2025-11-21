import React from 'react';
import { Upload, FileText, Download, Image as ImageIcon, Box } from 'lucide-react';
import { useProjects } from '../contexts/ProjectContext';

const DocumentsView: React.FC = () => {
  const { documents } = useProjects();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Documents</h1>
        <p className="text-zinc-500">Manage all project documents and files</p>
        <button className="mt-4 flex items-center gap-2 bg-[#1f7d98] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#166ba1]">
            <Upload size={16} /> Upload
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['All', 'Plans', 'Permits', 'Invoices', 'Reports', 'Image'].map((tag, i) => (
              <button key={tag} className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${i === 0 ? 'bg-[#0f5c82] text-white border-[#0f5c82]' : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}>
                  {tag}
              </button>
          ))}
      </div>

      <div className="space-y-3">
          {documents.map((doc, i) => (
              <div key={i} className="bg-white border border-zinc-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-500">
                          {doc.type === 'Image' ? <ImageIcon size={20} /> : 
                           doc.type === 'CAD' ? <Box size={20} /> :
                           <FileText size={20} />}
                      </div>
                      <div>
                          <h4 className="text-sm font-semibold text-zinc-900">{doc.name}</h4>
                          <div className="text-xs text-zinc-500 flex items-center gap-2">
                              <span>{doc.projectName}</span>
                              <span>•</span>
                              <span>{doc.type}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span>{doc.date}</span>
                          </div>
                      </div>
                  </div>
                  <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                          doc.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                          doc.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 
                          'bg-zinc-100 text-zinc-600'
                      }`}>{doc.status}</span>
                      <button className="p-2 hover:bg-zinc-100 rounded text-zinc-400 hover:text-[#0f5c82]">
                          <Download size={18} />
                      </button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default DocumentsView;