import { useState } from "react";
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

interface Department {
  id: string;
  name: string;
}

export const DepartmentManagement = () => {
  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem("departments");
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [departmentName, setDepartmentName] = useState("");

  const saveDepartments = (newDepartments: Department[]) => {
    localStorage.setItem("departments", JSON.stringify(newDepartments));
    setDepartments(newDepartments);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentName.trim()) {
      toast.error("Department name is required");
      return;
    }

    if (editingDepartment) {
      const updated = departments.map((dept) =>
        dept.id === editingDepartment.id ? { ...dept, name: departmentName } : dept
      );
      saveDepartments(updated);
      toast.success("Department updated successfully");
    } else {
      const newDepartment = {
        id: crypto.randomUUID(),
        name: departmentName,
      };
      saveDepartments([...departments, newDepartment]);
      toast.success("Department added successfully");
    }

    setDepartmentName("");
    setEditingDepartment(null);
    setIsOpen(false);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setDepartmentName(department.name);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = departments.filter((dept) => dept.id !== id);
    saveDepartments(updated);
    toast.success("Department deleted successfully");
  };

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
                  onClick={() => handleDelete(department.id)}
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