'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';

export default function Equipment() {
  const { data: equipment = [], isLoading } = useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      const res = await api.get('/equipment');
      return res.data;
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Equipment Directory</h1>
        <p className="text-slate-500 mt-1">Overview of all active and inactive field assets.</p>
      </div>

      <div className="bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs font-bold tracking-wider uppercase">
                <th className="p-5 pl-6">Name</th>
                <th className="p-5">Location</th>
                <th className="p-5">Status</th>
                <th className="p-5 pr-6">Last Serviced</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-400">Loading equipment...</td>
                </tr>
              ) : equipment.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-slate-500">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <span className="text-2xl">🚜</span>
                    </div>
                    No equipment records found.
                  </td>
                </tr>
              ) : (
                equipment.map(eq => (
                  <tr key={eq.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-5 pl-6 font-semibold text-slate-800">{eq.name}</td>
                    <td className="p-5 text-slate-600 font-medium">{eq.location}</td>
                    <td className="p-5"><StatusBadge status={eq.status} /></td>
                    <td className="p-5 pr-6 text-slate-500 font-medium">
                      {eq.last_serviced ? new Date(eq.last_serviced).toLocaleDateString() : 'Never'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
