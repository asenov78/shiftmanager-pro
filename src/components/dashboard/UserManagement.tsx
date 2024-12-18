import { Card, CardContent } from "@/components/ui/card";
import { UserForm } from "./UserForm";
import { UserTable } from "./UserTable";
import { useUsers } from "@/hooks/useUsers";
import { useUserActions } from "./UserActions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserFormState } from "@/hooks/useUserFormState";
import { UserFormHeader } from "./UserFormHeader";

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
    return <div>Loading users...</div>;
  }

  return (
    <Card>
      <UserFormHeader
        showAddButton={!editingUser && currentUserRole === 'Admin'}
        onAddClick={() => setShowUserForm(true)}
      />
      <CardContent>
        {(showUserForm || editingUser) && (
          <UserForm
            user={newUser}
            editingUser={editingUser}
            onSave={handleUserSubmit}
            onUpdate={handleUserSubmit}
            onCancel={resetForm}
            onChange={handleUserChange}
            currentUserRole={currentUserRole}
          />
        )}
        <UserTable
          users={users}
          onEdit={initializeEditForm}
          onDelete={handleDeleteUser}
          currentUserRole={currentUserRole}
        />
      </CardContent>
    </Card>
  );
};