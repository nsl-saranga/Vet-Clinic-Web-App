import axios from 'axios';

const API_URL = 'http://localhost:5000/api/services';

// Fetch all services (GET)
export const getServices = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Fetch a specific service by name (GET)
export const getServiceById = async (serviceId) => {
  const response = await axios.get(`${API_URL}/${serviceId}`);
  return response.data;
};

