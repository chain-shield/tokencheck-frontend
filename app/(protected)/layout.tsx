"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, AuthContext } from "@/context/AuthContent";
import { useContext } from "react";

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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
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
    <AuthGuard>{children}</AuthGuard>
  );
}