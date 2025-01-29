import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import UserNavbar from '../UserNavbar';
import axios from 'axios'; // For API calls

type CustomerDetailsType = {
  id: string;
  name: string;
  email: string;
  affiliation: string;
  specialty: string;
  phone: string;
  address: string;
};

export default function CustomerDetails() {
  const userRole = "Admin"; // Replace this with actual logic to determine the user's role
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<{ url: string; summary: string }[]>([]); // State for summary
  const [fetchingSummary, setFetchingSummary] = useState(false); // State for summary fetching

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomerDetails();
    } else {
      console.error('Customer ID is missing in the URL.');
      alert('Invalid customer ID. Please check the URL.');
      navigate('/'); // Redirect to home or an error page
    }
  }, [id]);

  useEffect(() => {
    if (customer) {
      fetchDoctorSummary(customer); // Fetch summary once customer details are loaded
    }
  }, [customer]);

  async function fetchCustomerDetails() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('customers')
        .select('id, name, email, affiliation, specialty, phone, address')
        .eq('id', id)
        .single();

      if (error) throw error;

      setCustomer(data);
    } catch (error) {
      console.error('Error fetching customer details:', error);
      alert('Error fetching customer details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchDoctorSummary(customer: CustomerDetailsType) {
    try {
      setFetchingSummary(true);

      // Construct a detailed search query using name, affiliation, address, and specialty
      const searchQuery = `${customer.name} ${customer.affiliation} ${customer.address} ${customer.specialty} research work`;

      const response = await axios.post('http://127.0.0.1:5000/analyze-research', {
        doctor_name: searchQuery, // Send the detailed search query
      });
      const summaries = response.data;

      // Check if no research papers were found
      if (summaries.length === 1 && summaries[0].summary === "No research papers found for this doctor.") {
        setSummary([{ url: "N/A", summary: "No research papers found for this doctor." }]);
      } else {
        setSummary(summaries);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      setSummary([{ url: "N/A", summary: "Error fetching summary. Please try again later." }]);
    } finally {
      setFetchingSummary(false);
    }
  }

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!customer) {
    return <div className="text-center">Customer not found</div>;
  }

  return (
    <>
      <UserNavbar userRole={userRole} handleSignOut={handleSignOut} />
      <div className="flex flex-wrap p-8 gap-4">
        <div className="w-1/4 p-4 border rounded shadow">
          <h2 className="text-lg font-semibold">CTMS (table 1)</h2>
          {/* Content here */}
        </div>

        <div className="w-1/4 p-4 border rounded shadow">
          <h2 className="text-lg font-semibold">DSG (table 2)</h2>
          {/* Content here */}
        </div>

        <div className="w-1/4 p-4 border rounded shadow" style={{ height: '500px', overflowY: 'auto' }}>
          <h2 className="text-lg font-semibold">MA (table 3)</h2>
          
        </div>

        <div className="w-2/4 p-4 border rounded shadow">
          <h2 className="text-lg font-semibold">Public Info (table 4)</h2>
          {/* Content here */}
          {fetchingSummary ? (
            <p>Fetching summary...</p>
          ) : (
            <div className="space-y-4">
              {summary.map((item, index) => (
                <div key={index} className="p-2 border rounded">
                  <p className="text-sm text-blue-600 break-words">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.url}
                    </a>
                  </p>
                  <p className="text-sm mt-2">{item.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-1/4 p-4 border rounded shadow">
          <h2 className="text-lg font-semibold">Basic Details</h2>
          <ul className="space-y-2">
            <li><strong>Name:</strong> {customer.name}</li>
            <li><strong>Address:</strong> {customer.address}</li>
            <li><strong>Phone:</strong> {customer.phone}</li>
            <li><strong>Email:</strong> {customer.email}</li>
            <li><strong>Affiliation:</strong> {customer.affiliation}</li>
            <li><strong>Specialty:</strong> {customer.specialty}</li>
          </ul>
        </div>
      </div>
    </>
  );
}













