// Types métier partagés pour l'application Web Spider

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  fromName?: string;
  toName?: string;
  subject?: string;
  content: string;
  timestamp?: Date;
  createdAt?: string;
  read: boolean;
  relatedOfferId?: string;
}

export interface Professional {
  id: string;
  name: string;
  specialty?: string;
  rating?: number;
  location?: string;
  phone?: string;
  email?: string;
}

export interface RestaurantOffer {
  id: string;
  title: string;
  description: string;
  category: string;
  budget?: number;
  images?: string[];
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  restaurantId: string;
}

export interface Application {
  id: string;
  offerId: string;
  professionalId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: string;
}

export interface Event {
  title: string;
  date: string;
  time?: string;
  type?: 'meeting' | 'delivery' | 'maintenance' | 'other';
}
