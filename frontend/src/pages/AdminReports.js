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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  BarChart3, 
  Download,
  TrendingUp,
  CreditCard,
  PieChart,
  MapPin
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const NIGER_REGIONS = ["Niamey", "Agadez", "Diffa", "Dosso", "Maradi", "Tahoua", "Tillabéri", "Zinder"];

export default function AdminReports() {
  const { t } = useLanguage();
  const { user, canViewAllRegions, userRegion, isSupervisor } = useAuth();
  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(userRegion || 'all');

  useEffect(() => {
    fetchReport();
  }, [selectedRegion, fetchReport]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (selectedRegion && selectedRegion !== 'all') params.append('region', selectedRegion);
      
      const res = await axios.get(`${API}/admin/reports/payments?${params.toString()}`);
      setReport(res.data);
    } catch (err) {
      console.error('Failed to fetch report:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-NE').format(amount || 0) + ' FCFA';
  };

  const exportCSV = () => {
    if (!report?.transactions) return;
    
    const headers = ['Date', 'Transaction', 'Montant', 'Mode Paiement', 'Statut'];
    const rows = report.transactions.map(t => [
      new Date(t.created_at).toLocaleDateString('fr-FR'),
      t.transaction_ref,
      t.amount,
      t.payment_method,
      t.status
    ]);
    
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-paiements-${selectedRegion || 'toutes-regions'}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const methodLabels = {
    mobile_money: 'Mobile Money',
    bank: 'Virement Bancaire',
    card: 'Carte Bancaire'
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar />
      
      <main className="ml-64 p-8" data-testid="admin-reports-page">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{t('reports')}</h1>
            <p className="text-slate-500 mt-1">
              {isSupervisor ? (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Rapports de la région: <strong>{userRegion}</strong>
                </span>
              ) : (
                "Rapports financiers et analytiques"
              )}
            </p>
          </div>
          <Button
            onClick={exportCSV}
            className="bg-[#E05D26] hover:bg-[#C2410C] text-white"
            disabled={!report?.transactions?.length}
            data-testid="export-csv-btn"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg bg-white mb-6">
          <CardContent className="p-6">
            <div className="flex items-end gap-4 flex-wrap">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-48"
                />
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-48"
                />
              </div>
              
              {/* Region filter for admin/super_admin */}
              {canViewAllRegions && (
                <div className="space-y-2">
                  <Label>Région</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-48">
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
              
              <Button onClick={fetchReport} variant="outline">
                Filtrer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Region Badge */}
        {report?.region && (
          <div className="mb-6">
            <Badge variant="outline" className="text-lg px-4 py-2 bg-white">
              <MapPin className="w-4 h-4 mr-2" />
              Rapport pour: {report.region}
            </Badge>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-[#E05D26] border-t-transparent rounded-full" />
          </div>
        ) : report && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Total Recettes</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {formatCurrency(report.total_amount)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Transactions</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {report.total_transactions}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <PieChart className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Ticket Moyen</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {formatCurrency(report.total_amount / Math.max(report.total_transactions, 1))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* By Payment Method */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">Répartition par Mode de Paiement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(report.by_payment_method || {}).map(([method, data]) => (
                      <div key={method} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                          <p className="font-medium">{methodLabels[method] || method}</p>
                          <p className="text-sm text-slate-500">{data.count} transactions</p>
                        </div>
                        <p className="font-bold text-[#E05D26]">{formatCurrency(data.total)}</p>
                      </div>
                    ))}
                    {Object.keys(report.by_payment_method || {}).length === 0 && (
                      <p className="text-center text-slate-500 py-4">Aucune donnée</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">Dernières Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {report.transactions?.slice(0, 10).map((txn) => (
                      <div key={txn.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-mono text-sm">{txn.transaction_ref}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(txn.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <p className="font-medium">{formatCurrency(txn.amount)}</p>
                      </div>
                    ))}
                    {(!report.transactions || report.transactions.length === 0) && (
                      <p className="text-center text-slate-500 py-4">Aucune transaction</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Full Transactions Table */}
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#E05D26]" />
                  Détail des Transactions
                  {report?.region && <Badge variant="outline" className="ml-2">{report.region}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {report.transactions?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Référence</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Mode Paiement</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.transactions?.map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell>
                            {new Date(txn.created_at).toLocaleDateString('fr-FR')}
                          </TableCell>
                          <TableCell className="font-mono">{txn.transaction_ref}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(txn.amount)}</TableCell>
                          <TableCell>{methodLabels[txn.payment_method] || txn.payment_method}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              txn.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {txn.status === 'completed' ? 'Complété' : txn.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    Aucune transaction pour cette période
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
