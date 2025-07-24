import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut, Eye, MessageCircle, Briefcase, BookOpen, FileText, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import logo from '@/assets/logoGIDSBLUE.png';

const adminSidebarMenu = [
  { label: "Vue d'ensemble", icon: Eye, href: '#overview' },
  { label: 'Témoignages', icon: MessageCircle, href: '#temoignages' },
  { label: 'Services', icon: Briefcase, href: '#services' },
  { label: 'Formations', icon: BookOpen, href: '#formations' },
  { label: 'Blogs', icon: FileText, href: '#blogs' },
  { label: 'Missions', icon: Target, href: '#missions' },
  { label: 'Contacts', icon: User, href: '#contacts' },
];

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

export default function AdminSidebar({ active, onLogout, collapsed, setCollapsed }) {
  return (
    <aside className={`bg-blue-900 shadow-xl border-r border-blue-950 pt-6 min-h-screen flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} relative`}>
      {/* Bouton de réduction/agrandissement */}
      <button
        className={`absolute -right-3 top-6 z-20 w-7 h-7 bg-white border border-blue-200 rounded-full flex items-center justify-center shadow transition-all duration-300 ${collapsed ? 'rotate-180' : ''}`}
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Agrandir' : 'Réduire'}
      >
        {collapsed ? <ChevronRight className="w-4 h-4 text-blue-900" /> : <ChevronLeft className="w-4 h-4 text-blue-900" />}
      </button>
      <div className={`flex flex-col items-center gap-3 mb-8 transition-all duration-300 ${collapsed ? 'px-0' : 'px-2'}`}>
        <Avatar className="h-16 w-16 border-2 border-orange-400 shadow">
          {avatar ? (
            <AvatarImage src={avatar} alt={name} />
          ) : (
            <AvatarFallback className="text-orange-500 bg-orange-100">{name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}</AvatarFallback>
          )}
        </Avatar>
        {!collapsed && (
        <div className="text-center">
          <div className="font-bold text-orange-500 text-lg">{name}</div>
          <div className="text-xs text-orange-500 font-medium">{role}</div>
        </div>
        )}
      </div>
      <nav className="flex-1 w-full">
        <ul className="flex flex-col gap-2">
          {adminSidebarMenu.map((item) => {
            const isActive = active === item.href;
            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl font-medium transition-all duration-200 text-base shadow-sm cursor-pointer 
                    ${isActive ? 'bg-blue-800 text-white font-bold scale-105' : 'text-white hover:bg-blue-800 hover:text-white'}
                  `}
                  style={{ minHeight: 48 }}
                >
                  <item.icon size={22} className={`transition-colors ${isActive ? 'text-white' : 'text-blue-200 group-hover:text-white'}`} />
                  {!collapsed && <span>{item.label}</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto mb-4 flex flex-col items-center">
        <button
          onClick={onLogout}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow border border-blue-800 ${collapsed ? 'justify-center px-2' : ''}`}
        >
          <LogOut size={18} />
          {!collapsed && 'Déconnexion'}
        </button>
      </div>
    </aside>
  );
} 