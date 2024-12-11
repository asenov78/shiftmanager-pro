import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { UserForm } from "./UserForm";
import { UserTable } from "./UserTable";
import { User } from "@/types/user";

export const UserManagement = () => {
  const { toast } = useToast();
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Employee",
      department: "IT",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Manager",
      department: "HR",
    },
  ]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Employee",
    department: "IT",
  });

  const handleAddUser = () => {
    const id = users.length + 1;
    setUsers([...users, { ...newUser, id }]);
    setNewUser({ name: "", email: "", role: "Employee", department: "IT" });
    setShowUserForm(false);
    toast({
      title: "Success",
      description: "User added successfully",
    });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    });
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    
    setUsers(users.map((user) => 
      user.id === editingUser.id 
        ? { ...user, ...newUser }
        : user
    ));
    
    setEditingUser(null);
    setNewUser({ name: "", email: "", role: "Employee", department: "IT" });
    toast({
      title: "Success",
      description: "User updated successfully",
    });
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
    toast({
      title: "Success",
      description: "User deleted successfully",
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setNewUser({ name: "", email: "", role: "Employee", department: "IT" });
    setShowUserForm(false);
  };

  const handleUserChange = (field: string, value: string) => {
    setNewUser({ ...newUser, [field]: value });
  };

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