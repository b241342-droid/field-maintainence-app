'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import AIAssistant from '@/components/AIAssistant';

export default function NewWorkOrder() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    equipment_id: ''
  });
  const [loading, setLoading] = useState(false);

  const { data: equipment = [] } = useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      const res = await api.get('/equipment');
      return res.data;
    }
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/work-orders', formData);
      router.push('/work-orders');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create order');
      setLoading(false);
    }
  };

  const selectedEquipment = equipment.find(e => e.id == formData.equipment_id);

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/work-orders" className="p-2 hover:bg-slate-200 rounded-full transition-colors bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Raise Work Order</h1>
          <p className="text-slate-500 mt-1">Create a new maintenance request.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border text-slate-800 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2.5 ml-1">Title</label>
              <input 
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                placeholder="E.g., Pump Leakage"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2.5 ml-1">Equipment</label>
              <select 
                name="equipment_id"
                required
                value={formData.equipment_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium appearance-none"
              >
                <option value="">Select Equipment</option>
                {equipment.map(eq => (
                  <option key={eq.id} value={eq.id}>{eq.name} - {eq.location}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2.5 ml-1">Priority</label>
              <select 
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium appearance-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2.5 ml-1">Description</label>
              <textarea 
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium resize-none"
                placeholder="Describe the issue in detail. This information will be used by the AI to suggest a repair plan."
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Submitting...' : 'Submit Work Order'}
            </button>
          </form>
        </div>

        <div className="flex flex-col">
          <AIAssistant 
            description={formData.description} 
            equipmentType={selectedEquipment?.name} 
          />
        </div>
      </div>
    </div>
  );
}
