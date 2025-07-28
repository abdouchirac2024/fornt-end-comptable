import React, { useEffect, useState, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import { getAllPartenaires, Partenaire } from '../services/partenaires';

// ============================================================================
// DÉFINITION DES COULEURS VIBRANTES POUR NOTRE GALERIE
// ============================================================================
const GALAXY_COLORS = ['cyan', 'fuchsia', 'emerald', 'orange', 'sky', 'violet'];

// ============================================================================
// SOUS-COMPOSANT "PartnerCard" - Version "Cristal d'Énergie"
// ============================================================================
const PartnerCard = ({ partner, color }) => {
  const tiltRef = useRef(null);

  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 12,
        speed: 600,
        glare: true,
        "max-glare": 0.1,
        perspective: 1500,
        scale: 1.05,
      });
    }
    return () => tiltRef.current?.vanillaTilt.destroy();
  }, []);

  // Création dynamique des classes de couleur pour Tailwind
  const fromColorClass = `from-${color}-400/80`;
  const toColorClass = `to-transparent`;
  const glowColorClass = `bg-${color}-500`;

  return (
    <div
      ref={tiltRef}
      className="flex-shrink-0 mx-5" // Un peu plus d'espace
      aria-label={partner.nom}
    >
      <div style={{ transformStyle: 'preserve-3d', transform: 'perspective(1500px)' }}>
        <div 
          // `group/card` pour contrôler les animations internes
          className="
            group/card relative w-52 h-36 rounded-3xl p-1
            flex items-center justify-center
            transition-all duration-500 ease-out
            bg-slate-900/40 backdrop-blur-xl
          "
          style={{ transform: 'translateZ(30px)' }}
        >
          {/* === LA BORDURE LUMINEUSE === */}
          <div 
            className={`
              absolute -inset-px rounded-3xl opacity-0 group-hover/card:opacity-100
              transition-opacity duration-400
              bg-gradient-to-br ${fromColorClass} ${toColorClass}
            `}
          />

          <div className="relative w-full h-full bg-slate-900/80 rounded-[22px] flex items-center justify-center overflow-hidden">
            {/* === LA LUEUR DE FOND === */}
            <div 
              className={`
                absolute -inset-8 ${glowColorClass} opacity-0 
                group-hover/card:opacity-20 blur-3xl 
                transition-opacity duration-400 animate-pulse-ultra-slow
              `}
            />

            {partner.image ? (
              <img 
                src={partner.image} 
                alt={`Logo de ${partner.nom}`}
                className="
                  max-w-[75%] max-h-[65%] object-contain 
                  transition-all duration-400 delay-100
                "
                style={{ transform: 'translateZ(50px)' }}
              />
            ) : (
              <span className="text-4xl" style={{ transform: 'translateZ(50px)' }}>🤝</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPOSANT PRINCIPAL "PartnersSection" - Version "Cosmic Aurora"
// ============================================================================
const PartnersSection = () => {
  const [partners, setPartners] = useState<Partenaire[]>([]);

  useEffect(() => {
    getAllPartenaires()
      .then((res) => {
        const data = res.data.length > 5 ? [...res.data, ...res.data] : [...res.data, ...res.data, ...res.data];
        setPartners(data);
      })
      .catch((err) => console.error(err));
  }, []);

  if (partners.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes partners-scroll {
          from { transform: translateX(0%); }
          to { transform: translateX(-50%); }
        }
        .animate-partners-scroll {
          animation: partners-scroll 150s linear infinite;
        }
        @keyframes pulse-ultra-slow {
          50% { opacity: .25; }
        }
        .animate-pulse-ultra-slow {
          animation: pulse-ultra-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes aurora-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-aurora-spin {
          animation: aurora-spin 40s linear infinite;
        }
        .js-tilt-glare {
          border-radius: 24px; /* Correspond à rounded-3xl */
        }
      `}</style>

      <section className="py-24 sm:py-32 overflow-hidden relative bg-white">
        {/* === FOND "COSMIC AURORA" ANIMÉ === */}
        {/* Fond blanc, pas d'aurora animé */}
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            {/* === TITRE EN DÉGRADÉ === */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Un Écosystème de Partenaires d'Excellence
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Nous collaborons avec les leaders de l'industrie pour vous garantir des résultats inégalés.
            </p>
          </div>

          <div className="group flex min-w-max animate-partners-scroll hover:[animation-play-state:paused]">
            {partners.map((partner, index) => (
              <PartnerCard 
                partner={partner} 
                key={`${partner.nom}-${index}`} 
                color={GALAXY_COLORS[index % GALAXY_COLORS.length]} 
              />
            ))}
          </div>
        </div>
        
        <div className="absolute top-0 left-0 w-24 md:w-32 h-full z-20" style={{background: 'linear-gradient(to right, #fff, transparent)'}} />
        <div className="absolute top-0 right-0 w-24 md:w-32 h-full z-20" style={{background: 'linear-gradient(to left, #fff, transparent)'}} />
      </section>
    </>
  );
};

export default PartnersSection;