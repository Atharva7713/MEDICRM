import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { User } from '../../types/types';

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User & { password?: string }>({
    id: '',
    name: '',
    email: '',
    role: 'MSL',
    phone: '',
    region: '',
    password: '', // for new users only
  });

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);

  async function loadUser() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) setUser(data);
    } catch (error) {
      console.error('Error loading user:', error);
      setError('Error loading user. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      if (!id) {
        // For new users, first create auth user
        if (!user.password) {
          throw new Error('Password is required for new users');
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Failed to create user');

        // Create user profile with auth user id
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || null,
            region: user.region || null,
          }]);

        if (profileError) throw profileError;
      } else {
        // Update existing user
        const { error: updateError } = await supabase
          .from('users')
          .update({
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || null,
            region: user.region || null,
          })
          .eq('id', id);

        if (updateError) throw updateError;
      }

      navigate('/users');
    } catch (error) {
      console.error('Error saving user:', error);
      setError(error instanceof Error ? error.message : 'Error saving user. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Edit User' : 'New User'}</h2>
      
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
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {!id && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <p className="mt-1 text-sm text-gray-500">Must be at least 6 characters long</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            required
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value as User['role'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="MSL">MSL</option>
            <option value="MSL Manager">MSL Manager</option>
            <option value="System Manager">System Manager</option>
            <option value="Compliance Manager">Compliance Manager</option>
            <option value="Database Manager">Database Manager</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={user.phone || ''}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Region</label>
          <input
            type="text"
            value={user.region || ''}
            onChange={(e) => setUser({ ...user, region: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/users')}
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
  );
}


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { supabase } from '../../lib/supabase';
// import type { User } from '../../types';

// export default function UserForm() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [user, setUser] = useState<User & { password?: string }>({
//     id: '',
//     name: '',
//     email: '',
//     role: 'MSL',
//     phone: '',
//     region: '',
//     global_ds_id: '',
//     basic_contact_details:"",
//     training_records: "",
//     group: 'Group 1',
//     password: '', // for new users only
//   });

//   useEffect(() => {
//     if (id) {
//       loadUser();
//     }
//   }, [id]);

//   async function loadUser() {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .eq('id', id)
//         .single();

//       if (error) throw error;
//       if (data) setUser(data);
//     } catch (error) {
//       console.error('Error loading user:', error);
//       setError('Error loading user. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);

//     try {
//       setLoading(true);

//       if (!id) {
//         if (!user.password) {
//           throw new Error('Password is required for new users');
//         }

//         const { data: authData, error: authError } = await supabase.auth.signUp({
//           email: user.email,
//           password: user.password,
//         });

//         if (authError) throw authError;
//         if (!authData.user) throw new Error('Failed to create user');

//         const { error: profileError } = await supabase
//           .from('users')
//           .insert([{
//             id: authData.user.id,
//             name: user.name,
//             email: user.email,
//             role: user.role,
//             phone: user.phone || null,
//             region: user.region || null,
//             global_ds_id: user.global_ds_id,
//             basic_contact_details: user.basic_contact_details,
//             training_records: user.training_records,
//             group: user.group,
//           }]);

//         if (profileError) throw profileError;
//       } else {
//         const { error: updateError } = await supabase
//           .from('users')
//           .update({
//             name: user.name,
//             email: user.email,
//             role: user.role,
//             phone: user.phone || null,
//             region: user.region || null,
//             global_ds_id: user.global_ds_id,
//             basic_contact_details: user.basic_contact_details,
//             training_records: user.training_records,
//             group: user.group,
//           })
//           .eq('id', id);

//         if (updateError) throw updateError;
//       }

//       navigate('/users');
//     } catch (error) {
//       console.error('Error saving user:', error);
//       setError(error instanceof Error ? error.message : 'Error saving user. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="bg-white shadow rounded-lg p-6">
//       <h2 className="text-2xl font-bold mb-6">{id ? 'Edit User' : 'New User'}</h2>
      
//       {error && (
//         <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Name</label>
//           <input
//             type="text"
//             required
//             value={user.name}
//             onChange={(e) => setUser({ ...user, name: e.target.value })}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Email</label>
//           <input
//             type="email"
//             required
//             value={user.email}
//             onChange={(e) => setUser({ ...user, email: e.target.value })}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//           />
//         </div>

//         {!id && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               type="password"
//               required
//               minLength={6}
//               value={user.password}
//               onChange={(e) => setUser({ ...user, password: e.target.value })}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//             />
//             <p className="mt-1 text-sm text-gray-500">Must be at least 6 characters long</p>
//           </div>
//         )}

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Global DS ID</label>
//           <input
//             type="text"
//             required
//             value={user.global_ds_id}
//             onChange={(e) => setUser({ ...user, global_ds_id: e.target.value })}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Basic Contact Details</label>
//           <textarea
//             value={JSON.stringify(user.basic_contact_details, null, 2)}
//             onChange={(e) =>
//               setUser({ ...user, basic_contact_details: JSON.parse(e.target.value || '{}') })
//             }
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//             rows={4}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Training Records</label>
//           <textarea
//             value={JSON.stringify(user.training_records, null, 2)}
//             onChange={(e) =>
//               setUser({ ...user, training_records: JSON.parse(e.target.value || '{}') })
//             }
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//             rows={4}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Group</label>
//           <select
//             required
//             value={user.group}
//             onChange={(e) => setUser({ ...user, group: e.target.value })}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//           >
//             <option value="Group 1">Group 1</option>
//             <option value="Group 2">Group 2</option>
//             <option value="Group 3">Group 3</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Role</label>
//           <select
//             required
//             value={user.role}
//             onChange={(e) => setUser({ ...user, role: e.target.value as User['role'] })}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//           >
//             <option value="MSL">MSL</option>
//             <option value="MSL Manager">MSL Manager</option>
//             <option value="System Manager">System Manager</option>
//             <option value="Compliance Manager">Compliance Manager</option>
//             <option value="Database Manager">Database Manager</option>
//             <option value="Institute Member">Institute Member</option>
//             <option value="Other">Other</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Phone</label>
//           <input
//             type="tel"
//             value={user.phone || ''}
//             onChange={(e) => setUser({ ...user, phone: e.target.value })}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Region</label>
//           <input
//             type="text"
//             value={user.region || ''}
//             onChange={(e) => setUser({ ...user, region: e.target.value })}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//           />
//         </div>

//         <div className="flex justify-end space-x-4">
//           <button
//             type="button"
//             onClick={() => navigate('/users')}
//             className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             {loading ? 'Saving...' : 'Save'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }