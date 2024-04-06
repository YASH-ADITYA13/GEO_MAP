<template>
  <div class="h-screen relative">
    <geoErrorModal />
    <div id="map" class="h-full z-[1]"></div>
  </div>
</template>

<script>
///
// @ is an alias to /src

import leaflet from 'leaflet';
import { onMounted , ref } from 'vue';
import geoErrorModal from "@/components/geoErrorModal.vue";
export default {
  name: 'HomeView',
  components: {geoErrorModal},
  setup() {
    let map;
    onMounted(() =>  {
      //init map
    map = leaflet.map('map').setView([15.389734, 73.856738], 10);


    // add tile layer
    leaflet
        .tileLayer(
          `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.VUE_APP_API_KEY}`,
          {
            maxZoom: 18,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1,
            accessToken: process.env.VUE_APP_API_KEY,
          }
        )
        .addTo(map);

        geoLocation();

    })

    const coords = ref(null);
    const fetchCoords = ref(null);
    const geoMarker = ref(null);
    const geoError = ref(null);
    const geoErrorMessage = ref(null);

    const geoLocation = () => {

      // check sessionStorage for coords
      if(sessionStorage.getItem('coords')) {
        coords.value = JSON.parse(sessionStorage.getItem('coords'));
        plotGeolocation(coords.value);
        return;
      }

      fetchCoords.value = true;
      navigator.geolocation.getCurrentPosition(setCoords,getLocError);

    };

    const setCoords = (pos) => {
        // stop fetching coordinates
        fetchCoords.value = false;
        // set coordinates in cookies || session storage
        const setSessionCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        sessionStorage.setItem("coords", JSON.stringify(setSessionCoords));


        coords.value = setSessionCoords;
        plotGeolocation(coords.value);
    };

    const getLocError = (err) => {
      fetchCoords.value = null;
      geoError.value = true;
      geoErrorMessage.value = err.message;
    };


    const plotGeolocation = (coords) => {
       // create new custom marker
       const customMarker = leaflet.icon ({
           iconUrl: require('../assets/logo.png'),
           iconSize: [35,35],
         })


       // create new marker with coords and new icon
       geoMarker.value = leaflet
                         .marker([coords.lat,coords.lng], { icon : customMarker})
                         .addTo(map);


      // setting map view to current location
      map.setView([coords.lat,coords.lng]);
    };

    const closeGeoError = () => {
      geoError.value = null;
      geoErrorMessage.value = null;
    };


    return { coords, geoMarker, closeGeoError };
  },
};
</script>
