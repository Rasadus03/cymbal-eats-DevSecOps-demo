// src/components/HomePage.js
import {React, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function HomePage({customer}) {
 
  let welcomeMessage = "Welcome to Cymbal Eats Food Delivery!";

  if (customer instanceof Map && customer.has("name")) {
    welcomeMessage = `Welcome, ${customer.get("name")}! Hope you are having a delightful day`;
  } else if (typeof customer === 'object' && customer !== null && customer.hasOwnProperty('name')) {
    welcomeMessage = `Welcome, ${customer.name}!`;
  }

  return (
    <div className="home-page">
    <h1>{welcomeMessage}</h1>
    <p>Explore our delicious options from various restaurants.</p>
    <Link to="/restaurants" className='link-to-restaurants-button'>Browse Restaurants</Link>
  </div>
  );
}



HomePage.propTypes = {
  customer: PropTypes.oneOfType([
    PropTypes.instanceOf(Map),
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
      photoURL: PropTypes.string.isRequired,
    }),
  ]).isRequired,
};

export default HomePage;