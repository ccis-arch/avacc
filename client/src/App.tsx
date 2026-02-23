import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import PetManagement from "./pages/PetManagement";
import PetsList from "./pages/PetsList";
import LocationsMap from "./pages/LocationsMap";
import SchedulingCalendar from "./pages/SchedulingCalendar";
import DataManagement from "./pages/DataManagement";
import { useAuth } from "./_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component, requiredRole }: { component: React.ComponentType<any>, requiredRole?: 'admin' | 'user' }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!user) {
    return <NotFound />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <NotFound />;
  }

  return <Component />;
}

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={() => {
        if (!user) return <NotFound />;
        return user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
      }} />
      <Route path="/admin/dashboard" component={() => <ProtectedRoute component={AdminDashboard} requiredRole="admin" />} />
      <Route path="/pets" component={() => <ProtectedRoute component={PetManagement} />} />
      <Route path="/pets-list" component={() => <ProtectedRoute component={PetsList} requiredRole="admin" />} />
      <Route path="/data-management" component={() => <ProtectedRoute component={DataManagement} />} />
      <Route path="/locations" component={() => <ProtectedRoute component={LocationsMap} />} />
      <Route path="/schedule" component={() => <ProtectedRoute component={SchedulingCalendar} />} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
