import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  CreditCard, 
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Receipt
} from 'lucide-react';
import { Button } from '../components/ui/button';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Payments() {
  const { t } = useLanguage();
  
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API}/payments`);
      setPayments(res.data);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-NE').format(amount) + ' FCFA';
  };

  const statusConfig = {
    completed: { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700', label: 'Complété' },
    pending: { icon: Clock, color: 'bg-amber-100 text-amber-700', label: 'En attente' },
    failed: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Échoué' }
  };

  const methodLabels = {
    mobile_money: 'Mobile Money',
    bank: 'Virement',
    card: 'Carte'
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
    <div className="min-h-screen bg-[#FDFBF7]" data-testid="payments-page">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">{t('payment_history')}</h1>
          <p className="text-slate-500 mt-1">
            Consultez l'historique de vos paiements
          </p>
        </div>

        {payments.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="py-16 text-center">
              <Receipt className="w-20 h-20 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-600 mb-2">
                Aucun paiement
              </h3>
              <p className="text-slate-500">
                Vous n'avez pas encore effectué de paiement
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment, index) => {
                  const config = statusConfig[payment.status] || statusConfig.pending;
                  const StatusIcon = config.icon;
                  
                  return (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <CreditCard className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-mono text-sm text-slate-500">
                            {payment.transaction_ref}
                          </p>
                          <p className="font-bold text-lg text-slate-800">
                            {formatCurrency(payment.amount)}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(payment.created_at)}
                            </span>
                            <span>•</span>
                            <span>{methodLabels[payment.payment_method] || payment.payment_method}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={config.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
