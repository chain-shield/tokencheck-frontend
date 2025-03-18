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

  // Show nothing while checking authentication
  if (loading) return <div>Loading...</div>;
  
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