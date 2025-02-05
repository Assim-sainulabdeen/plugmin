import { Switch, Route, Router } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import OnboardingPage from "@/pages/Onboarding";
import ProjectCreation from "@/pages/ProjectCreation";
import ProjectsPage from "@/pages/projects-page";
import ProjectDetailsPage from "@/pages/project-details-page";
import ForgotPassword from "@/pages/ForgotPassword";
import { ProtectedRoute } from "./lib/protected-route";

function UserRouter() {
  return (
    <Router base="/">
      <Route path="/auth" component={AuthPage} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <ProtectedRoute path="/onboarding" component={OnboardingPage} />
      <ProtectedRoute path="/projects/new" component={ProjectCreation} />
      <ProtectedRoute path="/projects" component={ProjectsPage} />
      <ProtectedRoute path="/projects/:id" component={ProjectDetailsPage} />
      <ProtectedRoute path="/" component={ProjectsPage} />
      <Route path="/not-found" component={NotFound} />
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserRouter />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
