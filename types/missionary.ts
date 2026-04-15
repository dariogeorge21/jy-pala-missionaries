export interface Missionary {
  id: number;
  serial_number: number;
  name: string;
  ministry: string;
  study_work: string;
  jy_courses: string[];
  joined_year: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type MissionaryFormData = Omit<Missionary, 'id' | 'serial_number' | 'created_at' | 'updated_at'>;

export type ViewMode = 'table' | 'card' | 'list';

export type SortField = 'name' | 'joined_year' | 'ministry' | 'is_active' | 'serial_number';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  ministry: string;
  activeStatus: 'all' | 'active' | 'inactive';
  joinedYear: string;
  course: string;
}

export const PREDEFINED_COURSES = ['Philip Course', 'Paul Course', 'Emmaus Course'] as const;

export const PREDEFINED_MINISTRIES = [
  'Campus Ministry',
  'Parish Ministry',
  'Music Ministry',
  'Teens Ministry',
  'Intercession Ministry',
  'Family Ministry',
  'Media Ministry',
] as const;
