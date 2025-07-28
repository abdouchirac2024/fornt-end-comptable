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
export async function createService(serviceData: FormData): Promise<Service> {
  const response = await fetch(`${API_BASE_URL}/services`, {
    method: 'POST',
    body: serviceData,
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la création du service');
  }
  return response.json();
}

// Mettre à jour un service
export async function updateService(id: number, serviceData: FormData): Promise<Service> {
  const response = await fetch(`${API_BASE_URL}/services/${id}`, {
    method: 'POST',
    body: serviceData,
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour du service');
  }
  return response.json();
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