import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getAllFormations, searchFormations, Formation, deleteFormation, updateFormation } from '@/services/formations';
import { Card } from '@/components/ui/card';
import { Loader2, Eye, Pencil, Trash2, X, Search, CheckCircle2, MoreVertical } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';
import { useToast } from '@/hooks/use-toast';

// --- HOOKS UTILITAIRES ---
/**
 * Hook pour détecter la taille de l'écran et optimiser le rendu pour le mobile.
 */
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};


// --- COMPOSANTS MODALS (inchangés mais inclus pour la complétude) ---
const FormationModal = ({ formation, onClose }: { formation: Formation | null, onClose: () => void }) => {
  if (!formation) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full relative animate-fade-in border border-blue-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-150" title="Fermer">
          <X className="w-7 h-7" />
        </button>
        <h2 className="text-3xl font-extrabold text-blue-900 mb-8 text-center tracking-tight">Détail de la formation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="space-y-6">
            <div>
              <span className="block text-xs font-bold text-blue-500 uppercase mb-1">Nom</span>
              <span className="text-lg font-semibold text-blue-900">{formation.nom}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-blue-500 uppercase mb-1">Description</span>
              <span className="text-base text-blue-800">{formation.description}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-blue-500 uppercase mb-1">Durée</span>
              <span className="text-base text-blue-800">{formation.duree}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-blue-500 uppercase mb-1">Tarif</span>
              <span className="text-base text-blue-800">{formation.tarif}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-blue-500 uppercase mb-1">Date</span>
              <span className="text-base text-blue-800">{formation.created_at ? new Date(formation.created_at).toLocaleString() : '-'}</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="block text-xs font-bold text-blue-500 uppercase mb-2">Image</span>
            {formation.image && (
              <img src={formation.image} alt={formation.nom} className="h-40 w-40 object-cover rounded-xl shadow border border-blue-100" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const CreateFormationModal = ({ onClose, onCreated }: { onClose: () => void, onCreated: () => void }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({ nom: '', slug: '', description: '', duree: '', tarif: '', image: null as File | null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, image: e.target.files?.[0] || null }));
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) fd.append(key, value);
      });
      const res = await fetch(`${API_BASE_URL}/formations`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Erreur lors de la création');
      toast({
        title: <span className="flex items-center gap-2 text-green-700"><CheckCircle2 className="w-5 h-5 text-green-600" /> Formation créée</span>,
        className: 'bg-green-50 border-green-200',
      });
      onCreated();
      onClose();
    } catch {
      setError("Erreur lors de la création de la formation.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-xl w-full relative animate-fade-in border border-blue-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500" title="Fermer"><X className="w-7 h-7" /></button>
        <h2 className="text-3xl font-extrabold text-blue-900 mb-8 text-center">Créer une formation</h2>
        {error && <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input name="nom" value={form.nom} onChange={handleChange} required placeholder="Nom" className="w-full px-5 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-200" />
          <input name="slug" value={form.slug} onChange={handleChange} required placeholder="Slug" className="w-full px-5 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-200" />
          <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Description" className="w-full px-5 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-200 resize-none" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="duree" value={form.duree} onChange={handleChange} placeholder="Durée" className="w-full px-5 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-200" />
            <input name="tarif" value={form.tarif} onChange={handleChange} placeholder="Tarif" className="w-full px-5 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-200" />
          </div>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold">{form.image ? form.image.name : 'Choisir une image'}</button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-lg transition shadow-lg disabled:opacity-50">{loading ? 'Création...' : 'Créer'}</button>
        </form>
      </div>
    </div>
  );
};
const DeleteModal = ({ formation, onCancel, onConfirm, loading }: { formation: Formation | null, onCancel: () => void, onConfirm: () => void, loading: boolean }) => {
  if (!formation) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full relative animate-fade-in border border-red-100">
        <h2 className="text-xl font-extrabold text-red-700 mb-4 text-center">Confirmer la suppression</h2>
        <p className="mb-6 text-center text-gray-700">
          Supprimer la formation <span className="font-bold text-blue-700">{formation.nom}</span> ?<br/>
          Cette action est <span className="font-bold text-red-600">irréversible</span>.
        </p>
        <div className="flex gap-4 mt-8">
          <button onClick={onCancel} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg" disabled={loading}>Annuler</button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center disabled:opacity-50" disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            {loading ? 'Suppression...' : 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal d'édition
const EditFormationModal = ({ formation, onClose, onUpdated }: { formation: Formation, onClose: () => void, onUpdated: () => void }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    nom: formation.nom,
    slug: formation.slug,
    description: formation.description,
    duree: formation.duree,
    tarif: formation.tarif,
    image: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(formation.image || null);

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
      await updateFormation(formation.id, fd);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>Formation modifiée avec succès !</span>
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
          <h2 className="text-2xl font-bold text-gray-900">Modifier la formation</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de la formation</label>
            <input
              type="text"
              value={form.nom}
              onChange={(e) => setForm({...form, nom: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ex: Formation React"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({...form, slug: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ex: formation-react"
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
              placeholder="Description détaillée de la formation..."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Durée</label>
              <input
                type="text"
                value={form.duree}
                onChange={(e) => setForm({...form, duree: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ex: 3 mois"
                required
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
                required
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

// --- COMPOSANTS DE LISTE (TABLEAU ET GRILLE) ---

interface ListProps {
  formations: Formation[];
  onView: (formation: Formation) => void;
  onEdit: (formation: Formation) => void;
  onDelete: (formation: Formation) => void;
  actionLoading: boolean;
}

const FormationsTable = ({ formations, onView, onEdit, onDelete, actionLoading }: ListProps) => (
  <Card className="overflow-x-auto p-0 rounded-2xl shadow-lg border border-blue-100 bg-white">
    <table className="min-w-full divide-y divide-blue-100">
      <thead className="bg-blue-50">
        <tr>
          {['Nom', 'Description', 'Durée', 'Tarif', 'Image'].map(header => (
            <th key={header} className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">{header}</th>
          ))}
          <th className="px-6 py-4 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-blue-50">
        {formations.map((formation) => (
          <tr key={formation.id} className="hover:bg-blue-50/70 transition-colors duration-150">
            <td className="px-6 py-4 whitespace-nowrap font-semibold text-blue-900">{formation.nom}</td>
            <td className="px-6 py-4 max-w-sm truncate text-gray-600" title={formation.description}>{formation.description}</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formation.duree}</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formation.tarif}</td>
            <td className="px-6 py-4">
              {formation.image && <img src={formation.image} alt={formation.nom} className="h-10 w-10 object-cover rounded-md shadow" />}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => onView(formation)} disabled={actionLoading} title="Voir" className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"><Eye className="w-5 h-5" /></button>
                <button onClick={() => onEdit(formation)} disabled={actionLoading} title="Modifier" className="p-2 rounded-full hover:bg-yellow-100 text-yellow-600 transition-colors"><Pencil className="w-5 h-5" /></button>
                <button onClick={() => onDelete(formation)} disabled={actionLoading} title="Supprimer" className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"><Trash2 className="w-5 h-5" /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

const FormationsGrid = ({ formations, onView, onEdit, onDelete, actionLoading }: ListProps) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {formations.map((formation) => (
        <Card key={formation.id} className="p-4 rounded-2xl shadow-lg border border-blue-100 flex flex-col justify-between">
          <div className="flex items-start gap-4">
            {formation.image && <img src={formation.image} alt={formation.nom} className="h-16 w-16 object-cover rounded-lg shadow flex-shrink-0" />}
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 text-lg">{formation.nom}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{formation.description}</p>
            </div>
            <div className="relative">
              <button onClick={() => setOpenMenuId(openMenuId === formation.id ? null : formation.id)} className="p-2 rounded-full hover:bg-gray-100"><MoreVertical className="w-5 h-5" /></button>
              {openMenuId === formation.id && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-xl z-10 border">
                  <a onClick={() => { onView(formation); setOpenMenuId(null); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"><Eye className="w-4 h-4 text-blue-600" /> Voir</a>
                  <a onClick={() => { onEdit(formation); setOpenMenuId(null); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 cursor-pointer"><Pencil className="w-4 h-4 text-yellow-600" /> Modifier</a>
                  <a onClick={() => { onDelete(formation); setOpenMenuId(null); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 cursor-pointer"><Trash2 className="w-4 h-4 text-red-600" /> Supprimer</a>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-500">Durée: <span className="font-semibold text-gray-700">{formation.duree || 'N/A'}</span></span>
            <span className="text-sm font-bold text-blue-700">{formation.tarif || 'N/A'}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

// --- COMPOSANT PRINCIPAL ---

const FormationsAdmin = () => {
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [formations, setFormations] = useState<Formation[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'success' | 'searching'>('loading');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [formationToDelete, setFormationToDelete] = useState<Formation | null>(null);
  const [formationToEdit, setFormationToEdit] = useState<Formation | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshFormations = useCallback(() => {
    setStatus('loading');
    getAllFormations()
      .then(res => {
        setFormations(res.data);
        setStatus('success');
      })
      .catch(() => {
        setError("Erreur lors du chargement des formations.");
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    refreshFormations();
  }, [refreshFormations]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      refreshFormations();
      return;
    }
    setStatus('searching');
    try {
      const res = await searchFormations(searchQuery);
      setFormations(res.data);
      setStatus('success');
    } catch {
      setError("Erreur lors de la recherche.");
      setFormations([]);
      setStatus('error');
    }
  };

  const handleEdit = (formation: Formation) => {
    setFormationToEdit(formation);
  };

  const handleDeleteConfirm = async () => {
    if (!formationToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFormation(formationToDelete.id);
      setFormations(prev => prev.filter(f => f.id !== formationToDelete.id));
      toast({
        title: <span className="flex items-center gap-2 text-green-700"><CheckCircle2 className="w-5 h-5 text-green-600" /> Formation supprimée.</span>,
        className: 'bg-green-50 border-green-200',
      });
      setFormationToDelete(null);
    } catch {
      toast({ title: "Erreur", description: "La suppression a échoué.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormationUpdated = () => {
    refreshFormations();
    setFormationToEdit(null);
  };

  const renderContent = () => {
    if (status === 'loading' || status === 'searching') {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin mr-3 h-8 w-8 text-blue-600" />
          <span className="text-lg text-gray-600">{status === 'searching' ? 'Recherche...' : 'Chargement...'}</span>
        </div>
      );
    }
    if (status === 'error') {
      return <div className="py-20 text-center text-red-600 font-semibold">{error}</div>;
    }
    if (formations.length === 0) {
      return <div className="py-20 text-center text-gray-500">Aucune formation trouvée.</div>;
    }

    const listProps = {
      formations,
      onView: setSelectedFormation,
      onEdit: handleEdit,
      onDelete: setFormationToDelete,
      actionLoading: isDeleting,
    };

    return isMobile ? <FormationsGrid {...listProps} /> : <FormationsTable {...listProps} />;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in w-full">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-blue-900">Gestion des Formations</h1>
        <button onClick={() => setShowCreateModal(true)} className="w-full md:w-auto px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-all flex items-center justify-center gap-2">
          + Créer
        </button>
      </header>

      <form onSubmit={handleSearch} className="mb-8 max-w-lg">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher une formation par nom, description..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </form>

      {renderContent()}

      {selectedFormation && <FormationModal formation={selectedFormation} onClose={() => setSelectedFormation(null)} />}
      {showCreateModal && <CreateFormationModal onClose={() => setShowCreateModal(false)} onCreated={refreshFormations} />}
      {formationToDelete && <DeleteModal formation={formationToDelete} onCancel={() => setFormationToDelete(null)} onConfirm={handleDeleteConfirm} loading={isDeleting} />}
      {formationToEdit && <EditFormationModal formation={formationToEdit} onClose={() => setFormationToEdit(null)} onUpdated={handleFormationUpdated} />}
    </div>
  );
};

export default FormationsAdmin;