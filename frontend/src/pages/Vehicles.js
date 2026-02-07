import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import { 
  Car, 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowLeft,
  Fuel,
  Gauge,
  Calendar,
  Hash,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const NIGER_REGIONS = ["Niamey", "Agadez", "Diffa", "Dosso", "Maradi", "Tahoua", "Tillabéri", "Zinder"];

export default function Vehicles() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteVehicle, setDeleteVehicle] = useState(null);
  const [formData, setFormData] = useState({
    registration_number: '',
    vehicle_type: 'car',
    make: '',
    model: '',
    energy_type: 'gasoline',
    engine_power: '',
    chassis_number: '',
    year_of_manufacture: '',
    region: 'Niamey'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`${API}/vehicles`);
      setVehicles(res.data);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        registration_number: formData.registration_number.toUpperCase(),
        engine_power: parseInt(formData.engine_power),
        year_of_manufacture: parseInt(formData.year_of_manufacture)
      };
      
      await axios.post(`${API}/vehicles`, payload);
      toast.success(t('vehicle_added'));
      setShowAddModal(false);
      setFormData({
        registration_number: '',
        vehicle_type: 'car',
        make: '',
        model: '',
        energy_type: 'gasoline',
        engine_power: '',
        chassis_number: '',
        year_of_manufacture: ''
      });
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteVehicle) return;
    
    try {
      await axios.delete(`${API}/vehicles/${deleteVehicle.id}`);
      toast.success(t('vehicle_deleted'));
      setDeleteVehicle(null);
      fetchVehicles();
    } catch (err) {
      toast.error('Failed to delete vehicle');
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const vehicleTypeIcons = {
    car: '🚗',
    motorcycle: '🏍️',
    truck: '🚚',
    bus: '🚌',
    other: '🚙'
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
    <div className="min-h-screen bg-[#FDFBF7]" data-testid="vehicles-page">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{t('my_vehicles')}</h1>
            <p className="text-slate-500 mt-1">
              Gérez vos véhicules enregistrés
            </p>
          </div>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#E05D26] hover:bg-[#C2410C] text-white rounded-full"
                data-testid="add-vehicle-modal-btn"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('add_vehicle')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{t('add_vehicle')}</DialogTitle>
                <DialogDescription>
                  Entrez les informations de votre véhicule
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Registration Number */}
                <div className="space-y-2">
                  <Label>{t('registration_number')} *</Label>
                  <Input
                    placeholder="AB-1234-NE"
                    value={formData.registration_number}
                    onChange={(e) => updateField('registration_number', e.target.value.toUpperCase())}
                    className="font-mono uppercase"
                    required
                    data-testid="vehicle-reg-input"
                  />
                </div>

                {/* Vehicle Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('vehicle_type')} *</Label>
                    <Select
                      value={formData.vehicle_type}
                      onValueChange={(v) => updateField('vehicle_type', v)}
                    >
                      <SelectTrigger data-testid="vehicle-type-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">{t('car')}</SelectItem>
                        <SelectItem value="motorcycle">{t('motorcycle')}</SelectItem>
                        <SelectItem value="truck">{t('truck')}</SelectItem>
                        <SelectItem value="bus">{t('bus')}</SelectItem>
                        <SelectItem value="other">{t('other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('energy_type')} *</Label>
                    <Select
                      value={formData.energy_type}
                      onValueChange={(v) => updateField('energy_type', v)}
                    >
                      <SelectTrigger data-testid="vehicle-energy-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gasoline">{t('gasoline')}</SelectItem>
                        <SelectItem value="diesel">{t('diesel')}</SelectItem>
                        <SelectItem value="electric">{t('electric')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Make & Model */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('make')} *</Label>
                    <Input
                      placeholder="Toyota"
                      value={formData.make}
                      onChange={(e) => updateField('make', e.target.value)}
                      required
                      data-testid="vehicle-make-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('model')} *</Label>
                    <Input
                      placeholder="Land Cruiser"
                      value={formData.model}
                      onChange={(e) => updateField('model', e.target.value)}
                      required
                      data-testid="vehicle-model-input"
                    />
                  </div>
                </div>

                {/* Power & Year */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('engine_power')} *</Label>
                    <Input
                      type="number"
                      placeholder="150"
                      value={formData.engine_power}
                      onChange={(e) => updateField('engine_power', e.target.value)}
                      required
                      data-testid="vehicle-power-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('year_of_manufacture')} *</Label>
                    <Input
                      type="number"
                      placeholder="2020"
                      value={formData.year_of_manufacture}
                      onChange={(e) => updateField('year_of_manufacture', e.target.value)}
                      required
                      data-testid="vehicle-year-input"
                    />
                  </div>
                </div>

                {/* Chassis Number */}
                <div className="space-y-2">
                  <Label>{t('chassis_number')} *</Label>
                  <Input
                    placeholder="VIN / Numéro de châssis"
                    value={formData.chassis_number}
                    onChange={(e) => updateField('chassis_number', e.target.value.toUpperCase())}
                    className="font-mono uppercase"
                    required
                    data-testid="vehicle-chassis-input"
                  />
                </div>

                {/* Region */}
                <div className="space-y-2">
                  <Label>Région d'immatriculation *</Label>
                  <Select
                    value={formData.region}
                    onValueChange={(v) => updateField('region', v)}
                  >
                    <SelectTrigger data-testid="vehicle-region-select">
                      <SelectValue placeholder="Sélectionner une région" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGER_REGIONS.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#E05D26] hover:bg-[#C2410C] text-white"
                    data-testid="vehicle-submit-btn"
                  >
                    {submitting ? t('loading') : t('add')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Vehicles Grid */}
        {vehicles.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="py-16 text-center">
              <Car className="w-20 h-20 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-600 mb-2">
                Aucun véhicule enregistré
              </h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                Ajoutez votre premier véhicule pour pouvoir acheter une vignette numérique
              </p>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-[#E05D26] hover:bg-[#C2410C] text-white rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter mon premier véhicule
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{vehicleTypeIcons[vehicle.vehicle_type]}</span>
                        <div>
                          <CardTitle className="font-mono text-xl">
                            {vehicle.registration_number}
                          </CardTitle>
                          <p className="text-slate-500 text-sm">
                            {vehicle.make} {vehicle.model}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {t(vehicle.vehicle_type)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Fuel className="w-4 h-4 text-slate-400" />
                        <span>{t(vehicle.energy_type)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Gauge className="w-4 h-4 text-slate-400" />
                        <span>{vehicle.engine_power} CV</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{vehicle.year_of_manufacture}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Hash className="w-4 h-4 text-slate-400" />
                        <span className="truncate text-xs font-mono">
                          {vehicle.chassis_number}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-6 pt-4 border-t border-slate-100">
                      <Button
                        onClick={() => navigate(`/stickers/purchase?vehicle=${vehicle.id}`)}
                        className="flex-1 bg-[#E05D26] hover:bg-[#C2410C] text-white"
                        data-testid={`buy-sticker-${vehicle.id}`}
                      >
                        Acheter Vignette
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeleteVehicle(vehicle)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        data-testid={`delete-vehicle-${vehicle.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteVehicle} onOpenChange={() => setDeleteVehicle(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer le véhicule{' '}
                <strong>{deleteVehicle?.registration_number}</strong>?
                Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteVehicle(null)}>
                Annuler
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
