import React, { useState, useEffect } from 'react';
import { 
  Users, Eye, TrendingUp, Globe, Clock, MapPin, 
  BarChart3, Activity, RefreshCw, Calendar, 
  ArrowUpRight, ArrowDownRight, Loader2,
  Monitor, Smartphone, Tablet, Globe2
} from 'lucide-react';
import { 
  getAnalytics, 
  getRealTimeStats, 
  getUniqueVisitors, 
  AnalyticsData,
  Visitor 
} from '@/services/analytics';

// Hook pour les toasts
const useToast = () => {
  const [toasts, setToasts] = useState<Array<{id: number, title: React.ReactNode, type: 'success' | 'error' | 'info'}>>([]);

  const toast = ({ title, type = 'info' }: { title: React.ReactNode, type?: 'success' | 'error' | 'info' }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`max-w-sm p-4 rounded-xl shadow-lg border animate-slide-in-right ${
            toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          {toast.title}
        </div>
      ))}
    </div>
  );

  return { toast, ToastContainer };
};

// Composant de carte statistique
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue', 
  change, 
  changeType = 'neutral' 
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
}) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${
            changeType === 'up' ? 'text-green-600' : 
            changeType === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {changeType === 'up' && <ArrowUpRight className="w-4 h-4" />}
            {changeType === 'down' && <ArrowDownRight className="w-4 h-4" />}
            <span>{change}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl bg-${color}-100`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
    </div>
  </div>
);

// Composant de graphique simple
const SimpleChart = ({ data, title }: { data: Array<{ label: string; value: number }>; title: string }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{item.label}</span>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((item.value / Math.max(...data.map(d => d.value))) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Composant de liste des visiteurs récents
const RecentVisitors = ({ visitors }: { visitors: Visitor[] }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Visiteurs récents</h3>
    <div className="space-y-3">
      {visitors.slice(0, 5).map((visitor) => (
        <div key={visitor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Globe2 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{visitor.ip_address}</p>
              <p className="text-xs text-gray-500">{visitor.page_visited}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">
              {new Date(visitor.created_at).toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
            {visitor.country && (
              <p className="text-xs text-gray-400">{visitor.country}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Composant principal
const Overview = () => {
  const { toast, ToastContainer } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [realTimeStats, setRealTimeStats] = useState<{
    active_visitors: number;
    visitors_last_hour: number;
    top_current_pages: Array<{ page: string; views: number }>;
  } | null>(null);
  const [uniqueVisitors, setUniqueVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchData();
    // Actualiser les données toutes les 30 secondes
    const interval = setInterval(fetchRealTimeData, 30000);
    return () => clearInterval(interval);
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsData, realTimeData, visitorsData] = await Promise.all([
        getAnalytics(period),
        getRealTimeStats(),
        getUniqueVisitors()
      ]);
      
      setAnalytics(analyticsData);
      setRealTimeStats(realTimeData);
      setUniqueVisitors(visitorsData);
    } catch (error) {
      toast({ 
        title: 'Erreur lors du chargement des analytics', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeData = async () => {
    try {
      const realTimeData = await getRealTimeStats();
      setRealTimeStats(realTimeData);
    } catch (error: unknown) {
      console.error('Erreur lors de la mise à jour temps réel:', error);
    }
  };

  const handleRefresh = () => {
    fetchData();
    toast({ 
      title: 'Données actualisées', 
      type: 'success' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Analytics & Statistiques</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
              </select>
              <button 
                onClick={handleRefresh}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                title="Actualiser"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Visiteurs uniques"
            value={analytics?.unique_visitors || 0}
            icon={Users}
            color="blue"
            change="+12%"
            changeType="up"
          />
          <StatCard
            title="Pages vues"
            value={analytics?.page_views || 0}
            icon={Eye}
            color="green"
            change="+8%"
            changeType="up"
          />
          <StatCard
            title="Visiteurs aujourd'hui"
            value={analytics?.visitors_today || 0}
            icon={Activity}
            color="purple"
            change="+5%"
            changeType="up"
          />
          <StatCard
            title="Visiteurs actifs"
            value={realTimeStats?.active_visitors || 0}
            icon={TrendingUp}
            color="orange"
          />
        </div>

        {/* Graphiques et détails */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Graphique des pages populaires */}
          <div className="lg:col-span-2">
            <SimpleChart
              title="Pages les plus visitées"
              data={analytics?.top_pages.map(page => ({
                label: page.page,
                value: page.views
              })) || []}
            />
          </div>

          {/* Visiteurs par pays */}
          <div>
            <SimpleChart
              title="Visiteurs par pays"
              data={analytics?.visitors_by_country.map(country => ({
                label: country.country,
                value: country.count
              })) || []}
            />
          </div>
        </div>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Visiteurs récents */}
          <RecentVisitors visitors={uniqueVisitors} />

          {/* Statistiques temps réel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Temps réel</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Visiteurs actifs</span>
                </div>
                <span className="text-lg font-bold text-green-900">{realTimeStats?.active_visitors || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Dernière heure</span>
                </div>
                <span className="text-lg font-bold text-blue-900">{realTimeStats?.visitors_last_hour || 0}</span>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Pages populaires maintenant</h4>
                {realTimeStats?.top_current_pages?.slice(0, 3).map((page: { page: string; views: number }, index: number) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 truncate">{page.page}</span>
                    <span className="font-medium text-gray-900">{page.views}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations techniques</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Monitor className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Suivi par IP unique</p>
              <p className="text-lg font-bold text-gray-900">Anti-doublon</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Géolocalisation</p>
              <p className="text-lg font-bold text-gray-900">Pays/Ville</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Mise à jour</p>
              <p className="text-lg font-bold text-gray-900">Temps réel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview; 