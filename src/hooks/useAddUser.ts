import { supabase } from "@/integrations/supabase/client";
import { NewUser } from "@/types/user";
import { toast } from "sonner";
import { useUserAuth } from "./useUserAuth";
import { useQueryClient } from "@tanstack/react-query";

export const useAddUser = () => {
  const { checkAdminStatus, getCurrentSession } = useUserAuth();
  const queryClient = useQueryClient();

  const handleAddUser = async (newUser: NewUser) => {
    try {
      const session = await getCurrentSession();
      await checkAdminStatus(session.user.id);

      if (!newUser.password) {
        toast.error("Password is required for new users");
        return;
      }

      // First, create the auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            full_name: newUser.full_name,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("Failed to create user");

      // Then update the profile with additional information
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: newUser.full_name,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authData.user.id);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success("User added successfully");
    } catch (error: any) {
      console.error("Error adding user:", error);
      toast.error(error.message || "Failed to add user");
    }
  };

  return handleAddUser;
};