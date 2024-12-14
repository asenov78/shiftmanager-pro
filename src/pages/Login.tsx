import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const createAdminUser = async () => {
      try {
        const { data: existingUsers, error: queryError } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('role', 'Admin');

        if (queryError) {
          console.error('Error checking for admin:', queryError);
          return;
        }

        if (existingUsers && existingUsers.length > 0) {
          console.log('Admin user already exists');
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        const adminEmail = 'admin.user@example.com';
        const adminPassword = 'admin123';

        const { error: signUpError } = await supabase.auth.signUp({
          email: adminEmail,
          password: adminPassword,
          options: {
            data: {
              full_name: 'Admin User'
            }
          }
        });

        if (signUpError) {
          // If the error is not "user already exists", then show the error
          if (!signUpError.message.includes('already registered')) {
            console.error('Error in signup process:', signUpError);
            if (signUpError.message.includes('rate limit')) {
              toast.error('Rate limit reached. Please try again in a few minutes.');
            } else {
              toast.error('Failed to create admin user. Please try again later.');
            }
          }
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success('Admin user created successfully');

      } catch (error) {
        console.error('Error in admin creation process:', error);
        toast.error('An error occurred during admin setup');
      }
    };

    createAdminUser();
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/dashboard");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

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
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Login;