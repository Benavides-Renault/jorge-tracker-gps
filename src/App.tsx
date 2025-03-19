
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TrackPage from "./pages/TrackPage";
import TrackingPage from "./pages/TrackingPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import DriverLoginPage from "./pages/DriverLoginPage";
import DriverDashboardPage from "./pages/DriverDashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/tracking/:id" element={<TrackingPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/driver-login" element={<DriverLoginPage />} />
          <Route path="/driver-dashboard" element={<DriverDashboardPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
