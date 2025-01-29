import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import UserNavbar from '../UserNavbar';
import type { Interaction, Customer, User } from '../../types/types';

export default function InteractionForm() {
  const userRole = "Admin"; // Replace this with actual logic to determine the user's role
    const handleSignOut = async () => {
      try {
        await supabase.auth.signOut();
        navigate('/login');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [interaction, setInteraction] = useState<Omit<Interaction, 'id'>>({
    customer_id: '',
    user_id: '',
    interaction_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    interaction_type: 'In-person',
    discussion_topics: '',
    follow_up_description: '',
    follow_up_due_date: '',
    compliance_approved: false,
    compliance_flag: false,
  });

  useEffect(() => {
    Promise.all([loadCustomers(), loadUsers()]);
    if (id) {
      loadInteraction();
    }
  }, [id]);

  async function loadCustomers() {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name')
        .order('name');

      if (error) throw error;
      if (data) setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
      setError('Error loading customers. Please try again.');
    }
  }

  async function loadUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name')
        .order('name');

      if (error) throw error;
      if (data) setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Error loading users. Please try again.');
    }
  }

  async function loadInteraction() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('interactions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        const { id: _id, ...interactionData } = data;
        setInteraction(interactionData);
      }
    } catch (error) {
      console.error('Error loading interaction:', error);
      setError('Error loading interaction. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!interaction.customer_id || interaction.customer_id.trim() === '') {
      setError('Please select a customer');
      return;
    }

    if (!interaction.user_id || interaction.user_id.trim() === '') {
      setError('Please select a user');
      return;
    }

    try {
      setLoading(true);

      // Ensure we have valid UUIDs
      if (!isValidUUID(interaction.customer_id) || !isValidUUID(interaction.user_id)) {
        throw new Error('Invalid customer or user selection');
      }

      const { error: saveError } = id
        ? await supabase
            .from('interactions')
            .update(interaction)
            .eq('id', id)
        : await supabase
            .from('interactions')
            .insert([interaction]);

      if (saveError) throw saveError;
      
      navigate('/interactions');
    } catch (error) {
      console.error('Error saving interaction:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'Error saving interaction. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  // Helper function to validate UUID format
  function isValidUUID(uuid: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
  <>
   <UserNavbar userRole={userRole} handleSignOut={handleSignOut} />
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Interaction' : 'New Interaction'}</h2>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer</label>
          <select
            required
            value={interaction.customer_id}
            onChange={(e) => setInteraction({ ...interaction, customer_id: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">User</label>
          <select
            required
            value={interaction.user_id}
            onChange={(e) => setInteraction({ ...interaction, user_id: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Interaction Date</label>
          <input
            type="datetime-local"
            required
            value={interaction.interaction_date}
            onChange={(e) => setInteraction({ ...interaction, interaction_date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Interaction Type</label>
          <select
            required
            value={interaction.interaction_type}
            onChange={(e) => setInteraction({ ...interaction, interaction_type: e.target.value as Interaction['interaction_type'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="In-person">In-person</option>
            <option value="Virtual">Virtual</option>
            <option value="Email">Email</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Discussion Topics</label>
          <textarea
            value={interaction.discussion_topics || ''}
            onChange={(e) => setInteraction({ ...interaction, discussion_topics: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Follow-up Description</label>
          <textarea
            value={interaction.follow_up_description || ''}
            onChange={(e) => setInteraction({ ...interaction, follow_up_description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Follow-up Due Date</label>
          <input
            type="date"
            value={interaction.follow_up_due_date || ''}
            onChange={(e) => setInteraction({ ...interaction, follow_up_due_date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="compliance_approved"
              checked={interaction.compliance_approved}
              onChange={(e) => setInteraction({ ...interaction, compliance_approved: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="compliance_approved" className="ml-2 block text-sm text-gray-700">
              Compliance Approved
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="compliance_flag"
              checked={interaction.compliance_flag}
              onChange={(e) => setInteraction({ ...interaction, compliance_flag: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="compliance_flag" className="ml-2 block text-sm text-gray-700">
              Compliance Flag
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/interactions')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
    </>
  );
}