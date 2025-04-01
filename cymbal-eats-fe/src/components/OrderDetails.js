
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';



function OrderDetails({ restaurants, customer, orders }) {
  const { id } = useParams();
  const order = orders.find((element) => {
    return element.orderId == parseInt(id);
  });
  const [orderDetail, setOrderDetail] = useState([]);
  //get user-cart
  useEffect(() => {

    fetchOrderDetails();

  }, []);
  const fetchOrderDetails = async () => {
    if (customer instanceof Map) {
      try {
        const response = await fetch("https://cymbal-eats.com/order-mgmt-api/get-order-details", {
          method: "POST",
          headers: {
            "Content-Type": "Application/JSON",
          },
          body: JSON.stringify(order),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOrderDetail(data);
        console.log("Fetched Order details:", JSON.stringify(data));
        console.log("Fetched Order details:", JSON.stringify(orderDetail));
      } catch (error) {
        console.error("Could not fetch order details :", error);
      }
    }
  };


  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find((element) => {
      return element.id == restaurantId;
    });
    console.log("restaurant =" + restaurant);
    console.log("restaurantId =" + restaurantId + "@");
    console.log("restaurants =" + restaurants);

    restaurants.map((field) => console.log("field =" + field.id + "@"));
    return restaurant ? restaurant.name : 'Unknown Restaurant';
  };


  return (
    <div className="cart">
      <h2>Your Order Details</h2>
      {orderDetail.orderItems !== undefined ? (
        <>
          <ul>
            <div>
              Order#: {orderDetail.orderId} - Delivery time: {orderDetail.estimatedDeliveryTime} - Status: {orderDetail.status} - Total: ${parseFloat(orderDetail.price)}
            </div>
            <div>
              Delivery Address: Street: {orderDetail.shippingAddress.street} - Building#: {orderDetail.shippingAddress.buildingNumber} - Apartment#: {orderDetail.shippingAddress.apartmentNumber} - City: {orderDetail.shippingAddress.city} - ZipCode# {orderDetail.shippingAddress.zipcode}
            </div>
            {orderDetail.orderItems.map((item) => (
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
      ) :
        <p>Loading....</p>}
    </div>
  );
}

OrderDetails.propTypes = {
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
          description: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
  customer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    photoURL: PropTypes.string.isRequired,
  }).isRequired, 
  ,
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      estimatedDeliveryTime: PropTypes.string.isRequired,
      deliveryTime: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      orderId: PropTypes.number.isRequired,
      totalCost: PropTypes.number.isRequired,
      shippingAddress: 
        PropTypes.shape({
          city: PropTypes.string.isRequired,
          street: PropTypes.string.isRequired,
          buildingNumber: PropTypes.string.isRequired,
          apartmentNumber: PropTypes.string.isRequired,
          zipCode: PropTypes.string.isRequired
        }).isRequired,
      orderItems: PropTypes.arrayOf(
        PropTypes.shape({
          restaurantId: PropTypes.number.isRequired,
          orderId: PropTypes.number.isRequired,
          user: PropTypes.shape({
          userId: PropTypes.string.isRequired,
          }).isRequired,
          itemId: PropTypes.number.isRequired,
          restaurantName: PropTypes.string.isRequired,
          itemName: PropTypes.string.isRequired,
          itemPrice: PropTypes.number.isRequired,
          itemDescription: PropTypes.string,
          itemImageUrl: PropTypes.string.isRequired,
          quantity: PropTypes.number.isRequired,
          timeAdded: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default OrderDetails;