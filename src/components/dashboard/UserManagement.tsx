import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { UserForm } from "./UserForm";
import { UserTable } from "./UserTable";
import { User } from "@/types/user";
import { useUsers } from "@/hooks/useUsers";
import { useUserActions } from "./UserActions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const UserManagement = () => {
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    role: "Employee",
    department: "",
    password: "",
  });

  const { users, isLoading } = useUsers();
  const { handleAddUser, handleUpdateUser, handleDeleteUser } = useUserActions();

  const { data: currentUserRole = 'Employee' } = useQuery({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return 'Employee';

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      return profile?.role || 'Employee';
    },
  });

  const handleUserSubmit = async () => {
    if (editingUser) {
      await handleUpdateUser(editingUser, newUser);
      setEditingUser(null);
    } else {
      await handleAddUser(newUser);
    }
    setNewUser({ full_name: "", email: "", role: "Employee", department: "", password: "" });
    setShowUserForm(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({
      full_name: user.full_name || "",
      email: user.email || "",
      role: user.role || "Employee",
      department: user.department || "",
      password: "",
    });
    setShowUserForm(true);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setNewUser({ full_name: "", email: "", role: "Employee", department: "", password: "" });
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
        {!editingUser && currentUserRole === 'Admin' && (
          <Button onClick={() => setShowUserForm(true)}>Add User</Button>
        )}
      </CardHeader>
      <CardContent>
        {(showUserForm || editingUser) && (
          <UserForm
            user={newUser}
            editingUser={editingUser}
            onSave={handleUserSubmit}
            onUpdate={handleUserSubmit}
            onCancel={handleCancelEdit}
            onChange={handleUserChange}
            currentUserRole={currentUserRole}
          />
        )}
        <UserTable
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          currentUserRole={currentUserRole}
        />
      </CardContent>
    </Card>
  );
};