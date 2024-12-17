import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Profile } from "@/types/database";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const isAdmin = currentUserRole === 'Admin';

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
      <Select
        value={user.role}
        onValueChange={(value) => onChange("role", value)}
        disabled={!isAdmin}
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
        disabled={!isAdmin}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select department" />
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept.id} value={dept.name}>
              {dept.name}
            </SelectItem>
          ))}
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