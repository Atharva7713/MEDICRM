import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Search, SortAsc, SortDesc } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import type { Interaction } from '../../types/types';
import UserNavbar from '../UserNavbar';

interface InteractionWithNames extends Interaction {
  customers: { name: string };
  users: { name: string };
}

export default function InteractionList() {
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
  const [interactions, setInteractions] = useState<InteractionWithNames[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Interaction>('interaction_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [typeFilter, setTypeFilter] = useState<Interaction['interaction_type'] | ''>('');
  const [complianceFilter, setComplianceFilter] = useState<'all' | 'approved' | 'flagged' | 'pending'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    loadInteractions();
  }, [sortField, sortDirection, typeFilter, complianceFilter, dateRange]);

  async function loadInteractions() {
    try {
      setLoading(true);
      let query = supabase
        .from('interactions')
        .select(`
          *,
          customers (name),
          users (name)
        `)
        .order(sortField, { ascending: sortDirection === 'asc' });

      if (typeFilter) {
        query = query.eq('interaction_type', typeFilter);
      }

      if (complianceFilter !== 'all') {
        switch (complianceFilter) {
          case 'approved':
            query = query.eq('compliance_approved', true);
            break;
          case 'flagged':
            query = query.eq('compliance_flag', true);
            break;
          case 'pending':
            query = query.eq('compliance_approved', false).eq('compliance_flag', false);
            break;
        }
      }

      if (dateRange.start) {
        query = query.gte('interaction_date', dateRange.start);
      }
      if (dateRange.end) {
        query = query.lte('interaction_date', dateRange.end);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (data) {
        // Apply search filter client-side
        const filtered = searchTerm
          ? data.filter(interaction =>
              interaction.customers.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              interaction.users.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              interaction.discussion_topics?.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : data;
        setInteractions(filtered);
      }
    } catch (error) {
      console.error('Error loading interactions:', error);
      alert('Error loading interactions');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this interaction?')) return;

    try {
      const { error } = await supabase
        .from('interactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setInteractions(interactions.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting interaction:', error);
      alert('Error deleting interaction');
    }
  }

  function toggleSort(field: keyof Interaction) {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }

  const SortIcon = ({ field }: { field: keyof Interaction }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
  <>
    <UserNavbar userRole={userRole} handleSignOut={handleSignOut} />
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Interactions</h2>
          <Link
            to="/interactions/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Interaction
          </Link>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search interactions..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                loadInteractions();
              }}
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as Interaction['interaction_type'] | '')}
            className="w-full sm:w-48 border rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Types</option>
            <option value="In-person">In-person</option>
            <option value="Virtual">Virtual</option>
            <option value="Email">Email</option>
          </select>
          
          <select
            value={complianceFilter}
            onChange={(e) => setComplianceFilter(e.target.value as typeof complianceFilter)}
            className="w-full sm:w-48 border rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="flagged">Flagged</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 sm:flex-initial">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full border rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex-1 sm:flex-initial">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full border rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort('interaction_date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <SortIcon field="interaction_date" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort('interaction_type')}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  <SortIcon field="interaction_type" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {interactions.map((interaction) => (
              <tr key={interaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(interaction.interaction_date), 'MMM d, yyyy h:mm a')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {interaction.customers?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {interaction.users?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {interaction.interaction_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {interaction.compliance_approved ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    ) : interaction.compliance_flag ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Flagged
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Pending
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-3">
                    <Link
                      to={`/interactions/${interaction.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit2 className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(interaction.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
  );
}