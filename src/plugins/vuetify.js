import Vue from "vue";
import Vuetify from "vuetify/lib";
Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
          light: {
            secondary: '#33368d',
            primary: '#33368d',
            orange : "#81217d",
            error: '#B71C1C',
          },
        },
      },
      icons: {
    iconfont: 'mdi'
  },
});
