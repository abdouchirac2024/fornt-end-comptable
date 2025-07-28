import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, User, LogOut } from 'lucide-react';
import { getCachedUser, getUser, logout } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Topbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadUser = async () => {
      try {
        // D'abord essayer de récupérer depuis le cache
        let userData = getCachedUser();
        
        if (!userData) {
          // Si pas en cache, récupérer depuis l'API
          userData = await getUser();
        }
        
        setUser(userData);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        // Rediriger vers login si pas authentifié
        navigate('/login');
      }
    };

    loadUser();
  }, [navigate]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      toast({
        title: 'Déconnexion réussie',
        description: 'Vous avez été déconnecté avec succès',
        variant: 'default',
      });
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      toast({
        title: 'Erreur lors de la déconnexion',
        description: 'Une erreur est survenue lors de la déconnexion',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = (prenom, nom) => {
    if (!prenom && !nom) return 'U';
    const prenomInitial = prenom ? prenom[0] : '';
    const nomInitial = nom ? nom[0] : '';
    return (prenomInitial + nomInitial).toUpperCase().slice(0, 2);
  };

  return (
    <header className="w-full h-16 flex items-center justify-between px-4 md:px-8 bg-white/80 shadow-sm border-b border-blue-100 sticky top-0 z-20 animate-fade-in-down">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu size={24} />
        </Button>
        <span className="text-xl font-bold text-blue-800 tracking-tight">Dashboard Admin</span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Informations utilisateur */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <div className="text-sm font-semibold text-gray-900">
                {user.prenom && user.nom ? `${user.prenom} ${user.nom}` : 'Utilisateur'}
              </div>
              <div className="text-xs text-gray-600">
                {user.email || 'utilisateur@gidsblue.com'}
              </div>
            </div>
            
            {/* Avatar utilisateur */}
            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-800 border-2 border-blue-300">
              {getUserInitials(user.prenom, user.nom)}
            </div>
            
            {/* Bouton de déconnexion */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              disabled={loading}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50"
              title="Se déconnecter"
            >
              <LogOut size={18} />
            </Button>
          </div>
        )}
        
        {/* Loading state */}
        {!user && (
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
            <User size={16} className="text-gray-400" />
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar; 