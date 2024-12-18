import { useState } from "react";
import { Profile } from "@/types/database";
import { NewUser } from "@/types/user";

export const useUserFormState = () => {
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [newUser, setNewUser] = useState<NewUser>({
    full_name: "",
    email: "",
    role: "Employee",
    department: "",
    password: "",
  });

  const handleUserChange = (field: string, value: string) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setEditingUser(null);
    setNewUser({
      full_name: "",
      email: "",
      role: "Employee",
      department: "",
      password: "",
    });
    setShowUserForm(false);
  };

  const initializeEditForm = (user: Profile) => {
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

  return {
    showUserForm,
    setShowUserForm,
    editingUser,
    setEditingUser,
    newUser,
    setNewUser,
    handleUserChange,
    resetForm,
    initializeEditForm,
  };
};