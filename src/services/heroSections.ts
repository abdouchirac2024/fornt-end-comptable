import { API_BASE_URL } from '@/config/api';

// Types pour les sections hero
export interface HeroSection {
  id: number;
  is_active: boolean;
  slides: HeroSlide[];
  active_slides: HeroSlide[];
  slides_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface HeroSlide {
  id: number;
  hero_section_id: number;
  slide_order: number;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  background_image?: string;
  slide_duration: number;
  is_active: boolean;
  hero_section?: HeroSection | null;
  created_at: string;
  updated_at: string;
}

export interface CreateHeroSectionData {
  is_active: boolean;
}

export interface UpdateHeroSectionData {
  is_active?: boolean;
}

export interface CreateHeroSlideData {
  hero_section_id: number;
  slide_order: number;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  slide_duration: number;
  is_active: boolean;
  background_image?: File;
}

export interface UpdateHeroSlideData {
  title?: string;
  subtitle?: string;
  description?: string;
  gradient?: string;
  slide_duration?: number;
  is_active?: boolean;
  background_image?: File;
}

// Service pour récupérer la section hero active
export const getActiveHeroSection = async (): Promise<{ success: boolean; data: HeroSection; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/hero-sections/active`);
    if (!response.ok) {
      throw new Error('Erreur lors du chargement de la section hero active');
    }
    return response.json();
  } catch (error) {
    // Retourner une réponse par défaut si l'API n'est pas disponible
    return {
      success: false,
      data: {
        id: 1,
        is_active: true,
        slides: [],
        active_slides: [],
        slides_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      message: 'API non disponible'
    };
  }
};

// Service pour récupérer toutes les sections hero
export const getAllHeroSections = async (): Promise<{ success: boolean; data: HeroSection[]; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/hero-sections`);
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des sections hero');
    }
    return response.json();
  } catch (error) {
    // Retourner une réponse par défaut si l'API n'est pas disponible
    return {
      success: true,
      data: [],
      message: 'API non disponible'
    };
  }
};

// Service pour récupérer une section hero par ID
export const getHeroSectionById = async (id: number): Promise<{ success: boolean; data: HeroSection; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/hero-sections/${id}`);
  if (!response.ok) {
    throw new Error('Section hero non trouvée');
  }
  return response.json();
};

// Service pour créer une nouvelle section hero
export const createHeroSection = async (data: FormData): Promise<{ success: boolean; data: HeroSection; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/hero-sections`, {
    method: 'POST',
    body: data,
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la création de la section hero');
  }
  return response.json();
};

// Service pour mettre à jour une section hero
export const updateHeroSection = async (id: number, data: FormData): Promise<{ success: boolean; data: HeroSection; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/hero-sections/${id}/update`, {
    method: 'POST',
    body: data,
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour de la section hero');
  }
  return response.json();
};

// Service pour supprimer une section hero
export const deleteHeroSection = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/hero-sections/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de la section hero');
  }
  return response.json();
};

// Service pour activer une section hero
export const activateHeroSection = async (id: number, data: FormData): Promise<{ success: boolean; data: HeroSection; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/hero-sections/${id}/activate`, {
    method: 'POST',
    body: data,
  });
  if (!response.ok) {
    throw new Error('Erreur lors de l\'activation de la section hero');
  }
  return response.json();
};

// Service pour désactiver une section hero
export const deactivateHeroSection = async (id: number, data: FormData): Promise<{ success: boolean; data: HeroSection; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/hero-sections/${id}/deactivate`, {
    method: 'POST',
    body: data,
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la désactivation de la section hero');
  }
  return response.json();
};

// Service pour récupérer tous les slides hero
export const getAllHeroSlides = async (): Promise<{ success: boolean; data: HeroSlide[]; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/hero-slides`);
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des slides hero');
    }
    return response.json();
  } catch (error) {
    // Retourner une réponse par défaut si l'API n'est pas disponible
    return {
      success: true,
      data: [],
      message: 'API non disponible'
    };
  }
};

// Service pour récupérer les slides d'une section
export const getHeroSlidesBySection = async (sectionId: number): Promise<{ success: boolean; data: HeroSlide[]; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/hero-slides/section/${sectionId}`);
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des slides de la section');
  }
  return response.json();
};

// Service pour récupérer un slide hero par ID
export const getHeroSlideById = async (id: number): Promise<{ success: boolean; data: HeroSlide; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/hero-slides/${id}`);
  if (!response.ok) {
    throw new Error('Slide hero non trouvé');
  }
  return response.json();
};

// Service pour créer un nouveau slide hero
export const createHeroSlide = async (data: FormData): Promise<{ success: boolean; data: HeroSlide; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/hero-slides`, {
      method: 'POST',
      body: data,
      redirect: 'manual', // Empêcher les redirections automatiques
    });
    
    console.log('Status de la réponse:', response.status);
    console.log('Headers de la réponse:', Object.fromEntries(response.headers.entries()));
    
    // Gérer les redirections
    if (response.status === 302 || response.status === 301) {
      const location = response.headers.get('location');
      console.log('Redirection détectée vers:', location);
      
      // Suivre la redirection manuellement
      if (location) {
        const redirectResponse = await fetch(location, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (redirectResponse.ok) {
          const result = await redirectResponse.json();
          console.log('Réponse après redirection:', result);
          return result;
        }
      }
      
      throw new Error('Redirection non gérée');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API:', response.status, errorText);
      throw new Error(`Erreur ${response.status}: ${errorText || 'Erreur lors de la création du slide hero'}`);
    }
    
    const result = await response.json();
    console.log('Réponse API createHeroSlide:', result);
    return result;
  } catch (error) {
    console.error('Erreur createHeroSlide:', error);
    throw error;
  }
};

// Service pour créer un nouveau slide hero (méthode alternative)
export const createHeroSlideAlternative = async (data: FormData): Promise<{ success: boolean; data: HeroSlide; message: string }> => {
  try {
    // Première tentative avec redirection manuelle
    const response = await fetch(`${API_BASE_URL}/hero-slides`, {
      method: 'POST',
      body: data,
      redirect: 'manual',
    });
    
    console.log('Status de la réponse:', response.status);
    
    // Si c'est une redirection, essayer de récupérer les données
    if (response.status === 302 || response.status === 301) {
      // Essayer de récupérer le slide créé via une requête GET
      const slidesResponse = await fetch(`${API_BASE_URL}/hero-slides`);
      if (slidesResponse.ok) {
        const slidesData = await slidesResponse.json();
        if (slidesData.success && slidesData.data && slidesData.data.length > 0) {
          // Retourner le dernier slide créé
          const lastSlide = slidesData.data[slidesData.data.length - 1];
          return {
            success: true,
            data: lastSlide,
            message: 'Slide hero créé avec succès'
          };
        }
      }
    }
    
    // Si pas de redirection ou redirection échouée, essayer la méthode normale
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API:', response.status, errorText);
      throw new Error(`Erreur ${response.status}: ${errorText || 'Erreur lors de la création du slide hero'}`);
    }
    
    const result = await response.json();
    console.log('Réponse API createHeroSlide:', result);
    return result;
  } catch (error) {
    console.error('Erreur createHeroSlide:', error);
    throw error;
  }
};

// Service pour créer un nouveau slide hero avec plusieurs images
export const createHeroSlideWithMultipleImages = async (data: FormData): Promise<{ success: boolean; data: HeroSlide; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/hero-slides`, {
      method: 'POST',
      body: data,
      redirect: 'manual',
    });
    
    console.log('Status de la réponse (multi-images):', response.status);
    console.log('Headers de la réponse (multi-images):', Object.fromEntries(response.headers.entries()));
    
    // Gérer les redirections
    if (response.status === 302 || response.status === 301) {
      const location = response.headers.get('location');
      console.log('Redirection détectée vers:', location);
      
      // Suivre la redirection manuellement
      if (location) {
        const redirectResponse = await fetch(location, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (redirectResponse.ok) {
          const result = await redirectResponse.json();
          console.log('Réponse après redirection (multi-images):', result);
          return result;
        }
      }
      
      throw new Error('Redirection non gérée');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API (multi-images):', response.status, errorText);
      throw new Error(`Erreur ${response.status}: ${errorText || 'Erreur lors de la création du slide hero avec plusieurs images'}`);
    }
    
    const result = await response.json();
    console.log('Réponse API createHeroSlideWithMultipleImages:', result);
    return result;
  } catch (error) {
    console.error('Erreur createHeroSlideWithMultipleImages:', error);
    throw error;
  }
};

// Service pour mettre à jour un slide hero
export const updateHeroSlide = async (id: number, data: FormData): Promise<{ success: boolean; data: HeroSlide; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/hero-slides/${id}/update`, {
      method: 'POST',
      body: data,
      redirect: 'manual', // Empêcher les redirections automatiques
    });
    
    console.log('Status de la réponse update:', response.status);
    console.log('Headers de la réponse update:', Object.fromEntries(response.headers.entries()));
    
    // Gérer les redirections
    if (response.status === 302 || response.status === 301) {
      const location = response.headers.get('location');
      console.log('Redirection détectée vers:', location);
      
      // Suivre la redirection manuellement
      if (location) {
        const redirectResponse = await fetch(location, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (redirectResponse.ok) {
          const result = await redirectResponse.json();
          console.log('Réponse après redirection update:', result);
          return result;
        }
      }
      
      throw new Error('Redirection non gérée');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API update:', response.status, errorText);
      throw new Error(`Erreur ${response.status}: ${errorText || 'Erreur lors de la mise à jour du slide hero'}`);
    }
    
    const result = await response.json();
    console.log('Réponse API updateHeroSlide:', result);
    return result;
  } catch (error) {
    console.error('Erreur updateHeroSlide:', error);
    throw error;
  }
};

// Service pour supprimer un slide hero
export const deleteHeroSlide = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/hero-slides/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression du slide hero');
  }
  return response.json();
};

// Service pour activer un slide hero
export const activateHeroSlide = async (id: number, data: FormData): Promise<{ success: boolean; data: HeroSlide; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/hero-slides/${id}/activate`, {
    method: 'POST',
    body: data,
  });
  if (!response.ok) {
    throw new Error('Erreur lors de l\'activation du slide hero');
  }
  return response.json();
};

// Service pour désactiver un slide hero
export const deactivateHeroSlide = async (id: number, data: FormData): Promise<{ success: boolean; data: HeroSlide; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/hero-slides/${id}/deactivate`, {
    method: 'POST',
    body: data,
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la désactivation du slide hero');
  }
  return response.json();
};

// Service pour réordonnancer les slides
export const reorderHeroSlides = async (sectionId: number, slideOrders: Record<number, number>): Promise<{ success: boolean; message: string }> => {
  const formData = new FormData();
  Object.entries(slideOrders).forEach(([slideId, order]) => {
    formData.append(`slide_orders[${slideId}]`, order.toString());
  });

  const response = await fetch(`${API_BASE_URL}/hero-slides/section/${sectionId}/reorder`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Erreur lors du réordonnancement des slides');
  }
  return response.json();
};

// Service pour rechercher des slides hero
export const searchHeroSlides = async (query: string, filters?: Record<string, any>): Promise<{ success: boolean; data: HeroSlide[]; message: string }> => {
  const params = new URLSearchParams();
  params.append('search', query);
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }

  const response = await fetch(`${API_BASE_URL}/hero-slides?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la recherche de slides hero');
  }
  return response.json();
}; 