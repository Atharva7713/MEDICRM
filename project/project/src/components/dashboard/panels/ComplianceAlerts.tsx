import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Alert {
  id: string;
  mslName: string;
  kolName: string;
  type: 'warning' | 'violation' | 'resolved';
  description: string;
  date: Date;
}

export default function ComplianceAlerts() {
  // This would be fetched from your backend
  const alerts: Alert[] = [
    {
      id: '1',
      mslName: 'Dr. Emily Carter',
      kolName: 'Dr. Sarah Johnson',
      type: 'warning',
      description: 'Interaction frequency exceeds recommended limit',
      date: new Date(),
    },
    {
      id: '2',
      mslName: 'Dr. James Wilson',
      kolName: 'Dr. Michael Chen',
      type: 'resolved',
      description: 'Documentation completed within required timeframe',
      date: new Date(Date.now() - 86400000),
    },
  ];

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'violation':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
    }
  };

  const getAlertStyle = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50';
      case 'violation':
        return 'bg-red-50';
      case 'resolved':
        return 'bg-green-50';
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {alerts.map((alert) => (
        <div key={alert.id} className={`p-4 ${getAlertStyle(alert.type)}`}>
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              {getAlertIcon(alert.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {alert.mslName} → {alert.kolName}
                </p>
                <span className="text-xs text-gray-500">
                  {alert.date.toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{alert.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}