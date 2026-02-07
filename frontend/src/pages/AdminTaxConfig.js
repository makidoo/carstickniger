import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { AdminSidebar } from '../components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  Settings, 
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminTaxConfig() {
  const { t } = useLanguage();
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editConfig, setEditConfig] = useState(null);
  const [formData, setFormData] = useState({
    vehicle_category: 'car',
    engine_power_min: 0,
    engine_power_max: 100,
    base_amount: 25000,
    multi_year_discount: 5,
    status: 'active'
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await axios.get(`${API}/admin/tax-configs`);
      setConfigs(res.data);
    } catch (err) {
      console.error('Failed to fetch configs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editConfig) {
        await axios.put(`${API}/admin/tax-configs/${editConfig.id}`, formData);
        toast.success('Configuration mise à jour');
      } else {
        await axios.post(`${API}/admin/tax-configs`, formData);
        toast.success('Configuration créée');
      }
      setShowModal(false);
      setEditConfig(null);
      resetForm();
      fetchConfigs();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erreur');
    }
  };

  const resetForm = () => {
    setFormData({
      vehicle_category: 'car',
      engine_power_min: 0,
      engine_power_max: 100,
      base_amount: 25000,
      multi_year_discount: 5,
      status: 'active'
    });
  };

  const openEdit = (config) => {
    setEditConfig(config);
    setFormData({
      vehicle_category: config.vehicle_category,
      engine_power_min: config.engine_power_min,
      engine_power_max: config.engine_power_max,
      base_amount: config.base_amount,
      multi_year_discount: config.multi_year_discount,
      status: config.status
    });
    setShowModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-NE').format(amount) + ' FCFA';
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar />
      
      <main className="ml-64 p-8" data-testid="admin-tax-config-page">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{t('tax_configuration')}</h1>
            <p className="text-slate-500 mt-1">
              Configurez les tarifs de vignettes par catégorie
            </p>
          </div>
          <Button
            onClick={() => { resetForm(); setEditConfig(null); setShowModal(true); }}
            className="bg-[#E05D26] hover:bg-[#C2410C] text-white"
            data-testid="add-tax-config-btn"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Configuration
          </Button>
        </div>

        <Card className="border-0 shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#E05D26]" />
              Configurations Fiscales
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-[#E05D26] border-t-transparent rounded-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Puissance (CV)</TableHead>
                    <TableHead>Montant de Base</TableHead>
                    <TableHead>Réduction Multi-année</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configs.map((config) => (
                    <TableRow key={config.id}>
                      <TableCell className="capitalize font-medium">
                        {t(config.vehicle_category)}
                      </TableCell>
                      <TableCell>
                        {config.engine_power_min} - {config.engine_power_max} CV
                      </TableCell>
                      <TableCell className="font-bold text-[#E05D26]">
                        {formatCurrency(config.base_amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                          {config.multi_year_discount}% / an
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={config.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
                          {config.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(config)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {configs.length === 0 && !loading && (
              <div className="text-center py-12 text-slate-500">
                Aucune configuration trouvée
              </div>
            )}
          </CardContent>
        </Card>

        {/* Config Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editConfig ? 'Modifier la Configuration' : 'Nouvelle Configuration'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Catégorie de Véhicule</Label>
                <Select
                  value={formData.vehicle_category}
                  onValueChange={(v) => setFormData({ ...formData, vehicle_category: v })}
                  disabled={!!editConfig}
                >
                  <SelectTrigger>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Puissance Min (CV)</Label>
                  <Input
                    type="number"
                    value={formData.engine_power_min}
                    onChange={(e) => setFormData({ ...formData, engine_power_min: parseInt(e.target.value) })}
                    disabled={!!editConfig}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Puissance Max (CV)</Label>
                  <Input
                    type="number"
                    value={formData.engine_power_max}
                    onChange={(e) => setFormData({ ...formData, engine_power_max: parseInt(e.target.value) })}
                    disabled={!!editConfig}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Montant de Base (FCFA)</Label>
                <Input
                  type="number"
                  value={formData.base_amount}
                  onChange={(e) => setFormData({ ...formData, base_amount: parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label>Réduction Multi-année (%)</Label>
                <Input
                  type="number"
                  value={formData.multi_year_discount}
                  onChange={(e) => setFormData({ ...formData, multi_year_discount: parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label>Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-[#E05D26] hover:bg-[#C2410C] text-white">
                  {editConfig ? 'Mettre à jour' : 'Créer'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
