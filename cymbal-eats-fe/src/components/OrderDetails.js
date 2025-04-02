import React, { useState, useEffect } from 'react';
//import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {Link, useParams} from 'react-router-dom';
import PropTypes from 'prop-types';


function OrderDetails({  restaurants, customer, orders}) {
  const {id} = useParams();
  const order = orders.find((element) => {
    return element.orderId == parseInt(id);
  });
  const [orderDetails, setOrderDetails] = useState();
  const [data, setData] = useState({});

    useEffect(() => {
      console.log("order === " +   JSON.stringify(orders));
      console.log ("In Order " + order+" "+(customer instanceof  Map));
      fetchOrderDetails();
    }, []);


    const fetchOrderDetails = async () => {
      if (customer instanceof  Map){
        console.log("order === " +   JSON.stringify(orders));
        console.log("order to get its details === " +  JSON.stringify(order));
        

        const response2= await fetch("https://cymbal-eats.com/order-mgmt-api/get-order-details", {
          method: "POST",
          headers: {
            "Content-Type": "Application/JSON",
          },
          body: JSON.stringify(order),
        });
        console.log("orderDetails before:", JSON.stringify(orderDetails));
        await setOrderDetails(await response2.json());
        console.log("Fetched Order details:",  JSON.stringify(orderDetails));
      }
    };


     const getRestaurantName = (restaurantId) => {
        const restaurant = restaurants.find((element) => {
          return element.id == restaurantId;
        });
       console.log("restaurant =" +restaurant);
        console.log("restaurantId =" +restaurantId+"@");
        console.log("restaurants =" +restaurants);

       // restaurants.map((field) => console.log("field ="+field.id+"@"));
        return restaurant ? restaurant.name : 'Unknown Restaurant';
    };


    return (
        <div className="cart">
          <h2>Your Order Details</h2>
          {orderDetails !==  undefined ? (
           
                <>
                    <ul>
                      <li  className="cart-item">
                      <div>
                        Order#: {orderDetails.orderId} -----  Status: {orderDetails.status} - Total: ${parseFloat(orderDetails.totalCost)}
                      </div>
                      </li>
                      <li  className="cart-item">
                      <div>
                        OrDelivery time: {orderDetails.estimatedDeliveryTime}
                      </div>
                    </li>
                      <li  className="cart-item">
                      <div>
                       Total: ${parseFloat(orderDetails.totalCost)}
                      </div>
                      </li>
                      <li  className="cart-item">
                          <div> Delivery Address: Street: {orderDetails.shippingAddress.street} - Building#: .shippingAddress.buildingNumber} - Apartment#: {orderDetails.shippingAddress.apartmentNumber} - City: {orderDetails.shippingAddress.city} - ZipCode# {orderDetails.shippingAddress.zipcode}

                          </div>
                      </li>
                        {orderDetails.orderItems.map((item) => (
                            <li key={item.menuItemId} className="cart-item">
                              <img src={item.imageURL} alt={item.name}  />
                              <div>
                                {getRestaurantName(item.restaurantId)} - {item.itemName} - ${parseFloat(item.price).toFixed(2)}
                              </div>
                              <div>
                                Quantity:{item.quantity}
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            ):
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