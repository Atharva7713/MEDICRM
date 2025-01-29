/*
  # Fix Customer Policies

  1. Changes
    - Drops all existing customer policies safely
    - Creates a new unified policy for admin access
    - Ensures no duplicate policies

  2. Security
    - Maintains RLS on customers table
    - Admins have full access through a single policy
*/

-- First drop any existing policies safely
DO $$ 
BEGIN
    -- Drop all possible policy names that might exist
    DROP POLICY IF EXISTS "Enable read access for authenticated admins" ON customers;
    DROP POLICY IF EXISTS "Enable insert for authenticated admins" ON customers;
    DROP POLICY IF EXISTS "Enable update for authenticated admins" ON customers;
    DROP POLICY IF EXISTS "Enable delete for authenticated admins" ON customers;
    DROP POLICY IF EXISTS "Enable full access for authenticated admins" ON customers;
    DROP POLICY IF EXISTS "admin_full_access" ON customers;
    DROP POLICY IF EXISTS "customers_read_policy" ON customers;
    DROP POLICY IF EXISTS "customers_write_policy" ON customers;
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

-- Create a new unified policy with a unique name
CREATE POLICY "customers_admin_access_policy_v1" ON customers
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.auth_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.auth_id = auth.uid()
        )
    );