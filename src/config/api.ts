// Configuration des API pour Web Spider
export const API_BASE_URL = import.meta.env?.VITE_API_URL as string || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Users
  USERS: '/users',
  PROFILE: '/users/profile',
  
  // Listings
  LISTINGS: '/listings',
  OFFERS: '/listings/offers',
  DEMANDS: '/listings/demands',
  
  // Messages
  MESSAGES: '/messages',
  CONVERSATIONS: '/messages/conversations',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  
  // TMS
  TMS: '/tms',
  DELIVERIES: '/tms/deliveries',
  DRIVERS: '/tms/drivers',
  TMS_ADMIN: '/tms/admin',
  
  // Reviews
  REVIEWS: '/reviews',
  
  // Upload
  UPLOAD: '/upload',
  
  // Dashboard
  DASHBOARD: '/dashboard',
  
  // Search
  SEARCH: '/search',
  
  // Calendar
  CALENDAR: '/calendar',
  
  // Admin
  ADMIN: '/admin'
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...DEFAULT_HEADERS,
    'Authorization': `Bearer ${token}`
  };
};
