import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
// import PaymentGateway from "./pages/PaymentGateway";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import PaymentError from "./pages/PaymentError";
import ContactSupport from "./pages/ContactSupport";
import NotFound from "./pages/NotFound";
import PaymentGateway from "./pages/PaymentGateway";

/**
 * Initialize React Query client for managing server state
 * This handles caching, background updates, and error handling for API calls
 */
const queryClient = new QueryClient();

/**
 * Main App Component - Root component that sets up the entire application
 * Provides routing, state management, and UI providers to all child components
 */
const App = () => (
  // Wrap entire app with React Query provider for data fetching capabilities
  <QueryClientProvider client={queryClient}>
    {/* Provide tooltip functionality throughout the app */}
    <TooltipProvider>
      {/* Setup toast notifications - two different types for flexibility */}
      <Toaster />
      <Sonner />
      
      {/* Setup client-side routing for the single-page application */}
      <BrowserRouter>
        <Routes>
          {/* Main landing page - displays service selection grid */}
          <Route path="/" element={<Index />} />
          <Route path="/make-payment" element={<PaymentGateway />} />
          {/* Payment flow routes - handle different stages of payment process */}
          <Route path="/payment/gateway" element={<PaymentGateway />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />
          <Route path="/payment/error" element={<PaymentError />} />
          
          {/* Support system route - handles customer service tickets */}
          <Route path="/support" element={<ContactSupport />} />
          
          {/* Catch-all route - displays 404 page for invalid URLs */}
          {/* IMPORTANT: Keep this as the last route to catch unmatched paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
