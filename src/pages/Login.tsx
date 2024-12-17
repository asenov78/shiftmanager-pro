import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          toast.error("Unable to verify your session. Please try again.", {
            description: "If this persists, please contact support."
          });
          return;
        }
        
        if (session) {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Session check error:", error);
        toast.error("System error occurred", {
          description: "We're looking into this. Please try again later."
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

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
                toast.error("Session initialization failed", {
                  description: "Your login was successful, but we couldn't initialize your session properly."
                });
                return;
              }
            } catch (error) {
              console.error("Error creating session record:", error);
              toast.error("Session initialization failed", {
                description: "Please try signing in again. If the problem persists, contact support."
              });
              return;
            }
          }
          
          navigate("/dashboard", { replace: true });
          toast.success("Welcome back!", {
            description: "You've successfully signed in to your account."
          });
        } else if (event === 'SIGNED_OUT') {
          toast.info("You've been signed out", {
            description: "Come back soon!"
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#2563eb',
                  brandAccent: '#1d4ed8',
                }
              }
            }
          }}
          theme="light"
          providers={[]}
          redirectTo={`${window.location.origin}/dashboard`}
          onlyThirdPartyProviders={false}
          magicLink={false}
          view="sign_in"
          showLinks={false}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Sign in',
                loading_button_label: 'Signing in...',
              }
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;