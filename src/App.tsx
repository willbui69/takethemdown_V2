
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { ErrorBoundary } from "@/components/utils/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ReportingResources from "./pages/ReportingResources";
import RansomwareMonitor from "./pages/RansomwareMonitor";
import SubscriptionManage from "./pages/SubscriptionManage";
import UnsubscribePage from "./pages/UnsubscribePage";
import ScrollToTop from "./components/utils/ScrollToTop";

console.log('App.tsx: Loading App component');

// Move queryClient inside the App component to fix the hooks error
const App = () => {
  console.log('App.tsx: Initializing App component');
  
  // Create a new QueryClient for each App instance
  const [queryClient] = useState(() => {
    console.log('App.tsx: Creating QueryClient');
    return new QueryClient({
      defaultOptions: {
        queries: {
          retry: 3,
          staleTime: 1000 * 60 * 5, // 5 minutes
        },
      },
    });
  });

  console.log('App.tsx: Rendering App with all providers');

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/reporting" element={<ReportingResources />} />
              <Route path="/ransomware" element={<RansomwareMonitor />} />
              <Route path="/subscription" element={<SubscriptionManage />} />
              <Route path="/unsubscribe" element={<UnsubscribePage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
