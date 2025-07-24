import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Shield, Award, Users, BookOpen, TrendingUp, ChevronRight, 
  Zap, ArrowUpRight, Check, Target, Sparkles
} from 'lucide-react';

// Importez vos images
import group4258 from '@/assets/about/Group 4258.png';
import bg1 from '@/assets/about/bg-accompagnement1.png';
import bg2 from '@/assets/about/bg-accompagnement2.png';
import bg3 from '@/assets/about/bg-accompagnement3.png';

// --- COMPOSANT DE COMPTEUR ANIMÉ ---
const AnimatedCounter = ({ to }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const end = parseInt(String(to).replace(/[^0-9]/g, '')) || 0;
    
    const controls = new AbortController();
    const duration = 2000;
    let startTimestamp = null;
    
    const step = (currentTime) => {
      if (controls.signal.aborted) return;
      if (startTimestamp === null) startTimestamp = currentTime;
      const progress = Math.min((currentTime - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);

    return () => controls.abort();
  }, [isInView, to]);

  return <span ref={ref}>{count}</span>;
};

// --- COMPOSANTS DE STRUCTURE ANIMÉS ---
const AnimatedContainer = ({ children, className = '', stagger = 0.1 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{ visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 100 } }
};

// --- COMPOSANT DE CARTE DE STATISTIQUE ---
const StatCard = ({ stat }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 50, rotateX: -30 },
      visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: 'spring', damping: 15, stiffness: 100 } }
    }}
    className="relative group text-center"
  >
    <div className="relative bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-center items-center">
      <div className="absolute -top-6 w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300">
        <stat.icon className="h-8 w-8 text-white" />
      </div>
      <div className="pt-10">
        <h3 className="text-5xl font-extrabold text-slate-800 tracking-tighter mb-1">
          {stat.number === '∞' ? '∞' : (
            <>
              <AnimatedCounter to={stat.number} />
              <span>{stat.suffix}</span>
            </>
          )}
        </h3>
        <p className="text-sm font-bold text-slate-600">{stat.label}</p>
        <p className="text-xs text-slate-400 font-medium">{stat.sublabel}</p>
      </div>
    </div>
  </motion.div>
);


// --- COMPOSANT PRINCIPAL ---
const AboutSection = () => {
  const bgImages = [bg1, bg2, bg3];
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bgImages.length]);

  const strengths = [
    { icon: Award, title: "Expertise Technique Reconnue", description: "Certifications, pratiques réelles et approche normalisée." },
    { icon: BookOpen, title: "Pédagogie Claire et Structurée", description: "Conçue pour les professionnels et les futurs certifiés." },
    { icon: Users, title: "Souplesse et Proximité", description: "Une offre adaptée à chaque organisation, quelle que soit sa taille." }
  ];
  const stats = [
    { number: "12", suffix: "+", label: "Années", sublabel: "d'expérience", icon: TrendingUp },
    { number: "CIA", suffix: "", label: "Certified", sublabel: "Internal Auditor", icon: Award },
    { number: "100", suffix: "%", label: "Sur Mesure", sublabel: "pour chaque client", icon: Target },
    { number: "∞", suffix: "", label: "Excellence", sublabel: "comme objectif", icon: Sparkles }
  ];
  const accompagnements = [
    { title: "Professionnels & Étudiants", description: "Pour la préparation aux certifications (CIA, etc.) ou le perfectionnement en audit.", icon: Award, },
    { title: "Entreprises", description: "Pour un appui ponctuel ou une structuration durable de l'audit interne et de la gestion des risques.", icon: Shield, }
  ];

  return (
    <section id="about" className="relative py-20 lg:py-28 bg-slate-50 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-sky-50 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-tl from-blue-50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* SECTION 1 : HÉROS */}
        <AnimatedContainer className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-24 lg:mb-32">
          <motion.div variants={itemVariants} className="relative mx-auto lg:mx-0">
            <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-sky-200 to-blue-200 rounded-3xl transform -rotate-3" />
            <img src={group4258} alt="Illustration d'une équipe professionnelle" className="relative w-full max-w-md rounded-3xl shadow-2xl" />
          </motion.div>
          <div className="text-center lg:text-left">
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900 tracking-tighter mb-6">
              Un cabinet <span className="text-sky-600">jeune,</span> porté par une expertise <span className="text-sky-600">solide.</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg lg:text-xl text-slate-600 leading-relaxed">
              Créé pour répondre aux besoins concrets des entreprises en matière d’audit, de gestion des risques et de formation spécialisée.
            </motion.p>
          </div>
        </AnimatedContainer>

        {/* SECTION 2 : EXPERTISE & FORCES */}
        <AnimatedContainer className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start mb-24 lg:mb-32">
          {/* Carte Fondateur */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-slate-800 text-white rounded-3xl p-8 lg:p-10 shadow-2xl shadow-slate-900/20 h-full">
            <h3 className="text-2xl font-bold mb-4">Une expertise fondée sur l'expérience</h3>
            <ul className="space-y-3">
              {[
                "12+ années d'expérience en audit interne & externe.",
                "Détenteur de la certification CIA.",
                "Mémorialiste en expertise comptable.",
                "Ancien responsable formation en cabinet d'audit."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-sky-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          {/* Cartes Forces */}
          <div className="lg:col-span-3 space-y-6">
            {strengths.map((strength, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-sky-100 border border-sky-200 rounded-xl flex items-center justify-center">
                    <strength.icon className="h-6 w-6 text-sky-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{strength.title}</h4>
                    <p className="text-sm text-slate-600">{strength.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedContainer>

        {/* SECTION 3 : STATISTIQUES */}
        <AnimatedContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24 lg:mb-32 pt-8">
          {stats.map((stat, index) => <StatCard key={index} stat={stat} />)}
        </AnimatedContainer>
        
        {/* SECTION 4 : MISSION */}
        <AnimatedContainer className="text-center max-w-3xl mx-auto mb-24 lg:mb-32">
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Notre Mission</motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-orange-500 font-medium leading-relaxed">
            Proposer un accompagnement rigoureux, accessible et sur mesure, pour élever le niveau de maîtrise et de gouvernance dans chaque organisation.
          </motion.p>
        </AnimatedContainer>

        {/* SECTION 5 : ACCOMPAGNEMENTS */}
        <div className="relative rounded-3xl overflow-hidden p-0 shadow-2xl min-h-[700px]">
          <AnimatePresence>
            <motion.div
              key={bgIndex}
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700"
              style={{ backgroundImage: `url(${bgImages[bgIndex]})` }}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <AnimatedContainer className="relative z-10 text-center p-8 lg:p-12">
            <motion.h2 variants={itemVariants} className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-lg mb-6">
              Nous Accompagnons
            </motion.h2>
            <div className="flex flex-col md:flex-row justify-center items-center h-full gap-8 max-w-4xl mx-auto">
              {accompagnements.map((service, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8 flex flex-col items-center justify-between shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white drop-shadow-sm">{service.title}</h4>
                  <p className="text-sky-200 mt-2 text-center flex-grow">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedContainer>
        </div>

        {/* SECTION 6 : CTA FINAL */}
        <AnimatedContainer className="text-center mt-24 lg:mt-32">
          <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 bg-sky-500 rounded-full blur-xl animate-pulse"></div>
                <Zap className="relative w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Prêt pour l'Excellence ?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Contactez-nous pour transformer votre audit interne en un avantage concurrentiel décisif.
            </p>
            <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }} className="group bg-sky-600 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-sky-500/30 hover:bg-sky-700 transition-all duration-300 flex items-center justify-center gap-2 mx-auto">
              Commencer maintenant <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </AnimatedContainer>

      </div>
    </section>
  );
};

export default AboutSection;