export default function StatusBadge({ status }) {
  const styles = {
    // Priorities
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
    medium: 'bg-amber-100 text-amber-800',
    low: 'bg-blue-100 text-blue-800',
    // Work order statuses
    open: 'bg-emerald-100 text-emerald-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-purple-100 text-purple-800',
    closed: 'bg-slate-200 text-slate-800',
    // Equipment statuses
    operational: 'bg-green-100 text-green-800',
    faulty: 'bg-red-100 text-red-800',
    under_maintenance: 'bg-amber-100 text-amber-800',
  };

  const badgeClass = styles[status] || 'bg-gray-100 text-gray-800';
  const label = status?.replace('_', ' ').toUpperCase() || 'UNKNOWN';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold tracking-wide ${badgeClass}`}>
      {label}
    </span>
  );
}
