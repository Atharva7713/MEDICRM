-- First drop any existing policies safely
DO $$ 
BEGIN
    -- Drop policies if they exist
    DROP POLICY IF EXISTS "admin_full_access" ON customers;
    DROP POLICY IF EXISTS "Enable read access for authenticated admins" ON customers;
    DROP POLICY IF EXISTS "Enable insert for authenticated admins" ON customers;
    DROP POLICY IF EXISTS "Enable update for authenticated admins" ON customers;
    DROP POLICY IF EXISTS "Enable delete for authenticated admins" ON customers;
    DROP POLICY IF EXISTS "Enable full access for authenticated admins" ON customers;
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

-- Create a single unified policy for all operations if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'customers' 
        AND policyname = 'admin_full_access'
    ) THEN
        CREATE POLICY "admin_full_access" ON customers
            FOR ALL
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM admins
                    WHERE auth_id = auth.uid()
                )
            )
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM admins
                    WHERE auth_id = auth.uid()
                )
            );
    END IF;
END $$;