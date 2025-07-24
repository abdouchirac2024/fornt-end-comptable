import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share2, Tag, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const BlogPost = () => {
  const { id } = useParams();

  // Données simulées - en production, ces données viendraient d'une API
  const blogPost = {
    id: 1,
    title: "Les nouveaux défis de l'audit interne en 2024",
    excerpt: "L'audit interne évolue avec la digitalisation. Découvrez comment adapter vos pratiques aux nouveaux enjeux technologiques et réglementaires.",
    content: `
      <h2>Introduction</h2>
      <p>L'audit interne traverse une période de transformation majeure. Les avancées technologiques, les nouvelles réglementations et l'évolution des attentes des parties prenantes redéfinissent le rôle de l'auditeur interne moderne.</p>
      
      <h2>Les défis technologiques</h2>
      <p>La digitalisation des entreprises impose aux auditeurs internes de maîtriser de nouveaux outils et méthodologies :</p>
      <ul>
        <li><strong>Intelligence artificielle</strong> : Utilisation de l'IA pour l'analyse des données et la détection d'anomalies</li>
        <li><strong>Audit continu</strong> : Mise en place de contrôles automatisés en temps réel</li>
        <li><strong>Data Analytics</strong> : Exploitation des big data pour améliorer la pertinence des audits</li>
        <li><strong>Cybersécurité</strong> : Intégration des risques cyber dans les missions d'audit</li>
      </ul>
      
      <h2>L'évolution réglementaire</h2>
      <p>Les nouvelles réglementations, notamment en matière de protection des données (RGPD) et de reporting ESG, nécessitent une adaptation des programmes d'audit :</p>
      
      <blockquote>
        "L'auditeur interne doit désormais être un expert multi-disciplinaire, capable d'appréhender les enjeux technologiques, réglementaires et sociétaux de son organisation."
      </blockquote>
      
      <h2>Recommandations pratiques</h2>
      <p>Pour relever ces défis, les auditeurs internes doivent :</p>
      <ol>
        <li>Développer leurs compétences techniques et digitales</li>
        <li>Adopter une approche agile dans leurs méthodologies</li>
        <li>Renforcer leur collaboration avec les équipes IT et métiers</li>
        <li>Intégrer les enjeux ESG dans leurs évaluations</li>
        <li>Maintenir une veille réglementaire constante</li>
      </ol>
      
      <h2>Conclusion</h2>
      <p>L'audit interne de demain sera plus technologique, plus agile et plus stratégique. Les professionnels qui sauront s'adapter à ces évolutions joueront un rôle clé dans la gouvernance et la création de valeur de leurs organisations.</p>
    `,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
    category: "Audit Interne",
    author: "Expert Cabinet Audit",
    date: "15 Jan 2024",
    readTime: "5 min",
    tags: ["Audit Interne", "Digitalisation", "Innovation", "Formation"]
  };

  const relatedPosts = [
    {
      id: 2,
      title: "Comment réussir sa certification CIA : Guide complet",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      category: "Formation",
      date: "10 Jan 2024"
    },
    {
      id: 3,
      title: "Cartographie des risques : Méthodologie pratique",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      category: "Gestion des Risques",
      date: "5 Jan 2024"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero de l'article */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={blogPost.image}
          alt={blogPost.title}
          className="w-full h-full object-cover"
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
                {blogPost.category}
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-playfair">
                {blogPost.title}
              </h1>
              <div className="flex items-center space-x-6 text-white/90">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {blogPost.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {blogPost.date}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {blogPost.readTime}
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
                  {blogPost.excerpt}
                </div>

                {/* Contenu de l'article */}
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                  style={{
                    lineHeight: '1.8',
                    fontSize: '16px'
                  }}
                />

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-border">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {blogPost.tags.map((tag) => (
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
                  {relatedPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.id}`}
                      className="block group"
                    >
                      <div className="flex space-x-4">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1">
                          <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                            {post.category}
                          </span>
                          <h4 className="font-medium mt-2 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {post.date}
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

export default BlogPost;