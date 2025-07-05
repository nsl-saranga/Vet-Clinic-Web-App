import axios from 'axios';

const API_BASE = "http://localhost:5000/api/appointments";

// 📌 Extract Auth Header from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// 📥 Get all upcoming appointments of the user
export const getUpcomingUserAppointments = async () => {
  const response = await axios.get(`${API_BASE}?status=upcoming`, getAuthHeader());
  return response.data;
};

export const getMissedUserAppointments = async () => {
  const response = await axios.get(`${API_BASE}?status=missed`, getAuthHeader());
  return response.data;
};

export const getCompletedUserAppointments = async () => {
  const response = await axios.get(`${API_BASE}?status=completed`, getAuthHeader());
  return response.data;
};

// ✅ Just sends the reason to the backend
export const submitMissedReason = async (appointmentId, reasonText) => {
  const response = await axios.put(
    `${API_BASE}/${appointmentId}/missed-reason`,
    { reason: reasonText },
    getAuthHeader()
  );
  return response.data;
};


export const submitReview = async (appointmentId, rating, review) => {
  const response = await axios.put(
    `${API_BASE}/${appointmentId}/review`,
    { 
      rating: rating,
      review: review 
    },
    getAuthHeader()
  );
  return response.data;
};



