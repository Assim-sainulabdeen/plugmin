import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { Project, TableSchema, User } from "@shared/schema";

// API Response Types
interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

interface ProjectsResponse {
  records: Project[];
  total: number;
}

interface TableSchemasResponse {
  records: TableSchema[];
  total: number;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// Mock API responses for development
const mockApiResponses = {
  "/api/user/projects": {
    status: "success",
    data: {
      records: [
        {
          id: "1",
          projectName: "E-commerce Admin",
          description: "Admin dashboard for managing products and orders",
          dbName: "ecommerce_db",
          host: "localhost",
          port: 5432,
          schemaGenStatus: "completed",
          features: {
            restApi: true,
            formBuilder: true,
            fileUpload: true,
            notifications: true
          },
          themeConfig: {
            mode: "light",
            primary: "blue",
            radius: "0.5rem"
          }
        }
      ],
      total: 1
    }
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Helper function to get mock response
export function getMockResponse(url: string) {
  return mockApiResponses[url as keyof typeof mockApiResponses];
}