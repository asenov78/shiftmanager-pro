import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { User } from "@/types/user";

interface UserFormProps {
  user: {
    name: string;
    email: string;
    role: string;
    department: string;
  };
  editingUser: User | null;
  onSave: () => void;
  onUpdate: () => void;
  onCancel: () => void;
  onChange: (field: string, value: string) => void;
}

export const UserForm = ({
  user,
  editingUser,
  onSave,
  onUpdate,
  onCancel,
  onChange,
}: UserFormProps) => {
  return (
    <div className="mb-6 p-4 border rounded-lg space-y-4">
      <Input
        placeholder="Name"
        value={user.name}
        onChange={(e) => onChange("name", e.target.value)}
      />
      <Input
        placeholder="Email"
        type="email"
        value={user.email}
        onChange={(e) => onChange("email", e.target.value)}
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
            <Button onClick={onSave}>Save</Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
};