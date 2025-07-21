import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationService from './applicationService';

const CreateApplicationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ProgramId: '',
    PortfolioLink: '',
    OtherLink: '',
  });
  const [programs, setPrograms] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await ApplicationService.getPrograms();
        console.log('Programs programs:', data);
        setPrograms(data);
      } catch (err) {
        console.error('Failed to load programs:', err);
        setError('Failed to load programs');
      }
    };
    fetchPrograms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (setFileFunction) => (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileFunction(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const request = {
        ...formData,
        Image: imageFile || undefined,
        Documents: documentFiles.length > 0 ? documentFiles : undefined,
      };

      const response = await ApplicationService.createDraft(request);
      navigate(`/applications/${response.Id}`);
    } catch (err) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Create New Application</h2>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Program *
              </label>
              <select
  name="ProgramId"
  value={formData.ProgramId}
  onChange={handleInputChange}
  required
  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
>
  <option value="">-- Select a Program --</option>
  {Array.isArray(programs) && programs.map(program => (
    program?.Id && program?.Title ? (
      <option key={program.Id} value={program.Id}>
        {program.Title}
      </option>
    ) : null
  ))}
</select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Portfolio Link (Optional)
              </label>
              <input
                type="url"
                name="PortfolioLink"
                value={formData.PortfolioLink}
                onChange={handleInputChange}
                placeholder="https://example.com/portfolio"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Other Link (Optional)
              </label>
              <input
                type="url"
                name="OtherLink"
                value={formData.OtherLink}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Profile Image (Required)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange(setImageFile)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Supporting Documents (Required)
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => setDocumentFiles(e.target.files ? Array.from(e.target.files) : [])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                {documentFiles.length > 0 
                  ? `${documentFiles.length} file(s) selected` 
                  : 'No files selected'}
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-75' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Draft...
                  </>
                ) : (
                  'Save as Draft'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateApplicationPage;