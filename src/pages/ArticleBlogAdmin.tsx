import React, { useState, useEffect, useCallback } from 'react';
import {
  Eye, Pencil, Trash2, X, Search, CheckCircle2,
  Plus, Filter, RefreshCw, ChevronLeft, ChevronRight, Loader2, Users, FileText, Calendar
} from 'lucide-react';
import {
  getAllArticleBlogs,
  createArticleBlog,
  updateArticleBlog,
  deleteArticleBlog,
  getArticleBlogById,
  searchArticleBlogs
} from '@/services/articleBlogs';

// Types
interface ArticleBlog {
  id: number;
  user_id: number;
  titre: string;
  titre_en?: string;
  contenu: string;
  contenu_en?: string;
  meta_titre?: string;
  meta_description?: string;
  slug: string;
  image?: string;
  date_publication?: string;
  created_at?: string;
  updated_at?: string;
}

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

const usePagination = (data: ArticleBlog[], itemsPerPage: number = 8) => {
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

// Modal de détail
const ArticleModal = ({ article, onClose }: { article: ArticleBlog | null, onClose: () => void }) => {
  if (!article) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Détails de l'article</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Titre</label>
                <p className="text-xl font-bold text-gray-900 mt-1">{article.titre}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Auteur (user_id)</label>
                <p className="text-gray-700 mt-1 leading-relaxed">{article.user_id}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Contenu</label>
                <p className="text-gray-700 mt-1 leading-relaxed whitespace-pre-line">{article.contenu}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <label className="text-sm font-semibold text-gray-600">Date de publication</label>
                </div>
                <p className="text-gray-900 font-medium">
                  {article.date_publication ? new Date(article.date_publication).toLocaleDateString('fr-FR', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Image de l'article</label>
              {article.image ? (
                <img src={article.image} alt={article.titre} className="w-full max-w-md h-64 object-cover rounded-xl shadow-lg" />
              ) : (
                <div className="w-full max-w-md h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-16 h-16 text-gray-400" />
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
const CreateArticleModal = ({ onClose, onCreated }: { onClose: () => void, onCreated: () => void }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    user_id: 1,
    titre: '',
    titre_en: '',
    contenu: '',
    contenu_en: '',
    meta_titre: '',
    meta_description: '',
    slug: '',
    image: null as File | null,
    date_publication: ''
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
      await createArticleBlog(fd);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>Article créé avec succès !</span>
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
          <h2 className="text-2xl font-bold text-gray-900">Créer un nouvel article</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Titre</label>
              <input type="text" value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
              <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contenu</label>
            <textarea value={form.contenu} onChange={e => setForm(f => ({ ...f, contenu: e.target.value }))} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meta titre</label>
              <input type="text" value={form.meta_titre} onChange={e => setForm(f => ({ ...f, meta_titre: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meta description</label>
              <input type="text" value={form.meta_description} onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
            <input type="file" accept="image/*" onChange={handleFile} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>
          {imagePreview && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Aperçu de l'image</label>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <img src={imagePreview} alt="Aperçu" className="h-40 w-auto rounded-lg shadow-lg mb-3 object-cover" />
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => { setForm(f => ({ ...f, image: null })); setImagePreview(null); }} className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Retirer l'image
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors">Annuler</button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Création...' : 'Créer l\'article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de suppression
const DeleteModal = ({ article, onCancel, onConfirm, loading }: {
  article: ArticleBlog | null;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) => {
  if (!article) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Supprimer l'article</h2>
          <p className="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-gray-900">"{article.titre}"</span> ?<br />Cette action est irréversible.
          </p>
          <div className="flex gap-4">
            <button onClick={onCancel} disabled={loading} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50">Annuler</button>
            <button onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tableau des articles
const ArticlesTable = ({ articles, onView, onEdit, onDelete }: {
  articles: ArticleBlog[]; onView: (article: ArticleBlog) => void; onEdit: (article: ArticleBlog) => void; onDelete: (article: ArticleBlog) => void;
}) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Titre</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Auteur</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {articles.map((article) => (
            <tr key={article.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {article.image && (
                    <img className="h-12 w-12 rounded-lg object-cover mr-4" src={article.image} alt={article.titre} />
                  )}
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{article.titre}</div>
                    <div className="text-xs text-gray-500 max-w-xs truncate" title={article.slug}>{article.slug}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.user_id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.date_publication ? new Date(article.date_publication).toLocaleDateString('fr-FR') : 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center space-x-2">
                  <button onClick={() => onView(article)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Voir"><Eye className="w-5 h-5" /></button>
                  <button onClick={() => onEdit(article)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Modifier"><Pencil className="w-5 h-5" /></button>
                  <button onClick={() => onDelete(article)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer"><Trash2 className="w-5 h-5" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Grille des articles (mobile)
const ArticlesGrid = ({ articles, onView, onEdit, onDelete }: {
  articles: ArticleBlog[]; onView: (article: ArticleBlog) => void; onEdit: (article: ArticleBlog) => void; onDelete: (article: ArticleBlog) => void;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {articles.map((article) => (
      <div key={article.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
        {article.image && <img src={article.image} alt={article.titre} className="w-full h-48 object-cover" />}
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 pr-2">{article.titre}</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.meta_description || 'Aucune description'}</p>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-gray-500">
                <Calendar className="w-4 h-4" />
                {article.date_publication ? new Date(article.date_publication).toLocaleDateString('fr-FR') : 'N/A'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <button onClick={() => onView(article)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Voir"><Eye className="w-5 h-5" /></button>
            <button onClick={() => onEdit(article)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Modifier"><Pencil className="w-5 h-5" /></button>
            <button onClick={() => onDelete(article)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer"><Trash2 className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Modal d'édition
const EditArticleModal = ({ article, onClose, onUpdated }: { article: ArticleBlog, onClose: () => void, onUpdated: () => void }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    titre: article.titre,
    titre_en: article.titre_en || '',
    contenu: article.contenu,
    contenu_en: article.contenu_en || '',
    meta_titre: article.meta_titre || '',
    meta_description: article.meta_description || '',
    slug: article.slug,
    image: null as File | null,
    date_publication: article.date_publication || ''
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(article.image || null);
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
      await updateArticleBlog(article.id, fd);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>Article modifié avec succès !</span>
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
          <h2 className="text-2xl font-bold text-gray-900">Modifier l'article</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Titre</label>
              <input type="text" value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
              <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contenu</label>
            <textarea value={form.contenu} onChange={e => setForm(f => ({ ...f, contenu: e.target.value }))} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meta titre</label>
              <input type="text" value={form.meta_titre} onChange={e => setForm(f => ({ ...f, meta_titre: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meta description</label>
              <input type="text" value={form.meta_description} onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
            <input type="file" accept="image/*" onChange={handleFile} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>
          {imagePreview && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Aperçu de l'image</label>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <img src={imagePreview} alt="Aperçu" className="h-40 w-auto rounded-lg shadow-lg mb-3 object-cover" />
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => { setForm(f => ({ ...f, image: null })); setImagePreview(null); }} className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Retirer l'image
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors">Annuler</button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
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
const ArticleBlogAdmin = () => {
  const { toast, ToastContainer } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [articles, setArticles] = useState<ArticleBlog[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<ArticleBlog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<ArticleBlog | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<ArticleBlog | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<ArticleBlog | null>(null);
  const pagination = usePagination(filteredArticles, 8);
  useEffect(() => { fetchArticles(); }, []);
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await getAllArticleBlogs();
      setArticles(res.data);
      setFilteredArticles(res.data);
    } catch {
      toast({ title: 'Erreur lors du chargement des articles', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredArticles(articles);
      return;
    }
    setLoading(true);
    try {
      const res = await searchArticleBlogs(query);
      setFilteredArticles(res.data);
    } catch {
      toast({ title: 'Erreur lors de la recherche', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [articles, toast]);
  const handleEdit = (article: ArticleBlog) => setArticleToEdit(article);
  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;
    setIsDeleting(true);
    try {
      await deleteArticleBlog(articleToDelete.id);
      setFilteredArticles(prev => prev.filter(f => f.id !== articleToDelete.id));
      setArticles(prev => prev.filter(f => f.id !== articleToDelete.id));
      toast({ title: (
        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-600" /><span>Article "{articleToDelete.titre}" supprimé avec succès</span></div>), type: 'success' });
      setArticleToDelete(null);
    } catch {
      toast({ title: 'Erreur lors de la suppression', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };
  const handleRefresh = () => {
    fetchArticles();
    setSearchQuery('');
    toast({ title: <div className="flex items-center gap-2"><RefreshCw className="w-5 h-5 text-blue-600" /><span>Liste actualisée</span></div>, type: 'success' });
  };
  const handleCreated = () => { handleRefresh(); };
  const stats = [
    { title: 'Total Articles', value: articles.length, icon: FileText, color: 'blue' }
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center"><FileText className="w-8 h-8 text-blue-600 mr-3" /><h1 className="text-2xl font-bold text-gray-900">Gestion des Articles de Blog</h1></div>
            <div className="flex items-center space-x-4">
              <button onClick={handleRefresh} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" title="Actualiser"><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /></button>
              <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"><Plus className="w-5 h-5 mr-2" />Nouvel Article</button>
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
              <input type="text" value={searchQuery} onChange={e => handleSearch(e.target.value)} placeholder="Rechercher par titre, contenu..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"><Filter className="w-4 h-4 mr-2" />Filtrer</button>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" /><p className="text-gray-600">Chargement des articles...</p></div>
        ) : filteredArticles.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun article trouvé</h3>
            <p className="text-gray-600 mb-6">{searchQuery ? 'Aucun résultat pour votre recherche.' : 'Commencez par créer votre premier article.'}</p>
            {!searchQuery && <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"><Plus className="w-5 h-5 mr-2" />Créer un article</button>}
          </div>
        ) : (
          <div className="space-y-6">
            {isMobile ? (
              <ArticlesGrid articles={pagination.currentData} onView={setSelectedArticle} onEdit={handleEdit} onDelete={setArticleToDelete} />
            ) : (
              <ArticlesTable articles={pagination.currentData} onView={setSelectedArticle} onEdit={handleEdit} onDelete={setArticleToDelete} />
            )}
            {pagination.totalPages > 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-2xl">
                  <button onClick={pagination.prevPage} disabled={!pagination.hasPrev} className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft className="w-5 h-5" /></button>
                  {[...Array(pagination.totalPages).keys()].map(page => (
                    <button key={page + 1} onClick={() => pagination.goToPage(page + 1)} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page + 1 === pagination.currentPage ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}`}>{page + 1}</button>
                  ))}
                  <button onClick={pagination.nextPage} disabled={!pagination.hasNext} className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight className="w-5 h-5" /></button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {selectedArticle && <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
      {showCreateModal && <CreateArticleModal onClose={() => setShowCreateModal(false)} onCreated={handleCreated} />}
      {articleToDelete && <DeleteModal article={articleToDelete} onCancel={() => setArticleToDelete(null)} onConfirm={handleDeleteConfirm} loading={isDeleting} />}
      {articleToEdit && <EditArticleModal article={articleToEdit} onClose={() => setArticleToEdit(null)} onUpdated={handleRefresh} />}
    </div>
  );
};

export default ArticleBlogAdmin; 