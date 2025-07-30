import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, Target, TrendingUp, Award, CheckCircle, BookOpen, ArrowRight, X, Clock, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import Chatbot from '@/components/Chatbot';
import { searchServices, Service } from '@/services/services';

// Modal de détail du service
const ServiceDetailModal = ({ service, onClose }: { service: Service | null, onClose: () => void }) => {
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
                  <BookOpen className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-100">
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            <Link to="/contact">
              <Button className="btn-primary">
                Demander un devis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    setLoading(true);
    // On récupère tous les services en cherchant avec une chaîne vide
    searchServices('')
      .then(res => setServices(res.data))
      .catch(() => setError("Erreur lors du chargement des services."))
      .finally(() => setLoading(false));
  }, []);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
  };

  const advantages = [
    {
      icon: Users,
      title: "Équipe d'experts",
      description: "Des consultants expérimentés pour accompagner votre organisation."
    },
    {
      icon: Shield,
      title: "Sécurité & Conformité",
      description: "Des solutions alignées sur les meilleures pratiques internationales."
    },
    {
      icon: Target,
      title: "Approche Personnalisée",
      description: "Des services adaptés à vos besoins spécifiques."
    },
    {
      icon: TrendingUp,
      title: "Résultats Mesurables",
      description: "Des interventions qui génèrent un impact concret et durable."
    }
  ];

  const displayedServices = showAll ? services : services.slice(0, 2);

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        {/* Header avec bannière */}
        <section className="relative min-h-96 flex items-center justify-center overflow-hidden" style={{
          backgroundImage: 'url(/assets/serviceBanner.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          padding: '2rem 0'
        }}>
          {/* Décorations SVG */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            <svg className="absolute top-8 left-10 w-12 h-12 opacity-20 animate-[floatBiscuits_7s_ease-in-out_infinite]" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="4" fill="#fff" />
            </svg>
            <svg className="absolute top-1/3 right-24 w-10 h-10 opacity-10 animate-[floatBiscuits_8s_ease-in-out_infinite]" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="4" fill="#fff" />
            </svg>
            <svg className="absolute bottom-10 left-1/2 w-8 h-8 opacity-10 animate-[floatBiscuits_9s_ease-in-out_infinite]" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="4" fill="#fff" />
            </svg>
          </div>
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-5xl font-bold font-playfair mb-6 animate-slide-up">Nos Services</h1>
            <p className="text-xl text-blue-100 mb-8 animate-slide-up">Découvrez nos solutions pour renforcer votre audit interne et gestion des risques</p>
            <div className="flex justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">10+</div>
                <div className="text-blue-200">Services proposés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-blue-200">Clients satisfaits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">12+</div>
                <div className="text-blue-200">Années d'expérience</div>
              </div>
            </div>
          </div>
        </section>
        <div className="container mx-auto px-4 py-16">
          {/* Avantages */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir nos services ?</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
              {advantages.map((advantage, index) => (
                <Card key={index} className="text-center p-6 shadow-card hover-lift animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <advantage.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold mb-3">{advantage.title}</h3>
                  <p className="text-muted-foreground text-sm">{advantage.description}</p>
                </Card>
              ))}
            </div>
          </section>
          {/* Services dynamiques */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
            {loading ? (
              <div className="text-center text-blue-700 py-10">Chargement...</div>
            ) : error ? (
              <div className="text-center text-red-600 py-10">{error}</div>
            ) : (
              <>
                <div className="grid lg:grid-cols-2 gap-8">
                  {displayedServices.map((service, idx) => (
                    <Card
                      key={service.id}
                      className={`overflow-hidden shadow-float group transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up`}
                      tabIndex={0}
                      aria-label={service.nom}
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.nom}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                            {service.nom}
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {service.description}
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 text-primary mr-2" />
                            {service.categorie}
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 text-primary mr-2" />
                            {service.duree}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-muted-foreground">Tarif</div>
                            <div className="font-bold text-lg">{service.tarif}</div>
                          </div>
                          <Button 
                            className="btn-primary group" 
                            aria-label={`Découvrir le service ${service.nom}`}
                            onClick={() => handleServiceClick(service)}
                          >
                            Découvrir
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {!showAll && services.length > 2 && (
                  <div className="flex justify-center mt-10">
                    <Button className="btn-primary px-8 py-3 text-lg font-bold" onClick={() => setShowAll(true)}>
                      Voir tout
                    </Button>
                  </div>
                )}
              </>
            )}
          </section>
          {/* CTA personnalisée */}
          <section className="text-center">
            <Card className="max-w-4xl mx-auto p-8 bg-gradient-card shadow-elegant relative overflow-hidden">
              {/* Overlay pour améliorer la lisibilité */}
              <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
              
              {/* Contenu avec meilleure lisibilité */}
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4 text-white drop-shadow-lg">
                  Service sur mesure
                </h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto text-lg leading-relaxed drop-shadow-md">
                  Besoin d'un accompagnement spécifique ?
                  <br />
                  Nous concevons des services adaptés à vos enjeux et objectifs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <Button className="btn-primary bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg shadow-lg">
                      Demander un devis
                    </Button>
                  </Link>
                  <Button variant="outline" className="bg-white/90 text-blue-600 border-white hover:bg-white font-semibold px-8 py-3 text-lg shadow-lg">
                    Télécharger la brochure
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        </div>
        {/* Animation keyframes biscuits et fade-in-up */}
        <style>{`
          @keyframes floatBiscuits {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s cubic-bezier(.4,0,.2,1) both;
          }
          
          /* Styles pour améliorer la lisibilité de la section CTA */
          .bg-gradient-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            position: relative;
          }
          
          .bg-gradient-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
            border-radius: inherit;
          }
          
          .drop-shadow-lg {
            filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
          }
          
          .drop-shadow-md {
            filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));
          }
        `}</style>
      </div>
      <Footer />
      <BackToTop />
      <Chatbot />
      {selectedService && (
        <ServiceDetailModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}
    </>
  );
};

export default Services; 