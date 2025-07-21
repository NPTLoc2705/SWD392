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
  async getPrograms() {
    try {
      const response = await apiClient.get('/programs/list-program');
      if (!Array.isArray(response.data)) {
        console.error('Invalid programs data format:', response.data);
        return [];
      }
      // Map the response to ensure consistent property names
      return response.data.map(program => ({
        Id: program.id,
        Title: program.title
      }));
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw new Error('Failed to fetch programs');
    }
  },

  async createDraft(formData) {
    try {
      const response = await apiClient.post('/application/draft', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating draft:', error);
      if (error.response && error.response.status === 400) {
        throw new Error('Invalid request data. Please check the input fields and files.');
      }
      throw new Error(error.response?.data?.message || 'Failed to create draft application');
    }
  },

  async submitApplication(applicationId) {
    try {
      const response = await apiClient.post(`/application/${applicationId}/submit`);
      return response.data;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw new Error(error.response?.data?.message || 'Failed to submit application');
    }
  },

  async getById(id) {
    try {
      const response = await apiClient.get(`/application/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch application');
    }
  },

  async getMyApplications() {
    try {
      const response = await apiClient.get('/application/my-applications');
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch applications');
    }
  },

  async updateApplication(id, formData) {
    try {
      const response = await apiClient.put(`/application/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating application:', error);
      throw new Error(error.response?.data?.message || 'Failed to update application');
    }
  },

  async changeStatus(id, status) {
    try {
      const response = await apiClient.patch(`/application/${id}/status`, {
        StatusValue: status,
      });
      return response.data;
    } catch (error) {
      console.error('Error changing application status:', error);
      throw new Error(error.response?.data?.message || 'Failed to change application status');
    }
  },
};

export default ApplicationService;