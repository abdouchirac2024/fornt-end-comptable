import { API_BASE_URL } from '@/config/api';

export interface ArticleBlog {
  id: number;
  user_id: number;
  titre: string;
  titre_en?: string;
  contenu: string;
  contenu_en?: string;
  meta_titre?: string;
  meta_description?: string;
  slug: string;
  image?: string;
  date_publication?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateArticleBlogData {
  user_id: number;
  titre: string;
  titre_en?: string;
  contenu: string;
  contenu_en?: string;
  meta_titre?: string;
  meta_description?: string;
  slug: string;
  image?: File;
  date_publication?: string;
}

export interface UpdateArticleBlogData {
  titre?: string;
  titre_en?: string;
  contenu?: string;
  contenu_en?: string;
  meta_titre?: string;
  meta_description?: string;
  slug?: string;
  image?: File;
  date_publication?: string;
}

export const getAllArticleBlogs = async (): Promise<{ data: ArticleBlog[]; meta?: any }> => {
  const response = await fetch(`${API_BASE_URL}/article-blogs`);
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des articles');
  }
  const res = await response.json();
  return { data: res.data, meta: res.meta };
};

export const getArticleBlogById = async (id: number): Promise<ArticleBlog> => {
  const response = await fetch(`${API_BASE_URL}/article-blogs/${id}`);
  if (!response.ok) {
    throw new Error('Article non trouvé');
  }
  return response.json();
};

export const createArticleBlog = async (data: FormData): Promise<ArticleBlog> => {
  const response = await fetch(`${API_BASE_URL}/article-blogs`, {
    method: 'POST',
    body: data,
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la création de l\'article');
  }
  return response.json();
};

export const updateArticleBlog = async (id: number, data: FormData): Promise<ArticleBlog> => {
  const response = await fetch(`${API_BASE_URL}/article-blogs/${id}`, {
    method: 'POST',
    body: data,
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour de l\'article');
  }
  return response.json();
};

export const deleteArticleBlog = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/article-blogs/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de l\'article');
  }
};

export const searchArticleBlogs = async (query: string): Promise<{ data: ArticleBlog[]; meta?: any }> => {
  const response = await fetch(`${API_BASE_URL}/article-blogs?search=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la recherche d\'articles');
  }
  const res = await response.json();
  return { data: res.data, meta: res.meta };
};

export const getArticleBlogsPaginated = async (page: number = 1, perPage: number = 10): Promise<{ data: ArticleBlog[]; meta?: any }> => {
  const response = await fetch(`${API_BASE_URL}/article-blogs?page=${page}&per_page=${perPage}`);
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des articles');
  }
  const res = await response.json();
  return { data: res.data, meta: res.meta };
}; 