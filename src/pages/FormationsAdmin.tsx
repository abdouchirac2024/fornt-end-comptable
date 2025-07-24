import React, { useEffect, useState, useRef } from 'react';
import { getAllFormations, getFormationById, searchFormations, Formation, deleteFormation } from '@/services/formations';
import { Card } from '@/components/ui/card';
import { Loader2, Eye, Pencil, Trash2, X, Search } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';

const FormationModal = ({ formation, onClose }: { formation: Formation | null, onClose: () => void }) => {
  if (!formation) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xl w-full relative animate-fade-in border border-blue-100">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition" title="Fermer">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-extrabold text-blue-900 mb-6 text-center tracking-tight">Détail de la formation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="space-y-4">
            <div>
              <span className="block text-xs font-bold text-blue-500 uppercase mb-0.5">Nom</span>
              <span className="text-base font-semibold text-blue-900">{formation.nom}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-blue-500 uppercase mb-0.5">Description</span>
              <span className="text-base text-blue-800">{formation.description}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-blue-500 uppercase mb-0.5">Durée</span>
              <span className="text-base text-blue-800">{formation.duree}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-blue-500 uppercase mb-0.5">Tarif</span>
              <span className="text-base text-blue-800">{formation.tarif}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-blue-500 uppercase mb-0.5">Date</span>
              <span className="text-base text-blue-800">{formation.created_at ? new Date(formation.created_at).toLocaleString() : '-'}</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="block text-xs font-bold text-blue-500 uppercase mb-2">Image</span>
            {formation.image && (
              <img src={formation.image} alt={formation.nom} className="h-32 w-32 object-cover rounded shadow border border-blue-100" />
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-base transition shadow"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

const CreateFormationModal = ({ onClose, onCreated }: { onClose: () => void, onCreated: () => void }) => {
  const [form, setForm] = useState({
    nom: '',
    slug: '',
    description: '',
    duree: '',
    tarif: '',
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, image: e.target.files?.[0] || null }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('nom', form.nom);
      fd.append('slug', form.slug);
      fd.append('description', form.description);
      fd.append('duree', form.duree);
      fd.append('tarif', form.tarif);
      if (form.image) fd.append('image', form.image);
      const res = await fetch(`${API_BASE_URL}/formations`, {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) throw new Error('Erreur lors de la création');
      onCreated();
      onClose();
    } catch {
      setError("Erreur lors de la création de la formation.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fade-in border border-blue-100">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition" title="Fermer">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-extrabold text-blue-900 mb-6 text-center tracking-tight">Créer une formation</h2>
        {error && <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-blue-500 uppercase mb-1">Nom</label>
            <input name="nom" value={form.nom} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white text-blue-900 placeholder:text-blue-400 shadow-sm transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-blue-500 uppercase mb-1">Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white text-blue-900 placeholder:text-blue-400 shadow-sm transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-blue-500 uppercase mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white text-blue-900 placeholder:text-blue-400 shadow-sm transition-all resize-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-blue-500 uppercase mb-1">Durée</label>
              <input name="duree" value={form.duree} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white text-blue-900 placeholder:text-blue-400 shadow-sm transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-blue-500 uppercase mb-1">Tarif</label>
              <input name="tarif" value={form.tarif} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white text-blue-900 placeholder:text-blue-400 shadow-sm transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-blue-500 uppercase mb-1">Image</label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold shadow border border-blue-200 transition-all">
                {form.image ? form.image.name : 'Choisir une image'}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              {form.image && <span className="text-xs text-blue-600">{form.image.name}</span>}
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-lg transition shadow">
            {loading ? 'Création...' : 'Créer'}
          </button>
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
        <button onClick={onCancel} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition" title="Fermer">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-extrabold text-red-700 mb-6 text-center tracking-tight">Suppression d'une formation</h2>
        <div className="mb-6 text-center text-gray-700">
          Vous êtes sur le point de supprimer la formation <span className="font-bold text-blue-700">{formation.nom}</span>.<br/>
          Cette action est <span className="font-bold text-red-600">irréversible</span>.<br/>
          Voulez-vous continuer ?
        </div>
        <div className="flex gap-4 mt-8">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-lg text-base transition shadow"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-base transition shadow"
            disabled={loading}
          >
            {loading ? 'Suppression...' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

const FormationsAdmin = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewFormation, setViewFormation] = useState<Formation | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteFormationId, setDeleteFormationId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteFormationObj, setDeleteFormationObj] = useState<Formation | null>(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    getAllFormations()
      .then(res => setFormations(res.data))
      .catch(() => setError("Erreur lors du chargement des formations."))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    setSearching(true);
    setError('');
    setSearched(true);
    try {
      const res = await searchFormations(search);
      setFormations(res.data);
    } catch {
      setError("Erreur lors de la recherche de formations.");
      setFormations([]);
    } finally {
      setSearching(false);
    }
  };

  const handleReset = () => {
    setSearch('');
    setSearched(false);
    setLoading(true);
    getAllFormations()
      .then(res => setFormations(res.data))
      .catch(() => setError("Erreur lors du chargement des formations."))
      .finally(() => setLoading(false));
  };

  const handleView = async (id: number) => {
    setModalLoading(true);
    try {
      const formation = await getFormationById(id);
      setViewFormation(formation);
    } catch {
      setError("Erreur lors de la récupération de la formation.");
    } finally {
      setModalLoading(false);
    }
  };

  const refreshFormations = () => {
    setLoading(true);
    setError('');
    getAllFormations()
      .then(res => setFormations(res.data))
      .catch(() => setError("Erreur lors du chargement des formations."))
      .finally(() => setLoading(false));
  };

  const handleDeleteClick = (formation: Formation) => {
    setDeleteFormationId(formation.id);
    setDeleteFormationObj(formation);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteFormationId) return;
    setDeleteLoading(true);
    try {
      await deleteFormation(deleteFormationId);
      setFormations((prev) => prev.filter((f) => f.id !== deleteFormationId));
      setDeleteFormationId(null);
      setDeleteFormationObj(null);
    } catch {
      setError("Erreur lors de la suppression de la formation.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteFormationId(null);
    setDeleteFormationObj(null);
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-900">Liste des formations</h2>
        <button
          onClick={() => { window.location.hash = '#formations-create'; }}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow transition-all text-lg"
        >
          + Créer une formation
        </button>
      </div>
      <form onSubmit={handleSearch} className="flex items-center gap-3 mb-6 max-w-xl w-full px-2 sm:px-0">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher une formation..."
          className="flex-1 px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white text-blue-900 placeholder:text-blue-400 shadow-sm transition-all text-base sm:text-lg"
        />
      </form>
      <Card className="overflow-x-auto p-0 rounded-2xl shadow-md">
        <div className="min-w-full">
          <table className="min-w-full divide-y divide-blue-100 text-sm md:text-base">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-2 py-2 md:px-4 md:py-3 text-left font-semibold text-blue-700 uppercase whitespace-nowrap">Nom</th>
                <th className="px-2 py-2 md:px-4 md:py-3 text-left font-semibold text-blue-700 uppercase whitespace-nowrap">Description</th>
                <th className="px-2 py-2 md:px-4 md:py-3 text-left font-semibold text-blue-700 uppercase whitespace-nowrap">Durée</th>
                <th className="px-2 py-2 md:px-4 md:py-3 text-left font-semibold text-blue-700 uppercase whitespace-nowrap">Tarif</th>
                <th className="px-2 py-2 md:px-4 md:py-3 text-left font-semibold text-blue-700 uppercase whitespace-nowrap">Image</th>
                <th className="px-2 py-2 md:px-4 md:py-3 text-center font-semibold text-blue-700 uppercase whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-blue-600">
                    <Loader2 className="animate-spin inline mr-2" /> Chargement...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-red-600">{error}</td>
                </tr>
              ) : formations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-blue-700">Aucune formation trouvée.</td>
                </tr>
              ) : (
                formations.map((formation) => (
                  <tr key={formation.id} className="hover:bg-blue-50 transition">
                    <td className="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap font-semibold text-blue-900">{formation.nom}</td>
                    <td className="px-2 py-2 md:px-4 md:py-3 max-w-xs truncate" title={formation.description}>{formation.description}</td>
                    <td className="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap">{formation.duree}</td>
                    <td className="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap">{formation.tarif}</td>
                    <td className="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap">
                      {formation.image && (
                        <img src={formation.image} alt={formation.nom} className="h-10 w-10 object-cover rounded shadow border border-blue-100" />
                      )}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap text-center">
                      <button
                        className="inline-flex items-center justify-center p-1 rounded hover:bg-blue-100 text-blue-700 mr-1"
                        title="Voir"
                        onClick={() => handleView(formation.id)}
                        disabled={modalLoading}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="inline-flex items-center justify-center p-1 rounded hover:bg-yellow-100 text-yellow-700 mr-1" title="Modifier">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        className="inline-flex items-center justify-center p-1 rounded hover:bg-red-100 text-red-700"
                        title="Supprimer"
                        onClick={() => handleDeleteClick(formation)}
                        disabled={deleteLoading}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {/* Modale de vue formation */}
      {viewFormation && (
        <FormationModal formation={viewFormation} onClose={() => setViewFormation(null)} />
      )}
      {showCreate && (
        <CreateFormationModal onClose={() => setShowCreate(false)} onCreated={refreshFormations} />
      )}
      {/* Modale de suppression */}
      {deleteFormationObj && (
        <DeleteModal
          formation={deleteFormationObj}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default FormationsAdmin; 