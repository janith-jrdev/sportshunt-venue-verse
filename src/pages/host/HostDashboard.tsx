
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getVenuesByHost } from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Building, ArrowRight, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const HostDashboard = () => {
  const { user } = useAuth();
  
  const { data: venues, isLoading, error } = useQuery({
    queryKey: ['host-venues', user?.id],
    queryFn: () => getVenuesByHost(user?.id || ''),
    enabled: !!user?.id,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Host Dashboard</h1>
          <Link to="/host/create-venue">
            <Button className="bg-sportGreen hover:bg-opacity-90">
              <Plus className="mr-2 h-4 w-4" /> Add New Venue
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Total Venues</CardTitle>
              <CardDescription>Your registered sports venues</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{venues?.length || 0}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Total Turfs</CardTitle>
              <CardDescription>Across all your venues</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {/* This would come from a real API that counts turfs */}
                3
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">This Month's Bookings</CardTitle>
              <CardDescription>Total confirmed bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {/* This would come from a real API that counts bookings */}
                12
              </p>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Your Venues</h2>
        
        {isLoading ? (
          <div className="text-center py-12">Loading your venues...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">Failed to load venues</div>
        ) : venues?.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No venues yet</h3>
              <p className="text-gray-500 mb-6">Start by adding your first sports venue</p>
              <Link to="/host/create-venue">
                <Button className="bg-sportGreen hover:bg-opacity-90">
                  <Plus className="mr-2 h-4 w-4" /> Add New Venue
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {venues?.map(venue => (
              <Card key={venue.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-48 overflow-hidden">
                    <img 
                      src={venue.images?.[0] || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop'} 
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-grow p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{venue.name}</h3>
                        <div className="flex items-center text-gray-500 mb-4">
                          <MapPin className="h-4 w-4 mr-1" />
                          {venue.address}
                        </div>
                      </div>
                      
                      <Link to={`/host/venue/${venue.id}`}>
                        <Button variant="ghost" className="text-sportBlue">
                          Manage <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {venue.description || 'No description provided for this venue.'}
                    </p>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-6">
                        <div>
                          <p className="text-sm text-gray-500">Turfs</p>
                          <p className="font-semibold">3</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Today's Bookings</p>
                          <p className="font-semibold">5</p>
                        </div>
                      </div>
                      
                      <Link to={`/host/venue/${venue.id}/create-turf`}>
                        <Button size="sm" className="bg-sportOrange hover:bg-opacity-90">
                          <Plus className="mr-1 h-4 w-4" /> Add Turf
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default HostDashboard;
