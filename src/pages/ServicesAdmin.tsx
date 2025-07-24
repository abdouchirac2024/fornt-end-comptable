import React, { useState } from 'react';
import { searchServices, Service } from '@/services/services';
import { Card } from '@/components/ui/card';
import { Loader2, Search } from 'lucide-react';

const ServicesAdmin = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await searchServices(query);
      setResults(res.data);
    } catch {
      setError("Erreur lors de la recherche de services.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Recherche de services</h2>
      <form onSubmit={handleSearch} className="flex items-center gap-3 mb-8 max-w-xl">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher un service..."
          className="flex-1 px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white text-blue-900 placeholder:text-blue-400 shadow-sm transition-all"
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow transition-all text-lg"
          disabled={loading || !query.trim()}
        >
          <Search className="w-5 h-5" />
          Chercher
        </button>
      </form>
      <Card className="overflow-x-auto p-0">
        {loading ? (
          <div className="py-10 text-center text-blue-600">
            <Loader2 className="animate-spin inline mr-2" /> Recherche en cours...
          </div>
        ) : error ? (
          <div className="py-10 text-center text-red-600">{error}</div>
        ) : searched && results.length === 0 ? (
          <div className="py-10 text-center text-blue-700">Aucun service trouvé.</div>
        ) : results.length > 0 ? (
          <table className="min-w-full divide-y divide-blue-100 text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-blue-700 uppercase">Nom</th>
                <th className="px-4 py-3 text-left font-semibold text-blue-700 uppercase">Description</th>
                <th className="px-4 py-3 text-left font-semibold text-blue-700 uppercase">Catégorie</th>
                <th className="px-4 py-3 text-left font-semibold text-blue-700 uppercase">Tarif</th>
                <th className="px-4 py-3 text-left font-semibold text-blue-700 uppercase">Durée</th>
                <th className="px-4 py-3 text-left font-semibold text-blue-700 uppercase">Image</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-50">
              {results.map(service => (
                <tr key={service.id} className="hover:bg-blue-50 transition">
                  <td className="px-4 py-3 whitespace-nowrap font-semibold text-blue-900">{service.nom}</td>
                  <td className="px-4 py-3 max-w-xs truncate" title={service.description}>{service.description}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{service.categorie}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{service.tarif}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{service.duree}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {service.image && (
                      <img src={service.image} alt={service.nom} className="h-10 w-10 object-cover rounded shadow border border-blue-100" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </Card>
    </div>
  );
};

export default ServicesAdmin; 