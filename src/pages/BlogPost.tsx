import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share2, Tag, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getArticleBlogById, getAllArticleBlogs, ArticleBlog } from '@/services/articleBlogs';

const BlogPost = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<ArticleBlog | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticleBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger l'article depuis le backend
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const articleData = await getArticleBlogById(parseInt(id));
        setArticle(articleData);
        
        // Charger les articles connexes (autres articles)
        const allArticlesResponse = await getAllArticleBlogs();
        const otherArticles = allArticlesResponse.data.filter(a => a.id !== parseInt(id));
        setRelatedArticles(otherArticles.slice(0, 3)); // Limiter à 3 articles connexes
      } catch (err) {
        setError('Erreur lors du chargement de l\'article');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // Fonction pour formater la date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Fonction pour estimer le temps de lecture
  const getReadTime = (content: string) => {
    if (!content) return '1 min';
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min`;
  };

  // Fonction pour déterminer la catégorie
  const getCategory = (article: ArticleBlog) => {
    if (article.meta_titre) {
      const lowerMeta = article.meta_titre.toLowerCase();
      if (lowerMeta.includes('audit')) return 'Audit Interne';
      if (lowerMeta.includes('formation') || lowerMeta.includes('certification')) return 'Formation';
      if (lowerMeta.includes('risque')) return 'Gestion des Risques';
      if (lowerMeta.includes('contrôle')) return 'Contrôle Interne';
      return 'Actualités';
    }
    return 'Actualités';
  };

  // Fonction pour nettoyer et formater le contenu HTML
  const cleanContent = (content: string) => {
    if (!content) return '<p>Aucun contenu disponible</p>';
    
    // Nettoyer le contenu et le formater pour l'affichage
    let cleanedContent = content
      .replace(/\n\n/g, '</p><p>') // Double saut de ligne = nouveau paragraphe
      .replace(/\n/g, '<br>') // Simple saut de ligne = <br>
      .trim();
    
    // S'assurer que le contenu est entouré de balises <p>
    if (!cleanedContent.startsWith('<p>')) {
      cleanedContent = '<p>' + cleanedContent;
    }
    if (!cleanedContent.endsWith('</p>')) {
      cleanedContent = cleanedContent + '</p>';
    }
    
    return cleanedContent;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700">Chargement de l'article...</span>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Article non trouvé'}</p>
          <Link to="/blog">
            <Button>Retour au blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero de l'article */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={article.image || "https://images.unsplash.com/photo-1554224155-6726b3ff858f"}
          alt={article.titre}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1554224155-6726b3ff858f";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Biscuits NDOP flottants */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-white/30 rotate-45 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <span className="bg-primary text-white px-4 py-2 rounded-full text-sm mb-4 inline-block">
                {getCategory(article)}
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-playfair">
                {article.titre}
              </h1>
              <div className="flex items-center space-x-6 text-white/90">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Utilisateur {article.user_id}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(article.date_publication)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {getReadTime(article.contenu)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <Link to="/blog">
              <Button variant="outline" className="group">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Retour au blog
              </Button>
            </Link>
          </div>

          <div className="lg:flex lg:space-x-8">
            {/* Contenu principal */}
            <article className="lg:w-2/3">
              <Card className="shadow-elegant p-8">
                {/* Excerpt */}
                <div className="text-xl text-muted-foreground leading-relaxed mb-8 p-6 bg-gray-50 rounded-xl border-l-4 border-primary">
                  {article.meta_description || getExcerpt(article.contenu, 200)}
                </div>

                {/* Contenu de l'article */}
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: cleanContent(article.contenu) }}
                  style={{
                    lineHeight: '1.8',
                    fontSize: '16px'
                  }}
                />
                
                {/* Version de fallback si le contenu ne s'affiche pas */}
                {!article.contenu && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800">
                      <strong>Note :</strong> Le contenu de cet article n'est pas disponible.
                    </p>
                  </div>
                )}

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-border">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[getCategory(article), 'Audit', 'Formation'].map((tag) => (
                      <span
                        key={tag}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-white transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Partage */}
                <div className="mt-8 pt-8 border-t border-border">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager cet article
                  </h4>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm">
                      LinkedIn
                    </Button>
                    <Button variant="outline" size="sm">
                      Twitter
                    </Button>
                    <Button variant="outline" size="sm">
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm">
                      Email
                    </Button>
                  </div>
                </div>
              </Card>
            </article>

            {/* Sidebar */}
            <aside className="lg:w-1/3 mt-8 lg:mt-0">
              {/* Articles relatifs */}
              <Card className="shadow-card p-6 mb-8">
                <h3 className="font-bold mb-6 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Articles connexes
                </h3>
                <div className="space-y-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      to={`/blog/${relatedArticle.id}`}
                      className="block group"
                    >
                      <div className="flex space-x-4">
                        <img
                          src={relatedArticle.image || "https://images.unsplash.com/photo-1554224155-6726b3ff858f"}
                          alt={relatedArticle.titre}
                          className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1554224155-6726b3ff858f";
                          }}
                        />
                        <div className="flex-1">
                          <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                            {getCategory(relatedArticle)}
                          </span>
                          <h4 className="font-medium mt-2 group-hover:text-primary transition-colors line-clamp-2">
                            {relatedArticle.titre}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatDate(relatedArticle.date_publication)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>

              {/* CTA Newsletter */}
              <Card className="shadow-card p-6 bg-gradient-card">
                <h3 className="font-bold mb-4">Restez informé</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Recevez nos derniers articles et conseils en audit interne
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button className="w-full btn-primary">
                    S'abonner
                  </Button>
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Intéressé par nos formations ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Découvrez nos programmes de formation en audit interne et certification CIA
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/formations">
              <Button className="bg-white text-primary hover:bg-gray-100">
                Voir nos formations
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Fonction utilitaire pour extraire un extrait
const getExcerpt = (content: string, maxLength: number = 200) => {
  if (!content) return 'Aucun contenu disponible';
  const cleanContent = content.replace(/<[^>]*>/g, ''); // Supprimer les balises HTML
  return cleanContent.length > maxLength 
    ? cleanContent.substring(0, maxLength) + '...'
    : cleanContent;
};

export default BlogPost;