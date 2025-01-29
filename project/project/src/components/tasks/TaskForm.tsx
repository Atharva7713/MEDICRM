import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import UserNavbar from '../UserNavbar';
import type { User, Customer, Interaction, Task } from '../../types/types';

export default function TaskForm() {
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mslUsers, setMslUsers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [showOtherField, setShowOtherField] = useState(false);
  const [showInteractionSelect, setShowInteractionSelect] = useState(false);

  const [formData, setFormData] = useState<Partial<Task>>({
    task_created_by: user?.id || '',
    task_requested_by: '',
    task_requested_by_other: '',
    task_assigned_to: '',
    customer_id: '',
    task_description: '',
    due_date: '',
    status: 'Pending',
    is_interaction_related: false,
    interaction_id: '',
  });

  useEffect(() => {
    Promise.all([loadMslUsers(), loadCustomers()]);
    if (id) {
      loadTask();
    }
  }, [id]);

  useEffect(() => {
    if (formData.is_interaction_related && formData.customer_id) {
      loadCustomerInteractions(formData.customer_id);
    }
  }, [formData.is_interaction_related, formData.customer_id]);

  async function loadTask() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          ...data,
          is_interaction_related: !!data.interaction_id,
        });
        setShowOtherField(data.task_requested_by === 'Other');
        setShowInteractionSelect(!!data.interaction_id);
      }
    } catch (error) {
      console.error('Error loading task:', error);
      setError('Error loading task');
    } finally {
      setLoading(false);
    }
  }

  async function loadMslUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'MSL')
        .order('name');

      if (error) throw error;
      if (data) setMslUsers(data);
    } catch (error) {
      console.error('Error loading MSL users:', error);
      setError('Error loading MSL users');
    }
  }

  async function loadCustomers() {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (error) throw error;
      if (data) setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
      setError('Error loading customers');
    }
  }

  async function loadCustomerInteractions(customerId: string) {
    try {
      const { data, error } = await supabase
        .from('interactions')
        .select('*')
        .eq('customer_id', customerId)
        .order('interaction_date', { ascending: false });

      if (error) throw error;
      if (data) setInteractions(data);
    } catch (error) {
      console.error('Error loading interactions:', error);
      setError('Error loading interactions');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const taskData = {
        task_created_by: formData.task_created_by,
        task_requested_by: formData.task_requested_by === 'Other' 
          ? formData.task_requested_by_other 
          : formData.task_requested_by,
        task_assigned_to: formData.task_assigned_to,
        customer_id: formData.customer_id,
        task_description: formData.task_description,
        due_date: formData.due_date,
        status: formData.status,
        interaction_id: formData.is_interaction_related ? formData.interaction_id : null,
      };

      if (id) {
        const { error: updateError } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', id);

        if (updateError) throw updateError;
        alert('Task successfully updated');
      } else {
        const { error: insertError } = await supabase
          .from('tasks')
          .insert([taskData]);

        if (insertError) throw insertError;
        alert('Task successfully created');
      }

      navigate('/tasks');
    } catch (error) {
      console.error('Error saving task:', error);
      setError(error instanceof Error ? error.message : 'Error saving task');
    } finally {
      setLoading(false);
    }
  }

  return (
  <>
    <UserNavbar userRole={userRole} handleSignOut={handleSignOut} />
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Task' : 'Add Task'}</h2>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Task Requested By</label>
          <select
            required
            value={formData.task_requested_by}
            onChange={(e) => {
              setFormData({ ...formData, task_requested_by: e.target.value });
              setShowOtherField(e.target.value === 'Other');
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select requestor</option>
            <option value="MSL Manager">MSL Manager</option>
            <option value="System Manager">System Manager</option>
            <option value="GMA">GMA</option>
            <option value="Care Team">Care Team</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {showOtherField && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Specify Other</label>
            <input
              type="text"
              required
              value={formData.task_requested_by_other || ''}
              onChange={(e) => setFormData({ ...formData, task_requested_by_other: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Task Assigned To</label>
          <select
            required
            value={formData.task_assigned_to || ''}
            onChange={(e) => setFormData({ ...formData, task_assigned_to: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select MSL</option>
            {mslUsers.map((msl) => (
              <option key={msl.id} value={msl.id}>
                {msl.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Customer Account</label>
          <select
            required
            value={formData.customer_id || ''}
            onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Task Description</label>
          <textarea
            required
            value={formData.task_description || ''}
            onChange={(e) => setFormData({ ...formData, task_description: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            required
            value={formData.due_date || ''}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {id && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              required
              value={formData.status || 'Pending'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_interaction_related"
              checked={formData.is_interaction_related}
              onChange={(e) => {
                setFormData({ ...formData, is_interaction_related: e.target.checked });
                setShowInteractionSelect(e.target.checked);
              }}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="is_interaction_related" className="ml-2 block text-sm text-gray-700">
              Is this task associated with an interaction?
            </label>
          </div>

          {showInteractionSelect && formData.customer_id && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Interaction</label>
              <select
                required
                value={formData.interaction_id || ''}
                onChange={(e) => setFormData({ ...formData, interaction_id: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select interaction</option>
                {interactions.map((interaction) => (
                  <option key={interaction.id} value={interaction.id}>
                    {new Date(interaction.interaction_date).toLocaleDateString()} - {interaction.interaction_type}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Saving...' : (id ? 'Update Task' : 'Create Task')}
          </button>
        </div>
      </form>
    </div>
  </>
  );
}