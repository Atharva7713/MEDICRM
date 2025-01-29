import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Search, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import UserNavbar from '../UserNavbar';
import type { PrevisitReport } from '../../types';

export default function PrevisitList() {
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
  const [reports, setReports] = useState<PrevisitReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const filtered = data?.filter(report =>
        report.customers?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.users?.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];
      
      setReports(filtered);
    } catch (error) {
      console.error('Error loading reports:', error);
      alert('Error loading reports');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
  <>
    <UserNavbar userRole={userRole} handleSignOut={handleSignOut} />
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Pre-visit Reports</h2>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              loadReports();
            }}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="divide-y divide-gray-200">
          {reports.map((report) => (
            <div key={report.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {report.customers?.name}
                  </h3>
                  <p className="text-sm text-gray-500">MSL: {report.users?.name}</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(report.interactions?.interaction_date || ''), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <Link
                  to={`/previsit/${report.id}`}
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                >
                  View Report
                  <span className="ml-2">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
  );
}