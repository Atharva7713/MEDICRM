import React from 'react';
import { format } from 'date-fns';
import { MapPin } from 'lucide-react';

interface Visit {
  id: string;
  kolName: string;
  date: Date;
  location: string;
}

export default function UpcomingVisits() {
  // This would be fetched from your backend
  const visits: Visit[] = [
    {
      id: '1',
      kolName: 'Dr. Sarah Johnson',
      date: new Date(Date.now() + 86400000 * 2),
      location: 'Memorial Hospital',
    },
    {
      id: '2',
      kolName: 'Dr. Michael Chen',
      date: new Date(Date.now() + 86400000 * 5),
      location: 'Research Center',
    },
  ];

  return (
    <div className="divide-y divide-gray-200">
      {visits.map((visit) => (
        <div key={visit.id} className="p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium text-gray-900">{visit.kolName}</h3>
            <span className="text-sm text-gray-500">
              {format(visit.date, 'MMM d, h:mm a')}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            {visit.location}
          </div>
        </div>
      ))}
    </div>
  );
}