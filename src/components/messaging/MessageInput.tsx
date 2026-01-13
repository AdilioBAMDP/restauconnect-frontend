/**
 * MESSAGE INPUT - Zone de saisie de message avec upload de fichiers
 * 
 * Composant réutilisable pour saisir et envoyer des messages
 * Support : Texte + Fichiers (images, documents, archives)
 */

import React, { useRef, useState } from 'react';
import { Send, Paperclip, X, File, FileText, Image as ImageIcon, Archive } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (attachedFiles?: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
  isSending?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  placeholder = 'Écrivez votre message...',
  disabled = false,
  isSending = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Filtrer les fichiers trop gros (max 10MB)
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} est trop volumineux (max 10MB)`);
        return false;
      }
      return true;
    });
    
    // Limiter à 10 fichiers au total
    const totalFiles = [...selectedFiles, ...validFiles];
    if (totalFiles.length > 10) {
      alert('Maximum 10 fichiers par message');
      setSelectedFiles(totalFiles.slice(0, 10));
    } else {
      setSelectedFiles(totalFiles);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (!value.trim() && selectedFiles.length === 0) return;
    
    onSend(selectedFiles.length > 0 ? selectedFiles : undefined);
    onChange(''); // Vider le champ texte
    setSelectedFiles([]);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="w-4 h-4 text-red-500" />;
    } else if (file.type.includes('zip') || file.type.includes('rar')) {
      return <Archive className="w-4 h-4 text-purple-500" />;
    } else {
      return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      
      {/* Preview fichiers sélectionnés */}
      {selectedFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              {getFileIcon(file)}
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-gray-700">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Retirer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        {/* Bouton Attach Files */}
        <button
          onClick={handleFileClick}
          disabled={disabled}
          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          title="Attacher des fichiers"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        
        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar,.7z"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {/* Textarea */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={2}
          disabled={disabled}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        {/* Bouton Send */}
        <button
          onClick={handleSend}
          disabled={(!value.trim() && selectedFiles.length === 0) || disabled || isSending}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          style={{ height: '72px' }}
        >
          {isSending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        📎 Images, PDF, DOC, XLSX, ZIP • Max 10MB/fichier • Max 10 fichiers
      </p>
    </div>
  );
};

export default MessageInput;
