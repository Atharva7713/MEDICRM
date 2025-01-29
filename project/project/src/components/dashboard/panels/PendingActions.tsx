import React from 'react';
import { format } from 'date-fns';
import { Clock, CheckCircle } from 'lucide-react';

interface Action {
  id: string;
  title: string;
  dueDate: Date;
  type: 'pre-visit' | 'post-visit';
  completed: boolean;
}

export default function PendingActions() {
  // This would be fetched from your backend
  const actions: Action[] = [
    {
      id: '1',
      title: 'Prepare presentation for Dr. Johnson',
      dueDate: new Date(Date.now() + 86400000),
      type: 'pre-visit',
      completed: false,
    },
    {
      id: '2',
      title: 'Submit visit report for Dr. Chen',
      dueDate: new Date(Date.now() + 86400000 * 2),
      type: 'post-visit',
      completed: false,
    },
  ];

  return (
    <div className="divide-y divide-gray-200">
      {actions.map((action) => (
        <div key={action.id} className="p-4 hover:bg-gray-50">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <CheckCircle className={`h-5 w-5 ${action.completed ? 'text-green-500' : 'text-gray-400'}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-gray-900">{action.title}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  action.type === 'pre-visit' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {action.type === 'pre-visit' ? 'Pre-visit' : 'Post-visit'}
                </span>
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                Due {format(action.dueDate, 'MMM d')}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}