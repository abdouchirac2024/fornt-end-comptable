import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  BookOpen, Users, Target, Shield, TrendingUp, ArrowRight, Star,
  Clock, Award, GraduationCap, Building2, Check
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import CertificationCIAIcon from '../assets/CertificationCIAIcon';

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

// --- COMPOSANTS DE PRÉSENTATION AMÉLIORÉS ---

const SectionTitle = ({ icon: Icon, children }) => (
  <AnimatedContainer className="flex items-center justify-center gap-4 sm:gap-6 mb-16">
    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, ease: "circOut", delay: 0.3 }} className="h-px flex-1 bg-sky-500 origin-right" />
    <motion.div variants={itemVariants} className="flex items-center gap-3 sm:gap-4 bg-white px-4 sm:px-6 py-3 rounded-full border border-slate-200 shadow-sm">
      <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-sky-600" />
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
        {children}
      </h2>
    </motion.div>
    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, ease: "circOut", delay: 0.3 }} className="h-px flex-1 bg-sky-500 origin-left" />
  </AnimatedContainer>
);

const FormationCard = ({ formation }) => (
    <motion.div 
        variants={itemVariants}
        whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
        className="bg-white rounded-2xl border border-slate-200/80 shadow-md h-full flex flex-col overflow-hidden"
    >
        <div className="relative overflow-hidden">
            {typeof formation.image === "string" ? (
                <img src={formation.image} alt={formation.title} className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
                <formation.image />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {formation.badge && (
                <span className="absolute top-4 right-4 bg-sky-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">{formation.badge}</span>
            )}
        </div>
        <div className="p-6 md:p-8 flex flex-col flex-grow">
            <div className="flex-grow">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{formation.title}</h3>
                <div className="flex items-center flex-wrap text-sm text-slate-500 gap-x-4 gap-y-1 mb-4">
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {formation.duration}</span>
                    <span className="flex items-center gap-1.5"><GraduationCap size={14} /> {formation.format}</span>
                </div>
                <p className="text-slate-600 mb-5">{formation.description}</p>
                <div className="space-y-2 mb-6">
                    {formation.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                            <Star size={14} className="text-amber-400 fill-current flex-shrink-0" />
                            <span className="text-slate-700">{highlight}</span>
                        </div>
                    ))}
                </div>
            </div>
            <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
                className="group w-full mt-4 bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-sky-500/30 hover:bg-sky-700 transition-colors flex items-center justify-center gap-2"
            >
                En savoir plus
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
        </div>
    </motion.div>
);

const ServiceCard = ({ service }) => (
    <motion.div 
        variants={itemVariants}
        whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
        className="bg-white rounded-2xl border border-slate-200/80 shadow-md h-full flex flex-col overflow-hidden group"
    >
        <div className="relative overflow-hidden">
            <img src={service.image} alt={service.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="p-6 md:p-8 flex flex-col flex-grow">
            <div className="flex-grow">
                <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center mb-4 border border-sky-200">
                    <service.icon className="w-7 h-7 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{service.title}</h3>
                <p className="text-slate-600 mb-5 flex-grow">{service.description}</p>
            </div>
             <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
                className="group w-full mt-4 bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-sky-500/30 hover:bg-sky-700 transition-colors flex items-center justify-center gap-2"
            >
                Découvrir le service
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
        </div>
    </motion.div>
);


// --- COMPOSANT PRINCIPAL ---
const ServicesSection = () => {
  const formations = [
    { id: 1, title: "Pratique de l'Audit Interne", duration: "4-6 semaines", format: "En ligne / Présentiel", description: "Formation opérationnelle combinant théorie et cas réels pour maîtriser les fondamentaux de l'audit.", highlights: ["Missions de l'audit", "Étapes clés d'une mission", "Rédaction de constats", "Posture professionnelle"], icon: BookOpen, image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&crop=center", badge: "Populaire" },
    { id: 2, title: "Préparation à la Certification CIA", duration: "6 mois", format: "Sessions + Coaching", description: "Accompagnement complet pour réussir la certification CIA (Certified Internal Auditor) reconnue internationalement.", highlights: ["Contenu des 3 parties", "Méthodologie rigoureuse", "Examens blancs", "Coaching personnalisé"], icon: Award, image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80", badge: "Certification" }
  ];

  const services = [
    { id: 1, title: "Formation des Équipes", description: "Modules personnalisés pour développer les compétences de vos collaborateurs en audit interne.", icon: Users, image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center" },
    { id: 2, title: "Structuration du Service Audit", description: "Mise en place de votre service d'audit interne selon les meilleures pratiques internationales.", icon: Shield, image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center" },
    { id: 3, title: "Cartographie des Risques", description: "Ateliers collaboratifs pour identifier, évaluer et hiérarchiser les risques de votre organisation.", icon: Target, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center" },
    { id: 4, title: "Gestion des Risques (ERM)", description: "Élaboration d'un dispositif complet de gestion des risques pour une meilleure prise de décision.", icon: TrendingUp, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center" }
  ];

  return (
    <section className="relative py-20 lg:py-28 bg-slate-50 overflow-hidden">
        {/* Motif losanges à gauche */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1/3 sm:w-1/2 pointer-events-none z-0"
          style={{ minHeight: '100%', minWidth: '100%' }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ minHeight: '100%', minWidth: '100%' }}
          >
            <pattern
              id="diamondPatternLeft"
              patternUnits="userSpaceOnUse"
              width="30"
              height="30"
              patternTransform="rotate(45)"
            >
              <rect x="10" y="10" width="10" height="10" fill="#0ea5e9" opacity="0.22" />
            </pattern>
            <rect width="120%" height="120%" fill="url(#diamondPatternLeft)" />
          </svg>
        </div>

        {/* Motif losanges à droite */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-1/3 sm:w-1/2 pointer-events-none z-0"
          style={{ minHeight: '100%', minWidth: '100%' }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ minHeight: '100%', minWidth: '100%' }}
          >
            <pattern
              id="diamondPatternRight"
              patternUnits="userSpaceOnUse"
              width="30"
              height="30"
              patternTransform="rotate(45)"
            >
              <rect x="10" y="10" width="10" height="10" fill="#0ea5e9" opacity="0.22" />
            </pattern>
            <rect width="120%" height="120%" fill="url(#diamondPatternRight)" />
          </svg>
        </div>

        {/* Cercles décoratifs en arrière-plan */}
        <div className="absolute top-0 left-[-20rem] w-[50rem] h-[50rem] bg-sky-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute bottom-[-15rem] right-[-15rem] w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />

        {/* Bulles animées */}
        <div className="bubble bubble1"></div>
        <div className="bubble bubble2"></div>
        <div className="bubble bubble3"></div>
        <div className="bubble bubble4"></div>
        <div className="bubble bubble5"></div>

        {/* Styles pour la pagination du Swiper */}
        <style>{`
            .swiper-pagination-bullet { width: 8px; height: 8px; background-color: #cbd5e1; opacity: 1; transition: all 0.3s; }
            .swiper-pagination-bullet-active { width: 24px; border-radius: 4px; background-color: #0ea5e9; }
        `}</style>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10">
            
            {/* Section Formations */}
            <div className="mb-24">
                <SectionTitle icon={GraduationCap}>Nos Formations Clés</SectionTitle>
                <AnimatedContainer className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {formations.map((formation) => (
                    <FormationCard key={formation.id} formation={formation} />
                    ))}
                </AnimatedContainer>
            </div>

            {/* Section Services */}
            <div>
                <SectionTitle icon={Building2}>Services aux Entreprises</SectionTitle>
                <AnimatedContainer>
                    <motion.div variants={itemVariants}>
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        className="!pb-16"
                    >
                        {services.map((service) => (
                        <SwiperSlide key={service.id} className="h-auto pb-4">
                            <ServiceCard service={service} />
                        </SwiperSlide>
                        ))}
                    </Swiper>
                    </motion.div>
                </AnimatedContainer>
            </div>
            
        </div>
    </section>
  );
};

export default ServicesSection;