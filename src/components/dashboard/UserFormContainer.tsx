import { Profile } from "@/types/database";
import { UserForm } from "./UserForm";

interface UserFormContainerProps {
  showUserForm: boolean;
  editingUser: Profile | null;
  newUser: {
    full_name: string;
    email: string;
    role: string;
    department: string;
    password?: string;
  };
  onUserSubmit: () => Promise<void>;
  onCancel: () => void;
  onChange: (field: string, value: string) => void;
  currentUserRole: string;
}

export const UserFormContainer = ({
  showUserForm,
  editingUser,
  newUser,
  onUserSubmit,
  onCancel,
  onChange,
  currentUserRole,
}: UserFormContainerProps) => {
  if (!showUserForm && !editingUser) return null;

  return (
    <UserForm
      user={newUser}
      editingUser={editingUser}
      onSave={onUserSubmit}
      onUpdate={onUserSubmit}
      onCancel={onCancel}
      onChange={onChange}
      currentUserRole={currentUserRole}
    />
  );
};