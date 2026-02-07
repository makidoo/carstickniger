import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, Phone, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(formData.phone, formData.password);
      toast.success(t('login_success'));
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.pexels.com/photos/7144214/pexels-photo-7144214.jpeg"
          alt="Driver"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/50" />
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white mb-12 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          
          <div className="flex w-20 h-1.5 rounded-full overflow-hidden mb-8">
            <div className="flex-1 bg-orange-500" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            Bienvenue sur<br />Vignette Niger
          </h1>
          <p className="text-xl text-white/80 max-w-md">
            Gérez vos vignettes véhicules en toute simplicité et sécurité
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#FDFBF7]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Back Link */}
          <Link to="/" className="lg:hidden flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Retour
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#E05D26] to-[#C2410C] rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{t('login')}</h2>
              <p className="text-slate-500">Accédez à votre espace</p>
            </div>
          </div>

          <Card className="border-0 shadow-xl bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Connexion Citoyen</CardTitle>
              <CardDescription>
                Entrez vos identifiants pour continuer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700">{t('phone')}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+227 XX XX XX XX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-11 h-12 bg-slate-50 border-slate-200 focus:border-[#E05D26] focus:ring-[#E05D26]/20"
                      required
                      data-testid="login-phone-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">{t('password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-11 pr-11 h-12 bg-slate-50 border-slate-200 focus:border-[#E05D26] focus:ring-[#E05D26]/20"
                      required
                      data-testid="login-password-input"
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

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-300 text-[#E05D26] focus:ring-[#E05D26]" />
                    <span className="text-slate-600">Se souvenir de moi</span>
                  </label>
                  <a href="#" className="text-[#E05D26] hover:underline">
                    {t('forgot_password')}
                  </a>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#E05D26] hover:bg-[#C2410C] text-white h-12 rounded-xl font-medium"
                  data-testid="login-submit-btn"
                >
                  {loading ? t('loading') : t('login')}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-600">
                  {t('no_account')}{' '}
                  <Link to="/register" className="text-[#E05D26] font-medium hover:underline">
                    {t('register')}
                  </Link>
                </p>
              </div>

              {/* Admin/Agent Links */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-center text-sm text-slate-500 mb-3">Accès professionnel</p>
                <div className="flex gap-3">
                  <Link
                    to="/admin/login"
                    className="flex-1 text-center py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Administration DGI
                  </Link>
                  <Link
                    to="/agent/login"
                    className="flex-1 text-center py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Forces de l'ordre
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
