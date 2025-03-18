
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VenueFilter from "./pages/VenueFilter";
import VenueDetail from "./pages/VenueDetail";
import TurfDetail from "./pages/TurfDetail";
import HostDashboard from "./pages/host/HostDashboard";

// Protected Route Component
const ProtectedRoute = ({ 
  children, 
  requiresAuth = true,
  requiresHost = false,
}: { 
  children: React.ReactNode;
  requiresAuth?: boolean;
  requiresHost?: boolean;
}) => {
  const { user, isLoading } = useAuth();
  
  // Wait until auth is checked
  if (isLoading) {
    return <div>Loading authentication...</div>;
  }
  
  // If auth is required and user is not logged in
  if (requiresAuth && !user) {
    return <Navigate to="/login" />;
  }
  
  // If host role is required and user is not a host
  if (requiresHost && (!user || !user.isHost)) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/venue-filter" element={<VenueFilter />} />
            <Route path="/venue/:venueId" element={<VenueDetail />} />
            <Route path="/venue/:venueId/turf/:turfId" element={<TurfDetail />} />
            
            {/* Protected Host Routes */}
            <Route 
              path="/host/dashboard" 
              element={
                <ProtectedRoute requiresAuth requiresHost>
                  <HostDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
