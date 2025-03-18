
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { getVenueById, createTurf, getDefaultAmenitiesForSport } from '@/services/dataService';
import { SportType } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PlusCircle, ImagePlus, ArrowLeft, Save, Trash2 } from 'lucide-react';

const AddTurf = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { venueId } = useParams<{ venueId: string }>();
  
  const [formData, setFormData] = useState({
    name: '',
    sportType: SportType.FOOTBALL,
    pricePerHour: 1000,
    description: '',
    images: [] as string[],
    amenities: [] as string[]
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [customAmenity, setCustomAmenity] = useState('');
  const [tempImage, setTempImage] = useState('');
  
  // Fetch venue details
  const { data: venue, isLoading: venueLoading } = useQuery({
    queryKey: ['venue', venueId],
    queryFn: () => getVenueById(venueId || ''),
    enabled: !!venueId,
  });
  
  // Update amenities when sport type changes
  useEffect(() => {
    const defaultAmenities = getDefaultAmenitiesForSport(formData.sportType);
    setFormData(prev => ({ ...prev, amenities: defaultAmenities }));
  }, [formData.sportType]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSportTypeChange = (value: string) => {
    const sportType = value as SportType;
    setFormData(prev => ({ 
      ...prev, 
      sportType,
      amenities: getDefaultAmenitiesForSport(sportType)
    }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = Number(value) || 0;
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };
  
  const handleAddAmenity = () => {
    if (customAmenity && !formData.amenities.includes(customAmenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, customAmenity]
      }));
      setCustomAmenity('');
    }
  };
  
  const handleRemoveAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };
  
  const handleAddImage = () => {
    if (tempImage && !formData.images.includes(tempImage)) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, tempImage]
      }));
      setTempImage('');
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a turf');
      return;
    }
    
    if (!user.isHost) {
      toast.error('Only hosts can create turfs');
      return;
    }
    
    if (!venueId) {
      toast.error('Venue ID is required');
      return;
    }
    
    if (!formData.name) {
      toast.error('Turf name is required');
      return;
    }
    
    if (formData.pricePerHour <= 0) {
      toast.error('Price per hour must be greater than 0');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newTurf = await createTurf({
        name: formData.name,
        venueId,
        pricePerHour: formData.pricePerHour,
        sportType: formData.sportType,
        description: formData.description,
        images: formData.images.length > 0 ? formData.images : undefined,
        amenities: formData.amenities
      });
      
      toast.success('Turf added successfully!');
      navigate(`/venue/${venueId}/turf/${newTurf.id}`);
    } catch (error) {
      console.error('Failed to create turf:', error);
      toast.error('Failed to create turf. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (venueLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto py-8 text-center">Loading venue details...</div>
        <Footer />
      </div>
    );
  }
  
  if (!venue) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto py-8 text-center">
          <h2 className="text-xl font-bold mb-4">Venue not found</h2>
          <Button onClick={() => navigate('/host/dashboard')}>Back to Dashboard</Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate(`/host/dashboard`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Turf</h1>
            <p className="text-muted-foreground">to {venue.name}</p>
          </div>
        </div>
        
        <Card className="w-full max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <PlusCircle size={20} /> Create Turf
              </CardTitle>
              <CardDescription>
                Add a new playing area within your venue
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Turf Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Turf Name*</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Football Field A"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* Sport Type */}
              <div className="space-y-2">
                <Label htmlFor="sportType">Sport Type*</Label>
                <Select 
                  value={formData.sportType} 
                  onValueChange={handleSportTypeChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SportType).map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Price Per Hour */}
              <div className="space-y-2">
                <Label htmlFor="pricePerHour">Price Per Hour (₹)*</Label>
                <Input
                  id="pricePerHour"
                  name="pricePerHour"
                  type="number"
                  min="1"
                  value={formData.pricePerHour}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your turf..."
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>
              
              {/* Amenities */}
              <div className="space-y-3">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 gap-2">
                  {formData.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center justify-between border rounded-md p-2">
                      <span>{amenity}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveAmenity(amenity)}
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add custom amenity"
                    value={customAmenity}
                    onChange={(e) => setCustomAmenity(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddAmenity}
                    variant="outline"
                    className="flex-shrink-0"
                    disabled={!customAmenity}
                  >
                    <PlusCircle size={16} className="mr-1" /> Add
                  </Button>
                </div>
              </div>
              
              {/* Images */}
              <div className="space-y-3">
                <Label className="flex items-center gap-1">
                  <ImagePlus size={16} /> Turf Images
                </Label>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Image URL"
                    value={tempImage}
                    onChange={(e) => setTempImage(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddImage}
                    variant="outline"
                    className="flex-shrink-0"
                    disabled={!tempImage}
                  >
                    <PlusCircle size={16} className="mr-1" /> Add
                  </Button>
                </div>
                
                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Turf image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Image+Error";
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No images added yet. Add some to showcase your turf.
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(`/host/dashboard`)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading || !formData.name || formData.pricePerHour <= 0}
              >
                {isLoading ? 'Creating...' : 'Create Turf'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default AddTurf;
