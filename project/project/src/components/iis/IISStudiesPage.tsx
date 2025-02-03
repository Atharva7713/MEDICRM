import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface IISStudy {
  unique_iis_study_id:string
  iis_study_title:string
  asset: string;
  indication: string;
  phases: string;
  enrollment: number;
  start_date: string;
  primary_completion_date: string;
}

const IISStudiesPage: React.FC = () => {
  const [studies, setStudies] = useState<IISStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudies();
  }, []);

  const fetchStudies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('iis_studies') // Assuming the table name is 'iis_studies'
        .select('*');

      if (error) throw error;
      setStudies(data || []);
    } catch (error) {
      console.error('Error fetching IIS studies:', error);
      setError('Failed to fetch IIS studies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">IIS Studies</h2>
      <div className="overflow-x-auto max-h-[500px] border border-gray-300 rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Unique IIS Study ID</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">IIS Study Title</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Asset</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Indication</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Phase</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Enrollment</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Start Date</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Primary Completion Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {studies.length > 0 ? (
              studies.map((study) => (
                <tr key={study.unique_iis_study_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-700">{study.unique_iis_study_id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{study.iis_study_title}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{study.asset}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{study.indication}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{study.phases}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{study.enrollment}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{study.start_date}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{study.primary_completion_date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="px-4 py-4 text-center text-gray-500">
                  No IIS studies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IISStudiesPage;