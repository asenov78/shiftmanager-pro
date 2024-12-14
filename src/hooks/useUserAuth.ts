import { supabase } from "@/integrations/supabase/client";

export const useUserAuth = () => {
  const checkAdminStatus = async (userId: string) => {
    const { data: currentUserProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (currentUserProfile?.role !== 'Admin') {
      throw new Error("Only admins can perform this action");
    }
  };

  const getCurrentSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error("Not authenticated");
    return session;
  };

  return {
    checkAdminStatus,
    getCurrentSession,
  };
};