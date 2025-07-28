import { useEffect, useState } from 'react';
import { getUser } from '../services/auth';

export default function Profil() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser()
      .then(data => setUser(data))
      .catch(err => console.error('Erreur user:', err));
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <p>Nom: {user.nom}</p>
          <p>Prénom: {user.prenom}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
}
