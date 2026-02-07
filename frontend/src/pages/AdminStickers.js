import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
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
  FileText, 
  Search,
  Eye,
  Download
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminStickers() {
  const { t } = useLanguage();
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStickers();
  }, []);

  const fetchStickers = async () => {
    try {
      const res = await axios.get(`${API}/admin/stickers?limit=100`);
      setStickers(res.data);
    } catch (err) {
      console.error('Failed to fetch stickers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStickers = stickers.filter(s => 
    s.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-NE').format(amount) + ' FCFA';
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar />
      
      <main className="ml-64 p-8" data-testid="admin-stickers-page">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{t('stickers')}</h1>
            <p className="text-slate-500 mt-1">
              Gestion des vignettes numériques
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#E05D26]" />
                Liste des Vignettes
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher par plaque ou transaction..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                  data-testid="admin-sticker-search"
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Transaction</TableHead>
                    <TableHead>Immatriculation</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Début</TableHead>
                    <TableHead>Fin</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Mode Paiement</TableHead>
                    <TableHead>Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStickers.map((sticker) => (
                    <TableRow key={sticker.id}>
                      <TableCell className="font-mono text-sm">
                        {sticker.transaction_id}
                      </TableCell>
                      <TableCell className="font-mono font-bold">
                        {sticker.registration_number}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[sticker.status]}>
                          {t(sticker.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(sticker.start_date)}</TableCell>
                      <TableCell>{formatDate(sticker.end_date)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(sticker.amount_paid)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {sticker.payment_method?.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        <span className="text-amber-600 font-medium">
                          +{sticker.loyalty_points}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {filteredStickers.length === 0 && !loading && (
              <div className="text-center py-12 text-slate-500">
                Aucune vignette trouvée
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
