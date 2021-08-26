import React, {useState, useEffect} from 'react';
import './App.css';
import {GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow} from "react-google-maps";
import mapStyles from "./mapStyles";
import { mapUrl } from './mapUrl';
import Select from "react-select";

async function getDealsData() {
  return fetch('https://localhost:3443/deals')
  .then(data => data.json())
}

async function getOrdersData(category) {
  let url = 'https://localhost:3443/orders';
  if(category !== "all") {
    url = 'https://localhost:3443/categories/' + category;
  }
  return fetch(url)
  .then(data => data.json())
}

function Map() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordersData, setOrdersData] = useState(null);
  const [categoryArray, setCategoryArray] = useState([{ value: "all", label: "All Categories" }]);
  const [dealsData, setDealsData] = useState(null);
  

  useEffect(() => {
    let mounted = true;
    getOrdersData("all") //returns orders for deals of the selected category
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
          setCategoryArray(cArray); //category array is used for dropdown menu options
        }
      })
    return () => mounted = false;
  }, []);

  function handleChange(s) {
    getOrdersData(s.value)
      .then(orders => {
        setOrdersData(orders);
        console.log("orders = ",orders);
      })
  }

  return (
    <div>
  
  <GoogleMap 
  defaultZoom={4} 
  defaultCenter={{lat: 38, lng: -95}}
  defaultOptions={{styles:mapStyles}}>
    
    {ordersData && ordersData.map(order => {  //make sure ordersData is there before mapping it
      return(
      <Marker 
      key={order._id} 
      position={{
        lat: parseFloat(order.y), 
        lng: parseFloat(order.x)
      }}
      onClick={() => {
        setSelectedOrder(order);
      }}
      icon={{
        url: "/shopping.svg",
        scaledSize: new window.google.maps.Size(10,10)
      }}
      />);
    })}

{selectedOrder && (
      <InfoWindow
      onCloseClick={() => {setSelectedOrder(null)}}
      position={{
        lat: parseFloat(selectedOrder.y),
        lng: parseFloat(selectedOrder.x)
      }}
      >
        <div className="info-window">
        <h2>order ID: {selectedOrder.order_id}</h2>
        <h2>deal ID: {selectedOrder.deal_id}</h2>
        </div>
 
      </InfoWindow>
)} 

  </GoogleMap>
<div style={{color: "black", width:"28vw", height:"10vh", position:"absolute", left:"50px", top:"60px", zIndex:"200"}}>
{categoryArray.length && (
<Select 
onChange={e => handleChange(e)}
options={categoryArray}
placeholder="Select a Category"
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
  let returnArray = [{ value: "all", label: "All Categories" }]
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
