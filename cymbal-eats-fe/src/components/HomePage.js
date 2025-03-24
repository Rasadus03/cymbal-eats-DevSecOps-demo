// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage({customer}) {
  return (
    <div className="home-page">
       if {customer.get("name") !== "None" ? (
        <h1>Welcome back, {customer.get("name")}!</h1>
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
  }).isRequired};
export default HomePage;