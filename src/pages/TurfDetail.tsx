
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTurfById, getVenueById, getAvailableTimeSlots } from '../services/dataService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { MapPin, CalendarDays, Tag, Clock, Info } from 'lucide-react';

const TurfDetail = () => {
  const { venueId, turfId } = useParams<{ venueId: string; turfId: string }>();
  const { user } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  
  const { data: turf, isLoading: turfLoading } = useQuery({
    queryKey: ['turf', turfId],
    queryFn: () => getTurfById(turfId || ''),
    enabled: !!turfId,
  });
  
  const { data: venue, isLoading: venueLoading } = useQuery({
    queryKey: ['venue', venueId],
    queryFn: () => getVenueById(venueId || ''),
    enabled: !!venueId,
  });
  
  const { data: timeSlots, isLoading: slotsLoading } = useQuery({
    queryKey: ['timeSlots', turfId, selectedDate.toISOString().split('T')[0]],
    queryFn: () => getAvailableTimeSlots(turfId || '', selectedDate.toISOString()),
    enabled: !!turfId && !!selectedDate,
  });
  
  const handleTimeSlotSelection = (startTime: string) => {
    setSelectedTimeSlots(prev => {
      if (prev.includes(startTime)) {
        return prev.filter(slot => slot !== startTime);
      } else {
        return [...prev, startTime];
      }
    });
  };
  
  const calculateTotalPrice = () => {
    if (!turf) return 0;
    return selectedTimeSlots.length * (turf.pricePerHour / 2); // Half hour slots
  };
  
  const handleBooking = () => {
    if (!user) {
      toast.error('Please login to book this turf');
      return;
    }
    
    if (selectedTimeSlots.length === 0) {
      toast.error('Please select at least one time slot');
      return;
    }
    
    // In a real app, this would call an API to create a booking
    toast.success('Booking initiated. Redirecting to payment...');
  };
  
  if (turfLoading || venueLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          Loading turf details...
        </div>
        <Footer />
      </div>
    );
  }

  if (!turf || !venue) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Turf Not Found</h1>
          <p className="mb-6">The turf you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow">
        {/* Hero Section with Turf Image */}
        <div className="relative h-64 md:h-96 bg-gray-200 overflow-hidden">
          <img 
            src={turf.images?.[0] || 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop'} 
            alt={turf.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Link to={`/venue/${venue.id}`} className="text-white hover:underline">
                {venue.name}
              </Link>
              <span>•</span>
              <Badge className="bg-sportBlue">{turf.sportType}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{turf.name}</h1>
            <div className="flex items-center mt-2">
              <MapPin className="h-5 w-5 mr-1" />
              {venue.address}
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Turf Information */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">About this Turf</h2>
                  <div className="flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-sportBlue" />
                    <span className="text-xl font-bold">₹{turf.pricePerHour}</span>
                    <span className="text-gray-500 text-sm ml-1">/ hour</span>
                  </div>
                </div>
                
                <p className="mb-6">{turf.description || 'No description provided for this turf.'}</p>
                
                <Separator className="my-6" />
                
                <h3 className="font-semibold mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {turf.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline">{amenity}</Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Booking Section */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2" />
                    Book this Turf
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Select Date</h3>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      disabled={(date) => date < new Date()}
                      className={cn("rounded-md border shadow", "pointer-events-auto")}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Available Slots: {format(selectedDate, 'dd MMM yyyy')}
                    </h3>
                    
                    {slotsLoading ? (
                      <div className="text-center py-4">Loading available slots...</div>
                    ) : timeSlots?.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">No slots available on this date</div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {timeSlots?.map((slot, index) => {
                          const startTime = new Date(slot.startTime);
                          const formattedTime = format(startTime, 'h:mm a');
                          
                          return (
                            <Button
                              key={index}
                              variant={slot.isAvailable ? (selectedTimeSlots.includes(slot.startTime) ? "default" : "outline") : "ghost"}
                              className={cn(
                                "text-xs",
                                slot.isAvailable ? "" : "opacity-50 cursor-not-allowed"
                              )}
                              disabled={!slot.isAvailable}
                              onClick={() => slot.isAvailable && handleTimeSlotSelection(slot.startTime)}
                            >
                              {formattedTime}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Selected Slots:</span>
                      <span>{selectedTimeSlots.length}</span>
                    </div>
                    
                    <div className="flex justify-between font-bold">
                      <span>Total Price:</span>
                      <span>₹{calculateTotalPrice()}</span>
                    </div>
                    
                    <Button 
                      onClick={handleBooking} 
                      disabled={selectedTimeSlots.length === 0}
                      className="w-full bg-sportOrange hover:bg-opacity-90"
                    >
                      Book Now
                    </Button>
                    
                    {!user && (
                      <p className="text-xs text-center text-gray-500">
                        Please <Link to="/login" className="text-sportBlue hover:underline">login</Link> to book this turf
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TurfDetail;
