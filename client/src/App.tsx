import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Courses from "@/pages/courses";
import IDE from "@/pages/ide";
import Leaderboard from "@/pages/leaderboard";
import SignIn from "@/pages/signin";
import SignUp from "@/pages/signup";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public routes accessible without authentication */}
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      
      {/* Authentication-based routing */}
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/courses" component={Courses} />
          <Route path="/ide" component={IDE} />
          <Route path="/leaderboard" component={Leaderboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[var(--space-900)] text-white">
        <Toaster />
        <Router />
      </div>
    </TooltipProvider>
  );
}

export default App;
