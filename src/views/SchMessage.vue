<template>
  <div class="sch-message px-2" :class="[marginButtom, noPlan]" v-resize="onResize">
    <vue-topprogress
      ref="topProgress"
      :color="'#81217d'"
      :height="3"
    ></vue-topprogress>
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
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-toolbar color="secondary" dark dense height="34" flat>
          <v-toolbar-title class="white--text subtitle-1">{{
            $t("error")
          }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-4">{{ dialogCardError }}</v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            small
            color="secondary"
            @click="dialog = false"
            :to="dialogErrorRouter"
            router
            class="ms-2"
          >
            <v-icon class="me-1">
              {{ dialogIcon }}
            </v-icon>
            <span>{{ dialogTitle }}</span>
          </v-btn>
          <v-btn color="orange" @click="dialog = false" small>{{
            $t("close")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <overlay :overlay="overlay" />
    <confirm ref="setConfirm"></confirm>
    <v-card-title class="px-0 secondary--text mujeebk-title">
      <Backword v-if="showBackword" />
      {{ $t("sch_messages") }}
    </v-card-title>
    <v-alert
      color="red darken-4"
      border="left"
      colored-border
      type="error"
      elevation="2"
      v-model="alertError"
    >
      <span class="d-block">{{ $t(dialogAlertError) }}</span>
      <div class="mt-2">
        <v-btn color="red darken-4 mx-auto" dark small to="/mujeebk_web">
          <v-icon class="me-1">mdi-qrcode</v-icon>
          <span>{{ $t("rescan_qr_code") }}</span>
        </v-btn>
      </div>
    </v-alert>
    <v-alert
      border="left"
      colored-border
      type="error"
      color="red darken-4"
      elevation="2"
    >
      {{ $t("sch_message_service_terms") }}<br />
      {{ $t("sch_licenses") }}
    </v-alert>

    <v-row>
      <!-- Allow Numbers API -->
      <v-col cols="12" sm="8" md="6" class="py-0 ">
        <v-alert outlined close-label type="success" v-if="haveSent === 1">{{
          $t("have_sent_alert")
        }}</v-alert>
      </v-col>
    </v-row>
    <v-row>
      <!-- Allow Numbers API -->
      <v-col cols="12" sm="8" md="6" class="py-0 " id="allowed">
        <v-card-text
          class="subtitle-1 px-0 pt-0"
          style="font-family: Cairo !important;"
          >{{ $t("number_allow_reply") }}</v-card-text
        >
        <v-alert
          color="red darken-4 mt-2"
          type="error"
          outlined
          v-model="errorMessageNumber"
          dark
          >{{ $t(dialogModalErrorNumber) }}</v-alert
        >
        <v-autocomplete
          v-model="allowedNumber"
          :items="itemsAllow"
          :loading="isAllowLoading"
          :filter="customNumberName"
          item-text="name"
          item-value="name"
          @blur="allowedBlur"
          append-outer-icon="mdi-close"
          return-object
          :label="$t('pick_blocked_number')"
          :placeholder="placeholderNumbers"
          @click:append-outer="clearAllowNumberArray"
          dense
          @keypress.enter="addAllowedNumber"
          solo
          multiple
          :error="hasErrorAllow"
          :error-messages="errorMessageAllow"
          :hide-no-data="true"
          :menu-props="autocompleteMenuProps"
          ref="allow"
          :disabled="checkAll == false ? false : true"
        >
          <template v-slot:selection="{ item, index }" class="secondary">
            <span v-if="index === 0" class="subtitle-2">{{ item.name }}</span>
            <span v-if="index === 1" class="grey--text caption ms-1">
              (+{{ allowedNumber.length - 1 }} {{ $t("others") }})</span
            >
          </template>
        </v-autocomplete>
        <v-menu
          v-model="showAllowedMenu"
          offset-Y
          :position-x="xAllow"
          :position-y="yAllow"
        >
          <v-card width="300">
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <v-avatar class="bigAvatar">
                    <v-progress-circular
                      indeterminate
                      color="grey"
                      size="20"
                      v-if="isloaded"
                    ></v-progress-circular>
                    <img
                      :src="profileImg"
                      v-if="avatarImageLoaded"
                      onError="this.onerror=null;this.src='https://mujeebk.com/images/no_photo.png';"
                    />
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    class="subtitle-2"
                    style="font-family:Cairo !important"
                  >
                    {{ thisAllowName }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ thisAllowNumber }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="deleteAllowItem(deleteAllowIndex)">
                    <v-icon>mdi-close-circle</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <v-chip-group
          multiple
          column
          ref="chipgroup"
          style="max-height: 150px !important"
        >
          <v-chip
            close
            @click:close="deleteAllowItem(i)"
            v-for="(allow, i) in numbersChecked"
            :key="i"
            @click="showAllowField($event, allow, i)"
          >
            <avatar
              :avatarClass="'smallAvatar me-2'"
              :phone_number="allow.number"
              :color_avatar="'white'"
              :show_online_dot="false"
            />
            {{
              allow.name.length > maxLength
                ? allow.name.slice(0, maxLength) + "..."
                : allow.name
            }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="8" md="6" class="py-0 " id="options">
        <v-alert
          color="red darken-4 mt-2"
          type="error"
          outlined
          v-model="errorMessageOptions"
          dark
          >{{ $t(dialogModalErrorOptions) }}</v-alert
        >
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn block color="secondary" v-on="on" class="mt-2 mb-4">{{
              titleDialog
            }}</v-btn>
          </template>
          <v-list flat max-height="250" style="overflow-y:scroll">
            <v-list-item
              v-for="(option, index) in options"
              :key="index"
              @click="handelSelectOption(option, index)"
              dense
              >{{ optionsTranslate[index] }}</v-list-item
            >
          </v-list>
        </v-menu>
        <v-alert
          color="red darken-4 mt-4"
          type="error"
          outlined
          v-model="errorMessage"
          dark
          >{{ $t(dialogModalError) }}</v-alert
        >
        <v-card-text
          class="py-2 px-0"
          v-if="descriptionMessage"
          v-html="descriptionMessage"
        ></v-card-text>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="8" md="6" class="py-0 ">
        <v-card flat>
          <v-card-actions class="py-0 px-0" v-if="isNumberCard">
            <v-text-field
              :disabled="processing"
              prepend-icon="mdi-card-account-phone-outline"
              color="secondary"
              :label="$t(`dialog_types.card_number_name`)"
              v-model="inputs.display_name"
            ></v-text-field>
          </v-card-actions>
          <v-card-actions class="py-0 px-0" v-if="isNumberCard">
            <v-text-field
              color="secondary"
              :disabled="processing"
              prepend-icon="mdi-phone"
              :label="$t(`dialog_types.send_card_number`)"
              required
              v-model="inputs.card_number"
            ></v-text-field>
          </v-card-actions>
          <v-card-actions v-if="isIncludeMessage" class="py-0 my-2 px-0">
            <v-textarea
              rows="3"
              color="secondary"
              :disabled="processing"
              v-model="inputs.message"
              prepend-inner-icon="mdi-emoticon"
              @click:prepend-inner="showEmojiPicker"
              :placeholder="$t('message')"
              outlined
              no-resize
              required
              :hide-details="true"
              ref="message"
            ></v-textarea>
            <v-menu
              v-model="emojiModal"
              class="emoji-menu"
              offset-Y
              :position-x="x"
              :position-y="y"
              :close-on-content-click="false"
            >
              <VEmojiPicker
                @select="selectEmoji"
                :emojiSize="25"
                :emojisByRow="4"
                :showCategories="false"
                style="width: 250px; height: 250px"
              />
            </v-menu>
          </v-card-actions>
          <v-card-actions v-if="indcludeTTS" class="pb-0 px-0">
            <v-select
              :disabled="processing"
              v-model="inputs.voice_type"
              :items="ttsInput"
              :item-text="text"
              item-value="value"
              :label="$t('select_voice_type')"
              outlined
              color="secondary"
              dense
              return-object
              prepend-icon="mdi-account-voice"
              required
            >
            </v-select>
          </v-card-actions>
          <v-card-actions v-if="isIncludeTtsMessage" class="py-0 px-0">
            <v-textarea
              rows="3"
              color="secondary"
              :disabled="processing"
              v-model="inputs.ttsMessage"
              prepend-icon="mdi-android-messages"
              :label="$t('message')"
              outlined
              no-resize
              :rules="[rulesTTS.moreThan100, rulesTTS.lessThan5]"
              counter
              required
            ></v-textarea>
          </v-card-actions>
          <v-card-actions v-if="inputMessage" class="py-0 pt-1">
            <span>{{ inputMessage }}</span>
          </v-card-actions>
          <v-card-actions v-if="fileInput" class="py-0 px-0">
            <v-file-input
              :disabled="processing"
              v-model="inputs.file"
              :rules="rules"
              :accept="fileInput.accept"
              :prepend-icon="fileInput.icon"
              color="secondary"
              :label="$t(`dialog_types.${fileInput.placeholder}`)"
            ></v-file-input>
          </v-card-actions>
          <v-card-actions v-if="textInput" class="py-0 px-0">
            <v-text-field
              color="secondary"
              :disabled="processing"
              v-model="inputs.url"
              :prepend-icon="textInput.icon"
              :label="$t(`dialog_types.${textInput.placeholder}`)"
            ></v-text-field>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="8" md="6" class="py-0 my-6" id="date">
        <v-alert
          color="red darken-4 mt-2"
          type="error"
          outlined
          v-model="errorMessageDate"
          dark
          >{{ dialogModalErrorDate }}</v-alert
        >
        <v-card-text
          class="subtitle-1 px-0 pt-0"
          style="font-family: Cairo !important;"
          >{{ $t("date_to_send") }}</v-card-text
        >

        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="date"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              solo
              dense
              v-model="date"
              :label="$t('choose_date')"
              append-outer-icon="mdi-calendar-month"
              readonly
              v-bind="attrs"
              v-on="on"
              :hide-details="true"
            ></v-text-field>
          </template>
          <v-date-picker
            @change="dateChoose"
            v-model="date"
            no-title
            scrollable
            :min="minDate"
            max="2030-03-20"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="closeDatePicker">{{
              $t("cancel")
            }}</v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(date)">{{
              $t("save")
            }}</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="8" md="6" class="py-0" id="time">
        <v-alert
          color="red darken-4 mt-2"
          type="error"
          outlined
          v-model="errorMessageTime"
          dark
          >{{ $t(dialogModalErrorTime) }}</v-alert
        >
        <v-card-text
          class="subtitle-1 px-0 pt-0"
          style="font-family: Cairo !important;"
          >{{ $t("time_to_send") }}</v-card-text
        >
        <span class="ms-2 subtitle-1">
          ( {{ minutesToHHMM(operating, timeFormatSwitch) }} )
        </span>
        <v-slider
          class=""
          color="secondary"
          v-model="operating"
          track-color="#e0e0e0"
          max="1440"
          min="0"
          @change="checkSliderChange"
        >
        </v-slider>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="8" md="6" class="py-0 mb-6" id="agree">
        <v-alert
          color="red darken-4 mt-2"
          type="error"
          outlined
          v-model="errorMessageAgree"
          dark
          >{{ $t(dialogModalErrorAgree) }}</v-alert
        >
        <v-checkbox
          v-model="agreeTerms"
          :error="termsError"
          :label="$t('agree_sch_terms')"
          @change="shareAgreeSchTerms"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="8" md="6" class="py-0 mb-6">
        <v-card-actions class="mt-0 flex-row-reverse" v-if="showSaveButton">
          <v-btn
            :loading="isTrue"
            class="ms-3"
            color="secondary"
            @click="handelSave"
            :disabled="isTrueDisabled"
            small
            >{{ $t("save") }}</v-btn
          >
        </v-card-actions>
        <v-card-actions class="mt-0 flex-row-reverse" v-if="showSentButton">
          <v-btn
            v-if="haveSent === 1"
            class="ms-3"
            color="secondary"
            :disabled="true"
            small
            >{{ $t("ending") }}</v-btn
          >
        </v-card-actions>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import schMessages from "../mixins/httpHandler";
import i18n from "../plugins/i18n";
import { parsePhoneNumberFromString as parseMax } from "libphonenumber-js/max";
import avatar from "../components/automated/Avatar";
import VEmojiPicker from "v-emoji-picker";
import { postSchDataToServer } from "../components/automated/utils";
import { bus } from "../main";
import confirm from "../components/settingsDialog";
import overlay from "../components/cirlceOverlay";
import Backword from "../components/Backword";
export default {
  components: {
    avatar,
    VEmojiPicker,
    confirm,
    overlay,
    Backword
  },
  props: {
    dialogId: {
      type: String,
      default: null,
    },
    option: {
      type: Object,
      default: null,
    },
    values: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      title: "",
      timeFormatSwitch: this.$store.state.timeFormatSwitch
        ? this.$store.state.timeFormatSwitch
        : false,
      operating: 0,
      checkAll: false,
      date: new Date().toISOString().substr(0, 10),
      minDate: new Date().toISOString().substr(0, 10),
      menu: false,
      allowedNumber: [],
      isAllowLoading: false,
      hasErrorAllow: false,
      errorMessageAllow: "",
      xAllow: 0,
      yAllow: 0,
      searchAllow: null,
      showAllowedMenu: false,
      profileImg: "",
      avatarImageLoaded: false,
      isloaded: true,
      allowArray: [],
      thisAllowName: "",
      thisAllowNumber: "",
      maxLength: 15,
      selectedOption: this.option,
      options: this.$store.state.sch_options,
      index: "",
      rules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          i18n.t("dialog_errors.invalid_file_size"),
      ],
      rulesTTS: {
        moreThan100: (value) =>
          !value ||
          value.length < 100 ||
          i18n.t("dialog_errors.invalid_tts_message"),
        lessThan5: (value) =>
          !value ||
          value.length > 5 ||
          i18n.t("dialog_errors.invalid_tts_message"),
      },
      inputs: {
        message: this.values && this.values.message, //حبيبي وين اقيمة العداد يعم تقرا من
        file: null,
        url: this.values && this.values.url,
        voice_type: this.values && this.values.voice_type,
        position: this.$store.state.newLocation,
        zoom: this.$store.state.zoom,
        card_number: this.values && this.values.card_number,
        display_name: this.values && this.values.display_name,
        ttsMessage: this.values && this.values.ttsMessage,
      },
      errorMessage: false,
      dialogModalError: "",
      processing: false,
      isTrue: false,
      isTrueDisabled: false,
      emojiModal: false,
      x: 0,
      y: 0,
      timeToSend: null,
      choosenDate: null,
      errorMessageNumber: false,
      dialogModalErrorNumber: "",
      alertError: false,
      dialogAlertError: "",
      errorMessageOptions: false,
      dialogModalErrorOptions: "",
      errorMessageTime: false,
      dialogModalErrorTime: "",
      dialogModalErrorAgree: "",
      errorMessageAgree: false,
      errorMessageDate: false,
      dialogModalErrorDate: "",
      search: "",
      overlay: true,
      marginButtom: "",
      haveSent: null,
      agreeTerms: false,
      termsError: false,
      dialog: false,
      dialogTitle: "",
      dialogIcon: "",
      dialogErrorRouter: "",
      dialogCardError: "",
      noPlan: "",
      blurOverlay: true,
      dialogPlan: false,
      dialogCardErrorPlan: "",
      dialogErrorRouterPlan: "",
      dialogIconPlan: "",
      dialogTitlePlan: "",
      itemsAllow: [],
      placeholderNumbers: i18n.t("loading_numbers"),
      showBackword:""
    };
  },
  methods: {
    getAllContactNumber() {
      let gatNumberData = {
        router: "get_contact",
        number_id: this.$route.params.id,
      };
      this.post(gatNumberData, false).then((response) => {
        this.itemsAllow = response.data.contacts;
        this.$store.state.contacts = response.data.contacts;
        this.placeholderNumbers = "";
        if (response.data.message === "no_records") {
          this.alertError = true;
          this.dialogAlertError = `dialog_cards_error.qr_session_expired`
          this.isTrueDisabled = true;
        }
      });
    },
    closeDatePicker() {
      this.menu = false;
      this.choosenDate = new Date().toISOString().substr(0, 10);
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    shareAgreeSchTerms(agree) {
      this.agreeTerms = agree;
      if (agree == true) {
        this.termsError = false;
      }
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    onResize() {
      if (window.innerWidth >= 1250) {
        this.showBackword = true
      }
      if (window.innerWidth < 1250) {
        this.showBackword = false
      }
      if (window.innerWidth <= 600) {
        this.marginButtom = "mb-12";
      } else {
        this.marginButtom = "";
      }
    },
    checkSessionState() {
      this.post({ router: "session_status" }, false).then((respone) => {
        if (respone.data.session == false) {
          this.$router.push("/login").catch((err) => err);
        }
      });
    },
    getThisSchData() {
      let getScgData = {
        router: "get_schedule",
        number_id: this.$route.params.id,
        schedule_id: this.$route.params.new,
      };
      if (this.$route.params.new !== "new") {
        this.overlay = true;
        this.post(getScgData, false).then(async (response) => {
          if (response.data.message === "plan_error") {
            this.overlay = false;
            this.dialogPlan = true;
            this.dialogErrorRouterPlan = `/plans/${this.$route.params.id}/${response.data.phone_number}`;
            this.dialogTitlePlan = i18n.t("upgrade");
            this.dialogCardErrorPlan = i18n.t("silver_plan_error");
            this.dialogIconPlan = "mdi-update";
          } else {
            this.overlay = false;
            this.dialogPlan = false;
          }
          if (response.data.session == false) {
            this.$router.push("/login").catch((err) => err);
          }
          let json_details = JSON.parse(response.data.schedule.json_details);
          this.selectedOption = json_details.option;
          this.inputs = json_details.inputs;
          this.timeToSend = json_details.botTime;
          this.operating = json_details.botTime;
          this.allowedNumber = json_details.allowedNumber;
          this.choosenDate = json_details.date;
          this.haveSent = parseFloat(response.data.schedule.status);
          this.overlay = false;
          if (this.haveSent === 1) {
            this.agreeTerms = true;
          } else {
            this.agreeTerms = false;
          }
        });
      } else {
        this.overlay = false;
      }
    },
    dateChoose(date) {
      this.choosenDate = date;
      this.errorMessageDate = false;
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    async checkSliderChange(time) {
      this.timeToSend = time;
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
      this.errorMessageTime = false;
    },
    minutesToHHMM(mins, twentyFour = false) {
      let h = Math.floor(mins / 60);
      let m = mins % 60;
      m = m < 10 ? "0" + m : m;

      if (twentyFour) {
        h = h < 10 ? "0" + h : h;
        return `${h}:${m}`;
      } else {
        let a = i18n.t("am");
        if (h >= 12) a = i18n.t("pm");
        if (h > 12) h = h - 12;
        if (h == 0) h = 12;
        return `${h}:${m} ${a}`;
      }
    },
    handelSelectOption(option) {
      this.errorMessage = false;
      this.errorMessageOptions = false;
      this.inputs.message = "";
      this.inputs.file = this.inputs.url = this.inputs.voice_type = this.inputs.number = this.inputs.name = null;
      this.selectedOption = option;
    },
    showAllowField(e, item, index) {
      this.profileImg = e.path[0].childNodes[0].children[0].currentSrc;
      this.avatarImageLoaded = true;
      this.isloaded = false;
      this.deleteAllowIndex = index;
      this.thisAllowName = item.name;
      this.thisAllowNumber = item.number;
      this.showAllowedMenu = false;
      this.xAllow = e.clientX;
      this.yAllow = e.clientY;
      this.$nextTick(() => {
        this.showAllowedMenu = true;
      });
    },
    async deleteAllowItem(i) {
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
      this.showAllowedMenu = false;
      this.allowedNumber.splice(i, 1);
    },
    customFilter(item, queryText) {
      const textOne = item.text.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    },
    clearTimeZone() {
      this.timezoneValue = "";
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    customNumberName(item, queryText) {
      return (
        item.name.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) >
          -1 ||
        item.number.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) >
          -1
      );
    },
    async clearAllowNumberArray() {
      this.allowedNumber = [];
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
    },
    async addAllowedNumber(val) {
      let phoneNumber = "+" + val.target.value.replace("+", "");
      let checkNumber = parseMax(phoneNumber);
      if (val.target.value != null && checkNumber != undefined) {
        try {
          let numberChecked = checkNumber.number;
          if (parseMax(numberChecked).isValid()) {
            if (await this.$refs.setConfirm.open(this.title, "contact_name")) {
              let v = {
                name: this.title,
                number: numberChecked,
              };
              this.allowedNumber.push(v);
              this.errorMessageNumber = false;
              this.search = "";
              this.title = "";
              this.hasErrorAllow = false;
              this.errorMessageAllow = "";
            }
          } else {
            this.hasErrorAllow = true;
            this.errorMessageAllow = i18n.t("number_format_error");
            let s = document.getElementById("allowed");
            this.$vuetify.goTo(s, this.optionsGoTo);
            this.showNoData = false;
          }
        } catch (e) {
          this.hasErrorAllow = true;
          this.errorMessageAllow = i18n.t("number_format_error");
          let s = document.getElementById("allowed");
          this.$vuetify.goTo(s, this.optionsGoTo);
          this.showNoData = false;
        }
      } else {
        this.hasErrorAllow = true;
        this.errorMessageAllow = i18n.t("number_format_error");
        let s = document.getElementById("allowed");
        this.$vuetify.goTo(s, this.optionsGoTo);
        this.showNoData = false;
      }
    },
    allowedBlur() {
      (this.hasErrorAllow = false), (this.errorMessageAllow = "");
      this.errorMessageNumber = false;
    },
    showEmojiPicker(e) {
      e.preventDefault();
      this.emojiModal = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.emojiModal = true;
      });
    },
    caretEmoji(emoji) {
      const textArea = this.$refs.message.$refs.input;
      this.cursorPosition = textArea.selectionEnd;
      const start = this.inputs.message.substring(0, textArea.selectionStart); // بس هي this.input لمين
      const end = this.inputs.message.substring(textArea.selectionStart);
      this.inputs.message = start + emoji + end;
      textArea.focus();
      this.$nextTick(() => {
        textArea.selectionEnd = this.cursorPosition + emoji.length;
      });
    },
    selectEmoji(emoji) {
      this.caretEmoji(emoji.data);
    },
    text: (item) => i18n.t(`${item.text}`),
    handelClose() {
      this.dialog = false;
      this.$emit("hide");
    },
    handelSave() {
      this.errorMessage = false;
      this.processing = true;
      this.isTrue = true;
      this.isTrueDisabled = true;
      this.checkSessionState();
      if (this.isValidLocaly()) {
        this.checkInServer((data) => {
          this.processing = false;
          if (data.success) {
            this.dialog = false;
            if (data.url) this.inputs.url = data.url;
          } else {
            if (data.error) {
              this.errorMessage = true;
              if (data.error == "Error: Network Error") {
                this.dialogModalError = `dialog_errors.network_error`
                let s = document.getElementById("options");
                this.$vuetify.goTo(s, this.optionsGoTo);
                this.isTrue = false;
                this.isTrueDisabled = false;
              } else {
                this.dialogModalError = `dialog_errors.${data.error}`
                this.isTrue = false;
                this.isTrueDisabled = false;
              }
            } else {
              this.errorMessage = true;
              this.dialogModalError = "dialog_errors.no_input_data"
              let s = document.getElementById("options");
              this.$vuetify.goTo(s, this.optionsGoTo);
            }
          }
        });
      } else {
        this.processing = false;
        this.isTrue = false;
        this.isTrueDisabled = false;
      }
    },
    isValidLocaly() {
      if (this.allowedNumber.length > 20) {
        this.errorMessageNumber = true;
        this.dialogModalErrorNumber = "number_20_max"
        let s = document.getElementById("allowed");
        this.$vuetify.goTo(s, this.optionsGoTo);
        return false;
      }
      if (this.allowedNumber.length === 0) {
        this.errorMessageNumber = true;
        this.dialogModalErrorNumber = "choose_recipients"
        let s = document.getElementById("allowed");
        this.$vuetify.goTo(s, this.optionsGoTo);
        return false;
      }
      if (this.selectedOption == null) {
        this.errorMessageOptions = true;
        this.dialogModalErrorOptions = "choose_options"
        let s = document.getElementById("options");
        this.$vuetify.goTo(s, this.optionsGoTo);
        return false;
      }
      let timeNow = new Date().getHours() * 60;
      if (
        this.timeToSend < timeNow &&
        this.choosenDate == new Date().toISOString().substr(0, 10)
      ) {
        this.errorMessageTime = true;
        this.dialogModalErrorTime = "date_time_error"
        let s = document.getElementById("time");
        this.$vuetify.goTo(s, this.optionsGoTo);
        return false;
      }
      if (this.timeToSend == null) {
        this.errorMessageTime = true;
        this.dialogModalErrorTime = "choose_time"
        let s = document.getElementById("time");
        this.$vuetify.goTo(s, this.optionsGoTo);
        return false;
      }
      if (this.agreeTerms == false) {
        this.errorMessageAgree = true;
        this.dialogModalErrorAgree = "agree_error"
        let s = document.getElementById("agree");
        this.$vuetify.goTo(s, this.optionsGoTo);
        this.termsError = true;
        return false;
      }

      if (
        !this.fileInput &&
        !this.textInput &&
        !this.selectedOption.send_tts_message &&
        !this.inputs.message &&
        !this.selectedOption.send_contact
      ) {
        this.errorMessage = true;
        this.dialogModalError = "dialog_errors.no_valid_message"
        let s = document.getElementById("options");
        this.$vuetify.goTo(s, this.optionsGoTo);
        return false;
      }
      if (
        this.fileInput &&
        this.textInput &&
        ((this.inputs.file && this.inputs.url && this.inputs.url.length > 0) ||
          (!this.inputs.file && (!this.inputs.url || this.inputs.url === "")))
      ) {
        this.errorMessage = true;
        this.dialogModalError = "dialog_errors.no_selected_file"
        let s = document.getElementById("options");
        this.$vuetify.goTo(s, this.optionsGoTo);
        return false;
      }

      if (this.fileInput && !this.textInput && !this.inputs.file) {
        this.errorMessage = true;
        this.dialogModalError = "no_pick_file.no_pick_file"
        let s = document.getElementById("options");
        this.$vuetify.goTo(s, this.optionsGoTo);
        return false;
      }

      if (
        !this.fileInput &&
        this.textInput &&
        (!this.inputs.url || this.inputs.url === "")
      ) {
        this.errorMessage = true;
        this.dialogModalError = "dialog_errors.no_url"
        let s = document.getElementById("options");
        this.$vuetify.goTo(s, this.optionsGoTo);
        return false;
      }
      if (this.selectedOption.send_tts_message && !this.inputs.ttsMessage) {
        this.errorMessage = true;
        this.dialogModalError = "dialog_errors.enter_message"
        let s = document.getElementById("options");
        this.$vuetify.goTo(s, this.optionsGoTo);
        return false;
      }
      if (
        this.selectedOption.send_contact &&
        !this.inputs.card_number &&
        !this.inputs.displat_name
      ) {
        this.errorMessage = true;
        this.dialogModalError = "dialog_errors.enter_number"
        let s = document.getElementById("options");
        this.$vuetify.goTo(s, this.optionsGoTo);
        return false;
      }
      return true;
    },
    checkInServer(callback) {
      postSchDataToServer({
        dialogId: this.dialogId,
        option: this.selectedOption,
        inputs: this.inputs,
        botTime: this.timeToSend,
        allowedNumber: JSON.stringify(this.allowedNumber),
        date: this.choosenDate == null ? this.date : this.choosenDate,
      })
        .then((serverData) => {
          callback(serverData);
          let json = {
            dialogId: this.dialogId,
            option: this.selectedOption,
            inputs: this.inputs,
            botTime: this.timeToSend,
            allowedNumber: this.allowedNumber,
            date: this.choosenDate == null ? this.date : this.choosenDate,
            number_id: this.$route.params.id,
          };
          let secondPostData = {
            router: "set_schedule",
            number_id: this.$route.params.id,
            json_details: JSON.stringify(json),
            agree: this.agreeTerms == true ? "1" : "0",
          };
          let editSchDara = {
            router: "set_schedule",
            number_id: this.$route.params.id,
            json_details: JSON.stringify(json),
            schedule_id: this.$route.params.new,
            agree: this.agreeTerms == true ? "1" : "0",
          };
          if (this.$route.params.new == "new") {
            this.post(secondPostData, false).then((response) => {
              if (response.data.success) {
                this.$router.push(`/sch_messages/${this.$route.params.id}`);
              } else {
                if (response.data.message == "qr_session_expired") {
                  this.dialogErrorRouter = "/mujeebk_web";
                  this.dialog = true;
                  this.dialogTitle = i18n.t("rescane");
                  this.dialogCardError = i18n.t(
                    `dialog_cards_error.${response.data.message}`
                  );
                  this.dialogIcon = "mdi-qrcode";
                } else {
                  if (response.data.message === "plan_error") {
                    this.dialogPlan = true;
                    this.dialogErrorRouterPlan = `/plans/${this.$route.params.id}/${response.data.phone_number}`;
                    this.dialogTitlePlan = i18n.t("upgrade");
                    this.dialogCardErrorPlan = i18n.t("silver_plan_error_sch");
                    this.dialogIconPlan = "mdi-update";
                  } else {
                    this.errorMessageTime = true;
                    this.dialogModalErrorTime =`${response.data.message}`
                  }
                }
              }
              if (!response.data.session) {
                this.$router.push("/login");
              }
            });
          } else {
            this.post(editSchDara, false).then((response) => {
              if (response.data.success) {
                this.$router.push(`/sch_messages/${this.$route.params.id}`);
              } else {
                if (response.data.message === "plan_error") {
                  this.dialogPlan = true;
                  this.dialogErrorRouterPlan = `/plans/${this.$route.params.id}/${response.data.phone_number}`;
                  this.dialogTitlePlan = i18n.t("upgrade");
                  this.dialogCardErrorPlan = i18n.t("silver_plan_error_sch");
                  this.dialogIconPlan = "mdi-update";
                } else {
                  this.errorMessageTime = true;
                  this.dialogModalErrorTime = `${response.data.message}`
                }
              }
              if (!response.data.session) {
                this.$router.push("/login");
              }
            });
          }

          this.isTrue = false;
          this.isTrueDisabled = false;
        })
        .catch((err) => err);
    },
  },
  computed: {
    showSentButton() {
      let haveSent = this.haveSent;
      return haveSent !== null && haveSent === 1;
    },
    showSaveButton() {
      let haveSent = this.haveSent;
      return haveSent === null || haveSent === 0;
    },
    optionsGoTo() {
      return {
        duration: 500,
        offset: 0,
        easing: "linear",
      };
    },

    numbersChecked() {
      if (!this.allowedNumber) return [];
      return this.allowedNumber.map((key) => key || "n/a");
    },
    isIncludeMessage() {
      if (this.isOptionSelected) {
        if (this.selectedOption.message == undefined) return true; // وهون ؟؟؟؟
        return this.selectedOption.message;
      }
      return false;
    },
    indcludeTTS() {
      if (this.isOptionSelected) {
        if (this.selectedOption.send_tts_message == undefined) return false;
        return this.selectedOption.send_tts_message;
      }
      return false;
    },
    isNumberCard() {
      if (this.isOptionSelected) {
        if (this.selectedOption.send_contact == undefined) return false;
        return this.selectedOption.send_contact;
      }
      return false;
    },
    isIncludeTtsMessage() {
      if (this.isOptionSelected) {
        if (
          this.selectedOption.send_tts_message == undefined &&
          this.selectedOption.tts_message == undefined
        )
          return false;
        return this.selectedOption.tts_message;
      }
      return false;
    },
    isOptionSelected() {
      return this.selectedOption != null;
    },
    titleDialog() {
      if (!this.isOptionSelected) return i18n.t("select_dialog_type");
      // return this.selectedOption.title || this.selectedOption.text;
      return i18n.t(`dialog_types.${this.selectedOption.id}`);
    },
    fileInput() {
      if (this.isOptionSelected && this.selectedOption.inputs) {
        for (var i = 0; i < this.selectedOption.inputs.length; i++)
          if (this.selectedOption.inputs[i].input_type == "file")
            return this.selectedOption.inputs[i];
      }
      return null;
    },
    textInput() {
      if (this.isOptionSelected && this.selectedOption.inputs) {
        for (var i = 0; i < this.selectedOption.inputs.length; i++)
          if (this.selectedOption.inputs[i].input_type == "text")
            return this.selectedOption.inputs[i];
      }
      return null;
    },
    ttsInput() {
      if (this.isOptionSelected && this.selectedOption.items) {
        return this.selectedOption.items;
      }
      return null;
    },
    inputMessage() {
      if (this.fileInput && this.textInput)
        return i18n.t("dialog_types.pick_one_item");
      if (this.fileInput) return i18n.t("dialog_types.pick_file");
      if (this.textInput) return i18n.t("dialog_types.set_url");
      return null;
    },
    descriptionMessage() {
      if (this.isOptionSelected) {
        if (this.selectedOption.description_message == undefined) return false;
        return i18n.t(`dialogs_descriptions.${this.selectedOption.id}`);
      }
      return false;
    },
    optionsTranslate() {
      return this.options.map((option) => {
        if (option.id == option.id) {
          return i18n.t(`dialog_types.${option.id}`);
        }
      });
    },
    autocompleteMenuProps() {
      // default properties copied from the vuetify-autocomplete docs
      let defaultProps = {
        maxHeight: 304,
        contentClass: "secondary--text",
        zIndex: "6",
      };

      if (this.$vuetify.breakpoint.smAndDown) {
        defaultProps.maxHeight = 230;
        defaultProps.top = true;
      }
      return defaultProps;
    },
    // itemsAllow() {
    //   return this.allowArray.map((entry) => {
    //     const name =
    //       entry.name.length > this.descriptionLimit
    //         ? entry.name.slice(0, this.descriptionLimit) + "..."
    //         : entry.name;
    //     const number = entry.number;
    //     return Object.assign({}, entry, { name, number });
    //   });
    // },
  },
  watch: {
    searchAllow(val) {
      if (this.isAllowLoading) return;
      this.isAllowLoading = true;
      let searchData = {
        router: "search_contact",
        search: this.searchAllow,
        number_id: this.$route.params.id,
      };
      // Lazily load input items
      this.post(searchData, false)
        // .then(res => res.json())
        .then((res) => {
          if (res.data.search != undefined) {
            this.allowArray = res.data.search;
            this.showNoData = false;
          } else {
            this.showNoData = true;
            return val;
          }
          return val;
        })
        .catch((err) => {
          err;
        })
        .finally(() => (this.isAllowLoading = false));
    },
  },
  mounted() {
    this.getAllContactNumber();
    if (this.haveSent === 1) {
      this.agreeTerms = true;
    } else {
      this.agreeTerms = false;
    }
    this.checkSessionState();
    if (this.$route.params.new !== " new") {
      this.getThisSchData();
    } else {
      this.overlay = false;
    }
    if (this.$refs.chipgroup.$refs.wrapper != undefined) {
      let chipGroupContent = this.$refs.chipgroup.$refs.wrapper;
      chipGroupContent.style.overflowY = "auto";
    }
    if (this.$refs.allow.$refs.label != undefined) {
      let allow = this.$refs.allow.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
  },
  updated() {
    if (this.$refs.allow.$refs.label != undefined) {
      let allow = this.$refs.allow.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
  },
  created() {
    // bus.$on("delte", (data) => {});
    bus.$on("shareTitle", (title) => {
      this.title = title;
    });
    bus.$on("sharePosition", (data) => {
      this.inputs.position = data;
    });
    bus.$on("shareZoom", (data) => {
      this.inputs.zoom = data;
    });
  },
  mixins: [schMessages],
};
</script>
