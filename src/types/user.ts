import { Profile } from "./database";

export type NewUser = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>> & {
  password?: string;
  full_name: string;
  email: string;
  role: string;
  department: string;
};