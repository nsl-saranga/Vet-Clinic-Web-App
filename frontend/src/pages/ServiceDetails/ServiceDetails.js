// ServiceDetails.jsx
import React, { useEffect, useState } from 'react';
import './ServiceDetails.css';
import Navbar from '../../components/navbar/navbar';
import { getServiceById } from "../../services/servicesService";
import { useParams } from 'react-router-dom';
import understandingImage from '../../assets/understand.jpeg'; // Assuming you have an image for understanding section

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const [serviceDetails, setServiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServiceById(serviceId)
      .then(data => {
        setServiceDetails(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch service details", error);
        setLoading(false);
      });
  }, [serviceId]);

  const handleBookAppointment = () => {
    console.log("Book appointment clicked");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="service-details-loading">Loading service details...</div>
      </>
    );
  }

  if (!serviceDetails) {
    return (
      <>
        <Navbar />
        <div className="service-details-error">Service not found.</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="service-details-section">
        <div className="service-details-container">
          <div className="service-details-column service-details-text-column">
            <h2>{serviceDetails.name}</h2>
            <p>{serviceDetails.description}</p>

            <button onClick={handleBookAppointment} className="service-details-book-appoinment-button">
              Book an Appointment
            </button>

            <div className="trust-indicators">
              <div className="indicator">
                <span className="number">500+</span>
                <span className="label">Happy Pets</span>
              </div>
              <div className="indicator">
                <span className="number">24/7</span>
                <span className="label">Emergency Care</span>
              </div>
              <div className="indicator">
                <span className="number">15+</span>
                <span className="label">Years Experience</span>
              </div>
            </div>
          </div>

          <div className="service-details-column service-details-image-column">
            <img src={serviceDetails.image} alt={serviceDetails.name} />
          </div>
        </div>
      </section>

      <section className="service-understanding-section services-section">
        <div className="service-understanding-container">
            <div className="service-understanding-header">
              <h2>Understanding {serviceDetails.name}</h2>
            </div>

            <div className="service-understanding-content">
                <div className="service-understanding-column service-understanding-image-column">
                    <img src={understandingImage} alt="a pet owner thinking" />
                </div>
           <div className="service-understanding-column service-understanding-text-column">
                <ul className="understanding-points-list">
                    {serviceDetails.reasons.map((point, index) => (
                    <li key={index}>
                        <span className="icon">🔍</span>
                        <span className="text">{point}</span>
                    </li>
                    ))}
                </ul>
                </div>

            </div>

        </div>
      </section>
      <section className="subservices-section">
        <div className="subservices-container">
            <h2 className="subservices-header">Our Subservices</h2>
            <div className="subservices-cards">
            {serviceDetails.subservices && serviceDetails.subservices.map((item, index) => (
                <div key={index} className="subservice-card">
                <div className="subservice-number">{index + 1}</div>
                <div className="subservice-name">{item}</div>
                </div>
            ))}
            </div>
        </div>
    </section>
         <section className="seek-doctor-section">
        <div className="seek-doctor-container">
            <h2 className="seek-doctor-header">When to Seek a Vet</h2>
         <div className="seek-doctor-points">
            <ul>
                {serviceDetails.whenToSeekDoctor.map((point, index) => (
                <li key={index}>
                    <span className="icon">⚕️</span>
                    <span className="text">{point}</span>
                </li>
                ))}
            </ul>
            </div>

        </div>
    </section>
    </>
  );
};

export default ServiceDetails;
