/*
  # Add dummy MSL users

  1. Changes
    - Adds 10 dummy MSL users with predefined data
    - Each user has a unique email and region assignment
    - Passwords are set to 'Password123!' for testing purposes
*/

-- Function to create users with auth and profile
CREATE OR REPLACE FUNCTION create_msl_user(
  p_email TEXT,
  p_password TEXT,
  p_name TEXT,
  p_region TEXT
) RETURNS void AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Create auth user
  v_user_id := extensions.uuid_generate_v4();
  
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
    v_user_id,
    p_email,
    crypt(p_password, gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW()
  );

  -- Create user profile
  INSERT INTO users (
    id,
    email,
    name,
    role,
    region
  ) VALUES (
    v_user_id,
    p_email,
    p_name,
    'MSL',
    p_region
  );
END;
$$ LANGUAGE plpgsql;

-- Create dummy MSL users
SELECT create_msl_user(
  'msl1@example.com',
  'Password123!',
  'Dr. Sarah Johnson',
  'Northeast'
);

SELECT create_msl_user(
  'msl2@example.com',
  'Password123!',
  'Dr. Michael Chen',
  'West Coast'
);

SELECT create_msl_user(
  'msl3@example.com',
  'Password123!',
  'Dr. Emily Rodriguez',
  'Southeast'
);

SELECT create_msl_user(
  'msl4@example.com',
  'Password123!',
  'Dr. James Wilson',
  'Midwest'
);

SELECT create_msl_user(
  'msl5@example.com',
  'Password123!',
  'Dr. Lisa Thompson',
  'Southwest'
);

SELECT create_msl_user(
  'msl6@example.com',
  'Password123!',
  'Dr. David Kim',
  'Northwest'
);

SELECT create_msl_user(
  'msl7@example.com',
  'Password123!',
  'Dr. Rachel Martinez',
  'Central'
);

SELECT create_msl_user(
  'msl8@example.com',
  'Password123!',
  'Dr. John Anderson',
  'Mid-Atlantic'
);

SELECT create_msl_user(
  'msl9@example.com',
  'Password123!',
  'Dr. Maria Garcia',
  'South Central'
);

SELECT create_msl_user(
  'msl10@example.com',
  'Password123!',
  'Dr. Robert Lee',
  'Pacific Northwest'
);

-- Drop the function after use
DROP FUNCTION create_msl_user;