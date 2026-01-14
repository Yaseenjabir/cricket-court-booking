import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Layouts
import CustomerLayout from "./components/layout/CustomerLayout";
import AdminLayout from "./components/layout/AdminLayout";

// Customer Pages
import Index from "./pages/Index";
import Courts from "./pages/Courts";
import Booking from "./pages/Booking";
import BookingDetails from "./pages/BookingDetails";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCalendar from "./pages/admin/AdminCalendar";
import AdminCourts from "./pages/admin/AdminCourts";
import AdminPricing from "./pages/admin/AdminPricing";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminNewBooking from "./pages/admin/AdminNewBooking";
import AdminPromos from "./pages/admin/AdminPromos";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import ScrollToTop from "./pages/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Customer Routes */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/courts" element={<Courts />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking/details" element={<BookingDetails />} />
            <Route path="/booking/payment" element={<Payment />} />
            <Route path="/booking/confirmation" element={<Confirmation />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="calendar" element={<AdminCalendar />} />
            <Route path="courts" element={<AdminCourts />} />
            <Route path="pricing" element={<AdminPricing />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="bookings/new" element={<AdminNewBooking />} />
            <Route path="promos" element={<AdminPromos />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
