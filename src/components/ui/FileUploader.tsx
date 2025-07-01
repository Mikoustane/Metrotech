import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, File, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { fileManager } from '../../utils/fileManager';

interface FileUploaderProps {
  onFileUpload: (fileData: string, fileName: string) => void;
  acceptedTypes?: 'images' | 'documents' | 'all';
  maxSize?: number;
  className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
  acceptedTypes = 'all',
  maxSize = 5,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptedFileTypes = () => {
    switch (acceptedTypes) {
      case 'images':
        return 'image/jpeg,image/png,image/gif,image/webp';
      case 'documents':
        return 'application/pdf,text/plain,application/msword';
      default:
        return 'image/*,application/pdf,text/plain,application/msword';
    }
  };

  const validateAndProcessFile = async (file: File) => {
    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      // Validation selon le type
      let validation;
      if (acceptedTypes === 'images') {
        validation = fileManager.validateImage(file);
      } else if (acceptedTypes === 'documents') {
        validation = fileManager.validateDocument(file);
      } else {
        // Validation générale
        if (file.size > maxSize * 1024 * 1024) {
          validation = { valid: false, error: `Fichier trop volumineux (max ${maxSize}MB)` };
        } else {
          validation = { valid: true };
        }
      }

      if (!validation.valid) {
        setErrorMessage(validation.error || 'Fichier invalide');
        setUploadStatus('error');
        return;
      }

      // Traitement du fichier
      let fileData: string;
      
      if (file.type.startsWith('image/')) {
        // Redimensionner les images
        fileData = await fileManager.resizeImage(file);
      } else {
        // Convertir en base64 pour les autres fichiers
        fileData = await fileManager.fileToBase64(file);
      }

      // Sauvegarder le fichier
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const saved = fileManager.saveFile(fileId, fileData, file.name, file.type);

      if (saved) {
        onFileUpload(fileData, file.name);
        setUploadStatus('success');
        setTimeout(() => setUploadStatus('idle'), 2000);
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }

    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erreur lors du traitement du fichier');
      setUploadStatus('error');
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={24} />;
      default:
        return acceptedTypes === 'images' ? <Image className="text-gray-400" size={24} /> : <File className="text-gray-400" size={24} />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Traitement en cours...';
      case 'success':
        return 'Fichier uploadé avec succès !';
      case 'error':
        return errorMessage;
      default:
        return `Glissez votre fichier ici ou cliquez pour sélectionner (max ${maxSize}MB)`;
    }
  };

  return (
    <div className={className}>
      <motion.div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}
          ${uploadStatus === 'error' ? 'border-red-500 bg-red-500/10' : ''}
          ${uploadStatus === 'success' ? 'border-green-500 bg-green-500/10' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptedFileTypes()}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          {getStatusIcon()}
          
          <div>
            <p className={`text-sm font-medium ${
              uploadStatus === 'error' ? 'text-red-400' : 
              uploadStatus === 'success' ? 'text-green-400' : 'text-gray-300'
            }`}>
              {getStatusText()}
            </p>
            
            {uploadStatus === 'idle' && (
              <p className="text-xs text-gray-500 mt-1">
                Types acceptés: {acceptedTypes === 'images' ? 'JPG, PNG, GIF, WebP' : 
                                acceptedTypes === 'documents' ? 'PDF, TXT, DOC' : 'Images et documents'}
              </p>
            )}
          </div>

          {uploadStatus === 'idle' && (
            <motion.div
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Upload size={16} />
              Sélectionner un fichier
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FileUploader;