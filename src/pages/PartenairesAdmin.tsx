import React, { useState, useEffect, useCallback } from 'react';
import { 
  Eye, Pencil, Trash2, X, Search, CheckCircle2, 
  Plus, Filter, Download, RefreshCw, ChevronLeft, ChevronRight,
  Calendar, Clock, DollarSign, Briefcase, Loader2, Tag, Users
} from 'lucide-react';

import {
  getAllPartenaires,
  createPartenaire,
  updatePartenaire,
  deletePartenaire,
  getPartenaireById,
  searchPartenaires
} from '@/services/partenaires';

// Types
interface Partenaire {
  id: number;
  nom: string;
  description?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

// Hook pour media queries
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// Hook pour les toasts
const useToast = () => {
  const [toasts, setToasts] = useState<Array<{id: number, title: React.ReactNode, type: 'success' | 'error' | 'info'}>>([]);

  const toast = ({ title, type = 'info' }: { title: React.ReactNode, type?: 'success' | 'error' | 'info' }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`max-w-sm p-4 rounded-xl shadow-lg border animate-slide-in-right ${
            toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          {toast.title}
        </div>
      ))}
    </div>
  );

  return { toast, ToastContainer };
};

// Hook pour la pagination
const usePagination = (data: Partenaire[], itemsPerPage: number = 8) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentData,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    totalItems: data.length,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, data.length)
  };
};

// Données simulées
const generateMockPartenaires = (): Partenaire[] => {
  const partenaires = [];
  const noms = [
    'Microsoft', 'Google', 'Apple', 'Amazon', 'Meta', 'Netflix',
    'Adobe', 'Oracle', 'IBM', 'Intel', 'Cisco', 'Salesforce',
    'Zoom', 'Slack', 'Dropbox', 'Spotify', 'Uber', 'Airbnb'
  ];
  
  for (let i = 1; i <= 25; i++) {
    partenaires.push({
      id: i,
      nom: noms[Math.floor(Math.random() * noms.length)] + ` #${i}`,
      description: `Description détaillée du partenaire ${i}. Ce partenaire contribue à notre écosystème technologique.`,
      image: `https://picsum.photos/400/300?random=${i + 100}`,
      created_at: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString()
    });
  }
  return partenaires;
};

// Modal de détail
const PartenaireModal = ({ partenaire, onClose }: { partenaire: Partenaire | null, onClose: () => void }) => {
  if (!partenaire) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Détails du partenaire</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Nom du partenaire</label>
                <p className="text-xl font-bold text-gray-900 mt-1">{partenaire.nom}</p>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Description</label>
                <p className="text-gray-700 mt-1 leading-relaxed">{partenaire.description || 'Aucune description disponible'}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <label className="text-sm font-semibold text-gray-600">Date de création</label>
                </div>
                <p className="text-gray-900 font-medium">
                  {partenaire.created_at ? new Date(partenaire.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Logo du partenaire</label>
              {partenaire.image ? (
                <img 
                  src={partenaire.image} 
                  alt={partenaire.nom}
                  className="w-full max-w-md h-64 object-cover rounded-xl shadow-lg"
                />
              ) : (
                <div className="w-full max-w-md h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Users className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de création
const CreatePartenaireModal = ({ onClose, onCreated }: { onClose: () => void, onCreated: () => void }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    nom: '',
    description: '',
    image: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(f => ({ ...f, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) fd.append(key, value as any);
      });
      await createPartenaire(fd);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>Partenaire créé avec succès !</span>
          </div>
        ),
        type: 'success'
      });
      onCreated();
      onClose();
    } catch {
      toast({ title: 'Erreur lors de la création', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Créer un nouveau partenaire</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du partenaire</label>
            <input
              type="text"
              value={form.nom}
              onChange={(e) => setForm({...form, nom: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ex: Microsoft"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Description détaillée du partenaire..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          {imagePreview && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Aperçu du logo</label>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <img src={imagePreview} alt="Aperçu" className="h-40 w-auto rounded-lg shadow-lg mb-3 object-cover" />
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => { setForm(f => ({ ...f, image: null })); setImagePreview(null); }} 
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Retirer le logo
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Création...' : 'Créer le partenaire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de suppression
const DeleteModal = ({ partenaire, onCancel, onConfirm, loading }: {
  partenaire: Partenaire | null;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) => {
  if (!partenaire) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">Supprimer le partenaire</h2>
          <p className="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-gray-900">"{partenaire.nom}"</span> ?
            <br />Cette action est irréversible.
          </p>

          <div className="flex gap-4">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant de pagination
const Pagination = ({ 
  currentPage, totalPages, onPageChange, totalItems, startIndex, endIndex 
}: {
  currentPage: number; totalPages: number; onPageChange: (page: number) => void;
  totalItems: number; startIndex: number; endIndex: number;
}) => (
  <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-2xl">
    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-gray-700">
          Affichage de <span className="font-medium">{startIndex}</span> à{' '}
          <span className="font-medium">{endIndex}</span> sur{' '}
          <span className="font-medium">{totalItems}</span> résultats
        </p>
      </div>
      <div>
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {[...Array(totalPages).keys()].map(page => (
            <button
              key={page + 1}
              onClick={() => onPageChange(page + 1)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                page + 1 === currentPage
                  ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
              }`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </nav>
      </div>
    </div>
  </div>
);

// Tableau des partenaires
const PartenairesTable = ({ partenaires, onView, onEdit, onDelete }: {
  partenaires: Partenaire[]; onView: (partenaire: Partenaire) => void; onEdit: (partenaire: Partenaire) => void; onDelete: (partenaire: Partenaire) => void;
}) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Partenaire</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date de création</th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {partenaires.map((partenaire) => (
            <tr key={partenaire.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {partenaire.image && (
                    <img className="h-12 w-12 rounded-lg object-cover mr-4" src={partenaire.image} alt={partenaire.nom} />
                  )}
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{partenaire.nom}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500 max-w-xs truncate" title={partenaire.description}>
                  {partenaire.description || 'Aucune description'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {partenaire.created_at ? new Date(partenaire.created_at).toLocaleDateString('fr-FR') : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center space-x-2">
                  <button onClick={() => onView(partenaire)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Voir"><Eye className="w-5 h-5" /></button>
                  <button onClick={() => onEdit(partenaire)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Modifier"><Pencil className="w-5 h-5" /></button>
                  <button onClick={() => onDelete(partenaire)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer"><Trash2 className="w-5 h-5" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Grille des partenaires (mobile)
const PartenairesGrid = ({ partenaires, onView, onEdit, onDelete }: {
  partenaires: Partenaire[]; onView: (partenaire: Partenaire) => void; onEdit: (partenaire: Partenaire) => void; onDelete: (partenaire: Partenaire) => void;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {partenaires.map((partenaire) => (
      <div key={partenaire.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
        {partenaire.image && <img src={partenaire.image} alt={partenaire.nom} className="w-full h-48 object-cover" />}
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 pr-2">{partenaire.nom}</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{partenaire.description || 'Aucune description'}</p>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-gray-500">
                <Calendar className="w-4 h-4" />
                {partenaire.created_at ? new Date(partenaire.created_at).toLocaleDateString('fr-FR') : 'N/A'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <button onClick={() => onView(partenaire)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Voir"><Eye className="w-5 h-5" /></button>
            <button onClick={() => onEdit(partenaire)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Modifier"><Pencil className="w-5 h-5" /></button>
            <button onClick={() => onDelete(partenaire)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer"><Trash2 className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Modal d'édition
const EditPartenaireModal = ({ partenaire, onClose, onUpdated }: { partenaire: Partenaire, onClose: () => void, onUpdated: () => void }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    nom: partenaire.nom,
    description: partenaire.description || '',
    image: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(partenaire.image || null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(f => ({ ...f, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) fd.append(key, value as any);
      });
      await updatePartenaire(partenaire.id, fd);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>Partenaire modifié avec succès !</span>
          </div>
        ),
        type: 'success'
      });
      onUpdated();
      onClose();
    } catch {
      toast({ title: 'Erreur lors de la modification', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Modifier le partenaire</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du partenaire</label>
            <input
              type="text"
              value={form.nom}
              onChange={(e) => setForm({...form, nom: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          {imagePreview && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Aperçu du logo</label>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <img src={imagePreview} alt="Aperçu" className="h-40 w-auto rounded-lg shadow-lg mb-3 object-cover" />
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => { setForm(f => ({ ...f, image: null })); setImagePreview(null); }} 
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Retirer le logo
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Modification...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant principal
const PartenairesAdmin = () => {
  const { toast, ToastContainer } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [filteredPartenaires, setFilteredPartenaires] = useState<Partenaire[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedPartenaire, setSelectedPartenaire] = useState<Partenaire | null>(null);
  const [partenaireToDelete, setPartenaireToDelete] = useState<Partenaire | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [partenaireToEdit, setPartenaireToEdit] = useState<Partenaire | null>(null);

  const pagination = usePagination(filteredPartenaires, 8);

  // Charger les partenaires au montage
  useEffect(() => {
    fetchPartenaires();
  }, []);

  const fetchPartenaires = async () => {
    setLoading(true);
    try {
      const res = await getAllPartenaires();
      setPartenaires(res.data);
      setFilteredPartenaires(res.data);
    } catch {
      toast({ title: 'Erreur lors du chargement des partenaires', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredPartenaires(partenaires);
      return;
    }
    setLoading(true);
    try {
      const res = await searchPartenaires(query);
      setFilteredPartenaires(res.data);
    } catch {
      toast({ title: 'Erreur lors de la recherche', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [partenaires, toast]);

  const handleEdit = (partenaire: Partenaire) => setPartenaireToEdit(partenaire);

  const handleDeleteConfirm = async () => {
    if (!partenaireToDelete) return;
    setIsDeleting(true);
    try {
      await deletePartenaire(partenaireToDelete.id);
      setFilteredPartenaires(prev => prev.filter(f => f.id !== partenaireToDelete.id));
      setPartenaires(prev => prev.filter(f => f.id !== partenaireToDelete.id));
      toast({ title: (
        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-600" /><span>Partenaire "{partenaireToDelete.nom}" supprimé avec succès</span></div>), type: 'success' });
      setPartenaireToDelete(null);
    } catch {
      toast({ title: 'Erreur lors de la suppression', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = () => {
    fetchPartenaires();
    setSearchQuery('');
    toast({ title: <div className="flex items-center gap-2"><RefreshCw className="w-5 h-5 text-blue-600" /><span>Liste actualisée</span></div>, type: 'success' });
  };

  const handleCreated = () => { handleRefresh(); };

  const stats = [
    { title: 'Total Partenaires', value: partenaires.length, icon: Users, color: 'blue' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center"><Users className="w-8 h-8 text-blue-600 mr-3" /><h1 className="text-2xl font-bold text-gray-900">Gestion des Partenaires</h1></div>
            <div className="flex items-center space-x-4">
              <button onClick={handleRefresh} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" title="Actualiser"><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /></button>
              <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"><Plus className="w-5 h-5 mr-2" />Nouveau Partenaire</button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}><stat.icon className={`w-6 h-6 text-${stat.color}-600`} /></div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} placeholder="Rechercher par nom ou description..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"><Filter className="w-4 h-4 mr-2" />Filtrer</button>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" /><p className="text-gray-600">Chargement des partenaires...</p></div>
        ) : filteredPartenaires.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun partenaire trouvé</h3>
            <p className="text-gray-600 mb-6">{searchQuery ? 'Aucun résultat pour votre recherche.' : 'Commencez par créer votre premier partenaire.'}</p>
            {!searchQuery && <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"><Plus className="w-5 h-5 mr-2" />Créer un partenaire</button>}
          </div>
        ) : (
          <div className="space-y-6">
            {isMobile ? (
              <PartenairesGrid partenaires={pagination.currentData} onView={setSelectedPartenaire} onEdit={handleEdit} onDelete={setPartenaireToDelete} />
            ) : (
              <PartenairesTable partenaires={pagination.currentData} onView={setSelectedPartenaire} onEdit={handleEdit} onDelete={setPartenaireToDelete} />
            )}
            {pagination.totalPages > 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={pagination.goToPage} totalItems={pagination.totalItems} startIndex={pagination.startIndex} endIndex={pagination.endIndex} />
              </div>
            )}
          </div>
        )}
      </div>
      {selectedPartenaire && <PartenaireModal partenaire={selectedPartenaire} onClose={() => setSelectedPartenaire(null)} />}
      {showCreateModal && <CreatePartenaireModal onClose={() => setShowCreateModal(false)} onCreated={handleCreated} />}
      {partenaireToDelete && <DeleteModal partenaire={partenaireToDelete} onCancel={() => setPartenaireToDelete(null)} onConfirm={handleDeleteConfirm} loading={isDeleting} />}
      {partenaireToEdit && <EditPartenaireModal partenaire={partenaireToEdit} onClose={() => setPartenaireToEdit(null)} onUpdated={handleRefresh} />}
    </div>
  );
};

export default PartenairesAdmin;