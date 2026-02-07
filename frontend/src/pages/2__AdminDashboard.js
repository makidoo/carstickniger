import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Assurez-vous d'avoir configuré l'URL de l'API dans votre .env
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_vehicles: 0,
    active_stickers: 0,
    total_revenue: 0,
    daily_revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // --- CORRECTION MAJEURE ICI ---
  // 1. On définit la fonction AVANT de l'utiliser dans le useEffect
  // 2. On utilise useCallback pour éviter les boucles infinies
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Si pas de token, on redirige vers le login
      if (!token) {
        navigate('/login'); // Assurez-vous que cette route existe, sinon '/admin/login'
        return;
      }

      const response = await axios.get(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur chargement dashboard:", err);
      setError("Impossible de charger les statistiques. Vérifiez vos droits d'accès.");
      setLoading(false);
      
      // Si erreur 401 (Non autorisé), on déconnecte
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]); // Dépendance de useCallback

  // --- ENSUITE on l'appelle dans le useEffect ---
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Formatage de la monnaie (FCFA)
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
  };

  if (loading) return <div className="p-8 text-center">Chargement du tableau de bord...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de Bord Administratif</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Carte : Véhicules Total */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase font-semibold">Total Véhicules</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total_vehicles}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              🚗
            </div>
          </div>
        </div>

        {/* Carte : Vignettes Actives */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase font-semibold">Vignettes Actives</p>
              <p className="text-2xl font-bold text-gray-800">{stats.active_stickers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              ✅
            </div>
          </div>
        </div>

        {/* Carte : Revenus Journaliers */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase font-semibold">Revenus du Jour</p>
              <p className="text-2xl font-bold text-gray-800">{formatMoney(stats.daily_revenue)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
              📅
            </div>
          </div>
        </div>

        {/* Carte : Revenus Totaux */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase font-semibold">Revenus Totaux</p>
              <p className="text-2xl font-bold text-gray-800">{formatMoney(stats.total_revenue)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              💰
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Actions Rapides</h2>
            <button 
                onClick={fetchStats} 
                className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
                Actualiser les données
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
                onClick={() => navigate('/admin/users')}
                className="p-4 border border-gray-200 rounded hover:bg-gray-50 text-left"
            >
                <span className="block font-bold text-gray-700">Gérer les Agents</span>
                <span className="text-sm text-gray-500">Créer ou modifier des comptes agents</span>
            </button>
            <button 
                className="p-4 border border-gray-200 rounded hover:bg-gray-50 text-left"
                onClick={() => alert("Fonctionnalité à venir : Rapports détaillés")}
            >
                <span className="block font-bold text-gray-700">Rapports Financiers</span>
                <span className="text-sm text-gray-500">Exporter les données en CSV/PDF</span>
            </button>
            <button 
                className="p-4 border border-gray-200 rounded hover:bg-gray-50 text-left"
                 onClick={() => alert("Fonctionnalité à venir : Configuration des taxes")}
            >
                <span className="block font-bold text-gray-700">Configuration Taxes</span>
                <span className="text-sm text-gray-500">Modifier les prix des vignettes</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;