
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { Venue } from '../types';

interface VenueCardProps {
  venue: Venue;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1564147603578-ad477acbc2a7?q=80&w=2070&auto=format&fit=crop';
  
  return (
    <Card className="venue-card h-full flex flex-col">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={venue.images?.[0] || defaultImage} 
          alt={venue.name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-xl">{venue.name}</CardTitle>
        <CardDescription className="flex items-center text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          {venue.address}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm line-clamp-2">{venue.description || 'No description available'}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/venue/${venue.id}`} className="w-full">
          <Button className="w-full bg-sportGreen hover:bg-opacity-90">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default VenueCard;
