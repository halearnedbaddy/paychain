import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardOverview from "./pages/DashboardOverview";
import DashboardSettings from "./pages/DashboardSettings";
import DashboardCompliance from "./pages/DashboardCompliance";
import PlaceholderPage from "./pages/PlaceholderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <DashboardOverview />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <DashboardLayout>
                <DashboardSettings />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/compliance"
            element={
              <DashboardLayout>
                <DashboardCompliance />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/collections"
            element={
              <DashboardLayout>
                <PlaceholderPage title="Collections API" />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/escrow"
            element={
              <DashboardLayout>
                <PlaceholderPage title="Escrow / Hold" />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/conditions"
            element={
              <DashboardLayout>
                <PlaceholderPage title="Conditions" />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/disbursement"
            element={
              <DashboardLayout>
                <PlaceholderPage title="Disbursement" />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/reports"
            element={
              <DashboardLayout>
                <PlaceholderPage title="Reports" />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/support"
            element={
              <DashboardLayout>
                <PlaceholderPage title="Support" />
              </DashboardLayout>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
