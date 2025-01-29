import { useState } from 'react';
import { Users, MessageSquare, Bell, Plus, FileText, Activity } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ChatHistory from './panels/ChatHistory';
import ChatWindow from './panels/ChatWindow';
import TeamOverview from './panels/TeamOverview';
import KolEngagementHeatmap from './panels/KolEngagementHeatmap';
import ComplianceAlerts from './panels/ComplianceAlerts';
import PerformanceMetrics from './panels/PerformanceMetrics';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import UserNavbar from '../UserNavbar';


export default function ManagerDashboard() {
  const userRole = "Admin"; // Replace this with actual logic to determine the user's role
      const handleSignOut = async () => {
        try {
          await supabase.auth.signOut();
          navigate('/login');
        } catch (error) {
          console.error('Error signing out:', error);
        }
      }
      const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

      const handleNewConversation = () => {
        const newConversationId = uuidv4();
        setActiveConversationId(newConversationId);
      };
    
      const handleSelectConversation = (conversationId: string) => {
        setActiveConversationId(conversationId);
      };

  const navigate = useNavigate();
  
  return (
    <>
    <UserNavbar userRole={userRole} handleSignOut={handleSignOut} />
    <div className="h-[calc(100vh-4rem)] flex">
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
      <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Quick Links */}
          <div className="flex space-x-2">
            <button className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </button>
            <button className="flex-1 flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              <FileText className="h-4 w-4 mr-2" />
              Export Data
            </button>
          </div>

          {/* Team Overview */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center text-gray-900">
                <Users className="h-5 w-5 mr-2 text-indigo-600" />
                Team Overview
              </h2>
            </div>
            <TeamOverview />
          </div>

          {/* KOL Engagement Heatmap */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center text-gray-900">
                <Activity className="h-5 w-5 mr-2 text-indigo-600" />
                KOL Engagement
              </h2>
            </div>
            <KolEngagementHeatmap />
          </div>

          {/* Compliance Alerts */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center text-gray-900">
                <Bell className="h-5 w-5 mr-2 text-indigo-600" />
                Compliance Alerts
              </h2>
            </div>
            <ComplianceAlerts />
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center text-gray-900">
                <MessageSquare className="h-5 w-5 mr-2 text-indigo-600" />
                Performance Metrics
              </h2>
            </div>
            <PerformanceMetrics />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}