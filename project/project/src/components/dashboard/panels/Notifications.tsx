import React from 'react';
import { format } from 'date-fns';
import { AlertTriangle, Flag, Clock } from 'lucide-react';

interface Notification {
  id: string;
  type: 'compliance' | 'overdue' | 'alert';
  title: string;
  description: string;
  date: Date;
}

export default function Notifications() {
  // This would be fetched from your backend
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'compliance',
      title: 'Compliance Review Required',
      description: 'Recent interaction with Dr. Johnson needs compliance review',
      date: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      type: 'overdue',
      title: 'Overdue Task',
      description: 'Visit report for Dr. Chen is past due',
      date: new Date(Date.now() - 86400000),
    },
  ];

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'compliance':
        return <Flag className="h-5 w-5 text-red-400" />;
      case 'overdue':
        return <Clock className="h-5 w-5 text-orange-400" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getBackgroundColor = (type: Notification['type']) => {
    switch (type) {
      case 'compliance':
        return 'bg-red-50';
      case 'overdue':
        return 'bg-orange-50';
      case 'alert':
        return 'bg-yellow-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 hover:bg-gray-50 ${getBackgroundColor(notification.type)}`}
        >
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <span className="text-xs text-gray-500">
                  {format(notification.date, 'h:mm a')}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{notification.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}