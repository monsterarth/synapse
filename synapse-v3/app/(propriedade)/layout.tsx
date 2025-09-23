// /app/(propriedade)/layout.tsx

import { AuthGuard } from "@/components/auth/auth-guard";
import { Sidebar } from "@/components/propriedade/sidebar";

export default function PropertyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen w-full bg-white dark:bg-gray-950">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}