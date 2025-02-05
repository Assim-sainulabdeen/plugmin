import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Database, Server, Key, Globe, Folder, LayoutDashboard } from "lucide-react";

export function ProjectForm() {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      driver: "postgres",
      sslMode: "disable",
      schema: "public",
      port: 5432,
      host: "localhost"
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: Parameters<typeof insertProjectSchema.parse>[0]) => {
      const res = await apiRequest("POST", "/api/projects/register", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/projects"] });
      toast({
        title: "Success",
        description: "Project created and database schema analyzed successfully",
      });
      form.reset();
      setLocation('/projects');
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Connect Database
              </h2>
              <p className="text-muted-foreground">
                Connect to your existing database to generate an admin dashboard
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dashboard Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Folder className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input {...field} className="pl-10" placeholder="Name your admin dashboard" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Database className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input {...field} className="pl-10" placeholder="Describe the purpose of this admin dashboard" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent">
            Database Connection Details
          </h3>
          <p className="text-sm text-muted-foreground">
            Provide your database credentials to analyze the schema and generate the admin interface
          </p>

          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="driver"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Database Type</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Database className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <select 
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="postgres">PostgreSQL</option>
                          <option value="mysql">MySQL</option>
                        </select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dbName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Database Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Database className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input {...field} className="pl-10" placeholder="Enter database name" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input {...field} className="pl-10" placeholder="Database username" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input type="password" {...field} className="pl-10" placeholder="Database password" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Host</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input {...field} className="pl-10" placeholder="Database host" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Server className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input 
                          type="number" 
                          {...field} 
                          className="pl-10" 
                          placeholder="Database port"
                          onChange={e => field.onChange(parseInt(e.target.value))} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="schema"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schema</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Database className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input {...field} className="pl-10" placeholder="Database schema (e.g., public)" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300" 
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Analyzing Schema..." : "Generate Admin Dashboard"}
        </Button>
      </form>
    </Form>
  );
}