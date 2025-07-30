import { API_BASE_URL } from '@/config/api';
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
  getServiceById,
  searchServices
} from '@/services/services';

export type Service = {
  id: number;
  nom: string;
  slug: string;
  description: string;
  categorie: string;
  tarif: string;
  duree: string;
  image: string;
  created_at?: string;
  updated_at?: string;
};

// Récupérer tous les services
export async function getAllServices(): Promise<{ data: Service[]; meta?: any }> {
  const response = await fetch(`${API_BASE_URL}/services`);
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des services');
  }
  const res = await response.json();
  return { data: res.data, meta: res.meta };
}

// Rechercher des services
export async function searchServices(query: string): Promise<{ data: Service[]; meta?: any }> {
  const response = await fetch(`${API_BASE_URL}/services?search=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la recherche de services');
  }
  const res = await response.json();
  return { data: res.data, meta: res.meta };
}

// Récupérer un service par ID
export async function getServiceById(id: number): Promise<Service> {
  const response = await fetch(`${API_BASE_URL}/services/${id}`);
  if (!response.ok) {
    throw new Error('Service non trouvé');
  }
  return response.json();
}

// Créer un nouveau service
export async function createService(serviceData: FormData): Promise<{ success: boolean; message: string; data: Service }> {
  console.log('Envoi de la requête POST vers:', `${API_BASE_URL}/services`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      body: serviceData,
      // Ne pas définir Content-Type pour FormData, le navigateur le fait automatiquement
      redirect: 'follow', // Suivre les redirections
    });
    
    console.log('Statut de la réponse:', response.status);
    console.log('Headers de la réponse:', Object.fromEntries(response.headers.entries()));
    
    // Si c'est une redirection, suivre la redirection
    if (response.redirected) {
      console.log('Redirection détectée vers:', response.url);
    }
    
    // Vérifier si la réponse est OK ou si c'est une redirection réussie
    if (response.ok || response.status === 302) {
      const result = await response.json();
      console.log('Réponse du serveur:', result);
      
      // Si c'est une redirection, essayer de récupérer la vraie réponse
      if (response.status === 302) {
        console.log('Traitement de la redirection 302...');
        // La redirection peut contenir la vraie réponse dans le body
        return result;
      }
      
      return result;
    } else {
      const errorText = await response.text();
      console.error('Réponse d\'erreur:', errorText);
      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error('Erreur lors de la requête:', error);
    throw error;
  }
}

// Mettre à jour un service
export async function updateService(id: number, serviceData: FormData): Promise<{ success: boolean; message: string; data: Service }> {
  const response = await fetch(`${API_BASE_URL}/services/${id}/update`, {
    method: 'POST',
    body: serviceData,
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Erreur lors de la mise à jour du service');
  }
  
  return result;
}

// Supprimer un service
export async function deleteService(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/services/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression du service');
  }
} 