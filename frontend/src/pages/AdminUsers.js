import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
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
  DialogDescription,
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
  Users, 
  Plus,
  UserCheck,
  UserX,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const NIGER_REGIONS = ["Niamey", "Agadez", "Diffa", "Dosso", "Maradi", "Tahoua", "Tillabéri", "Zinder"];

export default function AdminUsers() {
  const { t } = useLanguage();
  const { user, isSuperAdmin } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'agent',
    region: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/admin/users`);
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate region for supervisor/agent
    if (['supervisor', 'agent'].includes(formData.role) && !formData.region) {
      toast.error('La région est obligatoire pour les superviseurs et agents');
      return;
    }
    
    try {
      await axios.post(`${API}/admin/users`, formData);
      toast.success('Utilisateur créé avec succès');
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erreur lors de la création');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      first_name: '',
      last_name: '',
      role: 'agent',
      region: ''
    });
  };

  // Role options based on current user's role
  const availableRoles = isSuperAdmin 
    ? [
        { value: 'admin', label: 'Administrateur' },
        { value: 'supervisor', label: 'Superviseur' },
        { value: 'agent', label: 'Agent' }
      ]
    : [
        { value: 'supervisor', label: 'Superviseur' },
        { value: 'agent', label: 'Agent' }
      ];

  const roleLabels = {
    super_admin: 'Super Admin',
    admin: 'Administrateur',
    supervisor: 'Superviseur',
    agent: 'Agent'
  };

  const roleColors = {
    super_admin: 'bg-purple-100 text-purple-700',
    admin: 'bg-blue-100 text-blue-700',
    supervisor: 'bg-emerald-100 text-emerald-700',
    agent: 'bg-slate-100 text-slate-700'
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar />
      
      <main className="ml-64 p-8" data-testid="admin-users-page">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{t('user_management')}</h1>
            <p className="text-slate-500 mt-1">
              {isSuperAdmin 
                ? "Gérez tous les utilisateurs (admins, superviseurs, agents)"
                : "Gérez les superviseurs et agents"
              }
            </p>
          </div>
          <Button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="bg-[#E05D26] hover:bg-[#C2410C] text-white"
            data-testid="add-user-btn"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Utilisateur
          </Button>
        </div>

        {/* Role Hierarchy Info */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-800 to-slate-900 text-white mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="font-bold">Hiérarchie des Rôles</h3>
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-white/10 rounded-lg">
                <Badge className="bg-purple-500 text-white mb-2">Super Admin</Badge>
                <p className="text-white/80">Accès complet, gestion des admins</p>
              </div>
              <div className="p-3 bg-white/10 rounded-lg">
                <Badge className="bg-blue-500 text-white mb-2">Admin</Badge>
                <p className="text-white/80">Gère superviseurs/agents, voit toutes régions</p>
              </div>
              <div className="p-3 bg-white/10 rounded-lg">
                <Badge className="bg-emerald-500 text-white mb-2">Superviseur</Badge>
                <p className="text-white/80">Voit uniquement sa région assignée</p>
              </div>
              <div className="p-3 bg-white/10 rounded-lg">
                <Badge className="bg-slate-500 text-white mb-2">Agent</Badge>
                <p className="text-white/80">Scanner de vérification uniquement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#E05D26]" />
              Liste des Utilisateurs
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
                    <TableHead>Nom d'utilisateur</TableHead>
                    <TableHead>Nom Complet</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Région</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date de Création</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-mono font-medium">
                        {u.username}
                      </TableCell>
                      <TableCell>
                        {u.first_name} {u.last_name}
                      </TableCell>
                      <TableCell>
                        <Badge className={roleColors[u.role]}>
                          {roleLabels[u.role] || u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {u.region ? (
                          <Badge variant="outline">
                            <MapPin className="w-3 h-3 mr-1" />
                            {u.region}
                          </Badge>
                        ) : (
                          <span className="text-slate-400">Toutes</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {u.status === 'active' ? (
                          <Badge className="bg-emerald-100 text-emerald-700">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Actif
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700">
                            <UserX className="w-3 h-3 mr-1" />
                            Inactif
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(u.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {users.length === 0 && !loading && (
              <div className="text-center py-12 text-slate-500">
                Aucun utilisateur trouvé
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create User Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvel Utilisateur</DialogTitle>
              <DialogDescription>
                {isSuperAdmin 
                  ? "Créez un administrateur, superviseur ou agent"
                  : "Créez un superviseur ou agent"
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom *</Label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom *</Label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nom d'utilisateur *</Label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="ex: sup_niamey"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Mot de passe *</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Rôle *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(v) => setFormData({ ...formData, role: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Région {['supervisor', 'agent'].includes(formData.role) && <span className="text-red-500">*</span>}
                </Label>
                <Select
                  value={formData.region}
                  onValueChange={(v) => setFormData({ ...formData, region: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une région" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.role === 'admin' && (
                      <SelectItem value="none">Toutes les régions</SelectItem>
                    )}
                    {NIGER_REGIONS.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {['supervisor', 'agent'].includes(formData.role) && (
                  <p className="text-xs text-slate-500">
                    Les superviseurs et agents doivent être assignés à une région
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-[#E05D26] hover:bg-[#C2410C] text-white">
                  Créer
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
