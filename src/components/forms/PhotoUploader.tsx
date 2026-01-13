/**
 * PHOTO UPLOADER COMPONENT - Upload drag & drop avec prévisualisation
 * 
 * Fonctionnalités :
 * - Drag & drop
 * - Sélection multiple (max 5 photos)
 * - Prévisualisation avant upload
 * - Suppression individuelle
 * - Upload vers API avec progress
 * - Validation format et taille
 */

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader, Camera, FolderOpen } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface PhotoUploaderProps {
  photos: string[];
  onChange: (urls: string[]) => void;
  maxPhotos?: number;
}

export function PhotoUploader({ photos = [], onChange, maxPhotos = 5 }: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(photos);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxPhotos - previews.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxPhotos} photos autorisées`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    // Validation
    for (const file of filesToUpload) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} n'est pas une image`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} dépasse 5MB`);
        return;
      }
    }

    setUploading(true);

    try {
      // Créer FormData
      const formData = new FormData();
      filesToUpload.forEach(file => {
        formData.append('photos', file);
      });

      // Upload vers API
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_URL}/offers/upload-photos`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        const newUrls = response.data.photos || [];
        const updatedPhotos = [...previews, ...newUrls];
        setPreviews(updatedPhotos);
        onChange(updatedPhotos);
        toast.success(`${newUrls.length} photo(s) uploadée(s)`);
      } else {
        throw new Error(response.data.error || 'Erreur upload');
      }
    } catch (error: unknown) {
      console.error('❌ Erreur upload:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erreur lors de l\'upload';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
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

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = previews.filter((_, i) => i !== index);
    setPreviews(updatedPhotos);
    onChange(updatedPhotos);
    toast.success('Photo supprimée');
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleClickCamera = (e: React.MouseEvent) => {
    e.stopPropagation();
    cameraInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Boutons d'action séparés */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleClickCamera}
          disabled={uploading || previews.length >= maxPhotos}
          className="
            flex-1 flex items-center justify-center gap-2 
            px-4 py-3 bg-orange-600 text-white rounded-lg
            hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed
            transition-colors duration-200
          "
        >
          <Camera className="w-5 h-5" />
          <span className="font-medium">Prendre une photo</span>
        </button>

        <button
          type="button"
          onClick={handleClickUpload}
          disabled={uploading || previews.length >= maxPhotos}
          className="
            flex-1 flex items-center justify-center gap-2 
            px-4 py-3 bg-blue-600 text-white rounded-lg
            hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
            transition-colors duration-200
          "
        >
          <FolderOpen className="w-5 h-5" />
          <span className="font-medium">Choisir des fichiers</span>
        </button>
      </div>

      {/* Inputs cachés */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Zone de drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center
          transition-all duration-200
          ${isDragging 
            ? 'border-orange-500 bg-orange-50' 
            : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader className="w-8 h-8 text-orange-600 animate-spin mb-2" />
            <p className="text-sm text-gray-600">Upload en cours...</p>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-900 mb-1">
              Ou glissez vos photos ici
            </p>
            <p className="text-xs text-gray-500">
              Max {maxPhotos} photos • JPG, PNG, WEBP • 5MB max
            </p>
            {previews.length > 0 && (
              <p className="text-xs text-orange-600 mt-2">
                {previews.length}/{maxPhotos} photo(s) uploadée(s)
              </p>
            )}
          </>
        )}
      </div>

      {/* Prévisualisation des photos */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {previews.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${url}`}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => handleRemovePhoto(index)}
                className="
                  absolute -top-2 -right-2 
                  bg-red-500 text-white rounded-full p-1
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                  hover:bg-red-600
                "
                title="Supprimer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}/{previews.length}
              </div>
            </div>
          ))}

          {/* Placeholder pour ajouter plus */}
          {previews.length < maxPhotos && (
            <div
              onClick={handleClickUpload}
              className="
                aspect-square rounded-lg border-2 border-dashed border-gray-300
                flex flex-col items-center justify-center
                cursor-pointer hover:border-orange-400 hover:bg-gray-50
                transition-colors duration-200
              "
            >
              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-xs text-gray-500">Ajouter</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
