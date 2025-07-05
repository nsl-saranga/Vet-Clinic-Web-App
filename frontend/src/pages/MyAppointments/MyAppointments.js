import React, { useEffect, useState } from 'react';
import './MyAppointments.css';
import { getUpcomingUserAppointments, getMissedUserAppointments, submitMissedReason, getCompletedUserAppointments, submitReview} from '../../services/appointmentService';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';
import {
  FaPencilAlt,
  FaDog,
  FaPaw,
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaPlusCircle,
  FaCommentAlt
} from 'react-icons/fa';
import { GiCancel } from "react-icons/gi";
import ReasonModal from '../../components/modals/ReasonModal';
import ReviewModal from '../../components/modals/ReviewModal';

const MyAppointments = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [missedAppointments, setMissedAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [viewReasonMode, setViewReasonMode] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [viewReviewMode, setViewReviewMode] = useState(false);
  const [selectedReview, setSelectedReview] = useState('');
  const [selectedRating, setSelectedRating] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [upcoming, missed, completed] = await Promise.all([
          getUpcomingUserAppointments(),
          getMissedUserAppointments(),
          getCompletedUserAppointments()
        ]);
        setUpcomingAppointments(upcoming.appointments || []);
        setMissedAppointments(missed.appointments || []);
        setCompletedAppointments(completed.appointments || []);
      } catch (error) {
        console.error('Failed to fetch appointments', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddAppointment = () => {
    navigate('/add-appointment');
  };

  const handleDelete = async (id) => {
    // Add cancellation API call here if needed
    console.log(`Cancel appointment: ${id}`);
  };

  const handleReasonSubmit = async (appointmentId, reasonText) => {
    try {
      await submitMissedReason(appointmentId, reasonText);
      // Re-fetch missed appointments after submitting
      const missed = await getMissedUserAppointments();
      setMissedAppointments(missed.appointments || []);
      setShowReasonModal(false);
      // Clear reason modal state
      setSelectedAppointmentId(null);
      setSelectedReason('');
      setViewReasonMode(false);
    } catch (error) {
      console.error("Failed to submit reason:", error);
    }
  };

  const handleReviewSubmit = async (appointmentId, rating, review) => {
    try {
      await submitReview(appointmentId, rating, review);
      // Re-fetch completed appointments after submitting
      const completed = await getCompletedUserAppointments();
      setCompletedAppointments(completed.appointments || []);
      setShowReviewModal(false);
      // Clear review modal state
      setSelectedAppointmentId(null);
      setSelectedReview('');
      setSelectedRating(null);
      setViewReviewMode(false);
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
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

      <section className="my-appointments-section services-section">
        <div className="services-container my-appointments-container">
          <div className="my-appointments-header">
            <h2><FaCalendarAlt className="icon-purple" /> Upcoming Appointments</h2>
            <button className="add-appointment-top-btn" onClick={handleAddAppointment}>
              ＋ Book New Appointment
            </button>
          </div>

          <div className="appointments-grid">
            {upcomingAppointments.length === 0 ? (
              <p>No Upcoming appointments found.</p>
            ) : (
              upcomingAppointments.map((appointment) => (
                <div className="appointment-card" key={appointment._id}>
                  {appointment.petsWithServices.map(({ pet, service }, index) => (
                    <div key={pet._id} className="pet-service-info">
                      <p><strong className="purple-text-title"><FaDog className="icon-purple" /> Pet {index + 1}</strong></p>
                      <p><strong> Pet Name:</strong> {pet.name}</p>
                      <p><strong>Service:</strong> {service.name}</p>
                    </div>
                  ))}

                  <p><strong className="purple-text-title"><FaUserMd className="icon-purple" /> Vet:</strong> {appointment.timeSlot?.vet?.firstName || 'N/A'}</p>
                  <p><strong className="purple-text-title"><FaCalendarAlt className="icon-purple" /> Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                  <p><strong className="purple-text-title"><FaClock className="icon-purple" /> Time:</strong> {appointment.timeSlot?.startTime || 'N/A'}</p>

                  <button
                    className="appointments-delete-btn"
                    onClick={() => handleDelete(appointment._id)}
                  >
                    <GiCancel className="cancel-icon"/>
                    Cancel
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed APPOINTMENTS */}
        <div className="services-container my-appointments-container">
          <div className="my-appointments-header">
            <h2><FaCalendarAlt className="icon-purple" /> Completed Appointments</h2>
          </div>

          <div className="appointments-grid">
            {completedAppointments.length === 0 ? (
              <p>No completed appointments found.</p>
            ) : (
              completedAppointments.map((appointment) => (
                <div className="appointment-card" key={appointment._id}>
                  {appointment.petsWithServices.map(({ pet, service }, index) => (
                    <div key={pet._id} className="pet-service-info">
                      <p><strong className="purple-text-title"><FaDog className="icon-purple" /> Pet {index + 1}</strong></p>
                      <p><strong> Pet Name:</strong> {pet.name}</p>
                      <p><strong>Service:</strong> {service.name}</p>
                    </div>
                  ))}

                  <p><strong className="purple-text-title"><FaUserMd className="icon-purple" /> Vet:</strong> {appointment.timeSlot?.vet?.firstName || 'N/A'}</p>
                  <p><strong className="purple-text-title"><FaCalendarAlt className="icon-purple" /> Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                  <p><strong className="purple-text-title"><FaClock className="icon-purple" /> Time:</strong> {appointment.timeSlot?.startTime || 'N/A'}</p>

                  {/* Review button */}
                  {appointment.review ? (
                    <button
                      className="review-view-btn"
                      onClick={() => {
                        setSelectedReview(appointment.review.text);
                        setSelectedRating(appointment.review.rating || null);
                        setViewReviewMode(true);
                        setSelectedAppointmentId(appointment._id);
                        setShowReviewModal(true);
                      }}
                    >
                      <FaPencilAlt className='review-icon'/> View Review
                    </button>
                  ) : (
                    <button
                      className="review-add-btn"
                      onClick={() => {
                        setSelectedAppointmentId(appointment._id);
                        setViewReviewMode(false);
                        setSelectedReview('');
                        setSelectedRating(null);
                        setShowReviewModal(true);
                      }}
                    >
                      <FaPencilAlt className='review-icon' /> Add Review
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* MISSED APPOINTMENTS */}
        <div className="services-container my-appointments-container">
          <div className="my-appointments-header">
            <h2><FaCalendarAlt className="icon-purple" /> Missed Appointments</h2>
          </div>

          <div className="appointments-grid">
            {missedAppointments.length === 0 ? (
              <p>No missed appointments found.</p>
            ) : (
              missedAppointments.map((appointment) => (
                <div className="appointment-card" key={appointment._id}>
                  {appointment.petsWithServices.map(({ pet, service }, index) => (
                    <div key={pet._id} className="pet-service-info">
                      <p><strong className="purple-text-title"><FaDog className="icon-purple" /> Pet {index + 1}</strong></p>
                      <p><strong> Pet Name:</strong> {pet.name}</p>
                      <p><strong>Service:</strong> {service.name}</p>
                    </div>
                  ))}

                  <p><strong className="purple-text-title"><FaUserMd className="icon-purple" /> Vet:</strong> {appointment.timeSlot?.vet?.firstName || 'N/A'}</p>
                  <p><strong className="purple-text-title"><FaCalendarAlt className="icon-purple" /> Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                  <p><strong className="purple-text-title"><FaClock className="icon-purple" /> Time:</strong> {appointment.timeSlot?.startTime || 'N/A'}</p>

                  {/* Missed reason button */}
                  {appointment.missedReason ? (
                    <button
                      className="missed-reason-view-btn"
                      onClick={() => {
                        setSelectedReason(appointment.missedReason);
                        setViewReasonMode(true);
                        setSelectedAppointmentId(appointment._id);
                        setShowReasonModal(true); // Fixed: This should open ReasonModal, not ReviewModal
                      }}
                    >
                      <FaCommentAlt className='comment-icon'/> View Reason
                    </button>
                  ) : (
                    <button
                      className="missed-reason-add-btn"
                      onClick={() => {
                        setSelectedAppointmentId(appointment._id);
                        setViewReasonMode(false);
                        setSelectedReason('');
                        setShowReasonModal(true); // Fixed: This should open ReasonModal, not ReviewModal
                      }}
                    >
                      <FaCommentAlt className='comment-icon' /> Add Reason
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <ReasonModal
        isOpen={showReasonModal}
        onClose={() => setShowReasonModal(false)}
        appointmentID={selectedAppointmentId}
        onSubmit={handleReasonSubmit}
        viewOnly={viewReasonMode}
        reasonText={selectedReason}
      />

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        appointmentID={selectedAppointmentId}
        onSubmit={handleReviewSubmit}
        viewOnly={viewReviewMode}
        reviewText={selectedReview}
        ratingValue={selectedRating} // Changed from 'rating' to 'ratingValue' to match modal prop
      />
    </>
  );
};

export default MyAppointments;