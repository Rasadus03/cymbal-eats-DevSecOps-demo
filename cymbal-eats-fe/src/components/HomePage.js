// src/components/HomePage.js
import {React, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function HomePage({customerName}) {
  const [welcome, setWelcome] = useState([]);
    useEffect(() => {
  
     
  console.log ("test wwww ===" +customerName.length +"---");
  if (customerName !== "None" && customerName.length >0 ) {
   setWelcome( "Welcome back," +customerName);
  } else {
    setWelcome("Welcome to Cymbal Eats Food Delivery!");
  }
  
    }, [customerName]);
  
  return (
    <div className="home-page">
              <h1>{welcome}</h1>
      <p>Explore our delicious options from various restaurants.</p>
        <Link to="/restaurants" className='link-to-restaurants-button'>Browse Restaurants</Link>
    </div>
  );
}
HomePage.propTypes = {
  customerName: PropTypes.string.isRequired};

export default HomePage;