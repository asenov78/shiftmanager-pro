import { LoginForm } from "@/components/auth/LoginForm";
import { useSessionCheck } from "@/hooks/useSessionCheck";
import { useAuthStateChange } from "@/hooks/useAuthStateChange";

const Login = () => {
  const { isLoading } = useSessionCheck();
  useAuthStateChange();

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
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;