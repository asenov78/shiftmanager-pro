import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
import { toast } from "sonner";
import { useUserAuth } from "./useUserAuth";

export const useUpdateUser = () => {
  const { getCurrentSession } = useUserAuth();

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

      const { error } = await supabase
        .from('profiles')
        .update({
          name: newUserData.name,
          role: newUserData.role,
          department: newUserData.department,
        })
        .eq('id', editingUser.id);

      if (error) throw error;
      
      toast.success("User updated successfully");
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user");
      throw error;
    }
  };

  return handleUpdateUser;
};