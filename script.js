"use strict";
const cityName = document.getElementById('city-name');

cityName.addEventListener('keyup',(e)=>{
  if(e.key==='Enter'){
    let city =e.target.value;
    window.location.href="details.html?city="+city;
  }
})



