-- Enable storage by creating policies for the storage.objects table
CREATE POLICY "Enable read access for all users"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'datasources' );

CREATE POLICY "Enable insert access for authenticated users"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'datasources' );

CREATE POLICY "Enable update access for authenticated users"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'datasources' );

CREATE POLICY "Enable delete access for authenticated users"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'datasources' );

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('datasources', 'datasources', true)
ON CONFLICT (id) DO NOTHING;