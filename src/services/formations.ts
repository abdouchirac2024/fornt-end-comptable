import { API_BASE_URL } from '@/config/api';

export type Formation = {
  id: number;
  nom: string;
  slug: string;
  description: string;
  duree: string;
  tarif: string;
  image: string;
  created_at?: string;
  updated_at?: string;
};

export async function getAllFormations(): Promise<{ data: Formation[]; meta?: any }> {
  const response = await fetch(`${API_BASE_URL}/formations`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des formations');
  }
  const res = await response.json();
  return { data: res.data, meta: res.meta };
}

export async function getFormationById(id: number): Promise<Formation> {
  const response = await fetch(`${API_BASE_URL}/formations/${id}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de la formation');
  }
  const res = await response.json();
  return res.data;
}

export async function searchFormations(query: string): Promise<{ data: Formation[]; meta?: any }> {
  const response = await fetch(`${API_BASE_URL}/formations?search=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la recherche de formations');
  }
  const res = await response.json();
  return { data: res.data, meta: res.meta };
}

export async function updateFormation(id: number, data: FormData): Promise<Formation> {
  const response = await fetch(`${API_BASE_URL}/formations/${id}/update`, {
    method: 'POST',
    body: data,
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour de la formation');
  }
  const res = await response.json();
  return res.data;
}

export async function deleteFormation(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/formations/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de la formation");
  }
} 