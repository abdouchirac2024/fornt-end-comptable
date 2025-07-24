import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import ContactsAdmin from './ContactsAdmin';
import FormationsAdmin from './FormationsAdmin';
import CreateFormation from './CreateFormation';

const DashboardAdmin = () => {
  const [active, setActive] = useState(window.location.hash || '#temoignages');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') !== 'true') {
      window.location.href = '/login';
    }
    const onHashChange = () => setActive(window.location.hash || '#temoignages');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const OverviewSection = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center min-h-[200px] animate-fade-in w-full">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Vue d'ensemble</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-700">120</span>
          <span className="text-sm text-blue-900 mt-2">Utilisateurs inscrits</span>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-700">8</span>
          <span className="text-sm text-blue-900 mt-2">Formations actives</span>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-700">32</span>
          <span className="text-sm text-blue-900 mt-2">Témoignages reçus</span>
        </div>
      </div>
      {/* Graphique d'activité */}
      <div className="w-full mt-10">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Activité des 6 derniers mois</h3>
        <div className="flex items-end gap-4 h-32 md:h-40 w-full max-w-xl mx-auto">
          {[30, 45, 60, 50, 80, 70].map((val, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className="bg-blue-400 rounded-t-xl" style={{ height: `${val}%`, width: '32px', minHeight: '16px' }}></div>
              <span className="text-xs text-blue-900 mt-2">{['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'][i]}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Taux de satisfaction */}
      <div className="w-full mt-10 flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-orange-50 rounded-xl p-6 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-orange-500">96%</span>
          <span className="text-sm text-orange-700 mt-2">Taux de satisfaction</span>
        </div>
        {/* Activités récentes */}
        <div className="flex-1 bg-blue-50 rounded-xl p-6">
          <h4 className="font-semibold text-blue-800 mb-2">Activités récentes</h4>
          <ul className="text-blue-900 text-sm space-y-2">
            <li>+ Nouvel utilisateur : <span className="font-bold">Sarah B.</span></li>
            <li>+ Nouveau témoignage reçu</li>
            <li>+ Formation "Audit Interne" complétée</li>
            <li>+ 2 utilisateurs inscrits aujourd'hui</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 w-full">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Résumé</h3>
        <p className="text-blue-900 text-sm">Bienvenue sur votre tableau de bord. Retrouvez ici les statistiques clés de votre activité : nombre d’utilisateurs, formations proposées, et retours clients. Utilisez le menu pour accéder aux différentes sections.</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <AdminSidebar active={active} onLogout={handleLogout} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300`}>
        <AdminTopbar onLogout={handleLogout} />
        <main className="flex-1 min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 p-0 md:p-0 flex flex-col">
          <div className="w-full px-4 md:px-8 py-10 flex flex-col gap-8">
            {active === '#overview' ? (
              <OverviewSection />
            ) : active === '#contacts' ? (
              <ContactsAdmin />
            ) : active === '#formations-create' ? (
              <CreateFormation />
            ) : active === '#formations' ? (
              <FormationsAdmin />
            ) : (
              <>
                <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center justify-center text-3xl font-bold text-blue-900 w-full animate-fade-in mb-2">
                  Bienvenue sur le Dashboard Admin
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                  <SectionCard title="Témoignages" />
                  <SectionCard title="Services" />
                  <SectionCard title="Formations" />
                  <SectionCard title="Blogs" />
                  <SectionCard title="Missions" />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const SectionCard = ({ title }: { title: string }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center text-xl font-semibold text-blue-700 hover:scale-105 hover:shadow-2xl transition-transform cursor-pointer min-h-[120px] animate-fade-in">
    {title}
  </div>
);

export default DashboardAdmin; 