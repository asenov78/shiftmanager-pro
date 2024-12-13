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

      // First check if the current user is an admin
      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (currentUserProfile?.role !== 'Admin') {
        throw new Error("Only admins can add users");
      }

      // First try to sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: newUser.email,
        password: 'tempPassword123',
        options: {
          data: {
            name: newUser.name,
          },
        },
      });

      // If user exists, we'll get an error
      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          // Check if user has a profile
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data?.user?.id)
            .single();

          if (existingProfile) {
            throw new Error("A user with this email already exists");
          }

          // If no profile exists, create one
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data?.user?.id,
              name: newUser.name,
              role: newUser.role,
              department: newUser.department,
            });

          if (profileError) throw profileError;
          toast.success("User profile created successfully");
          return;
        }
        throw signUpError;
      }

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

      // Check if current user is admin or the user being updated
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

  const handleDeleteUser = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      // First check if the current user is an admin
      const { data: currentUserProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw new Error("Failed to fetch user role");
      
      if (!currentUserProfile || currentUserProfile.role !== 'Admin') {
        throw new Error("Only admins can delete users");
      }

      // Instead of directly deleting the auth user, mark the profile as inactive
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

  return {
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
  };
};
