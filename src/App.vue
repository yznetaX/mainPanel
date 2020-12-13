<template>
  <v-app
    :class="[langapp]"
    v-resize="onAppResize"
    v-cloak
    style="font-family: Cairo !important"
    class="app-error"
    id="main-vue"
  >
    <AppBar
      :showDrawer="showDrawer"
      :toIndex="toIndex"
      :showToolbar="showDrawerBar"
      v-if="$route.fullPath != '/'"
    />
    <vue-topprogress
      ref="topProgress"
      :color="'#81217d'"
      :height="3"
    ></vue-topprogress>
    <!-- <Home :class="homePadding" /> -->
    <confirm ref="confirm"></confirm>
    <div v-resize="onResize">
      <Navigation v-if="show && $route.fullPath != '/'" />
      <v-main :class="$route.fullPath == '/' ? '' : paddingClass" id="content">
        <v-container :fluid="setFluid || $route.fullPath == '/'" :class="$route.fullPath == '/' ? 'pa-0' : 'pa-3'">
          <router-view :to="$route.fullPath"></router-view>
        </v-container>
        <v-alert color="red darken-3" outlined v-show="networkError">
          {{ error }}
        </v-alert>
      </v-main>
      <ReportNav v-if="showReportNav && $route.fullPath != '/'" />
      <Footer :showFooter="footer" v-if="$route.fullPath != '/'" />
    </div>
    <FloatActionButton v-if="isMobileScreen && $route.fullPath != '/' && $route.fullPath != `/widget_settings/${$route.params.id}`" />
  </v-app>
</template>

<script>
/*eslint-disable*/
import Navigation from "./components/Navigation";
import checkSession from "./mixins/httpHandler.js";
import { bus } from "./main";
import confirm from "./components/confirmDialog";
import FloatActionButton from "./components/FloatActionButton";
import i18n from "./plugins/i18n";
import Footer from "./components/Footer.vue";
import AppBar from "./components/AppBar";
import ReportNav from "./components/ReportNav";
export default {
  name: "App",
  components: {
    Navigation,
    confirm,
    FloatActionButton,
    Footer,
    AppBar,
    ReportNav,
  },
  data: () => ({
    error: "",
    networkError: null,
    paddingValue: "",
    show: false,
    isArabic: "",
    isEnglish: "",
    overlay: true,
    sessionId: "session_id",
    number: "",
    colCounter: "",
    paddingClass: "",
    homePadding: "",
    isMobileScreen: false,
    appContent: false,
    langapp: "",
    footer: false,
    appPadding: "",
    showDrawerBar: false,
    showReportNav: false,
    miniStatus: localStorage.getItem("mini"),
    paddingHome: "padding-home",
    setFluid: false,
    //
  }),
  computed:{
    optionsGoTo() {
      return {
        duration: 500,
        offset: 0,
        easing: "linear",
      };
    },
  },
  methods: {
    onAppResize() {
      if (
        localStorage.getItem("session_id") &&
        localStorage.getItem("session_id") != null
      ) {
        if (window.innerWidth > 600) {
          this.isMobileScreen = false;
        }
        if (window.innerWidth <= 600) {
          this.isMobileScreen = true;
        }
      } else {
        this.isMobileScreen = false;
      }
    },
    onResize() {
      if (
        localStorage.getItem("session_id") &&
        localStorage.getItem("session_id") != null
      ) {
        if (window.innerWidth <= 1250) {
          this.paddingClass = "";
          this.showDrawerBar = true;
          this.show = true;
          this.homePadding = ""
          this.setFluid = true
        }
        if (window.innerWidth > 1250) {
          this.showDrawerBar = false;
          this.switchClasses();
          this.setFluid = false
        }
      } else {
        this.showDrawerBar = false;
      }
    },
    switchClasses() {
      if (i18n.locale == "ar" || localStorage.getItem("local_lang") == "ar") {
        this.paddingClass = "arabicPadding";
        this.$vuetify.rtl = true;
        this.homePadding = "arHomePadding"
      }
      if (i18n.locale == "en" || localStorage.getItem("local_lang") == "en") {
        this.paddingClass = "englishPadding";
        this.$vuetify.ltr = true;
        this.homePadding = "enHomePadding"
      }
    },
    showFooter() {
      if (
        this.$route.path == "/login" ||
        this.$route.path == "/register" ||
        this.$route.path == `/confirm/${this.$route.params.id}` ||
        this.$route.path == `/resend-activation/${this.$route.params.id}` ||
        this.$route.path == "/forget_password" ||
        this.$route.path == "/forgeten_password"
      ) {
        bus.$on("showFooter" ,() =>{
          this.footer = true;
        })
      } else {
        this.footer = false;
      }
    },
    showDrawer() {
      bus.$emit("showDrawer");
      bus.$emit("miniStatus");
    },
    toIndex() {
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
      this.$router.push("/cards").catch((err) => err);
      bus.$emit("refreshCards");
    },
  },
  async beforeMount() {
    // window.scrollTo(0,0)
    // document.body.scrollTop = 0;
    // document.documentElement.scrollTop = 0
    console.log("h")
      this.showFooter();
    if (i18n.locale == "ar" || localStorage.getItem("local_lang") == "ar") {
      this.paddingClass = "arabicPadding";
      this.$vuetify.rtl = true;
      this.homePadding = "arHomePadding"
    }
    if (i18n.locale == "en" || localStorage.getItem("local_lang") == "en") {
      this.paddingClass = "englishPadding";
      this.$vuetify.ltr = true;
      this.homePadding = "enHomePadding"
    }
    this.onResize();
    this.onAppResize();
    document.title = i18n.t("mujeebk_dashboard");
    bus.$on("hideButton", () => {
      this.showDrawerBar = false;
      this.isMobileScreen = false;
    });
    if (
      !localStorage.getItem("session_id") ||
      localStorage.getItem("session_id") == null
    ) {
      this.showDrawerBar = false;
      this.show = false;
      this.isMobileScreen = false;
      this.paddingClass = "";
      this.homePadding = ""
    } else {
      this.show = true;
      this.onResize();
      this.onAppResize();
      this.switchClasses();
    }
  },
  watch:{
    $route(to,from,next){
      if(to.fullPath == `/widget_settings/${to.params.id}`){
        this.isMobileScreen = false
      }else {
        this.onAppResize()
      }
    }
  },
  mounted() {
    window.scrollTo(0,0)
    let s = document.getElementById("main-vue");
            this.$vuetify.goTo(s, this.optionsGoTo);
    if (this.$route.path === "/") {
      this.paddingHome = "padding-home"
    }
    if (this.$route.path === "/cards") {
      bus.$emit('reloadCards')
    }
    if (this.$route.params.id == undefined) {
      this.$store.state.p = ""
      this.$store.state.ph = ""
      bus.$emit('removeLogo')
    }

    if (
      this.$route.fullPath !==
      `/settings_widget/${this.$route.params.id}/${this.$route.params.number}`
    ) {
      if (document.getElementById("mujeebk_style")) {
        let id = document.getElementById("mujeebk_style");
        id.remove();
      }
      if (document.getElementById("mujeebk_chatbox")) {
        let classW = document.getElementById("mujeebk_chatbox");
        classW.remove();
      }
    }
    this.onResize();
    this.onAppResize();
    bus.$on("hideButton", () => {
      this.showDrawerBar = false;
      this.isMobileScreen = false;
      this.show = false;
      this.paddingClass = "";
      this.homePadding = ""
    });
    if (
      !localStorage.getItem("session_id") ||
      localStorage.getItem("session_id") == null
    ) {
      this.show = false;
      this.showDrawerBar = false;
      this.isMobileScreen = false;
      this.paddingClass = "";
      this.homePadding = ""
    } else {
      this.show = true;
      this.onResize();
      this.onAppResize();
      this.switchClasses();
    }
    this.$root.$confirm = this.$refs.confirm.open;
    if (
      this.$route.fullPath ==
        `/report/${this.$route.params.id}/${this.$route.params.number}` ||
      this.$route.fullPath == `/reports/${this.$route.params.id}`
    ) {
      this.showReportNav = true;
    } else {
      this.showReportNav = false;
      bus.$emit("stopTimer");
    }
  },
  created() {

    this.onResize();
    this.onAppResize();
    bus.$on("arabicLang", () => {
      this.paddingClass = "arabicPadding";
      i18n.locale = "ar";
      this.homePadding = "arHomePadding"
    });
    bus.$on("englishLang", () => {
      this.paddingClass = "englishPadding";
      i18n.locale = "en";
      this.homePadding = "enHomePadding"
    });
    if (
      !localStorage.getItem("session_id") ||
      localStorage.getItem("session_id") == null
    ) {
      this.show = false;
      this.showDrawerBar = false;
      this.isMobileScreen = false;
      this.paddingClass = "";
      this.homePadding = ""
    } else {
      this.show = true;
      this.onResize();
      this.onAppResize();
      this.switchClasses();
    }
    if (
      this.$route.fullPath ==
        `/report/${this.$route.params.id}/${this.$route.params.number}` ||
      this.$route.fullPath == `/reports/${this.$route.params.id}`
    ) {
      this.showReportNav = true;
    } else {
      this.showReportNav = false;
      bus.$emit("stopTimer");
    }
    // if (
    //   this.$route.fullPath !==
    //   `/scenario/${this.$route.params.id}/${this.$route.params.new}`
    // ) {
    //   bus.$emit("stopScenarioTimer");
    // }
    try {
      document.getElementById("app").style.display = "block"
      document.getElementById("loading").style.display = "none"
    }catch(err){

    }

  },
  updated() {
    // if (this.$route.path === "/cards") {
    //   bus.$emit('reloadCards')
    // }

    // if (this.$route.params.id == undefined) {
    //   this.$store.state.p = ""
    //   this.$store.state.ph = ""
    //   bus.$emit('removeLogo')
    // } else {
    //   bus.$emit('showLogoOnUpdate')

    // }
    if (
      this.$route.fullPath !==
      `/settings_widget/${this.$route.params.id}/${this.$route.params.number}`
    ) {
      if (document.getElementById("mujeebk_style")) {
        let id = document.getElementById("mujeebk_style");
        id.remove();
      }
      if (document.getElementById("mujeebk_chatbox")) {
        let classW = document.getElementById("mujeebk_chatbox");
        classW.remove();
      }
    }
    this.showFooter();
    document.title = i18n.t("mujeebk_dashboard");
    if (
      !localStorage.getItem("session_id") ||
      localStorage.getItem("session_id") == null
    ) {
      this.show = false;
      this.showDrawerBar = false;
      this.isMobileScreen = false;
      this.paddingClass = "";
      this.homePadding = ""
    } else {
      this.show = true;
      this.onResize();
    }
    if (
      this.$route.fullPath ==
        `/report/${this.$route.params.id}/${this.$route.params.number}` ||
      this.$route.fullPath == `/reports/${this.$route.params.id}`
    ) {
      this.showReportNav = true;
    } else {
      this.showReportNav = false;
      bus.$emit("stopTimer");
    }
    // if (
    //   this.$route.fullPath !==
    //   `/scenario/${this.$route.params.id}/${this.$route.params.new}`
    // ) {
    //   bus.$emit("stopScenarioTimer");
    // }
  },

  mixins: [checkSession],
};
</script>
<style lang="scss">
// @import url("https://fonts.googleapis.com/css2?family=Cairo:wght@600&display=swap");
/* arabic */
@font-face {
  font-family: 'Cairo';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: local('Cairo SemiBold'), local('Cairo-SemiBold'), url(https://fonts.gstatic.com/s/cairo/v9/SLXLc1nY6Hkvalr-ao6O59ZMaA.woff2) format('woff2');
  unicode-range: U+0600-06FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE80-FEFC;
}
/* latin-ext */
@font-face {
  font-family: 'Cairo';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: local('Cairo SemiBold'), local('Cairo-SemiBold'), url(https://fonts.gstatic.com/s/cairo/v9/SLXLc1nY6Hkvalr-ao6F59ZMaA.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Cairo';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: local('Cairo SemiBold'), local('Cairo-SemiBold'), url(https://fonts.gstatic.com/s/cairo/v9/SLXLc1nY6Hkvalr-ao6L59Y.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
* {
  font-family: "Cairo" !important;
  letter-spacing: -0.2px !important;
}
.v-subheader {
  font-family: "Cairo" !important;
}
.v-application {
  font-family: "Cairo" !important;
  .v-btn {
    font-family: "Cairo" !important;
  }
  .subtitle-1 {
    font-family: "Cairo" !important;
  }
}
.arabicapp {
  * {
    font-family: "Cairo" !important;
  }
}
.v-application .headline {
  font-family: "Cairo" !important;
}
.englishPadding {
  padding: 0 30px 0 270px !important;
}
.arabicPadding {
  padding: 0 270px 0 30px !important;
}
.withOutPadding {
  padding: 0 !important;
}
[v-cloak] {
  display: none;
}
[v-cloak]::before {
  background-image: url("./assets/small-mid-logo.png");
  background-size: cover;
}
.no_plan{
  filter: blur(0.2rem);
}
.mujeebk-logo{
  width: 150px;
  height: auto;
  margin: auto;
  display: block;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus textarea:-webkit-autofill,
textarea:-webkit-autofill:hover textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
    -webkit-background-clip: text;
}
.deco{
  text-decoration: none;
  font-weight: bold;
    font-size: 16px;
}
.mujeebk-title{
  font-size: 1.5rem !important;
  font-weight: 500 !important ;
  line-height: 2rem !important;
  letter-spacing: -0.3px !important;
  font-family: Cairo, sans-serif !important;
  padding-top: 4px !important
}
.route-enter,
.route-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.route-enter-active,
.route-leave-active {
  transition: all 0.3s ease;
}
.route-enter-to,
.route-leave {
  opacity: 1;
  transform: translateY(0);
}
.href-class{
  text-decoration: none;
}
.enHomePadding{
  padding: 0 0 0 260px;
}
.arHomePadding{
  padding: 0 260px 0 0 ;
}
.padding-home
{
  padding : 0px !important
}
</style>
