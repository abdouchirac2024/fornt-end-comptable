import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="w-full h-16 flex items-center justify-between px-4 md:px-8 bg-white/80 shadow-sm border-b border-blue-100 sticky top-0 z-20 animate-fade-in-down">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu size={24} />
        </Button>
        <span className="text-xl font-bold text-blue-800 tracking-tight">Dashboard Admin</span>
      </div>
      <div className="flex items-center gap-4">
        {/* Placeholder pour le profil admin */}
        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-800">A</div>
      </div>
    </header>
  );
};

export default Topbar; 