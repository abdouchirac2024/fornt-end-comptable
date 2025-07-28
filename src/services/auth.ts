// Service d'authentification pour l'API Laravel
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Fonction pour se connecter
export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // pour les cookies/session Laravel
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de la connexion');
  }
  
  const data = await response.json();
  
  // Stocker le token d'accès si fourni
  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token);
  }
  
  return data;
}

// Fonction pour récupérer les informations de l'utilisateur connecté
// Correspond à la route: Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);
// Structure attendue de l'utilisateur:
// {
//   id: number,
//   prenom: string,
//   nom: string,
//   email: string,
//   role: string,
//   avatar?: string,
//   created_at: string,
//   updated_at: string
// }
export async function getUser() {
  const accessToken = localStorage.getItem('access_token');
  
  if (!accessToken) {
    throw new Error('Aucun token d\'accès trouvé');
  }
  
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      throw new Error('Session expirée, veuillez vous reconnecter');
    }
    throw new Error('Erreur lors de la récupération des données utilisateur');
  }
  
  const userData = await response.json();
  
  // Stocker les données utilisateur en cache
  localStorage.setItem('user', JSON.stringify(userData));
  
  return userData;
}

// Fonction pour vérifier si l'utilisateur est connecté
export function isAuthenticated(): boolean {
  const accessToken = localStorage.getItem('access_token');
  return !!accessToken;
}

// Fonction pour obtenir les données utilisateur en cache
export function getCachedUser() {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
}

// Fonction pour se déconnecter
export async function logout() {
  const accessToken = localStorage.getItem('access_token');
  
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      console.warn('Erreur lors de la déconnexion côté serveur');
    }
  } catch (error) {
    console.warn('Erreur réseau lors de la déconnexion:', error);
  } finally {
    // Nettoyer le stockage local même en cas d'erreur
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
  
  return { success: true };
}

// Fonction pour rafraîchir le token (si nécessaire)
export async function refreshToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!refreshToken) {
    throw new Error('Aucun refresh token disponible');
  }
  
  const response = await fetch(`${API_BASE_URL}/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors du rafraîchissement du token');
  }
  
  const data = await response.json();
  
  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token);
  }
  
  return data;
} 