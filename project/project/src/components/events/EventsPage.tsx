import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Event {
  event_name: string;
  internal_or_external: string;
  event_type: string;
  date_of_event: string;
  event_description: string;
  relavent_hcp: string;
  event_report: string;
  relevant_internal_stakeholders: string;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events') // Assuming the table name is 'events'
        .select('*');

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Events</h2>
      <div className="overflow-x-auto max-h-[500px] border border-gray-300 rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Event Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Internal/External</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Event Type</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Date Of Event</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Event Description</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Relevant HCP</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Event Report</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Relevant Internal Stakeholders</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event.event_name} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-700">{event.event_name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{event.internal_or_external}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{event.event_type}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{event.date_of_event}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{event.event_description}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{event.relavent_hcp}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{event.event_report}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{event.relevant_internal_stakeholders}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsPage;