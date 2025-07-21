import axios from 'axios';

const API_BASE_URL = window.REACT_APP_API_BASE_URL || 'https://localhost:7013/api';

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include the token in headers
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const ApplicationService = {
    async getPrograms(){
         try {
    const response = await apiClient.get('/programs/list-program');
    if (!Array.isArray(response.data)) {
      console.error('Invalid programs data format:', response.data);
      return [];
    }
    // Map the response to ensure consistent property names
    return response.data.map(program => ({
      Id: program.id, // map lowercase id to Id
      Title: program.title // map lowercase title to Title
    }));
  } catch (error) {
    console.error('Error fetching programs:', error);
    return [];
  }
},
  async createDraft(request) {
    const formData = new FormData();
    
    formData.append('ProgramId', request.ProgramId);
    if (request.PortfolioLink) formData.append('PortfolioLink', request.PortfolioLink);
    if (request.OtherLink) formData.append('OtherLink', request.OtherLink);
    
    if (request.Image) formData.append('Image', request.Image);
    if (request.Documents) {
      request.Documents.forEach((doc) => {
        formData.append('Documents', doc);
      });
    }

    const response = await apiClient.post('/application/draft', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async submitApplication(applicationId) {
    const response = await apiClient.post(`/application/${applicationId}/submit`);
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/application/${id}`);
    return response.data;
  },

  async getMyApplications() {
    const response = await apiClient.get('/application/my-applications');
    return response.data;
  },

  async updateApplication(id, formData) {
  const response = await apiClient.put(`/application/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
},
  async changeStatus(id, status) {
    const response = await apiClient.patch(`/application/${id}/status`, {
      StatusValue: status,
    });
    return response.data;
  },
};

export default ApplicationService;