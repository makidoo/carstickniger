import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AdminSidebar } from '../components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  Car, 
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  MapPin
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const NIGER_REGIONS = ["Niamey", "Agadez", "Diffa", "Dosso", "Maradi", "Tahoua", "Tillabéri", "Zinder"];

export default function AdminVehicles() {
  const { t } = useLanguage();
  const { user, canViewAllRegions, userRegion, isSupervisor } = useAuth();
  
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(userRegion || 'all');
  const [page, setPage] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchVehicles();
  }, [page, selectedRegion]);

  const fetchVehicles = async () => {
    try {
      const params = new URLSearchParams();
      params.append('skip', page * limit);
      params.append('limit', limit);
      if (selectedRegion && selectedRegion !== 'all') params.append('region', selectedRegion);
      
      const res = await axios.get(`${API}/admin/vehicles?${params.toString()}`);
      setVehicles(res.data);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  //const filteredVehicles = vehicles.filter(v => 
    //v.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //v.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
  //);
const filteredVehicles = vehicles.filter(v => 
  v.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  v.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
);
  const statusColors = {
    valid: 'bg-emerald-100 text-emerald-700',
    invalid: 'bg-orange-100 text-orange-700',
    inactive: 'bg-slate-100 text-slate-700'
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar />
      
      <main className="ml-64 p-8" data-testid="admin-vehicles-page">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{t('vehicles')}</h1>
            <p className="text-slate-500 mt-1">
              {isSupervisor ? (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Véhicules de la région: <strong>{userRegion}</strong>
                </span>
              ) : (
                "Gestion des véhicules enregistrés"
              )}
            </p>
          </div>
          
          {/* Region Filter for admin/super_admin */}
          {canViewAllRegions && (
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-48 bg-white">
                <SelectValue placeholder="Toutes les régions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les régions</SelectItem>
                {NIGER_REGIONS.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-[#E05D26]" />
                Liste des Véhicules
                {selectedRegion && (
                  <Badge variant="outline" className="ml-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedRegion}
                  </Badge>
                )}
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                  data-testid="admin-vehicle-search"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-[#E05D26] border-t-transparent rounded-full" />
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Immatriculation</TableHead>
                      <TableHead>Propriétaire</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Marque/Modèle</TableHead>
                      <TableHead>Région</TableHead>
                      <TableHead>Statut Vignette</TableHead>
                      <TableHead>Dernier Paiement</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-mono font-bold">
                          {vehicle.registration_number}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{vehicle.owner_name}</p>
                            <p className="text-sm text-slate-500">{vehicle.owner_phone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{t(vehicle.vehicle_type)}</TableCell>
                        <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <MapPin className="w-3 h-3 mr-1" />
                            {vehicle.region || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[vehicle.sticker_status]}>
                            {t(vehicle.sticker_status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(vehicle.last_payment)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedVehicle(vehicle)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredVehicles.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    Aucun véhicule trouvé
                  </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <p className="text-sm text-slate-500">
                    Affichage de {filteredVehicles.length} véhicules
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm px-3">Page {page + 1}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={vehicles.length < limit}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Detail Modal */}
        <Dialog open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Détails du Véhicule</DialogTitle>
            </DialogHeader>
            {selectedVehicle && (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="font-mono text-2xl font-bold text-center">
                    {selectedVehicle.registration_number}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Propriétaire</p>
                    <p className="font-medium">{selectedVehicle.owner_name}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Téléphone</p>
                    <p className="font-medium">{selectedVehicle.owner_phone}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Type</p>
                    <p className="font-medium capitalize">{t(selectedVehicle.vehicle_type)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Marque/Modèle</p>
                    <p className="font-medium">{selectedVehicle.make} {selectedVehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Puissance</p>
                    <p className="font-medium">{selectedVehicle.engine_power} CV</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Région</p>
                    <p className="font-medium">{selectedVehicle.region || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Châssis</p>
                    <p className="font-medium font-mono text-xs">{selectedVehicle.chassis_number}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Statut Vignette</p>
                    <Badge className={statusColors[selectedVehicle.sticker_status]}>
                      {t(selectedVehicle.sticker_status)}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
