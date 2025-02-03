import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Calendar } from 'lucide-react'; // Added Calendar icon

import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer by providing the moment object
const localizer = momentLocalizer(moment);

interface UserNavbarProps {
  userRole: string | null;
  handleSignOut: () => void;
}

const UserNavbar: React.FC<UserNavbarProps> = ({ userRole, handleSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const events = [
    {
      title: 'Meeting',
      start: new Date(2023, 10, 7, 10, 0),
      end: new Date(2023, 10, 7, 12, 0),
    },
    {
      title: 'Lunch',
      start: new Date(2023, 10, 7, 12, 0),
      end: new Date(2023, 10, 7, 13, 0),
    },
    // Add more events as needed
  ];

  return (
    <>
     
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Building2 className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to={userRole === 'MSL Manager' ? '/dashboard/msl' : '/dashboard/manager'}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/customers"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  HCP
                </Link>
                <Link
                  to="/interactions"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Interactions
                </Link>
                <Link
                  to="/tasks"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Tasks
                </Link>
                
                <Link
                  to="/datasources"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Data Sources
                </Link>
                <Link to="/studies" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Studies
                </Link>
                <Link to="/iis" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  IIS Studies
                </Link>
                <Link to="/events" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Events
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-4"
              >
                <span className="sr-only">Open calendar</span>
                <Calendar className="h-8 w-8 text-indigo-600" />
              </button>
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <Users className="h-8 w-8 rounded-full" />
                  </button>
                </div>
                {isOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      {showCalendar && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </div>
      )}
    </>
  );
};

export default UserNavbar;















