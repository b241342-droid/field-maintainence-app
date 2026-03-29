import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function WorkOrderCard({ order }) {
  const icons = {
    closed: <CheckCircle className="w-5 h-5 text-slate-500" />,
    resolved: <CheckCircle className="w-5 h-5 text-purple-500" />,
    in_progress: <Clock className="w-5 h-5 text-blue-500" />,
    open: <AlertCircle className="w-5 h-5 text-emerald-500" />
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg line-clamp-1 text-slate-800" title={order.title}>
          {order.title}
        </h3>
        <div className="flex gap-2 shrink-0">
          <StatusBadge status={order.priority} />
          <StatusBadge status={order.status} />
        </div>
      </div>
      <p className="text-sm text-slate-600 mb-5 line-clamp-2 leading-relaxed">
        {order.description}
      </p>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          {icons[order.status]}
          <span>{order.equipment_name || 'General Equipment'}</span>
        </div>
        <div className="text-sm font-medium bg-slate-50 px-3 py-1 rounded-full text-slate-600">
          {order.assigned_name || 'Unassigned'}
        </div>
      </div>
    </div>
  );
}
