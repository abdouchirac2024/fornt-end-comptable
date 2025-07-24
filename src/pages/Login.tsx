import React, { useState, Suspense, useMemo, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import logoGIDSBLUE from '@/assets/logoGIDSBLUE.png';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';
import { MdEmail, MdLock } from 'react-icons/md';

// --- COMPOSANTS 3D AMÉLIORÉS ---

type BubbleProps = {
  initialPosition: Vector3;
  scale: number;
  color: string;
  speed: number;
};

// Animation d'une seule bulle
function Bubble({ initialPosition, scale, color, speed }: BubbleProps) {
  const ref = useRef<Mesh>(null!); 
  
  // Fait monter la bulle continuellement et la replace en bas lorsqu'elle sort de l'écran
  useFrame((state, delta) => {
    ref.current.position.y += speed * delta;
    if (ref.current.position.y > 7) {
      ref.current.position.y = -7;
    }
  });

  return (
    <mesh ref={ref} position={initialPosition} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.6}
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  );
}

// Génération de toutes les bulles
function Bubbles() {
  const bubbles = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({
      key: `bubble_${i}`,
      initialPosition: new Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
      ),
      scale: 0.3 + Math.random() * 0.6,
      color: `hsl(${200 + Math.random() * 40}, 80%, 70%)`,
      speed: 0.4 + Math.random() * 0.8,
    })
  ), []);

  return (
    <>
      {bubbles.map(({ key, ...props }) => (
        <Bubble key={key} {...props} />
      ))}
    </>
  );
}

// --- COMPOSANT DE CONNEXION PRINCIPAL ---
const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');
    
    setTimeout(() => {
      setLoading(false);
      if (form.email.trim() === '' || form.password.trim() === '') {
        setError('Veuillez remplir tous les champs.');
      } else {
        // Connexion réussie : stocker l'état et rediriger
        localStorage.setItem('isAuthenticated', 'true');
        window.location.href = '/dashboard'; // À adapter selon le routing
      }
    }, 1200);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-900 overflow-hidden">
      
      {/* Animation 3D en fond */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <Suspense fallback={
            <Html center>
              <div className="text-white animate-pulse">Chargement de la scène...</div>
            </Html>
          }>
            <Bubbles />
          </Suspense>
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.3}
          />
        </Canvas>
      </div>
      
      {/* Carte de connexion */}
      <div className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col items-center border border-white/30">
        <img src={logoGIDSBLUE} alt="Logo GIDSBLUE" className="h-20 mb-6 drop-shadow-lg" />
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-1">Bienvenue</h2>
            <p className="text-blue-200">Accédez à votre espace sécurisé</p>
        </div>
        
        <form className="w-full space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="relative">
            <label htmlFor="email" className="block text-white font-semibold mb-2">Email</label>
            <span className="absolute left-3 top-10 transform -translate-y-1/2 text-blue-200 pointer-events-none">
              <MdEmail size={22} />
            </span>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="votre@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border-white/30 focus:border-white focus:ring-2 focus:ring-blue-300/50 bg-white/20 text-white placeholder:text-blue-200 transition-all pl-11"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-white font-semibold mb-2">Mot de passe</label>
            <span className="absolute left-3 top-10 transform -translate-y-1/2 text-blue-200 pointer-events-none">
              <MdLock size={22} />
            </span>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border-white/30 focus:border-white focus:ring-2 focus:ring-blue-300/50 bg-white/20 text-white placeholder:text-blue-200 transition-all pl-11"
              required
            />
          </div>

          {error && <div className="text-red-300 bg-red-900/50 p-2 rounded-lg text-sm text-center">{error}</div>}
          
          <Button
            type="submit"
            className="w-full py-3 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg text-white transition-all duration-300 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;