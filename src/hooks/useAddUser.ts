import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
import { AuthUser } from "@/types/userActions";
import { toast } from "sonner";
import { useUserAuth } from "./useUserAuth";

export const useAddUser = () => {
  const { checkAdminStatus, getCurrentSession } = useUserAuth();

  const handleAddUser = async (newUser: Omit<User, 'id' | 'created_at'>) => {
    try {
      const session = await getCurrentSession();
      await checkAdminStatus(session.user.id);

      const { data: authData, error: adminError } = await supabase.auth.admin.listUsers();
      if (adminError) throw adminError;

      const users = authData?.users as AuthUser[] || [];
      const existingUser = users.find(user => user.email === newUser.email);

      if (existingUser) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', existingUser.id)
          .single();

        if (existingProfile) {
          throw new Error("A user with this email already exists");
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: existingUser.id,
            name: newUser.name,
            role: newUser.role,
            department: newUser.department,
          });

        if (profileError) throw profileError;
        toast.success("User profile created successfully");
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: newUser.email,
        password: 'tempPassword123',
        options: {
          data: {
            name: newUser.name,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("User creation failed");

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          role: newUser.role,
          department: newUser.department,
        })
        .eq('id', data.user.id);

      if (updateError) throw updateError;

      toast.success("User added successfully");
    } catch (error: any) {
      console.error("Error adding user:", error);
      toast.error(error.message || "Failed to add user");
      throw error;
    }
  };

  return handleAddUser;
};