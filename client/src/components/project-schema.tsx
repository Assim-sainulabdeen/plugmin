import { TableSchema } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, Table } from "lucide-react";
import React from 'react'; // Added import

interface ProjectSchemaProps {
  project: {
    projectName: string;
    dbName: string;
    schema: TableSchema[];
    schemaGenStatus: string;
  };
}

export function ProjectSchema({ project }: ProjectSchemaProps) {
  if (project.schemaGenStatus === "pending") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Schema Generation
          </CardTitle>
          <CardDescription>
            Schema generation is in progress...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Schema
            </CardTitle>
            <CardDescription>
              Schema for {project.dbName}
            </CardDescription>
          </div>
          <Badge variant={project.schemaGenStatus === "completed" ? "success" : "secondary"}>
            {project.schemaGenStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {project.schema.map((table) => (
              <Card key={table.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    {table.tableName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code className="text-sm">
                      {JSON.stringify(table.schema, null, 2)}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}