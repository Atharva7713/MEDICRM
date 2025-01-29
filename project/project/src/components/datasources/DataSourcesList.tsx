import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText,Upload, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import UserNavbar from '../UserNavbar';

interface FileData {
  id: string;
  name: string;
  url: string;
  uploadedAt: Date;
}

export default function DataSourcesList() {
  const userRole = "Admin"; // Replace with actual user role logic
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSignOut = async () => {
        try {
          await supabase.auth.signOut();
          navigate('/login');
        } catch (error) {
          console.error('Error signing out:', error);
        }
      }

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage.from('datasources').list();

      if (error) throw error;

      const filesData: FileData[] = await Promise.all(
        data.map(async (file) => {
          const { data: { publicUrl } } = supabase.storage
            .from('datasources')
            .getPublicUrl(file.name);

          return {
            id: file.id || file.name, // Fallback if ID is unavailable
            name: file.name,
            url: publicUrl,
            uploadedAt: new Date(file.created_at || Date.now()),
          };
        })
      );
      setFiles(filesData);
    } catch (error) {
      console.error('Error loading files:', error);
      setError('Error loading files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('datasources')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      await loadFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSelection = (file: FileData) => {
    setSelectedFiles((prev) =>
      prev.find((f) => f.id === file.id)
        ? prev.filter((f) => f.id !== file.id)
        : [...prev, file]
    );
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const { error } = await supabase.storage.from('datasources').remove([fileName]);

      if (error) throw error;
      await loadFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      setError('Error deleting file. Please try again.');
    }
  };

  const handleLearnMore = () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one file.');
      return;
    }

    navigate('/chat', { state: { selectedFiles } });
  };

  return (
    <>
      <UserNavbar userRole={userRole} handleSignOut={handleSignOut}/>
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Data Sources</h2>
            <label className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Upload File
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>

          {error && <div className="text-red-500">{error}</div>}
          {uploading && <div className="text-blue-500">Uploading...</div>}

          <div className="space-y-4">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    onChange={() => handleSelection(file)}
                    checked={selectedFiles.some((f) => f.id === file.id)}
                  />
                  <FileText className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded on {file.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleDelete(file.name)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            {files.length === 0 && !error && (
              <div className="text-center py-6 text-gray-500">
                No files uploaded yet
              </div>
            )}
          </div>

          <button
            onClick={handleLearnMore}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Learn More
          </button>
        </div>
      </div>
    </>
  );
}
