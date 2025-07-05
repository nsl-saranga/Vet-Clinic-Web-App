import React, { useState, useEffect } from 'react';
import './Modal.css';

const ReasonModal = ({ 
  isOpen, 
  appointmentID, 
  onClose, 
  onSubmit, 
  viewOnly = false, 
  reasonText = '' 
}) => {
  const [reason, setReason] = useState('');

  // Pre-fill the reason for viewing
  useEffect(() => {
    if (viewOnly) {
      setReason(reasonText);
    } else {
      setReason('');
    }
  }, [viewOnly, reasonText, isOpen]);

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onSubmit(appointmentID, reason);
    setReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{viewOnly ? 'Missed Appointment Reason' : 'Add Reason for Missed Appointment'}</h3>

        {viewOnly ? (
          <div className="view-reason-text">{reason}</div>
        ) : (
          <textarea
            placeholder="Enter reason here..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={5}
          />
        )}

        <div className="modal-buttons">
          {!viewOnly && (
            <button onClick={handleSubmit} className="submit-reason-btn">Submit</button>
          )}
          <button onClick={onClose} className="reason-modal-cancel-btn">
            {viewOnly ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReasonModal;
