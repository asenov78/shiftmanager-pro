export * from './department';
export * from './profile';
export * from './session';
export * from './shift';

export interface Database {
  public: {
    Tables: {
      departments: {
        Row: Department;
        Insert: Omit<Department, 'id' | 'created_at'>;
        Update: Partial<Omit<Department, 'id' | 'created_at'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'created_at' | 'updated_at'>>;
      };
      active_sessions: {
        Row: ActiveSession;
        Insert: Omit<ActiveSession, 'id' | 'created_at'>;
        Update: Partial<Omit<ActiveSession, 'id' | 'created_at'>>;
      };
      shifts: {
        Row: Shift;
        Insert: Omit<Shift, 'id' | 'created_at'>;
        Update: Partial<Omit<Shift, 'id' | 'created_at'>>;
      };
    };
  };
}