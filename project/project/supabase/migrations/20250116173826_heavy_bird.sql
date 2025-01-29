/*
  # Fix Customer RLS and Interaction Policies

  1. Changes
    - Simplify customer table RLS policies
    - Ensure proper access control for admins and users
  
  2. Security
    - All authenticated users can read customer data
    - Only admins can modify customer data
    - Non-recursive, optimized policies
*/

-- First, drop all existing customer policies safely
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "customers_read_policy" ON customers;
    DROP POLICY IF EXISTS "customers_write_policy" ON customers;
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

-- Create a simple read policy for all authenticated users
CREATE POLICY "allow_read_customers"
    ON customers
    FOR SELECT
    TO authenticated
    USING (true);

-- Create separate policies for admin operations
CREATE POLICY "allow_admin_write"
    ON customers
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.auth_id = auth.uid()
        )
    );

CREATE POLICY "allow_admin_update"
    ON customers
    FOR UPDATE
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

CREATE POLICY "allow_admin_delete"
    ON customers
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.auth_id = auth.uid()
        )
    );