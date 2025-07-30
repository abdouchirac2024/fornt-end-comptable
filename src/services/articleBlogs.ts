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
  const result = await response.json();
  
  // Extraire les données du champ 'data' comme dans la réponse Postman
  if (result.success && result.data) {
    return result.data;
  } else {
    throw new Error('Format de réponse invalide');
  }
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

export const updateArticleBlog = async (id: number, data: FormData): Promise<{ success: boolean; message: string; data: ArticleBlog }> => {
  // Essayer différentes URLs possibles
  const urls = [
    `${API_BASE_URL}/article-blogs/${id}/update`,
    `${API_BASE_URL}/article-blogs/${id}`,
    `${API_BASE_URL}/article-blogs/${id}/edit`
  ];
  
  console.log('Données envoyées:', Object.fromEntries(data.entries()));
  
  for (const url of urls) {
    console.log('Essai avec URL:', url);
    
    try {
      // Essayer d'abord avec POST (comme dans Postman)
      let response = await fetch(url, {
        method: 'POST',
        body: data,
      });
      
      console.log('Statut de la réponse (POST):', response.status);
      
      if (!response.ok) {
        console.log('POST a échoué, essai avec PUT...');
        // Si POST échoue, essayer avec PUT
        response = await fetch(url, {
          method: 'PUT',
          body: data,
        });
        console.log('Statut de la réponse (PUT):', response.status);
      }
      
      if (response.ok) {
        console.log('Succès avec URL:', url);
        const result = await response.json();
        console.log('Résultat de la mise à jour:', result);
        return result;
      } else {
        const errorText = await response.text();
        console.error(`Échec avec URL ${url}:`, errorText);
        
        // Si c'est une erreur 422 (validation), essayer de parser le JSON
        if (response.status === 422) {
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.errors) {
              const errorMessages = Object.entries(errorJson.errors)
                .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                .join('; ');
              throw new Error(`Erreur de validation: ${errorMessages}`);
            }
          } catch (parseError) {
            // Si on ne peut pas parser le JSON, utiliser le texte brut
          }
        }
      }
    } catch (error) {
      console.error(`Erreur avec URL ${url}:`, error);
    }
  }
  
  throw new Error('Aucune URL n\'a fonctionné pour la mise à jour de l\'article');
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