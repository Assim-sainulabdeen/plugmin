import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Building, Building2 } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

export default function ProjectTypeSelection() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const updatePreferenceMutation = useMutation({
    mutationFn: async (prefersSingleProject: boolean) => {
      const response = await apiRequest("PATCH", "/api/user/preferences", {
        prefersSingleProject,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setLocation(prefersSingleProject ? "/projects/new" : "/projects");
    },
  });

  const handleSelection = (prefersSingleProject: boolean) => {
    updatePreferenceMutation.mutate(prefersSingleProject);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background/90 to-background relative">
      <div className="absolute inset-0 bg-grid-primary/[0.02] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full space-y-8"
      >
        <div className="text-center space-y-4">
          <motion.h1 
            className="text-4xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to Plugmin, {user.name}!
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            How would you like to use Plugmin?
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-xl border-2 hover:border-primary"
                  onClick={() => handleSelection(true)}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Single Project</CardTitle>
                <CardDescription>
                  Focus on managing one project with a dedicated admin dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    • Dedicated domain for your project
                  </li>
                  <li className="flex items-center gap-2">
                    • Customized dashboard experience
                  </li>
                  <li className="flex items-center gap-2">
                    • Simplified project management
                  </li>
                </ul>
                <Button className="w-full">Select Single Project</Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-xl border-2 hover:border-primary"
                  onClick={() => handleSelection(false)}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Multiple Projects</CardTitle>
                <CardDescription>
                  Manage multiple projects from a central dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    • Switch between different projects
                  </li>
                  <li className="flex items-center gap-2">
                    • Unified management interface
                  </li>
                  <li className="flex items-center gap-2">
                    • Scale across multiple projects
                  </li>
                </ul>
                <Button className="w-full">Select Multiple Projects</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}