import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Shield, Phone, Lock, Eye, EyeOff, User, Mail, CreditCard, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    email: '',
    national_id: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirm_password) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (!acceptTerms) {
      toast.error('Veuillez accepter les conditions d\'utilisation');
      return;
    }
    
    setLoading(true);
    
    try {
      const { confirm_password, ...registerData } = formData;
      await register(registerData);
      toast.success(t('register_success'));
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            Créez votre compte<br />en quelques minutes
          </h1>
          <p className="text-xl text-white/80 max-w-md">
            Rejoignez des milliers de Nigériens qui gèrent leurs vignettes en ligne
          </p>
          
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-white/80">Données sécurisées et protégées</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-white/80">Vérification par SMS</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-white/80">Paiement sécurisé</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#FDFBF7] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-8"
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
              <h2 className="text-2xl font-bold text-slate-800">{t('register')}</h2>
              <p className="text-slate-500">Créez votre compte citoyen</p>
            </div>
          </div>

          <Card className="border-0 shadow-xl bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Informations personnelles</CardTitle>
              <CardDescription>
                Remplissez vos informations pour créer votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">{t('first_name')} *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="first_name"
                        placeholder="Prénom"
                        value={formData.first_name}
                        onChange={(e) => updateField('first_name', e.target.value)}
                        className="pl-10 h-11 bg-slate-50"
                        required
                        data-testid="register-firstname-input"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">{t('last_name')} *</Label>
                    <Input
                      id="last_name"
                      placeholder="Nom"
                      value={formData.last_name}
                      onChange={(e) => updateField('last_name', e.target.value)}
                      className="h-11 bg-slate-50"
                      required
                      data-testid="register-lastname-input"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('phone')} *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+227 XX XX XX XX"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="pl-10 h-11 bg-slate-50"
                      required
                      data-testid="register-phone-input"
                    />
                  </div>
                </div>

                {/* Email (optional) */}
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')} (optionnel)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="pl-10 h-11 bg-slate-50"
                      data-testid="register-email-input"
                    />
                  </div>
                </div>

                {/* National ID (optional) */}
                <div className="space-y-2">
                  <Label htmlFor="national_id">{t('national_id')} (optionnel)</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="national_id"
                      placeholder="Numéro NIN"
                      value={formData.national_id}
                      onChange={(e) => updateField('national_id', e.target.value)}
                      className="pl-10 h-11 bg-slate-50"
                      data-testid="register-nin-input"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')} *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className="pl-10 pr-10 h-11 bg-slate-50"
                      required
                      data-testid="register-password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">{t('confirm_password')} *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="confirm_password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.confirm_password}
                      onChange={(e) => updateField('confirm_password', e.target.value)}
                      className="pl-10 h-11 bg-slate-50"
                      required
                      data-testid="register-confirm-password-input"
                    />
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 pt-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={setAcceptTerms}
                    className="mt-1"
                    data-testid="register-terms-checkbox"
                  />
                  <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer">
                    J'accepte les{' '}
                    <a href="#" className="text-[#E05D26] hover:underline">conditions d'utilisation</a>
                    {' '}et la{' '}
                    <a href="#" className="text-[#E05D26] hover:underline">politique de confidentialité</a>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !acceptTerms}
                  className="w-full bg-[#E05D26] hover:bg-[#C2410C] text-white h-12 rounded-xl font-medium mt-4"
                  data-testid="register-submit-btn"
                >
                  {loading ? t('loading') : t('register')}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-600">
                  {t('have_account')}{' '}
                  <Link to="/login" className="text-[#E05D26] font-medium hover:underline">
                    {t('login')}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
