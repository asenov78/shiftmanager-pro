import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
import { toast } from "sonner";
import { useUserAuth } from "./useUserAuth";
import { useQueryClient } from "@tanstack/react-query";

export const useUpdateUser = () => {
  const { getCurrentSession } = useUserAuth();
  const queryClient = useQueryClient();

  const handleUpdateUser = async (editingUser: User, newUserData: Partial<User>) => {
    try {
      const session = await getCurrentSession();

      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (currentUserProfile?.role !== 'Admin' && session.user.id !== editingUser.id) {
        throw new Error("Unauthorized to update this user");
      }

      // First verify that the department exists
      const { data: departmentExists } = await supabase
        .from('departments')
        .select('name')
        .eq('name', newUserData.department)
        .single();

      if (!departmentExists) {
        throw new Error("Selected department does not exist");
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: newUserData.full_name,
          role: newUserData.role,
          department: newUserData.department,
        })
        .eq('id', editingUser.id);

      if (error) throw error;
      
      // Invalidate queries to trigger a refresh
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success("User updated successfully");
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user");
      throw error;
    }
  };

  return handleUpdateUser;
};