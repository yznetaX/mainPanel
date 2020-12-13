<template>
  <div :class="[switchClass, me16]" v-resize="onResize">
    <v-dialog v-model="dialogPlan" max-width="400" persistent>
      <v-card>
        <v-toolbar color="secondary" dark dense height="34" flat>
          <v-toolbar-title class="white--text subtitle-1">{{
            $t("upgrade_your_plan")
          }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text
          class="pa-4"
          v-html="$t(dialogCardErrorPlan)"
        ></v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn color="orange" dark @click="$router.push('/cards')" small>
            <v-icon small class="me-1">
              mdi-whatsapp
            </v-icon>
            {{ $t("dashboard") }}</v-btn
          >
          <v-btn
            small
            color="secondary"
            @click="dialog = false"
            :to="dialogErrorRouterPlan"
            router
            class="ms-2"
          >
            <v-icon class="me-1" small>
              {{ dialogIconPlan }}
            </v-icon>
            <span>{{ dialogTitlePlan }}</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card flat :class="me9">
      <v-card-title class="py-1 px-2 secondary--text mujeebk-title">
        <Backword v-if="showBackword" />
        {{ $t("quick_statistics") }}
      </v-card-title>
      <v-card-subtitle class="py-4 px-2 subtitle-1">
        {{ $t("quick_statistics_description") }}
      </v-card-subtitle>
    </v-card>
    <!-- <v-overlay absolute color="white"  opacity="0.6" z-index="999" class="no_plan"></v-overlay> -->
    <v-skeleton-loader
      type="list-item-three-line, card-heading, image, actions"
      :loading="skeltonLoader"
      :class="me9"
    >
      <v-row >
        <v-col cols="6" :sm="smScreen" md="4">
          <v-card
            width="130"
            color="#E2E2ED"
            height="100"
            style="overflow:hidden"
            class="mx-auto"
          >
            <v-card-title
              class="text-center d-block pa-1"
              style="font-size: 0.75rem;word-break:normal"
            >
              {{ $t("declined_reports") }}
            </v-card-title>
            <v-card-subtitle class="text-shadow py-2">
              {{ declined_reports }}
            </v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="6" :sm="smScreen" md="4"
          ><v-card
            width="130"
            color="#E2E2ED"
            height="100"
            style="overflow:hidden"
            class="mx-auto"
          >
            <v-card-title
              class="text-center d-block pa-1"
              style="font-size: 0.75rem;word-break:normal"
            >
              {{ $t("accepted_reports") }}
            </v-card-title>
            <v-card-subtitle class="text-shadow py-2">
              {{ accepted_reports }}
            </v-card-subtitle>
          </v-card></v-col
        >
        <v-col cols="6" :sm="smScreen" md="4"
          ><v-card
            width="130"
            color="#E2E2ED"
            height="100"
            style="overflow:hidden"
            class="mx-auto"
          >
            <v-card-title
              class="text-center d-block pa-1"
              style="font-size: 0.75rem;word-break:normal"
            >
              {{ $t("ignored_reports") }}
            </v-card-title>
            <v-card-subtitle class="text-shadow py-2">
              {{ ignored_reports }}
            </v-card-subtitle>
          </v-card></v-col
        >
        <v-col cols="6" :sm="smScreen" md="4"
          ><v-card
            width="130"
            color="#E2E2ED"
            height="100"
            style="overflow:hidden"
            class="mx-auto"
          >
            <v-card-title
              class="text-center d-block pa-1"
              style="font-size: 0.75rem;word-break:normal"
            >
              {{ $t("today_rports") }}
            </v-card-title>
            <v-card-subtitle class="text-shadow py-2">
              {{ today_rports }}
            </v-card-subtitle>
          </v-card></v-col
        >
        <v-col cols="6" :sm="smScreen" md="4"
          ><v-card
            width="130"
            color="#E2E2ED"
            height="100"
            style="overflow:hidden"
            class="mx-auto"
          >
            <v-card-title
              class="text-center d-block pa-1"
              style="font-size: 0.75rem;word-break:normal"
            >
              {{ $t("media_count") }}
            </v-card-title>
            <v-card-subtitle class="text-shadow py-2">
              {{ media_count }}
            </v-card-subtitle>
          </v-card></v-col
        >
        <v-col cols="6" :sm="smScreen" md="4"
          ><v-card
            width="130"
            color="#E2E2ED"
            height="100"
            style="overflow:hidden"
            class="mx-auto"
          >
            <v-card-title
              class="text-center d-block pa-1"
              style="font-size: 0.75rem;word-break:normal"
            >
              {{ $t("total_rports") }}
            </v-card-title>
            <v-card-subtitle class="text-shadow py-2">
              {{ total_rports }}
            </v-card-subtitle>
          </v-card></v-col
        >
      </v-row>
    </v-skeleton-loader>
  </div>
</template>

<script>
import { bus } from "../main";
import reportsMixin from "../mixins/httpHandler";
import Backword from "../components/Backword";
import i18n from "../plugins/i18n";
export default {
  components: {
    Backword,
  },
  data() {
    return {
      reportStatus: [],
      declined_reports: "",
      accepted_reports: "",
      ignored_reports: "",
      total_rports: "",
      today_rports: "",
      media_count: "",
      switchClass: "",
      overlay: true,
      alignTop: false,
      dense: false,
      reverse: false,
      smScreen: "4",
      skeltonLoader: true,
      planBlur: "",
      dialogPlan: false,
      dialogCardErrorPlan: "",
      dialogErrorRouterPlan: "",
      dialogIconPlan: "",
      dialogTitlePlan: "",
      me9: "me-9",
      me16: "me-16",
      showBackword: ""
    };
  },
  methods: {
    onResize() {
      if (window.innerWidth >= 1250) {
        this.showBackword = true
      }
      if (window.innerWidth < 1250) {
        this.showBackword = false
      }
      if (window.innerWidth > 960) {
        this.cardWidth = "";
      } else {
        this.cardWidth = "200";
      }
      if (window.innerWidth < 600) {
        this.cardWidth = "";
      }
    },
    checkSessionState() {
      this.post({ router: "session_status" }, false).then((respone) => {
        if (
          respone.data.session == false ||
          localStorage.getItem("session_id") == null
        ) {
          this.$router.push("/login");
        }
      });
    },
    getStatus() {
      let statusData = {
        router: "get_status",
        number_id: this.$route.params.id,
      };
      this.post(statusData, false).then((response) => {
        if (response.data.session == false) {
          this.$router.push("/login").catch((err) => err);
        }
        if (response.data.success) {
          this.accepted_reports = parseFloat(response.data.accepted_reports);
          this.declined_reports = parseFloat(response.data.declined_reports);
          this.ignored_reports = parseFloat(response.data.ignored_reports);
          this.media_count = parseFloat(response.data.media_count);
          this.today_rports = parseFloat(response.data.today_rports);
          this.total_rports = parseFloat(response.data.total_rports);
          this.overlay = false;
          this.skeltonLoader = false;
          this.planBlur = "";
        }
        if (response.data.message === "plan_error") {
          this.skeltonLoader = true;
          this.overlay = false;
          this.dialogPlan = true;
          this.dialogErrorRouterPlan = `/plans/${this.$route.params.id}/${response.data.phone_number}`;
          this.dialogTitlePlan = i18n.t("upgrade");
          this.dialogCardErrorPlan = i18n.t("silver_plan_error_report");
          this.dialogIconPlan = "mdi-update";
        }
      });
    },
    reprotPadding(){
      bus.$on('minStatus', (data) => {
      if (data == false && i18n.locale == "en") {
        this.switchClass = "report-padding-english"
      }
      if (data == false && i18n.locale == "ar") {
        this.switchClass = "report-padding-arabic"
      }
      if (data) {
        this.switchClass = ""
      }
    })
    bus.$on('miniStatus', () => {
      this.switchClass = ''
      localStorage.setItem('mini', true)
    })
    },
  },
  mounted() {
    this.reprotPadding();
    this.me9 = "me-9";
    this.me16 = "me-16";
    bus.$on("removeNav", () => {
      this.switchClass = "";
      this.me9 = "";
      this.me16 = "";
    });
     bus.$on('englishLang' , () => {
      this.switchClass = "report-padding-english"
      if (localStorage.getItem('mini') == "false") {
        this.switchClass = "report-padding-english"
      }else {
        this.switchClass = ""
      }
    })
    bus.$on("arabicLang", () => {
      this.switchClass = "report-padding-arabic"
      if (localStorage.getItem('mini') == "false") {
        this.switchClass = "report-padding-arabic"
      } else{
        this.switchClass = ""
      }
    });
    let mini = localStorage.getItem("mini");
    // let isTrueSet = (mini === 'true' ? true : false);
    if (mini == "false" && i18n.locale == "en") {
      this.switchClass = "report-padding-english";
      this.me9 = "me-9";
      this.me16 = "me-16";
    }
    if (mini == "false" && i18n.locale == "ar") {
      this.switchClass = "report-padding-arabic";
      this.me9 = "me-9";
      this.me16 = "me-16";
    }
    if (mini == "true") {
      this.switchClass = "";
      this.me9 = "me-9";
      this.me16 = "me-16";
    }
    if (this.$route.params.id == undefined) {
      this.$router.push("/cards");
    }

    this.getStatus();
  },
  created() {
    this.checkSessionState();
  },
  updated() {
    this.reprotPadding();
    if (this.$route.params.id == undefined) {
      this.$router.push("/cards");
    }
  },
  mixins: [reportsMixin],
};
</script>
<style lang="scss">
.tree-number {
  font-family: "Arial Bold", sans-serif !important;
  font-size: 1.7rem;
}
.text-shadow {
  color: #565799;
  font-size: 40px !important;
  font-weight: 500;
  -webkit-text-stroke: 0px #565799;
  -moz-text-stroke: 0px #565799;
  -o-text-stroke: 0px #565799;
  -webkit-text-stroke: 0px #565799;
  width: 100%;
  height: 100%;
  text-align: center;
  letter-spacing: 2px;
  line-height: 1;
  padding-top: 10%;
  vertical-align: middle;
  text-shadow: 0px 0px 0px rgb(196, 196, 207), 1px 1px 0px rgb(196, 196, 207),
    2px 2px 0px rgb(197, 197, 208), 3px 3px 0px rgb(197, 197, 208),
    4px 4px 0px rgb(198, 198, 209), 5px 5px 0px rgb(198, 198, 209),
    6px 6px 0px rgb(199, 199, 210), 7px 7px 0px rgb(199, 199, 210),
    8px 8px 0px rgb(200, 200, 211), 9px 9px 0px rgb(200, 200, 211),
    10px 10px 0px rgb(201, 201, 212), 11px 11px 0px rgb(202, 202, 213),
    12px 12px 0px rgb(202, 202, 213), 13px 13px 0px rgb(203, 203, 214),
    14px 14px 0px rgb(203, 203, 214), 15px 15px 0px rgb(204, 204, 215),
    16px 16px 0px rgb(204, 204, 215), 17px 17px 0px rgb(205, 205, 216),
    18px 18px 0px rgb(205, 205, 216), 19px 19px 0px rgb(206, 206, 217),
    20px 20px 0px rgb(206, 206, 217), 21px 21px 0px rgb(207, 207, 218),
    22px 22px 0px rgb(207, 207, 218), 23px 23px 0px rgb(208, 208, 219),
    24px 24px 0px rgb(208, 208, 219), 25px 25px 0px rgb(209, 209, 220),
    26px 26px 0px rgb(209, 209, 220), 27px 27px 0px rgb(210, 210, 221),
    28px 28px 0px rgb(210, 210, 221), 29px 29px 0px rgb(211, 211, 222),
    30px 30px 0px rgb(211, 211, 222), 31px 31px 0px rgb(212, 212, 223),
    32px 32px 0px rgb(212, 212, 223), 33px 33px 0px rgb(213, 213, 224),
    34px 34px 0px rgb(214, 214, 225), 35px 35px 0px rgb(214, 214, 225),
    36px 36px 0px rgb(215, 215, 226), 37px 37px 0px rgb(215, 215, 226),
    38px 38px 0px rgb(216, 216, 227), 39px 39px 0px rgb(216, 216, 227),
    40px 40px 0px rgb(217, 217, 228), 41px 41px 0px rgb(217, 217, 228),
    42px 42px 0px rgb(218, 218, 229), 43px 43px 0px rgb(218, 218, 229),
    44px 44px 0px rgb(219, 219, 230), 45px 45px 0px rgb(219, 219, 230),
    46px 46px 0px rgb(220, 220, 231), 47px 47px 0px rgb(220, 220, 231),
    48px 48px 0px rgb(221, 221, 232), 49px 49px 0px rgb(221, 221, 232),
    50px 50px 0px rgb(222, 222, 233), 51px 51px 0px rgb(222, 222, 233),
    52px 52px 0px rgb(223, 223, 234), 53px 53px 0px rgb(223, 223, 234),
    54px 54px 0px rgb(224, 224, 235), 55px 55px 0px rgb(224, 224, 235),
    56px 56px 0px rgb(225, 225, 236), 57px 57px 0px rgb(225, 225, 236),
    58px 58px 0px rgb(226, 226, 237);
  font-family: arial;
}
.report-padding-english {
  padding: 0 150px 0 0;
}
.report-padding-arabic{
  padding: 0 0 0 150px;
}
</style>
