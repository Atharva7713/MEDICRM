import { Link,  useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function MainDashboard() {
  const navigate = useNavigate();

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut(); // Sign out the user
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  
  return (
    <>

      {/* Navbar */}
      <nav className="bg-indigo-600 text-white py-4 px-6 shadow-md">
        <div className="flex justify-between items-center">
          <ul className="flex space-x-6">
            <li>
              <Link to="/adminlogin" className="hover:underline">User Management</Link>
            </li>
            <li>
              <Link to="/" className="hover:underline">Medical Affairs CRM</Link>
            </li>
            <li>
              <Link to="/sales-crm" className="hover:underline">Sales CRM</Link>
            </li>
            <li>
              <Link to="/ctms" className="hover:underline">CTMS</Link>
            </li>
            <li>
              <Link to="/iis" className="hover:underline">IIS</Link>
            </li>
            <li>
              <Link to="/map" className="hover:underline">MAP</Link>
            </li>
            <li>
              <Link to="/legal" className="hover:underline">Legal</Link>
            </li>
          </ul>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 hover:bg-indigo-700 px-3 py-2 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Log Out</span>
          </button>
        </div>
      </nav>

    </>
  );
}
