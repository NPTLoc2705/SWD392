import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApplicationService from '../Application/applicationService';

const statusColors = {
  'Draft': 'bg-gray-500',
  'Submitted': 'bg-blue-500',
  'UnderReview': 'bg-blue-300',
  'Under Review': 'bg-blue-300',
  'Approved': 'bg-green-500',
  'Rejected': 'bg-red-500',
};

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await ApplicationService.getById(id);
        setApplication(data);
      } catch (err) {
        console.error('Error loading application:', err);
        setError(err.message || 'Failed to load application');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleBack = () => {
    navigate('/applications/my-applications');
  };

  if (isLoading) {
    return (
      <div className="container py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4">Loading application details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-20">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
        <button
          onClick={handleBack}
          className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container py-20">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          Application not found
        </div>
        <button
          onClick={handleBack}
          className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  return (
    <div className="container py-12 mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Application Details</h2>
        <button
          onClick={handleBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
        >
          Back to Applications
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Program Title</p>
                <p className="font-medium">{application.programTitle || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`${statusColors[application.statusName]} text-white text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                  {application.statusName || 'Unknown'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted At</p>
                <p className="font-medium">
                  {application.submittedAt ? new Date(application.submittedAt).toLocaleString() : 'Not submitted'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Portfolio Link</p>
                <p className="font-medium">
                  {application.portfolioLink ? (
                    <a href={application.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {application.portfolioLink}
                    </a>
                  ) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Other Links</p>
                <p className="font-medium">
                  {application.otherLink ? (
                    <a href={application.otherLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {application.otherLink}
                    </a>
                  ) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Documents</h3>
          {application.documentUrls && application.documentUrls.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {application.documentUrls.map((doc, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <a 
                    href={doc} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline break-all"
                  >
                    Document {index + 1}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p>No documents uploaded</p>
          )}
        </div>
<div className="mt-8 flex justify-end">
  {application.status === 0 && (
    <>
      <button
        onClick={() => navigate(`/applications/${application.id}/edit`)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mr-2"
      >
        Edit Application
      </button>
      <button
        onClick={() => ApplicationService.submitApplication(application.id).then(() => navigate('/applications'))}
        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
      >
        Submit Application
      </button>
    </>
  )}
  <button
    onClick={handleBack}
    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded ml-2"
  >
    Back to List
  </button>
</div>
      </div>
    </div>
  );
};

export default ApplicationDetail;