/*
  # Fix Customer Table RLS Policies

  1. Changes
    - Drop all existing customer policies for a clean slate
    - Add simplified policies for both admin and general access
  
  2. Security
    - All authenticated users can read customer data
    - Only admins can create, update, and delete customers
    - Policies are non-recursive and optimized
*/

-- First, drop all existing policies safely
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "admin_full_access" ON customers;
    DROP POLICY IF EXISTS "allow_customer_read_for_interactions" ON customers;
    DROP POLICY IF EXISTS "allow_read_customers" ON customers;
    DROP POLICY IF EXISTS "allow_admin_insert" ON customers;
    DROP POLICY IF EXISTS "allow_admin_update" ON customers;
    DROP POLICY IF EXISTS "allow_admin_delete" ON customers;
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

-- Create a simple read policy for all authenticated users
CREATE POLICY "customers_read_policy"
    ON customers
    FOR SELECT
    TO authenticated
    USING (true);

-- Create a simple policy for admin write operations
CREATE POLICY "customers_write_policy"
    ON customers
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 
            FROM admins 
            WHERE admins.auth_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM admins 
            WHERE admins.auth_id = auth.uid()
        )
    );