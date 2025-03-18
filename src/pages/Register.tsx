
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(name, email, password, isHost);
      toast.success('Registration successful');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
            <CardDescription>
              Join SportHunt to find and book sports venues
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <FormField>
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <Input 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <FormMessage />
                </FormItem>
              </FormField>
              
              <FormField>
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <FormMessage />
                </FormItem>
              </FormField>
              
              <FormField>
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <FormMessage />
                </FormItem>
              </FormField>
              
              <FormField>
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <FormMessage />
                </FormItem>
              </FormField>
              
              <FormField>
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <RadioGroup 
                    defaultValue="player"
                    onValueChange={(value) => setIsHost(value === 'host')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="player" id="player" />
                      <FormLabel htmlFor="player" className="cursor-pointer">Player (Book venues)</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="host" id="host" />
                      <FormLabel htmlFor="host" className="cursor-pointer">Host (List venues)</FormLabel>
                    </div>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              </FormField>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-sportBlue hover:bg-opacity-90"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
              
              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-sportBlue hover:underline">
                  Login here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;
