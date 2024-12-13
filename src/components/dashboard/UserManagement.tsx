import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { UserForm } from "./UserForm";
import { UserTable } from "./UserTable";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

export const UserManagement = () => {
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Employee",
    department: "",
  });

  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return profiles;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['profiles'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleAddUser = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: 'tempPassword123', // You should implement a proper password system
        options: {
          data: {
            name: newUser.name,
          },
        },
      });

      if (error) throw error;

      // Wait for the profile trigger to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the profile with additional information
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          role: newUser.role,
          department: newUser.department,
        })
        .eq('id', data.user?.id);

      if (updateError) throw updateError;

      setNewUser({ name: "", email: "", role: "Employee", department: "" });
      setShowUserForm(false);
      toast.success("User added successfully");
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user");
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: newUser.name,
          role: newUser.role,
          department: newUser.department,
        })
        .eq('id', editingUser.id);

      if (error) throw error;
      
      setEditingUser(null);
      setNewUser({ name: "", email: "", role: "Employee", department: "" });
      toast.success("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({
      name: user.name || "",
      email: "", // We don't update email
      role: user.role || "Employee",
      department: user.department || "",
    });
    setShowUserForm(true);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setNewUser({ name: "", email: "", role: "Employee", department: "" });
    setShowUserForm(false);
  };

  const handleUserChange = (field: string, value: string) => {
    setNewUser({ ...newUser, [field]: value });
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        {!editingUser && (
          <Button onClick={() => setShowUserForm(true)}>Add User</Button>
        )}
      </CardHeader>
      <CardContent>
        {(showUserForm || editingUser) && (
          <UserForm
            user={newUser}
            editingUser={editingUser}
            onSave={handleAddUser}
            onUpdate={handleUpdateUser}
            onCancel={handleCancelEdit}
            onChange={handleUserChange}
          />
        )}
        <UserTable
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      </CardContent>
    </Card>
  );
};