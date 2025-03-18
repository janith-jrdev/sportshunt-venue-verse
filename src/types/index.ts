
export interface User {
  id: string;
  email: string;
  name: string;
  isHost: boolean;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  description?: string;
  images?: string[];
  googleMapsLink?: string;
  hostId: string;
  createdAt: string;
}

export interface Turf {
  id: string;
  name: string;
  venueId: string;
  pricePerHour: number;
  sportType: SportType;
  images?: string[];
  description?: string;
  amenities: string[];
  createdAt: string;
}

export interface Booking {
  id: string;
  turfId: string;
  userId: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: BookingStatus;
  paymentId?: string;
  createdAt: string;
}

export enum SportType {
  FOOTBALL = "Football",
  CRICKET = "Cricket",
  BASKETBALL = "Basketball",
  TENNIS = "Tennis",
  BADMINTON = "Badminton",
  VOLLEYBALL = "Volleyball",
  OTHER = "Other"
}

export enum BookingStatus {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  CANCELLED = "Cancelled",
  COMPLETED = "Completed"
}

export type TimeSlot = {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};
