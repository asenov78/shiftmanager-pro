import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { User } from "@/types/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <Select
        value={user.role}
        onValueChange={(value) => onChange("role", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Employee">Employee</SelectItem>
          <SelectItem value="Manager">Manager</SelectItem>
          <SelectItem value="Admin">Admin</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={user.department}
        onValueChange={(value) => onChange("department", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="IT">IT</SelectItem>
          <SelectItem value="HR">HR</SelectItem>
          <SelectItem value="Finance">Finance</SelectItem>
          <SelectItem value="Marketing">Marketing</SelectItem>
          <SelectItem value="Operations">Operations</SelectItem>
        </SelectContent>
      </Select>
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