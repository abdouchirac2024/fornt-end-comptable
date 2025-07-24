import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// Assurez-vous que le chemin vers votre logo est correct
import logoGIDSBLUE from '@/assets/GIDSBLUE BLUE.png'; 

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [language, setLanguage] = useState('FR');
  const location = useLocation();
  const navigate = useNavigate();

  // Gère l'effet d'apparition de la bordure au scroll
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/about' },
    { name: 'Formations', path: '/formations' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
    { name: 'Blog', path: '/blog' },
  ];

  const isActive = (path) => location.pathname === path;

  // Fonction pour changer la langue
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    // Ici, vous pourriez ajouter la logique pour i18n
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        hasScrolled ? 'bg-slate-900/80 backdrop-blur-lg border-b border-slate-300/10' : 'bg-transparent'
      }`}
      aria-label="Navigation principale"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" aria-label="GIDSBLUE - Accueil">
            <img 
              src={logoGIDSBLUE} 
              alt="Logo GIDSBLUE" 
              className="h-20 w-auto" // Taille augmentée pour plus de visibilité
            />
          </Link>

          {/* Menu de navigation Desktop */}
          <nav className="hidden lg:flex lg:items-center lg:space-x-2">
            {menuItems.map((item) => (
              item.name === 'À propos' ? (
                <a
                  key={item.name}
                  href="#about"
                  onClick={handleAboutClick}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    isActive('/')
                      ? 'text-white bg-slate-700/50 font-semibold'
                      : 'text-slate-200 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    isActive(item.path)
                      ? 'text-white bg-slate-700/50 font-semibold'
                      : 'text-slate-200 hover:text-white hover:bg-slate-700/50'
                  }`}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              )
            ))}
          </nav>

          {/* Actions à droite (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-slate-200 hover:bg-slate-700/50 hover:text-white">
                  <Globe size={16} />
                  <span>{language}</span>
                  <ChevronDown size={16} className="opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700 text-slate-200">
                <DropdownMenuItem onClick={() => handleLanguageChange('FR')} className="focus:bg-sky-500/50 focus:text-white">
                  <span className="mr-2">🇫🇷</span> Français
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('EN')} className="focus:bg-sky-500/50 focus:text-white">
                  <span className="mr-2">🇬🇧</span> English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild className="bg-sky-500 text-white font-bold hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20">
              <Link to="/devis">Demande de Devis</Link>
            </Button>
          </div>

          {/* Bouton du menu mobile */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-slate-200 hover:text-white hover:bg-slate-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Fermer le menu principal' : 'Ouvrir le menu principal'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      <div 
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-slate-900/95 backdrop-blur-lg border-t border-slate-300/10">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                isActive(item.path)
                  ? 'bg-sky-500 text-white'
                  : 'text-slate-200 hover:bg-slate-700 hover:text-white'
              }`}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              {item.name}
            </Link>
          ))}
          <div className="border-t border-slate-700 mt-4 pt-4 space-y-4">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2 text-slate-200 border-slate-600 bg-slate-800 hover:bg-slate-700 hover:text-white">
                  <Globe size={16} />
                  <span>Changer la langue ({language})</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-slate-200">
                <DropdownMenuItem onClick={() => {handleLanguageChange('FR'); setIsMobileMenuOpen(false);}} className="focus:bg-sky-500/50 focus:text-white">
                  <span className="mr-2">🇫🇷</span> Français
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {handleLanguageChange('EN'); setIsMobileMenuOpen(false);}} className="focus:bg-sky-500/50 focus:text-white">
                  <span className="mr-2">🇬🇧</span> English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild size="lg" className="w-full bg-sky-500 text-white font-bold hover:bg-sky-600">
              <Link to="/devis" onClick={() => setIsMobileMenuOpen(false)}>Demande de Devis</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;