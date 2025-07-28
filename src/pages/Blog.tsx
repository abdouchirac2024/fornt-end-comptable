import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import Chatbot from '@/components/Chatbot';
import blogBanner from '@/assets/blog.png';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Les nouveaux défis de l'audit interne en 2024",
      excerpt: "L'audit interne évolue avec la digitalisation. Découvrez comment adapter vos pratiques aux nouveaux enjeux technologiques et réglementaires.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
      category: "Audit Interne",
      author: "Expert Cabinet Audit",
      date: "15 Jan 2024",
      readTime: "5 min",
      featured: true
    },
    {
      id: 2,
      title: "Comment réussir sa certification CIA : Guide complet",
      excerpt: "Toutes les clés pour préparer et réussir votre certification Certified Internal Auditor avec nos conseils d'experts.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      category: "Formation",
      author: "Expert Formation",
      date: "10 Jan 2024",
      readTime: "8 min",
      featured: false
    },
    {
      id: 3,
      title: "Cartographie des risques : Méthodologie pratique",
      excerpt: "Une approche structurée pour identifier, évaluer et cartographier les risques de votre organisation.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      category: "Gestion des Risques",
      author: "Consultant Risques",
      date: "5 Jan 2024",
      readTime: "6 min",
      featured: false
    },
    {
      id: 4,
      title: "Tendances de l'audit interne en Afrique",
      excerpt: "Les spécificités et opportunités de l'audit interne dans le contexte africain. Analyse des meilleures pratiques.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
      category: "Actualités",
      author: "Analyste Senior",
      date: "28 Déc 2023",
      readTime: "7 min",
      featured: false
    },
    {
      id: 5,
      title: "Formation en ligne vs présentiel : Quelle approche choisir ?",
      excerpt: "Comparaison des modalités de formation pour optimiser votre apprentissage en audit interne.",
      image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
      category: "Formation",
      author: "Responsable Pédagogie",
      date: "20 Déc 2023",
      readTime: "4 min",
      featured: false
    },
    {
      id: 6,
      title: "L'évolution du contrôle interne post-Covid",
      excerpt: "Comment la pandémie a transformé les pratiques de contrôle interne et les nouvelles adaptations nécessaires.",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
      category: "Contrôle Interne",
      author: "Expert Contrôle",
      date: "15 Déc 2023",
      readTime: "9 min",
      featured: false
    }
  ];

  const categories = ["Tous", "Audit Interne", "Formation", "Gestion des Risques", "Actualités", "Contrôle Interne"];
  const [selectedCategory, setSelectedCategory] = React.useState("Tous");

  const filteredPosts = selectedCategory === "Tous" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);
  const otherPosts = blogPosts.filter(post => !post.featured);

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
        {featuredPost && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Article Vedette</h2>
            <Card className="overflow-hidden shadow-float hover-lift">
              <div className="lg:flex">
                <div className="lg:w-1/2">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                </div>
                <div className="lg:w-1/2 p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                      {featuredPost.category}
                    </span>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {featuredPost.date}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                    
                    <Link to={`/blog/${featuredPost.id}`}>
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
          {filteredPosts.map((post, index) => (
            <Card key={post.id} className="overflow-hidden shadow-card hover-lift group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-3 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                  
                  <Link to={`/blog/${post.id}`}>
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