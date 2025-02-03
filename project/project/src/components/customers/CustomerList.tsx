import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Search, SortAsc, SortDesc } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Customer } from '../../types/types';
import UserNavbar from '../UserNavbar';

export default function CustomerList() {
  const userRole = "Admin";
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Customer>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [specialty, setSpecialty] = useState<string>('');
  const [specialties, setSpecialties] = useState<string[]>([]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [sortField, sortDirection, specialty]);

  async function loadCustomers() {
    try {
      setLoading(true);
      let query = supabase
        .from('customers')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });

      if (specialty) {
        query = query.eq('specialty', specialty);
      }

      const { data, error } = await query;
      if (error) throw error;

      if (data) {
        setCustomers(data);
        const uniqueSpecialties = Array.from(new Set(data.map(c => c.specialty).filter(Boolean)));
        setSpecialties(uniqueSpecialties);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(unique_hcp_id: string) {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('unique_hcp_id', unique_hcp_id);

      if (error) throw error;
      setCustomers(customers.filter(c => c.unique_hcp_id !== unique_hcp_id));
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Error deleting customer');
    }
  }

  function toggleSort(field: keyof Customer) {
    setSortField(field);
    setSortDirection(sortField === field ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc');
  }

  const SortIcon = ({ field }: { field: keyof Customer }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
  };

  if (loading) {
    return <div className="text-center py-5 text-gray-600">Loading...</div>;
  }

  return (
    <>
      <UserNavbar userRole={userRole} handleSignOut={handleSignOut} />

      <div className="bg-white shadow-md rounded-lg p-4 max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800">HCP List</h2>

        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search HCP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring focus:ring-blue-300"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          </div>

          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">All Specialties</option>
            {specialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <Link to="/customers/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
          Add HCP
        </Link>
      </div>

      <div className="mt-4 border rounded-lg overflow-hidden max-w-7xl mx-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {(['name', 'unique_hcp_id', 'specialty', 'affiliation', 'email'] as (keyof Customer)[]).map((field) => (
                <th key={field} className="px-4 py-3 cursor-pointer hover:bg-gray-200" onClick={() => toggleSort(field)}>
                  <div className="flex items-center space-x-1">
                    <span className="capitalize">{field.replace(/_/g, ' ')}</span>
                    <SortIcon field={field} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {customers.map((customer, index) => (
              <tr key={customer.unique_hcp_id} className={`${index % 2 ? 'bg-gray-50' : ''} hover:bg-gray-100`}>
                <td className="px-4 py-3">
                  <Link to={`/customerdetails/${customer.unique_hcp_id}`} className="text-blue-600 hover:underline">
                    {customer.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{customer.unique_hcp_id}</td>
                <td className="px-4 py-3">{customer.specialty}</td>
                <td className="px-4 py-3">{customer.affiliation}</td>
                <td className="px-4 py-3">{customer.email}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex space-x-3">
                    <Link to={`/customers/${customer.unique_hcp_id}`} className="text-blue-500 hover:text-blue-700">
                      <Edit2 className="h-5 w-5" />
                    </Link>
                    <button onClick={() => handleDelete(customer.unique_hcp_id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
