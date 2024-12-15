import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Department {
  id: string;
  name: string;
}

export const DepartmentManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [departmentName, setDepartmentName] = useState("");
  const queryClient = useQueryClient();

  const { data: departments = [], isLoading } = useQuery({
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

  useEffect(() => {
    // Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'departments' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['departments'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentName.trim()) {
      toast.error("Department name is required");
      return;
    }

    try {
      if (editingDepartment) {
        // Check if any profiles are using this department before updating
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('department', editingDepartment.name)
          .limit(1);

        if (profiles && profiles.length > 0) {
          // Update the profiles with the new department name first
          const { error: profilesError } = await supabase
            .from('profiles')
            .update({ department: departmentName })
            .eq('department', editingDepartment.name);

          if (profilesError) throw profilesError;
        }

        const { error } = await supabase
          .from("departments")
          .update({ name: departmentName })
          .eq("id", editingDepartment.id);

        if (error) throw error;
        toast.success("Department updated successfully");
      } else {
        const { error } = await supabase
          .from("departments")
          .insert([{ name: departmentName }]);

        if (error) throw error;
        toast.success("Department added successfully");
      }

      setDepartmentName("");
      setEditingDepartment(null);
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error managing department:", error);
      toast.error(error.message || "Failed to save department");
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setDepartmentName(department.name);
    setIsOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      // Check if any profiles are using this department
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('department', name)
        .limit(1);

      if (profiles && profiles.length > 0) {
        toast.error("Cannot delete department that has assigned users");
        return;
      }

      const { error } = await supabase
        .from("departments")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Department deleted successfully");
    } catch (error: any) {
      console.error("Error deleting department:", error);
      toast.error(error.message || "Failed to delete department");
    }
  };

  if (isLoading) {
    return <div>Loading departments...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Departments</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add Department</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDepartment ? "Edit Department" : "Add New Department"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Department Name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
              <Button type="submit">
                {editingDepartment ? "Update" : "Add"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((department) => (
            <TableRow key={department.id}>
              <TableCell>{department.name}</TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(department)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(department.id, department.name)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};