// src/components/HomePage.js
import {React, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function HomePage({customer}) {
  const [welcome, setWelcome] = useState([]);
    useEffect(() => {
  if (customer instanceof Map ) {
   setWelcome( "Welcome back," +customerName);
  } else {
    setWelcome("Welcome to Cymbal Eats Food Delivery!");
  }
  
    }, [customer]);
  
  return (
    <div className="home-page">
              <h1>{welcome}</h1>
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