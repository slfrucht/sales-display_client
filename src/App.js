import React, {useState, useEffect} from 'react';
import './App.css';
import {GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow} from "react-google-maps";
import mapStyles from "./mapStyles";
import { mapUrl } from './mapUrl';
import Select from "react-select";

let maxOrder = 0; //bin with the most orders
let selectedCategory = "all"; 

async function getDealsData() {
  return fetch('https://localhost:3443/deals')
  .then(data => data.json())
}

async function getOrdersData(category) {
  /*
  let url = 'https://localhost:3443/orders';
  if(category !== "all") {
    url = 'https://localhost:3443/categories/' + category;
  }
  */
  let url = 'https://localhost:3443/binCategories/' + category;
  return fetch(url)
  .then(data => data.json())
}

function Map() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordersData, setOrdersData] = useState(null);
  const [categoryArray, setCategoryArray] = useState([{ value: "all", label: "All Categories" }]);
  const [dealsData, setDealsData] = useState(null);

  function getSvgMarker(numEntries) {
    let mult = 20;

    if(maxOrder) {
      mult = numEntries/maxOrder;
      mult = Math.floor(Math.pow(mult, 1/3) * 255);
    }
    console.log("in get marker numEntries = " + numEntries + ", maxOrder = " + maxOrder + ", mult = " + mult);
    let red = mult;
    let green = Math.floor(mult/2);
    let blue = 255 - mult;
    
    let fill = rgbToHex(red,green,blue);
    return {
      path: "M-50 -50 50 -50 50 50 -50 50z",
      fillColor: fill,
      fillOpacity: .5,
      strokeWeight: 0,
      rotation: 0,
      scale: .15
      //anchor: new google.maps.Point(0, 0),
    };

  }

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
  function getMaxOrders(orders) {
    let numOrders = 0;
    for(let order of orders) {
      const ne = parseInt(order.numEntries);
      if(ne > numOrders) {
        numOrders = ne;
      }
    }
    return numOrders;
  }

  useEffect(() => {
    let mounted = true;
    getOrdersData("all") //returns orders for deals of the selected category
      .then(orders => {
        if(mounted) {
          //console.log("orders = ",orders);
          maxOrder = getMaxOrders(orders);
          console.log("maxOrder = ",maxOrder);
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
        selectedCategory = s.value;
        maxOrder = getMaxOrders(orders);
        console.log("maxOrder = ",maxOrder);
        setOrdersData(orders);
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
      icon={getSvgMarker(parseInt(order.numEntries))}
//      icon={svgMarker}
//      icon={{
//        url: "/shopping.svg",
//        scaledSize: new window.google.maps.Size(10,10)
 //     }}
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
        <h2>Category: {selectedCategory}</h2>
        <h2>Number of orders: {selectedOrder.numEntries}</h2>
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
        <div style={{width:"90vw", height:"90vh"}}>
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
