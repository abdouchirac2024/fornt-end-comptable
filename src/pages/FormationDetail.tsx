import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Star, CheckCircle, Download, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getFormationById, Formation } from '@/services/formations';

const FormationDetail = () => {
  const { id } = useParams();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getFormationById(Number(id))
      .then(setFormation)
      .catch(() => setError("Formation non trouvée"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20 text-blue-700">Chargement...</div>;
  if (error || !formation) return <div className="text-center py-20 text-red-600">Formation non trouvée</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative h-96 overflow-hidden">
          <img
            src={formation.image}
            alt={formation.nom}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
          <div className="absolute bottom-8 left-0 right-0 z-10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-playfair">
                  {formation.nom}
                </h1>
                <p className="text-xl text-blue-100 mb-6">
                  {formation.description}
                </p>
                <div className="flex items-center space-x-6 text-white/90">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {formation.duree}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    --
                  </div>
                  {/* <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-400 fill-current" />
                    {formation.rating}
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="container mx-auto px-4 py-16">
          {/* Navigation */}
          <div className="mb-8">
            <Link to="/formations">
              <Button variant="outline" className="group">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Retour aux formations
              </Button>
            </Link>
          </div>
          <div className="lg:flex lg:space-x-8">
            {/* Contenu principal */}
            <div className="lg:w-2/3">
              {/* Description */}
              <Card className="shadow-elegant p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {formation.description}
                </p>
              </Card>
            </div>
            {/* Sidebar */}
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              {/* Inscription */}
              <Card className="shadow-card p-6 mb-8 sticky top-8">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formation.tarif}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    par participant
                  </div>
                </div>
                <div className="space-y-3">
                  <Button className="w-full btn-primary">
                    S'inscrire maintenant
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le programme
                  </Button>
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-semibold mb-3">Besoin d'informations ?</h4>
                  <div className="space-y-3">
                    <a href="tel:+33786800975" className="flex items-center text-sm text-muted-foreground hover:text-primary">
                      <Phone className="h-4 w-4 mr-2" />
                      +33 786 800 975
                    </a>
                    <a href="mailto:support@cabinetaudit.cm" className="flex items-center text-sm text-muted-foreground hover:text-primary">
                      <Mail className="h-4 w-4 mr-2" />
                      support@cabinetaudit.cm
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
        {/* CTA */}
        <section className="py-16 bg-gradient-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à transformer votre carrière ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Rejoignez nos formations et développez votre expertise en audit interne
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-primary hover:bg-gray-100">
                S'inscrire maintenant
              </Button>
              <Link to="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default FormationDetail;