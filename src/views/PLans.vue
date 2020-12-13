<template>
  <div v-resize="onResize">
    <overlay :overlay="overlay" />
    <v-dialog v-model="dialog" max-width="400" persistent>
      <v-card>
        <v-toolbar color="secondary" dark dense height="34" flat>
          <v-toolbar-title class="white--text subtitle-1">{{
            $t(dialogMainTitle)
          }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-4" v-html="$t(dialogCardError)"></v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn color="orange" dark @click="dialog = false"  small>
            {{ $t("close") }}</v-btn
          >
          <v-btn
            small
            color="secondary"
            @click="dialog = false"
            :to="dialogErrorRouter"
            router
            class="ms-2"
            v-if="showSecondButton"
          >
            <v-icon class="me-1" small>
              {{ dialogIcon }}
            </v-icon>
            <span>{{ dialogTitle }}</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row justify="center" class="py-2">
      <span class="me-2 dir-style">{{$t(oneMonth)}}</span>
      <div @click="toggleSwitch" class="holder-switch">
        <span :class="['child-switch', switcherMargin]"></span>
      </div>
      <span class="ms-2 dir-style">{{$t(sixMonth)}}</span>
    </v-row>
    <v-card flat>
        <v-card flat>
          <v-row class="ma-0" v-if="!isMobScreenPlan">
            <v-col cols="12" sm="4">
              <v-card-title class="font-weight-bold text-h6">
               {{$t('personal')}}
              </v-card-title>
              <v-card-subtitle class="pb-1">
                {{$t('personal_use')}}
              </v-card-subtitle>
              <v-progress-linear
                color="orange"
                rounded
                height="2"
                value="100"
              ></v-progress-linear>
              <v-card-text class="py-1 text-subtitle-1 text-center">
                <span><sup>{{currency}}</sup> {{bronzePrice}}</span>
                <sub class="orange--text text-subtitle-1 mx-1"><i>{{$t(monthly)}}</i></sub>
              </v-card-text>
              <v-row justify="center">
                <v-btn height="30" class="mx-auto mb-4 mt-2" color="orange" dark rounded width="180" @click="toPay('1')"  :loading="prossesOne">
                  <v-icon class="me-1" size="22">mdi-cart</v-icon>
                  {{$t("order_now")}}
                </v-btn>
              </v-row>
            </v-col>
            <v-col cols="12" sm="4">
              
              <v-card-title class="font-weight-bold text-h6">
                <!-- <div class="ribbon"><span>{{$t('best_option')}}</span></div> -->
                {{$t("premium")}}
              </v-card-title>
              <v-card-subtitle class="pb-1">
                {{$t("premium_use")}}
              </v-card-subtitle>
              <v-progress-linear
                color="orange"
                rounded
                height="2"
                value="100"
              ></v-progress-linear>
              <v-card-text class="py-1 text-subtitle-1 text-center">
                <span><sup>{{currency}}</sup> {{silverPrice}}</span>
                <sub class="orange--text text-subtitle-1 mx-1"><i>{{$t(monthly)}}</i></sub>
              </v-card-text>
              <v-row justify="center">
                <v-btn height="30" class="mx-auto mb-4 mt-2" color="orange" dark rounded width="180" @click="toPay('2')"  :loading="prossesTwo">
                  <v-icon class="me-1" size="22">mdi-cart</v-icon>
                  {{$t("order_now")}}
                </v-btn>
              </v-row>
            </v-col>
            <v-col cols="12" sm="4">
              
              <v-card-title class="font-weight-bold text-h6">
                {{$t('agency')}}
              </v-card-title>
              <v-card-subtitle class="pb-1">
                {{$t('agency_use')}}
              </v-card-subtitle>
              <v-progress-linear
                color="orange"
                rounded
                height="2"
                value="100"
              ></v-progress-linear>
              <v-card-text class="py-1 text-subtitle-1 text-center">
                <span><sup>{{currency}}</sup> {{goldPrice}}</span>
                <sub class="orange--text text-subtitle-1 mx-1"><i>{{$t(monthly)}}</i></sub>
              </v-card-text>
              <v-row justify="center">
                <v-btn height="30" class="mx-auto mb-4 mt-2" color="orange" dark rounded width="180" @click="toPay('3')"  :loading="prossesThree">
                  <v-icon class="me-1" size="22">mdi-cart</v-icon>
                  {{$t("order_now")}}
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
        <v-card flat class="mx-auto">
          <v-simple-table fixed-header class="plan-table" height="500">
        <template v-slot:default>
          <thead>
        <tr >
          <th class="text-left">
          </th>
          <th class="text-center text-subtitle-1">
            {{$t("personal")}}
            <v-card-text class="py-1 px-0 text-subtitle-1 text-center" v-if="isMobScreenPlan">
              <span><sup>{{currency}}</sup> {{bronzePrice}}</span>
            </v-card-text>
            <v-card-actions v-if="isMobScreenPlan" class="d-block mx-auto">
              <v-btn small rounded color="orange" dark @click="toPay('1')"  :loading="prossesOne">
                {{$t("order_small_btn")}}
              </v-btn>
            </v-card-actions>
          </th>
          <th class="text-center text-subtitle-1">
            {{$t("premium")}}
            <v-card-text class="py-1 px-0 text-subtitle-1 text-center" v-if="isMobScreenPlan">
              <span><sup>{{currency}}</sup> {{silverPrice}}</span>
            </v-card-text>
            <v-card-actions v-if="isMobScreenPlan" class="d-block mx-auto">
              <v-btn small rounded color="orange" dark @click="toPay('2')"  :loading="prossesTwo">
                {{$t("order_small_btn")}}
              </v-btn>
            </v-card-actions>
          </th>
          <th class="text-center text-subtitle-1">
            {{$t('agency')}}
            <v-card-text class="py-1 px-0 text-subtitle-1 text-center" v-if="isMobScreenPlan">
              <span><sup>{{currency}}</sup> {{goldPrice}}</span>
            </v-card-text>
            <v-card-actions v-if="isMobScreenPlan" class="d-block mx-auto">
              <v-btn small rounded color="orange" dark @click="toPay('3')"  :loading="prossesThree">
                {{$t("order_small_btn")}}
              </v-btn>
            </v-card-actions>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
        class="no-hover"
        v-for="item in planns.genral" :key="item.id"
        >
          <td v-html="$t(`dialog_types.${item.name}`)"></td>
          <td class="text-center px-1" style="width:140px !important">
            <v-icon
            v-if="item.thereIconOne"
                  size="18"
                  :color="item.colorIconOne"
                  class="grey lighten-3 me-2 pa-1 border-radius-circle text-center"
                  >{{item.planOne}}</v-icon
                >
            <span v-else :class="`${item.colorIconOne}--text text-center`">
              {{$t(item.planOne)}}
            </span>
          </td>
          <td class="text-center px-1"  style="width:140px !important">
            <v-icon
            v-if="item.thereIconTwo"
              size="18"
              :color="item.colorIconTwo"
              class="grey lighten-3 me-2 pa-1 border-radius-circle text-center"
              >{{item.planTwo}}</v-icon
                >
                <span v-else :class="`${item.colorIconTwo}--text text-center`">
              {{$t(item.planTwo)}}
            </span>
          </td>
          <td class="text-center px-1"  style="width:140px !important">
            <v-icon
                  v-if="item.thereIconThree"
                  size="18"
                  :color="item.colorIconThree"
                  class="grey lighten-3 me-2 pa-1 border-radius-circle text-center"
                  >{{item.planThree}}</v-icon
                >
                <span v-else :class="`${item.colorIconThree}--text text-center`">
              {{$t(item.planThree)}}
            </span>
          </td>
        </tr>
        <tr
        class="no-hover"
        v-for="item in planns.dialogs" :key="item.id"
        >
          <td v-html="$t(`dialog_types.${item.name}`)"></td>
          <td class="text-center px-1" style="width:140px !important">
            <v-icon
            v-if="item.thereIconOne"
                  size="18"
                  :color="item.colorIconOne"
                  class="grey lighten-3 me-2 pa-1 border-radius-circle text-center"
                  >{{item.planOne}}</v-icon
                >
            <span v-else :class="`${item.colorIconOne}--text text-center`">
              {{$t(item.planOne)}}
            </span>
          </td>
          <td class="text-center px-1" style="width:140px !important">
            <v-icon
            v-if="item.thereIconTwo"
              size="18"
              :color="item.colorIconTwo"
              class="grey lighten-3 me-2 pa-1 border-radius-circle text-center"
              >{{item.planTwo}}</v-icon
                >
                <span v-else :class="`${item.colorIconTwo}--text text-center`">
              {{$t(item.planTwo)}}
            </span>
          </td>
          <td class="text-center px-1" style="width:140px !important">
            <v-icon
                  v-if="item.thereIconThree"
                  size="18"
                  :color="item.colorIconThree"
                  class="grey lighten-3 me-2 pa-1 border-radius-circle text-center"
                  >{{item.planThree}}</v-icon
                >
                <span v-else :class="`${item.colorIconThree}--text text-center`">
              {{$t(item.planThree)}}
            </span>
          </td>
        </tr>
        <tr
        class="no-hover"
        v-for="item in planns.interactive" :key="item.id"
        >
          <td v-html="$t(`dialog_types.${item.name}`)"></td>
          <td class="text-center px-1" style="width:140px !important">
            <v-icon
            v-if="item.thereIconOne"
                  size="18"
                  :color="item.colorIconOne"
                  class="grey lighten-3 me-2 pa-1 border-radius-circle text-center"
                  >{{item.planOne}}</v-icon
                >
            <span v-else :class="`${item.colorIconOne}--text text-center`">
              {{$t(item.planOne)}}
            </span>
          </td>
          <td class="text-center px-1" style="width:140px !important">
            <v-icon
            v-if="item.thereIconTwo"
              size="18"
              :color="item.colorIconTwo"
              class="grey lighten-3 me-2 pa-1 border-radius-circle text-center"
              >{{item.planTwo}}</v-icon
                >
                <span v-else :class="`${item.colorIconTwo}--text text-center`">
              {{$t(item.planTwo)}}
            </span>
          </td>
          <td class="text-center px-1" style="width:140px !important">
            <v-icon
                  v-if="item.thereIconThree"
                  size="18"
                  :color="item.colorIconThree"
                  class="grey lighten-3 me-2 pa-1 border-radius-circle text-center"
                  >{{item.planThree}}</v-icon
                >
                <span v-else :class="`${item.colorIconThree}--text text-center`">
              {{$t(item.planThree)}}
            </span>
          </td>
        </tr>
      </tbody>
    </template>
        </v-simple-table>
        </v-card>
      </v-card>
  </div>
</template>
<script>
import { parsePhoneNumberFromString as parseMax } from "libphonenumber-js/max";
import i18n from '../plugins/i18n';
import { bus } from '../main';
import payment from '../mixins/httpHandler'
import overlay from '../components/cirlceOverlay.vue'
export default {
  components:{
    overlay
  },
  data() {
    return {
      planns:{
        genral:[
        {
          name: "unlimted_messages",
          planOne: "mdi-check",
          planTwo: "mdi-check",
          planThree: "mdi-check",
          colorIconOne: "green",
          colorIconTwo: "green",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        {
          name: "scenarios",
          planOne: "1",
          planTwo: "3",
          planThree: "5",
          colorIconOne: "orange",
          colorIconTwo: "orange",
          colorIconThree: "orange",
        },
        {
          name: "automated_answers",
          planOne: "level_1",
          planTwo: "level_3",
          planThree: "unlimited_level",
          colorIconOne: "orange",
          colorIconTwo: "orange",
          colorIconThree: "orange",
        },
        {
          name: `res_to_this_number`,
          planOne: "single_country",
          planTwo: "all_contries",
          planThree: "all_contries",
          colorIconOne: "orange",
          colorIconTwo: "orange",
          colorIconThree: "orange",
        },
        {
          name: "reports",
          planOne: "mdi-close",
          planTwo: "mdi-check",
          planThree: "mdi-check",
          colorIconOne: "red darken-4",
          colorIconTwo: "green",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        {
          name: "schedule_messages",
          planOne: "mdi-close",
          planTwo: "3",
          planThree: "6",
          colorIconOne: "red darken-4",
          colorIconTwo: "orange",
          colorIconThree: "orange",
          thereIconOne: true,
        },
        ],
        dialogs: [
        {
          name: "send_text",
          planOne: "mdi-check",
          planTwo: "mdi-check",
          planThree: "mdi-check",
          colorIconOne: "green",
          colorIconTwo: "green",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        {
          name: "send_vcard",
          planOne: "mdi-check",
          planTwo: "mdi-check",
          planThree: "mdi-check",
          colorIconOne: "green",
          colorIconTwo: "green",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        {
          name: "send_photo",
          planOne: "mdi-check",
          planTwo: "mdi-check",
          planThree: "mdi-check",
          colorIconOne: "green",
          colorIconTwo: "green",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        {
          name: "send_gps",
          planOne: "mdi-close",
          planTwo: "mdi-check",
          planThree: "mdi-check",
          colorIconOne: "red darken-4",
          colorIconTwo: "green",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        {
          name: "send_video",
          planOne: "mdi-close",
          planTwo: "mdi-check",
          planThree: "mdi-check",
          colorIconOne: "red darken-4",
          colorIconTwo: "green",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        {
          name: "send_tts_message",
          planOne: "mdi-close",
          planTwo: "mdi-close",
          planThree: "mdi-check",
          colorIconOne: "red darken-4",
          colorIconTwo: "red darken-4",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        {
          name: "send_audio",
          planOne: "mdi-close",
          planTwo: "mdi-close",
          planThree: "mdi-check",
          colorIconOne: "red darken-4",
          colorIconTwo: "red darken-4",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        // {
        //   name: "send_wordpress",
        //   planOne: "mdi-close",
        //   planTwo: "mdi-close",
        //   planThree: "mdi-check",
        //   colorIconOne: "red darken-4",
        //   colorIconTwo: "red darken-4",
        //   colorIconThree: "green",
        //   thereIconOne: true,
        //   thereIconTwo: true,
        //   thereIconThree: true,
        // },
        {
          name: "send_document",
          planOne: "mdi-close",
          planTwo: "mdi-close",
          planThree: "mdi-check",
          colorIconOne: "red darken-4",
          colorIconTwo: "red darken-4",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        }
        ],
        interactive: [
        {
          name: "ask_list",
          planOne: "mdi-close",
          planTwo: "mdi-check",
          planThree: "mdi-check",
          colorIconOne: "red darken-4",
          colorIconTwo: "green",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        {
          name: "ask_photo_reply",
          planOne: "mdi-close",
          planTwo: "mdi-check",
          planThree: "mdi-check",
          colorIconOne: "red darken-4",
          colorIconTwo: "green",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        {
          name: "ask_phone",
          planOne: "mdi-close",
          planTwo: "mdi-check",
          planThree: "mdi-check",
          colorIconOne: "red darken-4",
          colorIconTwo: "green",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        {
          name: "ask_contact",
          planOne: "mdi-close",
          planTwo: "mdi-check",
          planThree: "mdi-check",
          colorIconOne: "red darken-4",
          colorIconTwo: "green",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        {
          name: "ask_photo",
          planOne: "mdi-close",
          planTwo: "mdi-check",
          planThree: "mdi-check",
          colorIconOne: "red darken-4",
          colorIconTwo: "green",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        {
          name: "ask_text",
          planOne: "mdi-close",
          planTwo: "mdi-check",
          planThree: "mdi-check",
          colorIconOne: "red darken-4",
          colorIconTwo: "green",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        {
          name: "ask_email",
          planOne: "mdi-close",
          planTwo: "mdi-close",
          planThree: "mdi-check",
          colorIconOne: "red darken-4",
          colorIconTwo: "red darken-4",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        {
          name: "ask_audio",
          planOne: "mdi-close",
          planTwo: "mdi-close",
          planThree: "mdi-check",
          colorIconOne: "red darken-4",
          colorIconTwo: "red darken-4",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        {
          name: "ask_video",
          planOne: "mdi-close",
          planTwo: "mdi-close",
          planThree: "mdi-check",
          colorIconOne: "red darken-4",
          colorIconTwo: "red darken-4",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        {
          name: "ask_document",
          planOne: "mdi-close",
          planTwo: "mdi-close",
          planThree: "mdi-check",
          colorIconOne: "red darken-4",
          colorIconTwo: "red darken-4",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
        },
        {
          name: "ask_gps",
          planOne: "mdi-close",
          planTwo: "mdi-close",
          planThree: "mdi-check",
          colorIconOne: "red darken-4",
          colorIconTwo: "red darken-4",
          colorIconThree: "green",
          thereIconOne: true,
          thereIconTwo: true,
          thereIconThree: true,
          divider: true
        }
        ]
      },
      dialog: false,
      dialogCardError: "",
      dialogErrorRouter: "",
      dialogIcon: "",
      dialogTitle: "",
      dialogMainTitle: "",
      showSecondButton: true,
      oneMonth: "six_month",
      sixMonth: "month",
      switcherMargin: "me-auto transition",
      countery: "",
      arCountry:[
    {
        "code": "AD",
        "name": "أندورا",
        "dialCode": "+376"
    },
    {
        "code": "AE",
        "name": "الامارات العربية",
        "dialCode": "+971"
    },
    {
        "code": "AF",
        "name": "أفغانستان",
        "dialCode": "+93"
    },
    {
        "code": "AG",
        "name": "أنتيجوا وبربودا",
        "dialCode": "+1"
    },
    {
        "code": "AI",
        "name": "أنجويلا",
        "dialCode": "+1"
    },
    {
        "code": "AL",
        "name": "ألبانيا",
        "dialCode": "+355"
    },
    {
        "code": "AM",
        "name": "أرمينيا",
        "dialCode": "+374"
    },
    {
        "code": "AO",
        "name": "أنجولا",
        "dialCode": "+244"
    },
    {
        "code": "AQ",
        "name": "القطب الجنوبي",
        "dialCode": "+672"
    },
    {
        "code": "AR",
        "name": "الأرجنتين",
        "dialCode": "+54"
    },
    {
        "code": "AS",
        "name": "ساموا الأمريكية",
        "dialCode": "+1"
    },
    {
        "code": "AT",
        "name": "النمسا",
        "dialCode": "+43"
    },
    {
        "code": "AU",
        "name": "أستراليا",
        "dialCode": "+61"
    },
    {
        "code": "AW",
        "name": "آروبا",
        "dialCode": "+297"
    },
    {
        "code": "AX",
        "name": "جزر أولان",
        "dialCode": "+358"
    },
    {
        "code": "AZ",
        "name": "أذربيجان",
        "dialCode": "+994"
    },
    {
        "code": "BA",
        "name": "البوسنة والهرسك",
        "dialCode": "+387"
    },
    {
        "code": "BB",
        "name": "بربادوس",
        "dialCode": "+1"
    },
    {
        "code": "BD",
        "name": "بنجلاديش",
        "dialCode": "+880"
    },
    {
        "code": "BE",
        "name": "بلجيكا",
        "dialCode": "+32"
    },
    {
        "code": "BF",
        "name": "بوركينا فاسو",
        "dialCode": "+226"
    },
    {
        "code": "BG",
        "name": "بلغاريا",
        "dialCode": "+359"
    },
    {
        "code": "BH",
        "name": "البحرين",
        "dialCode": "+973"
    },
    {
        "code": "BI",
        "name": "بوروندي",
        "dialCode": "+257"
    },
    {
        "code": "BJ",
        "name": "بنين",
        "dialCode": "+229"
    },
    {
        "code": "BL",
        "name": "سان بارتيلمي",
        "dialCode": "+590"
    },
    {
        "code": "BM",
        "name": "برمودا",
        "dialCode": "+1"
    },
    {
        "code": "BN",
        "name": "بروناي",
        "dialCode": "+673"
    },
    {
        "code": "BO",
        "name": "بوليفيا",
        "dialCode": "+591"
    },
    {
        "code": "BQ",
        "name": "بونير",
        "dialCode": "+599"
    },
    {
        "code": "BR",
        "name": "البرازيل",
        "dialCode": "+55"
    },
    {
        "code": "BS",
        "name": "الباهاما",
        "dialCode": "+1"
    },
    {
        "code": "BT",
        "name": "بوتان",
        "dialCode": "+975"
    },
    {
        "code": "BV",
        "name": "جزيرة بوفيه",
        "dialCode": "+47"
    },
    {
        "code": "BW",
        "name": "بتسوانا",
        "dialCode": "+267"
    },
    {
        "code": "BY",
        "name": "روسيا البيضاء",
        "dialCode": "+375"
    },
    {
        "code": "BZ",
        "name": "بليز",
        "dialCode": "+501"
    },
    {
        "code": "CA",
        "name": "كندا",
        "dialCode": "+1"
    },
    {
        "code": "CC",
        "name": "جزر كوكوس",
        "dialCode": "+61"
    },
    {
        "code": "CD",
        "name": "الكونغو",
        "dialCode": "+243"
    },
    {
        "code": "CF",
        "name": "افريقيا الوسطى",
        "dialCode": "+236"
    },
    {
        "code": "CG",
        "name": "الكونغو - برازافيل",
        "dialCode": "+242"
    },
    {
        "code": "CH",
        "name": "سويسرا",
        "dialCode": "+41"
    },
    {
        "code": "CI",
        "name": "ساحل العاج",
        "dialCode": "+225"
    },
    {
        "code": "CK",
        "name": "جزر كوك",
        "dialCode": "+682"
    },
    {
        "code": "CL",
        "name": "شيلي",
        "dialCode": "+56"
    },
    {
        "code": "CM",
        "name": "الكاميرون",
        "dialCode": "+237"
    },
    {
        "code": "CN",
        "name": "الصين",
        "dialCode": "+86"
    },
    {
        "code": "CO",
        "name": "كولومبيا",
        "dialCode": "+57"
    },
    {
        "code": "CR",
        "name": "كوستاريكا",
        "dialCode": "+506"
    },
    {
        "code": "CU",
        "name": "كوبا",
        "dialCode": "+53"
    },
    {
        "code": "CV",
        "name": "الرأس الأخضر",
        "dialCode": "+238"
    },
    {
        "code": "CW",
        "name": "كوراساو",
        "dialCode": "+599"
    },
    {
        "code": "CX",
        "name": "جزيرة الكريسماس",
        "dialCode": "+61"
    },
    {
        "code": "CY",
        "name": "قبرص",
        "dialCode": "+357"
    },
    {
        "code": "CZ",
        "name": "جمهورية التشيك",
        "dialCode": "+420"
    },
    {
        "code": "DE",
        "name": "ألمانيا",
        "dialCode": "+49"
    },
    {
        "code": "DJ",
        "name": "جيبوتي",
        "dialCode": "+253"
    },
    {
        "code": "DK",
        "name": "الدانمرك",
        "dialCode": "+45"
    },
    {
        "code": "DM",
        "name": "دومينيكا",
        "dialCode": "+1"
    },
    {
        "code": "DO",
        "name": "جمهورية الدومينيك",
        "dialCode": "+1"
    },
    {
        "code": "DZ",
        "name": "الجزائر",
        "dialCode": "+213"
    },
    {
        "code": "EC",
        "name": "الاكوادور",
        "dialCode": "+593"
    },
    {
        "code": "EE",
        "name": "استونيا",
        "dialCode": "+372"
    },
    {
        "code": "EG",
        "name": "مصر",
        "dialCode": "+20"
    },
    {
        "code": "EH",
        "name": "الصحراء الغربية",
        "dialCode": "+212"
    },
    {
        "code": "ER",
        "name": "اريتريا",
        "dialCode": "+291"
    },
    {
        "code": "ES",
        "name": "أسبانيا",
        "dialCode": "+34"
    },
    {
        "code": "ET",
        "name": "اثيوبيا",
        "dialCode": "+251"
    },
    {
        "code": "FI",
        "name": "فنلندا",
        "dialCode": "+358"
    },
    {
        "code": "FJ",
        "name": "فيجي",
        "dialCode": "+679"
    },
    {
        "code": "FK",
        "name": "جزر فوكلاند",
        "dialCode": "+500"
    },
    {
        "code": "FM",
        "name": "ميكرونيزيا",
        "dialCode": "+691"
    },
    {
        "code": "FO",
        "name": "جزر فارو",
        "dialCode": "+298"
    },
    {
        "code": "FR",
        "name": "فرنسا",
        "dialCode": "+33"
    },
    {
        "code": "GA",
        "name": "الجابون",
        "dialCode": "+241"
    },
    {
        "code": "GB",
        "name": "المملكة المتحدة",
        "dialCode": "+44"
    },
    {
        "code": "GD",
        "name": "جرينادا",
        "dialCode": "+1"
    },
    {
        "code": "GE",
        "name": "جورجيا",
        "dialCode": "+995"
    },
    {
        "code": "GF",
        "name": "غويانا",
        "dialCode": "+594"
    },
    {
        "code": "GG",
        "name": "غيرنزي",
        "dialCode": "+44"
    },
    {
        "code": "GH",
        "name": "غانا",
        "dialCode": "+233"
    },
    {
        "code": "GI",
        "name": "جبل طارق",
        "dialCode": "+350"
    },
    {
        "code": "GL",
        "name": "جرينلاند",
        "dialCode": "+299"
    },
    {
        "code": "GM",
        "name": "غامبيا",
        "dialCode": "+220"
    },
    {
        "code": "GN",
        "name": "غينيا",
        "dialCode": "+224"
    },
    {
        "code": "GP",
        "name": "جوادلوب",
        "dialCode": "+590"
    },
    {
        "code": "GQ",
        "name": "غينيا الاستوائية",
        "dialCode": "+240"
    },
    {
        "code": "GR",
        "name": "اليونان",
        "dialCode": "+30"
    },
    {
        "code": "GS",
        "name": "جورجيا الجنوبية",
        "dialCode": "+500"
    },
    {
        "code": "GT",
        "name": "جواتيمالا",
        "dialCode": "+502"
    },
    {
        "code": "GU",
        "name": "جوام",
        "dialCode": "+1"
    },
    {
        "code": "GW",
        "name": "غينيا بيساو",
        "dialCode": "+245"
    },
    {
        "code": "GY",
        "name": "غيانا",
        "dialCode": "+595"
    },
    {
        "code": "HK",
        "name": "هونج كونج الصينية",
        "dialCode": "+852"
    },
    {
        "code": "HM",
        "name": "هيرد وماكدونالد",
        "dialCode": ""
    },
    {
        "code": "HN",
        "name": "هندوراس",
        "dialCode": "+504"
    },
    {
        "code": "HR",
        "name": "كرواتيا",
        "dialCode": "+385"
    },
    {
        "code": "HT",
        "name": "هايتي",
        "dialCode": "+509"
    },
    {
        "code": "HU",
        "name": "المجر",
        "dialCode": "+36"
    },
    {
        "code": "ID",
        "name": "اندونيسيا",
        "dialCode": "+62"
    },
    {
        "code": "IE",
        "name": "أيرلندا",
        "dialCode": "+353"
    },
    {
        "code": "IL",
        "name": "اسرائيل",
        "dialCode": "+972"
    },
    {
        "code": "IM",
        "name": "جزيرة مان",
        "dialCode": "+44"
    },
    {
        "code": "IN",
        "name": "الهند",
        "dialCode": "+91"
    },
    {
        "code": "IO",
        "name": "المحيط الهندي البريطاني",
        "dialCode": "+246"
    },
    {
        "code": "IQ",
        "name": "العراق",
        "dialCode": "+964"
    },
    {
        "code": "IR",
        "name": "ايران",
        "dialCode": "+98"
    },
    {
        "code": "IS",
        "name": "أيسلندا",
        "dialCode": "+354"
    },
    {
        "code": "IT",
        "name": "ايطاليا",
        "dialCode": "+39"
    },
    {
        "code": "JE",
        "name": "جيرسي",
        "dialCode": "+44"
    },
    {
        "code": "JM",
        "name": "جامايكا",
        "dialCode": "+1"
    },
    {
        "code": "JO",
        "name": "الأردن",
        "dialCode": "+962"
    },
    {
        "code": "JP",
        "name": "اليابان",
        "dialCode": "+81"
    },
    {
        "code": "KE",
        "name": "كينيا",
        "dialCode": "+254"
    },
    {
        "code": "KG",
        "name": "قرغيزستان",
        "dialCode": "+996"
    },
    {
        "code": "KH",
        "name": "كمبوديا",
        "dialCode": "+855"
    },
    {
        "code": "KI",
        "name": "كيريباتي",
        "dialCode": "+686"
    },
    {
        "code": "KM",
        "name": "جزر القمر",
        "dialCode": "+269"
    },
    {
        "code": "KN",
        "name": "سانت كيتس",
        "dialCode": "+1"
    },
    {
        "code": "KP",
        "name": "كوريا الشمالية",
        "dialCode": "+850"
    },
    {
        "code": "KR",
        "name": "كوريا الجنوبية",
        "dialCode": "+82"
    },
    {
        "code": "KW",
        "name": "الكويت",
        "dialCode": "+965"
    },
    {
        "code": "KY",
        "name": "جزر الكايمن",
        "dialCode": "+345"
    },
    {
        "code": "KZ",
        "name": "كازاخستان",
        "dialCode": "+7"
    },
    {
        "code": "LA",
        "name": "لاوس",
        "dialCode": "+856"
    },
    {
        "code": "LB",
        "name": "لبنان",
        "dialCode": "+961"
    },
    {
        "code": "LC",
        "name": "سانت لوسيا",
        "dialCode": "+1"
    },
    {
        "code": "LI",
        "name": "ليختنشتاين",
        "dialCode": "+423"
    },
    {
        "code": "LK",
        "name": "سريلانكا",
        "dialCode": "+94"
    },
    {
        "code": "LR",
        "name": "ليبيريا",
        "dialCode": "+231"
    },
    {
        "code": "LS",
        "name": "ليسوتو",
        "dialCode": "+266"
    },
    {
        "code": "LT",
        "name": "ليتوانيا",
        "dialCode": "+370"
    },
    {
        "code": "LU",
        "name": "لوكسمبورج",
        "dialCode": "+352"
    },
    {
        "code": "LV",
        "name": "لاتفيا",
        "dialCode": "+371"
    },
    {
        "code": "LY",
        "name": "ليبيا",
        "dialCode": "+218"
    },
    {
        "code": "MA",
        "name": "المغرب",
        "dialCode": "+212"
    },
    {
        "code": "MC",
        "name": "موناكو",
        "dialCode": "+377"
    },
    {
        "code": "MD",
        "name": "مولدافيا",
        "dialCode": "+373"
    },
    {
        "code": "ME",
        "name": "الجبل الأسود",
        "dialCode": "+382"
    },
    {
        "code": "MF",
        "name": "سانت مارتين",
        "dialCode": "+590"
    },
    {
        "code": "MG",
        "name": "مدغشقر",
        "dialCode": "+261"
    },
    {
        "code": "MH",
        "name": "جزر المارشال",
        "dialCode": "+692"
    },
    {
        "code": "MK",
        "name": "مقدونيا",
        "dialCode": "+389"
    },
    {
        "code": "ML",
        "name": "مالي",
        "dialCode": "+223"
    },
    {
        "code": "MM",
        "name": "ميانمار",
        "dialCode": "+95"
    },
    {
        "code": "MN",
        "name": "منغوليا",
        "dialCode": "+976"
    },
    {
        "code": "MO",
        "name": "ماكاو الصينية",
        "dialCode": "+853"
    },
    {
        "code": "MP",
        "name": "جزر ماريانا الشمالية",
        "dialCode": "+1"
    },
    {
        "code": "MQ",
        "name": "مارتينيك",
        "dialCode": "+596"
    },
    {
        "code": "MR",
        "name": "موريتانيا",
        "dialCode": "+222"
    },
    {
        "code": "MS",
        "name": "مونتسرات",
        "dialCode": "+1"
    },
    {
        "code": "MT",
        "name": "مالطا",
        "dialCode": "+356"
    },
    {
        "code": "MU",
        "name": "موريشيوس",
        "dialCode": "+230"
    },
    {
        "code": "MV",
        "name": "جزر الملديف",
        "dialCode": "+960"
    },
    {
        "code": "MW",
        "name": "ملاوي",
        "dialCode": "+265"
    },
    {
        "code": "MX",
        "name": "المكسيك",
        "dialCode": "+52"
    },
    {
        "code": "MY",
        "name": "ماليزيا",
        "dialCode": "+60"
    },
    {
        "code": "MZ",
        "name": "موزمبيق",
        "dialCode": "+258"
    },
    {
        "code": "NA",
        "name": "ناميبيا",
        "dialCode": "+264"
    },
    {
        "code": "NC",
        "name": "كاليدونيا الجديدة",
        "dialCode": "+687"
    },
    {
        "code": "NE",
        "name": "النيجر",
        "dialCode": "+227"
    },
    {
        "code": "NF",
        "name": "نورفوك",
        "dialCode": "+672"
    },
    {
        "code": "NG",
        "name": "نيجيريا",
        "dialCode": "+234"
    },
    {
        "code": "NI",
        "name": "نيكاراجوا",
        "dialCode": "+505"
    },
    {
        "code": "NL",
        "name": "هولندا",
        "dialCode": "+31"
    },
    {
        "code": "NO",
        "name": "النرويج",
        "dialCode": "+47"
    },
    {
        "code": "NP",
        "name": "نيبال",
        "dialCode": "+977"
    },
    {
        "code": "NR",
        "name": "نورو",
        "dialCode": "+674"
    },
    {
        "code": "NU",
        "name": "نيوي",
        "dialCode": "+683"
    },
    {
        "code": "NZ",
        "name": "نيوزيلاندا",
        "dialCode": "+64"
    },
    {
        "code": "OM",
        "name": "عمان",
        "dialCode": "+968"
    },
    {
        "code": "PA",
        "name": "بنما",
        "dialCode": "+507"
    },
    {
        "code": "PE",
        "name": "بيرو",
        "dialCode": "+51"
    },
    {
        "code": "PF",
        "name": "بولينيزيا الفرنسية",
        "dialCode": "+689"
    },
    {
        "code": "PG",
        "name": "بابوا غينيا الجديدة",
        "dialCode": "+675"
    },
    {
        "code": "PH",
        "name": "الفيلبين",
        "dialCode": "+63"
    },
    {
        "code": "PK",
        "name": "باكستان",
        "dialCode": "+92"
    },
    {
        "code": "PL",
        "name": "بولندا",
        "dialCode": "+48"
    },
    {
        "code": "PM",
        "name": "سانت بيير وميكولون",
        "dialCode": "+508"
    },
    {
        "code": "PN",
        "name": "بتكايرن",
        "dialCode": "+872"
    },
    {
        "code": "PR",
        "name": "بورتوريكو",
        "dialCode": "+1"
    },
    {
        "code": "PS",
        "name": "فلسطين",
        "dialCode": "+970"
    },
    {
        "code": "PT",
        "name": "البرتغال",
        "dialCode": "+351"
    },
    {
        "code": "PW",
        "name": "بالاو",
        "dialCode": "+680"
    },
    {
        "code": "PY",
        "name": "باراجواي",
        "dialCode": "+595"
    },
    {
        "code": "QA",
        "name": "قطر",
        "dialCode": "+974"
    },
    {
        "code": "RE",
        "name": "روينيون",
        "dialCode": "+262"
    },
    {
        "code": "RO",
        "name": "رومانيا",
        "dialCode": "+40"
    },
    {
        "code": "RS",
        "name": "صربيا",
        "dialCode": "+381"
    },
    {
        "code": "RU",
        "name": "روسيا",
        "dialCode": "+7"
    },
    {
        "code": "RW",
        "name": "رواندا",
        "dialCode": "+250"
    },
    {
        "code": "SA",
        "name": "السعودية",
        "dialCode": "+966"
    },
    {
        "code": "SB",
        "name": "جزر سليمان",
        "dialCode": "+677"
    },
    {
        "code": "SC",
        "name": "سيشل",
        "dialCode": "+248"
    },
    {
        "code": "SD",
        "name": "السودان",
        "dialCode": "+249"
    },
    {
        "code": "SE",
        "name": "السويد",
        "dialCode": "+46"
    },
    {
        "code": "SG",
        "name": "سنغافورة",
        "dialCode": "+65"
    },
    {
        "code": "SH",
        "name": "سانت هيلنا",
        "dialCode": "+290"
    },
    {
        "code": "SI",
        "name": "سلوفينيا",
        "dialCode": "+386"
    },
    {
        "code": "SJ",
        "name": "سفالبارد وجان مايان",
        "dialCode": "+47"
    },
    {
        "code": "SK",
        "name": "سلوفاكيا",
        "dialCode": "+421"
    },
    {
        "code": "SL",
        "name": "سيراليون",
        "dialCode": "+232"
    },
    {
        "code": "SM",
        "name": "سان مارينو",
        "dialCode": "+378"
    },
    {
        "code": "SN",
        "name": "السنغال",
        "dialCode": "+221"
    },
    {
        "code": "SO",
        "name": "الصومال",
        "dialCode": "+252"
    },
    {
        "code": "SR",
        "name": "سورينام",
        "dialCode": "+597"
    },
    {
        "code": "SS",
        "name": "جنوب السودان",
        "dialCode": "+211"
    },
    {
        "code": "ST",
        "name": "ساو تومي وبرينسيبي",
        "dialCode": "+239"
    },
    {
        "code": "SV",
        "name": "السلفادور",
        "dialCode": "+503"
    },
    {
        "code": "SX",
        "name": "سينت مارتن",
        "dialCode": "+1"
    },
    {
        "code": "SY",
        "name": "سوريا",
        "dialCode": "+963"
    },
    {
        "code": "SZ",
        "name": "سوازيلاند",
        "dialCode": "+268"
    },
    {
        "code": "TC",
        "name": "جزر الترك وجايكوس",
        "dialCode": "+1"
    },
    {
        "code": "TD",
        "name": "تشاد",
        "dialCode": "+235"
    },
    {
        "code": "TF",
        "name": "المقاطعات الفرنسية",
        "dialCode": "+262"
    },
    {
        "code": "TG",
        "name": "توجو",
        "dialCode": "+228"
    },
    {
        "code": "TH",
        "name": "تايلند",
        "dialCode": "+66"
    },
    {
        "code": "TJ",
        "name": "طاجكستان",
        "dialCode": "+992"
    },
    {
        "code": "TK",
        "name": "توكيلو",
        "dialCode": "+690"
    },
    {
        "code": "TL",
        "name": "تيمور الشرقية",
        "dialCode": "+670"
    },
    {
        "code": "TM",
        "name": "تركمانستان",
        "dialCode": "+993"
    },
    {
        "code": "TN",
        "name": "تونس",
        "dialCode": "+216"
    },
    {
        "code": "TO",
        "name": "تونجا",
        "dialCode": "+676"
    },
    {
        "code": "TR",
        "name": "تركيا",
        "dialCode": "+90"
    },
    {
        "code": "TT",
        "name": "ترينيداد وتوباغو",
        "dialCode": "+1"
    },
    {
        "code": "TV",
        "name": "توفالو",
        "dialCode": "+688"
    },
    {
        "code": "TW",
        "name": "تايوان",
        "dialCode": "+886"
    },
    {
        "code": "TZ",
        "name": "تانزانيا",
        "dialCode": "+255"
    },
    {
        "code": "UA",
        "name": "أوكرانيا",
        "dialCode": "+380"
    },
    {
        "code": "UG",
        "name": "أوغندا",
        "dialCode": "+256"
    },
    {
        "code": "UM",
        "name": "جزر الأمريكية",
        "dialCode": ""
    },
    {
        "code": "US",
        "name": "أمريكا",
        "dialCode": "+1"
    },
    {
        "code": "UY",
        "name": "أورجواي",
        "dialCode": "+598"
    },
    {
        "code": "UZ",
        "name": "أوزبكستان",
        "dialCode": "+998"
    },
    {
        "code": "VA",
        "name": "الفاتيكان",
        "dialCode": "+379"
    },
    {
        "code": "VC",
        "name": "سانت فنسنت وغرنادين",
        "dialCode": "+1"
    },
    {
        "code": "VE",
        "name": "فنزويلا",
        "dialCode": "+58"
    },
    {
        "code": "VG",
        "name": "فرجين البريطانية",
        "dialCode": "+1"
    },
    {
        "code": "VI",
        "name": "فرجين الأمريكية",
        "dialCode": "+1"
    },
    {
        "code": "VN",
        "name": "فيتنام",
        "dialCode": "+84"
    },
    {
        "code": "VU",
        "name": "فانواتو",
        "dialCode": "+678"
    },
    {
        "code": "WF",
        "name": "والس وفوتونا",
        "dialCode": "+681"
    },
    {
        "code": "WS",
        "name": "ساموا",
        "dialCode": "+685"
    },
    {
        "code": "XK",
        "name": "كوسوفو",
        "dialCode": "+383"
    },
    {
        "code": "YE",
        "name": "اليمن",
        "dialCode": "+967"
    },
    {
        "code": "YT",
        "name": "مايوت",
        "dialCode": "+262"
    },
    {
        "code": "ZA",
        "name": "جنوب افريقيا",
        "dialCode": "+27"
    },
    {
        "code": "ZM",
        "name": "زامبيا",
        "dialCode": "+260"
    },
    {
        "code": "ZW",
        "name": "زيمبابوي",
        "dialCode": "+263"
    }
],
      counteryCode: [
        {
          code: "AC",
          unicode: "U+1F1E6 U+1F1E8",
          name: "Ascension Island",
          emoji: "🇦🇨",
        },
        {
          code: "AD",
          unicode: "U+1F1E6 U+1F1E9",
          name: "Andorra",
          emoji: "🇦🇩",
        },
        {
          code: "AE",
          unicode: "U+1F1E6 U+1F1EA",
          name: "United Arab Emirates",
          emoji: "🇦🇪",
        },
        {
          code: "AF",
          unicode: "U+1F1E6 U+1F1EB",
          name: "Afghanistan",
          emoji: "🇦🇫",
        },
        {
          code: "AG",
          unicode: "U+1F1E6 U+1F1EC",
          name: "Antigua & Barbuda",
          emoji: "🇦🇬",
        },
        {
          code: "AI",
          unicode: "U+1F1E6 U+1F1EE",
          name: "Anguilla",
          emoji: "🇦🇮",
        },
        {
          code: "AL",
          unicode: "U+1F1E6 U+1F1F1",
          name: "Albania",
          emoji: "🇦🇱",
        },
        {
          code: "AM",
          unicode: "U+1F1E6 U+1F1F2",
          name: "Armenia",
          emoji: "🇦🇲",
        },
        {
          code: "AO",
          unicode: "U+1F1E6 U+1F1F4",
          name: "Angola",
          emoji: "🇦🇴",
        },
        {
          code: "AQ",
          unicode: "U+1F1E6 U+1F1F6",
          name: "Antarctica",
          emoji: "🇦🇶",
        },
        {
          code: "AR",
          unicode: "U+1F1E6 U+1F1F7",
          name: "Argentina",
          emoji: "🇦🇷",
        },
        {
          code: "AS",
          unicode: "U+1F1E6 U+1F1F8",
          name: "American Samoa",
          emoji: "🇦🇸",
        },
        {
          code: "AT",
          unicode: "U+1F1E6 U+1F1F9",
          name: "Austria",
          emoji: "🇦🇹",
        },
        {
          code: "AU",
          unicode: "U+1F1E6 U+1F1FA",
          name: "Australia",
          emoji: "🇦🇺",
        },
        {
          code: "AW",
          unicode: "U+1F1E6 U+1F1FC",
          name: "Aruba",
          emoji: "🇦🇼",
        },
        {
          code: "AX",
          unicode: "U+1F1E6 U+1F1FD",
          name: "Åland Islands",
          emoji: "🇦🇽",
        },
        {
          code: "AZ",
          unicode: "U+1F1E6 U+1F1FF",
          name: "Azerbaijan",
          emoji: "🇦🇿",
        },
        {
          code: "BA",
          unicode: "U+1F1E7 U+1F1E6",
          name: "Bosnia & Herzegovina",
          emoji: "🇧🇦",
        },
        {
          code: "BB",
          unicode: "U+1F1E7 U+1F1E7",
          name: "Barbados",
          emoji: "🇧🇧",
        },
        {
          code: "BD",
          unicode: "U+1F1E7 U+1F1E9",
          name: "Bangladesh",
          emoji: "🇧🇩",
        },
        {
          code: "BE",
          unicode: "U+1F1E7 U+1F1EA",
          name: "Belgium",
          emoji: "🇧🇪",
        },
        {
          code: "BF",
          unicode: "U+1F1E7 U+1F1EB",
          name: "Burkina Faso",
          emoji: "🇧🇫",
        },
        {
          code: "BG",
          unicode: "U+1F1E7 U+1F1EC",
          name: "Bulgaria",
          emoji: "🇧🇬",
        },
        {
          code: "BH",
          unicode: "U+1F1E7 U+1F1ED",
          name: "Bahrain",
          emoji: "🇧🇭",
        },
        {
          code: "BI",
          unicode: "U+1F1E7 U+1F1EE",
          name: "Burundi",
          emoji: "🇧🇮",
        },
        {
          code: "BJ",
          unicode: "U+1F1E7 U+1F1EF",
          name: "Benin",
          emoji: "🇧🇯",
        },
        {
          code: "BL",
          unicode: "U+1F1E7 U+1F1F1",
          name: "St. Barthélemy",
          emoji: "🇧🇱",
        },
        {
          code: "BM",
          unicode: "U+1F1E7 U+1F1F2",
          name: "Bermuda",
          emoji: "🇧🇲",
        },
        {
          code: "BN",
          unicode: "U+1F1E7 U+1F1F3",
          name: "Brunei",
          emoji: "🇧🇳",
        },
        {
          code: "BO",
          unicode: "U+1F1E7 U+1F1F4",
          name: "Bolivia",
          emoji: "🇧🇴",
        },
        {
          code: "BQ",
          unicode: "U+1F1E7 U+1F1F6",
          name: "Caribbean Netherlands",
          emoji: "🇧🇶",
        },
        {
          code: "BR",
          unicode: "U+1F1E7 U+1F1F7",
          name: "Brazil",
          emoji: "🇧🇷",
        },
        {
          code: "BS",
          unicode: "U+1F1E7 U+1F1F8",
          name: "Bahamas",
          emoji: "🇧🇸",
        },
        {
          code: "BT",
          unicode: "U+1F1E7 U+1F1F9",
          name: "Bhutan",
          emoji: "🇧🇹",
        },
        {
          code: "BV",
          unicode: "U+1F1E7 U+1F1FB",
          name: "Bouvet Island",
          emoji: "🇧🇻",
        },
        {
          code: "BW",
          unicode: "U+1F1E7 U+1F1FC",
          name: "Botswana",
          emoji: "🇧🇼",
        },
        {
          code: "BY",
          unicode: "U+1F1E7 U+1F1FE",
          name: "Belarus",
          emoji: "🇧🇾",
        },
        {
          code: "BZ",
          unicode: "U+1F1E7 U+1F1FF",
          name: "Belize",
          emoji: "🇧🇿",
        },
        {
          code: "CA",
          unicode: "U+1F1E8 U+1F1E6",
          name: "Canada",
          emoji: "🇨🇦",
        },
        {
          code: "CC",
          unicode: "U+1F1E8 U+1F1E8",
          name: "Cocos (Keeling) Islands",
          emoji: "🇨🇨",
        },
        {
          code: "CD",
          unicode: "U+1F1E8 U+1F1E9",
          name: "Congo - Kinshasa",
          emoji: "🇨🇩",
        },
        {
          code: "CF",
          unicode: "U+1F1E8 U+1F1EB",
          name: "Central African Republic",
          emoji: "🇨🇫",
        },
        {
          code: "CG",
          unicode: "U+1F1E8 U+1F1EC",
          name: "Congo - Brazzaville",
          emoji: "🇨🇬",
        },
        {
          code: "CH",
          unicode: "U+1F1E8 U+1F1ED",
          name: "Switzerland",
          emoji: "🇨🇭",
        },
        {
          code: "CI",
          unicode: "U+1F1E8 U+1F1EE",
          name: "Côte d’Ivoire",
          emoji: "🇨🇮",
        },
        {
          code: "CK",
          unicode: "U+1F1E8 U+1F1F0",
          name: "Cook Islands",
          emoji: "🇨🇰",
        },
        {
          code: "CL",
          unicode: "U+1F1E8 U+1F1F1",
          name: "Chile",
          emoji: "🇨🇱",
        },
        {
          code: "CM",
          unicode: "U+1F1E8 U+1F1F2",
          name: "Cameroon",
          emoji: "🇨🇲",
        },
        {
          code: "CN",
          unicode: "U+1F1E8 U+1F1F3",
          name: "China",
          emoji: "🇨🇳",
        },
        {
          code: "CO",
          unicode: "U+1F1E8 U+1F1F4",
          name: "Colombia",
          emoji: "🇨🇴",
        },
        {
          code: "CP",
          unicode: "U+1F1E8 U+1F1F5",
          name: "Clipperton Island",
          emoji: "🇨🇵",
        },
        {
          code: "CR",
          unicode: "U+1F1E8 U+1F1F7",
          name: "Costa Rica",
          emoji: "🇨🇷",
        },
        {
          code: "CU",
          unicode: "U+1F1E8 U+1F1FA",
          name: "Cuba",
          emoji: "🇨🇺",
        },
        {
          code: "CV",
          unicode: "U+1F1E8 U+1F1FB",
          name: "Cape Verde",
          emoji: "🇨🇻",
        },
        {
          code: "CW",
          unicode: "U+1F1E8 U+1F1FC",
          name: "Curaçao",
          emoji: "🇨🇼",
        },
        {
          code: "CX",
          unicode: "U+1F1E8 U+1F1FD",
          name: "Christmas Island",
          emoji: "🇨🇽",
        },
        {
          code: "CY",
          unicode: "U+1F1E8 U+1F1FE",
          name: "Cyprus",
          emoji: "🇨🇾",
        },
        {
          code: "CZ",
          unicode: "U+1F1E8 U+1F1FF",
          name: "Czechia",
          emoji: "🇨🇿",
        },
        {
          code: "DE",
          unicode: "U+1F1E9 U+1F1EA",
          name: "Germany",
          emoji: "🇩🇪",
        },
        {
          code: "DG",
          unicode: "U+1F1E9 U+1F1EC",
          name: "Diego Garcia",
          emoji: "🇩🇬",
        },
        {
          code: "DJ",
          unicode: "U+1F1E9 U+1F1EF",
          name: "Djibouti",
          emoji: "🇩🇯",
        },
        {
          code: "DK",
          unicode: "U+1F1E9 U+1F1F0",
          name: "Denmark",
          emoji: "🇩🇰",
        },
        {
          code: "DM",
          unicode: "U+1F1E9 U+1F1F2",
          name: "Dominica",
          emoji: "🇩🇲",
        },
        {
          code: "DO",
          unicode: "U+1F1E9 U+1F1F4",
          name: "Dominican Republic",
          emoji: "🇩🇴",
        },
        {
          code: "DZ",
          unicode: "U+1F1E9 U+1F1FF",
          name: "Algeria",
          emoji: "🇩🇿",
        },
        {
          code: "EA",
          unicode: "U+1F1EA U+1F1E6",
          name: "Ceuta & Melilla",
          emoji: "🇪🇦",
        },
        {
          code: "EC",
          unicode: "U+1F1EA U+1F1E8",
          name: "Ecuador",
          emoji: "🇪🇨",
        },
        {
          code: "EE",
          unicode: "U+1F1EA U+1F1EA",
          name: "Estonia",
          emoji: "🇪🇪",
        },
        {
          code: "EG",
          unicode: "U+1F1EA U+1F1EC",
          name: "Egypt",
          emoji: "🇪🇬",
        },
        {
          code: "EH",
          unicode: "U+1F1EA U+1F1ED",
          name: "Western Sahara",
          emoji: "🇪🇭",
        },
        {
          code: "ER",
          unicode: "U+1F1EA U+1F1F7",
          name: "Eritrea",
          emoji: "🇪🇷",
        },
        {
          code: "ES",
          unicode: "U+1F1EA U+1F1F8",
          name: "Spain",
          emoji: "🇪🇸",
        },
        {
          code: "ET",
          unicode: "U+1F1EA U+1F1F9",
          name: "Ethiopia",
          emoji: "🇪🇹",
        },
        {
          code: "EU",
          unicode: "U+1F1EA U+1F1FA",
          name: "European Union",
          emoji: "🇪🇺",
        },
        {
          code: "FI",
          unicode: "U+1F1EB U+1F1EE",
          name: "Finland",
          emoji: "🇫🇮",
        },
        {
          code: "FJ",
          unicode: "U+1F1EB U+1F1EF",
          name: "Fiji",
          emoji: "🇫🇯",
        },
        {
          code: "FK",
          unicode: "U+1F1EB U+1F1F0",
          name: "Falkland Islands",
          emoji: "🇫🇰",
        },
        {
          code: "FM",
          unicode: "U+1F1EB U+1F1F2",
          name: "Micronesia",
          emoji: "🇫🇲",
        },
        {
          code: "FO",
          unicode: "U+1F1EB U+1F1F4",
          name: "Faroe Islands",
          emoji: "🇫🇴",
        },
        {
          code: "FR",
          unicode: "U+1F1EB U+1F1F7",
          name: "France",
          emoji: "🇫🇷",
        },
        {
          code: "GA",
          unicode: "U+1F1EC U+1F1E6",
          name: "Gabon",
          emoji: "🇬🇦",
        },
        {
          code: "GB",
          unicode: "U+1F1EC U+1F1E7",
          name: "United Kingdom",
          emoji: "🇬🇧",
        },
        {
          code: "GD",
          unicode: "U+1F1EC U+1F1E9",
          name: "Grenada",
          emoji: "🇬🇩",
        },
        {
          code: "GE",
          unicode: "U+1F1EC U+1F1EA",
          name: "Georgia",
          emoji: "🇬🇪",
        },
        {
          code: "GF",
          unicode: "U+1F1EC U+1F1EB",
          name: "French Guiana",
          emoji: "🇬🇫",
        },
        {
          code: "GG",
          unicode: "U+1F1EC U+1F1EC",
          name: "Guernsey",
          emoji: "🇬🇬",
        },
        {
          code: "GH",
          unicode: "U+1F1EC U+1F1ED",
          name: "Ghana",
          emoji: "🇬🇭",
        },
        {
          code: "GI",
          unicode: "U+1F1EC U+1F1EE",
          name: "Gibraltar",
          emoji: "🇬🇮",
        },
        {
          code: "GL",
          unicode: "U+1F1EC U+1F1F1",
          name: "Greenland",
          emoji: "🇬🇱",
        },
        {
          code: "GM",
          unicode: "U+1F1EC U+1F1F2",
          name: "Gambia",
          emoji: "🇬🇲",
        },
        {
          code: "GN",
          unicode: "U+1F1EC U+1F1F3",
          name: "Guinea",
          emoji: "🇬🇳",
        },
        {
          code: "GP",
          unicode: "U+1F1EC U+1F1F5",
          name: "Guadeloupe",
          emoji: "🇬🇵",
        },
        {
          code: "GQ",
          unicode: "U+1F1EC U+1F1F6",
          name: "Equatorial Guinea",
          emoji: "🇬🇶",
        },
        {
          code: "GR",
          unicode: "U+1F1EC U+1F1F7",
          name: "Greece",
          emoji: "🇬🇷",
        },
        {
          code: "GS",
          unicode: "U+1F1EC U+1F1F8",
          name: "South Georgia & South Sandwich Islands",
          emoji: "🇬🇸",
        },
        {
          code: "GT",
          unicode: "U+1F1EC U+1F1F9",
          name: "Guatemala",
          emoji: "🇬🇹",
        },
        {
          code: "GU",
          unicode: "U+1F1EC U+1F1FA",
          name: "Guam",
          emoji: "🇬🇺",
        },
        {
          code: "GW",
          unicode: "U+1F1EC U+1F1FC",
          name: "Guinea-Bissau",
          emoji: "🇬🇼",
        },
        {
          code: "GY",
          unicode: "U+1F1EC U+1F1FE",
          name: "Guyana",
          emoji: "🇬🇾",
        },
        {
          code: "HK",
          unicode: "U+1F1ED U+1F1F0",
          name: "Hong Kong SAR China",
          emoji: "🇭🇰",
        },
        {
          code: "HM",
          unicode: "U+1F1ED U+1F1F2",
          name: "Heard & McDonald Islands",
          emoji: "🇭🇲",
        },
        {
          code: "HN",
          unicode: "U+1F1ED U+1F1F3",
          name: "Honduras",
          emoji: "🇭🇳",
        },
        {
          code: "HR",
          unicode: "U+1F1ED U+1F1F7",
          name: "Croatia",
          emoji: "🇭🇷",
        },
        {
          code: "HT",
          unicode: "U+1F1ED U+1F1F9",
          name: "Haiti",
          emoji: "🇭🇹",
        },
        {
          code: "HU",
          unicode: "U+1F1ED U+1F1FA",
          name: "Hungary",
          emoji: "🇭🇺",
        },
        {
          code: "IC",
          unicode: "U+1F1EE U+1F1E8",
          name: "Canary Islands",
          emoji: "🇮🇨",
        },
        {
          code: "ID",
          unicode: "U+1F1EE U+1F1E9",
          name: "Indonesia",
          emoji: "🇮🇩",
        },
        {
          code: "IE",
          unicode: "U+1F1EE U+1F1EA",
          name: "Ireland",
          emoji: "🇮🇪",
        },
        {
          code: "IL",
          unicode: "U+1F1EE U+1F1F1",
          name: "Israel",
          emoji: "🇮🇱",
        },
        {
          code: "IM",
          unicode: "U+1F1EE U+1F1F2",
          name: "Isle of Man",
          emoji: "🇮🇲",
        },
        {
          code: "IN",
          unicode: "U+1F1EE U+1F1F3",
          name: "India",
          emoji: "🇮🇳",
        },
        {
          code: "IO",
          unicode: "U+1F1EE U+1F1F4",
          name: "British Indian Ocean Territory",
          emoji: "🇮🇴",
        },
        {
          code: "IQ",
          unicode: "U+1F1EE U+1F1F6",
          name: "Iraq",
          emoji: "🇮🇶",
        },
        {
          code: "IR",
          unicode: "U+1F1EE U+1F1F7",
          name: "Iran",
          emoji: "🇮🇷",
        },
        {
          code: "IS",
          unicode: "U+1F1EE U+1F1F8",
          name: "Iceland",
          emoji: "🇮🇸",
        },
        {
          code: "IT",
          unicode: "U+1F1EE U+1F1F9",
          name: "Italy",
          emoji: "🇮🇹",
        },
        {
          code: "JE",
          unicode: "U+1F1EF U+1F1EA",
          name: "Jersey",
          emoji: "🇯🇪",
        },
        {
          code: "JM",
          unicode: "U+1F1EF U+1F1F2",
          name: "Jamaica",
          emoji: "🇯🇲",
        },
        {
          code: "JO",
          unicode: "U+1F1EF U+1F1F4",
          name: "Jordan",
          emoji: "🇯🇴",
        },
        {
          code: "JP",
          unicode: "U+1F1EF U+1F1F5",
          name: "Japan",
          emoji: "🇯🇵",
        },
        {
          code: "KE",
          unicode: "U+1F1F0 U+1F1EA",
          name: "Kenya",
          emoji: "🇰🇪",
        },
        {
          code: "KG",
          unicode: "U+1F1F0 U+1F1EC",
          name: "Kyrgyzstan",
          emoji: "🇰🇬",
        },
        {
          code: "KH",
          unicode: "U+1F1F0 U+1F1ED",
          name: "Cambodia",
          emoji: "🇰🇭",
        },
        {
          code: "KI",
          unicode: "U+1F1F0 U+1F1EE",
          name: "Kiribati",
          emoji: "🇰🇮",
        },
        {
          code: "KM",
          unicode: "U+1F1F0 U+1F1F2",
          name: "Comoros",
          emoji: "🇰🇲",
        },
        {
          code: "KN",
          unicode: "U+1F1F0 U+1F1F3",
          name: "St. Kitts & Nevis",
          emoji: "🇰🇳",
        },
        {
          code: "KP",
          unicode: "U+1F1F0 U+1F1F5",
          name: "North Korea",
          emoji: "🇰🇵",
        },
        {
          code: "KR",
          unicode: "U+1F1F0 U+1F1F7",
          name: "South Korea",
          emoji: "🇰🇷",
        },
        {
          code: "KW",
          unicode: "U+1F1F0 U+1F1FC",
          name: "Kuwait",
          emoji: "🇰🇼",
        },
        {
          code: "KY",
          unicode: "U+1F1F0 U+1F1FE",
          name: "Cayman Islands",
          emoji: "🇰🇾",
        },
        {
          code: "KZ",
          unicode: "U+1F1F0 U+1F1FF",
          name: "Kazakhstan",
          emoji: "🇰🇿",
        },
        {
          code: "LA",
          unicode: "U+1F1F1 U+1F1E6",
          name: "Laos",
          emoji: "🇱🇦",
        },
        {
          code: "LB",
          unicode: "U+1F1F1 U+1F1E7",
          name: "Lebanon",
          emoji: "🇱🇧",
        },
        {
          code: "LC",
          unicode: "U+1F1F1 U+1F1E8",
          name: "St. Lucia",
          emoji: "🇱🇨",
        },
        {
          code: "LI",
          unicode: "U+1F1F1 U+1F1EE",
          name: "Liechtenstein",
          emoji: "🇱🇮",
        },
        {
          code: "LK",
          unicode: "U+1F1F1 U+1F1F0",
          name: "Sri Lanka",
          emoji: "🇱🇰",
        },
        {
          code: "LR",
          unicode: "U+1F1F1 U+1F1F7",
          name: "Liberia",
          emoji: "🇱🇷",
        },
        {
          code: "LS",
          unicode: "U+1F1F1 U+1F1F8",
          name: "Lesotho",
          emoji: "🇱🇸",
        },
        {
          code: "LT",
          unicode: "U+1F1F1 U+1F1F9",
          name: "Lithuania",
          emoji: "🇱🇹",
        },
        {
          code: "LU",
          unicode: "U+1F1F1 U+1F1FA",
          name: "Luxembourg",
          emoji: "🇱🇺",
        },
        {
          code: "LV",
          unicode: "U+1F1F1 U+1F1FB",
          name: "Latvia",
          emoji: "🇱🇻",
        },
        {
          code: "LY",
          unicode: "U+1F1F1 U+1F1FE",
          name: "Libya",
          emoji: "🇱🇾",
        },
        {
          code: "MA",
          unicode: "U+1F1F2 U+1F1E6",
          name: "Morocco",
          emoji: "🇲🇦",
        },
        {
          code: "MC",
          unicode: "U+1F1F2 U+1F1E8",
          name: "Monaco",
          emoji: "🇲🇨",
        },
        {
          code: "MD",
          unicode: "U+1F1F2 U+1F1E9",
          name: "Moldova",
          emoji: "🇲🇩",
        },
        {
          code: "ME",
          unicode: "U+1F1F2 U+1F1EA",
          name: "Montenegro",
          emoji: "🇲🇪",
        },
        {
          code: "MF",
          unicode: "U+1F1F2 U+1F1EB",
          name: "St. Martin",
          emoji: "🇲🇫",
        },
        {
          code: "MG",
          unicode: "U+1F1F2 U+1F1EC",
          name: "Madagascar",
          emoji: "🇲🇬",
        },
        {
          code: "MH",
          unicode: "U+1F1F2 U+1F1ED",
          name: "Marshall Islands",
          emoji: "🇲🇭",
        },
        {
          code: "MK",
          unicode: "U+1F1F2 U+1F1F0",
          name: "Macedonia",
          emoji: "🇲🇰",
        },
        {
          code: "ML",
          unicode: "U+1F1F2 U+1F1F1",
          name: "Mali",
          emoji: "🇲🇱",
        },
        {
          code: "MM",
          unicode: "U+1F1F2 U+1F1F2",
          name: "Myanmar (Burma)",
          emoji: "🇲🇲",
        },
        {
          code: "MN",
          unicode: "U+1F1F2 U+1F1F3",
          name: "Mongolia",
          emoji: "🇲🇳",
        },
        {
          code: "MO",
          unicode: "U+1F1F2 U+1F1F4",
          name: "Macau SAR China",
          emoji: "🇲🇴",
        },
        {
          code: "MP",
          unicode: "U+1F1F2 U+1F1F5",
          name: "Northern Mariana Islands",
          emoji: "🇲🇵",
        },
        {
          code: "MQ",
          unicode: "U+1F1F2 U+1F1F6",
          name: "Martinique",
          emoji: "🇲🇶",
        },
        {
          code: "MR",
          unicode: "U+1F1F2 U+1F1F7",
          name: "Mauritania",
          emoji: "🇲🇷",
        },
        {
          code: "MS",
          unicode: "U+1F1F2 U+1F1F8",
          name: "Montserrat",
          emoji: "🇲🇸",
        },
        {
          code: "MT",
          unicode: "U+1F1F2 U+1F1F9",
          name: "Malta",
          emoji: "🇲🇹",
        },
        {
          code: "MU",
          unicode: "U+1F1F2 U+1F1FA",
          name: "Mauritius",
          emoji: "🇲🇺",
        },
        {
          code: "MV",
          unicode: "U+1F1F2 U+1F1FB",
          name: "Maldives",
          emoji: "🇲🇻",
        },
        {
          code: "MW",
          unicode: "U+1F1F2 U+1F1FC",
          name: "Malawi",
          emoji: "🇲🇼",
        },
        {
          code: "MX",
          unicode: "U+1F1F2 U+1F1FD",
          name: "Mexico",
          emoji: "🇲🇽",
        },
        {
          code: "MY",
          unicode: "U+1F1F2 U+1F1FE",
          name: "Malaysia",
          emoji: "🇲🇾",
        },
        {
          code: "MZ",
          unicode: "U+1F1F2 U+1F1FF",
          name: "Mozambique",
          emoji: "🇲🇿",
        },
        {
          code: "NA",
          unicode: "U+1F1F3 U+1F1E6",
          name: "Namibia",
          emoji: "🇳🇦",
        },
        {
          code: "NC",
          unicode: "U+1F1F3 U+1F1E8",
          name: "New Caledonia",
          emoji: "🇳🇨",
        },
        {
          code: "NE",
          unicode: "U+1F1F3 U+1F1EA",
          name: "Niger",
          emoji: "🇳🇪",
        },
        {
          code: "NF",
          unicode: "U+1F1F3 U+1F1EB",
          name: "Norfolk Island",
          emoji: "🇳🇫",
        },
        {
          code: "NG",
          unicode: "U+1F1F3 U+1F1EC",
          name: "Nigeria",
          emoji: "🇳🇬",
        },
        {
          code: "NI",
          unicode: "U+1F1F3 U+1F1EE",
          name: "Nicaragua",
          emoji: "🇳🇮",
        },
        {
          code: "NL",
          unicode: "U+1F1F3 U+1F1F1",
          name: "Netherlands",
          emoji: "🇳🇱",
        },
        {
          code: "NO",
          unicode: "U+1F1F3 U+1F1F4",
          name: "Norway",
          emoji: "🇳🇴",
        },
        {
          code: "NP",
          unicode: "U+1F1F3 U+1F1F5",
          name: "Nepal",
          emoji: "🇳🇵",
        },
        {
          code: "NR",
          unicode: "U+1F1F3 U+1F1F7",
          name: "Nauru",
          emoji: "🇳🇷",
        },
        {
          code: "NU",
          unicode: "U+1F1F3 U+1F1FA",
          name: "Niue",
          emoji: "🇳🇺",
        },
        {
          code: "NZ",
          unicode: "U+1F1F3 U+1F1FF",
          name: "New Zealand",
          emoji: "🇳🇿",
        },
        {
          code: "OM",
          unicode: "U+1F1F4 U+1F1F2",
          name: "Oman",
          emoji: "🇴🇲",
        },
        {
          code: "PA",
          unicode: "U+1F1F5 U+1F1E6",
          name: "Panama",
          emoji: "🇵🇦",
        },
        {
          code: "PE",
          unicode: "U+1F1F5 U+1F1EA",
          name: "Peru",
          emoji: "🇵🇪",
        },
        {
          code: "PF",
          unicode: "U+1F1F5 U+1F1EB",
          name: "French Polynesia",
          emoji: "🇵🇫",
        },
        {
          code: "PG",
          unicode: "U+1F1F5 U+1F1EC",
          name: "Papua New Guinea",
          emoji: "🇵🇬",
        },
        {
          code: "PH",
          unicode: "U+1F1F5 U+1F1ED",
          name: "Philippines",
          emoji: "🇵🇭",
        },
        {
          code: "PK",
          unicode: "U+1F1F5 U+1F1F0",
          name: "Pakistan",
          emoji: "🇵🇰",
        },
        {
          code: "PL",
          unicode: "U+1F1F5 U+1F1F1",
          name: "Poland",
          emoji: "🇵🇱",
        },
        {
          code: "PM",
          unicode: "U+1F1F5 U+1F1F2",
          name: "St. Pierre & Miquelon",
          emoji: "🇵🇲",
        },
        {
          code: "PN",
          unicode: "U+1F1F5 U+1F1F3",
          name: "Pitcairn Islands",
          emoji: "🇵🇳",
        },
        {
          code: "PR",
          unicode: "U+1F1F5 U+1F1F7",
          name: "Puerto Rico",
          emoji: "🇵🇷",
        },
        {
          code: "PS",
          unicode: "U+1F1F5 U+1F1F8",
          name: "Palestinian Territories",
          emoji: "🇵🇸",
        },
        {
          code: "PT",
          unicode: "U+1F1F5 U+1F1F9",
          name: "Portugal",
          emoji: "🇵🇹",
        },
        {
          code: "PW",
          unicode: "U+1F1F5 U+1F1FC",
          name: "Palau",
          emoji: "🇵🇼",
        },
        {
          code: "PY",
          unicode: "U+1F1F5 U+1F1FE",
          name: "Paraguay",
          emoji: "🇵🇾",
        },
        {
          code: "QA",
          unicode: "U+1F1F6 U+1F1E6",
          name: "Qatar",
          emoji: "🇶🇦",
        },
        {
          code: "RE",
          unicode: "U+1F1F7 U+1F1EA",
          name: "Réunion",
          emoji: "🇷🇪",
        },
        {
          code: "RO",
          unicode: "U+1F1F7 U+1F1F4",
          name: "Romania",
          emoji: "🇷🇴",
        },
        {
          code: "RS",
          unicode: "U+1F1F7 U+1F1F8",
          name: "Serbia",
          emoji: "🇷🇸",
        },
        {
          code: "RU",
          unicode: "U+1F1F7 U+1F1FA",
          name: "Russia",
          emoji: "🇷🇺",
        },
        {
          code: "RW",
          unicode: "U+1F1F7 U+1F1FC",
          name: "Rwanda",
          emoji: "🇷🇼",
        },
        {
          code: "SA",
          unicode: "U+1F1F8 U+1F1E6",
          name: "Saudi Arabia",
          emoji: "🇸🇦",
        },
        {
          code: "SB",
          unicode: "U+1F1F8 U+1F1E7",
          name: "Solomon Islands",
          emoji: "🇸🇧",
        },
        {
          code: "SC",
          unicode: "U+1F1F8 U+1F1E8",
          name: "Seychelles",
          emoji: "🇸🇨",
        },
        {
          code: "SD",
          unicode: "U+1F1F8 U+1F1E9",
          name: "Sudan",
          emoji: "🇸🇩",
        },
        {
          code: "SE",
          unicode: "U+1F1F8 U+1F1EA",
          name: "Sweden",
          emoji: "🇸🇪",
        },
        {
          code: "SG",
          unicode: "U+1F1F8 U+1F1EC",
          name: "Singapore",
          emoji: "🇸🇬",
        },
        {
          code: "SH",
          unicode: "U+1F1F8 U+1F1ED",
          name: "St. Helena",
          emoji: "🇸🇭",
        },
        {
          code: "SI",
          unicode: "U+1F1F8 U+1F1EE",
          name: "Slovenia",
          emoji: "🇸🇮",
        },
        {
          code: "SJ",
          unicode: "U+1F1F8 U+1F1EF",
          name: "Svalbard & Jan Mayen",
          emoji: "🇸🇯",
        },
        {
          code: "SK",
          unicode: "U+1F1F8 U+1F1F0",
          name: "Slovakia",
          emoji: "🇸🇰",
        },
        {
          code: "SL",
          unicode: "U+1F1F8 U+1F1F1",
          name: "Sierra Leone",
          emoji: "🇸🇱",
        },
        {
          code: "SM",
          unicode: "U+1F1F8 U+1F1F2",
          name: "San Marino",
          emoji: "🇸🇲",
        },
        {
          code: "SN",
          unicode: "U+1F1F8 U+1F1F3",
          name: "Senegal",
          emoji: "🇸🇳",
        },
        {
          code: "SO",
          unicode: "U+1F1F8 U+1F1F4",
          name: "Somalia",
          emoji: "🇸🇴",
        },
        {
          code: "SR",
          unicode: "U+1F1F8 U+1F1F7",
          name: "Suriname",
          emoji: "🇸🇷",
        },
        {
          code: "SS",
          unicode: "U+1F1F8 U+1F1F8",
          name: "South Sudan",
          emoji: "🇸🇸",
        },
        {
          code: "ST",
          unicode: "U+1F1F8 U+1F1F9",
          name: "São Tomé & Príncipe",
          emoji: "🇸🇹",
        },
        {
          code: "SV",
          unicode: "U+1F1F8 U+1F1FB",
          name: "El Salvador",
          emoji: "🇸🇻",
        },
        {
          code: "SX",
          unicode: "U+1F1F8 U+1F1FD",
          name: "Sint Maarten",
          emoji: "🇸🇽",
        },
        {
          code: "SY",
          unicode: "U+1F1F8 U+1F1FE",
          name: "Syria",
          emoji: "🇸🇾",
        },
        {
          code: "SZ",
          unicode: "U+1F1F8 U+1F1FF",
          name: "Swaziland",
          emoji: "🇸🇿",
        },
        {
          code: "TA",
          unicode: "U+1F1F9 U+1F1E6",
          name: "Tristan da Cunha",
          emoji: "🇹🇦",
        },
        {
          code: "TC",
          unicode: "U+1F1F9 U+1F1E8",
          name: "Turks & Caicos Islands",
          emoji: "🇹🇨",
        },
        {
          code: "TD",
          unicode: "U+1F1F9 U+1F1E9",
          name: "Chad",
          emoji: "🇹🇩",
        },
        {
          code: "TF",
          unicode: "U+1F1F9 U+1F1EB",
          name: "French Southern Territories",
          emoji: "🇹🇫",
        },
        {
          code: "TG",
          unicode: "U+1F1F9 U+1F1EC",
          name: "Togo",
          emoji: "🇹🇬",
        },
        {
          code: "TH",
          unicode: "U+1F1F9 U+1F1ED",
          name: "Thailand",
          emoji: "🇹🇭",
        },
        {
          code: "TJ",
          unicode: "U+1F1F9 U+1F1EF",
          name: "Tajikistan",
          emoji: "🇹🇯",
        },
        {
          code: "TK",
          unicode: "U+1F1F9 U+1F1F0",
          name: "Tokelau",
          emoji: "🇹🇰",
        },
        {
          code: "TL",
          unicode: "U+1F1F9 U+1F1F1",
          name: "Timor-Leste",
          emoji: "🇹🇱",
        },
        {
          code: "TM",
          unicode: "U+1F1F9 U+1F1F2",
          name: "Turkmenistan",
          emoji: "🇹🇲",
        },
        {
          code: "TN",
          unicode: "U+1F1F9 U+1F1F3",
          name: "Tunisia",
          emoji: "🇹🇳",
        },
        {
          code: "TO",
          unicode: "U+1F1F9 U+1F1F4",
          name: "Tonga",
          emoji: "🇹🇴",
        },
        {
          code: "TR",
          unicode: "U+1F1F9 U+1F1F7",
          name: "Turkey",
          emoji: "🇹🇷",
        },
        {
          code: "TT",
          unicode: "U+1F1F9 U+1F1F9",
          name: "Trinidad & Tobago",
          emoji: "🇹🇹",
        },
        {
          code: "TV",
          unicode: "U+1F1F9 U+1F1FB",
          name: "Tuvalu",
          emoji: "🇹🇻",
        },
        {
          code: "TW",
          unicode: "U+1F1F9 U+1F1FC",
          name: "Taiwan",
          emoji: "🇹🇼",
        },
        {
          code: "TZ",
          unicode: "U+1F1F9 U+1F1FF",
          name: "Tanzania",
          emoji: "🇹🇿",
        },
        {
          code: "UA",
          unicode: "U+1F1FA U+1F1E6",
          name: "Ukraine",
          emoji: "🇺🇦",
        },
        {
          code: "UG",
          unicode: "U+1F1FA U+1F1EC",
          name: "Uganda",
          emoji: "🇺🇬",
        },
        {
          code: "UM",
          unicode: "U+1F1FA U+1F1F2",
          name: "U.S. Outlying Islands",
          emoji: "🇺🇲",
        },
        {
          code: "UN",
          unicode: "U+1F1FA U+1F1F3",
          name: "United Nations",
          emoji: "🇺🇳",
        },
        {
          code: "US",
          unicode: "U+1F1FA U+1F1F8",
          name: "United States",
          emoji: "🇺🇸",
        },
        {
          code: "UY",
          unicode: "U+1F1FA U+1F1FE",
          name: "Uruguay",
          emoji: "🇺🇾",
        },
        {
          code: "UZ",
          unicode: "U+1F1FA U+1F1FF",
          name: "Uzbekistan",
          emoji: "🇺🇿",
        },
        {
          code: "VA",
          unicode: "U+1F1FB U+1F1E6",
          name: "Vatican City",
          emoji: "🇻🇦",
        },
        {
          code: "VC",
          unicode: "U+1F1FB U+1F1E8",
          name: "St. Vincent & Grenadines",
          emoji: "🇻🇨",
        },
        {
          code: "VE",
          unicode: "U+1F1FB U+1F1EA",
          name: "Venezuela",
          emoji: "🇻🇪",
        },
        {
          code: "VG",
          unicode: "U+1F1FB U+1F1EC",
          name: "British Virgin Islands",
          emoji: "🇻🇬",
        },
        {
          code: "VI",
          unicode: "U+1F1FB U+1F1EE",
          name: "U.S. Virgin Islands",
          emoji: "🇻🇮",
        },
        {
          code: "VN",
          unicode: "U+1F1FB U+1F1F3",
          name: "Vietnam",
          emoji: "🇻🇳",
        },
        {
          code: "VU",
          unicode: "U+1F1FB U+1F1FA",
          name: "Vanuatu",
          emoji: "🇻🇺",
        },
        {
          code: "WF",
          unicode: "U+1F1FC U+1F1EB",
          name: "Wallis & Futuna",
          emoji: "🇼🇫",
        },
        {
          code: "WS",
          unicode: "U+1F1FC U+1F1F8",
          name: "Samoa",
          emoji: "🇼🇸",
        },
        {
          code: "XK",
          unicode: "U+1F1FD U+1F1F0",
          name: "Kosovo",
          emoji: "🇽🇰",
        },
        {
          code: "YE",
          unicode: "U+1F1FE U+1F1EA",
          name: "Yemen",
          emoji: "🇾🇪",
        },
        {
          code: "YT",
          unicode: "U+1F1FE U+1F1F9",
          name: "Mayotte",
          emoji: "🇾🇹",
        },
        {
          code: "ZA",
          unicode: "U+1F1FF U+1F1E6",
          name: "South Africa",
          emoji: "🇿🇦",
        },
        {
          code: "ZM",
          unicode: "U+1F1FF U+1F1F2",
          name: "Zambia",
          emoji: "🇿🇲",
        },
        {
          code: "ZW",
          unicode: "U+1F1FF U+1F1FC",
          name: "Zimbabwe",
          emoji: "🇿🇼",
        },
      ],
      thisCountry: "",
      bronzePrice:"",
      silverPrice: "",
      goldPrice: "",
      currency: "",
      typeToPay: "",
      overlay: true,
      isMonth: false,
      orderDayes: 30,
      prossesOne: false,
      prossesTwo: false,
      prossesThree: false,
      mobileWindow: true,
      monthly: "monthly",
      isMobScreenPlan: false
    };
  },
  methods: {
    onResize(){
      if(window.innerWidth <= 600){
        this.mobileWindow = false
        this.isMobScreenPlan = true
      }
      if(window.innerWidth > 600){
        this.mobileWindow = true
        this.isMobScreenPlan = false
      }
    },
    checkPlan(val){
      let paypalData = {
        router: "calculate_price",
        number_id: this.$route.params.id,
        plan_type: val,
        days_order: this.orderDayes,
      };
      this.post(paypalData, false).then((response) => {
        console.log(response);
        if (!response.data.session) {
          this.$router.push("/login");
        }
        if (response.data.success) {
          this.$router.push(`/paypal_payment/${this.$route.params.id}/${val}/${this.orderDayes}/${this.$route.params.number}`)
          this.prossesOne = false
        this.prossesTwo = false
        this.prossesThree = false
        }else {

        if (response.data.message == "no_downgrade") {
          // this.overlay = false
          this.dialog = true;
          this.dialogMainTitle = "error";
          this.dialogErrorRouter = `/support`;
          this.dialogTitle = i18n.t("contact_us");
          this.dialogCardError = response.data.message;
          this.plans = `/plans/${this.$route.params.id}/${this.$route.params.number}`;
          this.dialogIcon = "mdi-lifebuoy";
          this.showSecondButton = true;
          this.firstButton = "plans"
          this.prossesOne = false
        this.prossesTwo = false
        this.prossesThree = false
        } else if (response.data.message == "day_order_30_or_180") {
          // this.overlay = false
          this.dialog = true;
          this.dialogMainTitle = "error";
          this.dialogErrorRouter = `/support`;
          this.dialogTitle = i18n.t("contact_us");
          this.plans = `/plans/${this.$route.params.id}/${this.$route.params.number}`;
          this.dialogCardError = response.data.message;
          this.dialogIcon = "mdi-lifebuoy";
          this.showSecondButton = true;
          this.firstButton = "plans"
          this.prossesOne = false
        this.prossesTwo = false
        this.prossesThree = false
        } else if (response.data.message == "paypal_sdk_id") {
          // this.overlay = false
          this.dialog = true;
          this.dialogMainTitle = "error";
          this.dialogErrorRouter = `/support`;
          this.dialogTitle = i18n.t("contact_us");
          this.dialogCardError = response.data.message;
          this.plans = `/plans/${this.$route.params.id}/${this.$route.params.number}`;
          this.dialogIcon = "mdi-lifebuoy";
          this.showSecondButton = true;
          this.firstButton = "plans"
          this.prossesOne = false
        this.prossesTwo = false
        this.prossesThree = false
        }
        }
      })
    },
    toggleSwitch(){
      if (this.switcherMargin == "me-auto transition") {
        console.log('here')
        this.switcherMargin = "ms-auto"
        this.isMonth = true
        this.monthly = "six_month"
        let sixMonthStore = this.$store.state.sixMonth
          this.bronzePrice = sixMonthStore["1"]
        this.silverPrice = sixMonthStore["2"]
        this.goldPrice = sixMonthStore["3"]
          this.orderDayes = 180
      }else {
        console.log('here i am')
        this.switcherMargin = "me-auto transition"
        this.isMonth = false
        this.monthly = "monthly"
        let oneMonthStore = this.$store.state.oneMonth
        this.bronzePrice = oneMonthStore["1"]
          this.silverPrice = oneMonthStore["2"]
          this.goldPrice = oneMonthStore["3"]
        this.orderDayes = 30
      }
    },
    countreyName(){
        if (i18n.locale == "en") {
          let englishCountry = this.counteryCode
          englishCountry.map((item) => {
            if (item.code === this.countery) {
              this.thisCountry = item.name
            }
          })
        }
        if (i18n.locale == "ar") {
          let arabicCountry = this.arCountry
          arabicCountry.map((item) => {
            if (item.code === this.countery) {
              this.thisCountry = item.name
            }
          })
        }
    },
    payment(){
      let pay = {
        router: "price_plans",
        phone_number: this.$route.params.number
      }
      this.post(pay,false).then((response) => {
        console.log(response);
        if (response.data.session == "false") {
          this.$router.push('/login')
        }
        let onMonthTitle = "1_month"
        let onMonth = response.data.plan[onMonthTitle];
        this.$store.state.oneMonth = onMonth
        let sixMonthTitle = "6_month"
        let sixMonth = response.data.plan[sixMonthTitle];
        this.$store.state.sixMonth = sixMonth
        if (this.isMonth) {
          let sixMonthTitle = "6_month"
          let onMonth = response.data.plan[sixMonthTitle];
          this.bronzePrice = onMonth["1"]
          this.silverPrice = onMonth["2"]
          this.goldPrice = onMonth["3"]
        }else {


          let onMonthTitle = "1_month"
          let onMonth = response.data.plan[onMonthTitle];
          this.bronzePrice = onMonth["1"]
          this.silverPrice = onMonth["2"]
          this.goldPrice = onMonth["3"]
        }
        this.currency = response.data.plan.currency
        this.typeToPay = response.data.plan.contact
        this.overlay = false
      })
    },
    toPay(val){
      console.log(val);
      if (this.typeToPay === "phone") {
        if (val == "1") {
          this.prossesOne = true
          this.checkPlan(val)
        }else if (val == "2") {
          this.prossesTwo = true
          this.checkPlan(val)
        }else if (val == "3") {
          this.prossesThree = true
          this.checkPlan(val)
        }
      }
      if (this.typeToPay === "paypal") {
        if (val == "1") {
          this.prossesOne = true
          this.checkPlan(val)
        }else if (val == "2") {
          this.prossesTwo = true
          this.checkPlan(val)
        }else if (val == "3") {
          this.prossesThree = true
          this.checkPlan(val)
        }
      }
    }
  },
  computed: {

  },
  mounted() {
    window.scrollTo(0,0)
    if(i18n.locale == "en"){
      this.oneMonth = "month"
      this.sixMonth = "six_month"
    }else if(i18n.locale == "ar"){
      this.oneMonth = "month"
      this.sixMonth = "six_month"
    }
    this.payment()
    let number  = `+${this.$route.params.number}`
    let checkNumber = parseMax(number);
    this.countery = checkNumber.country
    this.thisCountry = checkNumber.country
    this.countreyName()
    bus.$on("arabicLang", () =>{
      this.oneMonth = "six_month"
      this.sixMonth = "month"
      let arabicCountry = this.arCountry
          arabicCountry.map((item) => {
            if (item.code === this.countery) {
              this.thisCountry = item.name
            }
          })
    });
    bus.$on("englishLang", () => {
      this.oneMonth = "month"
      this.sixMonth = "six_month"
      let englishCountry = this.counteryCode
          englishCountry.map((item) => {
            if (item.code === this.countery) {
              this.thisCountry = item.name
            }
          })
    });
  },
  mixins:[payment]
};
</script>
<style lang="scss">
.holder-switch{
    width: 50px;
    border: 1px solid #81217d;
    height: 26px;
    border-radius: 25px;
    transition: all 0.4s ease-in-out;
    cursor: pointer;
    will-change: auto;
    padding: 3px;
    background: #81217d;
  .child-switch{
    height: 18px;
    width: 18px;
    border-radius: 50%;
    display: block;
    transition: all 0.4s ease-in-out;
    will-change: auto;
    background: #FFF;
  }
  .transition{
    transition: all .4s ease-in-out;
  }
}
.title-class{
  background: #e3e3ed;
  display: block;
  text-align: center;
}
.ribbon {
  position: absolute;
  left: -5px; top: -5px;
  z-index: 1;
  overflow: hidden;
  width: 75px; height: 75px;
  text-align: right;
}
.ribbon span {
  font-size: 11px;
  font-weight: bold;
  color: #FFF;
  text-transform: uppercase;
  text-align: center;
  line-height: 20px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  width: 100px;
  display: block;
  background: #79A70A;
  background: linear-gradient(#81217D 0%, #33368D 100%);
  box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);
  position: absolute;
  top: 19px; left: -21px;
}
.ribbon span::before {
  content: "";
  position: absolute; left: 0px; top: 100%;
  z-index: -1;
  border-left: 3px solid #33368D;
  border-right: 3px solid transparent;
  border-bottom: 3px solid transparent;
  border-top: 3px solid #33368D;
}
.ribbon span::after {
  content: "";
  position: absolute; right: 0px; top: 100%;
  z-index: -1;
  border-left: 3px solid transparent;
  border-right: 3px solid #33368D;
  border-bottom: 3px solid transparent;
  border-top: 3px solid #33368D;
}
.heightSch{
  height: 48px !important;
  line-height: 37px !important;
}
.heightAgence{
  height: 56px !important;
  line-height: 55px !important;
}
.plans-hover{
  box-shadow: 0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12) !important;
  transition: all .3s ease-in-out;
}
.without-hover{
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  transition: all .2s ease-in-out;
}
.dir-style{
  direction: ltr;
  white-space: nowrap;
}
.rad{
  border-radius: 50%;
  padding: 3px
}
.border-radius-circle {
  border-radius: 50%;
}
.plan-table > .v-data-table__wrapper{
  overflow: auto !important;
}
.theme--light.plan-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper){
background: transparent !important;
transition: all .2s ease-in-out;
}
</style>
