import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Search, SortAsc, SortDesc } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Customer } from '../../types/types';
import UserNavbar from '../UserNavbar';
 
export default function CustomerList() {
  const userRole = "Admin"; // Replace this with actual logic to determine the user's role
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
 
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Customer>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [specialty, setSpecialty] = useState<string>('');
  const [specialties, setSpecialties] = useState<string[]>([]);
 
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
        const uniqueSpecialties = Array.from(new Set(data.map(c => c.specialty).filter(Boolean)));
        setSpecialties(uniqueSpecialties as string[]);
 
        const filtered = searchTerm
          ? data.filter(customer =>
              customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              customer.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              customer.affiliation?.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : data;
        setCustomers(filtered);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      alert('Error loading customers');
    } finally {
      setLoading(false);
    }
  }
 
  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this customer?')) return;
 
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
 
      if (error) throw error;
      setCustomers(customers.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Error deleting customer');
    }
  }
 
  function toggleSort(field: keyof Customer) {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }
 
  const SortIcon = ({ field }: { field: keyof Customer }) => {
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
            <h2 className="text-xl font-semibold text-gray-900">Customers</h2>
            <Link
              to="/customers/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Customer
            </Link>
          </div>
 
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  loadCustomers();
                }}
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
 
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full sm:w-48 border rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Specialties</option>
              {specialties.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
 
        <div className="border-t border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    <SortIcon field="name" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('specialty')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Specialty</span>
                    <SortIcon field="specialty" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('affiliation')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Affiliation</span>
                    <SortIcon field="affiliation" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('email')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Email</span>
                    <SortIcon field="email" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {/* {customer.picture_url && (
                        <img
                          className="h-10 w-10 rounded-full mr-3 object-cover"
                          src={customer.picture_url}
                          alt={customer.name}
                        />
                      )} */}
                      <Link
                        to={`/customerdetails/${customer.id}`}
                        className="text-sm font-medium text-indigo-600 hover:underline">
                        {customer.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.specialty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.affiliation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-3">
                      <Link
                        to={`/customers/${customer.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(customer.id)}
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