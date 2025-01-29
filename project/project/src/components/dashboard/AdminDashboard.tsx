import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
interface UserNavbarProps {
  
  handleSignOut: () => void;
}

const AdminDashboard: React.FC<UserNavbarProps> = ({}) => {
  const navigate = useNavigate();
  return (
    <nav className="bg-indigo-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-lg font-semibold">Admin Panel</h1>
              <div className="flex space-x-4">
                <Link
                  to="/users"
                  className="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Manage Users
                </Link>
                <button
                  onClick={() => navigate('/adminlogin')}
                  className="hover:bg-red-700 bg-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </nav>
  );
};

export default AdminDashboard;
