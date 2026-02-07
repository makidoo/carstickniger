import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { DigitalSticker } from '../components/DigitalSticker';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Car, 
  FileText, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Award,
  ArrowRight,
  Bell
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [vehicles, setVehicles] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vehiclesRes, stickersRes, loyaltyRes] = await Promise.all([
        axios.get(`${API}/vehicles`),
        axios.get(`${API}/stickers`),
        axios.get(`${API}/loyalty/points`)
      ]);
      setVehicles(vehiclesRes.data);
      setStickers(stickersRes.data);
      setLoyaltyPoints(loyaltyRes.data.points);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getVehicleSticker = (vehicleId) => {
    return stickers.find(s => s.vehicle_id === vehicleId);
  };

  const getVehicleById = (vehicleId) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  const stats = {
    totalVehicles: vehicles.length,
    validStickers: stickers.filter(s => s.status === 'valid').length,
    expiredStickers: stickers.filter(s => s.status === 'invalid').length,
    inactiveStickers: stickers.filter(s => s.status === 'inactive').length
  };

  const expiringSoon = stickers.filter(s => {
    if (s.status !== 'valid') return false;
    const daysLeft = Math.ceil((new Date(s.end_date) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 30 && daysLeft > 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-[#E05D26] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]" data-testid="citizen-dashboard">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800">
            {t('welcome')}, {user?.first_name}!
          </h1>
          <p className="text-slate-500 mt-1">
            Gérez vos véhicules et vignettes numériques
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{t('vehicles')}</p>
                    <p className="text-3xl font-bold text-slate-800">{stats.totalVehicles}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{t('valid')}</p>
                    <p className="text-3xl font-bold text-emerald-600">{stats.validStickers}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{t('invalid')}</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.expiredStickers}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-400 to-amber-500 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-100">{t('loyalty_points')}</p>
                    <p className="text-3xl font-bold text-white">{loyaltyPoints}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Alerts */}
        {expiringSoon.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-0 shadow-lg bg-orange-50 border-l-4 border-orange-400">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-800">
                      {expiringSoon.length} vignette(s) expire(nt) bientôt
                    </h3>
                    <p className="text-orange-700 text-sm mt-1">
                      Renouvelez vos vignettes avant leur expiration pour éviter les pénalités.
                    </p>
                    <Button
                      onClick={() => navigate('/stickers')}
                      variant="link"
                      className="text-orange-600 p-0 h-auto mt-2"
                    >
                      Voir les détails <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* My Vehicles */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold">{t('my_vehicles')}</CardTitle>
                <Button
                  onClick={() => navigate('/vehicles/add')}
                  className="bg-[#E05D26] hover:bg-[#C2410C] text-white rounded-full"
                  data-testid="add-vehicle-btn"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('add_vehicle')}
                </Button>
              </CardHeader>
              <CardContent>
                {vehicles.length === 0 ? (
                  <div className="text-center py-12">
                    <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">
                      Aucun véhicule enregistré
                    </h3>
                    <p className="text-slate-500 mb-4">
                      Ajoutez votre premier véhicule pour obtenir une vignette
                    </p>
                    <Button
                      onClick={() => navigate('/vehicles/add')}
                      className="bg-[#E05D26] hover:bg-[#C2410C] text-white rounded-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un véhicule
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vehicles.map((vehicle) => {
                      const sticker = getVehicleSticker(vehicle.id);
                      const statusColors = {
                        valid: 'bg-emerald-100 text-emerald-700',
                        invalid: 'bg-orange-100 text-orange-700',
                        inactive: 'bg-slate-100 text-slate-700'
                      };
                      
                      return (
                        <motion.div
                          key={vehicle.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                          onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                          data-testid={`vehicle-card-${vehicle.id}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                              <Car className="w-6 h-6 text-slate-600" />
                            </div>
                            <div>
                              <p className="font-mono font-bold text-lg text-slate-800">
                                {vehicle.registration_number}
                              </p>
                              <p className="text-slate-500 text-sm">
                                {vehicle.make} {vehicle.model}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {sticker ? (
                              <Badge className={statusColors[sticker.status]}>
                                {t(sticker.status)}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-slate-300 text-slate-500">
                                Pas de vignette
                              </Badge>
                            )}
                            <ArrowRight className="w-5 h-5 text-slate-400" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Latest Sticker */}
          <div>
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Dernière Vignette</CardTitle>
              </CardHeader>
              <CardContent>
                {stickers.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <DigitalSticker
                      sticker={stickers[0]}
                      vehicle={getVehicleById(stickers[0].vehicle_id)}
                      size="small"
                    />
                    <Button
                      onClick={() => navigate('/stickers')}
                      variant="link"
                      className="text-[#E05D26] mt-4"
                    >
                      Voir toutes les vignettes
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">
                      Aucune vignette achetée
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-xl bg-white mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => navigate('/stickers/purchase')}
                  className="w-full justify-start bg-[#E05D26] hover:bg-[#C2410C] text-white"
                  disabled={vehicles.length === 0}
                  data-testid="buy-sticker-btn"
                >
                  <FileText className="w-4 h-4 mr-3" />
                  {t('buy_sticker')}
                </Button>
                <Button
                  onClick={() => navigate('/vehicles/add')}
                  variant="outline"
                  className="w-full justify-start border-slate-200"
                >
                  <Plus className="w-4 h-4 mr-3" />
                  {t('add_vehicle')}
                </Button>
                <Button
                  onClick={() => navigate('/payments')}
                  variant="outline"
                  className="w-full justify-start border-slate-200"
                >
                  <Clock className="w-4 h-4 mr-3" />
                  {t('payment_history')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
