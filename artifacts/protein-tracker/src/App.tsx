import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Loader2 } from "lucide-react";

// Pages
import LoginPage from "@/pages/LoginPage";
import LandingPage from "@/pages/LandingPage";
import OnboardingPage from "@/pages/OnboardingPage";
import DashboardPage from "@/pages/DashboardPage";
import LogFoodPage from "@/pages/LogFoodPage";
import HistoryPage from "@/pages/HistoryPage";
import InsightsPage from "@/pages/InsightsPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading, error: profileError } = useProfile();
  const [location] = useLocation();

  // Only show loading while auth is resolving
  // Don't block on profileLoading if there's an error — treat error as "no profile"
  if (authLoading || (profileLoading && !profileError)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  // If user is authenticated but has no profile, force onboarding
  // UNLESS they are already on the onboarding page
  if (!profile && location !== "/onboarding") {
    return <Redirect to="/onboarding" />;
  }

  return <Component />;
}

// At the root "/" show landing page for visitors, dashboard for logged-in users
function SmartHome() {
  const { user, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading, error: profileError } = useProfile();

  if (authLoading || (profileLoading && !profileError)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <LandingPage />;
  if (!profile) return <Redirect to="/onboarding" />;
  return <DashboardPage />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/" component={SmartHome} />
      <Route path="/onboarding" component={() => <ProtectedRoute component={OnboardingPage} />} />
      <Route path="/log" component={() => <ProtectedRoute component={LogFoodPage} />} />
      <Route path="/history" component={() => <ProtectedRoute component={HistoryPage} />} />
      <Route path="/insights" component={() => <ProtectedRoute component={InsightsPage} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={ProfilePage} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
