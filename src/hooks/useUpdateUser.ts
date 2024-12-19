import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/database";
import { toast } from "sonner";
import { useUserAuth } from "./useUserAuth";
import { useQueryClient } from "@tanstack/react-query";

export const useUpdateUser = () => {
  const { getCurrentSession } = useUserAuth();
  const queryClient = useQueryClient();

  const handleUpdateUser = async (editingUser: Profile, newUserData: Partial<Profile>) => {
    try {
      const session = await getCurrentSession();
      if (!session) {
        toast.error("You must be logged in to update users");
        return;
      }

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

      // If department is being updated, verify it exists or is being cleared
      if (newUserData.department !== undefined) {
        if (newUserData.department) {
          console.log('Verifying department:', newUserData.department);
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
      }

      // If user is not an admin, they can't change their role
      if (currentUserProfile?.role !== 'Admin' && newUserData.role !== editingUser.role) {
        toast.error("Only administrators can change user roles");
        return;
      }

      console.log('Updating profile with data:', {
        full_name: newUserData.full_name,
        role: currentUserProfile?.role === 'Admin' ? newUserData.role : editingUser.role,
        department: newUserData.department,
        email: newUserData.email,
      });

      // Update the profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: newUserData.full_name,
          role: currentUserProfile?.role === 'Admin' ? newUserData.role : editingUser.role,
          department: newUserData.department,
          email: newUserData.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id);

      if (updateError) throw updateError;
      
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success("User updated successfully");
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user");
    }
  };

  return handleUpdateUser;
};