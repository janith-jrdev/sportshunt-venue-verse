
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { createVenue } from '@/services/dataService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Image, Plus } from 'lucide-react';

const AddVenue = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    googleMapsLink: '',
    images: [] as string[]
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // For demo purposes, we'll use a placeholder image
  const [tempImage, setTempImage] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddImage = () => {
    if (tempImage) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), tempImage]
      }));
      setTempImage('');
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a venue');
      return;
    }
    
    if (!user.isHost) {
      toast.error('Only hosts can create venues');
      return;
    }
    
    if (!formData.name || !formData.address) {
      toast.error('Venue name and address are required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newVenue = await createVenue({
        name: formData.name,
        address: formData.address,
        description: formData.description,
        googleMapsLink: formData.googleMapsLink,
        images: formData.images.length > 0 ? formData.images : undefined,
        hostId: user.id
      });
      
      toast.success('Venue created successfully!');
      // Navigate to add-turf page for this venue
      navigate(`/host/venue/${newVenue.id}/create-turf`);
    } catch (error) {
      console.error('Failed to create venue:', error);
      toast.error('Failed to create venue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow container mx-auto py-8 px-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Plus size={20} /> Add New Venue
            </CardTitle>
            <CardDescription>
              Create a new venue for players to book
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Venue Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Venue Name*</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Sports Arena"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* Venue Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-1">
                  <MapPin size={16} /> Address*
                </Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="e.g., 123 Sports Lane, Sports City"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your venue and what makes it special..."
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>
              
              {/* Google Maps Link */}
              <div className="space-y-2">
                <Label htmlFor="googleMapsLink">Google Maps Link</Label>
                <Input
                  id="googleMapsLink"
                  name="googleMapsLink"
                  placeholder="e.g., https://maps.google.com/?q=..."
                  value={formData.googleMapsLink}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">
                  Paste a Google Maps link to help players find your venue
                </p>
              </div>
              
              {/* Images */}
              <div className="space-y-3">
                <Label className="flex items-center gap-1">
                  <Image size={16} /> Venue Images
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
                    <Plus size={16} className="mr-1" /> Add
                  </Button>
                </div>
                
                {formData.images && formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Venue image ${index + 1}`}
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
                    No images added yet. Add some to showcase your venue.
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/host/dashboard')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading || !formData.name || !formData.address}
              >
                {isLoading ? 'Creating...' : 'Create Venue'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default AddVenue;
