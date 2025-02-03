import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Study {
  unique_study_id: string;
  nct_number: string;
  study_title: string;
  asset:string;
  indication:string;
  phases: string;
  enrollment: number;
  other_ids: string;
  start_date: string;
  primary_completion_date: string;
  completion_date: string;
}

const StudiesPage: React.FC = () => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudies();
  }, []);

  const fetchStudies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('studies')
        .select('*');

      if (error) throw error;
      setStudies(data || []);
    } catch (error) {
      console.error('Error fetching studies:', error);
      setError('Failed to fetch studies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Studies</h2>
      <div className="overflow-x-auto max-h-[500px] border border-gray-300 rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">unique study id</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">NCT Number</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Study Title</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Asset</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Indication</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Phase</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Enrollment</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Start Date</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Primary Completion Date</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Completion Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {studies.length > 0 ? (
              studies.map((study) => (
                <tr key={study.unique_study_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-700">{study.unique_study_id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{study.nct_number}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{study.study_title}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{study.asset}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{study.indication}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{study.phases}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{study.enrollment}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{study.start_date}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{study.primary_completion_date}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{study.completion_date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                  No studies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudiesPage;
