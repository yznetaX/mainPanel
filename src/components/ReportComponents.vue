<template>
  <div v-resize="onResize"  :class="[switchClass,me16]">
        <v-dialog v-model="dialogPlan" max-width="400" persistent>
        <v-card>
          <v-toolbar color="secondary" dark dense height="34" flat>
            <v-toolbar-title class="white--text subtitle-1">{{
              $t("upgrade_your_plan")
            }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-4" v-html="$t(dialogCardErrorPlan)"></v-card-text>
          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn color="orange" dark @click="$router.push('/cards')" small>
              <v-icon small class="me-1">
                mdi-whatsapp
              </v-icon>
              {{
              $t("dashboard")
            }}</v-btn>
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
    <vue-topprogress
      ref="topProgress"
      :color="'#81217d'"
      :height="3"
    ></vue-topprogress>
    <v-dialog v-model="hasAnError" max-width="400">
        <v-card>
          <v-toolbar color="secondary" dark dense height="34" flat>
            <v-toolbar-title class="white--text subtitle-1">{{
              $t("error")
            }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-4">{{ $t(errorData) }}</v-card-text>
          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn
              small
              color="secondary"
              @click="hasAnError = false"
              :to="dialogErrorRouter"
              router
              class="ms-2"
            >
              <v-icon class="me-1" small>
                {{ dialogIcon }}
              </v-icon>
              <span>{{ dialogTitle }}</span>
            </v-btn>
            <v-btn color="orange" @click="hasAnError = false" small dark>{{
              $t("close")
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    <reportDailog />
              <v-skeleton-loader
        ref="skeleton"
        :boilerplate="false"
        :type="'list-item-three-line, card-heading, image, actions,list-item-three-line, card-heading, image, actions'"
        :tile="false"
        :loading="skeletonLoader"
        :class="[skeltonMargin,me9]">
    <div>
      <v-card class="" flat>
        <v-simple-table class="report-tabel">
          <tbody>
            <tr>
              <td class="px-0">
                <v-badge
            ref="avatarRefBadge"
              bordered
              offset-y="13"
              overlap
              dot
              bottom
              :color="onlineInfo.isonline == true? 'green' : 'grey'">
              <v-avatar class="report-avatar" width="60" height="60">
                <v-progress-circular
                  indeterminate
                  color="grey"
                  size="20"
                  v-if="isloaded"
                ></v-progress-circular>

                <img
                  v-if="avatarImageLoaded"
                  :src="avatarImage"
                />
              </v-avatar>
            </v-badge>
              </td>
              <td class="pa-0" style="width: 100%">
            <v-card-subtitle class="py-0">
              <v-icon small>mdi-account</v-icon> {{ item.from_name == null ? $t("no_name") : item.from_name }}
            </v-card-subtitle>
            <v-card-subtitle class="py-0">
            <v-icon small>mdi-phone</v-icon> {{ item.from_number }}
            </v-card-subtitle>
            <v-card-subtitle class="py-0 mb-1" v-if="onlineInfo.success">
              <v-icon small>{{onlineInfo.isonline == true ? 'mdi-wifi-strength-4' : 'mdi-wifi-strength-off'}}</v-icon> {{ onlineInfo.lastSeen == false ? "Online" : onlineInfo.lastSeen }}
            </v-card-subtitle>
            <v-card-subtitle class="py-0 mb-1" v-else>
              <v-icon small>mdi-wifi-strength-alert-outline</v-icon>
              {{$t("no_data")}}
            </v-card-subtitle>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
        <div class="me-9 mt-1">
          <v-select
                :items="paths"
                :label="$t('choose')"
                item-text="path"
                item-value="path_id"
                solo
                dense
                @change="toThisItem"
                class="me-16"
                :hide-details="true"
              >
                <template v-slot:selection="{ item }">
                  <span class="subtitle-2">{{ $t(item.path) }}</span>
                </template>
                <template v-slot:item="{ item }">
                  <v-list dense class="pa-0">
                    <v-list-item dense class="pa-0">
                      <span class="subtitle-2">
                        {{ $t(item.path) }}
                      </span>
                    </v-list-item>
                  </v-list>
                </template>
              </v-select>
        </div>
      </v-card>
      
    </div>
      <v-btn id="dec" class="mt-4" color="primary" outlined :to="`/reports/${$route.params.id}`">
        <v-icon>mdi-undo-variant</v-icon>
        <span>{{$t('back_to')}} {{$t('general_statistics')}}</span>
      </v-btn>
      <div class="me-9">
        <!-- <v-alert color="red darken-4"
      border="left"
      colored-border
      type="error"
      elevation="2"  v-if="hasStatusAnError" class="me-16 mt-4">{{ $t(statusError) }}</v-alert> -->
        <!-- <v-alert outlined close-label color="red darken-4"  type="error"  v-if="hasAnError" class="me-16 mt-4">{{ $t(errorData) }}</v-alert> -->
        <v-alert
        @click="$router.push('/mujeebk_web')"
        color="red darken-4"
        border="left"
        colored-border
        type="error"
        elevation="2"
        class="mt-4 me-16"
        v-model="hasStatusAnError"
      >
        <span class="d-block">{{ $t(statusError) }}</span>
        <div class="mt-2">
          <v-btn color="red darken-4" dark small to="/mujeebk_web">
            <v-icon class="me-1">mdi-qrcode</v-icon>
            <span>{{ $t("rescan_qr_code") }}</span>
          </v-btn>
        </div>
      </v-alert>
      </div>
    <v-card
      class="mx-auto"
      v-for="(report, index) in filterSession == null ? reports : filterSession"
      :key="index"
      flat>
      <v-card flat>
        <v-card-title class="pa-0 my-3">
            <v-icon medium class="me-2">
              mdi-calendar-blank-outline
            </v-icon>
          <h5 class="subtitle-1 font-weight-light text-center">
            {{ report.date }}
          </h5>
        </v-card-title>
      </v-card>

      <v-card-text
        class="pa-0"
        v-for="(sessionsl, secindex) in report.sessions"
        :key="secindex"
      >
        <div v-for="(session, index) in sessionsl" :key="index">
          <div class="me-9">
            <v-card-title
              width="450"
              class="secondary white--text py-2 me-16 subtitle-2"
              style="border-radius: 3px; word-break:normal"
            >
              {{ $t(session.path) }}
            </v-card-title>
          </div>
          <v-timeline class="mb-4" dense>
            <div class="me-9">
              <v-timeline-item
                v-for="(answer, i) in session.answers"
                :key="i"
                fill-dot
                :color="answer.accepted == true || answer.accepted == false && answer.accepted !== null? 'grey' : 'secondary'"
                small
                class="py-1 me-16"
              >
                <template v-slot:icon>
                  <span class="white--text">{{ indexNumber(i) }}</span>
                </template>
                <v-card-title class="pa-2 px-0">
                  <v-chip small :color="answer.accepted == true || answer.accepted == false && answer.accepted !== null? 'grey' : 'secondary'" v-if="show12Time" class="white--text" :class="chipMargin">{{
                    answer.dialog_time 
                  }}
                  </v-chip>
                  <v-chip v-else small :color="answer.accepted == true || answer.accepted == false && answer.accepted !== null? 'grey' : 'secondary'" class="white--text" :class="chipMargin">{{
                    answer.dialog_time12
                  }}</v-chip>
                  <v-chip small class="ms-2">
                    <v-icon small class="me-1">mdi-calendar-blank-outline</v-icon>{{answer.dialog_date}}
                  </v-chip>
                  <v-chip small class="ms-2" v-if="answer.accepted == false && answer.accepted !== null" color="red darken-3" dark>{{$t('has_decliend')}}</v-chip>
                  <v-chip small class="ms-2" v-if="answer.accepted == true && answer.accepted !== null" color="green" dark>{{$t('has_accepted')}}</v-chip>
                </v-card-title>
                <v-card-actions class="pb-0 px-0">
                  <strong class="body-2"
                    ><v-icon size="20">mdi-message-arrow-right-outline</v-icon>
                    {{ $t(`dialog_types.${answer.dialog_id}`) }}</strong
                  >
                </v-card-actions>
                <v-card-actions class="px-0">
                  <div class="button my-1">
                    <v-icon size="20">mdi-robot</v-icon>
                    {{ answer.dialog_message }}
                  </div>
                </v-card-actions>
                <v-card-actions class="px-0">
                  <div class="body-2" style="width:100%">
                    <v-icon size="20" v-if="answer.dialog_answer != 'The User Name'" color="secondary">mdi-account</v-icon>
                    <span
                    class="secondary--text"
                      v-if="
                        answer.dialog_answer != null &&
                        answer.dialog_id != 'ask_contact'&&
                        answer.dialog_answer != 'GPS' &&
                        answer.dialog_id != 'product'
                      "
                    >
                      {{ answer.dialog_answer }}
                    </span>
                    <span
                      v-else-if="answer.dialog_data != null"
                      class="mx-auto d-block"
                    >
                      <v-img
                        @click="sharePhoto(answer)"
                        :src="answer.dialog_data"
                        width="200"
                        height="200"
                        v-if="answer.dialog_id == 'ask_photo'"
                        @load="photoOverlay = false"
                        class="reportImg"
                      >
                        <v-overlay
                          :value="photoOverlay"
                          absolute
                          color="white"
                          opacity="1"
                        >
                          <v-row align-content="center" justify="center">
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
                      </v-img>
                      <report-map v-if="answer.dialog_id == 'ask_gps'" :myCoordinates="{lat: parseFloat(answer.dialog_data.lat),lng: parseFloat(answer.dialog_data.lng)}"></report-map>
                      <video v-if="answer.dialog_id == 'ask_video'"></video>
                      <audio v-if="answer.dialog_id == 'ask_audio'"></audio>
                      <v-card v-if="answer.dialog_id == 'ask_contact'" width="100%" class="pa-1 mb-1">
                        <v-card-title class="subtitle-1 px-0 py-0 pb-1 d-block text-center">
                          <v-icon class="me-1">mdi-phone</v-icon> {{$t('vcard_title')}}
                        </v-card-title>
                        <v-card-subtitle v-if="answer.dialog_data.fullname" class="my-1 py-0">
                          <v-icon small class="me-1">mdi-account-box</v-icon>{{answer.dialog_data.fullname}}
                        </v-card-subtitle>
                        <v-divider v-if="answer.dialog_data.organization" class="mx-3"></v-divider>
                        <v-card-subtitle v-if="answer.dialog_data.organization" class="my-1 py-0">
                          <v-icon small class="me-1">mdi-office-building</v-icon>{{answer.dialog_data.organization}}
                        </v-card-subtitle>
                        <v-divider v-if="answer.dialog_data.title" class="mx-3"></v-divider>
                        <v-card-subtitle v-if="answer.dialog_data.title" class="my-1 py-0">
                          <v-icon small class="me-1">mdi-subtitles</v-icon>{{answer.dialog_data.title}}
                        </v-card-subtitle>
                        <v-divider v-if="answer.dialog_data.phone" class="mx-3"></v-divider>
                        <v-card-subtitle v-if="answer.dialog_data.phone" class="my-1 py-0">
                          <v-icon small class="me-1">mdi-phone</v-icon>
                            {{answer.dialog_data.phone}}
                        </v-card-subtitle>
                        <v-divider v-if="answer.dialog_data.url" class="mx-3"></v-divider>
                        <v-card-subtitle v-if="answer.dialog_data.url" class="my-1 py-0">
                          <v-icon small class="me-1">mdi-web</v-icon>
                          {{answer.dialog_data.url}}
                        </v-card-subtitle>
                        <v-divider v-if="answer.dialog_data.email" class="mx-3"></v-divider>
                        <v-card-subtitle v-if="answer.dialog_data.email" class="my-1 py-0">
                          <v-icon small class="me-1">mdi-email</v-icon>
                          {{answer.dialog_data.email}}
                        </v-card-subtitle>
                        <v-divider v-if="answer.dialog_data.address" class="mx-3"></v-divider>
                        <v-card-subtitle v-if="answer.dialog_data.address" class="my-1 py-0">
                          <v-icon small class="me-1">mdi-map-marker</v-icon>
                          <span v-for="(address,index) in answer.dialog_data.address" :key="index">
                            <span v-if="address.name">{{$t('address.name')}} : {{address.name}} | </span>
                            <span v-if="address.extended">{{$t('address.extended')}} : {{address.extended}} | </span>
                            <span v-if="address.street">{{$t('address.street')}} : {{address.street}} | </span>
                            <span v-if="address.city">{{$t('address.city')}} : {{address.city}} | </span>
                            <span v-if="address.region">{{$t('address.region')}} : {{address.region}} | </span>
                            <span v-if="address.zip">{{$t('address.zip')}} : {{address.zip}} | </span>
                            <span v-if="address.country">{{$t('address.country')}} : {{address.country}}</span>
                          </span>
                        </v-card-subtitle>
                      </v-card>
                      <v-card v-if="answer.dialog_id == 'product'" class="pa-1">
                        <v-card-subtitle class="py-0">
                          <v-icon small class="me-1">
                            mdi-account-arrow-right-outline
                          </v-icon>
                          <span>{{$t('client_answer')}}</span> : 
                          <span>
                            {{$t(answer.dialog_answer)}}
                          </span>
                          <v-divider class="my-1" v-if="answer.dialog_answer"></v-divider>
                        </v-card-subtitle>
                        
                        <v-card-subtitle class="py-0">
                          <div v-if="answer.catalog_data.productMessageTitle">
                            <v-icon small class="me-1">mdi-subtitles-outline</v-icon>
                            <span>{{$t('pro_title')}}</span> : 
                            {{answer.catalog_data.productMessageTitle}}
                          </div>
                          <v-divider class="my-1" v-if="answer.catalog_data.productMessageDescription"></v-divider>
                          <div v-if="answer.catalog_data.productMessageDescription">
                            <v-icon small class="me-1">mdi-message-outline</v-icon>
                            <span>{{$t('pro_description')}}</span> : 
                            {{answer.catalog_data.productMessageDescription}}
                          </div>
                          <v-divider class="my-1" v-if="answer.catalog_data.productMessagePrice"></v-divider>
                          <div v-if="answer.catalog_data.productMessagePrice">
                            <v-icon small class="me-1">mdi-currency-usd</v-icon>
                            <span>{{$t('pro_price')}}</span> : 
                            {{answer.catalog_data.productMessagePrice}} {{answer.catalog_data.productMessageCurrencyCode}}
                          </div>
                          <v-divider class="my-1" v-if="answer.catalog_data.productMessageRetailerId"></v-divider>
                          <div v-if="answer.catalog_data.productMessageRetailerId">
                            <v-icon small class="me-1">mdi-barcode</v-icon>
                            <span>{{$t('pro_id')}}</span> : 
                            {{answer.catalog_data.productMessageRetailerId}}
                          </div>
                        </v-card-subtitle>
                      </v-card>
                    </span>
                    <span v-else>
                      {{$t('there_is_no_answer')}}
                    </span>
                  </div>
                </v-card-actions>
                <div class="d-inline-block my-2">
                  <v-btn
                    rounded
                    class="me-2 py-3"
                    @click="openReplyDialog(answer)"
                    :color="answer.accepted == true || answer.accepted == false && answer.accepted !== null? 'grey' : ''"
                    x-small
                    >
                    <v-icon small :color="answer.accepted == true || answer.accepted == false && answer.accepted !== null? 'white' : 'grey darken-1'" class="ms-n1 me-1">
                      mdi-reply
                    </v-icon>
                    <span
                    :class="answer.accepted == true || answer.accepted == false && answer.accepted !== null? 'white--text' : 'grey--text text--darken-1 '"
                    >{{
                      $t("fast_reply")
                    }}</span>
                  </v-btn>
                </div>
                <div class="d-inline-block my-2">
                  <v-btn
                    rounded
                    class="me-2 py-3"
                    @click="decliendReport(answer)"
                    :loading="answer.declined_clicked == '' ? false : answer.declined_clicked"
                    :color="answer.accepted == true || answer.accepted == false && answer.accepted !== null? 'grey' : 'red darken-3'"
                    x-small dark>
                    <v-icon small class="ms-n1 me-1">
                      mdi-close
                    </v-icon>
                    <span class="">{{
                      $t("decliend_reports")
                    }}</span>
                  </v-btn>
                </div>
                  <div  class="d-inline-block my-2">
                    <v-btn
                    rounded
                    class="me-2 py-3"
                    @click="acceptedReport(answer)"
                    :loading="answer.accept_clicked == '' ? false : answer.accept_clicked"
                    :color="answer.accepted == true || answer.accepted == false && answer.accepted !== null? 'grey' : 'green'"
                    dark
                    x-small>
                    <v-icon small color="" class="ms-n1 me-1">
                      mdi-check
                    </v-icon>
                    <span class="">{{
                      $t("accept_reports")
                    }}</span>
                  </v-btn>
                  </div>
                <v-divider class="mt-3 me-10"></v-divider>
              </v-timeline-item>
            </div>
          </v-timeline>
        </div>
      </v-card-text>
    </v-card>
    </v-skeleton-loader>
  </div>
</template>
<script>
import reportComponent from "../mixins/httpHandler";
import reportDailog from "./ReportDialogs";
import { bus } from "../main";
import i18n from "../plugins/i18n";
import ReportMap from './ReportMap'
// import overlay from './cirlceOverlay'
export default {
  components: {
    reportDailog,
    'report-map': ReportMap,
    // overlay
  },
  data() {
    return {
      skeletonLoader: true,
      skeletonLoaderReport : true,
      reports: [],
      paths: [{ path: "show_all", path_id: null }],
      sessions: {},
      testArray: [],
      path_id: "",
      photoOverlay: true,
      show12Time: null,
      itemAnswers: "",
      re: "",
      filterSession: null,
      selecedPath: null,
      ans: "",
      date_12: "",
      date: "",
      overlay: true,
      loadingPadding: "",
      item: {},
      itemStatus: "",
      wait: true,
      avatarImage: "",
      avatarImageLoaded: false,
      onlineInfo: {},
      isloaded: true,
      t:'',
      switchClass: '',
      decliendReportLoading: false,
      acceptReportLoading: false,
      chipMargin: "",
      hasAnError: false,
      errorData: "",
      skeltonMargin: "me-16",
      dialogErrorRouter: "",
      dialogIcon: "",
      dialogTitle: "",
      skeltonSClass: "me-16",
      skeltonFClass: "me-9",
      planBlur: "",
            dialogPlan: false,
      dialogCardErrorPlan: "",
      dialogErrorRouterPlan: "",
      dialogIconPlan: "",
      dialogTitlePlan: "",
      me16: "me-16",
      me9: "me-9",
      hasStatusAnError: false,
      statusError: "",
      clicked: false
    };
  },
  methods: {
    decliendReport(answer){
      let decliedData = {
        router: "admin_text_replay",
        number_id: this.$route.params.id,
        answer_id: answer.answer_id,
        request_accepted: 'no'
      }
      answer.declined_clicked = true 
      this.post(decliedData, false).then((response) => {
         if (response.data.session == false) {
          this.$router.push("/login").catch((err) => err);
        }
        if (response.data.success) {
          answer.accepted = false
          answer.declined_clicked = false
          this.hasAnError = false
        } else {
          this.hasAnError = true
          this.errorData = `dialog_cards_error.${response.data.message}`
          this.dialogIcon = "mdi-qrcode"
          this.dialogTitle = i18n.t("rescane");
          this.dialogErrorRouter = "/mujeebk_web"
          answer.declined_clicked = false
        }
        
      })
    },
    acceptedReport(answer){
      let acceptData = {
        router: "admin_text_replay",
        number_id: this.$route.params.id,
        answer_id: answer.answer_id,
        request_accepted: 'yes'
      }
      answer.accept_clicked = true
      this.post(acceptData, false).then((response) => {
         if (response.data.session == false) {
          this.$router.push("/login").catch((err) => err);
        }
        if (response.data.success) {
          this.hasAnError = false
          answer.accepted = true
          answer.accept_clicked = false
        } else {
          this.hasAnError = true
          this.errorData = `dialog_cards_error.${response.data.message}`
          this.dialogIcon = "mdi-qrcode"
          this.dialogTitle = i18n.t("rescane");
          answer.accept_clicked = false
          this.dialogErrorRouter = "/mujeebk_web"
        }
      })
    },
    getAvatarImg(){
      if (this.$route.params.id && this.$route.params.number) {
        let imageData ={
        router: "get_profile_img",
        number_id : this.$route.params.id,
        phone_number: this.$route.params.number,
        get_online_status: 1,
        session_id: localStorage.getItem('session_id')
      }
      this.avatarImageLoaded = false
      this.isloaded = true
      this.avatarImage = ""
      this.post(imageData, false).then(async (response) => {
         if (response.data.session == false) {
          this.$router.push("/login").catch((err) => err);
        }
        if (response.data.is_online_information.message == "qr_session_expired") {
          this.hasStatusAnError = true
          this.statusError = `dialog_cards_error.${response.data.is_online_information.message}`
        }
        this.onlineInfo = response.data.is_online_information
        this.avatarImage = response.data.profile_photo
        if (this.$refs.avatarRefBadge != undefined ) {
          let avatarBadge = this.$refs.avatarRefBadge.$el.children[1].firstChild;
        avatarBadge.classList.add("avatar-badge")
        }
        this.isloaded = false
        this.skeletonLoader = false
        this.me16 = ""
        this.me9= ""
        this.skeltonMargin = ""
        this.avatarImageLoaded = true
      })
      } else{
        clearInterval(this.t)
      }
      
    },
    onResize() {
      if (window.innerWidth < 460) {
        this.chipMargin = "my-2"
      }else {
        this.chipMargin = ""
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
    },
    openReplyDialog(answer) {
      bus.$emit("openReplay", answer);
    },
    sharePhoto(answer) {
      bus.$emit("sharePhoto", answer);
    },
    getThisReport() {
      bus.$on("showOverlay", async () => {
        this.overlay = true;
        this.skeletonLoader = true
        this.skeltonMargin = "me-16"
        this.me16 = "me-16"
        this.me9= "me-9"
      });
      let getThisReportData = {
        router: "get_reports",
        number_id: this.$route.params.id,
        from_number: this.$route.params.number,
      };
      this.post(getThisReportData, false).then((response) => {
         if (response.data.session == false) {
          this.$router.push("/login").catch((err) => err);
        }
        if (response.data.message == "no_reports") {
          this.$router.push(`/reports/${this.$route.params.id}`)
        }
        if (response.data.success) {
                  this.reports = response.data.report;
        this.skeletonLoaderReport = false
        this.skeletonLoader = false
        this.me16 = ""
        this.me9= ""
        this.$store.state.mainReports = response.data.report;
        this.test();
        this.getAvatarImg()
        this.overlay = false;
        }
        if (response.data.message === "plan_error") {
          this.skeletonLoader = true
          this.me16 = "me-16"
        this.me9= "me-9"
          this.dialogPlan = true
          this.dialogErrorRouterPlan = `/plans/${this.$route.params.id}/${response.data.phone_number}`;
          this.dialogTitlePlan = i18n.t('upgrade');
          this.dialogCardErrorPlan = i18n.t("silver_plan_error_report");;
          this.dialogIconPlan = "mdi-update";
          this.overlay = false
        }
      });
    },
    toThisItem(item) {
      this.path_id = item;
      let filterData = {
        router: "get_reports",
        number_id: this.$route.params.id,
        from_number: this.$route.params.number,
        hash_id: item,
      };
      if (item != null) {
        this.$refs.topProgress.start();
        this.post(filterData, false).then((response) => {
           if (response.data.session == false) {
          this.$router.push("/login").catch((err) => err);
        }
          this.reports = response.data.report;
          this.$refs.topProgress.done();
        });
      } else {
        this.reports = this.$store.state.mainReports;
        this.$refs.topProgress.done();
      }
    },
     test() {
      let reports =  this.reports;
      if (reports != undefined) {
        reports.forEach((item) => {
        this.item = item;
        this.date = item.date;
        this.date_12 = item.date_12;
        this.$store.state.sessionsArray = item.sessions;
        this.sessions = item.sessions;
        item.sessions = this.sessions;
        item.sessions.forEach((item) => {
          item.forEach((item) => {
            this.itemAnswers = item.answers;
            this.paths.push(item);
          });
        });
      });
      }
      
    },
    indexNumber(i) {
      let index = i;
      return (index += 1);
    },
    timer(){
    this.t = setInterval(() => {
      this.avatarImage= "",
      this.avatarImageLoaded= false,
        this.getAvatarImg();
    },60000*3)
    },
    setTime(){
      this.timer()
    },
    stopTimer(){
      if (this.t) {
        clearInterval(this.t)
      }
    },
    reprotPadding(){
      bus.$on('minStatus', (data) => {
      if (data == false && i18n.locale == "en") {
        this.switchClass = "report-padding-english"
      }
      if (data == false && i18n.locale == "ar") {
        this.switchClass = "report-padding-arabic"
      }
      if (data == true) {
        this.switchClass = ""
      }
    })
    bus.$on('miniStatus', () => {
      this.switchClass = ''
      localStorage.setItem('mini', true)
    })
    }
  },
  computed: {},
  mounted() {
    bus.$on('refreshReports',() => {
      this.clicked = true
      this.skeletonLoader = true
      this.reports = []
      this.paths = [{ path: "show_all", path_id: null }]
    })
    this.hasAnError = false
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
      this.me9 = "";
      this.me16 = "";
    }
    bus.$on('stopTimer', () =>{
      if (this.t) {
        clearInterval(this.t)
      }
    })
    this.setTime()
    let timeVal = localStorage.getItem("reportTime");
    let trueValue = timeVal == "true" ? true : false;
    this.show12Time = trueValue;
    this.getThisReport();
    this.show12Time = localStorage.getItem("reportTime");
    bus.$on("shareTimeReport", (data) => {
      this.show12Time = data;
    });
  },
  watch: {
    $route(to,from){
      if (to.fullPath !== from.fullPath) {
        this.avatarImage= "",
      this.avatarImageLoaded= false,
        this.getThisReport()
        this.test()
      }
    },
    clicked(val){
      if (val) {
        this.isloaded = true
        this.avatarImage = ""
        this.avatarImageLoaded= false,
        this.getThisReport()
        this.test()
        this.clicked = false
      }
    }
  },
  beforeMount(){
    
  },
  created() {
    
  },
  updated() {
    this.reprotPadding()
    if (this.skeletonLoader == false) {
      let avatarBadge = this.$refs.avatarRefBadge.$el.children[1].firstChild
    avatarBadge.classList.add("avatar-badge")
    this.skeltonMargin = ""
    }
  },
  mixins: [reportComponent],
};
</script>
<style>
.englishPadding {
  padding: 0 30px 0 270px !important;
}
.arabicPadding {
  padding: 0 270px 0 30px !important;
}
.reportImg {
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
.theme--light.report-tabel > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper){
background: transparent !important;
}

.avatar-badge{
    border-radius: 9.5px !important;
    height: 13px !important;
    min-width: 0 !important;
    padding: 0 !important;
    width: 13px !important;
}
.avatar-badge::after{
  border-width: 2.5px !important;
}
.report-avatar{
    border-radius: 0 !important;
}
.report-padding-english {
  padding: 0 150px 0 8px;
}
.report-padding-arabic{
  padding: 0 8px 0 150px;
}
</style>
