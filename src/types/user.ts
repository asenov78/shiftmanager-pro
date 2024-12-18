import { Profile } from "./database";

export interface User extends Required<Pick<Profile, 'full_name' | 'email' | 'role' | 'department'>> {
  id: string;
  password?: string;
}

export type NewUser = Omit<User, 'id'>;