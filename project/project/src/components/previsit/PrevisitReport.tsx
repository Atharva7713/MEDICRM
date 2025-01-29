import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import type { PrevisitReport} from '../../types/types';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../UserNavbar';

export default function PrevisitReport() {
  const userRole = "Admin"; // Replace this with actual logic to determine the user's role
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
  const navigate = useNavigate();
  const [report, setReport] = useState<PrevisitReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('previsit_reports')
        .select(`
          *,
          interactions (
            interaction_date,
            interaction_type,
            discussion_topics
          ),
          users (name),
          customers (name)
        `)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      // Handle empty data case
      if (!data || data.length === 0) {
        setReport(null);
      } else {
        setReport(data[0]);
      }
    } catch (error) {
      console.error('Error loading report:', error);
      setError('Error loading report. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Reports Available</h2>
          <p className="text-gray-600">There are no pre-visit reports available at this time.</p>
        </div>
      </div>
    );
  }

  return (
  <>
    <UserNavbar userRole={userRole} handleSignOut={handleSignOut} />
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Pre-visit Report</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-200">
            {/* Visit Details */}
            <tr>
              <td className="px-6 py-4 w-1/3 bg-gray-50">
                <div className="text-sm font-medium text-gray-900">Visit Details</div>
                <div className="text-xs text-gray-500">Imported from interaction page</div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-2 text-sm text-gray-900">
                  <div><span className="font-medium">MSL Name:</span> {report.users?.name}</div>
                  <div><span className="font-medium">Customer Name:</span> {report.customers?.name}</div>
                  <div>
                    <span className="font-medium">Date & Time:</span>{' '}
                    {report.interactions?.interaction_date
                      ? format(new Date(report.interactions.interaction_date), 'PPpp')
                      : 'Not scheduled'}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>{' '}
                    {report.interactions?.interaction_type || 'Not specified'}
                  </div>
                </div>
              </td>
            </tr>

            {/* Previous Interactions Summary */}
            <tr>
              <td className="px-6 py-4 w-1/3 bg-gray-50">
                <div className="text-sm font-medium text-gray-900">Previous Interactions Summary</div>
                <div className="text-xs text-gray-500">LLM derived summary of last 3 interactions</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 whitespace-pre-line">
                  {report.previous_interactions_summary || 'No previous interactions recorded'}
                </div>
              </td>
            </tr>

            {/* Profile Changes */}
            <tr>
              <td className="px-6 py-4 w-1/3 bg-gray-50">
                <div className="text-sm font-medium text-gray-900">Recent Profile Changes</div>
                <div className="text-xs text-gray-500">Web search summarized for last 3 months</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 whitespace-pre-line">
                  {report.profile_changes_summary || 'No recent profile changes'}
                </div>
              </td>
            </tr>

            {/* Suggested Topics */}
            <tr>
              <td className="px-6 py-4 w-1/3 bg-gray-50">
                <div className="text-sm font-medium text-gray-900">Suggested Discussion Topics</div>
                <div className="text-xs text-gray-500">Auto-populated</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 whitespace-pre-line">
                  {report.suggested_topics || 'No suggested topics available'}
                </div>
              </td>
            </tr>

            {/* Pre-Visit Action Items */}
            <tr>
              <td className="px-6 py-4 w-1/3 bg-gray-50">
                <div className="text-sm font-medium text-gray-900">Pre-Visit Action Items</div>
                <div className="text-xs text-gray-500">From last visit</div>
              </td>
              <td className="px-6 py-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Task</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Solution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-3 py-2 text-sm text-gray-900">Review latest clinical data</td>
                      <td className="px-3 py-2">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900">
                        Clinical data review completed and summary prepared
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-sm text-gray-900">Prepare presentation slides</td>
                      <td className="px-3 py-2">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          In Progress
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900">
                        Draft slides under review
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </>
  );
}