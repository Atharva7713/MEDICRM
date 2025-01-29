import React from 'react';
import { MapPin, Users } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  territory: string;
  activeKols: number;
  lastInteraction: Date;
}

export default function TeamOverview() {
  // This would be fetched from your backend
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Dr. Emily Carter',
      role: 'Senior MSL',
      territory: 'Northeast',
      activeKols: 15,
      lastInteraction: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      name: 'Dr. James Wilson',
      role: 'MSL',
      territory: 'West Coast',
      activeKols: 12,
      lastInteraction: new Date(Date.now() - 86400000 * 2),
    },
  ];

  return (
    <div className="divide-y divide-gray-200">
      {teamMembers.map((member) => (
        <div key={member.id} className="p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-gray-900">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {member.territory}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {member.activeKols} KOLs
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}