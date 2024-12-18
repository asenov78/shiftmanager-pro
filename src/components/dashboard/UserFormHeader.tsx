import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

interface UserFormHeaderProps {
  showAddButton: boolean;
  onAddClick: () => void;
}

export const UserFormHeader = ({ showAddButton, onAddClick }: UserFormHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>User Management</CardTitle>
      {showAddButton && (
        <Button onClick={onAddClick}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      )}
    </CardHeader>
  );
};