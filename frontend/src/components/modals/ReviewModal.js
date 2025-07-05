import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import './Modal.css';

const ReviewModal = ({
  isOpen,
  appointmentID,
  onClose,
  onSubmit,
  viewOnly = false,
  reviewText = '',
  ratingValue = 0,
}) => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (viewOnly) {
      setReview(reviewText || '');
      setRating(ratingValue || 0);
    } else {
      setReview('');
      setRating(0);
    }
  }, [viewOnly, reviewText, ratingValue, isOpen]);

  const handleStarClick = (star) => {
    if (!viewOnly) setRating(star);
  };

  const handleSubmit = () => {
    if (!review.trim() || rating < 1) return;
    onSubmit(appointmentID, rating, review);
    setReview('');
    setRating(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>
          {viewOnly
            ? 'Review for Completed Appointment'
            : 'Add Review for Completed Appointment'}
        </h3>

        <label className="modal-label">Rating:</label>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`star-icon ${star <= rating ? 'filled' : ''} ${
                viewOnly ? 'readonly' : 'clickable'
              }`}
              onClick={() => handleStarClick(star)}
            />
          ))}
        </div>

        <label className="modal-label">Review:</label>
        {viewOnly ? (
          <div className="modal-review-view-text">{review}</div>
        ) : (
          <textarea
            placeholder="Enter your review..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
            className="modal-textarea"
          />
        )}

        <div className="modal-buttons">
          {!viewOnly && (
            <button onClick={handleSubmit} className="submit-reason-btn">
              Submit
            </button>
          )}
          <button onClick={onClose} className="reason-modal-cancel-btn">
            {viewOnly ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
