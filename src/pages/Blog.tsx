import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, Tag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import Chatbot from '@/components/Chatbot';
import blogBanner from '@/assets/blog.png';
import { getAllArticleBlogs, ArticleBlog } from '@/services/articleBlogs';

const Blog = () => {
  const [articles, setArticles] = useState<ArticleBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  // Charger les articles depuis le backend
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await getAllArticleBlogs();
        setArticles(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des articles');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Fonction pour formater la date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Fonction pour extraire un extrait du contenu
  const getExcerpt = (content: string, maxLength: number = 150) => {
    if (!content) return 'Aucun contenu disponible';
    const cleanContent = content.replace(/<[^>]*>/g, ''); // Supprimer les balises HTML
    return cleanContent.length > maxLength 
      ? cleanContent.substring(0, maxLength) + '...'
      : cleanContent;
  };

  // Fonction pour estimer le temps de lecture
  const getReadTime = (content: string) => {
    if (!content) return '1 min';
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min`;
  };

  // Catégories basées sur les meta_titre ou générées automatiquement
  const getCategory = (article: ArticleBlog) => {
    if (article.meta_titre) {
      const categories = ['Audit Interne', 'Formation', 'Gestion des Risques', 'Actualités', 'Contrôle Interne'];
      // Utiliser le meta_titre pour déterminer la catégorie
      const lowerMeta = article.meta_titre.toLowerCase();
      if (lowerMeta.includes('audit')) return 'Audit Interne';
      if (lowerMeta.includes('formation') || lowerMeta.includes('certification')) return 'Formation';
      if (lowerMeta.includes('risque')) return 'Gestion des Risques';
      if (lowerMeta.includes('contrôle')) return 'Contrôle Interne';
      return 'Actualités';
    }
    return 'Actualités';
  };

  const categories = ["Tous", "Audit Interne", "Formation", "Gestion des Risques", "Actualités", "Contrôle Interne"];

  // Filtrer les articles par catégorie
  const filteredArticles = selectedCategory === "Tous" 
    ? articles 
    : articles.filter(article => getCategory(article) === selectedCategory);

  // Article vedette (le plus récent)
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const otherArticles = articles.slice(1);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-lg font-medium text-gray-700">Chargement des articles...</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      {/* Bannière image blog.png */}
      <section className="relative w-full h-72 md:h-96 flex items-center justify-center overflow-hidden">
        <img
          src={blogBanner}
          alt="Blog"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center">Blog Cabinet Audit</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mt-4 text-center">Actualités, conseils et insights en audit interne, formation et gestion des risques</p>
        </div>
      </section>
      <div className="min-h-screen pt-0">
        {/* Article vedette */}
        {featuredArticle && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Article Vedette</h2>
            <Card className="overflow-hidden shadow-float hover-lift">
              <div className="lg:flex">
                <div className="lg:w-1/2">
                  <img
                    src={featuredArticle.image || "https://images.unsplash.com/photo-1554224155-6726b3ff858f"}
                    alt={featuredArticle.titre}
                    className="w-full h-64 lg:h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1554224155-6726b3ff858f";
                    }}
                  />
                </div>
                <div className="lg:w-1/2 p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                      {getCategory(featuredArticle)}
                    </span>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(featuredArticle.date_publication)}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {featuredArticle.titre}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {getExcerpt(featuredArticle.contenu, 200)}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Utilisateur {featuredArticle.user_id}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {getReadTime(featuredArticle.contenu)}
                      </div>
                    </div>
                    
                    <Link to={`/blog/${featuredArticle.id}`}>
                      <Button className="btn-primary group">
                        Lire l'article
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filtres par catégorie */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-glow'
                    : 'bg-white text-foreground border border-border hover:border-primary hover:shadow-card'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des articles */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {filteredArticles.map((article, index) => (
            <Card key={article.id} className="overflow-hidden shadow-card hover-lift group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative overflow-hidden">
                <img
                  src={article.image || "https://images.unsplash.com/photo-1554224155-6726b3ff858f"}
                  alt={article.titre}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1554224155-6726b3ff858f";
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                    {getCategory(article)}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-3 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(article.date_publication)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {getReadTime(article.contenu)}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {article.titre}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {getExcerpt(article.contenu)}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-1" />
                    Utilisateur {article.user_id}
                  </div>
                  
                  <Link to={`/blog/${article.id}`}>
                    <Button variant="outline" size="sm" className="group">
                      Lire plus
                      <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message si aucun article */}
        {filteredArticles.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun article trouvé pour cette catégorie.</p>
          </div>
        )}

        {/* Newsletter subscription */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-card shadow-elegant">
            <h3 className="text-2xl font-bold mb-4">Restez informé</h3>
            <p className="text-muted-foreground mb-6">
              Recevez nos derniers articles et actualités directement dans votre boîte mail
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="btn-primary">
                S'abonner
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
      <BackToTop />
      <Chatbot />
    </>
  );
};

export default Blog;