// src/components/HomePage.js
import {React, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function HomePage({customer}) {
  // Check if the customer object exists and has a name
  const userName = customer && customer.get("name") ? customer.get("name") : null;

  return (
    <div className="home-page">
      {userName ? (
        <h1>Welcome, {userName}!</h1>
      ) : (
        <h1>Welcome to Cymbal Eats Food Delivery!</h1>
      )}
      <p>Explore our delicious options from various restaurants.</p>
      <Link to="/restaurants" className='link-to-restaurants-button'>Browse Restaurants</Link>
    </div>
  );
}

HomePage.propTypes = {
  customer: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
      photoURL: PropTypes.string.isRequired,
    }).isRequired,};

export default HomePage;