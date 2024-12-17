import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const [session, setSession] = useState<boolean | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(!!session);
      } catch (error) {
        console.error("Session check error:", error);
        setSession(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const isAuthenticated = !!session;
      setSession(isAuthenticated);
      
      // If user is logged out, clear the query cache and local storage
      if (!isAuthenticated) {
        queryClient.clear();
        localStorage.clear();
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  if (session === null) {
    return null; // Loading state
  }

  return session ? children : <Navigate to="/login" replace />;
};