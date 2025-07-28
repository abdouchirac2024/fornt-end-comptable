import React, { useState } from 'react';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdErrorOutline, MdAccountBalance, MdTrendingUp, MdAssessment } from 'react-icons/md';
import { FaSpinner, FaCalculator, FaChartLine, FaFileInvoiceDollar } from 'react-icons/fa';
import { login } from '@/services/auth';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    if (form.email.trim() === '' || form.password.trim() === '') {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      // Supposons que la réponse contient { user: { email, name, ... }, token }
      if (data && data.user) {
        localStorage.setItem('user', JSON.stringify({
          email: data.user.email,
          name: data.user.name
        }));
      }
      if (data && (data.token || data.access_token)) {
        localStorage.setItem('access_token', data.token || data.access_token);
      }
      toast({
        title: 'Connexion réussie',
        description: `Bienvenue, ${data.user.prenom || data.user.name || data.user.email} !`,
        variant: 'default',
      });
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (err) {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      
      {/* Section gauche - Formulaire */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          
          {/* Header avec logo professionnel */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl mb-6 shadow-xl">
              <FaCalculator className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Accès Backoffice 💼</h1>
            <p className="text-gray-600 leading-relaxed">Connectez-vous à votre espace d'administration pour gérer vos services comptables et suivre vos clients.</p>
          </div>

          <div className="space-y-6">
            
            {/* Champ Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Email administrateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MdEmail className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Mot de passe sécurisé
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MdLock className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <MdVisibilityOff className="h-5 w-5" /> : <MdVisibility className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Options de sécurité */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-gray-600">Se souvenir de moi</span>
              </label>
              <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Mot de passe oublié ?
              </button>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm border border-red-200">
                <MdErrorOutline className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  <span>Authentification...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <MdAccountBalance className="text-lg" />
                  <span>Accéder au Backoffice</span>
                </div>
              )}
            </button>
          </div>

          {/* Informations de sécurité */}
          <div className="mt-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            
          </div>
        </div>
      </div>

      {/* Section droite - Illustration professionnelle */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 items-center justify-center p-8 relative overflow-hidden">
        
        {/* Formes décoratives professionnelles */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-3xl rotate-12 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-white/15 rounded-2xl -rotate-12 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-yellow-300/20 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        
        {/* Icônes flottantes comptables */}
        <div className="absolute top-1/4 left-1/4 text-white/20 text-5xl animate-bounce" style={{animationDelay: '0.5s'}}>
          📊
        </div>
        <div className="absolute bottom-1/3 right-1/3 text-white/20 text-4xl animate-pulse" style={{animationDelay: '1.5s'}}>
          💰
        </div>
        <div className="absolute top-2/3 left-1/3 text-white/20 text-3xl animate-bounce" style={{animationDelay: '2.5s'}}>
          📈
        </div>

        {/* Contenu principal */}
        <div className="text-center text-white z-10 max-w-lg">
          {/* Avatar professionnel */}
          <div className="mb-8 relative">
            <div className="inline-block w-36 h-36 bg-gradient-to-br from-white/20 to-white/10 rounded-full p-2 backdrop-blur-sm">
              <div className="w-full h-full bg-white/95 rounded-full flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <FaChartLine className="text-white text-2xl" />
                </div>
              </div>
            </div>
            
            {/* Icônes décoratives métier */}
            <div className="absolute -top-2 -right-2 w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg transform rotate-12">
              <FaFileInvoiceDollar className="text-blue-600 text-xl" />
            </div>
            
            <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-lg">✓</span>
            </div>

            <div className="absolute top-0 left-0 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <MdTrendingUp className="text-gray-800 text-sm" />
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Tableau de Bord
            <br />
            <span className="text-yellow-300">Administrateur</span>
          </h2>
          <p className="text-blue-100 text-lg opacity-90 leading-relaxed mb-6">
            Gérez vos clients, suivez les performances de votre cabinet comptable et accédez à tous vos outils professionnels
          </p>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <MdAssessment className="text-2xl mx-auto mb-1 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Version mobile - Bandeau supérieur */}
      <div className="lg:hidden absolute top-0 right-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600 -z-10 opacity-20"></div>
    </div>
  );
};

export default Login;