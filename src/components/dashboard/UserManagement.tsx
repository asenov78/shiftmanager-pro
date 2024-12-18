import { Card, CardContent } from "@/components/ui/card";
import { useUsers } from "@/hooks/useUsers";
import { useUserActions } from "./UserActions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserFormState } from "@/hooks/useUserFormState";
import { UserFormHeader } from "./UserFormHeader";
import { UserLoadingState } from "./UserLoadingState";
import { UserFormContainer } from "./UserFormContainer";
import { UserTableContainer } from "./UserTableContainer";

export const UserManagement = () => {
  const {
    showUserForm,
    setShowUserForm,
    editingUser,
    newUser,
    handleUserChange,
    resetForm,
    initializeEditForm,
  } = useUserFormState();

  const { users, isLoading } = useUsers();
  const { handleAddUser, handleUpdateUser, handleDeleteUser } = useUserActions();

  const { data: currentUserRole = 'Employee' } = useQuery({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return 'Employee';

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      return profile?.role || 'Employee';
    },
  });

  const handleUserSubmit = async () => {
    if (editingUser) {
      await handleUpdateUser(editingUser, newUser);
    } else {
      await handleAddUser(newUser);
    }
    resetForm();
  };

  if (isLoading) {
    return <UserLoadingState />;
  }

  return (
    <Card>
      <UserFormHeader
        showAddButton={!editingUser && currentUserRole === 'Admin'}
        onAddClick={() => setShowUserForm(true)}
      />
      <CardContent>
        <UserFormContainer
          showUserForm={showUserForm}
          editingUser={editingUser}
          newUser={newUser}
          onUserSubmit={handleUserSubmit}
          onCancel={resetForm}
          onChange={handleUserChange}
          currentUserRole={currentUserRole}
        />
        <UserTableContainer
          users={users}
          onEdit={initializeEditForm}
          onDelete={handleDeleteUser}
          currentUserRole={currentUserRole}
        />
      </CardContent>
    </Card>
  );
};