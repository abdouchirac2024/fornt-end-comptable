import { API_BASE_URL } from '@/config/api';

export interface Mission {
  id: number;
  titre: string;
  description: string;
  type: string;
  date_realisation?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMissionData {
  titre: string;
  description: string;
  type: string;
  date_realisation?: string;
}

export interface UpdateMissionData {
  titre?: string;
  description?: string;
  type?: string;
  date_realisation?: string;
}

export const getAllMissions = async (): Promise<{ data: Mission[]; meta?: any }> => {
  const response = await fetch(`${API_BASE_URL}/missions`);
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des missions');
  }
  const res = await response.json();
  return { data: res.data, meta: res.meta };
};

export const getMissionById = async (id: number): Promise<Mission> => {
  const response = await fetch(`${API_BASE_URL}/missions/${id}`);
  if (!response.ok) {
    throw new Error('Mission non trouvée');
  }
  return response.json();
};

export const createMission = async (data: Mission): Promise<Mission> => {
  const response = await fetch(`${API_BASE_URL}/missions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la création de la mission');
  }
  return response.json();
};

export const updateMission = async (id: number, data: Mission): Promise<Mission> => {
  const response = await fetch(`${API_BASE_URL}/missions/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour de la mission');
  }
  return response.json();
};

export const deleteMission = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/missions/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de la mission');
  }
};

export const searchMissions = async (query: string): Promise<{ data: Mission[]; meta?: any }> => {
  const response = await fetch(`${API_BASE_URL}/missions?search=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la recherche de missions');
  }
  const res = await response.json();
  return { data: res.data, meta: res.meta };
};

export const getMissionsPaginated = async (page: number = 1, perPage: number = 10): Promise<{ data: Mission[]; meta?: any }> => {
  const response = await fetch(`${API_BASE_URL}/missions?page=${page}&per_page=${perPage}`);
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des missions');
  }
  const res = await response.json();
  return { data: res.data, meta: res.meta };
}; 