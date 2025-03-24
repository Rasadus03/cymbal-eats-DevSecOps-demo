// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


function Header({ cartItemCount , toogle}) {
  return (
    <header className="app-header">
      <script src="https://www.gstatic.com/firebasejs/7.18/firebase-app.js"></script>
      <script src="https://www.gstatic.com/firebasejs/7.18/firebase-auth.js"></script>
      <div className="logo">
      <a href="/" className="logo"><img className="imageLogo" src="../cymbaleats1.png" alt="Logo"/> </a>
      </div>


      <div className="signin-button">
      <button className="app-header-button" id="signInButton" onClick={()=>toogle()}>Sign In</button>
      </div>
      <nav>

        <ul>
          <li><Link to="/restaurants">Restaurants</Link></li>
          <li>
            <Link to="/cart">
              My Cart ({cartItemCount})
            </Link>
          </li>
          <li><Link to="/orders">My Orders</Link></li>
        </ul>
      </nav>
    </header>
  );
}

Header.propTypes = {
  cartItemCount: PropTypes.number.isRequired,
  toogle: PropTypes.func.isRequired,
};

export default Header;
