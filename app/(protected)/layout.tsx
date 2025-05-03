"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, AuthContext } from "@/context/AuthContent";
import { useContext } from "react";
import { Spinner } from "@/components/ui/spinner";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not authenticated
      router.push("/login");
    }
  }, [user, loading, router]);

  // Show loading state only during initial authentication check
  // Don't show loading if we know the user is not authenticated
  if (loading && user === undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center bg-background/50 p-6 rounded-lg shadow-sm">
          <Spinner size="lg" />
          <p className="mt-4 text-foreground font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  return user ? <>{children}</> : null;
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
