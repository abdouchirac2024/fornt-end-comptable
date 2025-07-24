import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/config/api';
import { X } from 'lucide-react';

const CreateFormation = () => {
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
  const navigate = useNavigate();

  const MAX_IMAGE_SIZE_MB = 2;
  const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_MB * 1024 * 1024;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > MAX_IMAGE_SIZE) {
      setError(`L'image ne doit pas dépasser ${MAX_IMAGE_SIZE_MB} Mo.`);
      setForm(f => ({ ...f, image: null }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setError('');
    setForm(f => ({ ...f, image: file }));
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
      window.location.hash = '#formations';
    } catch {
      setError("Erreur lors de la création de la formation.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-2xl mx-auto py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-blue-900">Créer une formation</h2>
        <button
          onClick={() => navigate('/dashboard#formations')}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-blue-700"
          title="Retour"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      {error && <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
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
          <div className="text-xs text-gray-500 mt-1">Taille maximale : {MAX_IMAGE_SIZE_MB} Mo</div>
          {error && error.includes('image') && (
            <div className="text-xs text-red-600 mt-1 font-semibold">{error}</div>
          )}
        </div>
        <button type="submit" disabled={loading || !!error} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-lg transition shadow">
          {loading ? 'Création...' : 'Créer'}
        </button>
      </form>
    </div>
  );
};

export default CreateFormation; 