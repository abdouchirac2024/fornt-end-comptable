
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Eye, Pencil, Trash2, X, Search, CheckCircle2, 
  Plus, Filter, Download, RefreshCw, ChevronLeft, ChevronRight,
  Calendar, Clock, DollarSign, Briefcase, Loader2, Tag
} from 'lucide-react';

import {
  getAllServices,
  createService,
  updateService,
  deleteService,
  getServiceById,
  searchServices
} from '@/services/services';

// Types
interface Service {
  id: number;
  nom: string;
  slug: string;
  description: string;
  categorie: string;
  duree: string;
  tarif: string;
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
const usePagination = (data: Service[], itemsPerPage: number = 8) => {
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
const generateMockServices = (): Service[] => {
  const services = [];
  const noms = [
    'Développement Web Sur Mesure', 'Audit SEO Complet', 'Gestion de Projet Agile',
    'Marketing de Contenu', 'Création d\'Identité Visuelle', 'Consultation Stratégique',
    'Maintenance Applicative', 'Campagne Publicitaire', 'UX/UI Design',
    'Formation en Leadership', 'Analyse de Données', 'Développement Mobile'
  ];
  const categories = ['Développement', 'Marketing', 'Conseil', 'Design', 'Formation'];
  
  for (let i = 1; i <= 47; i++) {
    services.push({
      id: i,
      nom: noms[Math.floor(Math.random() * noms.length)] + ` #${i}`,
      slug: `service-${i}`,
      description: `Description détaillée du service ${i}. Cette prestation vous aide à atteindre vos objectifs professionnels.`,
      categorie: categories[Math.floor(Math.random() * categories.length)],
      duree: `${Math.floor(Math.random() * 30) + 5} jours`,
      tarif: `${(Math.random() * 2000 + 500).toFixed(0)}€`,
      image: `https://picsum.photos/400/300?random=${i}`,
      created_at: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString()
    });
  }
  return services;
};

// Modal de détail
const ServiceModal = ({ service, onClose }: { service: Service | null, onClose: () => void }) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Détails du service</h2>
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
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Nom du service</label>
                <p className="text-xl font-bold text-gray-900 mt-1">{service.nom}</p>
              </div>

               <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Catégorie</label>
                <p className="mt-1">
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">{service.categorie}</span>
                </p>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Description</label>
                <p className="text-gray-700 mt-1 leading-relaxed">{service.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <label className="text-sm font-semibold text-blue-600">Durée</label>
                  </div>
                  <p className="text-lg font-bold text-blue-900">{service.duree}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <label className="text-sm font-semibold text-green-600">Tarif</label>
                  </div>
                  <p className="text-lg font-bold text-green-900">{service.tarif}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <label className="text-sm font-semibold text-gray-600">Date de création</label>
                </div>
                <p className="text-gray-900 font-medium">
                  {service.created_at ? new Date(service.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Image du service</label>
              {service.image ? (
                <img 
                  src={service.image} 
                  alt={service.nom}
                  className="w-full max-w-md h-64 object-cover rounded-xl shadow-lg"
                />
              ) : (
                <div className="w-full max-w-md h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-16 h-16 text-gray-400" />
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
const CreateServiceModal = ({ onClose, onCreated }: { onClose: () => void, onCreated: () => void }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    nom: '',
    slug: '',
    description: '',
    categorie: '',
    duree: '',
    tarif: '',
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
    
    // Validation côté client
    if (!form.nom.trim()) {
      toast({ title: 'Le nom du service est requis', type: 'error' });
      return;
    }
    
    if (!form.description.trim()) {
      toast({ title: 'La description est requise', type: 'error' });
      return;
    }
    
    if (!form.categorie.trim()) {
      toast({ title: 'La catégorie est requise', type: 'error' });
      return;
    }
    
    if (!form.slug.trim()) {
      toast({ title: 'Le slug est requis', type: 'error' });
      return;
    }
    
    setLoading(true);
    try {
      const fd = new FormData();
      
      // Ajouter les champs exactement comme dans Postman
      fd.append('nom', form.nom.trim());
      fd.append('description', form.description.trim());
      fd.append('categorie', form.categorie.trim());
      fd.append('slug', form.slug.trim());
      fd.append('duree', form.duree.trim());
      fd.append('tarif', form.tarif.trim());
      
      // Ajouter l'image si elle existe
      if (form.image) {
        fd.append('image', form.image);
      }
      
      console.log('Données envoyées au serveur:', {
        nom: form.nom.trim(),
        description: form.description.trim(),
        categorie: form.categorie.trim(),
        slug: form.slug.trim(),
        duree: form.duree.trim(),
        tarif: form.tarif.trim(),
        hasImage: !!form.image
      });
      
      // Afficher les données FormData pour débogage
      console.log('FormData contents:');
      for (let [key, value] of fd.entries()) {
        console.log(`${key}:`, value);
      }
      
      const result = await createService(fd);
      
      console.log('Réponse du serveur:', result);
      
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>Service créé avec succès !</span>
          </div>
        ),
        type: 'success'
      });
      onCreated();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      // Afficher plus de détails dans la console
      console.log('Type d\'erreur:', error.constructor.name);
      console.log('Message d\'erreur complet:', error);
      
      toast({ 
        title: `Erreur lors de la création: ${errorMessage}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Créer un nouveau service</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom du service <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.nom}
                onChange={(e) => setForm({...form, nom: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ex: Audit SEO Complet"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.categorie}
                onChange={(e) => setForm({...form, categorie: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ex: Conseil, Développement..."
                required
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({...form, slug: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ex: audit-seo-complet"
                required
                disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Description détaillée du service..."
              required
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Durée</label>
              <input
                type="text"
                value={form.duree}
                onChange={(e) => setForm({...form, duree: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ex: 10 jours"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tarif</label>
        <input
          type="text"
                value={form.tarif}
                onChange={(e) => setForm({...form, tarif: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ex: 1500€"
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Formats acceptés: JPG, PNG, GIF. Taille max: 5MB
            </p>
          </div>
          {imagePreview && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Aperçu de l'image</label>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <img src={imagePreview} alt="Aperçu" className="h-40 w-auto rounded-lg shadow-lg mb-3 object-cover" />
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => { setForm(f => ({ ...f, image: null })); setImagePreview(null); }} 
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Retirer l'image
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Annuler
            </button>
        <button
          type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Création...' : 'Créer le service'}
        </button>
          </div>
      </form>
      </div>
    </div>
  );
};

// Modal de suppression
const DeleteModal = ({ service, onCancel, onConfirm, loading }: {
  service: Service | null;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">Supprimer le service</h2>
          <p className="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-gray-900">"{service.nom}"</span> ?
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

// Tableau des services
const ServicesTable = ({ services, onView, onEdit, onDelete }: {
  services: Service[]; onView: (service: Service) => void; onEdit: (service: Service) => void; onDelete: (service: Service) => void;
}) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Catégorie</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Durée</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tarif</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Créé le</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Modifié le</th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {services.map((service) => (
            <tr key={service.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                #{service.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">{service.nom}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <code className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{service.slug}</code>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600 max-w-xs truncate" title={service.description}>
                  {service.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">{service.categorie}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.duree}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-semibold text-green-600">{service.tarif}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {service.image ? (
                  <div className="flex items-center">
                    <img className="h-8 w-8 rounded object-cover mr-2" src={service.image} alt={service.nom} />
                    <span className="text-xs text-gray-500">Image</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">Aucune</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                {service.created_at ? new Date(service.created_at).toLocaleDateString('fr-FR') : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                {service.updated_at ? new Date(service.updated_at).toLocaleDateString('fr-FR') : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center space-x-2">
                  <button onClick={() => onView(service)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Voir"><Eye className="w-5 h-5" /></button>
                  <button onClick={() => onEdit(service)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Modifier"><Pencil className="w-5 h-5" /></button>
                  <button onClick={() => onDelete(service)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer"><Trash2 className="w-5 h-5" /></button>
                </div>
              </td>
            </tr>
          ))}
            </tbody>
          </table>
    </div>
  </div>
);

// Grille des services (mobile)
const ServicesGrid = ({ services, onView, onEdit, onDelete }: {
  services: Service[]; onView: (service: Service) => void; onEdit: (service: Service) => void; onDelete: (service: Service) => void;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {services.map((service) => (
      <div key={service.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
        {service.image && <img src={service.image} alt={service.nom} className="w-full h-48 object-cover" />}
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{service.nom}</h3>
              <p className="text-xs text-gray-500">ID: #{service.id}</p>
            </div>
            <span className="flex-shrink-0 inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">{service.categorie}</span>
          </div>
          <div className="mb-3">
            <code className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{service.slug}</code>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-gray-500"><Clock className="w-4 h-4" />{service.duree}</span>
              <span className="font-semibold text-green-600">{service.tarif}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mb-4">
            <div>Créé: {service.created_at ? new Date(service.created_at).toLocaleDateString('fr-FR') : '-'}</div>
            <div>Modifié: {service.updated_at ? new Date(service.updated_at).toLocaleDateString('fr-FR') : '-'}</div>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <button onClick={() => onView(service)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Voir"><Eye className="w-5 h-5" /></button>
            <button onClick={() => onEdit(service)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Modifier"><Pencil className="w-5 h-5" /></button>
            <button onClick={() => onDelete(service)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer"><Trash2 className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Modal d'édition
const EditServiceModal = ({ service, onClose, onUpdated }: { service: Service, onClose: () => void, onUpdated: () => void }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    nom: service.nom,
    slug: service.slug,
    description: service.description,
    categorie: service.categorie,
    duree: service.duree,
    tarif: service.tarif,
    image: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(service.image || null);

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
      
      // Ajouter les champs exactement comme dans Postman
      fd.append('nom', form.nom.trim());
      fd.append('slug', form.slug.trim());
      fd.append('description', form.description.trim());
      fd.append('categorie', form.categorie.trim());
      fd.append('duree', form.duree.trim());
      fd.append('tarif', form.tarif.trim());
      
      // Ajouter l'image si elle existe
      if (form.image) {
        fd.append('image', form.image);
      }
      
      console.log('Données envoyées au serveur:', {
        nom: form.nom.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        categorie: form.categorie.trim(),
        duree: form.duree.trim(),
        tarif: form.tarif.trim(),
        hasImage: !!form.image
      });
      
      const result = await updateService(service.id, fd);
      
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>Service modifié avec succès !</span>
          </div>
        ),
        type: 'success'
      });
      onUpdated();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({ 
        title: `Erreur lors de la modification: ${errorMessage}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Modifier le service</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du service</label>
              <input
                type="text"
                value={form.nom}
                onChange={(e) => setForm({...form, nom: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie</label>
              <input
                type="text"
                value={form.categorie}
                onChange={(e) => setForm({...form, categorie: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
            <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({...form, slug: e.target.value})}
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
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Durée</label>
              <input
                type="text"
                value={form.duree}
                onChange={(e) => setForm({...form, duree: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tarif</label>
              <input
                type="text"
                value={form.tarif}
                onChange={(e) => setForm({...form, tarif: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          {imagePreview && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Aperçu de l'image</label>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <img src={imagePreview} alt="Aperçu" className="h-40 w-auto rounded-lg shadow-lg mb-3 object-cover" />
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => { setForm(f => ({ ...f, image: null })); setImagePreview(null); }} 
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Retirer l'image
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
const ServicesAdmin = () => {
  const { toast, ToastContainer } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);

  const pagination = usePagination(filteredServices, 8);

  // Charger les services au montage
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await getAllServices();
      setServices(res.data);
      setFilteredServices(res.data);
    } catch {
      toast({ title: 'Erreur lors du chargement des services', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredServices(services);
      return;
    }
    setLoading(true);
    try {
      const res = await searchServices(query);
      setFilteredServices(res.data);
    } catch {
      toast({ title: 'Erreur lors de la recherche', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [services, toast]);

  const handleEdit = (service: Service) => setServiceToEdit(service);

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    try {
      await deleteService(serviceToDelete.id);
      setFilteredServices(prev => prev.filter(f => f.id !== serviceToDelete.id));
      setServices(prev => prev.filter(f => f.id !== serviceToDelete.id));
      toast({ title: (
        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-600" /><span>Service "{serviceToDelete.nom}" supprimé avec succès</span></div>), type: 'success' });
      setServiceToDelete(null);
    } catch {
      toast({ title: 'Erreur lors de la suppression', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = () => {
    fetchServices();
    setSearchQuery('');
    toast({ title: <div className="flex items-center gap-2"><RefreshCw className="w-5 h-5 text-blue-600" /><span>Liste actualisée</span></div>, type: 'success' });
  };

  const handleCreated = () => { handleRefresh(); };

  const uniqueCategories = Array.from(new Set(services.map(s => s.categorie).filter(Boolean)));
  const totalCategories = uniqueCategories.length;

  const stats = [
    { title: 'Total Services', value: services.length, icon: Briefcase, color: 'blue' },
    { title: 'Catégories', value: totalCategories, icon: Tag, color: 'green' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center"><Briefcase className="w-8 h-8 text-blue-600 mr-3" /><h1 className="text-2xl font-bold text-gray-900">Gestion des Services</h1></div>
            <div className="flex items-center space-x-4">
              <button onClick={handleRefresh} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" title="Actualiser"><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /></button>
              <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"><Plus className="w-5 h-5 mr-2" />Nouveau Service</button>
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
              <input type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} placeholder="Rechercher par nom, description ou catégorie..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"><Filter className="w-4 h-4 mr-2" />Filtrer</button>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" /><p className="text-gray-600">Chargement des services...</p></div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun service trouvé</h3>
            <p className="text-gray-600 mb-6">{searchQuery ? 'Aucun résultat pour votre recherche.' : 'Commencez par créer votre premier service.'}</p>
            {!searchQuery && <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"><Plus className="w-5 h-5 mr-2" />Créer un service</button>}
          </div>
        ) : (
          <div className="space-y-6">
            {isMobile ? (
              <ServicesGrid services={pagination.currentData} onView={setSelectedService} onEdit={handleEdit} onDelete={setServiceToDelete} />
            ) : (
              <ServicesTable services={pagination.currentData} onView={setSelectedService} onEdit={handleEdit} onDelete={setServiceToDelete} />
            )}
            {pagination.totalPages > 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={pagination.goToPage} totalItems={pagination.totalItems} startIndex={pagination.startIndex} endIndex={pagination.endIndex} />
              </div>
            )}
          </div>
        )}
      </div>
      {selectedService && <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />}
      {showCreateModal && <CreateServiceModal onClose={() => setShowCreateModal(false)} onCreated={handleCreated} />}
      {serviceToDelete && <DeleteModal service={serviceToDelete} onCancel={() => setServiceToDelete(null)} onConfirm={handleDeleteConfirm} loading={isDeleting} />}
      {serviceToEdit && <EditServiceModal service={serviceToEdit} onClose={() => setServiceToEdit(null)} onUpdated={handleRefresh} />}
    </div>
  );
};

export default ServicesAdmin; 