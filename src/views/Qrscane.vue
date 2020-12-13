<template>
  <div class="qrscane" v-if="showPage">
    <v-overlay  :value="overlay"  v-resize="onResize">
    <v-row align-content="center" justify="center" >
      <v-progress-circular
        style="width:300px"
        color="white"
        indeterminate
        rounded
        :size="30"
      >
      </v-progress-circular>
    </v-row>
  </v-overlay>
    <vue-topprogress
      ref="topProgress"
      :color="'orange'"
      :height="3"
    ></vue-topprogress>
      <v-card flat class="scale">
        <v-row v-resize="onResize" >
          <v-col cols="12" :sm="smCol" md="7" class="pt-0 px-1">
            <v-card flat >
              <v-card-title
                class="font-weight-bold title pe-0 use-mujeebk py-1"
                style="letter-spacing: -0.3px !important;"
                id="step-1-see-options"
              >
                {{ $t("use_mujeebk") }} :
              </v-card-title>
              <v-list>
                <v-list-item class="font-weight-light pe-0">
                  1. {{ $t("steps.step_one") }}
                </v-list-item>
                <v-list-item class="font-weight-light pe-0 d-inline-block">
                  2. {{ $t("steps.step_two.part_one") }}
                  <v-icon color="black">mdi-dots-vertical</v-icon>
                  {{ $t("steps.step_two.part_two") }}
                  <v-icon class="ms-1 me-1">mdi-cog-outline </v-icon
                  >{{ $t("steps.step_two.part_three") }}
                </v-list-item>
                <v-list-item class="font-weight-light pe-0">
                  3. {{ $t("steps.step_three") }}
                </v-list-item>
                <v-list-item class="font-weight-light pe-0">
                  4. {{ $t("steps.step_four") }}
                </v-list-item>
                <v-list-item class="font-weight-light pe-0">
                  5. {{ $t("steps.step_five") }}
                </v-list-item>
                <v-list-item class="font-weight-light pe-0">
                  6. {{ $t("steps.step_six") }}
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="12" :sm="smQr" md="5">
            <v-card max-width="264" flat class="mx-auto">
              <v-overlay :absolute="true" :value="true" color="transparent" z-index="3">
                <div >
                  <svg :class="['whatsapp']" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path fill="#FFF" d="M6.525 43.936a29.596 29.596 0 0 1-3.039-13.075C3.494 14.568 16.755 1.313 33.05 1.313c7.904.004 15.328 3.082 20.91 8.666 5.581 5.586 8.653 13.01 8.65 20.907-.007 16.294-13.266 29.549-29.558 29.549a29.648 29.648 0 0 1-12.508-2.771L1.391 62.687l5.134-18.751z"></path><path fill="#123033" d="M50.801 13.135c-4.739-4.742-11.039-7.354-17.752-7.357-13.837 0-25.094 11.253-25.099 25.085a25.039 25.039 0 0 0 3.349 12.541l-3.56 12.999 13.304-3.488a25.084 25.084 0 0 0 11.996 3.054h.011c13.83 0 25.088-11.256 25.095-25.087.002-6.703-2.607-13.005-7.344-17.747zM33.05 51.733h-.008a20.866 20.866 0 0 1-10.62-2.906l-.762-.452-7.894 2.07 2.108-7.694-.497-.789a20.802 20.802 0 0 1-3.189-11.097c.004-11.496 9.361-20.85 20.87-20.85a20.73 20.73 0 0 1 14.746 6.115 20.733 20.733 0 0 1 6.104 14.752c-.006 11.497-9.363 20.851-20.858 20.851z"></path><path fill="#123033" d="M25.429 19.26a8.65 8.65 0 0 0-1.028.011 2.352 2.352 0 0 0-.95.255c-.221.114-.427.277-.75.582-.305.288-.481.54-.668.782a6.974 6.974 0 0 0-1.443 4.291l.001.003a8.243 8.243 0 0 0 .844 3.607c1.043 2.307 2.763 4.746 5.035 7.008a24.676 24.676 0 0 0 1.657 1.6 24.145 24.145 0 0 0 9.814 5.229s.751.179 1.391.218c.021.001.04.003.061.003a9.207 9.207 0 0 0 1.422-.033 5.086 5.086 0 0 0 2.129-.59c.423-.225.623-.337.978-.561 0 0 .11-.072.319-.23.345-.257.558-.438.845-.736.211-.22.394-.479.534-.772.2-.417.401-1.213.481-1.874.061-.505.042-.781.036-.952-.011-.275-.238-.558-.487-.678l-1.486-.668s-2.222-.967-3.581-1.587a1.278 1.278 0 0 0-.452-.104c-.341-.021-.723.068-.966.324v-.004c-.013-.001-.182.145-2.031 2.385-.102.122-.341.387-.754.362a1.086 1.086 0 0 1-.185-.029 3.402 3.402 0 0 1-.49-.17c-.316-.134-.427-.185-.643-.278l-.013-.006a15.361 15.361 0 0 1-4.013-2.556 15.88 15.88 0 0 1-.927-.885c-1.074-1.041-1.953-2.148-2.607-3.24-.035-.06-.09-.146-.15-.242-.107-.174-.225-.381-.262-.523-.095-.376.157-.678.157-.678s.622-.68.911-1.05c.278-.356.518-.704.671-.952.301-.484.39-.982.238-1.37a216.767 216.767 0 0 0-2.219-5.215c-.156-.339-.598-.589-1.005-.636a6.284 6.284 0 0 0-.414-.041"></path></svg>
                </div>
              </v-overlay>
              <v-overlay :absolute="true" :value="true" color="transparent" z-index="4">
                <div v-if="qrLoaded">
                  <v-progress-circular
                  :size="100"
                  :width="15"
                  color="black"
                  indeterminate
                  class="qrloader"
                ></v-progress-circular>
                </div>

                <div v-if="showOverlay">
                  <v-card
                    width="200"
                    height="200"
                    color="secondary"
                    style="border-radius: 50%"
                    @click="disableOverlay"
                  >
                    <v-card-actions>
                      <v-icon large style="margin-top: 45px" class="mx-auto">
                        mdi-replay
                      </v-icon>
                    </v-card-actions>
                    <v-card-text
                      class="title white--text pt-0 text-center"
                      style="font-size: 1.125rem !important;"
                    >
                      {{ $t("qr_reload") }}
                      <p class="text-center">{{ $t("code") }}</p>
                    </v-card-text>
                  </v-card>
                </div>
              </v-overlay>
              <qrcode-vue
                id="step-2-scan-qr"
                :value="qr_code"
                level="M"
                :size="264"
                :class="opacityQr"
              >
              </qrcode-vue>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-resize="onResizeVideo">
          <v-col cols="11" :class="marginVideo">
            <v-card class="text-center mt-12" flat>
              <vue-plyr ref="plyr">
                <video
                  :poster="videos[0].img_bg"
                  :src="videos[0].url"
                ></video>
              </vue-plyr>
              
            </v-card>
          </v-col>
        </v-row>
      </v-card>
  </div>
</template>
<script>
import QrcodeVue from "qrcode.vue";
import io from "socket.io-client";
import checkSessionQrscane from "../mixins/httpHandler";
import { bus } from '../main';
export default {
  /*eslit-disable*/
  components: {
    QrcodeVue,
  },
  data() {
    return {
      socketData: "",
      currentTabComponent: "bot",
      qr_code: "",
      sessionId: "session_id",
      showOverlay: false,
      showWhatsIcon: true,
      opacityQr: "",
      showImage: true,
      showVideos: true,
      showPage: "",
      marginVideo: "ms-3",
      smCol: 7,
      smQr: 5,
      qrLoaded: true,
      connect :"",
      overlay: false,
      videos: ""
    };
  },
  watch: {},
  computed: {},
  methods: {
    showPageContent() {
      if (
        localStorage.getItem(this.sessionId) &&
        localStorage.getItem(this.sessionId).length > 0
      ) {
        this.showPage = true;
      } else {
        this.showPage = false;
      }
    },
    soketStart() {
      var URL_SERVER = "https://mujeebk.com:8090";
      var socket = io.connect(URL_SERVER);
      this.connect = socket
      socket.on("qr_code", (data) => {
        this.qrLoaded = true
        this.qr_code = data;
        this.qrLoaded = false
      });
      socket.on(
        "profile_json",
        async function(data) {
          this.overlay= true
          if (data === true) {
            await socket.disconnect();
            this.$router.push("/cards").then(() => {
              this.overlay = false
            });
            bus.$emit('showSnakeBar',true)

          }
        }.bind(this)
      );

      socket.on("log_out", function() {
        socket.disconnect();
      });
      socket.on(
        "colose_connection",
        function() {
          socket.disconnect();
          this.showWhatsIcon = false
          this.qrLoaded = false
          this.showOverlay = true;
          this.opacityQr = "opacity-qr";
        }.bind(this)
      );
      socket.emit("check_session", localStorage.getItem("session_id"));
    },
    socketClosed() {
      let socket = this.connect
      socket.disconnect();
      console.log(socket.disconnect());
      if (socket.disconnect().disconnect) {
        return true
      }
    },
    disableOverlay() {
      this.showOverlay = false;
      this.showWhatsIcon = true
      this.opacityQr = "";
      this.qrLoaded = true
      this.soketStart();
    },
    onResize() {
      if (window.innerWidth < 850) {
        this.smCol = 12;
        this.smQr = 12;
      }
      if (window.innerWidth >= 850) {
        this.smCol = 7;
        this.smQr = 5;
      }
    },
    onResizeVideo() {
      if (window.innerWidth < 1250) {
        this.marginVideo = "mx-auto";
      }
      if (window.innerWidth > 1250) {
        this.marginVideo = "ms-3"
      }
      if (window.innerWidth < 650) {
        this.marginVideo = "ms-3"
      }
    },
  },
  async beforeMount() {
    await this.showPageContent();
  },
  async mounted() {
    await this.soketStart();
    let getViedoData = {
      router: "get_videos"
    }
    this.post(getViedoData, false).then((response) => {
      console.log(response);
      this.videos = response.data.videos.filter((item) => {
        return item.id == "3"
      })
      if (!response.data.session) {
        this.$router.push('/login')
      }
    })
    
  },
  async updated() {
  },
  beforeRouteLeave(to, from, next) {
    let socketDisconnect = this.socketClosed();
    if (socketDisconnect) {
      next();
    } else {
      next(false);
    }
  },
  created() {
  },
  mixins: [checkSessionQrscane],
};
</script>

<style scoped>
.qrscane {
  font-family: "Cairo" !important;
  font-size: 1.1rem !important;
}
.v-application .title,
.v-application .headline {
  font-family: "Cairo" !important;
}
.whatsapp {
  width: 50px;
  margin: auto;
}
.video {
  outline: none;
}
.opacity-qr {
  opacity: 0.12 !important;
}
.v-overlay {
  left: -2px !important;
}
.use-mujeebk {
  word-break: normal;
}
.qrloader{
  background: #FFF;
  border-radius: 50%;
  border: 10px solid #fff;
}
</style>
