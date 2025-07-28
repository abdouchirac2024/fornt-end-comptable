import { API_BASE_URL } from '@/config/api';

// Types
export interface Partenaire {
  id: number;
  nom: string;
  description?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePartenaireData {
  nom: string;
  description?: string;
  image?: File;
}

export interface UpdatePartenaireData {
  nom?: string;
  description?: string;
  image?: File;
}

// Service pour récupérer tous les partenaires
export const getAllPartenaires = async (): Promise<{ data: Partenaire[]; meta?: any }> => {
  const response = await fetch(`${API_BASE_URL}/partenaires`);
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des partenaires');
  }
  const res = await response.json();
  return { data: res.data, meta: res.meta };
};

// Service pour récupérer un partenaire par ID
export const getPartenaireById = async (id: number): Promise<Partenaire> => {
  const response = await fetch(`${API_BASE_URL}/partenaires/${id}`);
  if (!response.ok) {
    throw new Error('Partenaire non trouvé');
  }
  return response.json();
};

// Service pour créer un nouveau partenaire
export const createPartenaire = async (data: FormData): Promise<Partenaire> => {
  const response = await fetch(`${API_BASE_URL}/partenaires`, {
    method: 'POST',
    body: data,
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la création du partenaire');
  }
  return response.json();
};

// Service pour mettre à jour un partenaire
export const updatePartenaire = async (id: number, data: FormData): Promise<Partenaire> => {
  const response = await fetch(`${API_BASE_URL}/partenaires/${id}`, {
    method: 'POST',
    body: data,
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour du partenaire');
  }
  return response.json();
};

// Service pour supprimer un partenaire
export const deletePartenaire = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/partenaires/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression du partenaire');
  }
};

// Service pour rechercher des partenaires
export const searchPartenaires = async (query: string): Promise<{ data: Partenaire[]; meta?: any }> => {
  const response = await fetch(`${API_BASE_URL}/partenaires?search=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la recherche de partenaires');
  }
  const res = await response.json();
  return { data: res.data, meta: res.meta };
};

// Service pour récupérer les partenaires avec pagination
export const getPartenairesPaginated = async (page: number = 1, perPage: number = 10): Promise<{ data: Partenaire[]; meta?: any }> => {
  const response = await fetch(`${API_BASE_URL}/partenaires?page=${page}&per_page=${perPage}`);
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des partenaires');
  }
  const res = await response.json();
  return { data: res.data, meta: res.meta };
}; 