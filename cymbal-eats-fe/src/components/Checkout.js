// src/components/Checkout.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';


function Checkout({ cartItems, restaurants, clearCart, setCart, customer }) {
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false); // Track order status
  const navigate = useNavigate();
  useEffect(() => {
    console.log("cartItems =" +cartItems);
    console.log("restaurants =" +restaurants);

  }, []);

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find((element) => {
      return element.id == restaurantId;
    });
    console.log("restaurant =" +restaurant);
    console.log("restaurantId =" +restaurantId+"@");
    console.log("restaurants =" +restaurants);

    restaurants.map((field) => console.log("field ="+field.id+"@"));
    return restaurant ? restaurant.name : 'Unknown Restaurant';
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const transformed = cartItems.map(({ restaurantId, restaurantName , id, name, descripton, price, image, timeAdded, userId, quantity }) => ({ restaurantId: restaurantId, restaurantName: restaurantName , itemId: id, itemName: name, itemDescription: descripton , itemPrice: price, itemImageUrl: image, timeAdded: timeAdded, userId: userId, quantity:quantity}));
    if (customer instanceof Map) {
    const order = {
      user: {
        userId: customer.get("email")
      },
      shippingAddress:{
        city: city,
        zipCode: zipCode,
        apartmentNumber: apartmentNumber,
        buildingNumber: buildingNumber,
        street: street
      },
      totalCost: getTotalPrice() ,
      orderItems: transformed
    };
    console.log("order " +  JSON.stringify(order));
    fetch("https://cymbal-eats.com//order-mgmt-api/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "Application/JSON",
      },
      body: JSON.stringify(order),
    })
        .then((respose) => respose)
        .catch((error) => {
          console.log(error);
        });
    // Simulate order processing (replace with actual order processing logic)
    console.log('Order submitted:', { name,  cartItems });

    // Clear the cart and show confirmation
    setOrderPlaced(true);
    clearCart(order.user.userId, setCart); //clear the cart after checkout
    navigate('/order-confirmation'); 
       } //redirect after checkout
  }; 

   if (orderPlaced) {
        return <div>Order placed successfully!</div>;
    }
  console.log("cartItems =" +cartItems);
  return (
    <div className="checkout">
      <h2>Checkout</h2>
        {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
              <>
              <h3>Order Summary</h3>
                <ul>
                    {cartItems.map((item) => (
                    <li key={item.id}>
                        {getRestaurantName(item.restaurantId)} - {item.name} - ${item.price} x {item.quantity}
                    </li>
                    ))}
                </ul>
                <p>Total: ${getTotalPrice().toFixed(2)}</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="street">Street:</label>
          <input
            type="text"
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />
          <label htmlFor="buildingNumber">Building#:</label>
          <input
              type="text"
              id="buildingNumber"
              value={buildingNumber}
              onChange={(e) => setBuildingNumber(e.target.value)}
              required
          />
          <label htmlFor="apartmentNumber">Apartment#:</label>
          <input
              type="text"
              id="apartmentNumber"
              value={apartmentNumber}
              onChange={(e) => setApartmentNumber(e.target.value)}
              required
          />
          <label htmlFor="city">City:</label>
          <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
          />
          <label htmlFor="zipCode">ZipCode:</label>
          <input
              type="text"
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
          />
        </div>
        <button type="submit">Place Order</button>
      </form>
       </>
       )}
    </div>
  );
}

Checkout.propTypes = {
  customer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    photoURL: PropTypes.string.isRequired,
  }).isRequired,
   cartItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            quantity: PropTypes.number.isRequired,
            restaurantId: PropTypes.number.isRequired,
        })
    ).isRequired,
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
          description:PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
    clearCart: PropTypes.func.isRequired,
    setCart: PropTypes.func.isRequired,
}

export default Checkout;