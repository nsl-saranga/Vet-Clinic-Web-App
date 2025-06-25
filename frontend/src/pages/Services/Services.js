import React, { useEffect, useState } from 'react';
import './Services.css';
import serviceImage from '../../assets/services.jpg';
import Navbar from '../../components/navbar/navbar';
import { getServices } from "../../services/servicesService"; 
import Card from "../../components/cards/card";
import { HiMiniArrowSmallRight } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const [services, setServices] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getServices()
      .then(data => setServices(data)) // Fetch only first 3
      .catch(error => console.error("Failed to fetch services", error));
  }, []);

  const handleBookAppointment = () => {
    console.log("Book appointment clicked");
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/service/${serviceId}`);
    console.log(`Learn more about ${serviceId}`);
  };

  return (
    <>
      <Navbar />

      {/* WHO WE ARE SECTION */}
      <section className="all-services-section">
        <div className="all-services-container">
          <div className="all-services-column all-services-text-column">
            <h2>Our Services</h2>
            <p>
              We are a compassionate team of experienced veterinarians, skilled technicians, and devoted animal lovers united by one mission — to keep your pets healthy, happy, and thriving. With a blend of cutting-edge medical expertise and genuine empathy, we offer personalized care that treats every pet like family.
            </p>
            <p>
              Our clinic is built on trust, transparency, and a deep understanding of the human-animal bond. Whether it's a routine check-up, emergency treatment, or long-term wellness planning, we're here to support you every step of the way.
            </p>
            <button onClick={handleBookAppointment} className="all-services-book-appoinment-button">
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

          <div className="all-services-column all-services-image-column">
            <img src={serviceImage} alt="Veterinary checking a dog" />
          </div>
        </div>
      </section>

      {/* SERVICES CARDS SECTION */}
      <section className="all-services-cards-section services-section">
        <div className="services-container">
          <div className="services-header">
            <h2>All Our Services</h2>
            <p>
              We offer comprehensive veterinary care services designed to meet all your pet's health and wellness needs throughout their lifetime.
            </p>
          </div>

          <div className="services-grid">
            {services.map(service => (
              <Card
                key={service._id}
                image={service.image}
                title={service.name}
                description={service.description}
                onClick={() => handleServiceClick(service._id)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
