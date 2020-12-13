<template>
  <div style="width: 100% !important">
    <!-- <gmap-autocomplete
      :placeholder="$t('search')"
      @place_changed="setPlace($event)"
      :select-first-on-enter="true"
      class="autocomplete"
    >
    </gmap-autocomplete> -->
    <GmapMap
      :center="myCoordinates"
      :zoom="zoom"
      style="height:350px"
      ref="mapRef"
      :options="mapOptions"
    >
      <gmap-marker :position="myCoordinates"></gmap-marker>
    </GmapMap>
  </div>
</template>
<script>
// import { bus } from "../../main";
export default {
  props:{
    myCoordinates:{
      type: Object,
      default: function(){
        return {lat: 0,lng: 0}
      }
    }
  },
  data() {
    return {
      map: null,
      newCoordinates: null,
      zoom: 17,
      place: null,
      mapOptions: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUI: false,
      },
    };
  },
  async beforeMount() {},
  created() {
    // مالس حاطط ولا بقرنة قيم null
  },
  mounted() {
    this.$refs.mapRef.$mapPromise.then((map) => (this.map = map));
  },
  methods: {
    setPlace(place) {
      this.myCoordinates = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      // let myPosition = this.myCoordinates;
      // bus.$emit("sharePosition", myPosition);
      this.zoom = 15;
      // let zoom = this.zoom;
      // bus.$emit("shareZoom", zoom);
    },
  },
  computed: {
    mapCoordinates() {
      if (!this.map) {
        return {
          lat: 0,
          lng: 0,
        };
      }
      return {
        lat: parseFloat(
          this.map
            .getCenter()
            .lat()
            .toFixed(50)
        ),
        lng: parseFloat(
          this.map
            .getCenter()
            .lng()
            .toFixed(50)
        ),
      };
    },
  },
};
</script>
<style>
.autocomplete {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 4px;
  display: block;
  margin: 0 auto 8px auto;
  outline-color: #33368d;
  width: 100% !important;
}
</style>
