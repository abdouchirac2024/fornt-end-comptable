import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  User,
  Building,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import Chatbot from '@/components/Chatbot';
import contactBanner from '@/assets/contact.png';
import { createContact } from '@/services/contact';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);
    try {
      await createContact({
        nom: formData.name,
        email: formData.email,
        sujet: formData.subject,
        message: formData.message
      });
      setSuccess('Votre message a bien été envoyé. Merci de nous avoir contactés !');
      setFormData({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
      setShowPopup(true);
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      details: ["+33 786 800 975", "+237 691 303 112"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["support@cabinetaudit.cm"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Clock,
      title: "Horaires",
      details: ["Lun-Sam: 09h-19h", "Consultation sur RDV"],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: MapPin,
      title: "Localisation",
      details: ["Cameroun", "Consultation en ligne disponible"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const subjects = [
    "Formation CIA",
    "Formation Audit Interne",
    "Services aux Entreprises",
    "Cartographie des Risques",
    "Conseil et Accompagnement",
    "Demande de Devis",
    "Autre"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      {/* Bannière image contact.png */}
      <section className="relative w-full h-72 md:h-96 flex items-center justify-center overflow-hidden">
        <img
          src={contactBanner}
          alt="Contact"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center">Contactez-<span className="text-blue-200">nous</span></h1>
        </div>
      </section>
      {/* Hero Section (supprimé car remplacé par la bannière) */}

      {/* Contact Content */}
      <section className="py-20">
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
              <h2 className="text-2xl font-bold mb-4 text-green-700">Message transmis avec succès !</h2>
              <p className="mb-6 text-gray-700">Votre message a bien été transmis. Nous allons vous contacter dans les plus brefs délais.</p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-lg"
                onClick={() => { setShowPopup(false); navigate('/'); }}
                autoFocus
              >
                OK
              </Button>
            </div>
          </div>
        )}
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Nos Coordonnées
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  N'hésitez pas à nous contacter pour toute question concernant 
                  nos formations ou services. Nous sommes à votre écoute.
                </p>
              </div>

              {contactInfo.map((info, index) => (
                <Card 
                  key={index}
                  className="border-0 shadow-card hover:shadow-float transition-all duration-300 hover-lift group rounded-2xl overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  
                  <CardContent className="p-6 relative">
                    <div className="flex items-start space-x-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform flex-shrink-0`}>
                        <info.icon className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                          {info.title}
                        </h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-muted-foreground">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

           
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-float rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 p-8 border-b border-gray-100">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    Envoyez-nous un Message
                  </h2>
                  <p className="text-muted-foreground">
                    Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>

                <CardContent className="p-8">
                  {success && <div className="mb-4 p-3 rounded-xl bg-green-100 text-green-800 text-center font-semibold">{success}</div>}
                  {error && <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-800 text-center font-semibold">{error}</div>}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground font-medium">
                          <User className="inline h-4 w-4 mr-2" />
                          Nom complet *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Votre nom complet"
                          required
                          className="rounded-xl border-gray-200 focus:border-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground font-medium">
                          <Mail className="inline h-4 w-4 mr-2" />
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="votre@email.com"
                          required
                          className="rounded-xl border-gray-200 focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-foreground font-medium">
                          <Building className="inline h-4 w-4 mr-2" />
                          Entreprise / Organisation
                        </Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          placeholder="Nom de votre entreprise"
                          className="rounded-xl border-gray-200 focus:border-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-foreground font-medium">
                          <Phone className="inline h-4 w-4 mr-2" />
                          Téléphone
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+33 ou +237..."
                          className="rounded-xl border-gray-200 focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-foreground font-medium">
                        <FileText className="inline h-4 w-4 mr-2" />
                        Sujet *
                      </Label>
                      <Select 
                        value={formData.subject}
                        onValueChange={(value) => setFormData({...formData, subject: value})}
                      >
                        <SelectTrigger className="rounded-xl border-gray-200 focus:border-primary">
                          <SelectValue placeholder="Sélectionnez un sujet" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-foreground font-medium">
                        <MessageCircle className="inline h-4 w-4 mr-2" />
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Décrivez votre projet, vos besoins ou posez votre question..."
                        required
                        rows={6}
                        className="rounded-xl border-gray-200 focus:border-primary resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full btn-primary text-lg py-6 group"
                      disabled={loading}
                    >
                      <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      {loading ? 'Envoi en cours...' : 'Envoyer le Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold font-playfair text-foreground mb-6">
                Questions Fréquentes
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Retrouvez les réponses aux questions les plus courantes
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  question: "Combien de temps dure la formation CIA ?",
                  answer: "Notre programme CIA dure 6 mois avec un accompagnement personnalisé, des sessions en ligne et du coaching individuel."
                },
                {
                  question: "Proposez-vous des formations en entreprise ?",
                  answer: "Oui, nous proposons des formations intra-entreprise personnalisées selon vos besoins spécifiques."
                },
                {
                  question: "Quels sont vos tarifs ?",
                  answer: "Nos tarifs sont personnalisés selon vos besoins. Contactez-nous pour un devis gratuit."
                },
                {
                  question: "Êtes-vous disponibles pour des missions ponctuelles ?",
                  answer: "Absolument ! Nous intervenons pour des missions d'audit, cartographie des risques ou conseil ponctuel."
                }
              ].map((faq, index) => (
                <Card key={index} className="border-0 shadow-card hover:shadow-float transition-all duration-300 rounded-2xl">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
      <Chatbot />
    </div>
  );
};

export default Contact;