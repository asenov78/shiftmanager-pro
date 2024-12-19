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

  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select department" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">No Department</SelectItem>
        {departments.map((dept) => (
          <SelectItem key={dept.id} value={dept.name}>
            {dept.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};