-- Insert sample previsit report data
INSERT INTO previsit_reports (
  id,
  interaction_id,
  msl_id,
  customer_id,
  previous_interactions_summary,
  profile_changes_summary,
  suggested_topics
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM interactions ORDER BY created_at DESC LIMIT 1),
  (SELECT id FROM users WHERE role = 'MSL' LIMIT 1),
  (SELECT id FROM customers ORDER BY created_at DESC LIMIT 1),
  'Last meeting discussed clinical trial results for Drug X. Follow-up questions about efficacy data were addressed. Showed interest in upcoming phase III trials.',
  'Published new research paper on immunotherapy approaches. Appointed as department head at University Hospital. Joined editorial board of Medical Journal.',
  'Discuss new phase III trial protocol, Review recent publication findings, Update on department initiatives'
);