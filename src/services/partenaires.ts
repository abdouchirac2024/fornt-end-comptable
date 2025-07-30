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
export const updatePartenaire = async (id: number, formData: FormData): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    console.log('Updating partenaire with ID:', id);
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await fetch(`${API_BASE_URL}/partenaires/${id}/edit`, {
      method: 'POST',
      body: formData,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Update response:', result);

    // Le backend retourne { data: {...} } sans success/message
    // On considère que si on arrive ici avec status 200, c'est un succès
    return {
      success: true,
      message: 'Partenaire mis à jour avec succès',
      data: result.data
    };
  } catch (error) {
    console.error('Error updating partenaire:', error);
    throw error;
  }
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