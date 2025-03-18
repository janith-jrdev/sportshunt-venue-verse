
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getVenueById, getTurfsByVenue } from '../services/dataService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TurfCard from '../components/TurfCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Phone, Clock, Info } from 'lucide-react';

const VenueDetail = () => {
  const { venueId } = useParams<{ venueId: string }>();
  
  const { data: venue, isLoading: venueLoading } = useQuery({
    queryKey: ['venue', venueId],
    queryFn: () => getVenueById(venueId || ''),
    enabled: !!venueId,
  });
  
  const { data: turfs, isLoading: turfsLoading } = useQuery({
    queryKey: ['turfs', venueId],
    queryFn: () => getTurfsByVenue(venueId || ''),
    enabled: !!venueId,
  });

  if (venueLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          Loading venue details...
        </div>
        <Footer />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Venue Not Found</h1>
          <p className="mb-6">The venue you're looking for doesn't exist or has been removed.</p>
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
        {/* Hero Section with Venue Image */}
        <div className="relative h-64 md:h-96 bg-gray-200 overflow-hidden">
          <img 
            src={venue.images?.[0] || 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=2074&auto=format&fit=crop'} 
            alt={venue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold">{venue.name}</h1>
            <div className="flex items-center mt-2">
              <MapPin className="h-5 w-5 mr-1" />
              {venue.address}
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Venue Information */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">About this Venue</h2>
                <p className="mb-6">{venue.description || 'No description provided for this venue.'}</p>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-sportBlue mt-1" />
                    <div>
                      <h3 className="font-semibold">Address</h3>
                      <p className="text-gray-600">{venue.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Navigation className="h-5 w-5 mr-3 text-sportBlue mt-1" />
                    <div>
                      <h3 className="font-semibold">Directions</h3>
                      <a 
                        href={venue.googleMapsLink || `https://maps.google.com/?q=${encodeURIComponent(venue.address)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sportBlue hover:underline"
                      >
                        Get directions
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-3 text-sportBlue mt-1" />
                    <div>
                      <h3 className="font-semibold">Contact</h3>
                      <p className="text-gray-600">Not provided</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 text-sportBlue mt-1" />
                    <div>
                      <h3 className="font-semibold">Operating Hours</h3>
                      <p className="text-gray-600">8:00 AM - 10:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar with Quick Info */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center mb-4">
                  <Info className="h-5 w-5 mr-2 text-sportBlue" />
                  <h3 className="font-semibold">Available Sports</h3>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {turfsLoading ? (
                    <p>Loading sports...</p>
                  ) : turfs && turfs.length > 0 ? (
                    [...new Set(turfs.map(turf => turf.sportType))].map((sport, index) => (
                      <Badge key={index} className="bg-sportBlue">{sport}</Badge>
                    ))
                  ) : (
                    <p>No sports information available</p>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Amenities</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>Parking Available</li>
                    <li>Changing Rooms</li>
                    <li>Water Dispensers</li>
                    <li>Floodlights</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Turfs Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Available Turfs</h2>
            
            {turfsLoading ? (
              <div className="text-center py-12">Loading turfs...</div>
            ) : turfs?.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-lg">No turfs available at this venue yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {turfs?.map(turf => (
                  <TurfCard key={turf.id} turf={turf} venueId={venue.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VenueDetail;
