import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Department } from "@/types/database";

interface DepartmentFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingDepartment: Department | null;
  onSubmit: (name: string) => Promise<void>;
}

export const DepartmentForm = ({ 
  isOpen, 
  setIsOpen, 
  editingDepartment, 
  onSubmit 
}: DepartmentFormProps) => {
  const [departmentName, setDepartmentName] = useState(editingDepartment?.name || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(departmentName);
    setDepartmentName("");
  };

  return (
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
  );
};