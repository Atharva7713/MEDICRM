// types.ts

import { PrevisitReport } from './index'; // Assuming PrevisitReport is already defined

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'MSL' | 'MSL Manager' | 'System Manager' | 'Compliance Manager' | 'Database Manager';
  phone?: string;
  region?: string;
  created_at?: string;
  updated_at?: string;
}

// Customer type (KOL)
export interface Customer {
  id: string;
  name: string;
  specialty?: string;
  affiliation?: string;
  phone?: string;
  email?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
  publications?: Publication[];
  resources?: Resource[];
  interactions?: Interaction[];
  users?: User[];
}

// Publication type
export interface Publication {
  id: string;
  customer_id: string;
  title: string;
  link?: string;
  publication_date?: string;
  created_at?: string;
}

// Resource type
export interface Resource {
  id: string;
  customer_id: string;
  type: 'study' | 'publication';
  title: string;
  description?: string;
  created_at?: string;
}

// Interaction type
export interface Interaction {
  id: string;
  customer_id: string;
  user_id: string;
  interaction_date: string;
  interaction_type: 'In-person' | 'Virtual' | 'Email';
  discussion_topics?: string;
  follow_up_description?: string;
  follow_up_due_date?: string;
  compliance_approved?: boolean;
  compliance_flag?: boolean;
  created_at?: string;
  updated_at?: string;
  attachments?: InteractionAttachment[];
}

// InteractionAttachment type
export interface InteractionAttachment {
  id: string;
  interaction_id: string;
  file_url: string;
  file_type: string;
  created_at?: string;
}

// Task type (if applicable)
export interface Task {
  id?: string; // Optional if the task is being created
  task_created_by: string; // User ID of the creator
  task_requested_by: string; // Either a role or "Other"
  task_requested_by_other?: string; // Specified if "Other" is selected
  task_assigned_to: string; // User ID of the assignee
  customer_id: string; // ID of the customer account
  task_description: string; // Description of the task
  due_date: string; // Due date in YYYY-MM-DD format
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled'; // Status of the task
  is_interaction_related: boolean; // Indicates if associated with an interaction
  interaction_id?: string; // Interaction ID if the task is related to an interaction
  created_at?: string; // Optional - timestamp of when the task was created
  updated_at?: string; // Optional - timestamp of when the task was last updated
}


// Export all types
export type {
  PrevisitReport,
};