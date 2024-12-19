import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DepartmentSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const DepartmentSelect = ({ value, onChange }: DepartmentSelectProps) => {
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

  const handleChange = (newValue: string) => {
    console.log('Department selected:', newValue);
    // Don't convert to empty string anymore, pass the actual value
    onChange(newValue);
  };

  // Use 'none' as value when there's no department selected
  const currentValue = value || 'none';
  console.log('Current department value:', currentValue);

  return (
    <Select
      value={currentValue}
      onValueChange={handleChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select department" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">No Department</SelectItem>
        {departments.map((dept) => (
          <SelectItem key={dept.id} value={dept.name}>
            {dept.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};