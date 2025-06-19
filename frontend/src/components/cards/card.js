import React from 'react';
import './card.css';

const Card = ({ image, title, description, onClick }) => {
  const shortDesc = description.split(" ").slice(0, 20).join(" ") + "...";

  return (
    <div className="service-card">
      <div className="service-card-image-container">
        <img src={image} alt={title} className="service-card-image" />
      </div>
      <div className="service-card-content">
        <h3 className="service-card-title">{title}</h3>
        <p className="service-card-desc">{shortDesc}</p>
        <button className="service-card-button" onClick={onClick}>
          Learn More
        </button>
      </div>
    </div>
  );
};

export default Card;
