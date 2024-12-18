import { Profile } from "./database";

export interface UserActionsHook {
  handleAddUser: (newUser: Omit<Profile, 'id' | 'created_at'>) => Promise<void>;
  handleUpdateUser: (editingUser: Profile, newUserData: Partial<Profile>) => Promise<void>;
  handleDeleteUser: (id: string) => Promise<void>;
}

export interface AuthUser {
  id: string;
  email?: string;
}