import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const LoginForm = () => {
  return (
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
  );
};