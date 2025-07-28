// Service pour l'API contacts
import { API_BASE_URL } from '@/config/api';

export type Contact = {
  id: number;
  nom: string;
  email: string;
  sujet: string;
  message: string;
  reponse?: string;
  created_at?: string;
  updated_at?: string;
};

// Créer un contact
export async function createContact(data: { nom: string; email: string; sujet: string; message: string }): Promise<Contact> {
  const response = await fetch(`${API_BASE_URL}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la création du contact");
  }
  const res = await response.json();
  return res?.data;
}

// Modifier un contact
export async function updateContact(id: number, data: { nom: string; email: string; sujet: string; message: string }): Promise<Contact> {
  const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la modification du contact");
  }
  const res = await response.json();
  return res?.data;
}

// Répondre à un contact (ajouter une réponse)
export async function replyToContact(id: number, reponse: string): Promise<Contact> {
  const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reponse }),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error("Erreur lors de l'ajout de la réponse");
  }
  const res = await response.json();
  return res?.data;
}

// Récupérer la liste des contacts (avec pagination)
export async function getContacts(page: number = 1): Promise<{ data: Contact[]; meta?: { current_page: number; last_page: number; per_page: number; total: number } }> {
  const response = await fetch(`${API_BASE_URL}/contacts?page=${page}`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des contacts");
  }
  const res = await response.json();
  // API Laravel : { success, message, data: { data: [ ... ], meta: { ... } } }
  return { data: Array.isArray(res?.data?.data) ? res.data.data : [], meta: res?.data?.meta };
}

// Récupérer un contact par ID
export async function getContactById(id: number): Promise<Contact> {
  const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du contact");
  }
  const res = await response.json();
  return res?.data;
}

// Rechercher des contacts (par nom, email, sujet, etc.)
export async function searchContacts(query: string): Promise<Contact[]> {
  const response = await fetch(`${API_BASE_URL}/contacts/search?q=${encodeURIComponent(query)}`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la recherche de contacts");
  }
  const res = await response.json();
  return Array.isArray(res?.data?.data) ? res.data.data : [];
}

// Supprimer un contact
export async function deleteContact(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du contact");
  }
} 