// Add to existing types
export interface PrevisitReport {
  id: string;
  interaction_id: string;
  msl_id: string;
  customer_id: string;
  previous_interactions_summary: string;
  profile_changes_summary: string;
  suggested_topics: string;
  created_at?: string;
  updated_at?: string;
  interactions?: {
    interaction_date: string;
    interaction_type: string;
    discussion_topics: string;
  };
  users?: {
    name: string;
  };
  customers?: {
    name: string;
  };
}