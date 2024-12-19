import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoleSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const RoleSelect = ({ value, onChange, disabled }: RoleSelectProps) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
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
  );
};