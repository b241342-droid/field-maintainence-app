'use client';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileStack, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  const { data: workOrders = [] } = useQuery({
    queryKey: ['workOrders'],
    queryFn: async () => {
      const res = await api.get('/work-orders');
      return res.data;
    }
  });

  const { data: equipment = [] } = useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      const res = await api.get('/equipment');
      return res.data;
    }
  });

  const openOrders = workOrders.filter(w => w.status === 'open' || w.status === 'in_progress').length;
  const criticalOrders = workOrders.filter(w => w.priority === 'critical').length;
  const resolvedOrders = workOrders.filter(w => w.status === 'resolved' || w.status === 'closed').length;

  const eqStatusCounts = equipment.reduce((acc, eq) => {
    acc[eq.status] = (acc[eq.status] || 0) + 1;
    return acc;
  }, {});
  
  const pieData = [
    { name: 'Operational', value: eqStatusCounts['operational'] || 0 },
    { name: 'Faulty', value: eqStatusCounts['faulty'] || 0 },
    { name: 'Maintenance', value: eqStatusCounts['under_maintenance'] || 0 },
  ];

  const priorityCounts = workOrders.reduce((acc, wo) => {
    acc[wo.priority] = (acc[wo.priority] || 0) + 1;
    return acc;
  }, {});

  const barData = [
    { priority: 'Low', count: priorityCounts['low'] || 0 },
    { priority: 'Medium', count: priorityCounts['medium'] || 0 },
    { priority: 'High', count: priorityCounts['high'] || 0 },
    { priority: 'Critical', count: priorityCounts['critical'] || 0 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Hello {user?.name}, welcome to FieldOps.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border text-slate-800 border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="bg-blue-100 p-4 rounded-xl">
            <FileStack className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Orders</p>
            <p className="text-4xl font-black mt-1">{openOrders}</p>
          </div>
        </div>
        <div className="bg-white border text-slate-800 border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="bg-red-100 p-4 rounded-xl">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Critical Issues</p>
            <p className="text-4xl font-black mt-1">{criticalOrders}</p>
          </div>
        </div>
        <div className="bg-white border text-slate-800 border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="bg-emerald-100 p-4 rounded-xl">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolved</p>
            <p className="text-4xl font-black mt-1">{resolvedOrders}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h3 className="font-semibold text-lg text-slate-800 mb-6 font-display">Equipment Health</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-6">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-sm text-slate-600 font-semibold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></span>
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h3 className="font-semibold text-lg text-slate-800 mb-6 font-display">Priority Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="priority" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
