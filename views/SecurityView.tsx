import React from 'react';

const SecurityView: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
       <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Security</h1>
        <p className="text-zinc-500">Enterprise security, RBAC, data encryption, audit logs</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
           <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <div className="text-green-600 text-3xl font-bold mb-1">A+</div>
              <div className="text-xs text-zinc-500">Security Score</div>
          </div>
           <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <div className="text-zinc-900 text-3xl font-bold mb-1">2FA</div>
              <div className="text-xs text-zinc-500">Multi-Factor Auth</div>
          </div>
           <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <div className="text-zinc-900 text-3xl font-bold mb-1">AES-256</div>
              <div className="text-xs text-zinc-500">Encryption</div>
          </div>
           <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <div className="text-zinc-900 text-3xl font-bold mb-1">1,234</div>
              <div className="text-xs text-zinc-500">Audit Logs (7d)</div>
          </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-zinc-800 mb-6">Role-Based Access Control (RBAC)</h3>
          <table className="w-full text-left text-sm">
              <thead>
                  <tr className="text-zinc-400 border-b border-zinc-100 text-xs uppercase">
                      <th className="pb-3 font-medium">Role</th>
                      <th className="pb-3 font-medium">Projects</th>
                      <th className="pb-3 font-medium">Team</th>
                      <th className="pb-3 font-medium">Financials</th>
                      <th className="pb-3 font-medium">Settings</th>
                  </tr>
              </thead>
              <tbody className="text-zinc-600">
                  <tr className="border-b border-zinc-50">
                      <td className="py-4 font-medium text-zinc-800">Principal Admin</td>
                      <td className="py-4">Full</td>
                      <td className="py-4">Full</td>
                      <td className="py-4">Full</td>
                      <td className="py-4">Full</td>
                  </tr>
                  <tr className="border-b border-zinc-50">
                      <td className="py-4 font-medium text-zinc-800">Company Admin</td>
                      <td className="py-4">Full</td>
                      <td className="py-4">Full</td>
                      <td className="py-4">Read</td>
                      <td className="py-4">Limited</td>
                  </tr>
                  <tr className="border-b border-zinc-50">
                      <td className="py-4 font-medium text-zinc-800">Project Manager</td>
                      <td className="py-4">Assigned</td>
                      <td className="py-4">Assigned</td>
                      <td className="py-4">Read</td>
                      <td className="py-4">None</td>
                  </tr>
                  <tr className="border-b border-zinc-50">
                      <td className="py-4 font-medium text-zinc-800">Foreman</td>
                      <td className="py-4">Assigned</td>
                      <td className="py-4">View</td>
                      <td className="py-4">None</td>
                      <td className="py-4">None</td>
                  </tr>
                  <tr className="border-b border-zinc-50">
                      <td className="py-4 font-medium text-zinc-800">Operative</td>
                      <td className="py-4">View</td>
                      <td className="py-4">None</td>
                      <td className="py-4">None</td>
                      <td className="py-4">None</td>
                  </tr>
              </tbody>
          </table>
          <button className="mt-4 bg-[#1f7d98] text-white px-4 py-2 rounded-md text-xs font-medium hover:bg-[#166ba1]">
              Edit Permissions
          </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-zinc-800 mb-4">Data Governance</h3>
          <div className="text-sm text-zinc-600 space-y-2">
              <p><span className="font-medium text-zinc-800">Compliance:</span> GDPR, data retention policies enforced</p>
              <p><span className="font-medium text-zinc-800">Backups:</span> Automated daily, 30-day retention</p>
              <p><span className="font-medium text-zinc-800">Audit Trail:</span> All changes logged with tamper detection</p>
          </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl p-6">
           <h3 className="font-semibold text-zinc-800 mb-6">Recent Security Events</h3>
           <div className="space-y-4 text-sm">
               <div className="flex justify-between border-b border-zinc-50 pb-2">
                   <span className="text-zinc-600">Login (John Anderson)</span>
                   <span className="text-zinc-400 text-xs">Just now</span>
               </div>
               <div className="flex justify-between border-b border-zinc-50 pb-2">
                   <span className="text-zinc-600">Permission change (Admin)</span>
                   <span className="text-zinc-400 text-xs">2h ago</span>
               </div>
               <div className="flex justify-between border-b border-zinc-50 pb-2">
                   <span className="text-zinc-600">API key generated</span>
                   <span className="text-zinc-400 text-xs">1d ago</span>
               </div>
           </div>
      </div>
    </div>
  );
};

export default SecurityView;