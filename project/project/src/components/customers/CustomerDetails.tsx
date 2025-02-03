// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { supabase } from '../../lib/supabase';
// import UserNavbar from '../UserNavbar';
// import axios from 'axios'; // For API calls

// type CustomerDetailsType = {
//   unique_hcp_id: string; // Updated to use unique_hcp_id
//   name: string;
//   email: string;
//   affiliation: string;
//   specialty: string;
//   phone: string;
//   address: string;
// };

// export default function CustomerDetails() {
//   const userRole = "Admin"; // Replace this with actual logic to determine the user's role
//   const navigate = useNavigate();
//   const { unique_hcp_id } = useParams<{ unique_hcp_id: string }>(); // Updated to use unique_hcp_id
//   const [customer, setCustomer] = useState<CustomerDetailsType | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [summary, setSummary] = useState<{ url: string; summary: string }[]>([]); // State for summary
//   const [fetchingSummary, setFetchingSummary] = useState(false); // State for summary fetching

//   const handleSignOut = async () => {
//     try {
//       await supabase.auth.signOut();
//       navigate('/login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   useEffect(() => {
//     if (unique_hcp_id) {
//       fetchCustomerDetails();
//     } else {
//       console.error('Customer unique_hcp_id is missing in the URL.');
//       alert('Invalid customer unique_hcp_id. Please check the URL.');
//       navigate('/'); // Redirect to home or an error page
//     }
//   }, [unique_hcp_id]); // Updated to use unique_hcp_id

//   useEffect(() => {
//     if (customer) {
//       fetchDoctorSummary(customer); // Fetch summary once customer details are loaded
//     }
//   }, [customer]);

//   async function fetchCustomerDetails() {
//     try {
//       setLoading(true);

//       const { data, error } = await supabase
//         .from('customers')
//         .select('unique_hcp_id, name, email, affiliation, specialty, phone, address') // Updated fields
//         .eq('unique_hcp_id', unique_hcp_id) // Updated to use unique_hcp_id
//         .single();

//       if (error) throw error;

//       setCustomer(data);
//     } catch (error) {
//       console.error('Error fetching customer details:', error);
//       alert('Error fetching customer details. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function fetchDoctorSummary(customer: CustomerDetailsType) {
//     try {
//       setFetchingSummary(true);

//       // Construct a detailed search query using name, affiliation, address, and specialty
//       const searchQuery = `${customer.name} ${customer.affiliation} ${customer.address} ${customer.specialty} research work`;

//       const response = await axios.post('http://127.0.0.1:5000/analyze-research', {
//         doctor_name: searchQuery, // Send the detailed search query
//       });
//       const summaries = response.data;

//       // Check if no research papers were found
//       if (summaries.length === 1 && summaries[0].summary === "No research papers found for this doctor.") {
//         setSummary([{ url: "N/A", summary: "No research papers found for this doctor." }]);
//       } else {
//         setSummary(summaries);
//       }
//     } catch (error) {
//       console.error('Error fetching summary:', error);
//       setSummary([{ url: "N/A", summary: "Error fetching summary. Please try again later." }]);
//     } finally {
//       setFetchingSummary(false);
//     }
//   }

//   if (loading) {
//     return <div className="text-center">Loading...</div>;
//   }

//   if (!customer) {
//     return <div className="text-center">Customer not found</div>;
//   }

//   return (
//     <>
//       <UserNavbar userRole={userRole} handleSignOut={handleSignOut} />
//       <div className="flex flex-col p-8 gap-4">
//         {/* First Row: CTMS and Basic Details */}
//         <div className="flex gap-4">
//           <div className="w-1/2 p-4 border rounded shadow">
//             <h2 className="text-lg font-semibold">R & D STUDIES (table 1)</h2>
//             {/* Content here */}
//           </div>
  
//           <div className="w-1/2 p-4 border rounded shadow">
//             <h2 className="text-lg font-semibold">Basic Details (table 5)</h2>
//             <ul className="space-y-2">
//               <li><strong>Name:</strong> {customer.name}</li>
//               <li><strong>Address:</strong> {customer.address}</li>
//               <li><strong>Phone:</strong> {customer.phone}</li>
//               <li><strong>Email:</strong> {customer.email}</li>
//               <li><strong>Affiliation:</strong> {customer.affiliation}</li>
//               <li><strong>Specialty:</strong> {customer.specialty}</li>
//             </ul>
//           </div>
//         </div>
  
//         {/* Second Row: DSG, PUBLIC INFO, and MA */}
//         <div className="flex gap-4">
//           <div className="w-1/3 p-4 border rounded shadow">
//             <h2 className="text-lg font-semibold">IIS STUDIES (table 2)</h2>
//             {/* Content here */}
//           </div>
  
//           <div className="w-1/3 p-4 border rounded shadow">
//             <h2 className="text-lg font-semibold">PUBLIC INFO (table 3)</h2>
//             {fetchingSummary ? (
//               <p>Fetching summary...</p>
//             ) : (
//               <div className="space-y-4">
//                 {summary.map((item, index) => (
//                   <div key={index} className="p-2 border rounded">
//                     <p className="text-sm text-blue-600 break-words">
//                       <a href={item.url} target="_blank" rel="noopener noreferrer">
//                         {item.url}
//                       </a>
//                     </p>
//                     <p className="text-sm mt-2">{item.summary}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
  
//           <div className="w-1/3 p-4 border rounded shadow" style={{ height: '500px', overflowY: 'auto' }}>
//             <h2 className="text-lg font-semibold">EVENTS (table 4)</h2>
//             {/* Content here */}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

















// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { supabase } from '../../lib/supabase';
// import UserNavbar from '../UserNavbar';
// import axios from 'axios'; // For API calls

// type CustomerDetailsType = {
//   unique_hcp_id: string;
//   name: string;
//   email: string;
//   affiliation: string;
//   specialty: string;
//   phone: string;
//   address: string;
// };

// type EnrollmentType = {
//   unique_hcp_id: string;
//   unique_study_id: string;
//   initial_activation_date: string;
//   status: string;
//   screening_status: string;
//   subjects_screened: number;
//   tissue_screening_status: string;
//   enrollment_status: string;
//   subjects_enrolled: number;
// };

// type RDStudyType = {
//   unique_study_id: string;
//   nct_number: string;
//   study_title: string;
//   asset: string;
//   indication: string;
//   phases: string;
//   enrollment_other_ids: string;
//   start_date: string;
//   completion_date: string;
// };

// type IISStudyType = {
//   unique_iis_study_id: string;
//   iis_study_title: string;
//   asset: string;
//   indication: string;
//   phases: string;
//   enrollment:number;
//   start_date: string;
//   completion_date: string;
//   primary_hcp_id: string;
//   other_associated_hcp: string;
// };

// export default function CustomerDetails() {
//   const userRole = "Admin";
//   const navigate = useNavigate();
//   const { unique_hcp_id } = useParams<{ unique_hcp_id: string }>();
//   const [customer, setCustomer] = useState<CustomerDetailsType | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [enrollmentData, setEnrollmentData] = useState<EnrollmentType[]>([]);
//   const [rdStudiesData, setRDStudiesData] = useState<RDStudyType[]>([]);
//   const [fetchingSummary, setFetchingSummary] = useState(false);
//   const [iisStudiesData, setIISStudiesData] = useState<IISStudyType[]>([]);
//   const [summary, setSummary] = useState<{ url: string; summary: string }[]>([]); // State for summary

//   const handleSignOut = async () => {
//     try {
//       await supabase.auth.signOut();
//       navigate('/login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   useEffect(() => {
//     if (unique_hcp_id) {
//       fetchCustomerDetails();
//       fetchEnrollmentData();
//       fetchIISStudiesData();
//     } else {
//       console.error('Customer unique_hcp_id is missing in the URL.');
//       alert('Invalid customer unique_hcp_id. Please check the URL.');
//       navigate('/');
//     }
//   }, [unique_hcp_id]);

//   useEffect(() => {
//         if (customer) {
//           fetchDoctorSummary(customer); // Fetch summary once customer details are loaded
//         }
//       }, [customer]);

//   useEffect(() => {
//     if (enrollmentData.length > 0) {
//       fetchRDStudiesData();
//     }
//   }, [enrollmentData]);

//   async function fetchCustomerDetails() {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('customers')
//         .select('unique_hcp_id, name, email, affiliation, specialty, phone, address')
//         .eq('unique_hcp_id', unique_hcp_id)
//         .single();

//       if (error) throw error;
//       setCustomer(data);
//     } catch (error) {
//       console.error('Error fetching customer details:', error);
//       alert('Error fetching customer details. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function fetchEnrollmentData() {
//     try {
//       const { data, error } = await supabase
//         .from('enrollment')
//         .select('*')
//         .eq('unique_hcp_id', unique_hcp_id);

//       if (error) throw error;
//       setEnrollmentData(data || []);
//     } catch (error) {
//       console.error('Error fetching enrollment data:', error);
//     }
//   }

//   async function fetchRDStudiesData() {
//     try {
//       const studyIds = enrollmentData.map((enrollment) => enrollment.unique_study_id);
//       const { data, error } = await supabase
//         .from('studies')
//         .select('*')
//         .in('unique_study_id', studyIds);

//       if (error) throw error;
//       setRDStudiesData(data || []);
//     } catch (error) {
//       console.error('Error fetching R&D studies data:', error);
//     }
//   }

//   async function fetchIISStudiesData() {
//     try {
//       const { data, error } = await supabase
//         .from('iis_studies')
//         .select('*')
//         .or(`primary_hcp_id.eq.${unique_hcp_id}`);

//       if (error) throw error;
//       setIISStudiesData(data || []);
//     } catch (error) {
//       console.error('Error fetching IIS studies data:', error);
//     }
//   }

//   async function fetchDoctorSummary(customer: CustomerDetailsType) {
//     try {
//       setFetchingSummary(true);

//       // Construct a detailed search query using name, affiliation, address, and specialty
//       const searchQuery = `${customer.name} ${customer.affiliation} ${customer.address} ${customer.specialty} research work`;

//       const response = await axios.post('http://127.0.0.1:5000/analyze-research', {
//         doctor_name: searchQuery, // Send the detailed search query
//       });
//       const summaries = response.data;

//       // Check if no research papers were found
//       if (summaries.length === 1 && summaries[0].summary === "No research papers found for this doctor.") {
//         setSummary([{ url: "N/A", summary: "No research papers found for this doctor." }]);
//       } else {
//         setSummary(summaries);
//       }
//     } catch (error) {
//       console.error('Error fetching summary:', error);
//       setSummary([{ url: "N/A", summary: "Error fetching summary. Please try again later." }]);
//     } finally {
//       setFetchingSummary(false);
//     }
//   }

//   if (loading) {
//     return <div className="text-center">Loading...</div>;
//   }

//   if (!customer) {
//     return <div className="text-center">Customer not found</div>;
//   }

//   return (
//     <>
//       <UserNavbar userRole={userRole} handleSignOut={handleSignOut} />
//       <div className="flex flex-col p-8 gap-4">
//         {/* First Row: R & D STUDIES and Basic Details */}
//         <div className="flex gap-4">
//           <div className="w-1/2 p-4 border rounded shadow">
//             <h2 className="text-lg font-semibold">R & D STUDIES (table 1)</h2>
//             {rdStudiesData.length > 0 ? (
//               <div className="space-y-4">
//                 {rdStudiesData.map((study, index) => (
//                   <div key={index} className="p-2 border rounded">
//                     <p><strong>Study Title:</strong> {study.study_title}</p>
//                     <p><strong>NCT Number:</strong> {study.nct_number}</p>
//                     <p><strong>Asset:</strong> {study.asset}</p>
//                     <p><strong>Indication:</strong> {study.indication}</p>
//                     <p><strong>Phases:</strong> {study.phases}</p>
//                     <p><strong>Start Date:</strong> {study.start_date}</p>
//                     <p><strong>Completion Date:</strong> {study.completion_date}</p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p>No R&D studies found for this HCP.</p>
//             )}
//           </div>

//           <div className="w-1/2 p-4 border rounded shadow">
//             <h2 className="text-lg font-semibold">Basic Details (table 5)</h2>
//             <ul className="space-y-2">
//               <li><strong>Name:</strong> {customer.name}</li>
//               <li><strong>Address:</strong> {customer.address}</li>
//               <li><strong>Phone:</strong> {customer.phone}</li>
//               <li><strong>Email:</strong> {customer.email}</li>
//               <li><strong>Affiliation:</strong> {customer.affiliation}</li>
//               <li><strong>Specialty:</strong> {customer.specialty}</li>
//             </ul>
//           </div>
//         </div>

//         {/* Second Row: IIS STUDIES, PUBLIC INFO, and EVENTS */}
//         <div className="flex gap-4">
//         <div className="w-1/3 p-4 border rounded shadow">
//             <h2 className="text-lg font-semibold">IIS STUDIES (table 2)</h2>
//                {iisStudiesData.length > 0 ? (
//                 <div className="space-y-4">
//                    {iisStudiesData.map((study, index) => (
//                    <div key={index} className="p-2 border rounded">
//                         <p><strong>Study Title:</strong> {study.iis_study_title}</p>
//                         <p><strong>Asset:</strong> {study.asset}</p>
//                         <p><strong>Indication:</strong> {study.indication}</p>
//                         <p><strong>Phases:</strong> {study.phases}</p>
//                         <p><strong>Enrollment:</strong> {study.enrollment}</p>
//                         <p><strong>Enrollment Start Date:</strong> {study.start_date}</p>
//                         <p><strong>Completion Date:</strong> {study.completion_date}</p>
//                         <p><strong>Other Associated HCP IDs:</strong> {study.other_associated_hcp}</p>
//                     <p>
//                     </p>
//                   </div>
//          ))}
//         </div>
//            ) : (
//                <p>No IIS studies found for this HCP.</p>
//         )}
//         </div>
//         <div className="w-1/3 p-4 border rounded shadow">
//             <h2 className="text-lg font-semibold">PUBLIC INFO (table 3)</h2>
//             {fetchingSummary ? (
//                <p>Fetching summary...</p>
//              ) : (
//               <div className="space-y-4">
//                 {summary.map((item, index) => (
//                   <div key={index} className="p-2 border rounded">
//                     <p className="text-sm text-blue-600 break-words">
//                       <a href={item.url} target="_blank" rel="noopener noreferrer">
//                         {item.url}
//                       </a>
//                     </p>
//                     <p className="text-sm mt-2">{item.summary}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div> 
             
//           <div className="w-1/3 p-4 border rounded shadow" style={{ height: '500px', overflowY: 'auto' }}>
//             <h2 className="text-lg font-semibold">EVENTS (table 4)</h2>
//             {/* Content here */}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }







// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { supabase } from '../../lib/supabase';
// import UserNavbar from '../UserNavbar';
// import axios from 'axios';

// type CustomerDetailsType = {
//   unique_hcp_id: string;
//   name: string;
//   email: string;
//   affiliation: string;
//   specialty: string;
//   phone: string;
//   address: string;
// };

// type EnrollmentType = {
//   unique_hcp_id: string;
//   unique_study_id: string;
//   initial_activation_date: string;
//   status: string;
//   screening_status: string;
//   subjects_screened: number;
//   tissue_screening_status: string;
//   enrollment_status: string;
//   subjects_enrolled: number;
// };

// type RDStudyType = {
//   unique_study_id: string;
//   nct_number: string;
//   study_title: string;
//   asset: string;
//   indication: string;
//   phases: string;
//   enrollment_other_ids: string;
//   start_date: string;
//   completion_date: string;
// };

// type IISStudyType = {
//   unique_iis_study_id: string;
//   iis_study_title: string;
//   asset: string;
//   indication: string;
//   phases: string;
//   enrollment: number;
//   start_date: string;
//   completion_date: string;
//   primary_hcp_id: string;
//   other_associated_hcp: string;
// };

// type EventType = {
//   event_name: string;
//   internal_or_external: string;
//   event_type: string;
//   date_of_event: string;
//   event_description: string;
//   relavent_hcp: string;
//   event_report: string;
//   relevant_internal_stakeholders: string;
// };

// export default function CustomerDetails() {
//   const userRole = "Admin";
//   const navigate = useNavigate();
//   const { unique_hcp_id } = useParams<{ unique_hcp_id: string }>();
//   const [customer, setCustomer] = useState<CustomerDetailsType | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [enrollmentData, setEnrollmentData] = useState<EnrollmentType[]>([]);
//   const [rdStudiesData, setRDStudiesData] = useState<RDStudyType[]>([]);
//   const [fetchingSummary, setFetchingSummary] = useState(false);
//   const [iisStudiesData, setIISStudiesData] = useState<IISStudyType[]>([]);
//   const [summary, setSummary] = useState<{ url: string; summary: string }[]>([]);
//   const [eventsData, setEventsData] = useState<EventType[]>([]);

//   const handleSignOut = async () => {
//     try {
//       await supabase.auth.signOut();
//       navigate('/login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   useEffect(() => {
//     if (unique_hcp_id) {
//       fetchCustomerDetails();
//       fetchEnrollmentData();
//       fetchIISStudiesData();
//       fetchEventData();
//     } else {
//       console.error('Customer unique_hcp_id is missing in the URL.');
//       alert('Invalid customer unique_hcp_id. Please check the URL.');
//       navigate('/');
//     }
//   }, [unique_hcp_id]);

//   useEffect(() => {
//     if (customer) {
//       fetchDoctorSummary(customer);
//     }
//   }, [customer]);

//   useEffect(() => {
//     if (enrollmentData.length > 0) {
//       fetchRDStudiesData();
//     }
//   }, [enrollmentData]);

//   async function fetchCustomerDetails() {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('customers')
//         .select('unique_hcp_id, name, email, affiliation, specialty, phone, address')
//         .eq('unique_hcp_id', unique_hcp_id)
//         .single();

//       if (error) throw error;
//       setCustomer(data);
//     } catch (error) {
//       console.error('Error fetching customer details:', error);
//       alert('Error fetching customer details. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function fetchEnrollmentData() {
//     try {
//       const { data, error } = await supabase
//         .from('enrollment')
//         .select('*')
//         .eq('unique_hcp_id', unique_hcp_id);

//       if (error) throw error;
//       setEnrollmentData(data || []);
//     } catch (error) {
//       console.error('Error fetching enrollment data:', error);
//     }
//   }

//   async function fetchRDStudiesData() {
//     try {
//       const studyIds = enrollmentData.map((enrollment) => enrollment.unique_study_id);
//       const { data, error } = await supabase
//         .from('studies')
//         .select('*')
//         .in('unique_study_id', studyIds);

//       if (error) throw error;
//       setRDStudiesData(data || []);
//     } catch (error) {
//       console.error('Error fetching R&D studies data:', error);
//     }
//   }

//   async function fetchIISStudiesData() {
//     try {
//       const { data, error } = await supabase
//         .from('iis_studies')
//         .select('*')
//         .or(`primary_hcp_id.eq.${unique_hcp_id}`);

//       if (error) throw error;
//       setIISStudiesData(data || []);
//     } catch (error) {
//       console.error('Error fetching IIS studies data:', error);
//     }
//   }

//   async function fetchEventData() {
//     try {
//       const { data, error } = await supabase
//         .from('events')
//         .select('*')
//         .or(`relavent_hcp.eq.${unique_hcp_id}`);

//       if (error) throw error;
//       setEventsData(data || []);
//     } catch (error) {
//       console.error('Error fetching event data:', error);
//     }
//   }

//   async function fetchDoctorSummary(customer: CustomerDetailsType) {
//     try {
//       setFetchingSummary(true);
//       const searchQuery = `${customer.name} ${customer.affiliation} ${customer.address} ${customer.specialty} research work`;
//       const response = await axios.post('http://127.0.0.1:5000/analyze-research', {
//         doctor_name: searchQuery,
//       });
//       const summaries = response.data;
//       if (summaries.length === 1 && summaries[0].summary === "No research papers found for this doctor.") {
//         setSummary([{ url: "N/A", summary: "No research papers found for this doctor." }]);
//       } else {
//         setSummary(summaries);
//       }
//     } catch (error) {
//       console.error('Error fetching summary:', error);
//       setSummary([{ url: "N/A", summary: "Error fetching summary. Please try again later." }]);
//     } finally {
//       setFetchingSummary(false);
//     }
//   }

//   if (loading) {
//     return <div className="text-center">Loading...</div>;
//   }

//   if (!customer) {
//     return <div className="text-center">Customer not found</div>;
//   }

//   return (
//     <>
//       <UserNavbar userRole={userRole} handleSignOut={handleSignOut} />
//       <div className="flex flex-col p-8 gap-4">
//         <div className="flex gap-4">
//           <div className="w-1/2 p-4 border rounded shadow">
//             <h2 className="text-lg font-semibold">R & D STUDIES (table 1)</h2>
//             {rdStudiesData.length > 0 ? (
//               <div className="space-y-4">
//                 {rdStudiesData.map((study, index) => (
//                   <div key={index} className="p-2 border rounded">
//                     <p><strong>Study Title:</strong> {study.study_title}</p>
//                     <p><strong>NCT Number:</strong> {study.nct_number}</p>
//                     <p><strong>Asset:</strong> {study.asset}</p>
//                     <p><strong>Indication:</strong> {study.indication}</p>
//                     <p><strong>Phases:</strong> {study.phases}</p>
//                     <p><strong>Start Date:</strong> {study.start_date}</p>
//                     <p><strong>Completion Date:</strong> {study.completion_date}</p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p>No R&D studies found for this HCP.</p>
//             )}
//           </div>

//           <div className="w-1/2 p-4 border rounded shadow">
//             <h2 className="text-lg font-semibold">Basic Details (table 5)</h2>
//             <ul className="space-y-2">
//               <li><strong>Name:</strong> {customer.name}</li>
//               <li><strong>Address:</strong> {customer.address}</li>
//               <li><strong>Phone:</strong> {customer.phone}</li>
//               <li><strong>Email:</strong> {customer.email}</li>
//               <li><strong>Affiliation:</strong> {customer.affiliation}</li>
//               <li><strong>Specialty:</strong> {customer.specialty}</li>
//             </ul>
//           </div>
//         </div>

//         <div className="flex gap-4">
//           <div className="w-1/3 p-4 border rounded shadow">
//             <h2 className="text-lg font-semibold">IIS STUDIES (table 2)</h2>
//             {iisStudiesData.length > 0 ? (
//               <div className="space-y-4">
//                 {iisStudiesData.map((study, index) => (
//                   <div key={index} className="p-2 border rounded">
//                     <p><strong>Study Title:</strong> {study.iis_study_title}</p>
//                     <p><strong>Asset:</strong> {study.asset}</p>
//                     <p><strong>Indication:</strong> {study.indication}</p>
//                     <p><strong>Phases:</strong> {study.phases}</p>
//                     <p><strong>Enrollment:</strong> {study.enrollment}</p>
//                     <p><strong>Enrollment Start Date:</strong> {study.start_date}</p>
//                     <p><strong>Completion Date:</strong> {study.completion_date}</p>
//                     <p><strong>Other Associated HCP IDs:</strong> {study.other_associated_hcp}</p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p>No IIS studies found for this HCP.</p>
//             )}
//           </div>

//           <div className="w-1/3 p-4 border rounded shadow">
//             <h2 className="text-lg font-semibold">PUBLIC INFO (table 3)</h2>
//             {fetchingSummary ? (
//               <p>Fetching summary...</p>
//             ) : (
//               <div className="space-y-4">
//                 {summary.map((item, index) => (
//                   <div key={index} className="p-2 border rounded">
//                     <p className="text-sm text-blue-600 break-words">
//                       <a href={item.url} target="_blank" rel="noopener noreferrer">
//                         {item.url}
//                       </a>
//                     </p>
//                     <p className="text-sm mt-2">{item.summary}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="w-1/3 p-4 border rounded shadow" style={{ height: '500px', overflowY: 'auto' }}>
//             <h2 className="text-lg font-semibold">EVENTS (table 4)</h2>
//             {eventsData.length > 0 ? (
//               <div className="space-y-4">
//                 {eventsData.map((event, index) => (
//                   <div key={index} className="p-2 border rounded">
//                     <p><strong>Event Name:</strong> {event.event_name}</p>
//                     <p><strong>Internal/External:</strong> {event.internal_or_external}</p>
//                     <p><strong>Event Type:</strong> {event.event_type}</p>
//                     <p><strong>Date of Event:</strong> {event.date_of_event}</p>
//                     <p><strong>Event Description:</strong> {event.event_description}</p>
//                     <p><strong>Relevant HCP:</strong> {event.relavent_hcp}</p>
//                     <p><strong>Event Report:</strong> {event.event_report}</p>
//                     <p><strong>Relevant Internal Stakeholders:</strong> {event.relevant_internal_stakeholders}</p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p>No events found for this HCP.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }





















import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import UserNavbar from '../UserNavbar';
import axios from 'axios';

type CustomerDetailsType = {
  unique_hcp_id: string;
  name: string;
  email: string;
  affiliation: string;
  specialty: string;
  phone: string;
  address: string;
};

type EnrollmentType = {
  unique_hcp_id: string;
  unique_study_id: string;
  initial_activation_date: string;
  status: string;
  screening_status: string;
  subjects_screened: number;
  tissue_screening_status: string;
  enrollment_status: string;
  subjects_enrolled: number;
};

type RDStudyType = {
  unique_study_id: string;
  nct_number: string;
  study_title: string;
  asset: string;
  indication: string;
  enrollment:string
  phases: string;
  enrollment_other_ids: string;
  start_date: string;
  completion_date: string;
};

type IISStudyType = {
  unique_iis_study_id: string;
  iis_study_title: string;
  asset: string;
  indication: string;
  phases: string;
  enrollment: number;
  start_date: string;
  completion_date: string;
  primary_hcp_id: string;
  other_associated_hcp: string;
};

type EventType = {
  event_name: string;
  internal_or_external: string;
  event_type: string;
  date_of_event: string;
  event_description: string;
  relavent_hcp: string; // Corrected field name
  event_report: string;
  relevant_internal_stakeholders: string;
};

export default function CustomerDetails() {
  const userRole = "Admin";
  const navigate = useNavigate();
  const { unique_hcp_id } = useParams<{ unique_hcp_id: string }>();
  const [customer, setCustomer] = useState<CustomerDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentType[]>([]);
  const [rdStudiesData, setRDStudiesData] = useState<RDStudyType[]>([]);
  const [fetchingSummary, setFetchingSummary] = useState(false);
  const [iisStudiesData, setIISStudiesData] = useState<IISStudyType[]>([]);
  const [summary, setSummary] = useState<{ url: string; summary: string }[]>([]);
  const [eventsData, setEventsData] = useState<EventType[]>([]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    if (unique_hcp_id) {
      fetchCustomerDetails();
      fetchEnrollmentData();
      fetchIISStudiesData();
      fetchEventData();
    } else {
      console.error('Customer unique_hcp_id is missing in the URL.');
      alert('Invalid customer unique_hcp_id. Please check the URL.');
      navigate('/');
    }
  }, [unique_hcp_id]);

  useEffect(() => {
    if (customer) {
      fetchDoctorSummary(customer);
    }
  }, [customer]);

  useEffect(() => {
    if (enrollmentData.length > 0) {
      fetchRDStudiesData();
    }
  }, [enrollmentData]);

  async function fetchCustomerDetails() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('unique_hcp_id, name, email, affiliation, specialty, phone, address')
        .eq('unique_hcp_id', unique_hcp_id)
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

  async function fetchEnrollmentData() {
    try {
      const { data, error } = await supabase
        .from('enrollment')
        .select('*')
        .eq('unique_hcp_id', unique_hcp_id);

      if (error) throw error;
      setEnrollmentData(data || []);
    } catch (error) {
      console.error('Error fetching enrollment data:', error);
    }
  }

  async function fetchRDStudiesData() {
    try {
      const studyIds = enrollmentData.map((enrollment) => enrollment.unique_study_id);
      const { data, error } = await supabase
        .from('studies')
        .select('*')
        .in('unique_study_id', studyIds);

      if (error) throw error;
      setRDStudiesData(data || []);
    } catch (error) {
      console.error('Error fetching R&D studies data:', error);
    }
  }

  async function fetchIISStudiesData() {
    try {
      const { data, error } = await supabase
        .from('iis_studies')
        .select('*')
        .or(`primary_hcp_id.eq.${unique_hcp_id}`);

      if (error) throw error;
      setIISStudiesData(data || []);
    } catch (error) {
      console.error('Error fetching IIS studies data:', error);
    }
  }

  async function fetchEventData() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*');

      if (error) throw error;

      console.log('Fetched events:', data); // Debugging: Log fetched events

      // Filter events where the relavent_hcp includes the current HCP's ID
      const filteredEvents = data.filter(event => {
        // Check if relavent_hcp is defined and not null
        if (!event.relavent_hcp) {
          console.log('Skipping event with undefined relavent_hcp:', event); // Debugging: Log skipped events
          return false; // Skip if relavent_hcp is undefined or null
        }

        // Split the relavent_hcp string into an array of IDs and trim whitespace
        const relevantHcps = event.relavent_hcp.split(',').map((id: string) => id.trim());

        console.log('Relevant HCPs for event:', relevantHcps); // Debugging: Log relevant HCPs
        console.log('Current HCP ID:', unique_hcp_id); // Debugging: Log current HCP ID

        // Check if the current HCP's ID is in the relevantHcps array
        return relevantHcps.includes(unique_hcp_id);
      });

      console.log('Filtered events:', filteredEvents); // Debugging: Log filtered events
      setEventsData(filteredEvents || []);
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  }

  async function fetchDoctorSummary(customer: CustomerDetailsType) {
    try {
      setFetchingSummary(true);
      const searchQuery = `${customer.name} ${customer.affiliation} ${customer.address} ${customer.specialty} research work`;
      const response = await axios.post('http://127.0.0.1:5000/analyze-research', {
        doctor_name: searchQuery,
      });
      const summaries = response.data;
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
      <div className="flex flex-col p-8 gap-4">
        <div className="flex gap-4">
          <div className="w-1/2 p-4 border rounded shadow">
            <h2 className="text-lg font-semibold">R & D STUDIES (table 1)</h2>
            {rdStudiesData.length > 0 ? (
              <div className="space-y-4">
                {rdStudiesData.map((study, index) => (
                  <div key={index} className="p-2 border rounded">
                    <p><strong>Study Title:</strong> {study.study_title}</p>
                    <p><strong>NCT Number:</strong> {study.nct_number}</p>
                    <p><strong>Asset:</strong> {study.asset}</p>
                    <p><strong>Indication:</strong> {study.indication}</p>
                    <p><strong>Enrollment:</strong> {study.enrollment}</p>
                    <p><strong>Phases:</strong> {study.phases}</p>
                    <p><strong>Start Date:</strong> {study.start_date}</p>
                    <p><strong>Completion Date:</strong> {study.completion_date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No R&D studies found for this HCP.</p>
            )}
          </div>

          <div className="w-1/2 p-4 border rounded shadow">
            <h2 className="text-lg font-semibold">Basic Details (table 5)</h2>
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

        <div className="flex gap-4">
          <div className="w-1/3 p-4 border rounded shadow">
            <h2 className="text-lg font-semibold">IIS STUDIES (table 2)</h2>
            {iisStudiesData.length > 0 ? (
              <div className="space-y-4">
                {iisStudiesData.map((study, index) => (
                  <div key={index} className="p-2 border rounded">
                    <p><strong>Study Title:</strong> {study.iis_study_title}</p>
                    <p><strong>Asset:</strong> {study.asset}</p>
                    <p><strong>Indication:</strong> {study.indication}</p>
                    <p><strong>Phases:</strong> {study.phases}</p>
                    <p><strong>Enrollment:</strong> {study.enrollment}</p>
                    <p><strong>Enrollment Start Date:</strong> {study.start_date}</p>
                    <p><strong>Completion Date:</strong> {study.completion_date}</p>
                    <p><strong>Other Associated HCP IDs:</strong> {study.other_associated_hcp}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No IIS studies found for this HCP.</p>
            )}
          </div>

          <div className="w-1/3 p-4 border rounded shadow">
            <h2 className="text-lg font-semibold">PUBLIC INFO (table 3)</h2>
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

          <div className="w-1/3 p-4 border rounded shadow" style={{ height: '500px', overflowY: 'auto' }}>
            <h2 className="text-lg font-semibold">EVENTS (table 4)</h2>
            {eventsData.length > 0 ? (
              <div className="space-y-4">
                {eventsData.map((event, index) => (
                  <div key={index} className="p-2 border rounded">
                    <p><strong>Event Name:</strong> {event.event_name}</p>
                    <p><strong>Internal/External:</strong> {event.internal_or_external}</p>
                    <p><strong>Event Type:</strong> {event.event_type}</p>
                    <p><strong>Date of Event:</strong> {event.date_of_event}</p>
                    <p><strong>Event Description:</strong> {event.event_description}</p>
                    
                    <p><strong>Event Report:</strong> {event.event_report}</p>
                    <p><strong>Relevant Internal Stakeholders:</strong> {event.relevant_internal_stakeholders}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No events found for this HCP.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}



