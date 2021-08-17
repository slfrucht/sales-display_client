import React, {useState} from 'react';
import './App.css';
import {GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow} from "react-google-maps";
import * as parksData from "./data/skateboard-parks.json";
import * as ordersData from "./data/orders.json";
import mapStyles from "./mapStyles";

function Map() {
  const [selectedPark, setSelectedPark] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
  <GoogleMap 
  defaultZoom={4} 
  defaultCenter={{lat: 38, lng: -95}}
  defaultOptions={{styles:mapStyles}}>
    {parksData.features.map(park => {
      return(
      <Marker 
      key={park.properties.PARK_ID} 
      position={{
        lat: park.geometry.coordinates[1], 
        lng: park.geometry.coordinates[0]
      }}
      onClick={() => {
        setSelectedPark(park);
      }}
      icon={{
        url: "./skateboarding.svg",
        scaledSize: new window.google.maps.Size(25,25)
      }}
      />);
      
    })}
    {ordersData.items.map(order => {
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
        url: "./skateboarding.svg",
        scaledSize: new window.google.maps.Size(25,25)
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

{selectedPark && (
      
      <InfoWindow
      onCloseClick={() => {setSelectedPark(null)}}
      position={{
        lat: selectedPark.geometry.coordinates[1],
        lng: selectedPark.geometry.coordinates[0]
      }}
      >
        <div className="info-window">
        <h2>{selectedPark.properties.NAME}</h2>
        <p>{selectedPark.properties.DESCRIPTIO}</p>
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
