import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pencil, Trash, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
}

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
          <div className="mb-6 p-4 border rounded-lg space-y-4">
            <Input
              placeholder="Name"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <div className="flex gap-2">
              {editingUser ? (
                <>
                  <Button onClick={handleUpdateUser}>Update</Button>
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleAddUser}>Save</Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowUserForm(false)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditUser(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};