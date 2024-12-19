import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Profile } from "@/types/database";
import { DepartmentSelect } from "./form/DepartmentSelect";
import { RoleSelect } from "./form/RoleSelect";

interface UserFormProps {
  user: {
    full_name: string;
    email: string;
    role: string;
    department: string;
    password?: string;
  };
  editingUser: Profile | null;
  onSave: () => void;
  onUpdate: () => void;
  onCancel: () => void;
  onChange: (field: string, value: string) => void;
  currentUserRole: string;
}

export const UserForm = ({
  user,
  editingUser,
  onSave,
  onUpdate,
  onCancel,
  onChange,
  currentUserRole,
}: UserFormProps) => {
  const isAdmin = currentUserRole === 'Admin';

  const handleDepartmentChange = (value: string) => {
    onChange("department", value);
  };

  const handleRoleChange = (value: string) => {
    onChange("role", value);
  };

  return (
    <div className="mb-6 p-4 border rounded-lg space-y-4">
      <Input
        placeholder="Full Name"
        value={user.full_name}
        onChange={(e) => onChange("full_name", e.target.value)}
      />
      <Input
        placeholder="Email"
        type="email"
        value={user.email}
        onChange={(e) => onChange("email", e.target.value)}
      />
      {!editingUser && isAdmin && (
        <Input
          placeholder="Password"
          type="password"
          value={user.password || ''}
          onChange={(e) => onChange("password", e.target.value)}
        />
      )}
      <RoleSelect
        value={user.role}
        onChange={handleRoleChange}
        disabled={!isAdmin}
      />
      <DepartmentSelect
        value={user.department}
        onChange={handleDepartmentChange}
      />
      <div className="flex gap-2">
        {editingUser ? (
          <>
            <Button onClick={onUpdate}>Update</Button>
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </>
        ) : (
          <>
            {isAdmin && <Button onClick={onSave}>Save</Button>}
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
};