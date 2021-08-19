import React, {useState, useEffect} from 'react';
import './App.css';
import {GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow} from "react-google-maps";
import * as ordersData from "./data/orders.json";
import mapStyles from "./mapStyles";

async function getData() {
  return fetch('https://localhost:3443/orders')
  .then(data => data.json())
}

function Map() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordersData, setOrdersData] = useState(null);

  useEffect(() => {
    let mounted = true;
    getData()
      .then(orders => {
        if(mounted) {
          console.log("items = ",orders);
          setOrdersData(orders)
        }
      })
    return () => mounted = false;
  }, [])

  return (
  <GoogleMap 
  defaultZoom={4} 
  defaultCenter={{lat: 38, lng: -95}}
  defaultOptions={{styles:mapStyles}}>
    
    {ordersData && ordersData.map(order => {  //make sure ordersData is there before mapping it
      return(
      <Marker 
      key={order._id} 
      position={{
        lat: parseInt(order.lat), 
        lng: parseInt(order.lng)
      }}
      onClick={() => {
        setSelectedOrder(order);
      }}
      icon={{
        url: "/shopping.svg",
        scaledSize: new window.google.maps.Size(20,20)
      }}
      />);
    })}

{selectedOrder && (
      <InfoWindow
      onCloseClick={() => {setSelectedOrder(null)}}
      position={{
        lat: parseInt(selectedOrder.lat),
        lng: parseInt(selectedOrder.lng)
      }}
      >
        <div className="info-window">
        <h2>order ID: {selectedOrder.order_id}</h2>
        <h2>deal ID: {selectedOrder.deal_id}</h2>
        </div>
 
      </InfoWindow>
)} 

  </GoogleMap>
  );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div style={{width:"100vw", height:"100vh"}}>
          <WrappedMap googleMapURL={"https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBqtZiGN-Hd5g-htZDRxm8vM5gA4YKJBbU"}
          loadingElement={<div style={{height:"100%"}}/>}
          containerElement={<div style={{height:"100%"}}/>}
          mapElement={<div style={{height:"100%"}}/>}
          />
        </div>
      </header>
    </div>
  );
}

export default App;
