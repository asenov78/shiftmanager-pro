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
        // First check if admin exists
        const { data: existingAdmins } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'Admin')
          .limit(1);

        if (existingAdmins && existingAdmins.length > 0) {
          console.log('Admin user already exists');
          return;
        }

        // Check if the email is already registered
        const adminEmail = 'admin.user@example.com';
        const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
        
        if (getUserError) {
          console.error('Error checking existing users:', getUserError);
          return;
        }

        const existingUser = users?.find(user => user.email === adminEmail);
        if (existingUser) {
          console.log('Admin email already registered');
          return;
        }

        // Create admin user if it doesn't exist
        const { error: signUpError } = await supabase.auth.signUp({
          email: adminEmail,
          password: 'admin123',
          options: {
            data: {
              full_name: 'Admin User'
            }
          }
        });

        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            console.log('Admin user already exists');
            return;
          }
          throw signUpError;
        }

        toast.success('Admin user created successfully. Please check email for verification.');
      } catch (error: any) {
        console.error('Error in admin creation process:', error);
        if (error.message.includes('rate limit')) {
          toast.error('Please wait a few minutes before trying again');
        } else if (!error.message.includes('already registered')) {
          toast.error('Error creating admin user');
        }
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