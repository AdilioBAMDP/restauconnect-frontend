/**
 * 🎯 MARKETPLACE STORE - Refactorisé
 * 
 * Responsabilité unique: Gérer les posts marketplace et annonces globales
 * Avant: 3832 lignes monolithiques
 * Après: ~350 lignes ciblées
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/services/api';
import { FEATURES } from '@/config/features';
import {
  MarketplacePost,
  GlobalAnnouncement,
  AnnouncementConfirmation,
  AnnouncementInteraction
} from '../types/marketplace.types';
import { UserRole } from '../types/common.types';

// ========== STATE INTERFACE ==========

interface MarketplaceState {
  // Data
  posts: MarketplacePost[];
  globalAnnouncements: GlobalAnnouncement[];
  announcementConfirmations: AnnouncementConfirmation[];
  announcementInteractions: AnnouncementInteraction[];
  
  // Actions - Posts
  fetchPosts: () => Promise<void>;
  addPost: (post: Omit<MarketplacePost, 'id' | 'createdAt' | 'timestamp' | 'likes' | 'comments' | 'views' | 'likedBy' | 'bookmarkedBy'>) => Promise<string>;
  updatePost: (id: string, updates: Partial<MarketplacePost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  likePost: (postId: string, userId: string) => Promise<void>;
  bookmarkPost: (postId: string, userId: string) => Promise<void>;
  getPostsByRole: (userRole?: UserRole) => MarketplacePost[];
  
  // Actions - Annonces Globales
  createAnnouncement: (announcement: Omit<GlobalAnnouncement, 'id' | 'createdAt' | 'updatedAt' | 'lastConfirmedAt' | 'nextConfirmationDue' | 'viewCount' | 'clickCount' | 'contactCount'>) => void;
  updateAnnouncement: (id: string, updates: Partial<GlobalAnnouncement>) => void;
  deleteAnnouncement: (id: string) => void;
  confirmAnnouncementActive: (id: string, isActive: boolean) => void;
  recordInteraction: (interaction: Omit<AnnouncementInteraction, 'id' | 'timestamp'>) => void;
  getAnnouncementsForRole: (userRole: UserRole) => GlobalAnnouncement[];
}

// ========== STORE IMPLEMENTATION ==========

export const useMarketplaceStore = create<MarketplaceState>()(
  persist(
    (set, get) => ({
      // ========== INITIAL STATE ==========
      posts: [],
      globalAnnouncements: [],
      announcementConfirmations: [],
      announcementInteractions: [],

      // ========== POSTS ACTIONS ==========
      
      fetchPosts: async () => {
        try {
          const endpoint = FEATURES.SMART_RANKING 
            ? '/marketplace/posts/ranked'
            : '/marketplace/posts';
          
          const response = await apiClient.get(endpoint);
          set({ posts: response.data });
        } catch (error) {
          console.error('[MarketplaceStore] Erreur lors du chargement des posts:', error);
        }
      },

      addPost: async (postData) => {
        const newPost: MarketplacePost = {
          ...postData,
          id: `post-${Date.now()}`,
          timestamp: new Date(),
          createdAt: new Date().toISOString(),
          likes: 0,
          comments: 0,
          views: 0,
          likedBy: [],
          bookmarkedBy: []
        };

        try {
          const response = await apiClient.post('/marketplace/posts', newPost);
          set((state) => ({
            posts: [response.data, ...state.posts]
          }));
          return response.data.id;
        } catch (error) {
          console.error('[MarketplaceStore] Erreur création post:', error);
          // Fallback: ajouter localement
          set((state) => ({
            posts: [newPost, ...state.posts]
          }));
          return newPost.id;
        }
      },

      updatePost: async (id, updates) => {
        try {
          const response = await apiClient.put(`/marketplace/posts/${id}`, { 
            ...updates, 
            updatedAt: new Date().toISOString() 
          });
          
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === id ? response.data : post
            )
          }));
        } catch (error) {
          console.error('[MarketplaceStore] Erreur mise à jour post:', error);
          // Fallback: mettre à jour localement
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === id 
                ? { ...post, ...updates, updatedAt: new Date().toISOString() }
                : post
            )
          }));
        }
      },

      deletePost: async (id) => {
        try {
          await apiClient.delete(`/marketplace/posts/${id}`);
          set((state) => ({
            posts: state.posts.filter((post) => post.id !== id)
          }));
        } catch (error) {
          console.error('[MarketplaceStore] Erreur suppression post:', error);
          // Fallback: supprimer localement
          set((state) => ({
            posts: state.posts.filter((post) => post.id !== id)
          }));
        }
      },

      likePost: async (postId, userId) => {
        const state = get();
        const post = state.posts.find(p => p.id === postId);
        if (!post) return;

        const isLiked = post.likedBy.includes(userId);
        const newLikedBy = isLiked 
          ? post.likedBy.filter(id => id !== userId)
          : [...post.likedBy, userId];

        try {
          const response = await apiClient.post(`/marketplace/posts/${postId}/like`, { 
            userId, 
            isLiked: !isLiked 
          });
          
          set((state) => ({
            posts: state.posts.map((p) =>
              p.id === postId ? response.data : p
            )
          }));
        } catch (error) {
          console.error('[MarketplaceStore] Erreur like:', error);
          // Fallback: mettre à jour localement
          set((state) => ({
            posts: state.posts.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    likedBy: newLikedBy,
                    likes: newLikedBy.length,
                    isLiked: !isLiked
                  }
                : p
            )
          }));
        }
      },

      bookmarkPost: async (postId, userId) => {
        const state = get();
        const post = state.posts.find(p => p.id === postId);
        if (!post) return;

        const isBookmarked = post.bookmarkedBy.includes(userId);
        const newBookmarkedBy = isBookmarked
          ? post.bookmarkedBy.filter(id => id !== userId)
          : [...post.bookmarkedBy, userId];

        // Fallback: mettre à jour localement (API bookmark pas encore implémentée)
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  bookmarkedBy: newBookmarkedBy,
                  isBookmarked: !isBookmarked
                }
              : p
          )
        }));
      },

      getPostsByRole: (userRole) => {
        const state = get();
        if (!userRole) return state.posts;
        
        return state.posts.filter((post) => {
          if (post.visibility === 'public') return true;
          if (post.visibility === 'professionals') return true;
          if (post.visibility === 'role-specific' && post.author.role === userRole) return true;
          return false;
        }).sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      },

      // ========== ANNONCES GLOBALES ACTIONS ==========

      createAnnouncement: (announcementData) => {
        const newAnnouncement: GlobalAnnouncement = {
          ...announcementData,
          id: `ann-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastConfirmedAt: new Date().toISOString(),
          nextConfirmationDue: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          viewCount: 0,
          clickCount: 0,
          contactCount: 0
        };
        
        set((state) => ({
          globalAnnouncements: [newAnnouncement, ...state.globalAnnouncements]
        }));
      },

      updateAnnouncement: (id, announcementData) => {
        set((state) => ({
          globalAnnouncements: state.globalAnnouncements.map((ann) =>
            ann.id === id 
              ? { ...ann, ...announcementData, updatedAt: new Date().toISOString() }
              : ann
          )
        }));
      },

      deleteAnnouncement: (id) => {
        set((state) => ({
          globalAnnouncements: state.globalAnnouncements.filter((ann) => ann.id !== id)
        }));
      },

      confirmAnnouncementActive: (id, isActive) => {
        const now = new Date();
        if (isActive) {
          set((state) => ({
            globalAnnouncements: state.globalAnnouncements.map((ann) =>
              ann.id === id 
                ? {
                    ...ann,
                    status: 'active',
                    lastConfirmedAt: now.toISOString(),
                    nextConfirmationDue: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString()
                  }
                : ann
            )
          }));
        } else {
          set((state) => ({
            globalAnnouncements: state.globalAnnouncements.filter((ann) => ann.id !== id)
          }));
        }
      },

      recordInteraction: (interactionData) => {
        const newInteraction: AnnouncementInteraction = {
          ...interactionData,
          id: `int-${Date.now()}`,
          timestamp: new Date().toISOString()
        };

        set((state) => ({
          announcementInteractions: [newInteraction, ...state.announcementInteractions],
          globalAnnouncements: state.globalAnnouncements.map((ann) => {
            if (ann.id === interactionData.announcementId) {
              const updates: Partial<GlobalAnnouncement> = {};
              switch (interactionData.type) {
                case 'view':
                  updates.viewCount = ann.viewCount + 1;
                  break;
                case 'click':
                  updates.clickCount = ann.clickCount + 1;
                  break;
                case 'contact':
                  updates.contactCount = ann.contactCount + 1;
                  break;
              }
              return { ...ann, ...updates };
            }
            return ann;
          })
        }));
      },

      getAnnouncementsForRole: (userRole) => {
        const state = get();
        return state.globalAnnouncements.filter((ann) => {
          if (ann.status !== 'active') return false;
          if (ann.expiresAt && new Date(ann.expiresAt) < new Date()) return false;
          if (ann.excludeRoles && ann.excludeRoles.includes(userRole)) return false;
          if (ann.targetAudience === 'all') return true;
          if (Array.isArray(ann.targetAudience) && ann.targetAudience.includes(userRole)) return true;
          return false;
        }).sort((a, b) => {
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
          if (priorityDiff !== 0) return priorityDiff;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      }
    }),
    {
      name: 'marketplace-storage',
      partialize: (state) => ({
        posts: state.posts,
        globalAnnouncements: state.globalAnnouncements
      })
    }
  )
);
