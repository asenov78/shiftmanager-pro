import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthStateChange = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, "Session:", session?.user?.email);
        
        if (event === 'SIGNED_IN' && session) {
          if (session.user) {
            try {
              // First delete any existing session for this user
              await supabase
                .from('active_sessions')
                .delete()
                .eq('user_id', session.user.id);

              // Then create a new session
              const { error: sessionError } = await supabase
                .from('active_sessions')
                .insert([{ user_id: session.user.id }]);
              
              if (sessionError) {
                console.error("Error creating session record:", sessionError);
                handleSessionError(sessionError);
                return;
              }
            } catch (error) {
              console.error("Error creating session record:", error);
              handleError(error);
              return;
            }
          }
          
          navigate("/dashboard", { replace: true });
          toast.success("Welcome back!", {
            description: "You've successfully signed in to your account."
          });
        } else if (event === 'SIGNED_OUT') {
          toast.info("Signed out", {
            description: "You've been successfully signed out. See you soon!"
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);
};

const handleSessionError = (error: any) => {
  if (error.message?.includes('body stream already')) {
    toast.error("Connection problem", {
      description: "Please refresh your browser and try signing in again."
    });
    return;
  }

  if (error.message?.includes('invalid_credentials')) {
    toast.error("Authentication failed", {
      description: "Your credentials appear to be invalid. Please try again."
    });
    return;
  }
  
  toast.error("Session error", {
    description: "We couldn't complete the login process. Please try again."
  });
};

const handleError = (error: unknown) => {
  if (error instanceof Error) {
    if (error.message?.includes('body stream already')) {
      toast.error("Connection issue", {
        description: "Please refresh the page and try signing in again."
      });
      return;
    }
    
    if (error.message?.includes('invalid_credentials')) {
      toast.error("Invalid credentials", {
        description: "Please check your login details and try again."
      });
      return;
    }
  }
  
  toast.error("Login error", {
    description: "We couldn't complete your sign-in. Please try again later."
  });
};