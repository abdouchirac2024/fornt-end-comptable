import React, { useEffect, useState } from 'react';
import { getContacts, getContactById, Contact, deleteContact } from '@/services/contact';
import { Card } from '@/components/ui/card';
import { Loader2, Eye, Pencil, Trash2, X } from 'lucide-react';

const ContactModal = ({ contact, onClose }: { contact: Contact | null, onClose: () => void }) => {
  if (!contact) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full relative animate-fade-in border border-blue-100">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition" title="Fermer">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-extrabold text-blue-900 mb-6 text-center tracking-tight">Détail du contact</h2>
        <div className="space-y-4 text-left">
          <div>
            <span className="block text-xs font-bold text-blue-500 uppercase mb-0.5">Nom</span>
            <span className="text-base font-semibold text-blue-900">{contact.nom}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-blue-500 uppercase mb-0.5">Email</span>
            <span className="text-base text-blue-800">{contact.email}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-blue-500 uppercase mb-0.5">Sujet</span>
            <span className="text-base text-blue-800">{contact.sujet}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-blue-500 uppercase mb-0.5">Message</span>
            <span className="text-sm text-gray-700 whitespace-pre-line block bg-blue-50 rounded-lg p-2 mt-0.5">{contact.message}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-blue-500 uppercase mb-0.5">Date</span>
            <span className="text-base text-blue-800">{contact.created_at ? new Date(contact.created_at).toLocaleString() : '-'}</span>
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

const DeleteModal = ({ contact, onCancel, onConfirm, loading }: { contact: Contact | null, onCancel: () => void, onConfirm: () => void, loading: boolean }) => {
  if (!contact) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full relative animate-fade-in border border-red-100">
        <button onClick={onCancel} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition" title="Fermer">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-extrabold text-red-700 mb-6 text-center tracking-tight">Suppression d'un contact</h2>
        <div className="mb-6 text-center text-gray-700">
          Vous êtes sur le point de supprimer le contact <span className="font-bold text-blue-700">{contact.nom}</span>.<br/>
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

const ContactsAdmin = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);
  const [viewContact, setViewContact] = useState<Contact | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteContactId, setDeleteContactId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteContactObj, setDeleteContactObj] = useState<Contact | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getContacts(page)
      .then(res => {
        setContacts(res.data);
        setMeta(res.meta);
      })
      .catch(() => setError("Erreur lors du chargement des contacts."))
      .finally(() => setLoading(false));
  }, [page]);

  // Filtrage côté front (nom, email, sujet, message)
  const filteredContacts = contacts.filter(c =>
    c.nom.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.sujet.toLowerCase().includes(search.toLowerCase()) ||
    c.message.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = async (id: number) => {
    setModalLoading(true);
    try {
      const contact = await getContactById(id);
      setViewContact(contact);
    } catch {
      setError("Erreur lors de la récupération du contact.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteClick = (contact: Contact) => {
    setDeleteContactId(contact.id);
    setDeleteContactObj(contact);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteContactId) return;
    setDeleteLoading(true);
    try {
      await deleteContact(deleteContactId);
      setContacts((prev) => prev.filter((c) => c.id !== deleteContactId));
      setDeleteContactId(null);
      setDeleteContactObj(null);
    } catch {
      setError("Erreur lors de la suppression du contact.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteContactId(null);
    setDeleteContactObj(null);
  };

  return (
    <div className="w-full animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Liste des contacts</h2>
      <div className="flex items-center gap-3 mb-6 max-w-xl w-full px-2 sm:px-0">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un contact..."
          className="flex-1 px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white text-blue-900 placeholder:text-blue-400 shadow-sm transition-all text-base sm:text-lg"
        />
      </div>
      <Card className="overflow-x-auto p-0 rounded-2xl shadow-md">
        <div className="min-w-full">
          <table className="min-w-full divide-y divide-blue-100 text-sm md:text-base">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-2 py-2 md:px-4 md:py-3 text-left font-semibold text-blue-700 uppercase whitespace-nowrap">Nom</th>
                <th className="px-2 py-2 md:px-4 md:py-3 text-left font-semibold text-blue-700 uppercase whitespace-nowrap">Email</th>
                <th className="px-2 py-2 md:px-4 md:py-3 text-left font-semibold text-blue-700 uppercase whitespace-nowrap">Sujet</th>
                <th className="px-2 py-2 md:px-4 md:py-3 text-left font-semibold text-blue-700 uppercase whitespace-nowrap">Message</th>
                <th className="px-2 py-2 md:px-4 md:py-3 text-left font-semibold text-blue-700 uppercase whitespace-nowrap">Date</th>
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
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-blue-700">Aucun contact trouvé.</td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-blue-50 transition">
                    <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">{contact.nom}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">{contact.email}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">{contact.sujet}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 max-w-xs truncate" title={contact.message}>{contact.message}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">{contact.created_at ? new Date(contact.created_at).toLocaleDateString() : '-'}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap text-center">
                      <button
                        className="inline-flex items-center justify-center p-1 rounded hover:bg-blue-100 text-blue-700 mr-1"
                        title="Voir"
                        onClick={() => handleView(contact.id)}
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
                        onClick={() => handleDeleteClick(contact)}
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
        {/* Pagination simple */}
        {meta && meta.last_page > 1 && (
          <div className="flex justify-end items-center gap-2 p-4">
            <button
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              Précédent
            </button>
            <span className="text-blue-700 font-medium">Page {page} / {meta.last_page}</span>
            <button
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={page >= meta.last_page}
            >
              Suivant
            </button>
          </div>
        )}
      </Card>
      {/* Modale de vue contact */}
      {viewContact && (
        <ContactModal contact={viewContact} onClose={() => setViewContact(null)} />
      )}
      {/* Modale de suppression */}
      {deleteContactObj && (
        <DeleteModal
          contact={deleteContactObj}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default ContactsAdmin; 