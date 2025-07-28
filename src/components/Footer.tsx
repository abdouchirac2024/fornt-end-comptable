import { Clock, Phone, Mail, ArrowRight, Facebook, Linkedin, Twitter } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoGIDSBLUE from '@/assets/GIDSBLUE BLUE.png';

const quickLinks = [
  { name: "Accueil", path: "/", type: "link" },
  { name: "À propos", path: "/", section: "about", type: "section" },
  { name: "Formations", path: "/formations", type: "link" },
  { name: "Services", path: "/services", type: "link" },
  { name: "Contact", path: "/", section: "contact", type: "section" },
  { name: "Blog", path: "/blog", type: "link" },
];
const services = [
  { name: "Audit interne", path: "/services", type: "link" },
  { name: "Gestion des risques", path: "/services", type: "link" },
  { name: "Formation", path: "/formations", type: "link" },
  { name: "Conseil stratégique", path: "/services", type: "link" },
];
const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { label: "Twitter", href: "https://twitter.com", icon: Twitter },
];

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSectionClick = (e, section) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const targetSection = document.getElementById(section);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const targetSection = document.getElementById(section);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white pt-20 pb-8 overflow-hidden">
      {/* Vague inclinée en haut */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none pointer-events-none select-none z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-28" style={{ transform: 'rotate(-3deg)' }}>
          <defs>
            <linearGradient id="footer-wave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          {/* Nouvelle pente douce de gauche à droite */}
          <path d="M0,0 Q600,120 1200,100 L1200,0 L0,0 Z" fill="url(#footer-wave)" />
        </svg>
      </div>
      <div className="container mx-auto px-4 sm:px-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Présentation */}
          <div className="space-y-6 flex flex-col items-start">
            <img src={logoGIDSBLUE} alt="Logo GIDSBLUE" className="h-16 w-auto mb-2 drop-shadow-xl bg-white rounded-2xl p-2" />
            <p className="text-blue-100 leading-relaxed text-base font-light max-w-xs">
              Cabinet jeune porté par une expertise solide en audit interne, formation et conseil aux entreprises.
            </p>
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-blue-200 flex-shrink-0" />
                <span className="text-blue-100">Lun-Sam, 09h-19h</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-200 flex-shrink-0" />
                <div className="text-blue-100">
                  <div>+33 786 800 975</div>
                  <div>+237 691 303 112</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-200 flex-shrink-0" />
                <span className="text-blue-100">support@cabinetaudit.cm</span>
              </div>
            </div>
          </div>
          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-bold mb-6 tracking-wide uppercase text-white">Liens Rapides</h3>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                link.type === 'section' ? (
                  <a
                    key={link.name}
                    href={`#${link.section}`}
                    onClick={(e) => handleSectionClick(e, link.section)}
                    className="block text-blue-100 hover:text-white transition-colors duration-200 group font-medium cursor-pointer"
                  >
                    <span className="flex items-center">
                      {link.name}
                      <ArrowRight className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    </span>
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block text-blue-100 hover:text-white transition-colors duration-200 group font-medium"
                  >
                    <span className="flex items-center">
                      {link.name}
                      <ArrowRight className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    </span>
                  </Link>
                )
              ))}
            </div>
          </div>
          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 tracking-wide uppercase text-white">Nos Services</h3>
            <div className="space-y-3">
              {services.map((service) => (
                <Link
                  key={service.name}
                  to={service.path}
                  className="block text-blue-100 hover:text-white transition-colors duration-200 group font-medium"
                >
                  <span className="flex items-center">
                    {service.name}
                    <ArrowRight className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
          {/* Newsletter & Social */}
          <div>
            <h3 className="text-lg font-bold mb-6 tracking-wide uppercase text-white">Restez Connecté</h3>
            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-blue-100 text-sm mb-4">Recevez nos dernières actualités et conseils en audit</p>
              <form className="flex w-full max-w-xs">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-4 py-2 rounded-l-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:border-sky-400"
                  aria-label="Votre email"
                />
                <button className="px-6 py-2 bg-sky-400 text-white rounded-r-xl hover:bg-sky-500 transition-all duration-200 font-bold shadow-md" aria-label="S'inscrire à la newsletter" type="submit">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
            {/* Social Links */}
            <div>
              <p className="text-blue-100 text-sm mb-4">Suivez-nous</p>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-sky-400/80 hover:text-white hover:scale-110 transition-all duration-200 group shadow"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="h-5 w-5 text-blue-200 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 mt-10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-blue-200 text-sm">
              © 2024 GIDSBLUE Advisory. Tous droits réservés.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-blue-200 hover:text-white transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="/terms" className="text-blue-200 hover:text-white transition-colors">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}