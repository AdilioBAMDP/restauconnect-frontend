/**
 * MESSAGE ATTACHMENTS - Affichage des fichiers attachés aux messages
 * 
 * Composant pour afficher images, documents et archives
 */

import React, { useState } from 'react';
import { Download, FileText, Archive, Image as ImageIcon, X } from 'lucide-react';

interface Attachment {
  url: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  type: 'image' | 'document' | 'archive';
}

interface MessageAttachmentsProps {
  attachments: Attachment[];
}

const MessageAttachments: React.FC<MessageAttachmentsProps> = ({ attachments }) => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-blue-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'archive':
        return <Archive className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="space-y-2 mt-2">
      {attachments.map((attachment, index) => (
        <div key={index}>
          {/* Images - Affichage en preview */}
          {attachment.type === 'image' ? (
            <div className="relative group">
              <img
                src={attachment.url}
                alt={attachment.originalName}
                className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setLightboxImage(attachment.url)}
              />
              <button
                onClick={() => handleDownload(attachment.url, attachment.originalName)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="Télécharger"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Documents et Archives - Affichage en card */
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3 max-w-xs">
              {getFileIcon(attachment.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {attachment.originalName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(attachment.size)}
                </p>
              </div>
              <button
                onClick={() => handleDownload(attachment.url, attachment.originalName)}
                className="text-gray-500 hover:text-orange-600 transition-colors"
                title="Télécharger"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Lightbox pour images */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-opacity"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Agrandir"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default MessageAttachments;
