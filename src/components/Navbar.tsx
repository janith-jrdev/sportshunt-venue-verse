
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Plus, List, Search } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-sportBlue text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold">
              SportHunt
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-sportOrange transition-colors">
                Home
              </Link>
              <Link to="/venue-filter" className="hover:text-sportOrange transition-colors">
                Find Venues
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.isHost && (
                  <Link to="/host/dashboard">
                    <Button variant="ghost" className="text-white hover:text-sportOrange">
                      Host Dashboard
                    </Button>
                  </Link>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:text-sportOrange">
                      <User className="h-5 w-5 mr-2" />
                      {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:text-sportOrange">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-sportOrange text-white hover:bg-opacity-90">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
