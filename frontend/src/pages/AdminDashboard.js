import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AdminSidebar } from '../components/AdminSidebar';
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
  Car, 
  FileText, 
  TrendingUp, 
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  Percent,
  MapPin
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const NIGER_REGIONS = ["Niamey", "Agadez", "Diffa", "Dosso", "Maradi", "Tahoua", "Tillabéri", "Zinder"];

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { user, canViewAllRegions, userRegion, isSupervisor } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(userRegion || 'all');

  useEffect(() => {
    fetchStats();
  }, [selectedRegion]);

  const fetchStats = async () => {
    try {
      const params = selectedRegion && selectedRegion !== 'all' ? `?region=${selectedRegion}` : '';
      const res = await axios.get(`${API}/admin/dashboard${params}`);
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-NE').format(amount || 0) + ' FCFA';
  };

  const roleLabels = {
    super_admin: 'Super Administrateur',
    admin: 'Administrateur',
    supervisor: 'Superviseur'
  };

  const statCards = stats ? [
    { label: t('total_vehicles'), value: stats.total_vehicles, icon: Car, color: 'from-blue-500 to-blue-600' },
    { label: t('active_stickers'), value: stats.active_stickers, icon: FileText, color: 'from-emerald-500 to-emerald-600' },
    { label: t('invalid_stickers'), value: stats.invalid_stickers, icon: Calendar, color: 'from-orange-500 to-orange-600' },
    { label: t('inactive_stickers'), value: stats.inactive_stickers, icon: Users, color: 'from-slate-500 to-slate-600' },
  ] : [];

  const revenueCards = stats ? [
    { label: t('total_revenue'), value: formatCurrency(stats.total_revenue), icon: DollarSign, color: 'text-emerald-600' },
    { label: t('daily_revenue'), value: formatCurrency(stats.daily_revenue), icon: TrendingUp, color: 'text-blue-600' },
    { label: t('monthly_revenue'), value: formatCurrency(stats.monthly_revenue), icon: BarChart3, color: 'text-purple-600' },
    { label: t('recovery_rate'), value: `${stats.recovery_rate}%`, icon: Percent, color: 'text-amber-600' },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar />
      
      <main className="ml-64 p-8" data-testid="admin-dashboard">
        {/* Header with Role and Region Info */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-800">{t('admin_dashboard')}</h1>
              <Badge className="bg-[#E05D26] text-white">
                {roleLabels[user?.role]}
              </Badge>
            </div>
            <p className="text-slate-500">
              {isSupervisor ? (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Région: <strong>{userRegion}</strong>
                </span>
              ) : (
                "Vue d'ensemble du système de vignettes"
              )}
            </p>
          </div>

          {/* Region Filter - Only for super_admin and admin */}
          {canViewAllRegions && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Filtrer par région:</span>
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
            </div>
          )}
        </div>

        {/* Region Badge for filtered view */}
        {stats?.region && (
          <div className="mb-6">
            <Badge variant="outline" className="text-lg px-4 py-2 bg-white">
              <MapPin className="w-4 h-4 mr-2" />
              Données pour: {stats.region}
            </Badge>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-[#E05D26] border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg bg-white overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                          <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                        </div>
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <stat.icon className="w-7 h-7 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {revenueCards.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center ${stat.color}`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">{stat.label}</p>
                          <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Overview Cards */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#E05D26]" />
                    Répartition des Vignettes
                    {stats?.region && <Badge variant="outline" className="ml-2">{stats.region}</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-slate-600">Valides</span>
                        <span className="text-sm font-medium text-emerald-600">
                          {stats?.active_stickers || 0}
                        </span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: `${((stats?.active_stickers || 0) / Math.max(stats?.total_vehicles || 1, 1)) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-slate-600">Expirées</span>
                        <span className="text-sm font-medium text-orange-600">
                          {stats?.invalid_stickers || 0}
                        </span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{
                            width: `${((stats?.invalid_stickers || 0) / Math.max(stats?.total_vehicles || 1, 1)) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-slate-600">Inactives</span>
                        <span className="text-sm font-medium text-slate-600">
                          {stats?.inactive_stickers || 0}
                        </span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-400 rounded-full"
                          style={{
                            width: `${((stats?.inactive_stickers || 0) / Math.max(stats?.total_vehicles || 1, 1)) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-[#E05D26] to-[#C2410C] text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Percent className="w-5 h-5" />
                    Taux de Recouvrement
                    {stats?.region && <Badge className="bg-white/20 text-white ml-2">{stats.region}</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-6xl font-bold mb-2">{stats?.recovery_rate || 0}%</p>
                    <p className="text-white/80">Objectif: 85-90%</p>
                    <div className="mt-6 h-4 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${stats?.recovery_rate || 0}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
