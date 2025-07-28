import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut, Eye, MessageCircle, Briefcase, BookOpen, FileText, Target, ChevronLeft, ChevronRight, Users, Layers } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '@/assets/logoGIDSBLUE.png';
import { useToast } from '@/components/ui/use-toast';
import { logout, getCachedUser, getUser } from '@/services/auth';

const adminSidebarMenu = [
  { label: "Vue d'ensemble", icon: Eye, href: '/dashboard/overview' },
  { label: 'Sections Hero', icon: Layers, href: '/dashboard/hero-sections' },
  { label: 'Témoignages', icon: MessageCircle, href: '/dashboard/temoignages' },
  { label: 'Services', icon: Briefcase, href: '/dashboard/services' },
  { label: 'Partenaires', icon: Users, href: '/dashboard/partenaires' },
  { label: 'Formations', icon: BookOpen, href: '/dashboard/formations' },
  { label: 'Blogs', icon: FileText, href: '/dashboard/blogs' },
  { label: 'Missions', icon: Target, href: '/dashboard/missions' },
  { label: 'Contacts', icon: User, href: '/dashboard/contacts' },
];

export default function AdminSidebar({ onLogout, collapsed, setCollapsed }) {
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(getCachedUser() || {});
  const navigate = useNavigate();

  // Charger les données utilisateur au montage du composant
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
      }
    };

    // Charger seulement si pas de données en cache
    if (!getCachedUser()) {
      loadUser();
    }
  }, []);

  // Extraire les informations utilisateur
  const prenom = typeof user.prenom === 'string' && user.prenom.trim() ? user.prenom : '';
  const nom = typeof user.nom === 'string' && user.nom.trim() ? user.nom : '';
  const fullName = prenom && nom ? `${prenom} ${nom}` : 'Utilisateur';
  const role = typeof user.role === 'string' && user.role.trim() ? user.role : 'Utilisateur';
  const avatar = typeof user.avatar === 'string' && user.avatar.trim() ? user.avatar : '';

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      toast({
        title: 'Déconnexion réussie',
        variant: 'default',
      });
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch {
      toast({
        title: 'Erreur lors de la déconnexion',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside
      className={`bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 shadow-2xl border-r border-blue-950/60 h-screen flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
        collapsed ? 'w-16' : 'w-64'
      } relative z-10`}
      style={{ 
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
        minWidth: collapsed ? '64px' : '256px',
        maxWidth: collapsed ? '64px' : '256px'
      }}
    >
      {/* Bouton de réduction/agrandissement */}
      <button
        className={`absolute -right-3 top-6 z-20 w-6 h-6 bg-white border border-blue-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 ${
          collapsed ? 'rotate-180' : ''
        }`}
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Agrandir' : 'Réduire'}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-blue-900" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-blue-900" />
        )}
      </button>

      {/* Section utilisateur */}
      <div className={`flex flex-col items-center gap-3 mb-6 transition-all duration-300 ${
        collapsed ? 'px-2' : 'px-4'
      }`}>
        <Avatar className="h-12 w-12 border-2 border-orange-400 shadow-lg bg-white hover:scale-105 transition-transform duration-200">
          {avatar ? (
            <AvatarImage src={avatar} alt={fullName} />
          ) : (
            <AvatarFallback className="text-orange-500 bg-orange-100 text-sm font-semibold">
              {prenom && nom ? `${prenom[0]}${nom[0]}`.toUpperCase() : 'U'}
            </AvatarFallback>
          )}
        </Avatar>
        
        {!collapsed && (
          <div className="text-center w-full">
            <div className="font-bold text-orange-400 text-sm tracking-wide leading-tight truncate">
              {fullName}
            </div>
            <div className="text-xs text-orange-300 font-medium tracking-wider uppercase truncate">
              {role}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent">
        <ul className="flex flex-col gap-1 px-2">
          {adminSidebarMenu.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.label} className="w-full">
                <Link
                  to={item.href}
                  className={`flex items-center w-full ${
                    collapsed ? 'justify-center' : 'gap-3'
                  } px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm cursor-pointer tracking-wide group
                    ${
                      isActive 
                        ? 'bg-white/15 text-white font-semibold shadow-md ring-1 ring-white/20' 
                        : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }
                  `}
                  style={{ minHeight: '44px' }}
                >
                  <item.icon 
                    size={20} 
                    className={`transition-colors duration-200 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-blue-200 group-hover:text-white'
                    }`} 
                  />
                  {!collapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Séparateur */}
      <div className="mx-3 my-4 border-t border-blue-200/20" />

      {/* Bouton de déconnexion */}
      <div className="px-2 pb-4">
        <button
          onClick={handleLogout}
          disabled={loading}
          className={`flex items-center w-full ${
            collapsed ? 'justify-center' : 'gap-2'
          } px-3 py-2.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md border border-red-700/50 ${
            loading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02]'
          }`}
        >
          <LogOut size={18} className="text-white flex-shrink-0" />
          {!collapsed && (
            <span className="truncate">
              {loading ? 'Déconnexion...' : 'Déconnexion'}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
} 