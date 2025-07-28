import React, { useState, useEffect, useCallback } from 'react';
import { 
  Eye, Pencil, Trash2, X, Search, CheckCircle2, 
  Plus, Filter, Download, RefreshCw, ChevronLeft, ChevronRight,
  Calendar, Clock, Mail, User, Loader2, MessageSquare, Phone,
  Send, Archive, Star, AlertCircle
} from 'lucide-react';

import {
  getContacts,
  getContactById,
  Contact,
  deleteContact,
  replyToContact
} from '@/services/contact';

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
const usePagination = (data: Contact[], itemsPerPage: number = 8) => {
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
const ContactModal = ({ contact, onClose }: { contact: Contact | null, onClose: () => void }) => {
  if (!contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Détails du contact</h2>
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
              <div className="bg-blue-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{contact.nom}</h3>
                    <p className="text-blue-600 font-medium">{contact.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Sujet</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{contact.sujet}</p>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Message</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{contact.message}</p>
                </div>
              </div>

              {contact.reponse && (
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Réponse</label>
                  <div className="mt-2 p-4 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{contact.reponse}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <label className="text-sm font-semibold text-gray-600">Date de contact</label>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {contact.created_at ? new Date(contact.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <label className="text-sm font-semibold text-blue-600">Statut</label>
                  </div>
                  <p className="text-blue-900 font-medium">
                    {contact.reponse ? (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        Répondu
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-orange-600">
                        <AlertCircle className="w-4 h-4" />
                        En attente
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-full max-w-md bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Informations de contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <User className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Nom</p>
                      <p className="font-medium text-gray-900">{contact.nom}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Sujet</p>
                      <p className="font-medium text-gray-900">{contact.sujet}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de réponse
const ReplyModal = ({ contact, onClose, onSuccess }: { contact: Contact | null, onClose: () => void, onSuccess: (updatedContact: Contact) => void }) => {
  const { toast } = useToast();
  const [reponse, setReponse] = useState('');
  const [loading, setLoading] = useState(false);

  if (!contact) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reponse.trim()) {
      toast({
        title: (
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span>Veuillez saisir une réponse.</span>
          </div>
        ),
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const updatedContact = await replyToContact(contact.id, reponse);
      onSuccess(updatedContact);
      onClose();
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>Réponse envoyée avec succès !</span>
          </div>
        ),
        type: "success",
      });
    } catch (error) {
      toast({
        title: (
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span>Impossible d'envoyer la réponse.</span>
          </div>
        ),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Répondre au contact</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3">Message original :</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Nom :</span> {contact.nom}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Email :</span> {contact.email}
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Sujet :</span> {contact.sujet}
              </div>
              <div className="mt-3">
                <span className="font-medium">Message :</span>
                <div className="bg-white p-3 rounded-lg border text-gray-700 whitespace-pre-line mt-1">{contact.message}</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reponse" className="block text-sm font-semibold text-gray-700 mb-2">
                Votre réponse :
              </label>
              <textarea
                id="reponse"
                value={reponse}
                onChange={(e) => setReponse(e.target.value)}
                placeholder="Tapez votre réponse ici..."
                className="w-full h-32 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 shadow-sm transition-all resize-none"
                disabled={loading}
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={loading || !reponse.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer la réponse
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Modal de suppression
const DeleteModal = ({ contact, onCancel, onConfirm, loading }: { contact: Contact | null, onCancel: () => void, onConfirm: () => void, loading: boolean }) => {
  if (!contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">Supprimer le contact</h2>
          <p className="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer le contact de <span className="font-semibold text-gray-900">"{contact.nom}"</span> ?
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

// Tableau des contacts
const ContactsTable = ({ contacts, onView, onReply, onDelete }: {
  contacts: Contact[]; onView: (contact: Contact) => void; onReply: (contact: Contact) => void; onDelete: (contact: Contact) => void;
}) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
    <table className="w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Contact</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Sujet</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-2/6">Message</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Date</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/12">Statut</th>
          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {contacts.map((contact) => (
          <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{contact.nom}</div>
                  <div className="text-xs text-gray-500 truncate">{contact.email}</div>
                </div>
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="text-sm font-medium text-gray-900 truncate">{contact.sujet}</div>
            </td>
            <td className="px-4 py-3">
              <div className="text-sm text-gray-900 truncate pr-2" title={contact.message}>
                {contact.message}
              </div>
            </td>
            <td className="px-4 py-3 text-sm text-gray-900">
              {contact.created_at ? new Date(contact.created_at).toLocaleDateString('fr-FR') : '-'}
            </td>
            <td className="px-4 py-3">
              {contact.reponse ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle2 className="w-3 h-3" />
                  Répondu
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  <AlertCircle className="w-3 h-3" />
                  En attente
                </span>
              )}
            </td>
            <td className="px-4 py-3 text-center">
              <div className="flex items-center justify-center space-x-1">
                <button onClick={() => onView(contact)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Voir"><Eye className="w-4 h-4" /></button>
                {!contact.reponse && (
                  <button onClick={() => onReply(contact)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Répondre"><Send className="w-4 h-4" /></button>
                )}
                <button onClick={() => onDelete(contact)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Grille des contacts (mobile)
const ContactsGrid = ({ contacts, onView, onReply, onDelete }: {
  contacts: Contact[]; onView: (contact: Contact) => void; onReply: (contact: Contact) => void; onDelete: (contact: Contact) => void;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {contacts.map((contact) => (
      <div key={contact.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{contact.nom}</h3>
                <p className="text-blue-600 text-sm">{contact.email}</p>
              </div>
            </div>
            {contact.reponse ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle2 className="w-3 h-3" />
                Répondu
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                <AlertCircle className="w-3 h-3" />
                En attente
              </span>
            )}
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-1">{contact.sujet}</h4>
            <p className="text-gray-600 text-sm line-clamp-2">{contact.message}</p>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {contact.created_at ? new Date(contact.created_at).toLocaleDateString('fr-FR') : '-'}
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-2">
            <button onClick={() => onView(contact)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Voir"><Eye className="w-5 h-5" /></button>
            {!contact.reponse && (
              <button onClick={() => onReply(contact)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Répondre"><Send className="w-5 h-5" /></button>
            )}
            <button onClick={() => onDelete(contact)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer"><Trash2 className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Composant principal
const ContactsAdmin = () => {
  const { toast, ToastContainer } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [contactToReply, setContactToReply] = useState<Contact | null>(null);

  const pagination = usePagination(filteredContacts, 8);

  // Charger les contacts au montage
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await getContacts(1);
      setContacts(res.data);
      setFilteredContacts(res.data);
    } catch {
      toast({ title: 'Erreur lors du chargement des contacts', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredContacts(contacts);
      return;
    }
    
    const filtered = contacts.filter(contact =>
      contact.nom.toLowerCase().includes(query.toLowerCase()) ||
      contact.email.toLowerCase().includes(query.toLowerCase()) ||
      contact.sujet.toLowerCase().includes(query.toLowerCase()) ||
      contact.message.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [contacts]);

  const handleReply = (contact: Contact) => setContactToReply(contact);

  const handleReplySuccess = (updatedContact: Contact) => {
    setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
    setFilteredContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
    setContactToReply(null);
  };

  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return;
    setIsDeleting(true);
    try {
      await deleteContact(contactToDelete.id);
      setFilteredContacts(prev => prev.filter(c => c.id !== contactToDelete.id));
      setContacts(prev => prev.filter(c => c.id !== contactToDelete.id));
      toast({ 
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>Contact "{contactToDelete.nom}" supprimé avec succès</span>
          </div>
        ), 
        type: 'success' 
      });
      setContactToDelete(null);
    } catch {
      toast({ title: 'Erreur lors de la suppression', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = () => {
    fetchContacts();
    setSearchQuery('');
    toast({ 
      title: (
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-blue-600" />
          <span>Liste actualisée</span>
        </div>
      ), 
      type: 'success' 
    });
  };

  const repliedContacts = contacts.filter(c => c.reponse).length;
  const pendingContacts = contacts.filter(c => !c.reponse).length;
  const totalContacts = contacts.length;

  const stats = [
    { title: 'Total Contacts', value: totalContacts, icon: MessageSquare, color: 'blue' },
    { title: 'Répondus', value: repliedContacts, icon: CheckCircle2, color: 'green' },
    { title: 'En attente', value: pendingContacts, icon: AlertCircle, color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Contacts</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={handleRefresh} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" title="Actualiser">
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => handleSearch(e.target.value)} 
                placeholder="Rechercher par nom, email, sujet ou message..." 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Chargement des contacts...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun contact trouvé</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Aucun résultat pour votre recherche.' : 'Aucun contact reçu pour le moment.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {isMobile ? (
              <ContactsGrid 
                contacts={pagination.currentData} 
                onView={setSelectedContact} 
                onReply={handleReply} 
                onDelete={setContactToDelete} 
              />
            ) : (
              <ContactsTable 
                contacts={pagination.currentData} 
                onView={setSelectedContact} 
                onReply={handleReply} 
                onDelete={setContactToDelete} 
              />
            )}
            {pagination.totalPages > 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <Pagination 
                  currentPage={pagination.currentPage} 
                  totalPages={pagination.totalPages} 
                  onPageChange={pagination.goToPage} 
                  totalItems={pagination.totalItems} 
                  startIndex={pagination.startIndex} 
                  endIndex={pagination.endIndex} 
                />
              </div>
            )}
          </div>
        )}
      </div>

      {selectedContact && <ContactModal contact={selectedContact} onClose={() => setSelectedContact(null)} />}
      {contactToDelete && (
        <DeleteModal
          contact={contactToDelete}
          onCancel={() => setContactToDelete(null)}
          onConfirm={handleDeleteConfirm}
          loading={isDeleting}
        />
      )}
      {contactToReply && (
        <ReplyModal
          contact={contactToReply}
          onClose={() => setContactToReply(null)}
          onSuccess={handleReplySuccess}
        />
      )}
    </div>
  );
};

export default ContactsAdmin; 