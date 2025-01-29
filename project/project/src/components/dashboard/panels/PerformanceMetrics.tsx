import React from 'react';
import { TrendingUp, Users, CheckSquare, Clock } from 'lucide-react';

interface Metric {
  id: string;
  mslName: string;
  interactionCount: number;
  followUpsCompleted: number;
  avgResponseTime: string;
  kolSatisfaction: number;
}

export default function PerformanceMetrics() {
  // This would be fetched from your backend
  const metrics: Metric[] = [
    {
      id: '1',
      mslName: 'Dr. Emily Carter',
      interactionCount: 45,
      followUpsCompleted: 38,
      avgResponseTime: '24h',
      kolSatisfaction: 95,
    },
    {
      id: '2',
      mslName: 'Dr. James Wilson',
      interactionCount: 38,
      followUpsCompleted: 35,
      avgResponseTime: '36h',
      kolSatisfaction: 92,
    },
  ];

  return (
    <div className="divide-y divide-gray-200">
      {metrics.map((metric) => (
        <div key={metric.id} className="p-4">
          <h3 className="font-medium text-gray-900 mb-3">{metric.mslName}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{metric.interactionCount}</p>
                <p className="text-xs text-gray-500">Interactions</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{metric.followUpsCompleted}</p>
                <p className="text-xs text-gray-500">Follow-ups</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{metric.avgResponseTime}</p>
                <p className="text-xs text-gray-500">Avg Response</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{metric.kolSatisfaction}%</p>
                <p className="text-xs text-gray-500">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}