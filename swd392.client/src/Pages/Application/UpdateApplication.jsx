import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApplicationService from './applicationService';


const UpdateApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    programId: '',
    programTitle: '',
    studentName: '',
    studentPhone: '',
    portfolioLink: '',
    otherLink: '',
    imageUrl: null,
    documentUrls: []
  });
  const [programs, setPrograms] = useState([]);
  const [newDocument, setNewDocument] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch application data
        const appData = await ApplicationService.getById(id);
        // Fetch programs list
        const programsData = await ApplicationService.getPrograms();
        
        setPrograms(programsData);
        setFormData({
          programId: appData.programId || '',
          programTitle: appData.programTitle || '',
          studentName: appData.StudentName || '',
          studentPhone: appData.StudentPhone || '',
          portfolioLink: appData.portfolioLink || '',
          otherLink: appData.otherLink || '',
          imageUrl: appData.imageUrl || null,
          documentUrls: appData.documentUrls || []
        });
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProgramChange = (e) => {
    const selectedProgram = programs.find(p => p.Id === e.target.value);
    setFormData(prev => ({
      ...prev,
      programId: e.target.value,
      programTitle: selectedProgram?.Title || ''
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      // For preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          imageUrl: event.target.result
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddDocument = () => {
    if (newDocument.trim()) {
      setFormData(prev => ({
        ...prev,
        documentUrls: [...prev.documentUrls, newDocument.trim()]
      }));
      setNewDocument('');
    }
  };
const handleDocumentChange = (e) => {
  if (e.target.files && e.target.files.length > 0) {
    const filesArray = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      documentUrls: [...prev.documentUrls, ...filesArray]
    }));
  }
};
  const handleRemoveDocument = (index) => {
  setFormData(prev => ({
    ...prev,
    documentUrls: prev.documentUrls.filter((_, i) => i !== index)
  }));
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    const formDataToSend = new FormData();
    
    // Append all text fields with correct property names
    formDataToSend.append('StudentName', formData.studentName);
    formDataToSend.append('Student_Phone', formData.studentPhone);
    formDataToSend.append('ProgramId', formData.programId);
    formDataToSend.append('PortfolioLink', formData.portfolioLink);
    formDataToSend.append('OtherLink', formData.otherLink);
    
    // Append image file if a new one was selected
    if (imageFile) {
      formDataToSend.append('Image', imageFile);
    }
    
    formData.documentUrls.forEach(doc => {
      if (doc instanceof File) {
        formDataToSend.append('Documents', doc);
      }
    });

    const apiResponse = await ApplicationService.updateApplication(id, formDataToSend);
console.log('Update successful:', apiResponse);
navigate(`/applications/${id}`)
  } catch (err) {
    console.error('Error updating application:', err);
    setError(err.message || 'Failed to update application');
  } finally {
    setIsSubmitting(false);
  }
};
  if (isLoading) {
    return <div className="container py-20 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container py-20">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
        <button
          onClick={() => navigate('/applications')}
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
        <h2 className="text-2xl font-bold">Edit Application</h2>
        <button
          onClick={() => navigate(`/applications/${id}`)}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Student Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="studentPhone"
                  value={formData.studentPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Program Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Program Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Select Program *</label>
                <select
                  name="programId"
                  value={formData.programId}
                  onChange={handleProgramChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select a program</option>
                  {programs.map(program => (
                    <option key={program.Id} value={program.Id}>
                      {program.Title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Selected Program</label>
                <p className="font-medium">{formData.programTitle || 'None selected'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Portfolio Link</label>
              <input
                type="url"
                name="portfolioLink"
                value={formData.portfolioLink}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Other Link</label>
              <input
                type="url"
                name="otherLink"
                value={formData.otherLink}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
  {/* Image Upload */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Profile Image</h3>
          <div className="flex items-center space-x-4">
            {formData.imageUrl && (
              <img 
                src={formData.imageUrl} 
                alt="Profile" 
                className="h-16 w-16 rounded-full object-cover"
              />
            )}
            <label className="cursor-pointer">
              <span className="sr-only">Choose profile image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </label>
          </div>
        </div>


{/*Document session*/}
        {/* Image Upload */}
    <div className="mt-6">
  <h3 className="text-lg font-semibold mb-4">Documents</h3>
  
  {/* File Input */}
  <div className="mb-4">
    <label className="cursor-pointer block">
      <div className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
        <span className="text-gray-500">
          {formData.documentUrls.length > 0 
            ? 'Add more documents' 
            : 'Click to upload documents'}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
          />
        </svg>
      </div>
      <input
        type="file"
        multiple
        accept=".pdf,.doc,.docx"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            // Check file size (5MB max)
            const validFiles = filesArray.filter(file => file.size <= 5 * 1024 * 1024);
            
            if (validFiles.length !== filesArray.length) {
              setError('Some files were too large (max 5MB)');
            }
            
            setFormData(prev => ({
              ...prev,
              documentUrls: [...prev.documentUrls, ...validFiles]
            }));
          }
        }}
        className="hidden"
      />
    </label>
    <p className="text-xs text-gray-500 mt-1">Supports PDF, DOC, DOCX (Max 5MB each)</p>
  </div>
  
  {/* Uploaded Files Preview */}
  {formData.documentUrls.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {formData.documentUrls.map((doc, index) => {
        // Helper to get document name
        const getDocName = () => {
          if (doc instanceof File) return doc.name;
          if (typeof doc === 'string') {
            // Extract filename from URL
            const urlParts = doc.split('/');
            return urlParts[urlParts.length - 1] || `Document ${index + 1}`;
          }
          return `Document ${index + 1}`;
        };

        // Helper to get document type
        const getDocType = () => {
          const name = getDocName().toLowerCase();
          if (name.endsWith('.pdf')) return 'PDF';
          if (name.endsWith('.doc')) return 'DOC';
          if (name.endsWith('.docx')) return 'DOCX';
          return 'File';
        };

        return (
          <div key={index} className="border rounded-lg p-3 flex justify-between items-center bg-white">
            <div className="flex items-center truncate">
              <div className={`p-2 mr-2 rounded ${
                getDocType() === 'PDF' ? 'bg-red-100 text-red-500' :
                getDocType() === 'DOC' || getDocType() === 'DOCX' ? 'bg-blue-100 text-blue-500' :
                'bg-gray-100 text-gray-500'
              }`}>
                {getDocType() === 'PDF' ? (
                  <span className="text-xs font-bold">PDF</span>
                ) : getDocType() === 'DOC' || getDocType() === 'DOCX' ? (
                  <span className="text-xs font-bold">DOC</span>
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                )}
              </div>
              <div className="truncate">
                <p className="text-gray-700 truncate">{getDocName()}</p>
                <p className="text-xs text-gray-500">{getDocType()} • {
                  doc instanceof File ? 
                  `${Math.round(doc.size / 1024)} KB` : 
                  'Uploaded'
                }</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  documentUrls: prev.documentUrls.filter((_, i) => i !== index)
                }));
              }}
              className="text-red-500 hover:text-red-700 ml-2"
              aria-label="Remove document"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-gray-500 text-sm py-2">No documents uploaded yet</p>
  )}
</div>
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => navigate(`/applications/${id}`)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateApplication;