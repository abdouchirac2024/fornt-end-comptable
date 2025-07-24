import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';

import PartnersSection from '@/components/PartnersSection';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import Chatbot from '@/components/Chatbot';
import { getAllFormations, Formation } from '@/services/formations';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllFormations()
      .then(res => setFormations(res.data))
      .catch(() => setError("Erreur lors du chargement des formations."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      {/* (SUPPRIMÉ) Section Nos Formations Clés dynamique */}
      <ServicesSection />
      <PartnersSection />
      <Footer />
      <BackToTop />
      <Chatbot />
    </div>
  );
};

export default Index;
