import React, {useState, useEffect} from 'react';
import './App.css';
import {GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow} from "react-google-maps";
import * as ordersData from "./data/orders.json";
import mapStyles from "./mapStyles";
import { mapUrl } from './mapUrl';
import Select from "react-select";

async function getOrdersData() {
  return fetch('https://localhost:3443/orders')
  .then(data => data.json())
}

async function getDealsData() {
  return fetch('https://localhost:3443/deals')
  .then(data => data.json())
}

function Map() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordersData, setOrdersData] = useState(null);
  let [selectedCategory, setSelectedCategory] = useState("all");
  const [categoryArray, setCategoryArray] = useState([{ value: "all", label: "all" }]);
  const [dealsData, setDealsData] = useState(null);
  

  useEffect(() => {
    let mounted = true;
    getOrdersData()
      .then(orders => {
        if(mounted) {
          console.log("orders = ",orders);
          setOrdersData(orders);
        }
      })
    return () => mounted = false;
  }, []);

  useEffect(() => {
    let mounted = true;
    getDealsData()
      .then(deals => {
        if(mounted) {
          console.log("deals = ",deals);
          setDealsData(deals);
          const cArray = getCategoryArray(deals);
          setCategoryArray(cArray);
        }
      })
    return () => mounted = false;
  }, []);

  useEffect(() => {
    let mounted = true;
    getOrdersData()
      .then(orders => {
        if(mounted) {
          console.log("orders = ",orders);
          setOrdersData(orders);
        }
      })
    return () => mounted = false;
  }, []);


  useEffect(() => {
    setSelectedCategory(selectedCategory);
  }, []);


  console.log("outside useEffect: categoryArray = ",categoryArray);

  function handleChange(s) {
    selectedCategory = s.value;
    console.log("new value = ", selectedCategory);
  }

  return (
    <div>
    { console.log("inside return: categoryArray = ",categoryArray)}
    { console.log("inside return: selectedCategory = ",selectedCategory)}
  
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
<div style={{color: "black", width:"30vw", height:"10vh", position:"absolute", left:"50px", top:"60px", zIndex:"200"}}>
{categoryArray.length && (<Select 
//value={selectedCategory} 
onChange={e => handleChange(e)}
options={categoryArray}
/>)}
</div>

  </div>
  );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <div style={{width:"100vw", height:"100vh"}}>
          <WrappedMap googleMapURL={mapUrl}
          loadingElement={<div style={{height:"100%"}}/>}
          containerElement={<div style={{height:"100%"}}/>}
          mapElement={<div style={{height:"100%"}}/>}
          />

        </div>
      </header>
    </div>
  );
}

function getCategoryArray(data) {
  let catArray = [];
  let returnArray = [];
  if(data) {
    for(let item of data) {
      if(!catArray.includes(item.primaryCategory)) {
        let cat = item.primaryCategory;
        catArray.push(cat);
        returnArray.push({ value: cat, label: cat });
      }
    }
  }
  else  console.log("no data ");

  return returnArray;
}

export default App;
