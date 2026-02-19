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
import DashboardCollections from "./pages/DashboardCollections";
import DashboardEscrow from "./pages/DashboardEscrow";
import DashboardConditions from "./pages/DashboardConditions";
import DashboardDisbursement from "./pages/DashboardDisbursement";
import DashboardReports from "./pages/DashboardReports";
import DashboardSupport from "./pages/DashboardSupport";

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
                <DashboardCollections />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/escrow"
            element={
              <DashboardLayout>
                <DashboardEscrow />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/conditions"
            element={
              <DashboardLayout>
                <DashboardConditions />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/disbursement"
            element={
              <DashboardLayout>
                <DashboardDisbursement />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/reports"
            element={
              <DashboardLayout>
                <DashboardReports />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/support"
            element={
              <DashboardLayout>
                <DashboardSupport />
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
