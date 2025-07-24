import React from 'react';

const partners = [
  { name: "IIA Institute", logo: "🏛️" },
  { name: "ACCA", logo: "📊" },
  { name: "CPA Canada", logo: "🍁" },
  { name: "IFAC", logo: "🌍" },
  { name: "African Union", logo: "🌍" },
  { name: "World Bank", logo: "🏦" },
  { name: "CEMAC", logo: "🤝" },
  { name: "OHADA", logo: "⚖️" },
  { name: "PWC", logo: "💼" },
  { name: "KPMG", logo: "🔍" },
  { name: "EY", logo: "💡" },
  { name: "Deloitte", logo: "🎯" }
];

const PartnersSection = () => {
  return (
    <section className="relative py-16 bg-blue-50 border-t border-blue-100 overflow-hidden">
      {/* Motifs NDOP (SVG biscuits/carrés blancs) */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <svg className="absolute top-4 left-10 w-10 h-10 opacity-10" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#fff" />
        </svg>
        <svg className="absolute bottom-8 right-24 w-8 h-8 opacity-10" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#fff" />
        </svg>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-blue-800 mb-2">Nos Partenaires de Confiance</h3>
          <p className="text-blue-500 text-lg">Reconnus par les plus grandes institutions d'audit et de formation</p>
        </div>
        {/* Slow scroll animation */}
        <div className="relative overflow-hidden">
          <div className="flex animate-partners-scroll min-w-max">
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 mx-8 flex flex-col items-center justify-center h-24 w-32 group"
                tabIndex={0}
                aria-label={partner.name}
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300 filter grayscale group-hover:grayscale-0 group-hover:text-blue-600 text-gray-400">
                  {partner.logo}
                </div>
                <div className="text-xs text-blue-600 text-center font-medium opacity-80 group-hover:opacity-100">
                  {partner.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Animation keyframes for slow scroll */}
      <style>{`
        @keyframes partners-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-partners-scroll {
          animation: partners-scroll 40s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default PartnersSection;