import React, { useState } from 'react';
import { Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import logo from '@/assets/GIDSBLUE BLUE.png';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { logout } from '@/services/auth';

const userRaw = localStorage.getItem('user');
let user;
try {
  user = userRaw ? JSON.parse(userRaw) : null;
} catch {
  user = null;
}
user = user && typeof user === 'object' ? user : {};
const name = typeof user.name === 'string' && user.name.trim() ? user.name : 'Admin';
const role = typeof user.role === 'string' && user.role.trim() ? user.role : 'Administrateur';
const avatar = typeof user.avatar === 'string' && user.avatar.trim() ? user.avatar : '';

export default function AdminTopbar({ onLogout }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      toast({
        title: 'Déconnexion réussie',
        type: 'success',
      });
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch {
      toast({
        title: 'Erreur lors de la déconnexion',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="w-full h-16 flex items-center justify-between px-4 md:px-8 bg-blue-900 shadow-sm border-b border-blue-950 sticky top-0 z-20 animate-fade-in-down">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="h-10 w-auto mr-2 hidden md:block" />
        <span className="text-xl font-bold text-white tracking-tight">Dashboard Admin</span>
      </div>
      <div className="flex items-center gap-4 relative">
        <button className="relative p-2 rounded-full hover:bg-blue-800 transition" aria-label="Notifications">
          <Bell size={22} className="text-white" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">3</span>
        </button>
        <div className="relative">
          <button onClick={() => setOpen(v => !v)} className="flex items-center gap-2 focus:outline-none">
            <Avatar className="h-10 w-10 border-2 border-blue-200 shadow">
              {avatar ? (
                <AvatarImage src={avatar} alt={name} />
              ) : (
                <AvatarFallback>{name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}</AvatarFallback>
              )}
            </Avatar>
            <ChevronDown className="text-white" size={18} />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-blue-900 rounded-xl shadow-lg border border-blue-800 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-blue-800">
                <div className="font-bold text-white">{name}</div>
                <div className="text-xs text-blue-200">{role}</div>
              </div>
              <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-blue-800 text-white text-sm" onClick={() => {}}>
                <User size={16} /> Profil
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-blue-800 text-white text-sm" onClick={() => {}}>
                <Settings size={16} /> Paramètres
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-blue-800 text-white text-sm border-t border-blue-800 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <LogOut size={16} /> {loading ? 'Déconnexion...' : 'Déconnexion'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 