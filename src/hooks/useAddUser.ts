import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
import { toast } from "sonner";
import { useUserAuth } from "./useUserAuth";
import { useQueryClient } from "@tanstack/react-query";

export const useAddUser = () => {
  const { checkAdminStatus, getCurrentSession } = useUserAuth();
  const queryClient = useQueryClient();

  const handleAddUser = async (newUser: Omit<User, 'id' | 'created_at'> & { password?: string }) => {
    try {
      const session = await getCurrentSession();
      await checkAdminStatus(session.user.id);

      if (!newUser.password) {
        throw new Error("Password is required for new users");
      }

      // Verify department exists before proceeding
      if (newUser.department) {
        const { data: departmentExists, error: deptError } = await supabase
          .from('departments')
          .select('name')
          .eq('name', newUser.department)
          .single();

        if (deptError || !departmentExists) {
          throw new Error("Selected department does not exist");
        }
      }

      // Create the user with auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            full_name: newUser.full_name,
            department: newUser.department,
            role: newUser.role || 'Employee',
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("User creation failed");

      // Update the profile with additional information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: newUser.full_name,
          role: newUser.role || 'Employee',
          department: newUser.department,
          email: newUser.email,
        })
        .eq('id', data.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        throw new Error("Failed to update user profile");
      }

      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success("User added successfully");
    } catch (error: any) {
      console.error("Error adding user:", error);
      toast.error(error.message || "Failed to add user");
      throw error;
    }
  };

  return handleAddUser;
};