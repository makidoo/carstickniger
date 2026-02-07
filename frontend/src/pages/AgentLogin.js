import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ShieldCheck, User, Lock, Eye, EyeOff, ArrowLeft, BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function AgentLogin() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userData = await login(formData.username, formData.password, true);
      toast.success('Connexion réussie');
      
      if (userData.role === 'agent') {
        navigate('/agent/scanner');
      } else if (userData.role === 'admin' || userData.role === 'supervisor') {
        navigate('/agent/scanner'); // Admins can also use scanner
      } else {
        toast.error('Accès non autorisé');
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Échec de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Police Theme */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.5' fill-rule='evenodd'%3E%3Cpath d='M0 20L20 0l20 20-20 20-20-20zm20-15L5 20l15 15 15-15-15-15z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white mb-12 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
              <ShieldCheck className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Forces de l'Ordre</h1>
              <p className="text-blue-300">Police Nationale du Niger</p>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-4">
            Contrôle des<br />Vignettes
          </h2>
          <p className="text-xl text-white/70 max-w-md">
            Scanner de vérification pour le contrôle routier
          </p>
          
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-white/80">
              <BadgeCheck className="w-5 h-5 text-emerald-400" />
              <span>Vérification instantanée par QR code</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <BadgeCheck className="w-5 h-5 text-emerald-400" />
              <span>Historique des contrôles avec GPS</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <BadgeCheck className="w-5 h-5 text-emerald-400" />
              <span>Accès hors-ligne (USSD)</span>
            </div>
          </div>
          
          <div className="mt-12 flex h-2 w-32 rounded-full overflow-hidden">
            <div className="flex-1 bg-orange-500" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-green-600" />
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="lg:hidden flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Retour
          </Link>

          <Card className="border-0 shadow-2xl bg-white">
            <CardHeader className="pb-4 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ShieldCheck className="w-9 h-9 text-white" />
              </div>
              <CardTitle className="text-2xl">Portail Agent</CardTitle>
              <CardDescription>
                Connexion Forces de l'Ordre
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username">Identifiant Agent</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="username"
                      placeholder="agent001"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="pl-11 h-12 bg-slate-50"
                      required
                      data-testid="agent-username-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-11 pr-11 h-12 bg-slate-50"
                      required
                      data-testid="agent-password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-medium"
                  data-testid="agent-login-btn"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl text-center">
                <p className="text-sm text-blue-800">
                  <strong>Accès test:</strong> agent001 / agent123
                </p>
              </div>
              
              <div className="mt-4 text-center">
                <Link 
                  to="/admin/login" 
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Accès Administration DGI →
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
