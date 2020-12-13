<template id="cards">
  <div v-resize="onResize" class="px-2" :class="mbScreen">
    <v-snackbar v-model="snake" timeout="10000">
      <v-icon color="red darken-4">
        mdi-wifi-off
      </v-icon>
      Network error please try again <v-btn small class="ms-3" @click="$router.go(0)">
        <v-icon small class="me-2">mdi-replay</v-icon>
        Try again
      </v-btn>
    </v-snackbar>
    <cardConfirm ref="confirm"></cardConfirm>
    <v-overlay :value="overlay" color="white" opacity="1">
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
    <vue-topprogress
      ref="topProgress"
      :color="'#81217d'"
      :height="3"
    ></vue-topprogress>
    <Timeline v-if="showTimeline" />
    <div class="cards-page" v-if="showPage">
      <v-dialog v-model="dialog" max-width="400">
        <v-card>
          <v-toolbar color="secondary" dark dense height="34" flat>
            <v-toolbar-title class="white--text subtitle-1">{{
              $t("error")
            }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-4">{{ $t(dialogCardError) }}</v-card-text>
          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn
              small
              color="secondary"
              @click="dialog = false"
              :to="dialogErrorRouter"
              router
              class="ms-2"
              v-if="dialogButton"
            >
              <v-icon class="me-1" small>
                {{ dialogIcon }}
              </v-icon>
              <span>{{ dialogTitle }}</span>
            </v-btn>
            <v-btn color="#81217d" @click="dialog = false" small dark>{{
              $t("close")
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <transition name="fade">
        <v-toolbar flat dense height="40" ref="toolbarCards">
          <v-btn
            @click="startAll"
            style="cursor:pointer"
            small
            text
            class="px-0"
            :loading="startAllbuttonStatus"
          >
            <v-icon>
              mdi-play
            </v-icon>
            {{ $t("start_all") }}
          </v-btn>
          <v-divider class="mx-2 grey darken-1" inset vertical></v-divider>
          <v-btn
            small
            text
            style="cursor:pointer"
            @click="stopAll"
            class="px-0"
            :loading="stopAllbuttonStatus"
          >
            <v-icon>
              mdi-stop
            </v-icon>
            {{ $t("stop_all") }}
          </v-btn>
          <v-divider class="mx-2 grey darken-1" inset vertical></v-divider>
          <v-menu v-model="menu" offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                small
                text
                class="font-weight-bold px-0"
                v-on="on"
                style="cursor:pointer"
              >
                <v-icon>
                  mdi-chevron-double-down
                </v-icon>
                {{ sortByTitle }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(filter, i) in filters"
                :key="filter.id"
                @click="sortBy(filter)"
              >
                <v-list-item-title class="subtitle-2">{{
                  sortType[i]
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-divider
            class="mx-2 grey darken-1"
            inset
            vertical
            v-show="showToolbarRefresh"
          ></v-divider>
          <v-btn
            v-show="showToolbarRefresh"
            small
            text
            style="cursor:pointer"
            @click="refresh"
            class="px-0"
            icon
            color="black"
            :loading="process"
          >
            <v-icon>
              mdi-rotate-right
            </v-icon>
          </v-btn>
        </v-toolbar>
      </transition>
      <v-row height="50">
        <v-col cols="11" sm="10" md="10" class="text-center py-0">
          <v-text-field
            v-model="search"
            name="name"
            :placeholder="searchPlacHolder"
            id="id"
            outlined
            prepend-inner-icon="mdi-magnify"
            rounded
            color="secondary"
            type="search"
            class="cards-search"
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="1" class="pt-2 pb-0 ps-0" v-if="showRfreshSearch">
          <v-btn
            small
            text
            style="cursor:pointer"
            @click="refresh"
            class="px-0"
            icon
            color="black"
            :loading="process"
          >
            <v-icon>
              mdi-rotate-right
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-alert
        color="red darken-4 mt-2"
        type="error"
        outlined
        v-model="cardsSnake"
        dark
        >{{ cardsError }}</v-alert
      >
      <v-row>
        <div class="d-block mx-auto" v-if="noRecords">
          <v-subheader
            class="text-h5"
            style="letter-spacing: -0.3px !important;"
            ><v-icon size="40" class="me-2">mdi-emoticon-cry-outline</v-icon>
            {{ $t("no_record_found_card") }}</v-subheader
          >
        </div>
        <v-col
          cols="12"
          :sm="smallCardCount"
          :md="cardCount"
          v-show="card.show_hide_card"
          class="pt-1"
          v-for="(card, i) in filterCards"
          :key="card.id"
          id="main-card"
        >
          <v-lazy>
            <v-card
              :class="['pa-3', card.boxColorStyle]"
              elevation="0"
              color="grey lighten-2"
            >
              <v-simple-table class="card-table">
                <template v-slot:default style="overflow: hidden;">
                  <tbody>
                    <tr>
                      <td
                        style="width: 70px; vertical-align : middle;"
                        class="py-1 px-0"
                      >
                        <v-card-actions class="ps-0">
                          <keep-alive>
                          <avatar
                            :color_avatar="'grey'"
                            :phone_number="card.phone_number"
                            :number_id="card.number_id"
                            :show_online_dot="false"
                            :is_online_info="0"
                          />
                          </keep-alive>
                        </v-card-actions>
                      </td>
                      <td style="width: 100%; ;" class="pa-1 px-0">
                        <v-card-text
                          :class="['title pa-0', arabicDir]"
                          style="margin-top: -9px"
                        >
                          <span class="font-weight-bold">
                            {{ card.phone_number }}
                          </span>
                          <v-subheader
                            class="px-0 text-caption text-sm-caption"
                            style="height: 9px;font-weight: bold;margin-top: 7px;cursor:pointer"
                            @click="toPlans(card)"
                            >{{ plan_type[i] }}</v-subheader
                          >
                        </v-card-text>
                      </td>
                      <td
                        class="pa-0"
                        style="vertical-align: baseline;padding-top: 8px !important;"
                      >
                        <v-btn icon @click="cardSettings(card)" small class="mt-1">
                          <v-icon size="22">
                            mdi-cog-outline
                          </v-icon>
                        </v-btn>
                      </td>
                      <td
                        class="px-0"
                        style="width: 30px; vertical-align : baseline;padding-top: 8px !important;"
                      >
                        <v-btn text icon @click="toThisReport(card)" small class="mt-1">
                          <v-badge
                          class="card-badge"
                            :value="card.new_reports > '0' ? true : false"
                            :content="
                              parseInt(card.new_reports) >= '9'
                                ? '9+'
                                : parseInt(card.new_reports)
                            "
                            color="red darken-3"
                            bordered
                            overlap
                          >
                            <v-icon size="22">
                              {{
                                card.new_reports > "0"
                                  ? "mdi-bell-ring-outline"
                                  : "mdi-bell-outline"
                              }}
                            </v-icon>
                          </v-badge>
                        </v-btn>
                      </td>
                      <td
                        style="width: 30px; vertical-align : baseline;padding-top: 8px !important;"
                        class="pa-1 px-0"
                      >
                        <v-menu offset-y transition="slide-y-transition" bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn text icon v-on="on" small class="mt-1">
                              <v-icon size="22">mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>
                          <v-list class="py-0">
                            <v-list-item
                              v-for="(advanced, i) in advanceds"
                              :key="advanced.id"
                              @click="goTo(advanced, card)"
                            >
                              <v-icon class="me-2">
                                {{ advanced.icon }}
                              </v-icon>
                              <span class="text-caption">
                                {{ advancedSettings[i] }}
                              </span>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <v-row>
                <v-col cols="12" md="12" class="ma-auto">
                  <v-progress-linear
                    :value="card.barColorStyle"
                    height="35"
                    reactive
                    :color="card.barColor"
                  >
                    <span class="font-weight-regular" :class="card.fontColor">
                      <span v-if="card.day_remain && card.remain_time.days !== '0' && !card.block_number" class="me-1">{{
                        card.remain_time.days
                      }}</span>
                      <span
                        v-if="card.day_remain && card.remain_time.days !== '0' && !card.block_number"
                        class="font-weight-regular me-1"
                        >{{
                          $t("day_remaining")
                        }}</span
                      >
                      <span class="me-1" v-if="card.remain_time.hours !== 0 && !card.block_number">{{
                          card.remain_time.hours
                      }}</span>
                      <span class="me-1" v-if="card.remain_time.hours !== 0 && !card.block_number">{{
                          $t("hours")
                      }}</span>
                      <span
                        v-if="card.hours_remain && !card.block_number"
                        class="font-weight-regular me-1"
                        >{{ card.remain_time.minutes }}</span
                      >
                      <span
                        v-if="card.hours_remain && !card.block_number"
                        class="font-weight-regular me-1"
                        >{{
                          card.remain_time.days === "0" &&
                          card.remain_time.hours === "0"
                            ? $t("litle_minutes")
                            : $t("minutes")
                        }}</span
                      >
                      <span class="font-weight-regular" v-if="card.no_day && !card.block_number">{{
                        $t("subscription_expired")
                      }}</span>
                      <span class="font-weight-regular white--text" v-if="card.block_number">{{
                        $t("blokced_account")
                      }}</span>
                    </span>
                  </v-progress-linear>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="4"
                  :xs="4"
                  sm="4"
                  md="4"
                  v-show="card.cardStyle"
                  class="px-3 pe-2"
                >
                  <v-card-actions class="d-block text-center pa-0" v-if="card.plan_type != '3'">
                    <v-btn
                      dark
                      color="green"
                      class="font-weight-regular"
                      width="100%"
                      small
                      @click="toPlans(card)"
                    >
                      <v-icon small class="mx-1">
                        mdi-currency-usd
                      </v-icon>
                      <span class="pe-1">
                        {{ $t("upgrade") }}
                      </span>
                    </v-btn>
                  </v-card-actions>
                  <v-card-actions class="d-block text-center pa-0" v-if="card.plan_type == '3'">
                    <v-btn
                      dark
                      color="green"
                      class="font-weight-regular"
                      width="100%"
                      small
                      @click="toPlans(card)"
                    >
                    <v-icon small class="mx-1">
                        mdi-currency-usd
                      </v-icon>
                      <span class="pe-1">
                        {{ $t("extend_period") }}
                      </span>
                    </v-btn>
                  </v-card-actions>
                </v-col>
                <v-col
                  cols="4"
                  :xs="4"
                  sm="4"
                  md="4"
                  v-show="card.cardStyle"
                  class="px-2"
                >
                  <v-card-actions class="d-block text-center pa-0">
                    <v-btn width="100%" small @click="cardScenarios(card)">
                      <v-icon small class="me-1"
                        >mdi-text-box-multiple-outline</v-icon
                      >
                      {{ $t("scenarios") }}
                    </v-btn>
                  </v-card-actions>
                </v-col>
                <v-col
                  cols="4"
                  :xs="4"
                  sm="4"
                  md="4"
                  v-show="card.cardStyle && !card.block_number"
                  class="px-3 ps-2"
                >
                  <v-card-actions class="pa-0">
                    <v-btn
                      @click="changeColor(card)"
                      width="100%"
                      small
                      :loading="card.button_loading || buttonStatus"
                      :disabled="card.no_day || card.block_number"
                    >
                      <v-icon :color="card.colorIcon">
                        {{ card.stateIcon }}
                      </v-icon>
                      <span class="px-2">
                        {{ buttonState[i] }}
                      </span>
                    </v-btn>
                  </v-card-actions>
                </v-col>
                <v-col class="rescane" v-show="card.qrCardStyle && !card.block_number">
                  <v-btn color="red darken-4" dark small to="/mujeebk_web">
                    <v-icon class="me-1">mdi-qrcode</v-icon>
                    <span>{{ $t("rescan_qr_code") }}</span>
                  </v-btn>
                </v-col>
                <v-col class="rescane" v-show="card.block_number">
                  <v-btn color="red darken-4" dark small to="/support">
                    <v-icon class="me-1">mdi-phone</v-icon>
                    <span>{{ $t("contact_us") }}</span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-lazy>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import i18n from "../plugins/i18n";
import postCards from "../mixins/httpHandler";
import Timeline from "./Timeline";
import avatar from "./automated/Avatar";
import { bus } from "../main";
import cardConfirm from "./cardConfirm";
export default {
  components: {
    Timeline,
    avatar,
    cardConfirm,
  },
  data() {
    return {
      snake: false,
      dayRemaning: false,
      noDay: false,
      showToolbarRefresh: true,
      showRfreshSearch: false,
      dialog: false,
      load_tree: "/trees/1",
      loading: true,
      disabled: true,
      stateIcon: "mdi-stop",
      search: "",
      color: "red accent-2",
      cards: [],
      advanceds: [
        {
          title: "bot_status",
          icon: "mdi-flask-round-bottom",
        },
        {
          title: "whatsapp_widget",
          icon: "mdi-widgets-outline",
        },
        {
          title: "scenario",
          icon: "mdi-text-box-multiple-outline",
        },
        {
          title: "sch_messages",
          icon: "mdi-table-large",
        },
        {
          title: "payments_and_bills",
          icon: "mdi-credit-card-outline",
        },
        {
          title: "delete",
          icon: "mdi-close",
        },
      ],
      filters: [
        {
          name: "Running Sessions",
          val: "session_status",
          checkName: "running_sessions",
        },
        {
          name: "Stopped Session",
          val: "session_status",
          checkName: "stopped_sessions",
        },
        {
          name: "Expired Session",
          val: "",
          checkName: "expired_sessions",
        },
        {
          name: "Expired Subscription",
          val: "",
          checkName: "expired_subscription",
        },
        {
          name: "Show all",
          checkName: "show_all",
        },
      ],
      showPage: "",
      sessionId: "session_id",
      cardsSnake: false,
      cardsError: "",
      dialogCardError: "",
      dialogErrorRouter: "",
      dialogTitle: "",
      dialogIcon: "",
      dialogButton: true,
      showCardButtons: true,
      qrSession: false,
      cardWhats: "cardWhats",
      menu: false,
      isPhoneScreen: true,
      tooltip: true,
      showTimeline: false,
      overlay: true,
      process: false,
      arabicDir: "arabic-number",
      toolBarButton: false,
      loadingPadding: "",
      noRecords: false,
      brokenArray: [],
      cardCount: "6",
      smallCardCount: "6",
      cardPhone: "",
      cardNumberId: "",
      buttonStatus: false,
      startAllbuttonStatus: false,
      stopAllbuttonStatus: false,
      lll: false,
      showHowToUse: false,
      ss: null,
      here: "",
      clicked: false,
      mbScreen: "mb-9"
    };
  },
  watch: {
    clicked(v){
      if (v) {
        this.getAllNumber()
        this.clicked = false
      }
    },
  },
  methods: {
    toPlans(num){
      this.$router.push(`/plans/${num.number_id}/${num.phone_number}`)
    },
    toThisReport(number) {
      this.$router.push(`/reports/${number.number_id}`);
    },
    numberDir() {
      if (i18n.locale == "en" || localStorage.getItem("local_lang") == "en") {
        this.arabicDir = "";
      }
      if (i18n.locale == "ar" || localStorage.getItem("local_lang") == "ar") {
        this.arabicDir = "arabic-number";
      }
    },
    onResize() {
      if (window.innerWidth > 600) {
        this.isPhoneScreen = true;
        this.showToolbarRefresh = true;
        this.showRfreshSearch = false;
        this.mbScreen = ""
      }
      if (window.innerWidth <= 600) {
        this.isPhoneScreen = false;
        this.showRfreshSearch = true;
        this.showToolbarRefresh = false;
        this.mbScreen = "mb-12"
      }
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
      if (window.innerWidth <= 1125) {
        this.cardCount = "6";
      }
      if (window.innerWidth > 1125) {
        this.cardCount = "4";
      }
      if (window.innerWidth >= 700) {
        this.smallCardCount = "6";
      }
      if (window.innerWidth < 700) {
        this.smallCardCount = "12";
      }
    },
    right() {
      if (
        this.$vuetify.ltr == true ||
        localStorage.getItem("local_lang" == "en")
      ) {
        return true;
      }
    },
    async changeColor(card) {
      card.button_loading = true;
      let cardStatus = {
        router: "set_status",
        status: card.number_status === "1" ? "0" : "1",
        number_id: card.number_id,
      };
      await this.post(cardStatus, true).then(async (response) => {
        card.number_status = response.data.status;
        if (response.data.session == false) {
          this.$router.push("/login").catch((err) => err);
        }
        card.button_loading = false;
        await this.changeButtonColor();
        if (response.data.message == "block_number") {
          this.dialog = true;
          this.dialogButton = false
          this.dialogCardError = `snake_cards_error.${response.data.message}`;
          let s = document.getElementById("main-card");
          this.$vuetify.goTo(s, this.optionsGoTo);
        }
        if (
          response.data.message == "plan_expire"
        ) {
          this.dialog = true;
          this.dialogTitle = i18n.t("to_planns");
          this.dialogIcon = "mdi-qrcode";
          this.dialogButton = true
          this.dialogCardError = `snake_cards_error.${response.data.message}`;
          let s = document.getElementById("main-card");
          this.$vuetify.goTo(s, this.optionsGoTo);
        }
        if (response.data.message == "qr_session_expired") {
          //
          this.dialogErrorRouter = "/mujeebk_web";
          this.dialog = true;
          this.dialogButton = true
          this.dialogTitle = i18n.t("rescane");
          this.dialogCardError = `dialog_cards_error.${response.data.message}`;
          this.dialogIcon = "mdi-qrcode";
          card.boxColorStyle = "broken-card";
          card.cardStyle = false;
          card.qrCardStyle = true;
        }
        if (response.data.message == "no_scenario_id") {
          this.dialogErrorRouter = `/scenario/${card.number_id}/new`;
          this.dialog = true;
          this.dialogButton = true
          this.dialogTitle = i18n.t("create_scenario");
          this.dialogCardError = `dialog_cards_error.${response.data.message}`;
          this.dialogIcon = "mdi-text-box-outline";
        }
      });
    },
    sortBy(item) {
      this.$store.state.selectedOption = item;
      this.$store.state.working_array = this.$store.state.cards;
      if (item.checkName == "running_sessions") {
        var session_allow_array = this.$store.state.working_array;
        var session_allow_res = session_allow_array.filter((val) => {
          return val.number_status == "1" && val.session_allow == "1";
        });
        // this.cards = this.$store.state.working_array;
        this.cards = session_allow_res;
        if (this.cards.length > 0) {
          this.cards.map((card) => {
            card.show_hide_card = true;
            this.noRecords = false;
          });
        } else {
          this.noRecords = true;
        }
      }
      if (item.checkName == "stopped_sessions") {
        var session_broken_array = this.$store.state.working_array;
        var session_broken_res = session_broken_array.filter((val) => {
          return val.number_status == "0" && val.session_broken == "0";
        });
        // this.cards = this.$store.state.working_array;
        this.cards = session_broken_res;
        if (this.cards.length > 0) {
          this.cards.map((card) => {
            card.show_hide_card = true;
            this.noRecords = false;
          });
        } else {
          this.noRecords = true;
        }
      }
      if (item.checkName == "expired_sessions") {
        var arr = this.$store.state.cards;
        var res = arr.filter((val) => {
          return val.session_status == "0";
        });
        // this.cards = this.$store.state.working_array;
        this.cards = res;
        if (this.cards.length > 0) {
          this.cards.map((card) => {
            card.show_hide_card = true;
            this.noRecords = false;
          });
        } else {
          this.noRecords = true;
        }
      }
      if (item.checkName == "expired_subscription") {
        var exp_sub_array = this.$store.state.cards;
        var exp_sub_response = exp_sub_array.filter((val) => {
          return (
            val.remain_time.days == "0" &&
            val.remain_time.hours == "0" &&
            val.remain_time.minutes == "0" &&
            val.remain_time.seconds == "0"
          );
        });
        // this.cards = this.$store.state.working_array;
        this.cards = exp_sub_response;
        if (this.cards.length > 0) {
          this.cards.map((card) => {
            card.show_hide_card = true;
            this.noRecords = false;
          });
        } else {
          this.noRecords = true;
        }
      }
      if (item.checkName == "show_all") {
        var show_all_array = this.$store.state.cards;
        var show_all_response = show_all_array.filter((val) => {
          return val;
        });
        // this.cards = this.$store.state.working_array;
        this.cards = show_all_response;
        this.cards.map((card) => {
          card.show_hide_card = true;
          this.noRecords = false;
        });
      }
    },
    changeBarColor() {
      this.cards.map((card) => {
        if (card.block_number) {
          card.barColorStyle = "100"; // استعملتها مشان جرب تبع بار
          card.barColor = "orange";
          card.fontColor = "white--text";
          card.day_remain = false;
          card.no_day = true;
          card.hours_remain = false;
        }
        else if (parseFloat(card.remain_time.days) >= 15) {
          card.barColorStyle = "100";
          card.barColor = "cyan  darken-3";
          card.fontColor = "white--text";
          card.day_remain = true;
          card.no_day = false;
          card.hours_remain = false;
        } else if (
          parseFloat(card.remain_time.days) >= 10 &&
          parseFloat(card.remain_time.days) <= 15
        ) {

          card.barColorStyle = "65";
          card.barColor = "#FFB300";
          card.fontColor = "black--text";
          card.day_remain = true;
          card.hours_remain = false;
          card.no_day = false;
        } else if (
          parseFloat(card.remain_time.days) < 10 &&
          parseFloat(card.remain_time.days) > 0
        ) {
          card.barColorStyle = "25"; // استعملتها مشان جرب تبع بار
          card.barColor = "red  accent-2";
          card.fontColor = "black--text";
          card.day_remain = true;
          card.hours_remain = false;
          card.no_day = false;
        } else if (
          parseFloat(card.remain_time.days) == 0 &&
          parseFloat(card.remain_time.hours) > 0 &&
          parseFloat(card.remain_time.minutes) > 0
        ) {
          card.barColorStyle = "10"; // استعملتها مشان جرب تبع بار
          card.barColor = "red accent-2";
          card.fontColor = "black--text";
          card.day_remain = true;
          card.hours_remain = true;
          card.no_day = false;
        } else if (
          parseFloat(card.remain_time.days) == 0 &&
          parseFloat(card.remain_time.hours) == 0 &&
          parseFloat(card.remain_time.minutes) > 0
        ) {
          card.barColorStyle = "1"; // استعملتها مشان جرب تبع بار
          card.barColor = "red accent-2";
          card.fontColor = "black--text";
          card.hours_remain = true;
          card.day_remain = false;
          card.no_day = false;
        } else if (
          parseFloat(card.remain_time.days) == 0 &&
          parseFloat(card.remain_time.hours) == 0 &&
          parseFloat(card.remain_time.minutes) == 0
        ) {
          card.barColorStyle = "0"; // استعملتها مشان جرب تبع بار
          card.barColor = "grey";
          card.fontColor = "black--text";
          card.day_remain = false;
          card.no_day = true;
          card.hours_remain = false;
        }
        if (card.number_status == 0) {
          card.colorIcon = "green";
          card.stateIcon = "mdi-play";
          card.buttonState = "start";
        }
        if (card.number_status == 1) {
          card.colorIcon = "red darken-3";
          card.stateIcon = "mdi-stop";
          card.buttonState = "stop";
        }
      });
    },
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
    cardScenarios(card) {
      if (parseFloat(card.scenarios_count) == 0) {
        localStorage.setItem("scenario_number", 0)
        this.$router.push(`/scenario/${card.number_id}/new`);
      } else {
        this.$route.params.id = card.number_id;
        this.$router.push("/scenario/" + card.number_id);
        this.$store.state.number_id = card.number_id;
        this.$store.state.photo_profile = card.profile_photo;
        this.$store.state.phone_number = card.phone_number;
      }
    },
    cardSettings(card) {
      this.$route.params.id = card.number_id;
      this.$router.push("/settings/" + card.number_id);
      this.$store.state.number_id = card.number_id;
      this.$store.state.photo_profile = card.profile_photo;
      this.$store.state.phone_number = card.phone_number;
    },
    changeButtonColor() {
      this.cards.map((card) => {
        if (card.number_status == 0) {
          card.colorIcon = "green";
          card.stateIcon = "mdi-play";
          card.buttonState = "start";
        }
        if (card.number_status == 1) {
          card.colorIcon = "red darken-3";
          card.stateIcon = "mdi-stop";
          card.buttonState = "stop";
        }
      });
    },
    changeCardStatus() {
      this.cards.map((card) => {
        if (card.session_status == 0) {
          card.boxColorStyle = "broken-card";
          card.cardStyle = false;
          card.qrCardStyle = true;
          this.toolBarButton = true;
        }
        if (card.session_status == 1) {
          card.boxColorStyle = "cardWhats";
          card.cardStyle = true;
          card.qrCardStyle = false;
          this.toolBarButton = false;
        }
      });
    },
    toQrScane() {
      this.$router.push("/mujeebk_web");
    },
    async startAll() {
      let startAllConfirm = i18n.t("start_all_confirm");
      const res = await this.$root.$confirm("confirm", startAllConfirm);
      if (res) {
        this.buttonStatus = true;
        this.startAllbuttonStatus = true;
        await this.post({ router: "start_all_numbers" }, false).then(
          async (response) => {
            if (response.data.session == false) {
              this.$router.push("/login").catch((err) => err);
            }
            this.cards = response.data.registered_numbers;

            await this.changeButtonColor();
            this.changeCardStatus();
            this.changeBarColor();
            this.buttonStatus = false;
            this.startAllbuttonStatus = false;
          }
        )
      } else {
        this.buttonStatus = false;
        this.startAllbuttonStatus = false;
      }
    },
    async stopAll() {
      let stopAllConfirm = i18n.t("stop_all_confirm");
      const res = await this.$root.$confirm("confirm", stopAllConfirm);
      if (res) {
        this.stopAllbuttonStatus = true;
        this.buttonStatus = true;
        this.post({ router: "stop_all_numbers" }, false).then(
          async (response) => {
            this.cards = response.data.registered_numbers;
            if (response.data.session == false) {
              this.$router.push("/login").catch((err) => err);
            }
            await this.changeButtonColor();
            this.changeCardStatus();
            this.changeBarColor();
            this.buttonStatus = false;
            this.stopAllbuttonStatus = false;
          }
        );
      } else {
        this.stopAllbuttonStatus = false;
        this.buttonStatus = false;
      }
    },
    async goTo(item, card) {
      if (item.title == "bot_status") {
        this.$router.push(`/bot_status/${card.number_id}`);
      }
      if (item.title == "whatsapp_widget") {
        this.$router.push(`/widget_settings/${card.number_id}`);
      }
      if (item.title == "sch_messages") {
        this.$router.push(`/sch_messages/${card.number_id}`);
      }
      if (item.title == "payments_and_bills") {
        this.$router.push(`/payments_and_bills/${card.number_id}`);
      }
      if (item.title == "reports") {
        this.$router.push(`/reports/${card.number_id}`);
      }
      if (item.title == "scenario") {
        if (parseFloat(card.scenarios_count) == 0) {
          this.$router.push(`scenario/${card.number_id}/new`);
        } else {
          this.$router.push(`/scenario/${card.number_id}`);

        }
      }
      if (item.title == "delete") {
        let deleteOneCardData = {
          router: "delete_number",
          number_id: card.number_id,
        };
        let deleteOneCard = i18n.t("delete_one_card");
        const res = await this.$refs.confirm.open("confirm", deleteOneCard);

        if (res) {
          this.post(deleteOneCardData, false).then((response) => {
            if (response.data.session == false) {
              this.$router.push("/login").catch((err) => err);
            }
            this.cards = response.data.registered_numbers;
            this.getAllNumber();
            bus.$emit("deleteCard");
          });
        }
      }
    },
    async getAllNumber() {
      await this.post({ router: "get_numbers" }, false).then((response) => {
        if (response.data.session == false) {
          this.$router.push("/login").catch(err => err)
        }
        if (this.$refs.toolbarCards !== undefined) {
          let toolbar__content = this.$refs.toolbarCards.$el.children[0];
          toolbar__content.style.padding = "0px";
        }

        let cards = response.data.registered_numbers;
        this.cards = cards;
        this.$store.state.cards = cards;
        this.$store.state.working_array = cards;
        // cards.forEach((card) => {
        //   this.$store.state.avatars[card.phone_number] = {
        //     card
        //   }
        // })
        //
        localStorage.setItem("card_number", cards.length);
        this.$store.state.card_number = cards.length;
        this.$store.state.working_array = this.$store.state.cards;
        if (cards.length > 0) {
          this.showTimeline = false;
          this.showPage = true;
          this.getAllCards();
        } else {
          this.showTimeline = true;
          this.showPage = false;
        }
        this.changeCardStatus();
        this.changeBarColor();
        this.overlay = false;
      }).catch((err) => {
        if(err) {
          this.snake = true
        }
      })
    },
    async refresh() {
      this.$refs.topProgress.start();
      this.process = true;
      await this.getAllNumber();
      this.process = false;
      this.noRecords = false;
      this.$refs.topProgress.done();
      this.$store.state.selectedOption = "";
    },
    getAllCards() {
      this.cards.map((card) => {
        card.show_hide_card = true;
      });
    },
  },
  async beforeMount(){
    await this.getAllNumber();
  },
  async mounted() {
    localStorage.removeItem("existing_title")
    window.scrollTo(0,0)
    bus.$on('refreshCards', ()=> {
      this.clicked = true
    })
    this.clicked = false

    bus.$emit("cardCreted");
    this.$store.state.selectedOption = "";
    this.numberDir();
    this.showPageContent();
    this.loading = false;
    bus.$on("showSnakeBar", (data) => {
      this.showHowToUse = data;
    });
  },
  computed: {
    sortByTitle() {
      let isSelectedOption = this.$store.state.selectedOption;
      if (!isSelectedOption) return i18n.t("sort_by");
      return i18n.t(`sort_item.${isSelectedOption.checkName}`);
    },
    filterCards() {
      return this.cards.filter((card) => {
        return card.phone_number.match(new RegExp(this.search, "i"));
      });
    },
    plan_type() {
      // اذا بدي جيبهن عم اعمل map
      return this.cards.map((card) => {
        card.show_hide_card = true;
        if (card.plan_type == 0) {
          return i18n.t("plan_types.free_plan");
        }
        if (card.plan_type == 1) {
          return i18n.t("plan_types.silver_plan");
        }
        if (card.plan_type == 2) {
          return i18n.t("plan_types.golden_plan");
        }
        if (card.plan_type == 3) {
          return i18n.t("plan_types.premium_plan");
        }
      });
    },
    advancedSettings() {
      return this.advanceds.map((adv) => {
        if (adv.title == "bot_status") {
          return i18n.t("bot_status");
        }
        if (adv.title == "scenario") {
          return i18n.t("scenarios");
        }
        if (adv.title == "whatsapp_widget") {
          return i18n.t("whatsapp_widget");
        }
        if (adv.title == "sch_messages") {
          return i18n.t("sch_messages");
        }
        if (adv.title == "payments_and_bills") {
          return i18n.t("payments_and_bills");
        }

        if (adv.title == "delete") {
          return i18n.t("delete");
        }
        if (adv.title == "how_it_work") {
          return i18n.t("how_it_work");
        }
      });
    },
    sortType() {
      return this.filters.map((item) => {
        if (item.checkName == "running_sessions") {
          return i18n.t("sort_item.running_sessions");
        }
        if (item.checkName == "stopped_sessions") {
          return i18n.t("sort_item.stopped_sessions");
        }
        if (item.checkName == "expired_sessions") {
          return i18n.t("sort_item.expired_sessions");
        }
        if (item.checkName == "expired_subscription") {
          return i18n.t("sort_item.expired_subscription");
        }
        if (item.checkName == "show_all") {
          return i18n.t("sort_item.show_all");
        }
      });
    },
    buttonState() {
      return this.cards.map((card) => {
        if (card.buttonState == "start") {
          return i18n.t("start");
        }
        if (card.buttonState == "stop") {
          return i18n.t("stop");
        }
      });
    },
    searchPlacHolder() {
      return i18n.tc("search_place_holder");
    },
  },
  updated() {
    this.numberDir();
    this.changeBarColor();
  },
  mixins: [postCards],
};
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@600&display=swap");
.cards-page {
  font-family: "Cairo" !important;
  font-size: 0.9125rem;
}
.v-application .subtitle-2 {
  font-family: "Cairo" !important;
}
.rounded {
  border-radius: 3px !important;
}
.border-icon {
  background-color: #272727;
  border-radius: 4px;
  margin-left: -1px;
  border-left: 0px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
.set-btn {
  border-right: 0px !important;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
.cardWhats {
  background: rgb(246, 246, 246);
  background: -moz-linear-gradient(
    360deg,
    rgba(246, 246, 246, 1) 0%,
    rgba(255, 255, 255, 1) 40%
  );
  background: -webkit-linear-gradient(
    360deg,
    rgba(246, 246, 246, 1) 0%,
    rgba(255, 255, 255, 1) 40%
  );
  background: linear-gradient(
    360deg,
    rgba(246, 246, 246, 1) 0%,
    rgba(255, 255, 255, 1) 40%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#f6f6f6",endColorstr="#ffffff",GradientType=1);
  border: 1px solid;
}
.broken-card {
  background: rgb(246, 246, 246);
  background: -moz-linear-gradient(
    360deg,
    rgba(246, 246, 246, 1) 0%,
    rgba(255, 255, 255, 1) 40%
  );
  background: -webkit-linear-gradient(
    360deg,
    rgba(246, 246, 246, 1) 0%,
    rgba(255, 255, 255, 1) 40%
  );
  background: linear-gradient(
    360deg,
    rgba(246, 246, 246, 1) 0%,
    rgba(255, 255, 255, 1) 40%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#f6f6f6",endColorstr="#ffffff",GradientType=1);
  border: 1px solid #f33c3c !important;
}
.cards-search {
  border-radius: 12px !important;
}
.rescane {
  text-align: center !important;
}
.qr-session-error {
  word-break: normal;
  text-align: justify;
  font-size: 1rem !important;
}
.v-data-table__wrapper {
  overflow-x: hidden !important;
}
.theme--light.card-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: transparent !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.arabic-number {
  text-align: right;
}
.englishPadding {
  padding: 0 30px 0 270px !important;
}
.arabicPadding {
  padding: 0 270px 0 30px !important;
}
.cards-toolbar > .v-toolbar__content {
  padding: 0px !important;
}
.card-badge {
  .v-badge__wrapper {
    .v-badge__badge {
      bottom: calc(100% - 6px) !important;
      right: calc(100% - 6px) !important;

    }
  }
}
</style>
