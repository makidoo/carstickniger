import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Navbar } from '../components/Navbar';
import { 
  Shield, 
  Smartphone, 
  CreditCard, 
  QrCode, 
  CheckCircle, 
  ArrowRight,
  Car,
  BadgeCheck,
  Zap
} from 'lucide-react';

export default function Landing() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const features = [
    {
      icon: Smartphone,
      title: t('feature_1_title'),
      description: t('feature_1_desc'),
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: CreditCard,
      title: t('feature_2_title'),
      description: t('feature_2_desc'),
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: QrCode,
      title: t('feature_3_title'),
      description: t('feature_3_desc'),
      color: 'from-blue-500 to-indigo-500'
    }
  ];

  const steps = [
    { num: 1, title: 'Créer un compte', desc: 'Inscrivez-vous avec votre numéro de téléphone', icon: Shield },
    { num: 2, title: 'Ajouter votre véhicule', desc: 'Enregistrez les informations de votre véhicule', icon: Car },
    { num: 3, title: 'Payer en ligne', desc: 'Choisissez votre mode de paiement préféré', icon: CreditCard },
    { num: 4, title: 'Recevoir votre QR', desc: 'Téléchargez votre vignette numérique', icon: BadgeCheck }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1658402834612-6c76ce7a45cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxOaWdlciUyME5pYW1leSUyMGNpdHklMjBzdHJlZXQlMjB0cmFmZmljfGVufDB8fHx8MTc2OTU5MTk1MHww&ixlib=rb-4.1.0&q=85"
            alt="Niamey Traffic"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Niger Flag Colors Bar */}
              <div className="flex w-24 h-1.5 rounded-full overflow-hidden mb-6">
                <div className="flex-1 bg-orange-500" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-green-600" />
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {t('hero_title')}
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-xl">
                {t('hero_subtitle')}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-[#E05D26] hover:bg-[#C2410C] text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                  data-testid="get-started-btn"
                >
                  {t('get_started')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/verify')}
                  className="border-2 border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg"
                  data-testid="verify-btn"
                >
                  {t('verify')}
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
                <div>
                  <p className="text-3xl font-bold text-white">300K+</p>
                  <p className="text-slate-400">Véhicules enregistrés</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">99.9%</p>
                  <p className="text-slate-400">Disponibilité</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">24/7</p>
                  <p className="text-slate-400">Service en ligne</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Floating Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
                      <CheckCircle className="w-4 h-4" />
                      Vignette Valide
                    </div>
                    <h3 className="text-white text-xl font-bold">Vignette Numérique</h3>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 mb-6">
                    <div className="flex justify-center mb-4">
                      <div className="w-32 h-32 bg-slate-100 rounded-xl flex items-center justify-center">
                        <QrCode className="w-20 h-20 text-slate-400" />
                      </div>
                    </div>
                    <p className="text-center font-mono text-2xl font-bold text-slate-800">
                      AB-1234-NE
                    </p>
                    <p className="text-center text-slate-500 mt-2">
                      Toyota Land Cruiser
                    </p>
                  </div>
                  
                  <div className="flex justify-between text-white/80 text-sm">
                    <span>Valide du: 01/01/2024</span>
                    <span>Au: 31/12/2024</span>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#E05D26] rounded-2xl opacity-50 blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-500 rounded-2xl opacity-30 blur-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Pourquoi choisir la Vignette Numérique?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Une solution moderne, sécurisée et pratique pour gérer vos obligations fiscales automobiles
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Comment ça marche?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Obtenez votre vignette numérique en 4 étapes simples
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#E05D26]/50 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#E05D26] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {step.num}
                    </div>
                    <step.icon className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.desc}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 text-slate-600">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#FDFBF7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#E05D26] to-[#C2410C] rounded-3xl p-12 shadow-2xl"
          >
            <Zap className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à commencer?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
              Rejoignez des milliers de Nigériens qui ont déjà adopté la vignette numérique
            </p>
            <Button
              onClick={() => navigate('/register')}
              className="bg-white text-[#E05D26] hover:bg-slate-100 rounded-full px-10 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
              data-testid="cta-register-btn"
            >
              Créer mon compte gratuitement
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E05D26] rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold">Vignette Numérique Niger</span>
                <p className="text-sm text-slate-400">Direction Générale des Impôts</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-slate-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">{t('terms')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('privacy')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('contact')}</a>
            </div>
            
            <div className="flex h-1.5 w-24 rounded-full overflow-hidden">
              <div className="flex-1 bg-orange-500" />
              <div className="flex-1 bg-white" />
              <div className="flex-1 bg-green-600" />
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            {t('copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
}
