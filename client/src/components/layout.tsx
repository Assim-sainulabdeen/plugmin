import { Toaster } from "@/components/ui/toaster";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-xl font-bold">Plugmin</h1>
        </div>
      </nav>
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
