import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Code2, BrainCircuit, MessageSquare, Target } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('rememberMe') !== 'false');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering && !name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter your email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isRegistering) {
        await register({ name: name.trim(), email: email.trim(), password, rememberMe });
        toast.success('Account created! Welcome to your prep journey.');
      } else {
        await login({ email: email.trim(), password, rememberMe });
        toast.success('Login successful!');
      }
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || (isRegistering ? 'Registration failed. Try again.' : 'Invalid credentials. Try again.');
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    { icon: Code2, title: 'Pseudocode & Coding', desc: 'Master technical problem solving' },
    { icon: BrainCircuit, title: 'Cognitive & AI', desc: 'Excel in logic and AI rounds' },
    { icon: MessageSquare, title: 'Communication', desc: 'Ace the spoken English test' },
    { icon: Target, title: 'Mock Interviews', desc: 'Real simulation for HR & Tech' }
  ];

  return (
    <div className="min-h-dvh bg-surface-cream flex flex-col md:flex-row font-sans text-on-surface relative">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-secondary-fixed/40 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#fc618d]/10 rounded-full blur-[140px]"></div>
      </div>

      <div className="flex-1 p-5 sm:p-8 md:p-16 lg:p-24 flex flex-col justify-center z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-4 mb-6 sm:mb-8">
            <div className="relative group">
              <img
                src="/logo.jpg"
                alt="Capgemini Prep By Yusuf"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover object-top border-2 border-border-hairline shadow-md"
              />
            </div>
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold bg-surface-container-highest text-on-surface border border-border-hairline">
                ✨ OFFICIAL PLATFORM EDITION
              </span>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Designed & Masterminded by Yusuf</p>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-5 tracking-tight text-on-surface">
            Capgemini Prep <br/>
            <span className="text-secondary text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold block mt-2">
              A platform by Yusuf
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-on-surface-variant mb-6 sm:mb-10 max-w-xl leading-relaxed">
            One unified assessment engine. Every round covered with precision telemetry, interactive simulators, and real recruitment benchmark algorithms.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
                className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl bg-white border border-border-hairline shadow-sm hover:border-zinc-400 transition-all"
              >
                <div className="p-2 sm:p-2.5 bg-surface-cream rounded-lg text-secondary border border-border-hairline shrink-0">
                  <feature.icon size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-on-surface">{feature.title}</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="w-full md:w-[480px] lg:w-[520px] bg-white flex flex-col justify-center p-5 sm:p-8 md:p-12 lg:p-16 border-t md:border-t-0 md:border-l border-border-hairline z-10 shadow-lg relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="mb-6 sm:mb-8 text-center md:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight mb-2">
              {isRegistering ? 'Create Your Account' : 'Sign in to Terminal'}
            </h2>
            <p className="text-on-surface-variant text-xs sm:text-sm">
              {isRegistering 
                ? 'Sign up to start your personalized preparation journey from 0%.'
                : 'Enter your credentials to access your preparation command center.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-cream border border-border-hairline rounded-xl py-3 px-4 text-on-surface focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-base sm:text-sm"
                    placeholder="e.g. Yusuf Khan"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" size={17} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-cream border border-border-hairline rounded-xl py-3 pl-10 pr-4 text-on-surface focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-base sm:text-sm"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" size={17} />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-cream border border-border-hairline rounded-xl py-3 pl-10 pr-12 text-on-surface focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-base sm:text-sm"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-1 pb-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border-hairline text-secondary focus:ring-secondary/30 accent-secondary cursor-pointer"
                />
                <span className="text-xs text-on-surface font-medium hover:text-secondary transition-colors">
                  Remember me
                </span>
              </label>
              
              <span className="text-[11px] font-mono text-on-surface-variant/80">
                {rememberMe ? '30-day session' : 'Session only'}
              </span>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-primary-container hover:bg-black text-white rounded-xl font-bold shadow-sm transition-all transform active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm cursor-pointer mt-2 min-h-[48px] touch-manipulation"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                isRegistering ? 'Create Free Account' : 'Access Portal'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setName('');
                setEmail('');
                setPassword('');
              }}
              className="text-xs font-semibold text-secondary hover:underline transition-colors cursor-pointer"
            >
              {isRegistering 
                ? 'Already have an account? Sign in here' 
                : "Don't have an account? Create one & start from 0%"}
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-on-surface-variant">
            Capgemini Prep By Yusuf • Engineered by Yusuf for placement excellence.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
