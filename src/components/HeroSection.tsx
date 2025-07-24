import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ArrowRight, Shield, TrendingUp, Users, Award, CheckCircle, Star, ChevronDown, Play, Sparkles } from 'lucide-react';

// Hook pour l'effet machine à écrire amélioré
const useTypewriter = (text, speed = 80) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i > text.length) {
        setIsComplete(true);
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return { displayedText, isComplete };
};

// Composant pour les particules flottantes avancées
const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-br from-blue-400 to-cyan-300"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `float ${particle.duration}s infinite ease-in-out ${particle.delay}s, glow 3s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(-40px) rotate(180deg); }
          75% { transform: translateY(-20px) rotate(270deg); }
        }
        @keyframes glow {
          0% { box-shadow: 0 0 5px currentColor; }
          100% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
        }
      `}</style>
    </div>
  );
};

// Composant pour les ondulations de background
const BackgroundWaves = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0">
        <svg className="absolute bottom-0 left-0 w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
              <stop offset="50%" stopColor="rgba(147, 51, 234, 0.3)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.3)" />
            </linearGradient>
          </defs>
          <path fill="url(#wave-gradient)" d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              values="0 0; -100 0; 0 0"
              dur="20s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
        <svg className="absolute bottom-0 left-0 w-full h-24 opacity-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path fill="rgba(255, 255, 255, 0.1)" d="M0,80 C400,20 800,100 1200,40 L1200,120 L0,120 Z">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              values="0 0; 100 0; 0 0"
              dur="15s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    </div>
  );
};

// Composant pour les éléments géométriques animés
const GeometricElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Cercles concentriques 3D */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-700/30 via-blue-400/10 to-cyan-400/10 shadow-2xl blur-2xl animate-pulse" style={{ filter: 'blur(32px)' }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-4 border-blue-400/20 shadow-xl animate-spin-slow" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full border-2 border-cyan-300/30 animate-spin-reverse" />
      </div>

      {/* Polygones et formes abstraites */}
      <svg className="absolute top-24 left-32 w-32 h-32 opacity-40 animate-float-slow" viewBox="0 0 100 100">
        <polygon points="50,10 90,40 75,90 25,90 10,40" fill="url(#poly-blue)" />
        <defs>
          <linearGradient id="poly-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
      <svg className="absolute bottom-32 right-40 w-24 h-24 opacity-30 animate-float" viewBox="0 0 100 100">
        <ellipse cx="50" cy="50" rx="40" ry="20" fill="url(#ellipse-blue)" />
        <defs>
          <linearGradient id="ellipse-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>
      <svg className="absolute top-1/4 right-1/4 w-20 h-20 opacity-20 animate-float-reverse" viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" rx="18" fill="url(#rect-blue)" />
        <defs>
          <linearGradient id="rect-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>

      {/* Lignes dynamiques améliorées */}
      <div className="absolute top-0 left-0 w-full h-full">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.10" />
            </linearGradient>
          </defs>
          <path
            stroke="url(#line-gradient)"
            strokeWidth="0.4"
            fill="none"
            d="M0,50 Q25,20 50,50 T100,30"
            opacity="0.7"
          >
            <animate
              attributeName="d"
              values="M0,50 Q25,20 50,50 T100,30;M0,30 Q25,60 50,30 T100,50;M0,50 Q25,20 50,50 T100,30"
              dur="8s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 18s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 24s linear infinite; }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-slow { animation: float 14s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 10s ease-in-out infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes spin-reverse { 100% { transform: rotate(-360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-24px); } }
        @keyframes float-slow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-40px); } }
        @keyframes float-reverse { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(24px); } }
      `}</style>
    </div>
  );
};

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  // Gestion du mouvement de souris pour les effets parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slides = [
    {
      title: "Excellence en Audit Interne",
      subtitle: "Expertise Certifiée CIA • Innovation • Performance",
      description: "Transformez vos processus d'audit avec notre expertise de plus de 12 ans. Solutions sur mesure pour une gouvernance d'entreprise optimale.",
      cta_primary: { label: "Découvrir nos Services", action: "#services" },
      cta_secondary: { label: "Découvrir nos Formations", action: "#formations" },
      stats: [
        { value: "12+", label: "Années d'Expérience" },
        { value: "500+", label: "Clients Satisfaits" },
        { value: "98%", label: "Taux de Satisfaction" }
      ],
      gradient: "from-blue-600 via-blue-500 to-blue-800"
    },
    {
      title: "Formation CIA Certifiante",
      subtitle: "Devenez Auditeur Interne Certifié • 6 Mois • Réussite Garantie",
      description: "Programme intensif et personnalisé pour obtenir votre certification CIA. Méthode éprouvée avec 95% de réussite au premier passage.",
      cta_primary: { label: "Programme CIA", action: "#formation-cia" },
      cta_secondary: { label: "Télécharger Brochure", action: "#brochure" },
      stats: [
        { value: "95%", label: "Taux de Réussite" },
        { value: "6", label: "Mois de Formation" },
        { value: "24/7", label: "Support Inclus" }
      ],
      gradient: "from-blue-700 via-blue-400 to-cyan-500"
    },
    {
      title: "Conseil Stratégique sur Mesure",
      subtitle: "Cartographie des Risques • Gouvernance • Optimisation",
      description: "Accompagnement personnalisé pour structurer et optimiser vos fonctions d'audit interne. Solutions adaptées à votre secteur d'activité.",
      cta_primary: { label: "Audit sur Mesure", action: "#conseil" },
      cta_secondary: { label: "Cas d'Études", action: "#portfolio" },
      stats: [
        { value: "360°", label: "Approche Globale" },
        { value: "15+", label: "Secteurs Couverts" },
        { value: "ROI", label: "Mesurable" }
      ],
      gradient: "from-blue-800 via-blue-500 to-cyan-600"
    }
  ];

  const features = [
    { 
      icon: Award, 
      label: "Certification CIA", 
      color: "text-blue-300",
      gradient: "from-blue-400 via-blue-500 to-cyan-400",
      description: "Expertise certifiée"
    },
    { 
      icon: TrendingUp, 
      label: "Croissance", 
      color: "text-blue-400",
      gradient: "from-blue-500 via-blue-400 to-cyan-500",
      description: "Résultats mesurables"
    },
    { 
      icon: Users, 
      label: "Formation", 
      color: "text-blue-200",
      gradient: "from-blue-300 via-blue-400 to-cyan-300",
      description: "Accompagnement continu"
    },
    { 
      icon: Shield, 
      label: "Sécurité", 
      color: "text-blue-400",
      gradient: "from-blue-400 via-blue-500 to-cyan-500",
      description: "Conformité garantie"
    }
  ];

  const { displayedText: currentTitle, isComplete } = useTypewriter(slides[currentSlide].title, 60);

  // Effet de parallax pour les éléments
  const parallaxStyle = {
    transform: `translate(${(mousePosition.x - 0.5) * 20}px, ${(mousePosition.y - 0.5) * 20}px)`,
  };

  // Gestion du slider d'images de fond
  const heroImages = [
    '/src/assets/hero-image.jpg',
    '/src/assets/hero-image2.jpg',
    '/src/assets/hero-image3.jpg',
  ];

  return (
    <section 
      ref={heroRef}
      className={`relative min-h-screen w-full flex items-center bg-gradient-to-br ${slides[currentSlide].gradient} text-white overflow-hidden transition-all duration-1000 ease-in-out`}
    >
      {/* Slider d'images de fond animé */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt={`Hero background ${idx + 1}`}
            className={`w-full h-full object-cover object-center select-none pointer-events-none transition-opacity duration-1000 absolute inset-0 ${currentSlide === idx ? 'opacity-30' : 'opacity-0'}`}
            draggable="false"
            style={{ zIndex: idx + 1, transition: 'opacity 1s cubic-bezier(0.4,0,0.2,1)' }}
          />
        ))}
      </div>
      
      {/* Background Elements */}
      <FloatingParticles />
      <BackgroundWaves />
      <GeometricElements />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-repeat bg-center animate-pulse" 
             style={{ 
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M40 0L40 40L0 40z'/%3E%3Cpath d='M40 40L80 40L80 80L40 80z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '80px 80px'
             }} 
        />
      </div>

      {/* Dynamic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/30 animate-pulse" style={{ animationDuration: '4s' }} />

      <div className="container mx-auto px-4 py-20 relative z-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Section Gauche - Contenu */}
          <div className={`space-y-8 transform transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            
            {/* Titre principal avec effet typewriter amélioré */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-serif leading-tight min-h-[200px] md:min-h-[240px]">
                <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent drop-shadow-2xl">
                  {currentTitle}
                </span>
                {!isComplete && (
                  <span className="inline-block w-1 h-12 bg-gradient-to-b from-blue-400 to-cyan-400 ml-2 animate-pulse shadow-lg" />
                )}
              </h1>
              
              <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-blue-100/90 leading-relaxed animate-slideInUp">
                <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                  {slides[currentSlide].subtitle}
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-blue-50/90 leading-relaxed max-w-2xl animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                {slides[currentSlide].description}
              </p>
            </div>

            {/* Boutons CTA améliorés */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group relative overflow-hidden bg-gradient-to-r from-white to-blue-100 text-gray-900 px-6 py-2 rounded-lg font-semibold text-base shadow-lg hover:shadow-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                  <Play className="w-4 h-4" />
                  {slides[currentSlide].cta_primary.label}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
              <button className="group relative overflow-hidden border border-white/40 text-white px-6 py-2 rounded-lg font-medium text-base backdrop-blur-md hover:border-white/80 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">
                  {slides[currentSlide].cta_secondary.label}
                </span>
              </button>
            </div>
          </div>

          {/* Section Droite - Visuel 3D amélioré */}
          <div className={`hidden lg:flex justify-center items-center transform transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="relative w-[500px] h-[500px] flex items-center justify-center" style={parallaxStyle}>
              
              {/* Cercles de profondeur 3D améliorés */}
              <div className="absolute inset-0">
                <div className="absolute inset-4 rounded-full border-2 border-blue-400/20 shadow-2xl animate-spin-slow" />
                <div className="absolute inset-12 rounded-full border-2 border-cyan-300/10 animate-spin-reverse" />
                <div className="absolute inset-20 rounded-full border border-blue-200/10" />
                <div className="absolute inset-32 rounded-full bg-gradient-to-br from-blue-400/10 to-cyan-400/10 blur-2xl" />
              </div>
              
              {/* Élément central avec glass morphism */}
              <div className="relative w-80 h-80 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden group hover:scale-105 transition-all duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500">
                      <Award className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Expertise CIA</h3>
                    <p className="text-blue-200 text-sm px-4">Certification internationale en audit interne</p>
                    <div className="flex justify-center gap-1 pt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-blue-300 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Éléments flottants décoratifs */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full shadow-2xl animate-pulse flex items-center justify-center">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateurs de slide améliorés */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`relative w-12 h-3 rounded-full transition-all duration-500 ${
              index === currentSlide 
                ? 'bg-white scale-110 shadow-lg' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Slide ${index + 1}`}
          >
            {index === currentSlide && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-80" />
            )}
          </button>
        ))}
      </div>

      {/* Scroll indicator amélioré */}
      <div className="absolute bottom-8 right-8 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center hover:border-white transition-colors duration-300 cursor-pointer">
          <ChevronDown className="w-4 h-4 text-white/70 mt-2 animate-pulse" />
        </div>
      </div>

      {/* CSS personnalisé pour les animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        .animate-slideInUp {
          animation: slideInUp 1s ease-out;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;