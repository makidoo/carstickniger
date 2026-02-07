import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  QrCode, 
  Search, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  MapPin,
  History,
  LogOut,
  Shield,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AgentScanner() {
  const { user, logout } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  
  const [plateNumber, setPlateNumber] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inspections, setInspections] = useState([]);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Get geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log('Geolocation denied')
      );
    }
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      const res = await axios.get(`${API}/inspections?limit=10`);
      setInspections(res.data);
    } catch (err) {
      console.error('Failed to fetch inspections');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!plateNumber.trim()) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const res = await axios.get(`${API}/verify/${plateNumber.trim().toUpperCase()}`);
      setResult(res.data);
      
      // Record inspection
      await axios.post(`${API}/inspections`, {
        vehicle_registration: plateNumber.trim().toUpperCase(),
        status_at_control: res.data.status,
        latitude: location?.lat,
        longitude: location?.lng
      });
      
      fetchInspections();
    } catch (err) {
      toast.error('Erreur de vérification');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    valid: {
      icon: CheckCircle,
      color: 'bg-emerald-500',
      label: 'VALIDE',
      sound: true
    },
    invalid: {
      icon: AlertTriangle,
      color: 'bg-orange-500',
      label: 'EXPIRÉ',
      sound: true
    },
    inactive: {
      icon: XCircle,
      color: 'bg-red-500',
      label: 'NON PAYÉ',
      sound: true
    }
  };

  return (
    <div className="min-h-screen bg-slate-100" data-testid="agent-scanner">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E05D26] rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold">Agent Scanner</p>
              <p className="text-xs text-slate-400">{user?.first_name} {user?.last_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-slate-400 hover:text-white"
            >
              <Globe className="w-4 h-4 mr-1" />
              {language.toUpperCase()}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-slate-400 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4">
        {/* Scanner Card */}
        <Card className="border-0 shadow-xl bg-white mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <QrCode className="w-5 h-5 text-[#E05D26]" />
              Vérification Rapide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Numéro de plaque"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                  className="pl-12 h-14 text-xl font-mono uppercase bg-slate-50 text-center"
                  data-testid="scanner-plate-input"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !plateNumber.trim()}
                className="w-full bg-[#E05D26] hover:bg-[#C2410C] text-white h-14 text-lg rounded-xl"
                data-testid="scanner-verify-btn"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'VÉRIFIER'
                )}
              </Button>
            </form>

            {/* Location */}
            {location && (
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
                <MapPin className="w-3 h-3" />
                <span>GPS: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card className={`border-0 shadow-xl overflow-hidden`}>
              <div className={`${statusConfig[result.status]?.color} p-8 text-white text-center`}>
                {React.createElement(statusConfig[result.status]?.icon, { 
                  className: "w-24 h-24 mx-auto mb-4" 
                })}
                <h2 className="text-4xl font-bold mb-2">
                  {statusConfig[result.status]?.label}
                </h2>
                <p className="font-mono text-3xl mb-2">
                  {result.registration_number}
                </p>
                <p className="text-white/80">
                  {result.make} {result.model}
                </p>
              </div>
              <CardContent className="p-4 bg-white">
                <div className="text-center">
                  <p className="text-slate-500 text-sm">Propriétaire</p>
                  <p className="font-bold text-lg">{result.owner_name}</p>
                </div>
                {result.valid_until && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg text-center">
                    <p className="text-xs text-slate-500">Valide jusqu'au</p>
                    <p className="font-medium">
                      {new Date(result.valid_until).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent Inspections */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="w-5 h-5 text-slate-400" />
              Contrôles Récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inspections.length === 0 ? (
              <p className="text-center text-slate-500 py-4">
                Aucun contrôle effectué
              </p>
            ) : (
              <div className="space-y-2">
                {inspections.slice(0, 5).map((insp) => {
                  const config = statusConfig[insp.status_at_control];
                  return (
                    <div
                      key={insp.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <p className="font-mono font-bold">{insp.vehicle_registration}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(insp.timestamp).toLocaleString('fr-FR')}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${config?.color}`}>
                        {config?.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
