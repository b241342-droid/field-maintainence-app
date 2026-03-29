'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import api from '@/lib/api';
import WorkOrderCard from '@/components/WorkOrderCard';
import RoleGuard from '@/components/RoleGuard';

export default function WorkOrders() {
  const [filter, setFilter] = useState('all');

  const { data: workOrders = [], isLoading } = useQuery({
    queryKey: ['workOrders'],
    queryFn: async () => {
      const res = await api.get('/work-orders');
      return res.data;
    }
  });

  const filteredOrders = workOrders.filter(wo => {
    if (filter === 'all') return true;
    return wo.status === filter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Work Orders</h1>
          <p className="text-slate-500 mt-1">Manage all your maintenance tasks.</p>
        </div>
        <RoleGuard allowedRoles={['admin', 'supervisor']}>
          <Link 
            href="/work-orders/new" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>New Order</span>
          </Link>
        </RoleGuard>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        {['all', 'open', 'in_progress', 'resolved', 'closed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === f ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f === 'all' ? 'All Orders' : f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 h-40 animate-pulse">
               <div className="h-6 bg-slate-200 rounded w-2/3 mb-4"></div>
               <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
               <div className="h-4 bg-slate-200 rounded w-4/5"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(order => (
            <WorkOrderCard key={order.id} order={order} />
          ))}
          {filteredOrders.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-500 bg-white border border-slate-200 rounded-3xl border-dashed">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="font-semibold text-lg text-slate-800 mb-1">No orders found</h3>
              <p>There are no work orders matching this status.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
