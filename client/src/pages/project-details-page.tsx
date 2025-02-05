import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Layout } from "@/components/layout";
import { ProjectSchema } from "@/components/project-schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
          <div className="mt-8">
            <Skeleton className="h-[400px]" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load project: {error.message}
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.projectName}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>

        <div className="grid gap-6">
          <ProjectSchema project={project} />
        </div>
      </div>
    </Layout>
  );
}
