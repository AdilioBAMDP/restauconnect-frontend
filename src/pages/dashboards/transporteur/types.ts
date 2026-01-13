// ============================================
// TYPES CENTRALISÉS - DASHBOARD TRANSPORTEUR TMS PRO
// ============================================

// ============================================
// VÉHICULES & FLOTTE
// ============================================

export interface Vehicle {
  _id: string;
  vehicleId: string;
  registrationNumber: string;
  type: 'van' | 'truck' | 'motorcycle' | 'car';
  capacity: number;
  currentLoad?: number;
  status: 'available' | 'in-use' | 'maintenance' | 'fully-assigned';
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  assignedDeliveries: string[];
  assignedDriver?: string;
  features?: string[];
  fuelType?: string;
  consumption?: number;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  insurance?: {
    provider: string;
    policyNumber: string;
    expiryDate: Date;
  };
  documents?: Array<{
    type: string;
    url: string;
    expiryDate?: Date;
  }>;
}

export interface VehicleLocation {
  vehicleId: string;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: Date;
  speed?: number;
  heading?: number;
}

// ============================================
// CHAUFFEURS
// ============================================

export interface Driver {
  _id: string;
  driverId: string;
  name: string;
  phone: string;
  email?: string;
  status: 'available' | 'on-delivery' | 'off-duty' | 'assigned';
  licenseNumber?: string;
  licenseExpiryDate?: Date;
  maxHours: number;
  assignedHours: number;
  assignedVehicle?: string;
  assignedRoute?: string;
  currentDelivery?: string;
  location?: {
    lat: number;
    lng: number;
  };
  rating?: number;
  totalDeliveries?: number;
  documents?: Array<{
    type: string;
    url: string;
    expiryDate?: Date;
  }>;
}

export interface DriverLocation {
  driverId: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  speed?: number;
  heading?: number;
  status: string;
  currentDelivery?: {
    deliveryId: string;
    clientName: string;
    destination: string;
    eta: Date;
  };
}

export interface DriverEmployee {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: 'driver';
  status: 'active' | 'inactive' | 'suspended';
  licenseNumber: string;
  licenseExpiryDate: Date;
  vehicleAssigned?: string;
  stats: {
    totalDeliveries: number;
    completedDeliveries: number;
    rating: number;
    onTimeRate: number;
  };
}

// ============================================
// LIVRAISONS & TRACKING
// ============================================

export interface Delivery {
  _id: string;
  deliveryId: string;
  orderId: string;
  clientName: string;
  clientPhone: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in-transit' | 'delivered' | 'failed';
  pickupAddress: string;
  deliveryAddress: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  destination: {
    lat?: number;
    lng?: number;
    street: string;
    city: string;
    postalCode?: string;
  };
  assignedVehicle?: string;
  assignedDriver?: string;
  estimatedTime?: Date;
  scheduledDate?: Date;
  distance?: number;
  items?: Array<{
    name: string;
    quantity: number;
    weight?: number;
  }>;
}

export interface DeliveryTracking {
  deliveryId: string;
  status: 'pending' | 'assigned' | 'picked-up' | 'in-transit' | 'arrived' | 'delivered' | 'failed';
  currentLocation?: {
    lat: number;
    lng: number;
  };
  destination: {
    street: string;
    city: string;
    lat?: number;
    lng?: number;
  };
  stops?: Array<{
    location: {
      lat: number;
      lng: number;
      address: string;
    };
    status: 'pending' | 'completed' | 'skipped';
    arrivalTime?: Date;
    completionTime?: Date;
  }>;
  driver?: {
    name: string;
    phone: string;
  };
  eta?: Date;
  distance?: number;
  trackingHistory: Array<{
    timestamp: Date;
    location: {
      lat: number;
      lng: number;
    };
    speed?: number;
    event?: string;
  }>;
}

export interface TrackingPoint {
  timestamp: Date;
  location: {
    lat: number;
    lng: number;
  };
  speed?: number;
  event?: string;
}

// ============================================
// PLANNING & ROUTES
// ============================================

export interface Route {
  _id: string;
  name: string;
  vehicleId: string;
  driverId?: string;
  deliveries: string[];
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  plannedDate?: Date;
  startTime?: Date;
  endTime?: Date;
  estimatedDistance?: number;
  estimatedDuration?: number;
  optimized?: boolean;
}

export interface PlanningData {
  _id: string;
  date: Date;
  availableVehicles: Array<{
    vehicleId: string;
    registrationNumber: string;
    type: string;
    capacity: number;
    status: string;
    assignedDeliveries: string[];
  }>;
  availableDrivers: Array<{
    driverId: string;
    name: string;
    status: string;
    maxHours: number;
    assignedHours: number;
    assignedRoute?: string;
  }>;
  pendingDeliveries: Array<{
    deliveryId: string;
    priority: string;
    location: { lat: number; lng: number };
    status: string;
  }>;
  routes: Route[];
  stats: {
    totalDeliveries: number;
    assignedDeliveries: number;
    unassignedDeliveries: number;
    vehicleUtilization: number;
    driverUtilization: number;
  };
}

export interface DeliveryEvent {
  id: string;
  deliveryId: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  priority: string;
  distance: number;
  clientName: string;
  pickupAddress: string;
  deliveryAddress: string;
  assignedVehicle?: string;
  assignedDriver?: string;
}

// ============================================
// FACTURATION
// ============================================

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientName: string;
  clientId: string;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  taxAmount: number;
  total: number;
  pdfUrl?: string;
  items: Array<{
    description: string;
    distance: number;
    basePrice: number;
    extraCharges?: Array<{
      name: string;
      amount: number;
    }>;
    total: number;
  }>;
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
  relances?: Array<{
    date: Date;
    type: 'email' | 'phone' | 'letter';
    status: 'sent' | 'failed';
  }>;
}

export interface InvoiceStats {
  totalIssued: number;
  totalPaid: number;
  totalOverdue: number;
  totalRevenue: number;
  paidRevenue: number;
  outstandingRevenue: number;
  averagePaymentDelay: number;
}

// ============================================
// STATISTIQUES & ANALYTICS
// ============================================

export interface TMSStats {
  deliveries: {
    total: number;
    completed: number;
    inProgress: number;
    failed: number;
  };
  fleet: {
    totalVehicles: number;
    activeVehicles: number;
    utilization: number;
    averageDistance: number;
  };
  drivers: {
    totalDrivers: number;
    activeDrivers: number;
    utilization: number;
    averageRating: number;
  };
  financial: {
    totalRevenue: number;
    paidRevenue: number;
    outstandingRevenue: number;
    averageInvoiceAmount: number;
  };
}

// ============================================
// FORMULAIRES
// ============================================

export interface VehicleFormData {
  registrationNumber: string;
  type: 'van' | 'truck' | 'motorcycle' | 'car';
  capacity: number;
  fuelType?: string;
  features?: string[];
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: Date;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
}

export interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (data: VehicleFormData) => void;
  onCancel: () => void;
}

export interface DriverFormProps {
  driver?: Driver;
  onSubmit: (data: Partial<Driver>) => void;
  onCancel: () => void;
}

// ============================================
// WEBSOCKET EVENTS
// ============================================

export interface WebSocketLocationUpdate {
  deliveryId: string;
  driverId: string;
  location: {
    lat: number;
    lng: number;
  };
  speed?: number;
  heading?: number;
  eta?: {
    estimatedArrival: string | number;
    remainingDistance: number;
  };
  timestamp: Date;
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
