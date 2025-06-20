import Navbar from "../../components/navbar/navbar";
import './HomePage.css';
import dogImg from '../../assets/who_we_are.jpg';
import { getServices } from "../../services/servicesService"; 
import React, { useEffect, useState } from 'react';
import Card from "../../components/cards/card";
import { HiMiniArrowSmallRight } from "react-icons/hi2";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [services, setServices] = useState([]);

  useEffect(() => {
  getServices()
    .then(data => setServices(data.slice(0,3)))
    .catch(error => console.error("Failed to fetch services", error));
  }, []);
  

  const handleBookAppointment = () => {
    // Add your booking logic here
    console.log("Book appointment clicked");
  };

  const handleServiceClick = (serviceName) => {
    // Add service-specific logic here
    console.log(`Learn more about ${serviceName}`);
  };
  
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Vet Care</h1>
          <p>Your trusted partner in pet health.</p>
          <p>Providing expert veterinary care with compassion, because your pet deserves nothing less</p>
        </div>
      </section>
      
      {/* Who We Are Section */}
      <section className="who-we-are-section">
        <div className="who-we-are-column-container">
          <div className="who-we-are-column image-column">
            <img src={dogImg} alt="Veterinary team caring for pets" />
          </div>
          
          <div className="who-we-are-column text-column">
            <h2>Who we are?</h2>
            <p>
              We are a compassionate team of experienced veterinarians, skilled technicians, and devoted animal lovers united by one mission — to keep your pets healthy, happy, and thriving. With a blend of cutting-edge medical expertise and genuine empathy, we offer personalized care that treats every pet like family.
            </p>
            <p>
              Our clinic is built on trust, transparency, and a deep understanding of the human-animal bond. Whether it's a routine check-up, emergency treatment, or long-term wellness planning, we're here to support you every step of the way.
            </p>
            <button onClick={handleBookAppointment} className="book-appoinment-button">
              Book an Appointment 
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="services-container">
          <div className="services-header">
            <h2>Our Services</h2>
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
              onClick={() => handleServiceClick(service.name)}
            />
         ))}
          </div>
       <div className="services-view-all-services">
          <a href="/services" className="services-view-all-link">
            <span>View all the services</span>
            <HiMiniArrowSmallRight className="services-view-all-icon" />
          </a>
        </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;