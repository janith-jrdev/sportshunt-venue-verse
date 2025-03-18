
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllVenues } from '../services/dataService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VenueCard from '../components/VenueCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { data: venues, isLoading, error } = useQuery({
    queryKey: ['venues'],
    queryFn: getAllVenues
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-sportBlue text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find and Book Sports Venues</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Discover the perfect sports venues and turfs for your games. 
            Easy booking, instant confirmation.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search for venues..." 
                className="pl-10 py-6 bg-white text-black w-full rounded-full"
              />
            </div>
            <Link to="/venue-filter">
              <Button size="lg" className="bg-sportOrange hover:bg-opacity-90 rounded-full">
                Search
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Venues */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Popular Venues</h2>
            <Link to="/venue-filter">
              <Button variant="ghost" className="text-sportBlue">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">Loading venues...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">Failed to load venues</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues?.map(venue => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Sports Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Browse by Sport</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Football', 'Cricket', 'Basketball', 'Tennis', 'Badminton', 'Volleyball'].map(sport => (
              <div key={sport} className="text-center">
                <div className="bg-gray-100 rounded-full p-6 mb-4 mx-auto w-24 h-24 flex items-center justify-center">
                  <img 
                    src={`https://via.placeholder.com/150?text=${sport}`} 
                    alt={sport} 
                    className="w-12 h-12"
                  />
                </div>
                <h3 className="font-medium">{sport}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Host CTA */}
      <section className="py-16 bg-sportGreen text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Own a Sports Venue?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            List your venue on SportHunt and reach thousands of sports enthusiasts looking for places to play.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-sportGreen hover:bg-gray-100">
              Become a Host
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
