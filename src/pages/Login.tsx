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
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('role')
        .eq('role', 'Admin');

      // Only create admin if no admin exists
      if (!existingUsers || existingUsers.length === 0) {
        const { data, error } = await supabase.auth.signUp({
          email: 'admin@example.com',
          password: 'admin123',
        });

        if (error) {
          console.error('Error creating admin:', error);
          toast.error('Failed to create admin user');
          return;
        }

        if (data.user) {
          // Call the make_user_admin function
          const { error: adminError } = await supabase.rpc('make_user_admin', {
            user_id: data.user.id
          });

          if (adminError) {
            console.error('Error setting admin role:', adminError);
            toast.error('Failed to set admin role');
            return;
          }

          toast.success('Admin user created successfully');
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