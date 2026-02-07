import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AdminSidebar } from '../components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { 
  Bell, 
  Send, 
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminNotifications() {
  const { t } = useLanguage();
  const { isSuperAdmin, isAdmin } = useAuth();
  
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testEmail, setTestEmail] = useState({ email: '', subject: '', content: '' });
  const [stats, setStats] = useState({ total: 0, sent: 0, failed: 0 });
  const [config, setConfig] = useState({ simulation_mode: true });

  useEffect(() => {
    fetchLogs();
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await axios.get(`${API}/notifications/config`);
      setConfig(res.data);
    } catch (err) {
      console.error('Failed to fetch notification config:', err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API}/notifications/logs`);
      setLogs(res.data.logs || []);
      
      // Calculate stats
      const sent = res.data.logs?.filter(l => l.status === 'sent').length || 0;
      const failed = res.data.logs?.filter(l => l.status === 'failed').length || 0;
      setStats({
        total: res.data.total || 0,
        sent,
        failed
      });
    } catch (err) {
      console.error('Failed to fetch notification logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendExpiryReminders = async () => {
    setSending(true);
    try {
      const res = await axios.post(`${API}/notifications/send-expiry-reminders`);
      
      if (res.data.simulation_mode) {
        toast.info(`${res.data.notifications_sent} notification(s) simulée(s) (Mode test)`);
      } else {
        toast.success(`${res.data.notifications_sent} notification(s) envoyée(s)`);
      }
      
      if (res.data.errors > 0) {
        toast.warning(`${res.data.errors} erreur(s) rencontrée(s)`);
      }
      
      fetchLogs();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erreur lors de l\'envoi');
    } finally {
      setSending(false);
    }
  };

  const sendTestEmail = async (e) => {
    e.preventDefault();
    setSending(true);
    
    try {
      await axios.post(`${API}/notifications/test-email`, {
        recipient_email: testEmail.email,
        subject: testEmail.subject,
        html_content: `<div style="font-family: Arial; padding: 20px;">
          <h2>Test de notification</h2>
          <p>${testEmail.content}</p>
          <hr/>
          <p style="color: #666; font-size: 12px;">Envoyé depuis le système Vignette Niger</p>
        </div>`
      });
      
      toast.success('Email de test envoyé avec succès');
      setShowTestModal(false);
      setTestEmail({ email: '', subject: '', content: '' });
      fetchLogs();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Échec de l\'envoi');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar />
      
      <main className="ml-64 p-8" data-testid="admin-notifications-page">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
            <p className="text-slate-500 mt-1">
              Gestion des notifications par email
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowTestModal(true)}
              data-testid="test-email-btn"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email de test
            </Button>
            <Button
              onClick={sendExpiryReminders}
              disabled={sending}
              className="bg-[#E05D26] hover:bg-[#C2410C] text-white"
              data-testid="send-reminders-btn"
            >
              {sending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Envoyer rappels d'expiration
            </Button>
          </div>
        </div>

        {/* Simulation Mode Warning */}
        {config.simulation_mode && (
          <Card className="border-0 shadow-lg bg-amber-50 border-l-4 border-l-amber-500 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800">Mode Simulation Activé</h3>
                  <p className="text-amber-700 text-sm">
                    Les emails ne sont pas réellement envoyés. Pour activer les emails en production, 
                    configurez une clé API Resend valide dans <code className="bg-amber-100 px-1 rounded">backend/.env</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total envoyés</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Réussis</p>
                  <p className="text-2xl font-bold text-emerald-600">{stats.sent}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Échecs</p>
                  <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Rappels automatiques</h3>
                <p className="text-slate-600 text-sm">
                  Les rappels d'expiration sont envoyés aux citoyens dont la vignette expire dans <strong>7 jours</strong>.
                  Cliquez sur "Envoyer rappels d'expiration" pour déclencher l'envoi manuellement, ou configurez un job automatique.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#E05D26]" />
              Historique des notifications
            </CardTitle>
            <CardDescription>
              Liste des emails envoyés aux citoyens
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-[#E05D26] border-t-transparent rounded-full" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Mail className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p>Aucune notification envoyée pour le moment</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Destinataire</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-slate-600">
                        {formatDate(log.sent_at)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.recipient}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {log.type === 'expiry_reminder' ? 'Rappel expiration' : log.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-700">
                          <Mail className="w-3 h-3 mr-1" />
                          Email
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.status === 'sent' ? (
                          <Badge className="bg-emerald-100 text-emerald-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Envoyé
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700">
                            <XCircle className="w-3 h-3 mr-1" />
                            Échec
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Test Email Modal */}
        <Dialog open={showTestModal} onOpenChange={setShowTestModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Envoyer un email de test</DialogTitle>
              <DialogDescription>
                Testez la configuration email en envoyant un message
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={sendTestEmail} className="space-y-4">
              <div className="space-y-2">
                <Label>Email destinataire *</Label>
                <Input
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail.email}
                  onChange={(e) => setTestEmail({ ...testEmail, email: e.target.value })}
                  required
                  data-testid="test-email-input"
                />
              </div>
              <div className="space-y-2">
                <Label>Sujet *</Label>
                <Input
                  placeholder="Test de notification"
                  value={testEmail.subject}
                  onChange={(e) => setTestEmail({ ...testEmail, subject: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Message *</Label>
                <Input
                  placeholder="Ceci est un email de test..."
                  value={testEmail.content}
                  onChange={(e) => setTestEmail({ ...testEmail, content: e.target.value })}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowTestModal(false)}>
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={sending}
                  className="bg-[#E05D26] hover:bg-[#C2410C] text-white"
                >
                  {sending ? 'Envoi...' : 'Envoyer'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
