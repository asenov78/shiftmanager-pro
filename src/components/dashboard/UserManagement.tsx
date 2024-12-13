import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { UserForm } from "./UserForm";
import { UserTable } from "./UserTable";
import { User } from "@/types/user";
import { useUsers } from "@/hooks/useUsers";
import { useUserActions } from "./UserActions";

export const UserManagement = () => {
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Employee",
    department: "",
  });

  const { users, isLoading } = useUsers();
  const { handleAddUser, handleUpdateUser, handleDeleteUser } = useUserActions();

  const handleUserSubmit = async () => {
    if (editingUser) {
      await handleUpdateUser(editingUser, newUser);
      setEditingUser(null);
    } else {
      await handleAddUser(newUser);
    }
    setNewUser({ name: "", email: "", role: "Employee", department: "" });
    setShowUserForm(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({
      name: user.name || "",
      email: user.email || "",
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
            onSave={handleUserSubmit}
            onUpdate={handleUserSubmit}
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