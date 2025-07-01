import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  Building2, 
  FlaskRound, 
  Factory, 
  Guitar as Hospital, 
  Droplet, 
  Thermometer,
  Save,
  Download,
  Printer,
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Mail,
  Clock
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

interface ServiceTemplate {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  fields: Omit<FormField, 'value'>[];
}

const FormCreator: React.FC = () => {
  const { user } = useAuth();
  const [drafts, setDrafts] = useLocalStorage<FormData[]>('metrotech_drafts', []);
  const [completedForms, setCompletedForms] = useLocalStorage<FormData[]>('metrotech_completed', []);
  
  const [currentStep, setCurrentStep] = useState<'select' | 'create'>('select');
  const [selectedService, setSelectedService] = useState<ServiceTemplate | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [clientInfo, setClientInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    contact: ''
  });

  const serviceTemplates: ServiceTemplate[] = [
    {
      id: 'btp',
      title: 'Services BTP',
      icon: Building2,
      color: 'from-orange-500 to-orange-600',
      fields: [
        { id: 'instrument', label: 'Instrument de mesure', type: 'text', required: true },
        { id: 'marque', label: 'Marque', type: 'text', required: true },
        { id: 'modele', label: 'Modèle', type: 'text', required: true },
        { id: 'numeroSerie', label: 'Numéro de série', type: 'text', required: true },
        { id: 'etendueMesure', label: 'Étendue de mesure', type: 'text', required: true },
        { id: 'typeEtalonnage', label: 'Type d\'étalonnage', type: 'select', required: true, options: ['Étalonnage complet', 'Vérification', 'Ajustement', 'Réparation'] },
        { id: 'resultatConformite', label: 'Résultat de conformité', type: 'select', required: true, options: ['Conforme', 'Non conforme', 'Conforme après ajustement'] },
        { id: 'observations', label: 'Observations', type: 'textarea', required: false }
      ]
    },
    {
      id: 'laboratoire',
      title: 'Services Laboratoire',
      icon: FlaskRound,
      color: 'from-blue-500 to-blue-600',
      fields: [
        { id: 'equipement', label: 'Équipement de laboratoire', type: 'text', required: true },
        { id: 'marque', label: 'Marque', type: 'text', required: true },
        { id: 'modele', label: 'Modèle', type: 'text', required: true },
        { id: 'numeroSerie', label: 'Numéro de série', type: 'text', required: true },
        { id: 'parametreMesure', label: 'Paramètre de mesure', type: 'text', required: true },
        { id: 'methodeEtalonnage', label: 'Méthode d\'étalonnage', type: 'select', required: true, options: ['Comparaison directe', 'Substitution', 'Méthode différentielle', 'Autre'] },
        { id: 'resultatsEtalonnage', label: 'Résultats d\'étalonnage', type: 'textarea', required: true },
        { id: 'certificatValidite', label: 'Validité du certificat', type: 'date', required: true }
      ]
    },
    {
      id: 'industrie',
      title: 'Services Industrie',
      icon: Factory,
      color: 'from-green-500 to-green-600',
      fields: [
        { id: 'equipementIndustriel', label: 'Équipement industriel', type: 'text', required: true },
        { id: 'marque', label: 'Marque', type: 'text', required: true },
        { id: 'modele', label: 'Modèle', type: 'text', required: true },
        { id: 'numeroSerie', label: 'Numéro de série', type: 'text', required: true },
        { id: 'parametreControle', label: 'Paramètre de contrôle', type: 'text', required: true },
        { id: 'frequenceEtalonnage', label: 'Fréquence d\'étalonnage', type: 'select', required: true, options: ['Mensuelle', 'Trimestrielle', 'Semestrielle', 'Annuelle'] },
        { id: 'resultatsControle', label: 'Résultats de contrôle', type: 'textarea', required: true }
      ]
    },
    {
      id: 'hopital',
      title: 'Services Hôpital',
      icon: Hospital,
      color: 'from-red-500 to-red-600',
      fields: [
        { id: 'equipementMedical', label: 'Équipement médical', type: 'text', required: true },
        { id: 'marque', label: 'Marque', type: 'text', required: true },
        { id: 'modele', label: 'Modèle', type: 'text', required: true },
        { id: 'serviceMedical', label: 'Service médical', type: 'text', required: true },
        { id: 'typeVerification', label: 'Type de vérification', type: 'select', required: true, options: ['Étalonnage métrologique', 'Contrôle de sécurité', 'Test de performance', 'Maintenance préventive'] },
        { id: 'conformiteReglementaire', label: 'Conformité réglementaire', type: 'select', required: true, options: ['Conforme', 'Non conforme', 'Conforme avec réserves'] },
        { id: 'prochainControle', label: 'Prochain contrôle', type: 'date', required: true }
      ]
    },
    {
      id: 'eau',
      title: 'Analyse Eau',
      icon: Droplet,
      color: 'from-cyan-500 to-cyan-600',
      fields: [
        { id: 'typeAnalyse', label: 'Type d\'analyse', type: 'select', required: true, options: ['Analyse physico-chimique', 'Analyse microbiologique', 'Analyse complète'] },
        { id: 'sourceEau', label: 'Source de l\'eau', type: 'text', required: true },
        { id: 'pointPrelevement', label: 'Point de prélèvement', type: 'text', required: true },
        { id: 'datePrelevement', label: 'Date de prélèvement', type: 'date', required: true },
        { id: 'resultatsAnalyse', label: 'Résultats d\'analyse', type: 'textarea', required: true },
        { id: 'conformiteNormes', label: 'Conformité aux normes', type: 'select', required: true, options: ['Conforme', 'Non conforme', 'Partiellement conforme'] }
      ]
    },
    {
      id: 'temperature',
      title: 'Surveillance T°/H',
      icon: Thermometer,
      color: 'from-purple-500 to-purple-600',
      fields: [
        { id: 'typeSysteme', label: 'Type de système', type: 'select', required: true, options: ['Surveillance continue', 'Enregistrement périodique', 'Alarmes', 'Système complet'] },
        { id: 'zonesSurveillance', label: 'Zones de surveillance', type: 'textarea', required: true },
        { id: 'nombreCapteurs', label: 'Nombre de capteurs', type: 'number', required: true },
        { id: 'typeCapteurs', label: 'Type de capteurs', type: 'text', required: true },
        { id: 'frequenceEnregistrement', label: 'Fréquence d\'enregistrement', type: 'select', required: true, options: ['Continue', '1 minute', '5 minutes', '15 minutes', '30 minutes', '1 heure'] },
        { id: 'seuilsAlarme', label: 'Seuils d\'alarme', type: 'textarea', required: true }
      ]
    }
  ];

  const handleServiceSelect = (service: ServiceTemplate) => {
    setSelectedService(service);
    setFormFields(service.fields.map(field => ({ ...field, value: '' })));
    setCurrentStep('create');
  };

  const updateFieldValue = (fieldId: string, value: any) => {
    setFormFields(fields => 
      fields.map(field => 
        field.id === fieldId ? { ...field, value } : field
      )
    );
  };

  const calculateProgress = () => {
    const totalFields = formFields.length + Object.keys(clientInfo).filter(key => key !== 'contact').length;
    const filledFields = formFields.filter(field => field.value).length + 
                        Object.values(clientInfo).filter((value, index) => index < 4 && value).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  const saveDraft = () => {
    if (!user || !selectedService) return;

    const formData: FormData = {
      id: `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `${selectedService.title} - ${clientInfo.name || 'Client'}`,
      service: selectedService.title,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.id,
      data: {
        client: clientInfo,
        fields: formFields,
        serviceType: selectedService.id,
        progress: calculateProgress()
      }
    };

    setDrafts(prev => [...prev, formData]);
    alert('Brouillon sauvegardé avec succès !');
    resetForm();
  };

  const completeForm = () => {
    if (!user || !selectedService) return;

    // Vérifier les champs requis
    const requiredFields = formFields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !field.value);

    if (!clientInfo.name) {
      alert('Veuillez renseigner le nom du client');
      return;
    }

    if (missingFields.length > 0) {
      alert(`Veuillez remplir tous les champs requis : ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    const formData: FormData = {
      id: `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `${selectedService.title} - ${clientInfo.name}`,
      service: selectedService.title,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.id,
      data: {
        client: clientInfo,
        fields: formFields,
        serviceType: selectedService.id,
        progress: 100
      }
    };

    setCompletedForms(prev => [...prev, formData]);
    alert('Formulaire terminé et sauvegardé !');
    resetForm();
  };

  const generatePDF = () => {
    if (!selectedService || !clientInfo.name) {
      alert('Veuillez remplir au moins le nom du client');
      return;
    }

    const currentDate = new Date().toLocaleDateString('fr-FR');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Formulaire ${selectedService.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #F57C00; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { max-width: 200px; margin-bottom: 10px; }
          .company-info { color: #666; font-size: 14px; }
          .form-title { color: #F57C00; font-size: 24px; font-weight: bold; margin: 20px 0; }
          .section { margin-bottom: 30px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
          .section-title { color: #1976D2; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #1976D2; padding-bottom: 5px; }
          .field { margin-bottom: 15px; display: flex; align-items: flex-start; }
          .field-label { font-weight: bold; min-width: 200px; color: #555; }
          .field-value { flex: 1; padding-left: 10px; word-wrap: break-word; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
          .signature-section { margin-top: 40px; display: flex; justify-content: space-between; }
          .signature-box { width: 200px; text-align: center; border-top: 1px solid #333; padding-top: 10px; }
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

        <div class="form-title">${selectedService.title}</div>
        <div style="text-align: right; margin-bottom: 20px; color: #666;">
          Date: ${currentDate}<br>
          Référence: MTI-${Date.now().toString().slice(-6)}
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

    // Télécharger le fichier HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedService.title}_${clientInfo.name}_${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Ouvrir pour impression
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  };

  const resetForm = () => {
    setCurrentStep('select');
    setSelectedService(null);
    setFormFields([]);
    setClientInfo({
      name: '',
      address: '',
      phone: '',
      email: '',
      contact: ''
    });
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

  if (currentStep === 'select') {
    return (
      <div className="p-4 lg:p-6 space-y-6 overflow-x-hidden safe-area-inset">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-light mb-2">
            Créer un Formulaire
          </h1>
          <p className="text-gray-400 text-base">
            Choisissez le type de service pour créer un nouveau formulaire
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceTemplates.map((service, index) => {
            const Icon = service.icon;
            return (
              <AnimatedCard
                key={service.id}
                delay={index * 0.1}
                className="card-mobile hover:shadow-lg transition-all cursor-pointer"
                onClick={() => handleServiceSelect(service)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${service.color}`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-light">{service.title}</h3>
                    <p className="text-gray-400 text-sm">{service.fields.length} champs</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-primary-400 text-sm font-medium">Créer un formulaire</span>
                  <Plus size={18} className="text-primary-400" />
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 overflow-x-hidden safe-area-inset">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={resetForm}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            Retour
          </button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-light">
              {selectedService?.title}
            </h1>
            <p className="text-gray-400 text-sm">
              Progression: {calculateProgress()}%
            </p>
          </div>
        </div>
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
            PDF
          </button>
        </div>
      </div>

      {/* Informations client */}
      <AnimatedCard className="card-mobile">
        <h2 className="text-xl font-semibold text-light mb-6 flex items-center gap-2">
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
      <AnimatedCard className="card-mobile">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-light flex items-center gap-2">
            <FileText size={20} className="text-primary-400" />
            Détails du Service
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock size={16} />
            {formFields.filter(f => f.value).length}/{formFields.length} champs remplis
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
            onClick={generatePDF}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Printer size={18} />
            Imprimer
          </button>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default FormCreator;