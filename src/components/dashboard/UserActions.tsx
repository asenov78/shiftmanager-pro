import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserActionsHook {
  handleAddUser: (newUser: Omit<User, 'id' | 'created_at'>) => Promise<void>;
  handleUpdateUser: (editingUser: User, newUserData: Partial<User>) => Promise<void>;
  handleDeleteUser: (id: string) => Promise<void>;
}

export const useUserActions = (): UserActionsHook => {
  const handleAddUser = async (newUser: Omit<User, 'id' | 'created_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const { data, error } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: 'tempPassword123',
        email_confirm: true,
        user_metadata: {
          name: newUser.name,
        },
      });

      if (error) throw error;

      if (!data.user) throw new Error("User creation failed");

      // Update the profile with additional information
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

  const handleUpdateUser = async (editingUser: User, newUserData: Partial<User>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

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

  const handleDeleteUser = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const { error } = await supabase.auth.admin.deleteUser(id);

      if (error) throw error;
      toast.success("User deleted successfully");
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user");
      throw error;
    }
  };

  return {
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
  };
};