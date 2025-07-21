import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationService from './applicationService';

const statusColors = {
  'Draft': 'bg-gray-500',
  'Submitted': 'bg-blue-500',
  'UnderReview': 'bg-blue-300',
  'Under Review': 'bg-blue-300',
  'Approved': 'bg-green-500',
  'Rejected': 'bg-red-500',
};

const statusNames = {
  'Draft': 'Draft',
  'Submitted': 'Submitted',
  'UnderReview': 'Under Review',
  'Under Review': 'Under Review',
  'Approved': 'Approved',
  'Rejected': 'Rejected'
};

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await ApplicationService.getMyApplications();
        // Transform data to ensure consistent property names
        const transformedData = Array.isArray(data) ? data.map(app => ({
          Id: app.id || app.Id,
          ProgramTitle: app.programTitle || app.ProgramTitle,
          Status: app.status,
          StatusName: app.statusName || (app.status === 0 ? 'Draft' : 
                                      app.status === 1 ? 'Submitted' :
                                      app.status === 2 ? 'Under Review' :
                                      app.status === 3 ? 'Approved' : 'Rejected'),
          SubmittedAt: app.submittedAt || app.SubmittedAt
        })) : [];
        setApplications(transformedData);
      } catch (err) {
        console.error('Error loading applications:', err);
        setError(err.message || 'Failed to load applications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleSubmitApplication = async (id) => {
    try {
      await ApplicationService.submitApplication(id);
      const data = await ApplicationService.getMyApplications();
      const transformedData = Array.isArray(data) ? data.map(app => ({
        Id: app.id || app.Id,
        ProgramTitle: app.programTitle || app.ProgramTitle,
        Status: app.status,
        StatusName: app.statusName || statusNames[app.statusName] || 'Unknown',
        SubmittedAt: app.submittedAt || app.SubmittedAt
      })) : [];
      setApplications(transformedData);
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err.message || 'Failed to submit application');
    }
  };

  if (isLoading) {
    return (
      <div className="container py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4">Loading your applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-20">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 mx-auto px-4">
      <h2 className="text-2xl font-bold mb-8">My Applications</h2>
      
      {applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="mb-4">You haven't created any applications yet.</p>
          <button
            onClick={() => navigate('/applications/new')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Create New Application
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.Id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{app.ProgramTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`${statusColors[app.StatusName]} text-white text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                      {statusNames[app.StatusName] || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.SubmittedAt ? new Date(app.SubmittedAt).toLocaleDateString() : 'Not submitted'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/applications/${app.Id}`)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-1 px-3 rounded text-sm mr-2"
                    >
                      View
                    </button>
                    {app.Status === 0 && (
                      <button
                        onClick={() => handleSubmitApplication(app.Id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded text-sm"
                      >
                        Submit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;