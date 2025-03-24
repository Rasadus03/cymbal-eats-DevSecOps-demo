// src/components/RestaurantList.js
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function RestaurantList({ restaurants }) {
  return (
    <div className="restaurant-list">
      <h2>Restaurants</h2>
      {restaurants.length === 0 ? (
          <p>No restaurants found.</p>
      ) : (
        <div className='restaurant-cards-container'>
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card">
            <img src={restaurant.image} alt={restaurant.name} />
            <h3>
              <Link to={`/restaurants/${restaurant.id}`}>{restaurant.name}</Link>
            </h3>
            <p>Cuisine: {restaurant.cuisine}</p>
            <p>{restaurant.description}</p>
             <Link to={`/restaurants/${restaurant.id}`} className="view-menu-button">View Menu</Link>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}

// Add PropTypes for type checking
RestaurantList.propTypes = {
  restaurants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      cuisine: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
       menu: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          price: PropTypes.number.isRequired,
          description: PropTypes.string.isRequired
        })
      ).isRequired
    })
  ).isRequired,
};

export default RestaurantList;