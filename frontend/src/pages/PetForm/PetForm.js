import React, { useEffect, useState } from 'react';
import { createPet, updatePet, getPetById } from '../../services/petService';
import { useNavigate, useParams } from 'react-router-dom';
import { FaDog, FaPaw, FaCalendarAlt, FaVenusMars, FaCamera } from 'react-icons/fa';
import './PetForm.css';

const PetForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    dob: '',
    gender: '',
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchPet = async () => {
        try {
          const pet = await getPetById(id);
          setFormData({
            name: pet.name || '',
            species: pet.species || '',
            breed: pet.breed || '',
            dob: pet.dob?.slice(0, 10) || '',
            gender: pet.gender || '',
            image: null,
          });
          setPreview(pet.image);
        } catch (err) {
          console.error('Error loading pet:', err);
        }
      };

      fetchPet();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.species.trim()) newErrors.species = 'Species is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      if (isEditMode) {
        await updatePet(id, formData);
      } else {
        await createPet(formData);
      }
      navigate('/my-pets');
    } catch (err) {
      console.error('Submit failed:', err);
      setErrors({ general: 'Submission failed. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pet-form-container">
      <div className="pet-form-card">
        <div className="pet-form-header">
          <h2><FaPaw /> {isEditMode ? 'Edit Pet' : 'Add New Pet'}</h2>
        </div>

        {errors.general && <div className="error-text general-error">{errors.general}</div>}

        <form onSubmit={handleSubmit} className="pet-form">
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <div className="input-field">
              <FaDog className="input-icon" />
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Tommy"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
            </div>
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="input-group">
            <label htmlFor='species'>Species</label>
            <div className="input-field">
                <FaDog className="input-icon" />
                <input
                name="species"
                id='species'
                placeholder="Dog / Cat"
                value={formData.species}
                onChange={handleChange}
                className={errors.species ? 'error' : ''}
                />
            </div>
            {errors.species && <span className="error-text">{errors.species}</span>}
          </div>

          <div className="input-group">
            <label htmlFor='breed'>Breed</label>
            <div className="input-field">
                <FaDog className="input-icon" />
                <input
                name="breed"
                id="breed"
                placeholder="German Shepherd"
                value={formData.breed}
                onChange={handleChange}
                />

            </div>

          </div>

          <div className="input-group">
            <label htmlFor='dob'>Date of Birth</label>
            <div className="input-field">
                <FaCalendarAlt className="input-icon" />
                <input
                type="date"
                name="dob"
                id='dob'
                value={formData.dob}
                onChange={handleChange}
                placeholder='YYYY-MM-DD'
                />
            </div>

          </div>

          <div className="input-group">
            <label htmlFor='gender'>Gender</label>
            <div className="input-field">
                <FaVenusMars className="input-icon" />
                <select
                name="gender"
                id='gender'
                value={formData.gender}
                onChange={handleChange}
                className={errors.gender ? 'error' : ''}
                >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                </select>

            </div>
            {errors.gender && <span className="error-text">{errors.gender}</span>}
          </div>

          <div className="input-group">
            <label htmlFor='image'>Pet Image</label>
            <div className="input-field">
                <FaCamera className="input-icon" />
                <input
                type="file"
                name="image"
                accept="image/*"
                id="image"
                onChange={handleChange}
                />

            </div>
            {preview && <img src={preview} alt="Preview" className="preview-img" />}
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Saving...' : isEditMode ? 'Update Pet' : 'Add Pet'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PetForm;
