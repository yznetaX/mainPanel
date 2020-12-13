import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import i18n from "@/plugins/i18n";
import VueInputAutowidth from "vue-input-autowidth";
import VuePlyr from 'vue-plyr';
import TextareaAutosize from 'vue-textarea-autosize'
import VueGeolocation from 'vue-browser-geolocation';
import * as VueGoogleMaps from 'vue2-google-maps'
import VueClipboard from 'vue-clipboard2'
import VueResizeText from 'vue-resize-text';
import vueTopprogress from 'vue-top-progress'
// import 'vue-plyr/dist/vue-plyr.css'
import Plyr from 'plyr'
Vue.use(vueTopprogress)
Vue.use(VueResizeText)
export const player = new Plyr("#player")
Vue.config.productionTip = false;
Vue.use(VueInputAutowidth);
Vue.use(VuePlyr)
Vue.use(TextareaAutosize)
Vue.use(VueGeolocation);
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCHa8vPdY1IxCuHXPFeV23siXc-UGHtp3c',
    libraries: 'places', // This is required if you use the Autocomplete plugin
  },
})
Vue.directive('outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});
// Vue.config.errorHandler = function (err,info) {
//   if (err) {
//     err = ''
//   }
//   console.log(info);
//   // handle error
//   // `info` is a Vue-specific error info, e.g. which lifecycle hook
//   // the error was found in. Only available in 2.2.0+
// }
Vue.use(VueClipboard)
export const bus = new Vue();
const vm = new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
})

window.onload = function() {
  vm.$mount('#app');
}