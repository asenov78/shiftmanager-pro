import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSessionCheck = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          if (error.message?.includes('body stream already')) {
            toast.error("Connection issue detected", {
              description: "Please refresh the page and try again."
            });
            return;
          }
          
          toast.error("Session verification failed", {
            description: "Please try signing in again."
          });
          return;
        }
        
        if (session) {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Session check error:", error);
        
        if (error instanceof Error) {
          if (error.message?.includes('body stream already')) {
            toast.error("Connection problem", {
              description: "Please refresh your browser and try again."
            });
            return;
          }
        }
        
        toast.error("Authentication error", {
          description: "We couldn't verify your session. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  return { isLoading };
};