import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Code2, BrainCircuit, MessageSquare, Target } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter your email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid credentials. Try again.';
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
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans text-white overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-900/40 rounded-full blur-[120px]"></div>
      </div>

      <div className="flex-1 p-8 md:p-16 lg:p-24 flex flex-col justify-center z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-80 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
              <img
                src="/logo.jpg"
                alt="Capgemini Prep By Yusuf"
                className="relative w-20 h-20 rounded-full object-cover object-top border-2 border-indigo-400 shadow-2xl ring-4 ring-white/10"
              />
            </div>
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Official Platform Edition
              </span>
              <p className="text-xs text-white/50 mt-1">Designed & Masterminded by Yusuf</p>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            CAPGEMINI PREP <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">
              BY YUSUF
            </span>
          </h1>
          <p className="text-lg text-white/60 mb-12 max-w-xl leading-relaxed">
            One platform. Every round. Complete preparation. Created by Yusuf for mastering every stage of the Capgemini assessment process.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
                className="flex items-start gap-4 p-4 rounded-xl bg-surface/50 border border-white/5 hover:bg-surface transition-colors"
              >
                <div className="p-2 bg-primary-500/10 rounded-lg text-primary-400">
                  <feature.icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white/90">{feature.title}</h3>
                  <p className="text-sm text-white/50 mt-1">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="w-full md:w-[480px] lg:w-[540px] bg-surface flex flex-col justify-center p-8 md:p-12 lg:p-16 border-l border-white/5 z-10 shadow-2xl relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-white/50">Enter your credentials to access the prep portal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                  placeholder="admin@capgemini-prep.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-background text-primary-500 focus:ring-primary-500 focus:ring-offset-background" />
                <span className="text-sm text-white/60">Remember me</span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/25 transition-all transform hover:scale-[1.02] active:scale-100 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Access Portal'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-white/40">
            Capgemini Prep By Yusuf • Engineered by Yusuf for placement excellence.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
