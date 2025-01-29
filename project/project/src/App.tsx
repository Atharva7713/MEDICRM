import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AdminSignupForm from './components/auth/AdminSignupForm';
import AdminLoginForm from './components/auth/AdminLoginForm';
import UserLoginForm from './components/auth/UserLoginForm';
import CustomerList from './components/customers/CustomerList';
import CustomerForm from './components/customers/CustomerForm';
import UserList from './components/users/UserList';
import UserForm from './components/users/UserForm';
import InteractionList from './components/interactions/InteractionList';
import InteractionForm from './components/interactions/InteractionForm';
import TaskList from './components/tasks/TaskList';
import TaskForm from './components/tasks/TaskForm';
import PrevisitList from './components/previsit/PrevisitList';
import PrevisitReport from './components/previsit/PrevisitReport';
import DataSourcesList from './components/datasources/DataSourcesList';
import UserMainPage from './components/UserMainPage';
import MslDashboard from './components/dashboard/MslDashboard';
import ManagerDashboard from './components/dashboard/ManagerDashboard';
import { supabase } from './lib/supabase';
import { useAuth } from './contexts/AuthContext';
import MainDashboard from './components/Main_Dashboard/MainDashboard';
import ChatWithRAG from './components/chat/ChatWithRAG';
import AdminDashboard from './components/dashboard/AdminDashboard';
import CustomerDetails from './components/customers/CustomerDetails';

function AdminContent() {
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      navigate('/maindashboard');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/users" element={<UserList />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/:id" element={<UserForm />} />
          <Route path="/maindashboard" element={<MainDashboard />} />
          <Route path="/admindashboard" element={<AdminDashboard handleSignOut={handleSignOut} />}/>
          <Route path="/userdash" element={<UserList />} />
          <Route path="/adminlogin" element={<AdminLoginForm />} />
          <Route path="/" element={<UserMainPage />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/:id" element={<CustomerForm />} />
          <Route path="/interactions" element={<InteractionList />} />
          <Route path="/interactions/new" element={<InteractionForm />} />
          <Route path="/interactions/:id" element={<InteractionForm />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/new" element={<TaskForm />} />
          <Route path="/tasks/:id" element={<TaskForm />} />
          <Route path="/previsit" element={<PrevisitList />} />
          <Route path="/previsit/:id" element={<PrevisitReport />} />
          <Route path="/datasources" element={<DataSourcesList />} />
          <Route path="/dashboard/msl" element={<MslDashboard />} />
          <Route path="/dashboard/manager" element={<ManagerDashboard />} />
          <Route path="/maindashboard" element={<MainDashboard />} />
          <Route path="/admin/signup" element={<AdminSignupForm />} />
          <Route path="/chat" element={<ChatWithRAG />} />
          <Route path="/customerdetails/:id" element={<CustomerDetails />} />
        </Routes>
      </div>
    </div>
  );
}

function UserContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userRole, setUserRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function getUserRole() {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setUserRole(data.role);
        }
      }
    }
    getUserRole();
  }, [user]);

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
        <Route path="/users" element={<UserList />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/:id" element={<UserForm />} />
          <Route path="/maindashboard" element={<MainDashboard />} />
          <Route path="/admindashboard" element={<AdminDashboard handleSignOut={handleSignOut} />}/>
          <Route path="/userdash" element={<UserList />} />
          <Route path="/adminlogin" element={<AdminLoginForm />} />
          <Route path="/" element={<UserMainPage />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/:id" element={<CustomerForm />} />
          <Route path="/interactions" element={<InteractionList />} />
          <Route path="/interactions/new" element={<InteractionForm />} />
          <Route path="/interactions/:id" element={<InteractionForm />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/new" element={<TaskForm />} />
          <Route path="/tasks/:id" element={<TaskForm />} />
          <Route path="/previsit" element={<PrevisitList />} />
          <Route path="/previsit/:id" element={<PrevisitReport />} />
          <Route path="/datasources" element={<DataSourcesList />} />
          <Route path="/dashboard/msl" element={<MslDashboard />} />
          <Route path="/dashboard/manager" element={<ManagerDashboard />} />
          <Route path="/maindashboard" element={<MainDashboard />} />
          <Route path="/admin/signup" element={<AdminSignupForm />} />
          <Route path="/chat" element={<ChatWithRAG />} />
          <Route path="/customerdetails/:id" element={<CustomerDetails />} />
          
       </Routes>
      </div>
    </div>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function checkAdminStatus() {
      try {
        if (!user) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('admins')
          .select('*')
          .eq('auth_id', user.id);

        if (error) throw error;
        setIsAdmin(data && data.length > 0);
        setError(null);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setError('Unable to verify admin status. Please try again later.');
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminStatus();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Connection Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/admin/signup" element={<AdminSignupForm />} />
        <Route path="/adminlogin" element={<AdminLoginForm />} />
        <Route path="/login" element={<UserLoginForm />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return isAdmin ? <AdminContent /> : <UserContent />;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
