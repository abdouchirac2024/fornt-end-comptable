const API_BASE_URL = 'http://127.0.0.1:8000/api';

export type Category = {
  id: number;
  nom: string;
  description?: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
};

// Get all categories (with pagination response)
export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des catégories');
  }
  const data = await response.json();
  // API returns { success, message, data: { data: [ ... ], meta: { ... } } }
  return Array.isArray(data?.data?.data) ? data.data.data : [];
}

// Search categories by query
export async function searchCategories(query: string): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories/search?q=${encodeURIComponent(query)}`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la recherche des catégories');
  }
  const data = await response.json();
  // Assume same structure as getCategories
  return Array.isArray(data?.data?.data) ? data.data.data : [];
}

// Create a new category
export async function createCategory(data: { nom: string; description?: string }): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la création de la catégorie');
  }
  const res = await response.json();
  // API returns { success, message, data: { ...category } }
  return res?.data;
}

// Update a category by ID
export async function updateCategory(id: number, data: { nom: string; description?: string }): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la modification de la catégorie');
  }
  const res = await response.json();
  // API returns { success, message, data: { ...category } }
  return res?.data;
}

// Delete a category by ID
export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de la catégorie');
  }
}