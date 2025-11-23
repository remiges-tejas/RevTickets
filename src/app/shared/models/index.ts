// User Models
export interface User {
  id: number | string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  roles: string[];
  role?: 'customer' | 'admin'; // For backward compatibility
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserPreferences {
  language: string;
  genres: string[];
  notifications: boolean;
}

export interface AuthResponse {
  token: string;
  tokenType?: string;
  user: User;
  expiresIn?: number;
}

export interface BackendApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: any;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

// Movie Models
export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  bannerUrl: string;
  trailerUrl?: string;
  duration: number; // in minutes
  releaseDate: Date;
  endDate?: Date;
  genres: string[];
  language: string;
  format: MovieFormat[];
  cast: CastMember[];
  director: string;
  rating: number;
  totalRatings: number;
  certificate: string; // U, UA, A, S
  status: 'now_showing' | 'coming_soon' | 'ended';
  createdAt: Date;
  updatedAt: Date;
}

export type MovieFormat = '2D' | '3D' | 'IMAX' | '4DX' | 'DOLBY';

export interface CastMember {
  name: string;
  role: string;
  imageUrl?: string;
}

// Theater Models
export interface Theater {
  id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  screens: Screen[];
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Screen {
  id: string;
  name: string;
  theaterId: string;
  seatLayout: SeatLayout;
  totalSeats: number;
  format: MovieFormat[];
}

export interface SeatLayout {
  rows: number;
  columns: number;
  categories: SeatCategory[];
  gaps: SeatGap[];
}

export interface SeatCategory {
  name: string;
  rows: number[];
  price: number;
  color: string;
}

export interface SeatGap {
  afterRow?: number;
  afterColumn?: number;
}

// Show Models
export interface Show {
  id: string;
  movieId: string;
  movie?: Movie;
  theaterId: string;
  theater?: Theater;
  screenId: string;
  screen?: Screen;
  showDate: Date;
  showTime: string;
  endTime: string;
  format: MovieFormat;
  language: string;
  basePrice: number;
  availableSeats: number;
  totalSeats: number;
  status: 'scheduled' | 'filling_fast' | 'almost_full' | 'sold_out' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Seat Models
export interface Seat {
  id: string;
  row: string;
  number: number;
  category: string;
  price: number;
  status: 'available' | 'selected' | 'booked' | 'blocked';
}

export interface SeatSelection {
  showId: string;
  seats: Seat[];
  totalAmount: number;
}

// Booking Models
export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  showId: string;
  show?: Show;
  seats: BookedSeat[];
  totalSeats: number;
  baseAmount: number;
  convenienceFee: number;
  taxes: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentId?: string;
  payment?: Payment;
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookedSeat {
  seatId: string;
  row: string;
  number: number;
  category: string;
  price: number;
}

// Payment Models
export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'refund_processing';
  transactionId?: string;
  paymentDetails?: PaymentDetails;
  refundDetails?: RefundDetails;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet';

export interface PaymentDetails {
  cardLast4?: string;
  cardType?: string;
  upiId?: string;
  bankName?: string;
  walletName?: string;
}

export interface RefundDetails {
  refundId: string;
  amount: number;
  reason: string;
  status: 'processing' | 'completed';
  initiatedAt: Date;
  completedAt?: Date;
}

// Review Models
export interface Review {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  content: string;
  likes: number;
  isLiked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewRequest {
  movieId: string;
  rating: number;
  title?: string;
  content: string;
}

// Notification Models
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

export type NotificationType =
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'payment_success'
  | 'payment_failed'
  | 'refund_initiated'
  | 'refund_completed'
  | 'offer'
  | 'reminder';

// API Response Models
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter Models
export interface MovieFilters {
  genres?: string[];
  languages?: string[];
  formats?: MovieFormat[];
  rating?: number;
  status?: 'now_showing' | 'coming_soon';
}

export interface ShowFilters {
  date?: Date;
  format?: MovieFormat;
  language?: string;
  priceRange?: { min: number; max: number };
}

// Report Models (Admin)
export interface BookingReport {
  date: string;
  bookings: number;
  revenue: number;
}

export interface MovieReport {
  movieId: string;
  movieTitle: string;
  totalBookings: number;
  totalRevenue: number;
  avgRating: number;
}

export interface RevenueReport {
  period: string;
  revenue: number;
  bookings: number;
  avgTicketPrice: number;
}
