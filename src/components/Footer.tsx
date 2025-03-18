
import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-sportGreen" /> SportHunt
            </h3>
            <p className="text-gray-400">
              Find and book sports venues and turfs easily. Host your venue and grow your business.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-sportGreen transition-colors">Home</Link></li>
              <li><Link to="/venue-filter" className="text-gray-400 hover:text-sportGreen transition-colors">Find Venues</Link></li>
              <li><Link to="/host/dashboard" className="text-gray-400 hover:text-sportGreen transition-colors">Host Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-sportGreen transition-colors flex items-center"><Mail className="h-4 w-4 mr-2" /> Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-sportGreen transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-sportGreen transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-sportGreen transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-sportOrange transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-sportBlue transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-10 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SportHunt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
