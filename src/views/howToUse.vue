<template>
  <div style="height: 500px" v-resize="onResize">
    <overlay :overlay="overlay" />
      <v-card   flat color="transparent">
        <v-row >
          <v-col cols="12" sm="4" v-for="video in videos" :key="video.id">
            <v-card
              @click="openSettingDialog($event, video)"
            >
              <v-img :src="video.img_bg"></v-img>
              <v-overlay absolute :opacity="0.1" z-index="4">
                <v-btn icon x-large class="white">
                  <v-icon color="orange">
                    mdi-play
                  </v-icon>
                </v-btn>
              </v-overlay>
            </v-card>
            <v-card-title
             v-if="isEnglish"
              class="text-center d-block text-subtitle-1 wordbreak"
              >{{ video.en_title }}</v-card-title
            >
            <v-card-title
              v-else
              class="text-center d-block text-subtitle-1 wordbreak"
              >{{ video.ar_title }}</v-card-title
            >
          </v-col>
        </v-row>
      </v-card>
    <CarouselHowToUse :videoUrl="thisVideo.url" :videoPoster="thisVideo.img_bg"  />
  </div>
</template>

<script>
import { bus } from "../main";
import CarouselHowToUse from "../components/CarouselHowToUse";
import i18n from "../plugins/i18n";
import howToUse from "../mixins/httpHandler.js"
import overlay from "../components/cirlceOverlay"
export default {
  components: {
    CarouselHowToUse,
    overlay
  },
  data() {
    return {
      cardAnimation: "cardAnimation",
      marginCard: "",
      set: "",
      scen: "",
      dialog: false,
      model: 0,
      modelSetting: 0,
      e1: 1,
      meMargin: "",
      msMargin: "",
      videos: [],
      thisVideo: {},
      isEnglish: true,
      overlay: true
    };
  },
  computed: {},
  watch: {},

  methods: {
    onResize(){
      if (window.innerWidth > 960) {
        this.meMargin = "me-16"
        this.msMargin = "ms-16"
      }
      if (window.innerWidth <= 960) {
        this.meMargin = "me-10"
        this.msMargin = "ms-10"
      }
      if (window.innerWidth <= 670) {
        this.meMargin = "me-6"
        this.msMargin = "ms-6"
      }
      if (window.innerWidth <= 600) {
        this.meMargin = ""
        this.msMargin = ""
        this.marginCard = 'ma-auto'
      }
    },
    openSettingDialog(event, video) {
      this.thisVideo = video
      this.cardAnimation = ""
      bus.$emit('reset')
      bus.$emit("openDialogSetting");
    },
    getVideoData() {
      let getViedoData = {
        router: "get_videos"
      }
      this.post(getViedoData, false).then((response) => {
        console.log(response);
        this.videos = response.data.videos
        this.$nextTick(() => {
          this.overlay = false
        })
      })
      if (i18n.locale == "en" || localStorage.getItem("local_lang") == "en") {
        this.isEnglish = true
      }
      if (i18n.locale == "ar" || localStorage.getItem("local_lang") == "ar") {
        this.isEnglish = false
      }
    },
  },
  mounted() {
    this.getVideoData();
    bus.$on("arabicLang", () => {
      this.isEnglish = false
    });
    bus.$on("englishLang", () => {
      this.isEnglish = true
    });
  },
  updated() {
  },
  mixins: [howToUse]
};
</script>
<style>
.bg-howtouse {
  /* background-image:
    linear-gradient(rgba(245, 246, 252, 0.52), rgba(0, 0, 0, 0.73)),
    url('../assets/ai.svg'); */
  background-image: url("../assets/guid.png");
  background-size: cover;
  width: 100%;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
}
.cardAnimation{
  animation: cardPop 1s infinite alternate;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) !important;
}
@keyframes  cardPop{
  0%{
    transform: none;

  }
  100%{
    transform: scale(1.1);
  }
}
.wordbreak{
  word-break: normal;
}
</style>
