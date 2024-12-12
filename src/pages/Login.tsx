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
        // First try to sign in as admin
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: 'admin.user@example.com',
          password: 'admin123'
        });

        // If sign in succeeds, we're done
        if (!signInError) {
          return;
        }

        // Check for existing admin users first
        const { data: existingUsers, error: queryError } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('role', 'Admin');

        if (queryError) {
          console.error('Error checking for admin:', queryError);
          return;
        }

        // If admin exists, don't try to create one
        if (existingUsers && existingUsers.length > 0) {
          console.log('Admin user already exists');
          return;
        }

        const adminEmail = 'admin.user@example.com';
        const adminPassword = 'admin123';

        // Add a delay before signup attempt to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));

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
            toast.error('Too many attempts. Please try again in a few minutes.');
            return;
          }
          
          toast.error('Failed to create admin user. Please try again later.');
          return;
        }

        if (signUpData.user) {
          // Wait a brief moment to ensure the profile trigger has completed
          await new Promise(resolve => setTimeout(resolve, 1000));
          
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