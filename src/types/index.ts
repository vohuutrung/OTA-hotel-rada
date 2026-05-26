export interface Hotel {
  id: number;
  name: string;
  isTarget: boolean;
  rating: number;
  reviewCount: number;
  locationScore: number;
  address: string;
  price: number;
  roomTypes?: string[];
}

export interface Property {
  id: number;
  name: string;
  location: string;
  otaAgodaId?: string;
  otaBookingId?: string;
  isActive: boolean;
  rating: number;
  reviews: number;
  currentPrice: number;
}

export interface Event {
  id: number;
  propertyId: number;
  name: string;
  dateStart: string;
  dateEnd: string;
  type: string; // 'holiday' | 'festival' | 'concert' | 'local_event' | 'sports'
  impactScore: number; // -5 to +5
  description?: string;
}

export interface Booking {
  id: number;
  roomNumber: string;
  roomType: string;
  guestName: string;
  checkinDate: string;
  checkoutDate: string;
  bookingSource: 'DIRECT' | 'OTA' | 'CORP' | 'COMP' | 'GROUP';
  price: number;
  status: 'CHECKIN' | 'STAYING' | 'CHECKOUT' | 'CONFIRMED';
}

export interface Alert {
  id: number;
  type: string;
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  date: string;
  isRead: boolean;
}

export interface GuestSegment {
  id: number;
  propertyId: number;
  name: string;
  criteria: string;
  priceAdjustment: number; // percentage change (e.g. -10 for Corporate)
  isDefault: boolean;
}

export interface PricingRule {
  id: number;
  propertyId: number;
  segmentId: number;
  roomType: string;
  dateStart: string;
  dateEnd: string;
  minPrice: number;
  maxPrice: number;
  strategy: 'fixed' | 'dynamic' | 'competitor_parity';
}

export interface Tenant {
  id: number;
  companyName: string;
  slug: string;
  logoUrl?: string;
  primaryColor: string; // default hex color codes
  isActive: boolean;
  plan: 'free' | 'pro' | 'enterprise';
  maxProperties: number;
  createdAt: string;
}

export interface User {
  id: number;
  tenantId: number;
  email: string;
  fullName: string;
  role: 'admin' | 'manager' | 'viewer';
  isActive: boolean;
  createdAt: string;
}
