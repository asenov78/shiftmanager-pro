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

      // Check if user is admin or updating their own profile
      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (currentUserProfile?.role !== 'Admin' && session.user.id !== editingUser.id) {
        toast.error("You can only update your own profile");
        return;
      }

      // First verify that the department exists if it's being updated
      if (newUserData.department) {
        const { data: departmentExists, error: deptError } = await supabase
          .from('departments')
          .select('name')
          .eq('name', newUserData.department)
          .single();

        if (deptError || !departmentExists) {
          toast.error("Selected department does not exist");
          return;
        }
      }

      // If user is not an admin, they can't change their role
      if (currentUserProfile?.role !== 'Admin' && newUserData.role !== editingUser.role) {
        toast.error("Only administrators can change user roles");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: newUserData.full_name,
          role: currentUserProfile?.role === 'Admin' ? newUserData.role : editingUser.role,
          department: newUserData.department,
          email: newUserData.email,
        })
        .eq('id', editingUser.id);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success("User updated successfully");
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user");
    }
  };

  return handleUpdateUser;
};