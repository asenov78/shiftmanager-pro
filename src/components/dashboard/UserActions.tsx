import { UserActionsHook } from "@/types/userActions";
import { useAddUser } from "@/hooks/useAddUser";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { useDeleteUser } from "@/hooks/useDeleteUser";

export const useUserActions = (): UserActionsHook => {
  const handleAddUser = useAddUser();
  const handleUpdateUser = useUpdateUser();
  const handleDeleteUser = useDeleteUser();

  return {
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
  };
};