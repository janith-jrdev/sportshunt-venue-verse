
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllVenues, searchVenues } from '../services/dataService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VenueCard from '../components/VenueCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, MapPin } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SportType } from '../types';

const VenueFilter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  
  const { data: venues, isLoading, error } = useQuery({
    queryKey: ['venues', searchQuery],
    queryFn: () => searchQuery ? searchVenues(searchQuery) : getAllVenues()
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will automatically re-run due to the key change
  };
  
  const handleSportFilter = (sport: string) => {
    setSelectedSports(prev => 
      prev.includes(sport)
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };
  
  const filteredVenues = venues?.filter(venue => {
    if (selectedSports.length === 0) return true;
    
    // This is a simplified filter since we don't have turf sport information in the venue
    // In a real app, we'd query turfs by venue and check their sport types
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Find Sports Venues</h1>
          
          <div className="grid md:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <Card className="md:col-span-1">
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4 flex items-center">
                  <Filter className="mr-2 h-5 w-5" /> Filters
                </h2>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Sports</h3>
                  <div className="space-y-2">
                    {Object.values(SportType).map(sport => (
                      <div key={sport} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`sport-${sport}`}
                          checked={selectedSports.includes(sport)}
                          onCheckedChange={() => handleSportFilter(sport)}
                        />
                        <Label htmlFor={`sport-${sport}`}>{sport}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Location</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <Input placeholder="Enter location" />
                  </div>
                  <Button className="w-full bg-sportBlue hover:bg-opacity-90">Apply Filter</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    placeholder="Search for venues by name, location..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Button 
                    type="submit"
                    className="absolute right-0 top-0 h-full rounded-l-none bg-sportBlue hover:bg-opacity-90"
                  >
                    Search
                  </Button>
                </div>
              </form>
              
              {/* Results */}
              {isLoading ? (
                <div className="text-center py-12">Loading venues...</div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">Failed to load venues</div>
              ) : filteredVenues?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg">No venues found for your search criteria.</p>
                  <p className="text-gray-500">Try adjusting your filters or search term.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredVenues?.map(venue => (
                    <VenueCard key={venue.id} venue={venue} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VenueFilter;
