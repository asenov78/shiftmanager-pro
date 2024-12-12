import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Create admin user on component mount
    const createAdminUser = async () => {
      try {
        // Check for existing admin users first
        const { data: existingUsers, error: queryError } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('role', 'Admin')
          .single();

        if (queryError && !queryError.message.includes('No rows found')) {
          console.error('Error checking for admin:', queryError);
          return;
        }

        // If admin exists, don't try to create one
        if (existingUsers?.id) {
          console.log('Admin user already exists');
          return;
        }

        const adminEmail = 'admin.user@example.com';
        const adminPassword = 'admin123';

        // Since we know admin doesn't exist, try to create one
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: adminEmail,
          password: adminPassword,
          options: {
            data: {
              name: 'Admin User'
            }
          }
        });

        if (signUpError) {
          console.error('Error in signup process:', signUpError);
          
          if (signUpError.message.includes('rate limit')) {
            toast.error('Too many attempts. Please wait a few minutes before trying again.');
          } else {
            toast.error('Failed to create admin user. Please try again later.');
          }
          return;
        }

        if (signUpData.user) {
          const { error: adminError } = await supabase.rpc('make_user_admin', {
            user_id: signUpData.user.id
          });

          if (adminError) {
            console.error('Error setting admin role:', adminError);
            toast.error('Failed to set admin role');
            return;
          }

          toast.success('Admin user created successfully');
        }
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