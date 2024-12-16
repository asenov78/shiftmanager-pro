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
        toast.error("Only administrators can delete users");
        return;
      }

      // Don't allow admin to delete themselves
      if (id === session.user.id) {
        toast.error("You cannot delete your own account");
        return;
      }

      // First, delete any active sessions for this user
      const { error: sessionDeleteError } = await supabase
        .from('active_sessions')
        .delete()
        .eq('user_id', id);

      if (sessionDeleteError) {
        console.error("Session delete error:", sessionDeleteError);
        throw sessionDeleteError;
      }

      // Then delete any shifts associated with this user
      const { error: shiftsDeleteError } = await supabase
        .from('shifts')
        .delete()
        .eq('user_id', id);

      if (shiftsDeleteError) {
        console.error("Shifts delete error:", shiftsDeleteError);
        throw shiftsDeleteError;
      }

      // Finally delete the user from the profiles table
      const { error: profileDeleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (profileDeleteError) {
        console.error("Profile delete error:", profileDeleteError);
        throw profileDeleteError;
      }

      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success("User deleted successfully");
      
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user");
    }
  };

  return handleDeleteUser;
};