import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, Target, TrendingUp, Award, CheckCircle, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import Chatbot from '@/components/Chatbot';
import { searchServices, Service } from '@/services/services';

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    // On récupère tous les services en cherchant avec une chaîne vide
    searchServices('')
      .then(res => setServices(res.data))
      .catch(() => setError("Erreur lors du chargement des services."))
      .finally(() => setLoading(false));
  }, []);

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
                          {/* Lien vers une page de détail si besoin */}
                          {/* <Link to={`/services/${service.id}`}> */}
                          <Button className="btn-primary group" aria-label={`Découvrir le service ${service.nom}`}>
                            Découvrir
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                          {/* </Link> */}
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
            <Card className="max-w-4xl mx-auto p-8 bg-gradient-card shadow-elegant">
              <h3 className="text-2xl font-bold mb-4">Service sur mesure</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Besoin d'un accompagnement spécifique ?
                Nous concevons des services adaptés à vos enjeux et objectifs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button className="btn-primary">
                    Demander un devis
                  </Button>
                </Link>
                <Button variant="outline">
                  Télécharger la brochure
                </Button>
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
        `}</style>
      </div>
      <Footer />
      <BackToTop />
      <Chatbot />
    </>
  );
};

export default Services; 