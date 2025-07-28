import React, { useState, useEffect, useCallback } from 'react';
import { 
  Eye, Pencil, Trash2, X, Search, CheckCircle2, 
  Plus, Filter, Download, RefreshCw, ChevronLeft, ChevronRight,
  Calendar, Clock, DollarSign, Briefcase, Loader2, Tag, Users,
  Image, Palette, Play, Pause, Settings, Layers, ArrowUpDown
} from 'lucide-react';

import {
  getAllHeroSections,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection,
  getHeroSectionById,
  activateHeroSection,
  deactivateHeroSection,
  getAllHeroSlides,
  createHeroSlide,
  createHeroSlideAlternative,
  createHeroSlideWithMultipleImages,
  updateHeroSlide,
  deleteHeroSlide,
  activateHeroSlide,
  deactivateHeroSlide,
  reorderHeroSlides,
  searchHeroSlides,
  HeroSection,
  HeroSlide
} from '@/services/heroSections';

// Types
interface HeroSectionWithSlides extends HeroSection {
  slides: HeroSlide[];
  active_slides: HeroSlide[];
}

interface HeroSlideFormData {
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  slide_duration: number;
  is_active: boolean;
  slide_order: number;
  background_images: File[]; // Changé pour supporter plusieurs images
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
  const [toastId, setToastId] = useState(0);

  const toast = ({ title, type = 'info' }: { title: React.ReactNode, type?: 'success' | 'error' | 'info' }) => {
    const id = toastId + 1;
    setToastId(id);
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
const usePagination = (data: HeroSectionWithSlides[], itemsPerPage: number = 8) => {
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

// Composant pour afficher les gradients
const GradientPreview = ({ gradient }: { gradient: string }) => (
  <div className="flex items-center gap-2">
    <div 
      className="w-8 h-8 rounded-lg shadow-sm border"
      style={{ 
        background: gradient.includes('gradient') ? 
          `linear-gradient(to right, ${gradient.replace('bg-gradient-to-r ', '').split(' ').join(', ')})` : 
          gradient 
      }}
    />
    <span className="text-xs text-gray-600 truncate max-w-24">{gradient}</span>
  </div>
);

// Modal pour créer/éditer une section hero
const HeroSectionModal = ({ section, onClose, onSaved }: { 
  section: HeroSectionWithSlides | null, 
  onClose: () => void, 
  onSaved: () => void 
}) => {
  const [formData, setFormData] = useState({
    is_active: section?.is_active ?? true
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('is_active', formData.is_active.toString());

      if (section) {
        await updateHeroSection(section.id, data);
        toast({ title: 'Section hero mise à jour avec succès', type: 'success' });
      } else {
        await createHeroSection(data);
        toast({ title: 'Section hero créée avec succès', type: 'success' });
      }
      
      onSaved();
      onClose();
    } catch (error) {
      toast({ title: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {section ? 'Modifier la Section Hero' : 'Créer une Section Hero'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="is_active"
                  value="true"
                  checked={formData.is_active === true}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                  className="mr-2"
                />
                <span className="text-sm">Active</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="is_active"
                  value="false"
                  checked={formData.is_active === false}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                  className="mr-2"
                />
                <span className="text-sm">Inactive</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {section ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal pour créer/éditer un slide hero
const HeroSlideModal = ({ slide, sectionId, onClose, onSaved }: { 
  slide: HeroSlide | null, 
  sectionId: number,
  onClose: () => void, 
  onSaved: () => void 
}) => {
  const [formData, setFormData] = useState<HeroSlideFormData>({
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    description: slide?.description || '',
    gradient: slide?.gradient || 'bg-gradient-to-r from-blue-500 to-purple-600',
    slide_duration: slide?.slide_duration || 5000,
    is_active: slide?.is_active ?? true, // S'assurer que c'est true par défaut
    slide_order: slide?.slide_order || 1,
    background_images: [] // Initialiser avec un tableau vide
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFormData(prev => ({ 
        ...prev, 
        background_images: [...prev.background_images, ...newFiles] 
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      background_images: prev.background_images.filter((_, i) => i !== index)
    }));
  };

  // Nettoyer les URLs des objets créés quand le composant se démonte
  useEffect(() => {
    return () => {
      formData.background_images.forEach(file => {
        URL.revokeObjectURL(URL.createObjectURL(file));
      });
    };
  }, [formData.background_images]);

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      gradient: 'bg-gradient-to-r from-blue-500 to-purple-600',
      slide_duration: 5000,
      is_active: true,
      slide_order: 1,
      background_images: []
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation côté client
    if (!formData.title.trim()) {
      toast({ title: 'Le titre est requis', type: 'error' });
      return;
    }
    
    if (!formData.subtitle.trim()) {
      toast({ title: 'Le sous-titre est requis', type: 'error' });
      return;
    }
    
    if (!formData.description.trim()) {
      toast({ title: 'La description est requise', type: 'error' });
      return;
    }
    
    if (formData.description.trim().length < 10) {
      toast({ title: 'La description doit contenir au moins 10 caractères', type: 'error' });
      return;
    }
    
    if (formData.slide_order < 1) {
      toast({ title: 'L\'ordre du slide doit être au moins 1', type: 'error' });
      return;
    }
    
    // Validation optionnelle pour les images (si l'utilisateur veut en ajouter)
    if (formData.background_images.length === 0) {
      const hasImageInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (hasImageInput && hasImageInput.files && hasImageInput.files.length > 0) {
        toast({ title: 'Veuillez sélectionner au moins une image', type: 'error' });
        return;
      }
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('hero_section_id', sectionId.toString());
      data.append('slide_order', formData.slide_order.toString()); // Utiliser la valeur du formulaire
      data.append('title', formData.title.trim());
      data.append('subtitle', formData.subtitle.trim());
      data.append('description', formData.description.trim());
      data.append('gradient', formData.gradient);
      data.append('slide_duration', formData.slide_duration.toString());
      data.append('is_active', formData.is_active ? '1' : '0'); // Corriger pour correspondre au format Postman
      
      if (formData.background_images.length > 0) {
        // Envoyer seulement la première image comme background_image (compatible avec l'API)
        data.append('background_image', formData.background_images[0]);
      }

      console.log('Envoi des données:', {
        hero_section_id: sectionId,
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        gradient: formData.gradient,
        slide_duration: formData.slide_duration,
        is_active: formData.is_active,
        has_image: !!formData.background_images.length
      });

      let result;
      if (slide) {
        result = await updateHeroSlide(slide.id, data);
        console.log('Résultat mise à jour:', result);
        if (result.success) {
          toast({ title: 'Slide hero mis à jour avec succès', type: 'success' });
        } else {
          toast({ title: `Erreur: ${result.message}`, type: 'error' });
          return;
        }
      } else {
        try {
          // Utiliser la méthode normale (corrigée pour background_image)
          result = await createHeroSlide(data);
          console.log('Résultat création:', result);
        } catch (error) {
          console.log('Échec méthode normale, essai méthode alternative...');
          // Si ça échoue, essayer la méthode alternative
          result = await createHeroSlideAlternative(data);
          console.log('Résultat création (méthode alternative):', result);
        }
        
        if (result.success) {
          toast({ title: 'Slide hero créé avec succès', type: 'success' });
        } else {
          toast({ title: `Erreur: ${result.message}`, type: 'error' });
          return;
        }
      }
      
      onSaved();
      onClose();
      resetForm(); // Réinitialiser le formulaire après sauvegarde
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({ title: `Erreur: ${errorMessage}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const gradients = [
    'bg-gradient-to-r from-blue-500 to-purple-600',
    'bg-gradient-to-r from-green-500 to-blue-600',
    'bg-gradient-to-r from-red-500 to-yellow-600',
    'bg-gradient-to-r from-purple-500 to-pink-600',
    'bg-gradient-to-r from-indigo-500 to-purple-600',
    'bg-gradient-to-r from-pink-500 to-red-600',
    'bg-gradient-to-r from-yellow-500 to-orange-600',
    'bg-gradient-to-r from-teal-500 to-blue-600',
    'bg-gradient-to-r from-gray-500 to-gray-700',
    'bg-gradient-to-r from-blue-600 to-indigo-700',
    'bg-gradient-to-r from-green-500 to-blue-600' // Ajout du gradient exact de votre exemple
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {slide ? 'Modifier le Slide Hero' : 'Créer un Slide Hero'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formData.title.trim() ? 'border-gray-300' : 'border-red-300 focus:ring-red-500'
                }`}
                required
                placeholder="Entrez le titre du slide"
              />
              {!formData.title.trim() && (
                <p className="text-red-500 text-xs mt-1">Le titre est requis</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordre du slide *
              </label>
              <input
                type="number"
                value={formData.slide_order}
                onChange={(e) => setFormData(prev => ({ ...prev, slide_order: parseInt(e.target.value) || 1 }))}
                min="1"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formData.slide_order >= 1 ? 'border-gray-300' : 'border-red-300 focus:ring-red-500'
                }`}
                required
                placeholder="1"
              />
              {formData.slide_order < 1 && (
                <p className="text-red-500 text-xs mt-1">L'ordre du slide doit être au moins 1</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sous-titre *
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formData.subtitle.trim() ? 'border-gray-300' : 'border-red-300 focus:ring-red-500'
                }`}
                required
                placeholder="Entrez le sous-titre"
              />
              {!formData.subtitle.trim() && (
                <p className="text-red-500 text-xs mt-1">Le sous-titre est requis</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description * (minimum 10 caractères)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formData.description.trim() && formData.description.trim().length >= 10 
                  ? 'border-gray-300' 
                  : 'border-red-300 focus:ring-red-500'
              }`}
              required
              placeholder="Entrez une description détaillée (minimum 10 caractères)"
            />
            {(!formData.description.trim() || formData.description.trim().length < 10) && (
              <p className="text-red-500 text-xs mt-1">
                {!formData.description.trim() 
                  ? 'La description est requise' 
                  : `La description doit contenir au moins 10 caractères (actuellement: ${formData.description.trim().length})`
                }
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gradient *
              </label>
              <select
                value={formData.gradient}
                onChange={(e) => setFormData(prev => ({ ...prev, gradient: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {gradients.map((gradient) => (
                  <option key={gradient} value={gradient}>
                    {gradient.replace('bg-gradient-to-r ', '')}
                  </option>
                ))}
              </select>
              <div className="mt-2">
                <GradientPreview gradient={formData.gradient} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée (ms) *
              </label>
              <input
                type="number"
                value={formData.slide_duration}
                onChange={(e) => setFormData(prev => ({ ...prev, slide_duration: parseInt(e.target.value) }))}
                min="1000"
                max="10000"
                step="500"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images de fond (plusieurs images autorisées)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFile}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {formData.background_images.length > 0 ? (
              <div className="mt-4">
                <ImagePreview 
                  images={formData.background_images} 
                  onRemove={removeImage} 
                />
                {formData.background_images.length > 1 && (
                  <p className="text-xs text-blue-600 mt-2">
                    ⓘ Seule la première image sera envoyée au serveur
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                Aucune image sélectionnée. Vous pouvez ajouter plusieurs images en les sélectionnant.
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Slide actif</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.subtitle.trim() || !formData.description.trim() || formData.description.trim().length < 10}
              className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                loading || !formData.title.trim() || !formData.subtitle.trim() || !formData.description.trim() || formData.description.trim().length < 10
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {slide ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de confirmation de suppression
const DeleteModal = ({ item, onCancel, onConfirm, loading }: {
  item: HeroSectionWithSlides | HeroSlide | null;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmer la suppression</h3>
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer {item && 'title' in item ? item.title : 'cet élément'} ? 
          Cette action est irréversible.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Composant de pagination
const Pagination = ({ 
  currentPage, totalPages, onPageChange, totalItems, startIndex, endIndex 
}: {
  currentPage: number; totalPages: number; onPageChange: (page: number) => void;
  totalItems: number; startIndex: number; endIndex: number;
}) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
    <div className="text-sm text-gray-700">
      Affichage de <span className="font-medium">{startIndex}</span> à{' '}
      <span className="font-medium">{endIndex}</span> sur{' '}
      <span className="font-medium">{totalItems}</span> résultats
    </div>
    
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// Composant de prévisualisation des images
const ImagePreview = ({ images, onRemove }: { 
  images: File[], 
  onRemove: (index: number) => void 
}) => (
  <div className="space-y-3">
    <h4 className="text-sm font-medium text-gray-700">Images sélectionnées ({images.length})</h4>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {images.map((file, index) => (
        <div key={index} className="relative group">
          <img
            src={URL.createObjectURL(file)}
            alt={`Preview ${index + 1}`}
            className="w-full h-24 object-cover rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
          >
            ×
          </button>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
            <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              {file.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Modal pour afficher l'image en grand
const ImageModal = ({ imageUrl, onClose }: { imageUrl: string, onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors z-10"
      >
        <X className="w-5 h-5" />
      </button>
      <img
        src={imageUrl}
        alt="Image en grand"
        className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
      />
    </div>
  </div>
);

// Composant principal
const HeroSectionsAdmin = () => {
  const [sections, setSections] = useState<HeroSectionWithSlides[]>([]);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'sections' | 'slides'>('sections');
  const [selectedSection, setSelectedSection] = useState<HeroSectionWithSlides | null>(null);
  
  // Modals
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<HeroSectionWithSlides | HeroSlide | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sectionToEdit, setSectionToEdit] = useState<HeroSectionWithSlides | null>(null);
  const [slideToEdit, setSlideToEdit] = useState<HeroSlide | null>(null);
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { toast, ToastContainer } = useToast();
  
  const pagination = usePagination(sections);

  // Charger les données
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sectionsRes, slidesRes] = await Promise.all([
        getAllHeroSections(),
        getAllHeroSlides()
      ]);
      
      setSections(sectionsRes.data);
      setSlides(slidesRes.data);
    } catch (error) {
      toast({ title: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, []); // Charger seulement au montage

  // Gestionnaires d'événements
  const handleCreateSection = () => {
    setSectionToEdit(null);
    setShowSectionModal(true);
  };

  const handleEditSection = (section: HeroSectionWithSlides) => {
    setSectionToEdit(section);
    setShowSectionModal(true);
  };

  const handleDeleteSection = (section: HeroSectionWithSlides) => {
    setItemToDelete(section);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    setDeleteLoading(true);
    try {
      if ('slides' in itemToDelete) {
        await deleteHeroSection(itemToDelete.id);
        toast({ title: 'Section hero supprimée avec succès', type: 'success' });
      } else {
        await deleteHeroSlide(itemToDelete.id);
        toast({ title: 'Slide hero supprimé avec succès', type: 'success' });
      }
      fetchData();
      setShowDeleteModal(false);
    } catch (error) {
      toast({ title: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`, type: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateSlide = () => {
    setSlideToEdit(null);
    setShowSlideModal(true);
  };

  const handleEditSlide = (slide: HeroSlide) => {
    setSlideToEdit(slide);
    setShowSlideModal(true);
  };

  const handleToggleSectionStatus = async (section: HeroSectionWithSlides) => {
    try {
      const data = new FormData();
      data.append('is_active', (!section.is_active).toString());
      
      if (section.is_active) {
        await deactivateHeroSection(section.id, data);
        toast({ title: 'Section hero désactivée', type: 'success' });
      } else {
        await activateHeroSection(section.id, data);
        toast({ title: 'Section hero activée', type: 'success' });
      }
      fetchData();
    } catch (error) {
      toast({ title: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`, type: 'error' });
    }
  };

  const handleToggleSlideStatus = async (slide: HeroSlide) => {
    try {
      const data = new FormData();
      data.append('is_active', (!slide.is_active).toString());
      
      if (slide.is_active) {
        await deactivateHeroSlide(slide.id, data);
        toast({ title: 'Slide hero désactivé', type: 'success' });
      } else {
        await activateHeroSlide(slide.id, data);
        toast({ title: 'Slide hero activé', type: 'success' });
      }
      fetchData();
    } catch (error) {
      toast({ title: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`, type: 'error' });
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleSaved = () => {
    fetchData();
  };

  // Filtrage des données
  const filteredSections = sections.filter(section =>
    section.id.toString().includes(searchTerm) ||
    section.is_active.toString().includes(searchTerm)
  );

  const filteredSlides = slides.filter(slide =>
    slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slide.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slide.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentData = viewMode === 'sections' ? filteredSections : filteredSlides;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ToastContainer />
      
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Sections Hero</h1>
            <p className="text-gray-600 mt-1">
              Gérez les sections hero et leurs slides pour votre page d'accueil
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              title="Actualiser"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('sections')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'sections' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sections
              </button>
              <button
                onClick={() => setViewMode('slides')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'slides' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Slides
              </button>
            </div>
            
            <button
              onClick={viewMode === 'sections' ? handleCreateSection : handleCreateSlide}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {viewMode === 'sections' ? 'Nouvelle Section' : 'Nouveau Slide'}
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Rechercher ${viewMode === 'sections' ? 'des sections' : 'des slides'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {currentData.length} {viewMode === 'sections' ? 'section(s)' : 'slide(s)'}
              {viewMode === 'slides' && (
                <span className="ml-2 text-xs text-green-600">
                  ({slides.filter(slide => slide.background_image).length} avec image)
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {currentData.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Layers className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun {viewMode === 'sections' ? 'section' : 'slide'} trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Aucun résultat pour votre recherche.' : `Aucun ${viewMode === 'sections' ? 'section' : 'slide'} n'a été créé pour le moment.`}
            </p>
            <button
              onClick={viewMode === 'sections' ? handleCreateSection : handleCreateSlide}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Créer le premier {viewMode === 'sections' ? 'section' : 'slide'}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {viewMode === 'sections' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Slides
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Créé le
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Titre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gradient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durée
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {viewMode === 'sections' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{item.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.slides?.length || 0} slide(s)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleSectionStatus(item)}
                              className={`p-1 rounded-md transition-colors ${
                                item.is_active 
                                  ? 'text-orange-600 hover:bg-orange-50' 
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={item.is_active ? 'Désactiver' : 'Activer'}
                            >
                              {item.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleEditSection(item)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Modifier"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSection(item)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.background_image ? (
                            <div 
                              className="relative group cursor-pointer"
                              onClick={() => setSelectedImage(item.background_image)}
                              title="Cliquez pour voir l'image en grand"
                            >
                              <img
                                src={item.background_image}
                                alt={`Image de ${item.title}`}
                                className="w-16 h-12 object-cover rounded-lg border border-gray-200 shadow-sm"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                              <div className="hidden w-16 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                <Image className="w-6 h-6 text-gray-400" />
                              </div>
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                                  Voir
                                </span>
                              </div>
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-16 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center" title="Aucune image">
                              <Image className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.subtitle}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <GradientPreview gradient={item.gradient} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.slide_duration}ms
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleSlideStatus(item)}
                              className={`p-1 rounded-md transition-colors ${
                                item.is_active 
                                  ? 'text-orange-600 hover:bg-orange-50' 
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={item.is_active ? 'Désactiver' : 'Activer'}
                            >
                              {item.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleEditSlide(item)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Modifier"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setItemToDelete(item);
                                setShowDeleteModal(true);
                              }}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {currentData.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.goToPage}
          totalItems={pagination.totalItems}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
        />
      )}

      {/* Modals */}
      {showSectionModal && (
        <HeroSectionModal
          section={sectionToEdit}
          onClose={() => {
            setShowSectionModal(false);
            setSectionToEdit(null);
          }}
          onSaved={handleSaved}
        />
      )}
      
      {showSlideModal && (
        <HeroSlideModal
          slide={slideToEdit}
          sectionId={sections[0]?.id || 1}
          onClose={() => {
            setShowSlideModal(false);
            setSlideToEdit(null);
          }}
          onSaved={handleSaved}
        />
      )}
      
      {showDeleteModal && (
        <DeleteModal
          item={itemToDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setItemToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          loading={deleteLoading}
        />
      )}
      
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default HeroSectionsAdmin; 