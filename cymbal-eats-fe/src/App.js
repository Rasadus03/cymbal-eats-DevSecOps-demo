// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';  // Import the main CSS file

// Components
import RestaurantList from './components/RestaurantList';
import RestaurantDetails from './components/RestaurantDetails';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import HomePage from './components/HomePage';
import Header from './components/Header'; // Import the Header component
import Footer from './components/Footer';  // Import the Footer
import SearchBar from './components/SearchBar';
import Orders from './components/Orders';
import OrderDetails from './components/OrderDetails';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import {signOut}  from "firebase/auth";
import { Console } from 'winston/lib/winston/transports';


function App() {
  const [cartItems, setCartItems] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [customerName, setCustomerName] = useState([]);
  const [shoppingCartItems, setCart] = useState([]);       
  const [cartItemsCount: number , setCartItemsCount] = useState();
  const [restaurants, setRestaurants] = useState([]);  // State to store restaurant data
  const [searchTerm, setSearchTerm] = useState("");  // State for search term
  const [filteredRestaurants, setFilteredRestaurants] = useState([]); 
  const [orders, setOrders] = useState([]); // Filtered restaurants
//  const {authenticateJWT, requestLogger} = require('./Auth');
  const config = {
    apiKey: 'AIzaSyDdl5c0RADYP_LYhcxPnMy9B_MUsK8zbFY',
    authDomain: 'cloud-next25-screendemo.firebaseapp.com',
  };
  const firebase = initializeApp(config);

  const  initApp = async () => {
    console.log('I am here!!!');
    const data = new Map();
    getAuth(firebase).onAuthStateChanged(user => {
      if (user) {
        console.log(" user email " +user.email);
        data.set("name", user.displayName)
        data.set("email", user.email)
        data.set("uid", user.uid )
        data.set("photoURL", user.photoURL);
        // User is signed in.
        document.getElementById('signInButton').innerText = 'Sign Out';
       //2 document.getElementById('warningText').innerText = '                                                                    ';
        setCustomer(data);
        console.log( (customer instanceof Map) +"testtttttt");
        setCustomerName(user.displayName);
        fetchCartCount();
      } else {
        // No user is signed in.
        document.getElementById('signInButton').innerText = 'Sign In';
       // document.getElementById('warningText').innerText = 'Please Signin to use our cool Application and get delicious Foot :)!';
        data.set("email", 'None');
        setCustomer(data);
        setCartItemsCount(0);
        setCustomerName('None');
      }



    });
  }
  useEffect(() => {
    initApp();
    console.log("customer name===="+customerName);
  },[!(customer instanceof Map)]);

  //load all Restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('https://cymbal-eats.com//restaurants-api/restaurants', {mode: 'no-cors'}); //  Use a relative path
        console.log("Response:", response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched restaurants:", data);
        setRestaurants(data);
        setFilteredRestaurants(data);  // Initially, filtered list is the same
      } catch (error) {
        console.error("Could not fetch restaurants:", error);
        // Handle errors, e.g., display an error message to the user
      }
    };
    fetchRestaurants();
  }, [restaurants.length]);
  const  signInUser = async () => {
    const provider  = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    const data = new Map();

    await signInWithPopup(getAuth(firebase), provider)
        .then(result => {
          // Returns the signed in user along with the provider's credential
        //  console.log(JSON.stringify(result.user));
          //console.log(`${result.user.displayName} logged in.`);
          data.set("name", result.user.displayName)
          data.set("email", result.user.email)
          data.set("uid", result.user.uid )
          data.set("photoURL", result.user.photoURL);
          setCustomerName(result.user.displayName);
        })
        .catch(err => {
          console.log(`Error during sign in: ${err.message}`);
        });
    while (!(customer instanceof Map)){
      setCustomer(data);
    }
    console.log("user = "+ JSON.stringify(customer));
   //document.getElementById('warningText').innerText = '                                                                    ';
    //console.log("user name = "+customer.get("name"));
  };


  const  signOutUser = async () =>  {
    await signOut(getAuth(firebase))
        .then(result => {})
        .catch(err => {
          console.log(`Error during sign out: ${err.message}`);
        });
    const data = new Map();

    data.set("email", 'None');

    while (!(customer instanceof Map)){
      setCustomer(data);
      setCustomerName('None');
    }
   // document.getElementById('warningText').innerText = ' Please Signin to use our cool Application and get delicious Foot :)!';
  };

// Toggle Sign in/out button
  const  toggle = async () => {
    if (!getAuth(firebase).currentUser) {
      console.log("be4 SignIn!!");
      await signInUser();
      console.log("user = "+ JSON.stringify(customer));
      console.log("user email = "+ customer.get("email"));
      fetchCartCount();
    } else {
      console.log("be4 SignOut!!");
      await signOutUser();
      console.log("user = "+ JSON.stringify(customer));

      console.log("user email = "+ customer.get("email"));
      setCartItemsCount(0);
    }

  };

    const fetchCartCount = async () => {
      if (customer instanceof Map) {
      // Replace with your actual API endpoint
      const response2 = await fetch('https://cymbal-eats.com//shopping-cart-api/get-cart-item-count?user-id=' +customer.get("email"), {mode: 'no-cors'}); //  Use a relative path
      console.log("Response for cart count:", response2);
      if (!response2.ok) {
        throw new Error(`HTTP error! status: ${response2.status}`);
      }
      const data2 = await response2.json();
      console.log("Fetched cart count:", data2);
      setCartItemsCount(data2);
    } 
  };

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : 'Unknown Restaurant';
  };

  // --- Cart Functionality ---
  const addToCart = async (restaurantId, item) => {
    if (customer instanceof Map) {
    setCartItems([...cartItems, { ...item, restaurantId, quantity: 1 }]);
    const shoppingItem = {
      restaurantName: getRestaurantName(restaurantId),
      restaurantId: restaurantId,
      itemId: item.id,
      itemName: item.name,
      itemPrice: item.price,
      itemDescription: item.description,
      itemImageUrl: item.image,
      userId: customer.get("email"),
      quantity: 1,
    };
    console.log("shoppingItem " +  JSON.stringify(shoppingItem));
    fetch("https://cymbal-eats.com//shopping-cart-api/add-shopping-cart-item", {
      method: "POST",
      headers: {
        "Content-Type": "Application/JSON",
      },
      body: JSON.stringify(shoppingItem),
    })
        .then((respose) => respose)
        .catch((error) => {
          console.log(error);
        });
    fetchCartCount();
    }
  };

    const removeFromCart = (restaurantId, item, setCart, shoppingCartItems) => {
      if (customer instanceof Map) {
        setCartItems(cartItems.filter((item2) => item2.id !== item.id));
        setCart(shoppingCartItems.filter((item2) => item2.id !== item.id));
        setCartItemsCount(cartItemsCount - 1);
        const shoppingItem = {
          restaurantName: getRestaurantName(restaurantId),
          restaurantId: restaurantId,
          itemId: item.id,
          itemName: item.name,
          itemPrice: item.price,
          itemDescription: item.description,
          itemImageUrl: item.image,
          timeAdded: item.timeAdded,
          userId: customer.get("email"),

          quantity: 1,
        };
        console.log("shoppingItem " + JSON.stringify(shoppingItem));
        fetch(
            "https://cymbal-eats.com//shopping-cart-api/remove-shopping-cart-item",
            {
              method: "POST",
              headers: {
                "Content-Type": "Application/JSON",
              },
              body: JSON.stringify(shoppingItem),
            })
            .then((respose) => respose)
            .catch((error) => {
              console.log(error);
            });
        fetchCartCount();
      }
  };

  const updateQuantity = (restaurantId, item, newQuantity, setCart, shoppingCartItems) => {
    if (customer instanceof Map) {
      if (newQuantity <= 0) {
        removeFromCart(restaurantId, item); // Remove if quantity is 0 or less
        return;
      }
      setCartItems(
          cartItems.map((item2) =>
              item2.id === item.id ? {...item2, quantity: newQuantity} : item2
          )
      );
      setCart(shoppingCartItems.map((item2) =>
          item2.id === item.id ? {...item2, quantity: newQuantity} : item2
      ));
      shoppingCartItems.map((item2) =>
          item2.id === item.id ? console.log("updated item" + item2) : item2);
      const shoppingItem = {
        restaurantName: getRestaurantName(restaurantId),
        restaurantId: restaurantId,
        itemId: item.id,
        itemName: item.name,
        itemPrice: item.price,
        itemDescription: item.description,
        itemImageUrl: item.image,
        userId: customer.get("email"),
        timeAdded: item.timeAdded,
        quantity: newQuantity,
      };
      console.log("shoppingItem " + JSON.stringify(shoppingItem));
      fetch(
          "https://cymbal-eats.com//shopping-cart-api/update-shopping-cart-item",
          {
            method: "POST",
            headers: {
              "Content-Type": "Application/JSON",
            },
            body: JSON.stringify(shoppingItem),
          })
          .then((respose) => respose)
          .catch((error) => {
            console.log(error);
          });
    }
  };

  const clearCart = (userId, setCart) => {
    if (customer instanceof Map) {
      setCartItems([]);
      setCart([]);
      setCartItemsCount(0);
      const user = {
        userId: customer.get("email"),
      };
      console.log("user " + JSON.stringify(user));
      fetch("https://cymbal-eats.com//shopping-cart-api/clear-shopping-cart", {
        method: "POST",
        headers: {
          "Content-Type": "Application/JSON",
        },
        body: JSON.stringify(user),
      })
          .then((respose) => respose)
          .catch((error) => {
            console.log(error);
          });
      fetchCartCount();
    }
  };

    // --- Search Functionality ---
    useEffect(() => {
        const results = restaurants.filter(restaurant =>
            restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRestaurants(results);
    }, [searchTerm, restaurants]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };



  return (
    <Router>
      <div className="app">
        <Header cartItemCount={cartItemsCount} toogle={toggle} /> {/* Pass cart item count */}
        <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        <Routes>
          <Route path="/" element={<HomePage customerName={customerName} />} />
            <Route path="/restaurants" element={<RestaurantList restaurants={filteredRestaurants} />} /> {/* Pass filtered restaurants */}
          <Route
            path="/restaurants/:id"
            element={<RestaurantDetails restaurants={restaurants} addToCart={addToCart}  />}
          />
          <Route path="/cart" element={<Cart restaurants={restaurants}  removeFromCart={removeFromCart} updateQuantity={updateQuantity} clearCart={clearCart} setCartItems={setCartItems} customer={customer}/>} />
          <Route path="/checkout" element={<Checkout cartItems={cartItems} restaurants={restaurants} clearCart={clearCart} setCart={setCart} customer={customer}/>} /> {/*Pass clearCart*/}
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/orders" element={<Orders  restaurants={restaurants} customer={customer} setOrders={setOrders} />} />
          <Route path="/orders-details" element={<Orders  restaurants={restaurants} customer={customer} setOrders={setOrders}  />} />
          <Route
              path="/order-details/:id"
              element={<OrderDetails restaurants={restaurants}  customer={customer} orders={orders} />}
          />
          <Route path="*" element={<div>404 Not Found</div>} /> {/* Catch-all route */}
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;