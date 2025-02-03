// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { supabase } from '../../lib/supabase';
// import UserNavbar from '../UserNavbar';

// interface InteractionDetails {
//   id: string;
//   interaction_date: string;
//   interaction_type: string;
//   discussion_topics: string;
//   customers: { name: string };
//   users: { name: string };
//   compliance_approved: boolean;
//   compliance_flag: boolean;
// }

// export default function InteractionDetails() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [interaction, setInteraction] = useState<InteractionDetails | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (id) {
//       fetchInteractionDetails();
//     }
//   }, [id]);

//   async function fetchInteractionDetails() {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('interactions')
//         .select(`
//           *,
//           customers (name),
//           users (name)
//         `)
//         .eq('id', id)
//         .single();

//       if (error) throw error;
//       setInteraction(data);
//     } catch (error) {
//       console.error('Error fetching interaction details:', error);
//       alert('Error fetching interaction details. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loading) {
//     return <div className="text-center">Loading...</div>;
//   }

//   if (!interaction) {
//     return <div className="text-center">Interaction not found</div>;
//   }

//   return (
//     <>
//       <UserNavbar userRole="Admin" handleSignOut={() => {}} />
//       <div className="bg-white shadow rounded-lg p-6">
//         <h2 className="text-xl font-semibold text-gray-900 mb-4">Interaction Details</h2>
//         <table className="min-w-full divide-y divide-gray-200">
//           <tbody className="divide-y divide-gray-200">
//             <tr>
//               <td className="px-6 py-4 w-1/3 bg-gray-50">
//                 <div className="text-sm font-medium text-gray-900">HCP Name</div>
//               </td>
//               <td className="px-6 py-4">
//                 <div className="text-sm text-gray-900">{interaction.customers?.name}</div>
//               </td>
//             </tr>
//             <tr>
//               <td className="px-6 py-4 w-1/3 bg-gray-50">
//                 <div className="text-sm font-medium text-gray-900">User</div>
//               </td>
//               <td className="px-6 py-4">
//                 <div className="text-sm text-gray-900">{interaction.users?.name}</div>
//               </td>
//             </tr>
//             <tr>
//               <td className="px-6 py-4 w-1/3 bg-gray-50">
//                 <div className="text-sm font-medium text-gray-900">Interaction Date</div>
//               </td>
//               <td className="px-6 py-4">
//                 <div className="text-sm text-gray-900">
//                   {new Date(interaction.interaction_date).toLocaleString()}
//                 </div>
//               </td>
//             </tr>
//             <tr>
//               <td className="px-6 py-4 w-1/3 bg-gray-50">
//                 <div className="text-sm font-medium text-gray-900">Interaction Type</div>
//               </td>
//               <td className="px-6 py-4">
//                 <div className="text-sm text-gray-900">{interaction.interaction_type}</div>
//               </td>
//             </tr>
//             <tr>
//               <td className="px-6 py-4 w-1/3 bg-gray-50">
//                 <div className="text-sm font-medium text-gray-900">Proposed Discussion Topics</div>
//               </td>
//               <td className="px-6 py-4">
//                 <div className="text-sm text-gray-900">{interaction.discussion_topics}</div>
//               </td>
//             </tr>
//             <tr>
//               <td className="px-6 py-4 w-1/3 bg-gray-50">
//                 <div className="text-sm font-medium text-gray-900">Compliance Status</div>
//               </td>
//               <td className="px-6 py-4">
//                 <div className="text-sm text-gray-900">
//                   {interaction.compliance_approved ? 'Approved' : interaction.compliance_flag ? 'Flagged' : 'Pending'}
//                 </div>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// }























import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import UserNavbar from '../UserNavbar';

interface InteractionDetails {
  id: string;
  interaction_date: string;
  interaction_type: string;
  discussion_topics: string;
  customers: { name: string };
  users: { name: string };
  compliance_approved: boolean;
  compliance_flag: boolean;
}

export default function InteractionDetails() {
  const { id } = useParams<{ id: string }>();
  const [interaction, setInteraction] = useState<InteractionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInteraction() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('interactions')
          .select(`
            *,
            customers (name),
            users (name)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setInteraction(data);
      } catch (error) {
        console.error('Error loading interaction:', error);
      } finally {
        setLoading(false);
      }
    }

    loadInteraction();
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!interaction) {
    return <div className="text-center">Interaction not found.</div>;
  }

  // Dummy data for pre-visit and post-visit reports
  const dummyPrevisitReport = {
    hcpName: interaction.customers?.name,
    user: interaction.users?.name,
    interactionDate: new Date(interaction.interaction_date).toLocaleString(),
    interactionType: 'Last meeting discussed clinical trials results for Drug X. Follow-up questions about efficacy data were addressed. Showed interest in upcoming phase III trials',
    proposedTopics: interaction.discussion_topics,
    recentProfileChanges: 'Published new research paper on immunotherapy approaches. Appointed as department head at University Hospital. Joined editorial board of Medical Journal.',
    preVisitActionItems: [
      { task: 'Review latest clinical data', status: 'Completed', solution: 'Clinical data review completed and summary prepared' },
      { task: 'Prepare presentation slides', status: 'In Progress', solution: 'Draft slides under review' }
    ]
  };

  const dummyPostVisitReport = {
    discussionSummary: 'Summary of the discussion...',
    keyInsights: 'Key insights from the interaction...',
    followUpTasks: 'Follow-up tasks...',
    followUpDueDate: '2025-02-15',
    complianceStatus: interaction.compliance_approved ? 'Approved' : 'Pending',
    managerReview: 'Under Review',
  };

  return (
    <>
      <UserNavbar userRole="Admin" handleSignOut={() => {}} />
      <div className="bg-white shadow rounded-lg p-6 space-y-8">
        {/* Interaction Details Table */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Interaction Details</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 w-1/3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">HCP Name</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{interaction.customers?.name}</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 w-1/3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">User</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{interaction.users?.name}</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 w-1/3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">Interaction Date</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(interaction.interaction_date).toLocaleString()}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 w-1/3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">Interaction Type</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{interaction.interaction_type}</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 w-1/3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">Proposed Discussion Topics</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{interaction.discussion_topics}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pre-visit Report Table */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pre-visit Report</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 w-1/3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">HCP Name</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{dummyPrevisitReport.hcpName}</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 w-1/3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">User</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{dummyPrevisitReport.user}</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 w-1/3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">Interaction Date</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{dummyPrevisitReport.interactionDate}</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 w-1/3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">Previous Interactions Summary</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{dummyPrevisitReport.interactionType}</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 w-1/3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">Proposed Discussion Topics</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{dummyPrevisitReport.proposedTopics}</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 w-1/3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">Recent Profile Changes</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{dummyPrevisitReport.recentProfileChanges}</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 w-1/3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">Pre-Visit Action Items</div>
                </td>
                <td className="px-6 py-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dummyPrevisitReport.preVisitActionItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.task}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.status}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.solution}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Post-visit Report Table */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Post-visit Report</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 w-1/3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">Discussion Summary</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{dummyPostVisitReport.discussionSummary}</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 w-1/3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">Key Insights</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{dummyPostVisitReport.keyInsights}</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 w-1/3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">Follow-up Tasks</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{dummyPostVisitReport.followUpTasks}</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 w-1/3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">Follow-up Due Date</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{dummyPostVisitReport.followUpDueDate}</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 w-1/3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">Compliance Status</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{dummyPostVisitReport.complianceStatus}</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 w-1/3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">Manager Review</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{dummyPostVisitReport.managerReview}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
<div>
  <h2 className="text-xl font-semibold text-gray-900 mb-4">Status of the Report</h2>
  <table className="min-w-full divide-y divide-gray-200">
    <tbody className="divide-y divide-gray-200">
      <tr>
        <td className="px-6 py-4 w-1/3 bg-gray-50">
          <div className="text-sm font-medium text-gray-900">Compliance Status</div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900">{dummyPostVisitReport.complianceStatus}</div>
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 w-1/3 bg-gray-50">
          <div className="text-sm font-medium text-gray-900">Manager Review</div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900">{dummyPostVisitReport.managerReview}</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
      </div>
    </>
  );
}