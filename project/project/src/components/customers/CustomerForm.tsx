import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Customer } from '../../types/types';
import UserNavbar from '../UserNavbar';

export default function CustomerForm() {
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
  const [customer, setCustomer] = useState<Omit<Customer, 'id'>>({
    name: '',
    //picture_url: '',
    specialty: '',
    affiliation: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    if (id && id !== "new") {
      loadCustomer();
    }
  }, [id]);

  function isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
  

  async function loadCustomer() {
    if (!id || !isValidUUID(id)) {
      console.warn("Invalid or missing customer ID");
      return;
    }
  
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();
  
      if (error) throw error;
      if (data) setCustomer(data);
    } catch (error) {
      console.error("Error loading customer:", error);
      setError("Error loading customer. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
  
    try {
      setLoading(true);
  
      if (id && id !== "new") {
        // Update existing customer
        const { error } = await supabase
          .from("customers")
          .update(customer)
          .eq("id", id);
  
        if (error) throw error;
      } else {
        // Create new customer
        const { error } = await supabase
          .from("customers")
          .insert([customer]);
  
        if (error) throw error;
      }
  
      navigate("/customers");
    } catch (error) {
      console.error("Error saving customer:", error);
      setError("Error saving customer. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  
  

  return (
  <>
    <UserNavbar userRole={userRole} handleSignOut={handleSignOut} />
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Customer' : 'New Customer'}</h2>
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            required
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        

        <div>
          <label className="block text-sm font-medium text-gray-700">Specialty</label>
          <input
            type="text"
            value={customer.specialty || ''}
            onChange={(e) => setCustomer({ ...customer, specialty: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Affiliation</label>
          <input
            type="text"
            value={customer.affiliation || ''}
            onChange={(e) => setCustomer({ ...customer, affiliation: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={customer.phone || ''}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={customer.email || ''}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            value={customer.address || ''}
            onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/customers')}
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