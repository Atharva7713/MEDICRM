import {useState} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, Bell, Plus, FileText } from 'lucide-react';
import ChatHistory from './panels/ChatHistory';
import ChatWindow from './panels/ChatWindow';
import UpcomingVisits from './panels/UpcomingVisits';
import PendingActions from './panels/PendingActions';
import RecentInteractions from './panels/RecentInteractions';
import { supabase } from '../../lib/supabase';
import Notifications from './panels/Notifications';
import UserNavbar from '../UserNavbar';


export default function MslDashboard() {
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
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

      const handleNewConversation = () => {
        const newConversationId = uuidv4();
        setActiveConversationId(newConversationId);
      };
    
      const handleSelectConversation = (conversationId: string) => {
        setActiveConversationId(conversationId);
      };
  
  return (
    <>
    <UserNavbar userRole={userRole} handleSignOut={handleSignOut} />
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Left Panel - Chat History */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
              <ChatHistory
                onSelectConversation={handleSelectConversation}
                activeConversationId={activeConversationId}
              />
            </div>
            {/* <div className="w-2/3"> */}
            <div className="flex-1 flex flex-col bg-gray-50">
              <ChatWindow
                conversationId={activeConversationId}
                onNewConversation={handleNewConversation}
              />
            </div>
      {/* Right Panel */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Quick Links */}
          <div className="flex space-x-2">
            <button className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Interaction
            </button>
            <button className="flex-1 flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </button>
          </div>

          {/* Upcoming Visits */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center text-gray-900">
                <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                Upcoming Visits
              </h2>
            </div>
            <UpcomingVisits />
          </div>

          {/* Pending Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center text-gray-900">
                <MessageSquare className="h-5 w-5 mr-2 text-indigo-600" />
                Pending Actions
              </h2>
            </div>
            <PendingActions />
          </div>

          {/* Recent Interactions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center text-gray-900">
                <MessageSquare className="h-5 w-5 mr-2 text-indigo-600" />
                Recent Interactions
              </h2>
            </div>
            <RecentInteractions />
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center text-gray-900">
                <Bell className="h-5 w-5 mr-2 text-indigo-600" />
                Notifications
              </h2>
            </div>
            <Notifications />
          </div>
        </div>
      </div>
    </div>
</>
  );
}