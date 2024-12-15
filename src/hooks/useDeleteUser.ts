import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUserAuth } from "./useUserAuth";
import { useQueryClient } from "@tanstack/react-query";

export const useDeleteUser = () => {
  const { getCurrentSession, checkAdminStatus } = useUserAuth();
  const queryClient = useQueryClient();

  const handleDeleteUser = async (id: string) => {
    try {
      const session = await getCurrentSession();
      
      // Check if user is admin before proceeding
      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (currentUserProfile?.role !== 'Admin') {
        toast.error("Only administrators can deactivate users");
        return;
      }

      // Don't allow admin to deactivate themselves
      if (id === session.user.id) {
        toast.error("You cannot deactivate your own account");
        return;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'Inactive' })
        .eq('id', id);

      if (updateError) throw updateError;
      
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success("User deactivated successfully");
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to deactivate user");
    }
  };

  return handleDeleteUser;
};