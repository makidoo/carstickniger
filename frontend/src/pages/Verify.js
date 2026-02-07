import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Search, 
  QrCode, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Car,
  User,
  Calendar
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Verify() {
  const { t } = useLanguage();
  
  const [plateNumber, setPlateNumber] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!plateNumber.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const res = await axios.get(`${API}/verify/${plateNumber.trim().toUpperCase()}`);
      setResult(res.data);
    } catch (err) {
      setError('Erreur lors de la vérification');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    valid: {
      icon: CheckCircle,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      label: 'VALIDE',
      message: 'Cette vignette est valide et à jour'
    },
    invalid: {
      icon: AlertTriangle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      label: 'EXPIRÉ',
      message: 'Cette vignette a expiré. Renouvellement requis.'
    },
    inactive: {
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      label: 'INACTIF',
      message: 'Aucune vignette active. Paiement requis.'
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]" data-testid="verify-page">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-[#E05D26]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-10 h-10 text-[#E05D26]" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {t('verify')} une Vignette
          </h1>
          <p className="text-slate-500">
            Entrez le numéro d'immatriculation pour vérifier le statut de la vignette
          </p>
        </motion.div>

        {/* Search Form */}
        <Card className="border-0 shadow-xl bg-white mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleVerify} className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="AB-1234-NE"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                  className="pl-12 h-14 text-lg font-mono uppercase bg-slate-50"
                  data-testid="verify-plate-input"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !plateNumber.trim()}
                className="bg-[#E05D26] hover:bg-[#C2410C] text-white h-14 px-8 rounded-xl"
                data-testid="verify-submit-btn"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  t('verify')
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-0 shadow-lg bg-red-50 border-l-4 border-red-500">
              <CardContent className="p-6">
                <p className="text-red-700">{error}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className={`border-0 shadow-xl overflow-hidden ${statusConfig[result.status]?.bgColor}`}>
              {/* Status Header */}
              <div className={`${statusConfig[result.status]?.color} p-6 text-white text-center`}>
                {React.createElement(statusConfig[result.status]?.icon, { className: "w-16 h-16 mx-auto mb-3" })}
                <h2 className="text-3xl font-bold mb-1">
                  {statusConfig[result.status]?.label}
                </h2>
                <p className="text-white/80">
                  {statusConfig[result.status]?.message}
                </p>
              </div>
              
              <CardContent className="p-6 bg-white">
                {/* Vehicle Info */}
                <div className="text-center mb-6 pb-6 border-b border-slate-100">
                  <p className="font-mono text-4xl font-bold text-slate-800 mb-2">
                    {result.registration_number}
                  </p>
                  <p className="text-slate-500">
                    {result.make} {result.model}
                  </p>
                </div>
                
                {/* Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <User className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase">{t('owner')}</p>
                      <p className="font-medium text-slate-800">{result.owner_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <Car className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase">{t('vehicle_type')}</p>
                      <p className="font-medium text-slate-800 capitalize">{t(result.vehicle_type)}</p>
                    </div>
                  </div>
                  
                  {result.valid_from && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Du</p>
                          <p className="font-medium text-slate-800">{formatDate(result.valid_from)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Au</p>
                          <p className="font-medium text-slate-800">{formatDate(result.valid_until)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Info Box */}
        <div className="mt-8 p-6 bg-slate-100 rounded-xl text-center">
          <p className="text-sm text-slate-600">
            Ce service est disponible 24h/24 pour les forces de l'ordre et les citoyens.
            <br />
            Pour signaler un problème, contactez la DGI.
          </p>
        </div>
      </main>
    </div>
  );
}
