import React, { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PanelLeft, ChevronLeft, Menu, X, Eye, MessageCircle, Briefcase, 
  BookOpen, FileText, Target, LogOut, Settings
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query'; // Créez ce hook si vous ne l'avez pas
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import logoGIDSBLUE from '@/assets/logoGIDSBLUE.png';

// --- Contexte de la Sidebar ---
type SidebarContextType = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
};
const SidebarContext = createContext<SidebarContextType | null>(null);
const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar doit être utilisé dans un SidebarProvider");
  return context;
};

// --- Items du Menu (pour l'exemple) ---
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Eye, href: '#' },
  { id: 'messages', label: 'Messages', icon: MessageCircle, href: '#', badge: 5 },
  { id: 'projets', label: 'Projets', icon: Briefcase, href: '#' },
  { id: 'formations', label: 'Formations', icon: BookOpen, href: '#' },
  { id: 'documents', label: 'Documents', icon: FileText, href: '#' },
  { id: 'objectifs', label: 'Objectifs', icon: Target, href: '#' }
];

// --- Composants de la Sidebar ---

const SidebarHeader = ({ isCollapsed }) => (
  <div className={cn(
    "flex items-center gap-3 px-4 h-16 border-b border-slate-700/80",
    isCollapsed && "justify-center px-0"
  )}>
    <img src={logoGIDSBLUE} alt="Logo" className="h-8 w-auto flex-shrink-0" />
    <motion.span 
      initial={false}
      animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
      transition={{ duration: 0.2 }}
      className="font-bold text-lg text-white overflow-hidden whitespace-nowrap"
    >
      GIDSBLUE
    </motion.span>
          </div>
);

const SidebarMenuButton = ({ item, isActive }) => {
  const { isCollapsed } = useSidebar();
      return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          asChild
          variant="ghost"
          className={cn(
            "w-full flex justify-start items-center gap-3 h-12 px-4 rounded-lg transition-all duration-300",
            isActive 
              ? "bg-sky-600 text-white font-semibold shadow-lg shadow-sky-600/30" 
              : "text-slate-300 hover:bg-slate-700/50 hover:text-white",
            isCollapsed && "justify-center px-0"
          )}
        >
          <a href={item.href}>
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <motion.span 
              initial={false}
              animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="overflow-hidden whitespace-nowrap"
            >
              {item.label}
            </motion.span>
            {!isCollapsed && item.badge && (
              <span className={cn(
                "ml-auto text-xs font-semibold px-2 py-0.5 rounded-full",
                isActive ? "bg-white/20 text-white" : "bg-sky-500/20 text-sky-300"
              )}>
                {item.badge}
              </span>
            )}
          </a>
        </Button>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
          <p>{item.label}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
};

const SidebarFooter = ({ isCollapsed }) => (
  <div className="mt-auto p-4 border-t border-slate-700/80">
    <div className="flex items-center gap-3">
      <img src="https://ui.shadcn.com/avatars/01.png" alt="User" className="w-10 h-10 rounded-full" />
      <motion.div
        initial={false}
        animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden whitespace-nowrap"
      >
        <p className="text-sm font-semibold text-white">John Doe</p>
        <p className="text-xs text-slate-400">john.doe@email.com</p>
      </motion.div>
      <motion.button 
        initial={false}
        animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 'auto' : 'auto' }}
          className={cn(
          "ml-auto p-2 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white",
          isCollapsed && "hidden" // Cacher le bouton de déconnexion en mode réduit
        )}
      >
        <LogOut size={18} />
      </motion.button>
          </div>
        </div>
);

// --- Le composant Sidebar principal ---
const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      transition={{ type: 'spring', damping: 20, stiffness: 150 }}
      className="relative hidden md:flex flex-col h-screen bg-slate-900 text-white shadow-2xl z-20"
    >
      {/* Bouton pour réduire/développer */}
    <button
      onClick={toggleSidebar}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 bg-slate-800 border-2 border-slate-700 rounded-full flex items-center justify-center text-white hover:bg-sky-600 transition-all duration-300 shadow-lg"
      >
        <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
          <ChevronLeft size={16} />
        </motion.div>
      </button>

      <SidebarHeader isCollapsed={isCollapsed} />
      
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-2">
          {menuItems.map(item => (
            <li key={item.id}>
              <SidebarMenuButton 
                item={item}
                isActive={activeItem === item.id}
              />
            </li>
          ))}
        </ul>
      </nav>

      <SidebarFooter isCollapsed={isCollapsed} />
    </motion.aside>
  );
};

// --- Sidebar Mobile ---
const MobileSidebar = ({ isOpen, setIsOpen }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 left-0 h-full w-64 bg-slate-900 z-50 flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <img src={logoGIDSBLUE} alt="Logo" className="h-8" />
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white">
              <X size={20} />
            </Button>
    </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map(item => (
                <li key={item.id}>
                  <a href={item.href} className="flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white">
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// --- Layout Principal qui utilise la Sidebar ---
export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      <TooltipProvider>
        <div className="flex min-h-screen bg-slate-100">
          {!isMobile && <Sidebar />}
          
          <main className="flex-1 flex flex-col">
            <header className="flex items-center justify-between md:justify-end h-16 px-4 bg-white border-b border-slate-200">
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu size={20} />
                </Button>
              )}
              <div className="flex items-center gap-4">
                 <p className="text-sm">Bonjour, John!</p>
                 <Button variant="ghost" size="icon"><Settings size={20} /></Button>
              </div>
            </header>
            <div className="flex-1 p-6">
              {children || (
                <div>
                  <h1 className="text-2xl font-bold">Contenu Principal</h1>
                  <p>C'est ici que le contenu de votre page s'affichera.</p>
                </div>
              )}
            </div>
          </main>
          
          {isMobile && <MobileSidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}