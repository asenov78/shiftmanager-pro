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
      console.log('Starting user update with data:', newUserData);
      
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

      // Handle department update
      let departmentToSet = newUserData.department;
      if (departmentToSet && departmentToSet !== 'none') {
        console.log('Verifying department:', departmentToSet);
        const { data: departmentExists, error: deptError } = await supabase
          .from('departments')
          .select('name')
          .eq('name', departmentToSet)
          .single();

        if (deptError || !departmentExists) {
          console.error('Department verification error:', deptError);
          toast.error("Selected department does not exist");
          return;
        }
      } else {
        departmentToSet = null;
      }

      // If user is not an admin, they can't change their role
      if (currentUserProfile?.role !== 'Admin' && newUserData.role !== editingUser.role) {
        toast.error("Only administrators can change user roles");
        return;
      }

      const updateData = {
        full_name: newUserData.full_name,
        role: currentUserProfile?.role === 'Admin' ? newUserData.role : editingUser.role,
        department: departmentToSet,
        email: newUserData.email,
        updated_at: new Date().toISOString()
      };

      console.log('Updating profile with data:', updateData);

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', editingUser.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }
      
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success("User updated successfully");
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user");
    }
  };

  return handleUpdateUser;
};