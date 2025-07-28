// Service pour l'API analytics
import { API_BASE_URL } from '@/config/api';

export type Visitor = {
  id: number;
  ip_address: string;
  user_agent?: string;
  page_visited: string;
  country?: string;
  city?: string;
  created_at: string;
  updated_at: string;
};

export type AnalyticsData = {
  total_visitors: number;
  unique_visitors: number;
  page_views: number;
  visitors_today: number;
  visitors_this_week: number;
  visitors_this_month: number;
  top_pages: Array<{
    page: string;
    views: number;
  }>;
  visitors_by_country: Array<{
    country: string;
    count: number;
  }>;
  daily_visitors: Array<{
    date: string;
    visitors: number;
  }>;
};

// Enregistrer une visite
export async function trackVisit(data: { 
  ip_address: string; 
  user_agent?: string; 
  page_visited: string;
  country?: string;
  city?: string;
}): Promise<Visitor> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error("Erreur lors de l'enregistrement de la visite");
    }
    
    const res = await response.json();
    return res?.data;
  } catch (error) {
    // En mode démonstration, on simule juste l'enregistrement
    console.warn('API tracking non disponible, simulation de l\'enregistrement');
    return {
      id: Date.now(),
      ip_address: data.ip_address,
      user_agent: data.user_agent,
      page_visited: data.page_visited,
      country: data.country,
      city: data.city,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}

// Récupérer les statistiques d'analytics
export async function getAnalytics(period: 'today' | 'week' | 'month' | 'year' = 'month'): Promise<AnalyticsData> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/stats?period=${period}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des analytics");
    }
    
    const res = await response.json();
    return res?.data;
  } catch (error) {
    // Retourner des données de démonstration si l'API n'est pas disponible
    console.warn('API analytics non disponible, utilisation des données de démonstration');
    return generateMockAnalyticsData(period);
  }
}

// Récupérer la liste des visiteurs
export async function getVisitors(page: number = 1, limit: number = 20): Promise<{ 
  data: Visitor[]; 
  meta: { 
    current_page: number; 
    last_page: number; 
    per_page: number; 
    total: number; 
  } 
}> {
  const response = await fetch(`${API_BASE_URL}/analytics/visitors?page=${page}&limit=${limit}`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des visiteurs");
  }
  
  const res = await response.json();
  return { 
    data: Array.isArray(res?.data?.data) ? res.data.data : [], 
    meta: res?.data?.meta 
  };
}

// Récupérer les visiteurs uniques par IP
export async function getUniqueVisitors(): Promise<Visitor[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/unique-visitors`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des visiteurs uniques");
    }
    
    const res = await response.json();
    return Array.isArray(res?.data) ? res.data : [];
  } catch (error) {
    // Retourner des données de démonstration si l'API n'est pas disponible
    console.warn('API visiteurs uniques non disponible, utilisation des données de démonstration');
    return generateMockVisitors();
  }
}

// Récupérer les statistiques en temps réel
export async function getRealTimeStats(): Promise<{
  active_visitors: number;
  visitors_last_hour: number;
  top_current_pages: Array<{ page: string; views: number }>;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/realtime`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des stats temps réel");
    }
    
    const res = await response.json();
    return res?.data;
  } catch (error) {
    // Retourner des données de démonstration si l'API n'est pas disponible
    console.warn('API temps réel non disponible, utilisation des données de démonstration');
    return {
      active_visitors: Math.floor(Math.random() * 20) + 5,
      visitors_last_hour: Math.floor(Math.random() * 50) + 10,
      top_current_pages: [
        { page: '/', views: Math.floor(Math.random() * 30) + 10 },
        { page: '/services', views: Math.floor(Math.random() * 20) + 5 },
        { page: '/formations', views: Math.floor(Math.random() * 15) + 3 }
      ]
    };
  }
}

// Générer des données de démonstration
const generateMockAnalyticsData = (period: 'today' | 'week' | 'month' | 'year'): AnalyticsData => {
  const baseMultiplier = period === 'today' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 365;
  
  return {
    total_visitors: Math.floor(Math.random() * 1000 * baseMultiplier) + 100,
    unique_visitors: Math.floor(Math.random() * 500 * baseMultiplier) + 50,
    page_views: Math.floor(Math.random() * 2000 * baseMultiplier) + 200,
    visitors_today: Math.floor(Math.random() * 50) + 10,
    visitors_this_week: Math.floor(Math.random() * 300) + 50,
    visitors_this_month: Math.floor(Math.random() * 1200) + 200,
    top_pages: [
      { page: '/', views: Math.floor(Math.random() * 500) + 100 },
      { page: '/services', views: Math.floor(Math.random() * 300) + 80 },
      { page: '/formations', views: Math.floor(Math.random() * 250) + 60 },
      { page: '/blog', views: Math.floor(Math.random() * 200) + 40 },
      { page: '/contact', views: Math.floor(Math.random() * 150) + 30 }
    ],
    visitors_by_country: [
      { country: 'France', count: Math.floor(Math.random() * 200) + 50 },
      { country: 'Canada', count: Math.floor(Math.random() * 100) + 20 },
      { country: 'Belgique', count: Math.floor(Math.random() * 80) + 15 },
      { country: 'Suisse', count: Math.floor(Math.random() * 60) + 10 },
      { country: 'Luxembourg', count: Math.floor(Math.random() * 40) + 5 }
    ],
    daily_visitors: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      visitors: Math.floor(Math.random() * 50) + 10
    }))
  };
};

// Générer des visiteurs de démonstration
const generateMockVisitors = (): Visitor[] => {
  const ips = [
    '192.168.1.1', '10.0.0.1', '172.16.0.1', '203.0.113.1', '198.51.100.1',
    '192.168.1.2', '10.0.0.2', '172.16.0.2', '203.0.113.2', '198.51.100.2'
  ];
  
  const pages = ['/', '/services', '/formations', '/blog', '/contact'];
  const countries = ['France', 'Canada', 'Belgique', 'Suisse', 'Luxembourg'];
  
  return ips.map((ip, index) => ({
    id: index + 1,
    ip_address: ip,
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    page_visited: pages[Math.floor(Math.random() * pages.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    city: `Ville ${index + 1}`,
    created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }));
};

// Supprimer les données d'analytics (admin seulement)
export async function clearAnalytics(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/analytics/clear`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error("Erreur lors de la suppression des analytics");
  }
} 