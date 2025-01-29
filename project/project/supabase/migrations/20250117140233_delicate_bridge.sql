/*
  # Add test users and admins

  This migration adds test users for development:
  1. Admin user
  2. Regular MSL user
  
  Note: In production, passwords should never be stored in migrations
*/

-- Create test admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW()
);

-- Create admin profile
INSERT INTO admins (
  auth_id,
  email,
  name
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@example.com',
  'System Admin'
);

-- Create test MSL user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'msl@example.com',
  crypt('msl123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW()
);

-- Create MSL user profile
INSERT INTO users (
  id,
  email,
  name,
  role,
  region
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'msl@example.com',
  'Test MSL User',
  'MSL',
  'Northeast'
);