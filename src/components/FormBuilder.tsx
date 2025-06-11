import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Printer, 
  Save, 
  Clock,
  Building2,
  FlaskRound,
  Factory,
  Guitar as Hospital,
  Droplet,
  Thermometer,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import AnimatedCard from './ui/AnimatedCard';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FormData } from '../types';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'number' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
  value: any;
}

const FormBuilder: React.FC = () => {
  const { user } = useAuth();
  const [drafts, setDrafts] = useLocalStorage<FormData[]>('metrotech_drafts', []);
  const [completedForms, setCompletedForms] = useLocalStorage<FormData[]>('metrotech_completed', []);
  const [selectedService, setSelectedService] = useState<string>('');
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formTitle, setFormTitle] = useState('');
  const [clientInfo, setClientInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    contact: ''
  });

  const services = [
    {
      id: 'btp',
      title: 'Services BTP',
      icon: Building2,
      fields: [
        { id: 'instrument', label: 'Instrument de mesure', type: 'text', required: true },
        { id: 'marque', label: 'Marque', type: 'text', required: true },
        { id: 'modele', label: 'Modèle', type: 'text', required: true },
        { id: 'numeroSerie', label: 'Numéro de série', type: 'text', required: true },
        { id: 'etendueMesure', label: 'Étendue de mesure', type: 'text', required: true },
        { id: 'resolution', label: 'Résolution', type: 'text', required: false },
        { id: 'typeEtalonnage', label: 'Type d\'étalonnage', type: 'select', required: true, options: ['Étalonnage complet', 'Vérification', 'Ajustement', 'Réparation'] },
        { id: 'normeReference', label: 'Norme de référence', type: 'text', required: false },
        { id: 'conditionsEnvironnement', label: 'Conditions environnementales', type: 'textarea', required: false },
        { id: 'observations', label: 'Observations', type: 'textarea', required: false },
        { id: 'resultatConformite', label: 'Résultat de conformité', type: 'select', required: true, options: ['Conforme', 'Non conforme', 'Conforme après ajustement'] },
        { id: 'recommandations', label: 'Recommandations', type: 'textarea', required: false }
      ]
    },
    {
      id: 'laboratoire',
      title: 'Services Laboratoire',
      icon: FlaskRound,
      fields: [
        { id: 'equipement', label: 'Équipement de laboratoire', type: 'text', required: true },
        { id: 'marque', label: 'Marque', type: 'text', required: true },
        { id: 'modele', label: 'Modèle', type: 'text', required: true },
        { id: 'numeroSerie', label: 'Numéro de série', type: 'text', required: true },
        { id: 'parametreMesure', label: 'Paramètre de mesure', type: 'text', required: true },
        { id: 'etendueMesure', label: 'Étendue de mesure', type: 'text', required: true },
        { id: 'incertitudeMesure', label: 'Incertitude de mesure', type: 'text', required: false },
        { id: 'methodeEtalonnage', label: 'Méthode d\'étalonnage', type: 'select', required: true, options: ['Comparaison directe', 'Substitution', 'Méthode différentielle', 'Autre'] },
        { id: 'etalonsUtilises', label: 'Étalons utilisés', type: 'textarea', required: true },
        { id: 'conditionsLaboratoire', label: 'Conditions de laboratoire', type: 'textarea', required: false },
        { id: 'resultatsEtalonnage', label: 'Résultats d\'étalonnage', type: 'textarea', required: true },
        { id: 'certificatValidite', label: 'Validité du certificat', type: 'date', required: true },
        { id: 'conformiteNorme', label: 'Conformité aux normes', type: 'checkbox', required: false }
      ]
    },
    {
      id: 'industrie',
      title: 'Services Industrie',
      icon: Factory,
      fields: [
        { id: 'equipementIndustriel', label: 'Équipement industriel', type: 'text', required: true },
        { id: 'marque', label: 'Marque', type: 'text', required: true },
        { id: 'modele', label: 'Modèle', type: 'text', required: true },
        { id: 'numeroSerie', label: 'Numéro de série', type: 'text', required: true },
        { id: 'ligneProduction', label: 'Ligne de production', type: 'text', required: false },
        { id: 'parametreControle', label: 'Paramètre de contrôle', type: 'text', required: true },
        { id: 'toleranceAcceptable', label: 'Tolérance acceptable', type: 'text', required: true },
        { id: 'frequenceEtalonnage', label: 'Fréquence d\'étalonnage', type: 'select', required: true, options: ['Mensuelle', 'Trimestrielle', 'Semestrielle', 'Annuelle', 'Autre'] },
        { id: 'procedureTest', label: 'Procédure de test', type: 'textarea', required: true },
        { id: 'resultatsControle', label: 'Résultats de contrôle', type: 'textarea', required: true },
        { id: 'actionsCorrectives', label: 'Actions correctives', type: 'textarea', required: false },
        { id: 'validationProduction', label: 'Validation pour production', type: 'checkbox', required: false }
      ]
    },
    {
      id: 'hopital',
      title: 'Services Hôpital',
      icon: Hospital,
      fields: [
        { id: 'equipementMedical', label: 'Équipement médical', type: 'text', required: true },
        { id: 'marque', label: 'Marque', type: 'text', required: true },
        { id: 'modele', label: 'Modèle', type: 'text', required: true },
        { id: 'numeroSerie', label: 'Numéro de série', type: 'text', required: true },
        { id: 'serviceMedical', label: 'Service médical', type: 'text', required: true },
        { id: 'typeVerification', label: 'Type de vérification', type: 'select', required: true, options: ['Étalonnage métrologique', 'Contrôle de sécurité', 'Test de performance', 'Maintenance préventive'] },
        { id: 'normeMedicale', label: 'Norme médicale applicable', type: 'text', required: true },
        { id: 'parametresCritiques', label: 'Paramètres critiques', type: 'textarea', required: true },
        { id: 'resultatsVerification', label: 'Résultats de vérification', type: 'textarea', required: true },
        { id: 'conformiteReglementaire', label: 'Conformité réglementaire', type: 'select', required: true, options: ['Conforme', 'Non conforme', 'Conforme avec réserves'] },
        { id: 'recommandationsSecurite', label: 'Recommandations de sécurité', type: 'textarea', required: false },
        { id: 'prochainControle', label: 'Prochain contrôle', type: 'date', required: true }
      ]
    },
    {
      id: 'eau',
      title: 'Analyse Eau',
      icon: Droplet,
      fields: [
        { id: 'typeAnalyse', label: 'Type d\'analyse', type: 'select', required: true, options: ['Analyse physico-chimique', 'Analyse microbiologique', 'Analyse complète', 'Contrôle qualité'] },
        { id: 'sourceEau', label: 'Source de l\'eau', type: 'text', required: true },
        { id: 'pointPrelevement', label: 'Point de prélèvement', type: 'text', required: true },
        { id: 'datePrelevement', label: 'Date de prélèvement', type: 'date', required: true },
        { id: 'conditionsPrelevement', label: 'Conditions de prélèvement', type: 'textarea', required: false },
        { id: 'parametresAnalyses', label: 'Paramètres analysés', type: 'textarea', required: true },
        { id: 'methodesAnalyse', label: 'Méthodes d\'analyse', type: 'textarea', required: true },
        { id: 'resultatsAnalyse', label: 'Résultats d\'analyse', type: 'textarea', required: true },
        { id: 'valeursReference', label: 'Valeurs de référence', type: 'textarea', required: false },
        { id: 'conformiteNormes', label: 'Conformité aux normes', type: 'select', required: true, options: ['Conforme', 'Non conforme', 'Partiellement conforme'] },
        { id: 'observations', label: 'Observations', type: 'textarea', required: false },
        { id: 'recommandations', label: 'Recommandations', type: 'textarea', required: false }
      ]
    },
    {
      id: 'temperature',
      title: 'Surveillance T°/H',
      icon: Thermometer,
      fields: [
        { id: 'typeSysteme', label: 'Type de système', type: 'select', required: true, options: ['Surveillance continue', 'Enregistrement périodique', 'Alarmes', 'Système complet'] },
        { id: 'zonesSurveillance', label: 'Zones de surveillance', type: 'textarea', required: true },
        { id: 'nombreCapteurs', label: 'Nombre de capteurs', type: 'number', required: true },
        { id: 'typeCapteurs', label: 'Type de capteurs', type: 'text', required: true },
        { id: 'etendueMesureTemp', label: 'Étendue de mesure température', type: 'text', required: true },
        { id: 'etendueMesureHum', label: 'Étendue de mesure humidité', type: 'text', required: true },
        { id: 'precisionRequise', label: 'Précision requise', type: 'text', required: true },
        { id: 'frequenceEnregistrement', label: 'Fréquence d\'enregistrement', type: 'select', required: true, options: ['Continue', '1 minute', '5 minutes', '15 minutes', '30 minutes', '1 heure'] },
        { id: 'seuilsAlarme', label: 'Seuils d\'alarme', type: 'textarea', required: true },
        { id: 'configurationSysteme', label: 'Configuration du système', type: 'textarea', required: true },
        { id: 'testsFonctionnement', label: 'Tests de fonctionnement', type: 'textarea', required: true },
        { id: 'validationInstallation', label: 'Validation de l\'installation', type: 'checkbox', required: false }
      ]
    }
  ];

  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(serviceId);
      setFormTitle(`Formulaire ${service.title}`);
      setFormFields(service.fields.map(field => ({ ...field, value: '' })));
    }
  };

  const updateFieldValue = (fieldId: string, value: any) => {
    setFormFields(fields => 
      fields.map(field => 
        field.id === fieldId ? { ...field, value } : field
      )
    );
  };

  const saveDraft = () => {
    if (!user || !selectedService) return;

    const formData: FormData = {
      id: `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: formTitle,
      service: services.find(s => s.id === selectedService)?.title || selectedService,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.id,
      data: {
        client: clientInfo,
        fields: formFields,
        serviceType: selectedService,
        progress: calculateProgress()
      }
    };

    setDrafts(prev => [...prev, formData]);
    alert('Brouillon sauvegardé avec succès !');
  };

  const completeForm = () => {
    if (!user || !selectedService) return;

    // Vérifier que tous les champs requis sont remplis
    const requiredFields = formFields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !field.value);

    if (missingFields.length > 0) {
      alert(`Veuillez remplir tous les champs requis : ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    const formData: FormData = {
      id: `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: formTitle,
      service: services.find(s => s.id === selectedService)?.title || selectedService,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.id,
      data: {
        client: clientInfo,
        fields: formFields,
        serviceType: selectedService,
        progress: 100
      }
    };

    setCompletedForms(prev => [...prev, formData]);
    alert('Formulaire terminé et sauvegardé !');
    resetForm();
  };

  const calculateProgress = () => {
    const totalFields = formFields.length + Object.keys(clientInfo).length;
    const filledFields = formFields.filter(field => field.value).length + 
                        Object.values(clientInfo).filter(value => value).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  const resetForm = () => {
    setSelectedService('');
    setFormFields([]);
    setFormTitle('');
    setClientInfo({
      name: '',
      address: '',
      phone: '',
      email: '',
      contact: ''
    });
  };

  const generatePDF = () => {
    if (!selectedService || formFields.length === 0) return;

    const service = services.find(s => s.id === selectedService);
    const currentDate = new Date().toLocaleDateString('fr-FR');
    
    // Créer le contenu HTML pour le PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${formTitle}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.6;
            color: #333;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #F57C00; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          .logo { 
            max-width: 200px; 
            margin-bottom: 10px;
          }
          .company-info {
            color: #666;
            font-size: 14px;
          }
          .form-title { 
            color: #F57C00; 
            font-size: 24px; 
            font-weight: bold;
            margin: 20px 0;
          }
          .section { 
            margin-bottom: 30px; 
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .section-title { 
            color: #1976D2; 
            font-size: 18px; 
            font-weight: bold; 
            margin-bottom: 15px;
            border-bottom: 1px solid #1976D2;
            padding-bottom: 5px;
          }
          .field { 
            margin-bottom: 15px; 
            display: flex;
            align-items: flex-start;
          }
          .field-label { 
            font-weight: bold; 
            min-width: 200px;
            color: #555;
          }
          .field-value { 
            flex: 1;
            padding-left: 10px;
            word-wrap: break-word;
          }
          .footer { 
            margin-top: 50px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          .signature-section {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
          }
          .signature-box {
            width: 200px;
            text-align: center;
            border-top: 1px solid #333;
            padding-top: 10px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://image.noelshack.com/fichiers/2024/44/3/1730323042-logom1.png" alt="METROTECH Logo" class="logo">
          <div class="company-info">
            <strong>METROTECH INSTRUMENT SARL</strong><br>
            Expert en Métrologie<br>
            Koumassi SOPIM, Abidjan - Côte d'Ivoire<br>
            Tél: +225 05 46 86 85 71 | Email: mikoustane0@gmail.com
          </div>
        </div>

        <div class="form-title">${formTitle}</div>
        <div style="text-align: right; margin-bottom: 20px; color: #666;">
          Date: ${currentDate}<br>
          Référence: ${`MTI-${Date.now().toString().slice(-6)}`}
        </div>

        <div class="section">
          <div class="section-title">Informations Client</div>
          <div class="field">
            <div class="field-label">Nom du client:</div>
            <div class="field-value">${clientInfo.name || 'Non renseigné'}</div>
          </div>
          <div class="field">
            <div class="field-label">Adresse:</div>
            <div class="field-value">${clientInfo.address || 'Non renseigné'}</div>
          </div>
          <div class="field">
            <div class="field-label">Téléphone:</div>
            <div class="field-value">${clientInfo.phone || 'Non renseigné'}</div>
          </div>
          <div class="field">
            <div class="field-label">Email:</div>
            <div class="field-value">${clientInfo.email || 'Non renseigné'}</div>
          </div>
          <div class="field">
            <div class="field-label">Personne de contact:</div>
            <div class="field-value">${clientInfo.contact || 'Non renseigné'}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Détails du Service</div>
          ${formFields.map(field => `
            <div class="field">
              <div class="field-label">${field.label}${field.required ? ' *' : ''}:</div>
              <div class="field-value">${field.value || 'Non renseigné'}</div>
            </div>
          `).join('')}
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div>Technicien METROTECH</div>
            <div style="margin-top: 30px;">${user?.name}</div>
          </div>
          <div class="signature-box">
            <div>Client</div>
            <div style="margin-top: 30px;">Signature</div>
          </div>
        </div>

        <div class="footer">
          <strong>METROTECH INSTRUMENT SARL</strong> - Votre partenaire de confiance en métrologie<br>
          Ce document a été généré automatiquement le ${currentDate}
        </div>
      </body>
      </html>
    `;

    // Créer et télécharger le PDF
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formTitle.replace(/\s+/g, '_')}_${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Ouvrir dans une nouvelle fenêtre pour impression
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  };

  const printForm = () => {
    generatePDF();
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.id,
      value: field.value,
      onChange: (e: any) => updateFieldValue(field.id, e.target.value),
      className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500",
      required: field.required
    };

    switch (field.type) {
      case 'textarea':
        return <textarea {...commonProps} rows={3} />;
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Sélectionner...</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            id={field.id}
            checked={field.value || false}
            onChange={(e) => updateFieldValue(field.id, e.target.checked)}
            className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
          />
        );
      case 'number':
        return <input type="number" {...commonProps} />;
      case 'date':
        return <input type="date" {...commonProps} />;
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Créateur de Formulaires</h1>
        {selectedService && (
          <div className="flex gap-2">
            <button
              onClick={saveDraft}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Save size={18} />
              Sauvegarder
            </button>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download size={18} />
              Télécharger PDF
            </button>
            <button
              onClick={printForm}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Printer size={18} />
              Imprimer
            </button>
          </div>
        )}
      </div>

      {/* Sélection du service */}
      {!selectedService && (
        <AnimatedCard className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">Choisir un type de service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className="flex items-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
                >
                  <Icon size={24} className="text-primary-400" />
                  <span className="text-white font-medium">{service.title}</span>
                </button>
              );
            })}
          </div>
        </AnimatedCard>
      )}

      {/* Formulaire */}
      {selectedService && (
        <div className="space-y-6">
          {/* Informations client */}
          <AnimatedCard className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <User size={20} className="text-primary-400" />
              Informations Client
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom du client *
                </label>
                <input
                  type="text"
                  value={clientInfo.name}
                  onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Personne de contact
                </label>
                <input
                  type="text"
                  value={clientInfo.contact}
                  onChange={(e) => setClientInfo({...clientInfo, contact: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Adresse
                </label>
                <input
                  type="text"
                  value={clientInfo.address}
                  onChange={(e) => setClientInfo({...clientInfo, address: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail size={16} className="inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </AnimatedCard>

          {/* Champs du formulaire */}
          <AnimatedCard className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FileText size={20} className="text-primary-400" />
                {formTitle}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock size={16} />
                Progression: {calculateProgress()}%
              </div>
            </div>
            
            <div className="space-y-4">
              {formFields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={completeForm}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
              >
                <FileText size={18} />
                Terminer le formulaire
              </button>
              <button
                onClick={saveDraft}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save size={18} />
                Sauvegarder en brouillon
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Nouveau formulaire
              </button>
            </div>
          </AnimatedCard>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;