import React from 'react';
import { ChevronDown, ChevronUp, ThumbsUp, MessageCircle, Send, Eye } from 'lucide-react';

interface MarketplacePost {
  id: string;
  title: string;
  description: string;
  author?: string;
  likes?: number;
  comments?: number;
  [key: string]: unknown;
}

interface CompleteMarketplaceAccordionProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onRespond?: (postId: string) => void;
  onContact?: (postId: string) => void;
  onViewDetails?: (postId: string) => void;
  [key: string]: unknown;
}

export const CompleteMarketplaceAccordion: React.FC<CompleteMarketplaceAccordionProps> = ({
  isOpen = false,
  onToggle,
  onLike,
  onComment,
  onViewDetails
}) => {
  const marketplacePosts: MarketplacePost[] = [
    {
      id: '1',
      title: 'Recherche fournisseur de légumes bio',
      description: 'Restaurant cherche fournisseur local de légumes bio pour approvisionnement hebdomadaire',
      author: 'Restaurant Le Bio',
      likes: 12,
      comments: 5
    },
    {
      id: '2',
      title: 'Proposition: Service de livraison express',
      description: 'Service de livraison rapide disponible dans toute la ville',
      author: 'Express Delivery',
      likes: 8,
      comments: 3
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <MessageCircle className="text-purple-600 w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-lg">Marketplace</h3>
            <p className="text-sm text-gray-600">{marketplacePosts.length} publications récentes</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="text-gray-400 w-5 h-5" />
        ) : (
          <ChevronDown className="text-gray-400 w-5 h-5" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-gray-200 p-6 space-y-4">
          {marketplacePosts.map((post) => (
            <div key={post.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{post.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{post.description}</p>
                  <p className="text-xs text-gray-500">Par {post.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => onLike?.(post.id)}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.likes}</span>
                </button>
                <button
                  onClick={() => onComment?.(post.id)}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </button>
                <button
                  onClick={() => onViewDetails?.(post.id)}
                  className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-semibold ml-auto"
                >
                  <Eye className="w-4 h-4" />
                  <span>Voir détails</span>
                </button>
              </div>
            </div>
          ))}
          <button className="w-full py-2 text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center justify-center gap-1">
            <Send className="w-4 h-4" />
            Publier une annonce
          </button>
        </div>
      )}
    </div>
  );
};
