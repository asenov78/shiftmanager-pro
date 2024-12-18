import { Profile } from "@/types/database";
import { UserTable } from "./UserTable";

interface UserTableContainerProps {
  users: Profile[];
  onEdit: (user: Profile) => void;
  onDelete: (id: string) => void;
  currentUserRole: string;
}

export const UserTableContainer = ({
  users,
  onEdit,
  onDelete,
  currentUserRole,
}: UserTableContainerProps) => {
  return (
    <UserTable
      users={users}
      onEdit={onEdit}
      onDelete={onDelete}
      currentUserRole={currentUserRole}
    />
  );
};