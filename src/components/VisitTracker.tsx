import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackVisit } from '@/services/analytics';

// Service pour obtenir l'adresse IP
const getClientIP = async (): Promise<string> => {
  try {
    // Essayer d'obtenir l'IP via un service externe
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    // Fallback : utiliser une IP locale ou générer un ID unique
    return '127.0.0.1';
  }
};

// Service pour obtenir les informations de géolocalisation
const getLocationInfo = async (ip: string) => {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    return {
      country: data.country_name,
      city: data.city
    };
  } catch (error) {
    return {
      country: undefined,
      city: undefined
    };
  }
};

const VisitTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageVisit = async () => {
      try {
        // Ne tracker que les pages publiques (pas le dashboard admin)
        if (location.pathname.startsWith('/dashboard')) {
          return;
        }

        const ip = await getClientIP();
        const locationInfo = await getLocationInfo(ip);
        
        await trackVisit({
          ip_address: ip,
          user_agent: navigator.userAgent,
          page_visited: location.pathname,
          country: locationInfo.country,
          city: locationInfo.city
        });

        // Log silencieux en mode développement
        if (process.env.NODE_ENV === 'development') {
          console.log('Visite enregistrée:', {
            ip,
            page: location.pathname,
            country: locationInfo.country
          });
        }
      } catch (error) {
        // En mode démonstration, on ne fait rien de spécial
        if (process.env.NODE_ENV === 'development') {
          console.log('Mode démonstration - visite simulée pour:', location.pathname);
        }
      }
    };

    // Délai pour éviter de tracker les rechargements rapides
    const timeoutId = setTimeout(trackPageVisit, 1000);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  // Ce composant ne rend rien visuellement
  return null;
};

export default VisitTracker; 