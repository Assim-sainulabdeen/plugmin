import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";

// Icons
import { Building2, Building } from "lucide-react";

export default function OnboardingPage() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);

  const form = useForm({
    defaultValues: {
      projectMode: "single",
    },
  });

  const onSubmit = async (data: any) => {
    // Update user preferences
    try {
      await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prefersSingleProject: data.projectMode === "single" }),
      });

      // Navigate to project creation
      navigate("/projects/new");
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Welcome to Plugmin</CardTitle>
            <CardDescription>
              Let's set up your workspace. How would you like to manage your projects?
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                <FormField
                  control={form.control}
                  name="projectMode"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div>
                            <RadioGroupItem
                              value="single"
                              id="single"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="single"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <Building2 className="mb-3 h-6 w-6" />
                              <div className="text-center">
                                <h3 className="font-semibold">Single Project</h3>
                                <p className="text-sm text-muted-foreground">
                                  Focus on one project at a time
                                </p>
                              </div>
                            </Label>
                          </div>

                          <div>
                            <RadioGroupItem
                              value="multiple"
                              id="multiple"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="multiple"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <Building className="mb-3 h-6 w-6" />
                              <div className="text-center">
                                <h3 className="font-semibold">Multiple Projects</h3>
                                <p className="text-sm text-muted-foreground">
                                  Manage multiple projects
                                </p>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter>
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
}