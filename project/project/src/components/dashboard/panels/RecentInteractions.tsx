import React from 'react';
import { format } from 'date-fns';
import { Users } from 'lucide-react';

interface Interaction {
  id: string;
  kolName: string;
  type: 'In-person' | 'Virtual' | 'Email';
  date: Date;
  summary: string;
}

export default function RecentInteractions() {
  // This would be fetched from your backend
  const interactions: Interaction[] = [
    {
      id: '1',
      kolName: 'Dr. Sarah Johnson',
      type: 'In-person',
      date: new Date(Date.now() - 86400000),
      summary: 'Discussed clinical trial results and future collaboration opportunities',
    },
    {
      id: '2',
      kolName: 'Dr. Michael Chen',
      type: 'Virtual',
      date: new Date(Date.now() - 86400000 * 2),
      summary: 'Quarterly review meeting and research updates',
    },
  ];

  return (
    <div className="divide-y divide-gray-200">
      {interactions.map((interaction) => (
        <div key={interaction.id} className="p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="font-medium text-gray-900">{interaction.kolName}</h3>
            </div>
            <span className="text-sm text-gray-500">
              {format(interaction.date, 'MMM d')}
            </span>
          </div>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              interaction.type === 'In-person'
                ? 'bg-green-100 text-green-800'
                : interaction.type === 'Virtual'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {interaction.type}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{interaction.summary}</p>
        </div>
      ))}
    </div>
  );
}