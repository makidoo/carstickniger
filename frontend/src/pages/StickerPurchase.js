import React, { useState, useEffect, useCallback } from 'react'; // <-- Import de useCallback ajouté
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Configuration URL API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const StickerPurchase = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [duration, setDuration] = useState(1); // 1 an par défaut
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // --- 1. Définition de la fonction avec useCallback (AVANT le useEffect) ---
  const fetchVehicles = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/vehicles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(response.data);
      
      // Pré-sélectionner le premier véhicule s'il y en a
      if (response.data.length > 0) {
        setSelectedVehicle(response.data[0].id);
      }
    } catch (err) {
      console.error("Erreur chargement véhicules:", err);
      setError("Impossible de charger vos véhicules.");
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate('/login');
      }
    }
  }, [navigate]);

  // --- 2. Appel dans le useEffect ---
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // --- Gestion de l'achat ---
  const handlePurchase = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        vehicle_id: selectedVehicle,
        validity_years: parseInt(duration),
        payment_method: paymentMethod
      };

      const response = await axios.post(`${API_URL}/stickers/purchase`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur achat:", err);
      setLoading(false);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Erreur lors de l'achat. Veuillez réessayer.");
      }
    }
  };

  // --- Affichage du succès (Vignette générée) ---
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center border-t-4 border-green-500">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Paiement Réussi !</h2>
          <p className="text-gray-600 mb-6">Votre vignette numérique est activée.</p>
          
          <div className="bg-gray-100 p-4 rounded mb-6">
            <p className="text-sm text-gray-500 mb-1">Véhicule</p>
            <p className="font-mono font-bold text-lg">{success.registration_number}</p>
            
            <p className="text-sm text-gray-500 mt-3 mb-1">Expiration</p>
            <p className="font-bold text-green-700">
              {new Date(success.end_date).toLocaleDateString()}
            </p>
          </div>

          <div className="mb-6 flex justify-center">
             {/* Affichage du QR Code s'il est renvoyé en base64 */}
             {success.qr_code && (
               <img 
                 src={`data:image/png;base64,${success.qr_code}`} 
                 alt="QR Code Vignette" 
                 className="w-48 h-48 border p-2 rounded"
               />
             )}
          </div>

          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  // --- Formulaire d'achat ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Acheter une Vignette</h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        {vehicles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Vous n'avez aucun véhicule enregistré.</p>
            <button 
              onClick={() => navigate('/vehicles')}
              className="text-blue-600 font-semibold hover:underline"
            >
              + Ajouter un véhicule d'abord
            </button>
          </div>
        ) : (
          <form onSubmit={handlePurchase} className="space-y-6">
            
            {/* Sélection du véhicule */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Choisir le véhicule</label>
              <select 
                value={selectedVehicle} 
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.make} {v.model} - {v.registration_number}
                  </option>
                ))}
              </select>
            </div>

            {/* Durée */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Durée de validité</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDuration(1)}
                  className={`p-3 rounded border text-center font-semibold ${duration === 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  1 An
                </button>
                <button
                  type="button"
                  onClick={() => setDuration(2)}
                  className={`p-3 rounded border text-center font-semibold ${duration === 2 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  2 Ans (-5%)
                </button>
              </div>
            </div>

            {/* Méthode de paiement */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Moyen de Paiement</label>
              <select 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="mobile_money">Mobile Money (Airtel/Moov/Zamani)</option>
                <option value="card">Carte Bancaire (Visa/Mastercard)</option>
              </select>
            </div>

            {/* Résumé Prix (Simulation) */}
            <div className="bg-gray-100 p-4 rounded text-right">
              <span className="text-gray-600">Total à payer :</span>
              <p className="text-2xl font-bold text-blue-900">
                {(25000 * duration).toLocaleString()} FCFA
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-lg text-white font-bold text-lg transition duration-200 
                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg'}`}
            >
              {loading ? 'Traitement en cours...' : 'CONFIRMER LE PAIEMENT'}
            </button>
            
            <button 
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full text-gray-500 text-sm hover:text-gray-700 mt-2"
            >
              Annuler
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StickerPurchase;