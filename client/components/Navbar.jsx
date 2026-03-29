'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Wrench, Menu } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show navbar on login page
  if (pathname === '/login') return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Work Orders', path: '/work-orders' },
    { name: 'Equipment', path: '/equipment' },
  ];

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">FieldOps</span>
        </Link>
        
        <div className="flex gap-4 sm:gap-8 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path} 
              className={`text-sm font-medium transition-colors ${
                pathname === link.path ? 'text-white border-b-2 border-blue-500 py-5' : 'text-slate-400 hover:text-white py-5'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors ml-2 sm:ml-4 px-3 py-1.5 rounded-lg border border-slate-700"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
