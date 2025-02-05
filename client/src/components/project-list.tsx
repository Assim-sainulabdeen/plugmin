import { Project } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, ExternalLink, Trash2, Edit } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ProjectList() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState('grid');

  const { data, isLoading } = useQuery({
    queryKey: ["/api/user/projects"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/user/projects");
      const data = await res.json();
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const res = await apiRequest("DELETE", `/api/projects/${projectId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/projects"] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-2 shadow-md">
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const projects = data?.data.records || [];

  if (projects.length === 0) {
    return (
      <Card className="border-2 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>No projects yet</CardTitle>
          <CardDescription className="text-muted-foreground">
            Create your first project to get started
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
          {viewMode === 'grid' ? 'Switch to List' : 'Switch to Grid'}
        </Button>
      </div>
      <div className={cn(
        "gap-6 animate-in fade-in-50",
        viewMode === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3" : "space-y-4"
      )}>
        {projects.map((project: Project) => (
          <Card
            key={project.id}
            className="group border-2 hover:border-primary/50 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      {project.projectName}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description || "No description"}
                    </CardDescription>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="font-medium">{project.dbName}</span>
                      <span className="mx-2">•</span>
                      <span>{project.host}:{project.port}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLocation(`/projects/${project.id}/edit`)}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLocation(`/projects/${project.id}`)}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this project?')) {
                        deleteMutation.mutate(project.id);
                      }
                    }}
                    className="text-muted-foreground hover:text-destructive transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}