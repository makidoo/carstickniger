import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  fr: {
    // Common
    app_name: "Vignette Numérique Niger",
    login: "Connexion",
    register: "S'inscrire",
    logout: "Déconnexion",
    dashboard: "Tableau de Bord",
    profile: "Profil",
    settings: "Paramètres",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    add: "Ajouter",
    search: "Rechercher",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    confirm: "Confirmer",
    back: "Retour",
    next: "Suivant",
    submit: "Soumettre",
    download: "Télécharger",
    print: "Imprimer",
    view: "Voir",
    
    // Auth
    phone: "Numéro de téléphone",
    password: "Mot de passe",
    confirm_password: "Confirmer le mot de passe",
    first_name: "Prénom",
    last_name: "Nom",
    email: "Email",
    national_id: "Numéro NIN",
    forgot_password: "Mot de passe oublié?",
    no_account: "Pas de compte?",
    have_account: "Déjà un compte?",
    
    // Landing
    hero_title: "Système de Vignette Véhicule Numérique",
    hero_subtitle: "Simplifiez vos démarches fiscales avec la vignette numérique du Niger",
    get_started: "Commencer",
    learn_more: "En savoir plus",
    feature_1_title: "100% Numérique",
    feature_1_desc: "Plus besoin de vignette physique. Tout se fait en ligne.",
    feature_2_title: "Paiement Sécurisé",
    feature_2_desc: "Payez par Mobile Money, carte bancaire ou virement.",
    feature_3_title: "Vérification Instantanée",
    feature_3_desc: "Les forces de l'ordre peuvent vérifier votre vignette en temps réel.",
    
    // Vehicles
    vehicles: "Véhicules",
    my_vehicles: "Mes Véhicules",
    add_vehicle: "Ajouter un Véhicule",
    registration_number: "Numéro d'Immatriculation",
    vehicle_type: "Type de Véhicule",
    make: "Marque",
    model: "Modèle",
    energy_type: "Type d'Énergie",
    engine_power: "Puissance (CV)",
    chassis_number: "Numéro de Châssis",
    year_of_manufacture: "Année de Fabrication",
    car: "Voiture",
    motorcycle: "Moto",
    truck: "Camion",
    bus: "Bus",
    other: "Autre",
    gasoline: "Essence",
    diesel: "Diesel",
    electric: "Électrique",
    
    // Stickers
    stickers: "Vignettes",
    buy_sticker: "Acheter une Vignette",
    renew_sticker: "Renouveler",
    sticker_status: "Statut de la Vignette",
    valid: "Valide",
    invalid: "Expiré",
    inactive: "Inactif",
    validity_period: "Période de Validité",
    one_year: "1 An",
    two_years: "2 Ans",
    three_years: "3 Ans",
    amount_to_pay: "Montant à Payer",
    start_date: "Date de Début",
    end_date: "Date d'Expiration",
    qr_code: "Code QR",
    download_qr: "Télécharger le QR",
    
    // Payment
    payment: "Paiement",
    payment_method: "Mode de Paiement",
    mobile_money: "Mobile Money",
    bank_transfer: "Virement Bancaire",
    card: "Carte Bancaire",
    payment_history: "Historique des Paiements",
    transaction_id: "N° Transaction",
    amount: "Montant",
    date: "Date",
    status: "Statut",
    receipt: "Reçu",
    
    // Loyalty
    loyalty_points: "Points de Fidélité",
    points_earned: "Points Gagnés",
    
    // Admin
    admin_dashboard: "Administration",
    total_vehicles: "Total Véhicules",
    active_stickers: "Vignettes Actives",
    invalid_stickers: "Vignettes Expirées",
    inactive_stickers: "Vignettes Inactives",
    total_revenue: "Recettes Totales",
    daily_revenue: "Recettes du Jour",
    monthly_revenue: "Recettes du Mois",
    recovery_rate: "Taux de Recouvrement",
    tax_configuration: "Configuration des Taxes",
    user_management: "Gestion des Utilisateurs",
    reports: "Rapports",
    audit_logs: "Journal d'Audit",
    
    // Verification
    verify: "Vérifier",
    scan_qr: "Scanner le QR",
    manual_verify: "Vérification Manuelle",
    enter_plate: "Entrer le numéro de plaque",
    verification_result: "Résultat de la Vérification",
    owner: "Propriétaire",
    valid_until: "Valide Jusqu'au",
    
    // Messages
    welcome: "Bienvenue",
    login_success: "Connexion réussie",
    register_success: "Inscription réussie",
    vehicle_added: "Véhicule ajouté avec succès",
    vehicle_deleted: "Véhicule supprimé",
    sticker_purchased: "Vignette achetée avec succès",
    payment_success: "Paiement effectué avec succès",
    
    // Wizard Steps
    step_1: "Sélection du Véhicule",
    step_2: "Détails et Durée",
    step_3: "Paiement",
    select_vehicle: "Sélectionnez votre véhicule",
    select_duration: "Choisissez la durée",
    complete_payment: "Finalisez le paiement",
    
    // Footer
    copyright: "© 2024 Direction Générale des Impôts - Niger",
    terms: "Conditions d'utilisation",
    privacy: "Politique de confidentialité",
    contact: "Contact",
  },
  en: {
    // Common
    app_name: "Niger Digital Vehicle Sticker",
    login: "Login",
    register: "Register",
    logout: "Logout",
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    submit: "Submit",
    download: "Download",
    print: "Print",
    view: "View",
    
    // Auth
    phone: "Phone Number",
    password: "Password",
    confirm_password: "Confirm Password",
    first_name: "First Name",
    last_name: "Last Name",
    email: "Email",
    national_id: "National ID Number",
    forgot_password: "Forgot password?",
    no_account: "Don't have an account?",
    have_account: "Already have an account?",
    
    // Landing
    hero_title: "Digital Vehicle Sticker System",
    hero_subtitle: "Simplify your tax procedures with Niger's digital vehicle sticker",
    get_started: "Get Started",
    learn_more: "Learn More",
    feature_1_title: "100% Digital",
    feature_1_desc: "No more physical stickers. Everything is done online.",
    feature_2_title: "Secure Payment",
    feature_2_desc: "Pay via Mobile Money, bank card or transfer.",
    feature_3_title: "Instant Verification",
    feature_3_desc: "Law enforcement can verify your sticker in real-time.",
    
    // Vehicles
    vehicles: "Vehicles",
    my_vehicles: "My Vehicles",
    add_vehicle: "Add Vehicle",
    registration_number: "Registration Number",
    vehicle_type: "Vehicle Type",
    make: "Make",
    model: "Model",
    energy_type: "Energy Type",
    engine_power: "Engine Power (HP)",
    chassis_number: "Chassis Number",
    year_of_manufacture: "Year of Manufacture",
    car: "Car",
    motorcycle: "Motorcycle",
    truck: "Truck",
    bus: "Bus",
    other: "Other",
    gasoline: "Gasoline",
    diesel: "Diesel",
    electric: "Electric",
    
    // Stickers
    stickers: "Stickers",
    buy_sticker: "Buy Sticker",
    renew_sticker: "Renew",
    sticker_status: "Sticker Status",
    valid: "Valid",
    invalid: "Expired",
    inactive: "Inactive",
    validity_period: "Validity Period",
    one_year: "1 Year",
    two_years: "2 Years",
    three_years: "3 Years",
    amount_to_pay: "Amount to Pay",
    start_date: "Start Date",
    end_date: "Expiry Date",
    qr_code: "QR Code",
    download_qr: "Download QR",
    
    // Payment
    payment: "Payment",
    payment_method: "Payment Method",
    mobile_money: "Mobile Money",
    bank_transfer: "Bank Transfer",
    card: "Bank Card",
    payment_history: "Payment History",
    transaction_id: "Transaction ID",
    amount: "Amount",
    date: "Date",
    status: "Status",
    receipt: "Receipt",
    
    // Loyalty
    loyalty_points: "Loyalty Points",
    points_earned: "Points Earned",
    
    // Admin
    admin_dashboard: "Administration",
    total_vehicles: "Total Vehicles",
    active_stickers: "Active Stickers",
    invalid_stickers: "Expired Stickers",
    inactive_stickers: "Inactive Stickers",
    total_revenue: "Total Revenue",
    daily_revenue: "Daily Revenue",
    monthly_revenue: "Monthly Revenue",
    recovery_rate: "Recovery Rate",
    tax_configuration: "Tax Configuration",
    user_management: "User Management",
    reports: "Reports",
    audit_logs: "Audit Logs",
    
    // Verification
    verify: "Verify",
    scan_qr: "Scan QR",
    manual_verify: "Manual Verification",
    enter_plate: "Enter plate number",
    verification_result: "Verification Result",
    owner: "Owner",
    valid_until: "Valid Until",
    
    // Messages
    welcome: "Welcome",
    login_success: "Login successful",
    register_success: "Registration successful",
    vehicle_added: "Vehicle added successfully",
    vehicle_deleted: "Vehicle deleted",
    sticker_purchased: "Sticker purchased successfully",
    payment_success: "Payment completed successfully",
    
    // Wizard Steps
    step_1: "Vehicle Selection",
    step_2: "Details & Duration",
    step_3: "Payment",
    select_vehicle: "Select your vehicle",
    select_duration: "Choose duration",
    complete_payment: "Complete payment",
    
    // Footer
    copyright: "© 2024 Directorate General of Taxes - Niger",
    terms: "Terms of Use",
    privacy: "Privacy Policy",
    contact: "Contact",
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
