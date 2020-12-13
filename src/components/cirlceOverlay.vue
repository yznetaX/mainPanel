<template>
  <v-overlay :z-index="zIndex" :value="overlay" color="white" opacity="1" v-resize="onResize">
    <v-row align-content="center" justify="center" :class="loadingPadding">
      <v-progress-circular
        style="width:300px"
        color="grey darken-2"
        indeterminate
        rounded
        :size="30"
      >
      </v-progress-circular>
    </v-row>
  </v-overlay>
</template>
<script>
import i18n from '../plugins/i18n';
export default {
  props: {
    overlay: {
      type: Boolean,
    },
    zIndex:{
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      loadingPadding: "",
    };
  },
  methods: {
    onResize() {
      if (window.innerWidth > 1250) {
        if (i18n.locale == "en" || localStorage.getItem("local_lang") == "en") {
          this.loadingPadding = "englishPadding";
        }
        if (i18n.locale == "ar" || localStorage.getItem("local_lang") == "ar") {
          this.loadingPadding = "arabicPadding";
        }
      }
      if (window.innerWidth < 1250) {
        this.loadingPadding = "";
      }
    },
  },
};
</script>
<style lang="scss">
.englishPadding {
  padding: 0 30px 0 270px !important;
}
.arabicPadding {
  padding: 0 270px 0 30px !important;
}
</style>
