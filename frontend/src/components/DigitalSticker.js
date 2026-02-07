import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, Calendar, Car } from 'lucide-react';

export const DigitalSticker = ({ sticker, vehicle, size = 'normal' }) => {
  const { t } = useLanguage();
  
  const statusColors = {
    valid: { bg: 'from-emerald-500 to-teal-600', text: 'text-white', badge: 'bg-emerald-400' },
    invalid: { bg: 'from-orange-500 to-amber-600', text: 'text-white', badge: 'bg-orange-400' },
    inactive: { bg: 'from-slate-500 to-slate-700', text: 'text-white', badge: 'bg-slate-400' }
  };
  
  const colors = statusColors[sticker?.status] || statusColors.inactive;
  const isSmall = size === 'small';
  
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const qrData = `NIGER-VIGNETTE|${vehicle?.registration_number || 'N/A'}|${sticker?.id || 'N/A'}|${sticker?.end_date || ''}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-2xl shadow-2xl ${isSmall ? 'w-64' : 'w-80'}`}
    >
      {/* Holographic overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br opacity-90 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.3) 100%)'
        }}
      />
      
      {/* Main gradient background */}
      <div className={`bg-gradient-to-br ${colors.bg} ${colors.text} ${isSmall ? 'p-4' : 'p-6'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className={isSmall ? 'w-5 h-5' : 'w-6 h-6'} />
            <span className={`font-bold ${isSmall ? 'text-sm' : 'text-base'}`}>
              RÉPUBLIQUE DU NIGER
            </span>
          </div>
          <div className={`${colors.badge} px-3 py-1 rounded-full text-xs font-bold uppercase`}>
            {t(sticker?.status || 'inactive')}
          </div>
        </div>
        
        {/* Title */}
        <div className={`text-center ${isSmall ? 'mb-3' : 'mb-4'}`}>
          <h3 className={`font-bold tracking-wider ${isSmall ? 'text-base' : 'text-lg'}`}>
            VIGNETTE NUMÉRIQUE
          </h3>
          <p className={`opacity-80 ${isSmall ? 'text-xs' : 'text-sm'}`}>
            Digital Vehicle Sticker
          </p>
        </div>
        
        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <div className="bg-white p-2 rounded-xl shadow-inner">
            <QRCodeSVG
              value={qrData}
              size={isSmall ? 80 : 120}
              level="H"
              includeMargin={false}
            />
          </div>
        </div>
        
        {/* Vehicle Info */}
        <div className={`bg-white/10 backdrop-blur-sm rounded-xl ${isSmall ? 'p-3' : 'p-4'} space-y-2`}>
          {/* Plate Number */}
          <div className="text-center">
            <p className={`font-mono font-bold tracking-widest ${isSmall ? 'text-xl' : 'text-2xl'}`}>
              {vehicle?.registration_number || 'XX-000-XX'}
            </p>
          </div>
          
          {/* Vehicle Details */}
          <div className="flex items-center justify-center gap-2 text-sm opacity-90">
            <Car className="w-4 h-4" />
            <span>{vehicle?.make} {vehicle?.model}</span>
          </div>
          
          {/* Dates */}
          <div className="flex justify-between text-xs opacity-80 pt-2 border-t border-white/20">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(sticker?.start_date)}</span>
            </div>
            <span>→</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(sticker?.end_date)}</span>
            </div>
          </div>
        </div>
        
        {/* Transaction ID */}
        <div className={`text-center mt-3 opacity-70 ${isSmall ? 'text-xs' : 'text-sm'}`}>
          <span className="font-mono">{sticker?.transaction_id || 'N/A'}</span>
        </div>
      </div>
      
      {/* Bottom stripe with Niger colors */}
      <div className="flex h-2">
        <div className="flex-1 bg-orange-500" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-green-600" />
      </div>
    </motion.div>
  );
};

export default DigitalSticker;
