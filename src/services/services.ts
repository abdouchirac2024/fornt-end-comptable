import { API_BASE_URL } from '@/config/api';

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

export async function searchServices(query: string): Promise<{ data: Service[]; meta?: any }> {
  const response = await fetch(`${API_BASE_URL}/services?search=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la recherche de services');
  }
  const res = await response.json();
  return { data: res.data, meta: res.meta };
} 