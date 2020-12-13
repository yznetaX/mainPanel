<template>
  <div class="navigation" v-resize="onResize">
    <logout-confirm ref="confirm" :dark="true" :color="'secondary'" />
    <vue-topprogress
      ref="topProgress"
      :color="'#81217d'"
      :height="3"
    ></vue-topprogress>
    <v-navigation-drawer
      v-model="drawer"
      :right="right()"
      width="250"
      app
      :overlay-opacity="mainNavOpacity"
      disable-resize-watcher
    >
      <v-card flat>
        <v-row>
          <v-col cols="12" v-if="showDrawerLogo" class="pb-1">
            <img
              @click="refreshPage"
              max-width="172"
              src="../assets/mujeebk_final.svg"
              class="mx-auto d-block mujeebk-logo"
              style="cursor:pointer"
            />
          </v-col>
        </v-row>
        <v-simple-table class="my-2" v-if="showUserDetails">
          <template v-slot:default style="overflow: hidden;">
            <tbody>
              <tr style="background: transparent !important;">
                <td style="width: 70px;vertical-align : middle;" class="px-0">
                  <avatar
                    :phone_number="phoneNumber"
                    :number_id="$route.params.id"
                    :show_online_dot="false"
                    :is_online_info="0"
                    :color_avatar="'grey'"
                    class="ms-2 me-3"
                  />
                </td>
                <td style="width: 100%;vertical-align : middle;" class="px-0">
                  <span style="font-size:16px">
                    <strong style="font-family:arial" class="itemlistcolor">{{ phoneNumber }}</strong>
                  </span>
                  <p class="ma-0">{{planType}}</p>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <v-alert
          dark
          class="mb-0"
          prominent
          dense
          :color="batteryColor"
          v-if="showPhoneBattery"
          style="border-radius:0"
        >
          <v-simple-table :class="tabelColor">
            <template v-slot:default style="overflow: hidden;">
              <tbody>
                <tr style="background: transparent !important;">
                  <td style="width: 40px;vertical-align : middle;" class="px-0">
                    <v-icon class="ps-1" :color="iconBatteryColor">
                      {{ batteryIcon }}
                    </v-icon>
                  </td>
                  <td class="px-0" v-if="showPercent">
                    <span class="ms-1" :class="percentBattery"
                      >{{ batteryPrecent }}%</span
                    >
                  </td>
                  <td
                    style="width: 100%;vertical-align : middle;"
                    class="ps-2 pe-1"
                    :class="showCursor"
                    @click="goToScane"
                  >
                    <span :class="percentBattery">
                      {{ batteryStatus }}
                    </span>
                  </td>
                  <td style="width: 40px;vertical-align : middle;" class="px-0">
                    <v-btn icon @click="closeAlert">
                      <v-icon :color="closeIconColor">
                        mdi-close
                      </v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-alert>
      </v-card>
      <v-list shaped class="px-0 pb-0 me-12" v-model="group">
        <v-list-item-group color="#0d0e69">
          <v-list-item
            color="#0d0e69"
            @click="isMedAndDown"
            dense
            to="/cards"
            router
            class="pe-0"
            @click.native="refreshCards"
          >
            <v-list-item-icon class="me-3">
              <v-icon class="itemlistcolor">mdi-whatsapp</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="itemlistcolor" style="font-size: 0.75rem !important">
                {{ $t("phone_numbers") }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            to="/mujeebk_web"
            dense
            @click="isMedAndDown"
            class="pe-0"
            @click.native="refreshQrscane"
          >
            <v-list-item-icon class="me-3">
              <v-icon class="itemlistcolor">mdi-qrcode-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title style="font-size: 0.75rem !important" class="itemlistcolor">
                {{ $t("add_whats_account") }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            :to="outerQr"
            color="#0d0e69"
            dense
            @click="isMedAndDown"
            class="pe-0"
            @click.native="refreshRemotleAdd"
          >
            <v-list-item-icon class="me-3">
              <v-icon class="itemlistcolor">
                mdi-qrcode-scan
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title style="font-size: 0.75rem !important" class="itemlistcolor">
                {{ $t("remote_account") }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            @click="isMedAndDown"
            color="#0d0e69"
            dense
            class="pe-0"
            to="/privacy_and_security"
            @click.native="refreshPrivacy"
          >
            <v-list-item-icon class="me-3">
              <v-icon class="itemlistcolor">
                mdi-security
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title style="font-size: 0.75rem !important" class="itemlistcolor">
                {{ $t("privacy_and_security") }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            @click="isMedAndDown"
            color="#0d0e69"
            dense
            class="pe-0"
            to="/how-to-use"
            @click.native="refreshHowToUse"
          >
            <v-list-item-icon class="me-3">
              <v-icon class="itemlistcolor">
                mdi-handshake
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="itemlistcolor" style="font-size: 0.75rem !important">
                {{ $t("how_to_use") }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            @click="isMedAndDown"
            color="#0d0e69"
            dense
            class="pe-0"
            to="/support"
          >
            <v-list-item-icon class="me-3">
              <v-icon class="itemlistcolor">
                mdi-lifebuoy
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="itemlistcolor" style="font-size: 0.75rem !important">
                {{ $t("support") }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-group
            icon="mdi-chevron-down"
            class="lang-list pe-0"
            color="#0d0e69"
            v-model="active"
            no-action
            v-cloak
          >
            <template v-slot:activator>
              <v-list-item-icon class="me-3" style="margin-top: 7px;">
                <v-icon class="itemlistcolor">
                  mdi-translate
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content class="itemlistcolor" style="font-size: 0.75rem !important">
                {{ $t("lang") }}
              </v-list-item-content>
            </template>

            <v-list-item @click="changeLTR" dense>
              <v-list-item-content>
                <v-list-item-title class="itemlistcolor">English</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="changeRTL" dense>
              <v-list-item-content>
                <v-list-item-title class="itemlistcolor">العربية</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item dense @click="logout" class="pe-0">
            <v-list-item-icon class="me-3">
              <v-icon class="itemlistcolor">mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="itemlistcolor" style="font-size: 0.75rem !important">
                {{ $t("logout") }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
import i18n from "@/plugins/i18n";
import logout from "../mixins/httpHandler.js";
import { bus } from "../main";
import logOutConfirm from "./cardConfirm";
import avatar from "./automated/Avatar";
export default {
  components: {
    "logout-confirm": logOutConfirm,
    avatar,
  },
  data() {
    return {
      showUserDetails: false,
      showLogoNum: false,
      drawer: false,
      item: "text",
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      logoutButton: null,
      loginButton: null,
      active: true,
      showNav: false,
      hasNumberId: false,
      profileImg: "",
      phoneNumber: null,
      showDrawerLogo: false,
      slected: true,
      sel: "",
      group: null,
      dividerColor: "white",
      showPhoneBattery: false,
      phone: {},
      batteryPrecent: null,
      plugged: null,
      batteryIcon: "",
      showPercent: false,
      batteryStatus: "",
      batteryColor: "",
      tabelColor: "",
      closeIconColor: "white",
      percentBattery: "",
      iconBatteryColor: "",
      phone_session_status: "",
      showCursor: "",
      mainNavOpacity: "",
      planType: "",
      
    };
  },
  computed: {
    outerQr() {
      return `/qr`;
    },
  },
  watch: {
    group() {
      this.drawer = false;
    },
    $route(to){
      if (to.params.id !== undefined) {
        if (this.$store.getters.singleAvatar) {
          this.$store.state.p = this.$store.getters.singleAvatar;
          this.profileImg = this.$store.getters.singleAvatar;
          this.phoneNumber = this.$store.state.ph;
          this.showUserDetails = true;
        }else {
          this.showLogo()
        }
      }else {
        this.showUserDetails = false;
      }
      if (localStorage.getItem(`${to.params.id}_battery`) == "true" && to.params.id !== undefined) {
        this.showBattery()
      }else {
        this.showPhoneBattery = false
      }
    },
  },
  methods: {
    refreshPlanns(){
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    refreshSettingWidget() {
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    refreshPlan() {
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    refreshPage() {
      this.$router.push('/cards').catch(err => err)
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
      bus.$emit("refreshCards");
    },
    refreshPrivacy() {
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    refreshSaller() {
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    refreshPayment() {
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    refreshSetting() {
      bus.$emit("refreshSetting");
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    refreshAi() {
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    refreshScenarios() {
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    refreshRemotleAdd() {
      this.$refs.topProgress.start();
      bus.$emit("refreshRemotleAdd");
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    refreshQrscane() {
      bus.$emit("refreshQrscane");
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    refreshBotStatus() {
      bus.$emit("refreshBotStatus");
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    refreshHowToUse() {
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    refreshReport() {
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
      bus.$emit("refreshReport");
    },
    refreshSch() {
      bus.$emit("refreshSch");
    },
    refreshCards() {
            this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
        bus.$emit("refreshCards");
      });
    },
    goToScane() {
      this.$refs.topProgress.start();
      let session_status = this.phone_session_status;
      if (session_status == "0") {
        this.$router.push("/mujeebk_web");
      }
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    onResize() {
      if (window.innerWidth > 1250) {
        this.drawer = true;
        this.showDrawerLogo = true;
      }
      if (window.innerWidth < 1250) {
        this.showDrawerLogo = false;
      }
      if (window.innerWidth > 600) {
        this.mainNavOpacity = 0;
      } else {
        this.mainNavOpacity = 0;
      }
    },
    changeRTL() {
      this.$vuetify.rtl = true;
      this.changeLocale("ar");
      i18n.locale = "ar";
      bus.$emit("arabicLang");
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    changeLTR() {
      this.$vuetify.rtl = false;
      this.changeLocale("en");
      i18n.locale = "en";
      bus.$emit("englishLang");
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    changeLocale(locale) {
      i18n.locale = locale;
      localStorage.setItem("local_lang", locale);
      bus.$emit("changePlanTranslate", locale);
    },
    right() {
      if (this.$vuetify.rtl == true) {
        return true;
      }
      if (localStorage.getItem("local_lang") == "ar") {
        return true;
      }
    },
    async logout() {
      let stopAllConfirm = i18n.t("log_out_confirm");
      if (await this.$refs.confirm.open("confirm_log_out", stopAllConfirm)) {
        this.post({ router: "logout" }, false).then(() => {
          localStorage.removeItem("session_id");
          this.$router.push("/login");
          localStorage.removeItem("lat");
          localStorage.removeItem("lng");
          localStorage.removeItem("rand_id");
          this.$store.state.rand_id = "";
          this.logoutButton = false;
          this.loginButton = true;
          bus.$emit("hideButton");
        });
      }
    },
    scenario() {
      this.$refs.topProgress.start();
      if (this.$route.params.id) {
        this.$router.push("/scenario" + "/" + this.$route.params.id);
      } else {
        this.$router.push("/scenario");
      }
      if (this.$vuetify.breakpoint.mdAndDown) {
        this.drawer = false;
      }
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    toCards() {
      if (this.$vuetify.breakpoint.mdAndDown) {
        this.drawer = false;
      }
    },
    isMedAndDown() {
      if (this.$vuetify.breakpoint.mdAndDown) {
        this.drawer = false;
      }
    },
    closeAlert() {
      localStorage.setItem(`${this.$route.params.id}_battery`, false);
      this.showPhoneBattery = false;
      bus.$emit("closeBattery", false);
    },
    showLogo() {
      let batteryData = {
        router: "get_numbers",
        number_id: this.$route.params.id,
      };
      if (this.$route.params.id) {
        this.post(batteryData, false).then((response) => {
          if (response.data.session == false) {
            this.$router.push("/login").catch((err) => err);
          }
          response.data.registered_numbers.map((item) => {
            this.phone = item;
          });
          let phone = this.phone;
          this.profileImg = phone.profile_photo;
          this.phoneNumber = phone.phone_number;
          if (phone.plan_type == "0") {
          this.planType =  i18n.t("plan_types.free_plan");
          }
          if (phone.plan_type == "1") {
            this.planType =  i18n.t("plan_types.silver_plan");
          }
          if (phone.plan_type == "2") {
            this.planType =  i18n.t("plan_types.golden_plan");
          }
          if (phone.plan_type == "3") {
            this.planType =  i18n.t("plan_types.premium_plan");
          }
          this.$store.state.p = phone.profile_photo;
          this.$store.state.ph = phone.phone_number;
          this.showUserDetails = true;
        });
      } else {
        this.showUserDetails = false;
        this.showLogoNum = false;
      }
    },
    async showBattery() {
      
              let batteryData = {
        router: "get_numbers",
        number_id: this.$route.params.id,
      };
      if (this.$route.params.id) {
        this.showLogoNum = true;
        await this.post(batteryData, false).then((resopnse) => {
          console.log(resopnse);
          if (resopnse.data.session == false) {
            this.$router.push("/login").catch((err) => err);
          }
          resopnse.data.registered_numbers.map((item) => {
            this.phone = item;
          });
          let phone = this.phone;
          this.profileImg = phone.profile_photo;
          this.phoneNumber = phone.phone_number;
          this.phone_session_status = phone.session_status;
          if (phone.session_status == "0") {
            this.showCursor = "cursor-show";
            this.showPhoneBattery = true;
            this.batteryColor = "grey";
            this.tabelColor = "grey";
            this.showPercent = false;
            this.batteryIcon = "mdi-battery-unknown";
            this.closeIconColor = "white";
            this.percentBattery = "white--text";
            this.iconBatteryColor = "white";
            this.batteryStatus = i18n.t("phone_need_rescane");
            this.profileImg = phone.profile_photo;
            this.phoneNumber = phone.phone_number;
          } else {
            this.profileImg = phone.profile_photo;
            this.phoneNumber = phone.phone_number;
            if (parseFloat(phone.percentage) == null || phone.plugged == null) {
              this.showCursor = "";
              this.showPhoneBattery = true;
              this.batteryColor = "info";
              this.tabelColor = "info";
              this.batteryIcon = "mdi-battery";
              this.closeIconColor = "white";
              this.percentBattery = "white--text";
              this.iconBatteryColor = "white";
              this.batteryStatus = i18n.t("keep_in_charge");
            }
            if (parseFloat(phone.percentage) && phone.plugged) {
              this.showCursor = "";
              this.showPhoneBattery = true;
              this.batteryColor = "info";
              this.tabelColor = "info";
              this.batteryIcon = "mdi-battery-charging";
              this.showPercent = true;
              this.batteryPrecent = parseFloat(phone.percentage);
              this.chargeAlert = true;
              this.closeIconColor = "white";
              this.percentBattery = "white--text";
              this.iconBatteryColor = "white";
              this.batteryStatus = i18n.t("plugged_in");
            }
            if (parseFloat(phone.percentage) > 40 && !phone.plugged) {
              this.showCursor = "";
              this.showPhoneBattery = true;
              this.batteryColor = "info";
              this.tabelColor = "info";
              this.showPercent = true;
              this.batteryPrecent = parseFloat(phone.percentage);
              this.batteryIcon = "mdi-battery";
              this.closeIconColor = "white";
              this.percentBattery = "white--text";
              this.iconBatteryColor = "white";
              this.batteryStatus = i18n.t("keep_in_charge");
            }
            if (
              parseFloat(phone.percentage) > 15 &&
              parseFloat(phone.percentage) <= 40 &&
              !phone.plugged
            ) {
              this.showCursor = "";
              this.showPhoneBattery = true;
              this.batteryColor = "yellow accent-4";
              this.tabelColor = "yellow accent-4";
              this.showPercent = true;
              this.batteryPrecent = parseFloat(phone.percentage);
              this.batteryIcon = "mdi-battery-40";
              this.closeIconColor = "black";
              this.percentBattery = "black--text";
              this.iconBatteryColor = "black";
              this.batteryStatus = i18n.t("keep_in_charge");
            }
            if (parseFloat(phone.percentage) <= 15 && !phone.plugged) {
              this.showCursor = "";
              this.chargeAlert = true;
              this.showPhoneBattery = true;
              this.batteryColor = "red darken-3";
              this.tabelColor = "red darken-3";
              this.showPercent = true;
              this.batteryPrecent = parseFloat(phone.percentage);
              this.batteryIcon = "mdi-battery-alert";
              this.closeIconColor = "white";
              this.percentBattery = "white--text";
              this.iconBatteryColor = "white";
              this.batteryStatus = i18n.t("low_battery");
            }
            if (parseFloat(phone.percentage) === 0) {
              this.showCursor = "";
              this.chargeAlert = true;
              this.showPhoneBattery = true;
              this.batteryColor = "info";
              this.tabelColor = "info";
              this.showPercent = false;
              this.batteryPrecent = parseFloat(phone.percentage);
              this.batteryIcon = "mdi-battery-outline";
              this.closeIconColor = "white";
              this.percentBattery = "white--text";
              this.iconBatteryColor = "white";
              this.batteryStatus = i18n.t("keep_in_charge");
            }
          }
        });
      } else {
        this.showPhoneBattery = false;
        this.showLogoNum = false;
      }
    },
  },
  mounted() {
    if(this.$route.params.id != undefined && this.showUserDetails == false){
      this.showLogo()
    }
    bus.$on("showLogo", () => {
      this.profileImg = this.$store.state.p;
      this.phoneNumber = this.$store.state.ph;
      this.showUserDetails = true;
    });
    bus.$on("removeLogo", () => {
      this.showUserDetails = false;
    });
    // if (
    //   JSON.parse(localStorage.getItem(`${this.$route.params.id}_battery`)) &&
    //   this.$route.params.id
    // ) {
    //   this.showBattery();
    // } else {
    //   this.showPhoneBattery = false;
    // }
  },
  created() {
    console.log("ss")
    try {
      document.getElementById("app").style.display = "block"
      document.getElementById("loading").style.display = "none"
    }catch(err){
      err
    }
    bus.$on("battery_status", async (data) => {
      await this.showBattery()
      this.showPhoneBattery = data
    });
    bus.$on("switchedButton", (data) => {
      if (data) {
        this.loginButton = false;
        this.logoutButton = true;
      } else {
        this.loginButton = true;
        this.logoutButton = false;
      }
    });
    bus.$on("changeToLogout", (data) => {
      if (data) {
        this.loginButton = false;
        this.logoutButton = true;
      } else {
        this.loginButton = true;
        this.logoutButton = false;
      }
    });
    bus.$on("showDrawer", () => {
      this.drawer = true;
    });
    if (this.$store.state.number_id) {
      this.ifHaveCardRun = true;
      this.toScenarios = `scenario/${this.$store.state.number_id}`;
    }
    this.onResize();
  },
  updated() {
  },
  beforeMount() {
  },
  mixins: [logout],
};
</script>
<style lang="scss">
$list-item-color: #0e273b;
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@600&display=swap");

.navigation {
  font-family: "Cairo" !important;
  font-size: 0.9125rem;
}
.v-application .white {
  border-color: #0d0e73 !important;
  background-color: #ffffff;
}
.border-bottom {
  border-bottom: 3px solid #0d0e73 !important;
  background-color: #ffffff !important;
}
.v-list-item--link:before {
  width: 230px !important;
}
.v-list-item__title {
  font-family: "Cairo" !important;
}
.v-list-group__header {
  max-height: 40px;
}
.mujeebk-logo {
  &:hover {
    &::before {
      opacity: 0 !important;
    }
  }
}
.cursor-show {
  cursor: pointer;
}
.itemlistcolor{
  color: $list-item-color !important;
}
</style>
