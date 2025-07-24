// Service d'authentification pour l'API Laravel
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Exemple de fonction pour se connecter
export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // pour les cookies/session Laravel
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la connexion');
  }
  return response.json();
}



// Fonction pour se déconnecter
export async function logout() {
  const accessToken = localStorage.getItem('access_token');
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
    throw new Error('Erreur lors de la déconnexion');
  }
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  return response.json();
} 