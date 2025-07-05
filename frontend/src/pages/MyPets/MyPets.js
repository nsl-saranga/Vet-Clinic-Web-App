import React, { useEffect, useState } from 'react';
import './MyPets.css';
import { getUserPets, deletePet } from '../../services/petService';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';
import { FaDog, FaPaw } from 'react-icons/fa';

const MyPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPets = async () => {
      try {
        const data = await getUserPets();
        setPets(data);
      } catch (error) {
        console.error('Failed to fetch pets', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [navigate]);

  const handleEdit = (id) => {
    navigate(`/edit-pet/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await deletePet(id);
        setPets((prev) => prev.filter((pet) => pet._id !== id));
      } catch (error) {
        console.error('Failed to delete pet', error);
      }
    }
  };

  const handleAddPet = () => {
    navigate('/add-pet');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="my-pets-loading">Loading pets...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />


        {/* SERVICES CARDS SECTION */}
      <section className="my-pets-section services-section">
        <div className="services-container">
          <div className="my-pets-header">
            <h2><FaDog className="icon-purple" />All My Pets</h2>
            <button className="add-pet-top-btn" onClick={handleAddPet}>
            ＋ Add a New Pet
            </button>
          </div>

            <div className="pets-grid">
                {pets.length === 0 ? (
                    <p>{pets}</p>
                ) : (
                    pets.map((pet) => (
                    <div className="pet-card" key={pet._id}>
                        <img src={pet.image} alt={pet.name} />
                        <div className="pet-info">
                        <h3>{pet.name}</h3>
                        <p><strong>Species:</strong> {pet.species}</p>
                        <p><strong>Breed:</strong> {pet.breed || 'N/A'}</p>
                        <p><strong>Gender:</strong> {pet.gender}</p>
                        <p><strong>DOB:</strong> {pet.dob?.slice(0, 10)}</p>
                        </div>
                        <div className="pet-actions">
                        <button className="edit-btn" onClick={() => handleEdit(pet._id)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(pet._id)}>Delete</button>
                        </div>
                    </div>
                    ))
                )}
            </div>
        </div>
         
      </section>

    </>
  );
};

export default MyPets;
