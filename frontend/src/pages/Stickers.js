import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { DigitalSticker } from '../components/DigitalSticker';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  FileText, 
  Download, 
  Eye,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Stickers() {
  const { t } = useLanguage();
  
  const [stickers, setStickers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSticker, setSelectedSticker] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stickersRes, vehiclesRes] = await Promise.all([
        axios.get(`${API}/stickers`),
        axios.get(`${API}/vehicles`)
      ]);
      setStickers(stickersRes.data);
      setVehicles(vehiclesRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getVehicle = (vehicleId) => vehicles.find(v => v.id === vehicleId);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-NE').format(amount) + ' FCFA';
  };

  const statusConfig = {
    valid: { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700', label: t('valid') },
    invalid: { icon: Clock, color: 'bg-orange-100 text-orange-700', label: t('invalid') },
    inactive: { icon: AlertTriangle, color: 'bg-slate-100 text-slate-700', label: t('inactive') }
  };

  const downloadQR = (sticker, vehicle) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${sticker.qr_code}`;
    link.download = `vignette-${vehicle?.registration_number || 'qr'}.png`;
    link.click();
  };

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
    <div className="min-h-screen bg-[#FDFBF7]" data-testid="stickers-page">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">{t('stickers')}</h1>
          <p className="text-slate-500 mt-1">
            Consultez et gérez vos vignettes numériques
          </p>
        </div>

        {stickers.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="py-16 text-center">
              <FileText className="w-20 h-20 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-600 mb-2">
                Aucune vignette
              </h3>
              <p className="text-slate-500">
                Vous n'avez pas encore acheté de vignette numérique
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stickers.map((sticker, index) => {
              const vehicle = getVehicle(sticker.vehicle_id);
              const config = statusConfig[sticker.status];
              const StatusIcon = config.icon;
              
              return (
                <motion.div
                  key={sticker.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow overflow-hidden">
                    {/* Status Header */}
                    <div className={`${config.color} px-4 py-2 flex items-center gap-2`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="font-medium text-sm">{config.label}</span>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-mono font-bold text-xl text-slate-800">
                            {vehicle?.registration_number || 'N/A'}
                          </p>
                          <p className="text-slate-500 text-sm">
                            {vehicle?.make} {vehicle?.model}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm mb-6">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>Du {formatDate(sticker.start_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>Au {formatDate(sticker.end_date)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setSelectedSticker(sticker)}
                          data-testid={`view-sticker-${sticker.id}`}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir
                        </Button>
                        <Button
                          className="flex-1 bg-[#E05D26] hover:bg-[#C2410C] text-white"
                          onClick={() => downloadQR(sticker, vehicle)}
                          data-testid={`download-sticker-${sticker.id}`}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          QR
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Sticker Detail Modal */}
        <Dialog open={!!selectedSticker} onOpenChange={() => setSelectedSticker(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Détails de la Vignette</DialogTitle>
            </DialogHeader>
            {selectedSticker && (
              <div className="flex flex-col items-center py-4">
                <DigitalSticker
                  sticker={selectedSticker}
                  vehicle={getVehicle(selectedSticker.vehicle_id)}
                  size="normal"
                />
                <div className="w-full mt-6 space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Transaction</span>
                    <span className="font-mono">{selectedSticker.transaction_id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Montant payé</span>
                    <span className="font-medium">{formatCurrency(selectedSticker.amount_paid)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Points gagnés</span>
                    <span className="font-medium text-amber-600">+{selectedSticker.loyalty_points}</span>
                  </div>
                </div>
                <Button
                  className="w-full mt-6 bg-[#E05D26] hover:bg-[#C2410C] text-white"
                  onClick={() => downloadQR(selectedSticker, getVehicle(selectedSticker.vehicle_id))}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger le QR Code
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
