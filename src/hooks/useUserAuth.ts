import { supabase } from "@/integrations/supabase/client";

export const useUserAuth = () => {
  const checkAdminStatus = async (userId: string) => {
    const { data: currentUserProfile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error("Failed to verify user role");
    }

    if (currentUserProfile?.role !== 'Admin') {
      throw new Error("Only administrators can perform this action");
    }

    return currentUserProfile;
  };

  const getCurrentSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new Error("Authentication error");
    }
    
    if (!session?.user) {
      throw new Error("Not authenticated");
    }
    
    return session;
  };

  return {
    checkAdminStatus,
    getCurrentSession,
  };
};