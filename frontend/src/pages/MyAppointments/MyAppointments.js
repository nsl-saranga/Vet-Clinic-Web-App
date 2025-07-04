import React, { useEffect, useState } from 'react';
import './MyAppointments.css';
import { getUpcomingUserAppointments, getMissedUserAppointments } from '../../services/appointmentService';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';

const MyAppointments = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [missedAppointments, setMissedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  const user = localStorage.getItem('user');
  if (!user) {
    navigate('/login');
    return;
  }

  const fetchData = async () => {
    try {
      setLoading(true); // 🔄 Start loading before any fetch

      const [upcoming, missed] = await Promise.all([
        getUpcomingUserAppointments(),
        getMissedUserAppointments(),
      ]);

      setUpcomingAppointments(upcoming.appointments || []);
      setMissedAppointments(missed.appointments || []);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    } finally {
      setLoading(false); // ✅ Stop loading after both fetches complete
    }
  };

  fetchData();
}, [navigate]);


  const handleEdit = (id) => {
    navigate(`/edit-pet/${id}`);
  };

  const handleDelete = async (id) => {
    // if (window.confirm('Are you sure you want to delete this pet?')) {
    //   try {
    //     await deletePet(id);
    //     setPets((prev) => prev.filter((pet) => pet._id !== id));
    //   } catch (error) {
    //     console.error('Failed to delete pet', error);
    //   }
    // }
  };

  const handleAddPet = () => {
    navigate('/add-pet');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="my-appointments-loading">Loading appointments...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />


        {/* SERVICES CARDS SECTION */}
      <section className="my-appointments-section services-section">
        <div className="services-container my-appointments-container">
          <div className="my-appointments-header">
            <h2>Upcoming Appointments</h2>
            <button className="add-appointment-top-btn" onClick={handleAddPet}>
            ＋ Add a New Appointment
            </button>
          </div>

            <div className="appointments-grid">
            {upcomingAppointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                upcomingAppointments.map((appointment) => (
                <div className="appointment-card" key={appointment._id}>
                    {/* List pets and their services */}
                    {appointment.petsWithServices.map(({ pet, service }, index) => (
                    <div key={pet._id} className="pet-service-info">
                        <p><strong className='purple-text-title'>Pet {index + 1}</strong></p>
                        <p><strong>Pet Name:</strong> {pet.name}</p>
                        <p><strong>Service:</strong> {service.name}</p>
                    </div>
                    ))}

                    {/* Appointment vet */}
                    <p>
                        <strong className='purple-text-title'>Vet:</strong>{' '}
                        {appointment.timeSlot?.vet?.firstName || 'N/A'}
                     </p>

                    {/* Appointment date */}
                    <p><strong className='purple-text-title'>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                   

                    {/* Appointment time */}
                    <p><strong className='purple-text-title'>Time:</strong> {appointment.timeSlot?.startTime || 'N/A'}</p>

                    {/* Cancel button */}
                    <button
                    className="appointments-delete-btn"
                    onClick={() => handleDelete(appointment._id)}
                    >
                    Cancel
                    </button>
                </div>
                ))
            )}
            </div>

        </div>

                <div className="services-container">
          <div className="my-appointments-header">
            <h2>Missed Appointments</h2>
          </div>

            <div className="appointments-grid">
            {missedAppointments.length === 0 ? (
                <p>No past appointments found.</p>
            ) : (
                missedAppointments.map((appointment) => (
                <div className="appointment-card" key={appointment._id}>
                    {/* List pets and their services */}
                    {appointment.petsWithServices.map(({ pet, service }, index) => (
                    <div key={pet._id} className="pet-service-info">
                        <p><strong className='purple-text-title'>Pet {index + 1}</strong></p>
                        <p><strong>Pet Name:</strong> {pet.name}</p>
                        <p><strong>Service:</strong> {service.name}</p>
                    </div>
                    ))}

                    {/* Appointment vet */}
                    <p>
                        <strong className='purple-text-title'>Vet:</strong>{' '}
                        {appointment.timeSlot?.vet?.firstName || 'N/A'}
                     </p>

                    {/* Appointment date */}
                    <p><strong className='purple-text-title'>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                   

                    {/* Appointment time */}
                    <p><strong className='purple-text-title'>Time:</strong> {appointment.timeSlot?.startTime || 'N/A'}</p>
                </div>
                ))
            )}
            </div>

        </div>
         
         
      </section>


  

    </>
  );
};

export default MyAppointments;
