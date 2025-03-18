
import { Venue, Turf, Booking, SportType, BookingStatus, TimeSlot } from '../types';

// Mock data storage (would be replaced with API calls)
let venues: Venue[] = [
  {
    id: 'venue1',
    name: 'Sports Arena',
    address: '123 Sports Lane, Sports City',
    description: 'A premium sports facility with multiple turfs',
    images: ['https://images.unsplash.com/photo-1571150230347-58fbf83a58dd?q=80&w=2070&auto=format&fit=crop'],
    hostId: 'host1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'venue2',
    name: 'City Sports Complex',
    address: '456 Stadium Road, Central District',
    description: 'Multi-sport facility in the heart of the city',
    images: ['https://images.unsplash.com/photo-1556955867-7da5f00be574?q=80&w=2070&auto=format&fit=crop'],
    hostId: 'host2',
    createdAt: new Date().toISOString(),
  },
];

let turfs: Turf[] = [
  {
    id: 'turf1',
    name: 'Football Field A',
    venueId: 'venue1',
    pricePerHour: 1000,
    sportType: SportType.FOOTBALL,
    description: 'Professional football turf with floodlights',
    amenities: ['Floodlights', 'Changing Rooms', 'Water Cooler'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'turf2',
    name: 'Basketball Court 1',
    venueId: 'venue1',
    pricePerHour: 800,
    sportType: SportType.BASKETBALL,
    description: 'Indoor basketball court with wooden flooring',
    amenities: ['Indoor', 'Scoreboard', 'Seating Area'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'turf3',
    name: 'Cricket Pitch',
    venueId: 'venue2',
    pricePerHour: 1200,
    sportType: SportType.CRICKET,
    description: 'Standard cricket pitch with practice nets',
    amenities: ['Practice Nets', 'Equipment Rental', 'Pavilion'],
    createdAt: new Date().toISOString(),
  },
];

let bookings: Booking[] = [];

// Venue Services
export const getAllVenues = async (): Promise<Venue[]> => {
  return venues;
};

export const getVenueById = async (id: string): Promise<Venue | null> => {
  const venue = venues.find(v => v.id === id);
  return venue || null;
};

export const getVenuesByHost = async (hostId: string): Promise<Venue[]> => {
  return venues.filter(v => v.hostId === hostId);
};

export const createVenue = async (venue: Omit<Venue, 'id' | 'createdAt'>): Promise<Venue> => {
  const newVenue: Venue = {
    ...venue,
    id: `venue_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  venues.push(newVenue);
  return newVenue;
};

// Turf Services
export const getTurfsByVenue = async (venueId: string): Promise<Turf[]> => {
  return turfs.filter(t => t.venueId === venueId);
};

export const getTurfById = async (id: string): Promise<Turf | null> => {
  const turf = turfs.find(t => t.id === id);
  return turf || null;
};

export const createTurf = async (turf: Omit<Turf, 'id' | 'createdAt'>): Promise<Turf> => {
  const newTurf: Turf = {
    ...turf,
    id: `turf_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  turfs.push(newTurf);
  return newTurf;
};

// Booking Services
export const getBookingsByTurf = async (turfId: string): Promise<Booking[]> => {
  return bookings.filter(b => b.turfId === turfId);
};

export const getBookingsByUser = async (userId: string): Promise<Booking[]> => {
  return bookings.filter(b => b.userId === userId);
};

export const createBooking = async (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<Booking> => {
  const newBooking: Booking = {
    ...booking,
    id: `booking_${Date.now()}`,
    status: BookingStatus.PENDING,
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  return newBooking;
};

export const confirmBooking = async (bookingId: string, paymentId: string): Promise<Booking> => {
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }
  
  booking.status = BookingStatus.CONFIRMED;
  booking.paymentId = paymentId;
  
  return booking;
};

export const getAvailableTimeSlots = async (turfId: string, date: string): Promise<TimeSlot[]> => {
  const turfBookings = bookings.filter(
    b => b.turfId === turfId && 
    new Date(b.startTime).toDateString() === new Date(date).toDateString() &&
    b.status !== BookingStatus.CANCELLED
  );
  
  // Generate time slots for the day (8 AM to 10 PM)
  const timeSlots: TimeSlot[] = [];
  const startHour = 8;
  const endHour = 22;
  
  for (let hour = startHour; hour < endHour; hour++) {
    // Create two slots per hour (full hour and half hour)
    const slots = [0, 30];
    
    slots.forEach(minutes => {
      const slotDate = new Date(date);
      slotDate.setHours(hour, minutes, 0, 0);
      
      const endSlotDate = new Date(slotDate);
      endSlotDate.setMinutes(endSlotDate.getMinutes() + 30);
      
      const startTimeString = slotDate.toISOString();
      const endTimeString = endSlotDate.toISOString();
      
      // Check if this slot conflicts with any booking
      const isAvailable = !turfBookings.some(booking => {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);
        
        return (
          (slotDate >= bookingStart && slotDate < bookingEnd) ||
          (endSlotDate > bookingStart && endSlotDate <= bookingEnd) ||
          (slotDate <= bookingStart && endSlotDate >= bookingEnd)
        );
      });
      
      timeSlots.push({
        startTime: startTimeString,
        endTime: endTimeString,
        isAvailable
      });
    });
  }
  
  return timeSlots;
};

// Search and filter
export const searchVenues = async (query: string): Promise<Venue[]> => {
  const lowerQuery = query.toLowerCase();
  return venues.filter(
    v => v.name.toLowerCase().includes(lowerQuery) || 
    v.address.toLowerCase().includes(lowerQuery) ||
    (v.description && v.description.toLowerCase().includes(lowerQuery))
  );
};

// Helper methods for amenities by sport type
export const getDefaultAmenitiesForSport = (sportType: SportType): string[] => {
  switch (sportType) {
    case SportType.FOOTBALL:
      return ['Goals', 'Corner Flags', 'Changing Rooms'];
    case SportType.CRICKET:
      return ['Wickets', 'Practice Nets', 'Pavilion'];
    case SportType.BASKETBALL:
      return ['Hoops', 'Scoreboard', 'Indoor Court'];
    case SportType.TENNIS:
      return ['Nets', 'Racket Rental', 'Court Lighting'];
    case SportType.BADMINTON:
      return ['Nets', 'Shuttle Rental', 'Indoor Court'];
    case SportType.VOLLEYBALL:
      return ['Nets', 'Ball Rental', 'Court Markers'];
    default:
      return [];
  }
};
