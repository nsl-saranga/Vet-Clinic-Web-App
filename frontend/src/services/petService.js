import axios from 'axios';

const API_BASE = "http://localhost:5000/api/pets";

// 📌 Extract Auth Header from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// 📥 Get all pets of the logged-in user
export const getUserPets = async () => {
  const response = await axios.get(API_BASE, getAuthHeader());
  return response.data;
};

// 📥 Get one pet
export const getPetById = async (id) => {
  const response = await axios.get(`${API_BASE}/${id}`, getAuthHeader());
  return response.data;
};



export const createPet = async (petData) => {
  const formData = new FormData();

  Object.entries(petData).forEach(([key, value]) => {
    if (key === 'image' && value) {
      formData.append('image', value); // Only append if file exists
    } else {
      formData.append(key, value);
    }
  });

  const response = await axios.post(API_BASE, formData, {
    headers: {
      ...getAuthHeader().headers, // includes Authorization
      // ⚠️ DO NOT set 'Content-Type': browser will handle it with FormData
    },
  });

  return response.data;
};

// ✏️ Update pet
export const updatePet = async (id, petData) => {
  const formData = new FormData();


    Object.entries(petData).forEach(([key, value]) => {
    if (key === 'image' && value) {
      formData.append('image', value); // Only append if file exists
    } else {
      formData.append(key, value);
    }
  });

  const response = await axios.put(`${API_BASE}/${id}`, formData, {
    headers: {
      ...getAuthHeader().headers, // includes Authorization
      // ⚠️ DO NOT set 'Content-Type': browser will handle it with FormData
    },
  });
  if (response.status !== 200) {
    throw new Error('Failed to update pet');
  }
  return response.data;
};

// ❌ Delete pet
export const deletePet = async (id) => {
  const response = await axios.delete(`${API_BASE}/${id}`, getAuthHeader());
  return response.data;
};
