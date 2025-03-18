
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';
import { Turf } from '../types';
import { Badge } from '@/components/ui/badge';

interface TurfCardProps {
  turf: Turf;
  venueId: string;
}

const TurfCard: React.FC<TurfCardProps> = ({ turf, venueId }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1610379230744-2e7cec0fede8?q=80&w=2070&auto=format&fit=crop';
  
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={turf.images?.[0] || defaultImage} 
          alt={turf.name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{turf.name}</CardTitle>
          <Badge className="bg-sportBlue">{turf.sportType}</Badge>
        </div>
        <CardDescription className="flex items-center text-gray-500">
          <Tag className="h-4 w-4 mr-1" />
          ₹{turf.pricePerHour}/hour
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm mb-3 line-clamp-2">{turf.description || 'No description available'}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {turf.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline" className="text-xs">{amenity}</Badge>
          ))}
          {turf.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">+{turf.amenities.length - 3} more</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/venue/${venueId}/turf/${turf.id}`} className="w-full">
          <Button className="w-full bg-sportOrange hover:bg-opacity-90">Book Now</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TurfCard;
