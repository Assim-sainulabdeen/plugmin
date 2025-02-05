import React, { useState } from 'react';
import { Layout } from "@/components/layout";
import { ProjectList } from "@/components/project-list";
import { ProjectForm } from "@/components/project-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { LayoutGrid } from "lucide-react";
import { List } from "lucide-react";


export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <Layout>
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight font-display bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Projects
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your database projects and schemas
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center space-x-2 border rounded-lg p-1">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Create New Project</SheetTitle>
            </SheetHeader>
            <div className="mt-8">
              <ProjectForm />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      </div>

      <ProjectList />
    </Layout>
  );
}