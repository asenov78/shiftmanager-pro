import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUserAuth } from "./useUserAuth";

export const useDeleteUser = () => {
  const { getCurrentSession, checkAdminStatus } = useUserAuth();

  const handleDeleteUser = async (id: string) => {
    try {
      const session = await getCurrentSession();
      await checkAdminStatus(session.user.id);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'Inactive' })
        .eq('id', id);

      if (updateError) throw updateError;
      
      toast.success("User deactivated successfully");
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user");
      throw error;
    }
  };

  return handleDeleteUser;
};