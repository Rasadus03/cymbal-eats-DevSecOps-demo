
import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom'


function OrderDetails({  restaurants, customer}) {
  const [orderDetails, setOrderDetails] = useState([]);
  const [data, setData] = useState();
  const location = useLocation()
  const order = location.state;
  //get user-cart
    useEffect(() => {

      fetchOrderDetails();

    }, []);
  console.log("order === " +  JSON.stringify(order));
    const fetchOrderDetails = async () => {
      try {
        console.log("order === " +  JSON.stringify(order));
        fetch("https://cymbal-eats.com/order-mgmt-api/get-order-details", {
          method: "POST",
          headers: {
            "Content-Type": "Application/JSON",
          },
          body: JSON.stringify(order),
        }).then((response) => data)
            .catch((error) => {
              console.log(error);
            });
        setData(data.json());
        console.log("Fetched Order details:", data);
        setOrderDetails(data);
        console.log("Loaded Cart =" +data);
      } catch (error) {
        console.error("Could not fetch order details :", error);
      }
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


    return (
        <div className="cart">
            <h2>Your Order Details</h2>
                <>
                    <ul>
                      <div>
                        Order#: {orderDetails.orderId} - Delivery time: {orderDetails.estimatedDeliveryTime} - Status: {orderDetails.status} - Total: ${parseFloat(orderDetails.price)}
                      </div>
                      <div>
                        Delivery Address: Street: {orderDetails.shippingAddress.street} - Building#: {orderDetails.shippingAddress.buildingNumber} - Apartment#: {orderDetails.shippingAddress.apartmentNumber} - City: {orderDetails.shippingAddress.city} - ZipCode# {orderDetails.shippingAddress.zipcode}
                      </div>
                        {orderDetails.orderItems.map((item) => (
                            <li key={item.itemId} className="cart-item">
                              <div>
                                {getRestaurantName(item.restaurantId)} - {item.name} - ${parseFloat(item.itemPrice).toFixed(2)}
                              </div>
                              <div>
                                Quantity:{item.quantity}
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
        </div>
    );
}

OrderDetails.propTypes = {
  customer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    photoURL: PropTypes.string.isRequired,
  }).isRequired,
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
  ).isRequired
};

export default OrderDetails;