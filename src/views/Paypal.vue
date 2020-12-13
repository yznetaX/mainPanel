<template>
  <div class="" v-resize="onResize">
    <Overlay :overlay="overlay" />
    <v-snackbar v-model="snake" timeout="10000">
      <v-icon color="red darken-4">
        mdi-wifi-off
      </v-icon>
      Network error please try again <v-btn small class="ms-3" @click="$router.go(0)">
        <v-icon small class="me-2">mdi-replay</v-icon>
        Try again
      </v-btn>
    </v-snackbar>
    <v-card class="mb-4" flat>
      <v-card-title class="py-1">
        <span class="text-h5 secondary--text">
          <Backword v-if="showBackword" />
          {{$t('invoice_title')}}</span>
      </v-card-title>
      <v-simple-table fixed-header ref="bot_table" class="bot-table">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="desc-color">{{ $t("description") }}</th>
              <th class="text-center desc-color">{{ $t("plan_type") }}</th>
              <th class="text-center desc-color">{{ $t("plan_days") }}</th>
              <th class="text-center desc-color">{{ $t("plan_price") }}</th>
              <th class="text-center desc-color" v-if="updatePrice != '0'">
                {{ $t("update_price") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="">{{ paypalData.desc || desc }}</td>
              <td class="text-center">{{ $t(planType) }}</td>
              <td class="text-center">{{ $route.params.days }}</td>
              <td class="text-center">{{ currency + " " + planPrice }}</td>
              <td class="text-center" v-if="updatePrice != '0'">
                {{ currency + " " + updatePrice }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-card-subtitle class="py-1">
        <span class="f-color text-h6">{{ $t("plan_price") }}</span>
        <span class="text-h6 mx-1">:</span>
        <span class="text-h6">{{ currency + " " + planPrice }}</span>
      </v-card-subtitle>

      <v-card-subtitle class="py-1" v-if="updatePrice != '0'">
        <span class="f-color text-h6">{{ $t("price_time_left") }}</span>
        <span class="text-h6 mx-1">:</span>
        <span class="text-h6">{{ currency + " " + updatePrice }}</span>
      </v-card-subtitle>
      <v-divider></v-divider>
      <v-card-subtitle class="py-1" v-if="remainDay != '0'">
        <span class="f-color text-h6">{{ $t("days_left") }}</span>
        <span class="text-h6 mx-1">:</span>
        <span class="text-h6">{{ remainDay }}</span>
      </v-card-subtitle>
      <v-divider></v-divider>
      <v-card-subtitle class="py-1">
        <span class="desc-color text-h6">{{ $t("total_price") }}</span>
        <span class="text-h6 mx-1">:</span>
        <span class="text-h6">{{ currency + " " + totalPrice }}</span>
      </v-card-subtitle>
    </v-card>
    <v-dialog v-model="coponeInfo" max-width="400" persistent>
      <v-card>
        <v-toolbar color="secondary" dark dense height="34" flat>
          <v-toolbar-title class="white--text subtitle-1">{{
            $t(dialogMainTitleInfo)
          }}</v-toolbar-title>
        </v-toolbar>
        <v-card-subtitle v-if="syrianNumber"></v-card-subtitle>
        <v-card-text class="pa-2" >{{$t('type_of_coupon')}} : {{$t(coponeInfoData.type)}}</v-card-text>
        <v-card-text class="pa-2" v-if="coponeInfoData.used">{{$t('used_coupon')}}</v-card-text>
        <v-card-text class="pa-2" v-else>{{$t('ava_coupon')}}</v-card-text>
        <v-card-text class="pa-2" >{{$t('value_cupon')}} : {{currency + $t(coponeInfoData.value)}}</v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn color="orange" dark @click="coponeInfo = false" small>
            {{ $t("close") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
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
          <v-btn color="orange" dark @click="firstButtonClicked" :to="plans" small>
            {{ $t(firstButton) }}</v-btn
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
    <v-tabs dark color="secondary" grow  background-color="secondary" class="mb-4">
      <v-tab class="" v-if="syrianNumber">
        <v-img
          src="../assets/iconfinder_logo_brand_brands_logos_paypal_2993670.svg"
          max-width="22"
        ></v-img>
        <v-icon size="22" class="mx-2">mdi-credit-card</v-icon>
        {{$t('paypal_card')}}
      </v-tab>
      <v-tab class="">
        <v-icon class="me-2">mdi-cards-outline</v-icon>
        {{$t('copone')}}
      </v-tab>
      <v-tab-item class="mt-8 text-center" v-if="syrianNumber">
        <div class="paypal-buttons-container" v-show="paypalButtons">
          <div id="paypal-button-container"></div>
        </div>
      </v-tab-item>
      <v-tab-item>
        <v-card-title
          class="pt-2 px-0 secondary--text text-subtitle-1"
        >
        {{ $t("copone") }}
      </v-card-title>
      <v-card-subtitle
        class="px-0 subtitle-2"
        v-html="$t('copone_description')"
      ></v-card-subtitle>
      <v-card-actions class="px-0">
        <v-btn small color="secondary" to="/auth_agent">
          {{$t('auth_agent')}}
        </v-btn>
      </v-card-actions>
        <div class="copone-container mt-6">

          <v-text-field
            :rules="coponeRules"
            :label="$t('copone_number')"
            solo
            dense
            v-model="coponeNumber"
            append-outer-icon="mdi-cards-outline"
          ></v-text-field>
          <v-row justify="center">
            <v-btn :disabled="coponeNumber == '' || progress || progressInfo" color="secondary" class="me-2 d-block" rounded @click="sendCopone" :loading="progress"
            >{{$t('send_copone')}}</v-btn
          >
          <v-btn :disabled="coponeNumber == '' || progressInfo || progress" color="orange" :dark="coponeNumber == '' || progressInfo || progress ? false : true" class="ms-2 d-block" rounded @click="showCoponeInfo" :loading="progressInfo"
            >{{$t('info_copone')}}</v-btn
          >
          </v-row>
        </div>
      </v-tab-item>
    </v-tabs>
  </div>
</template>
<script>
/*eslint-disable*/
import i18n from "../plugins/i18n";
import Remote from "../mixins/httpHandler";
import { parsePhoneNumberFromString as parseMax } from "libphonenumber-js/max";
import Overlay from "../components/cirlceOverlay";
import Backword from "../components/Backword";
export default {
  components: {
    Overlay,
    Backword
  },
  data() {
    return {
      message: "copy this text",
      snakeContent: "",
      show: false,
      error: "",
      dialog: false,
      dialogCardError: "",
      dialogErrorRouter: "",
      dialogIcon: "",
      dialogTitle: "",
      dialogMainTitle: "",
      showSecondButton: true,
      showPaypalButton: false,
      paypalData: {},
      showCopone: null,
      updatePrice: "",
      planType: "",
      planPrice: "",
      overlay: true,
      plans: "",
      totalPrice: "",
      invoice_id: "",
      coponeNumber: "",
      coponeRules: [(v) => !!v || i18n.tc("this_req")],
      syrianNumber: null,
      desc: "",
      snake: false,
      firstButton: '',
      coponeInfo: false,
      dialogMainTitleInfo: "",
      dialogCardErrorInfo: "",
      coponeInfoData: {},
      currency: "",
      progress: false,
      progressInfo: false,
      showBackword: "",
      remainDay: "",
      paypalButtons: false,
      timer: null,
      timerError: null
    };
  },
  watch: {
    onApprove(data){
      if(data){
        this.dialog = true;
         this.dialogMainTitle = "sucsses";
         this.dialogErrorRouter = `/`;
         this.dialogCardError = response.data.message;
         this.showSecondButton = false;
      }

     }
  },
  computed: {
    createOrder(){
      return window.createOrder
    }
  },
  methods: {
    firstButtonClicked(){
      this.dialog= false
      window.__proto__.onError = false
      window.__proto__.onApp = false
      // this.timerRun()
      // this.timerErrorRun()
    },
    onResize(){
      if (window.innerWidth >= 1250) {
        this.showBackword = true
      }
      if (window.innerWidth < 1250) {
        this.showBackword = false
      }
    },
    showCoponeInfo(){
      this.progressInfo = true
      let showCoponeData= {
        router: "get_coupon_info",
        coupon_number: this.coponeNumber
      }
      this.post(showCoponeData, false).then((response) => {
        if (response.data.message == "coupon_sy_only") {
            this.dialog = true;
            this.dialogMainTitle = "error";
            this.dialogCardError = response.data.message;
            this.dialogIcon = "mdi-lifebuoy";
            this.firstButton = "close"
            this.showSecondButton = false;
            this.progressInfo = false
          } else if (response.data.message == "coupon_us_only") {
            this.dialog = true;
            this.dialogMainTitle = "error";
            this.dialogErrorRouter = `/support`;
            this.dialogTitle = i18n.t("contact_us");
            this.dialogCardError = response.data.message;
            this.dialogIcon = "mdi-lifebuoy";
             this.firstButton = "close"
            this.showSecondButton = false;
          } else if (response.data.message == "coupon_short_value") {
            this.dialog = true;
            this.dialogMainTitle = "error";
            this.dialogErrorRouter = `/support`;
            this.dialogTitle = i18n.t("contact_us");
            this.dialogCardError = response.data.message;
             this.firstButton = "close"
            this.dialogIcon = "mdi-lifebuoy";
            this.showSecondButton = false;
          }else if (response.data.message == "coupon_not_found") {
            this.dialog = true;
            this.dialogMainTitle = "error";
            this.dialogErrorRouter = `/support`;
            this.dialogTitle = i18n.t("contact_us");
            this.dialogCardError = response.data.message;
             this.firstButton = "close"
            this.dialogIcon = "mdi-lifebuoy";
            this.showSecondButton = false;
            this.progressInfo = false
          }
          else if (response.data.message == "coupon_already_used") {
            this.dialog = true;
            this.dialogMainTitle = "error";
            this.dialogTitle = i18n.t("contact_us");
            this.dialogCardError = response.data.message;
             this.firstButton = "close"
            this.dialogIcon = "mdi-lifebuoy";
            this.showSecondButton = false;
            this.progressInfo = false
          }else {
            this.coponeInfo = response.data.coupon_information
        console.log(response);
        this.coponeInfoData = response.data.coupon_information
        this.coponeInfo = true
        this.dialogMainTitleInfo = "copone_info"
        this.progressInfo = false
          }
      })
    },
    sendCopone() {
      this.progress = true
      let coponeData = {
        router: "set_coupon",
        number_id: this.$route.params.id,
        coupon_number: this.coponeNumber,
        invoice_id: this.invoice_id,
      };
      if (this.coponeNumber != "") {
        this.post(coponeData, false).then((response) => {
          console.log(response);
          if (response.data.success) {
            this.dialog = true;
            this.dialogMainTitle = "success";
            this.dialogCardError = "copone_sent";
            this.dialogErrorRouter = `/cards`;
            this.firstButton = "close"
            this.dialogTitle = i18n.t("dashboard");
            this.dialogIcon = "mdi-whatsapp";
            this.showSecondButton = true;
            this.progress = false
          }else{
            if (response.data.message == "coupon_sy_only") {
            this.dialog = true;
            this.dialogMainTitle = "error";
            this.dialogCardError = response.data.message;
            this.dialogIcon = "mdi-lifebuoy";
            this.firstButton = "close"
            this.showSecondButton = false;
            this.progress = false
          } else if (response.data.message == "coupon_us_only") {
            this.dialog = true;
            this.dialogMainTitle = "error";
            this.dialogErrorRouter = `/support`;
            this.dialogTitle = i18n.t("contact_us");
            this.dialogCardError = response.data.message;
            this.dialogIcon = "mdi-lifebuoy";
             this.firstButton = "close"
            this.showSecondButton = false;
            this.progress = false
          } else if (response.data.message == "coupon_short_value") {
            this.dialog = true;
            this.dialogMainTitle = "error";
            this.dialogErrorRouter = `/support`;
            this.dialogTitle = i18n.t("contact_us");
            this.dialogCardError = response.data.message;
             this.firstButton = "close"
            this.dialogIcon = "mdi-lifebuoy";
            this.showSecondButton = false;
            this.progress = false
          }else if (response.data.message == "coupon_not_found") {
            this.dialog = true;
            this.dialogMainTitle = "error";
            this.dialogErrorRouter = `/support`;
            this.dialogTitle = i18n.t("contact_us");
            this.dialogCardError = response.data.message;
             this.firstButton = "close"
            this.dialogIcon = "mdi-lifebuoy";
            this.showSecondButton = false;
            this.progress = false
          }
          else if (response.data.message == "coupon_already_used") {
            this.dialog = true;
            this.dialogMainTitle = "error";
            this.dialogTitle = i18n.t("contact_us");
            this.dialogCardError = response.data.message;
             this.firstButton = "close"
            this.dialogIcon = "mdi-lifebuoy";
            this.showSecondButton = false;
            this.progress = false
          }
          }

        });
      }
    },
    initPayPalButton(description, res_invoice_id, currency_code, value) {
      console.log("run this");
      console.log(description, "/n", res_invoice_id , currency_code , value);
      const generateId = function() {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return Math.random()
          .toString(36)
          .substr(2, 20);
      };
      paypal
        .Buttons({
          style: {
            shape: "pill",
            color: "blue",
            layout: "vertical",
            label: "paypal",
          },

          createOrder(data, actions) {
            window.__proto__.createOrder = true
            const generateId = function() {
              // Math.random should be unique because of its seeding algorithm.
              // Convert it to base 36 (numbers + letters), and grab the first 9 characters
              // after the decimal.
              return Math.random()
                .toString(36)
                .substr(2,20)
            };
            var payData =  actions.order.create({
              purchase_units: [
                {
                  description: description,
                  invoice_id: res_invoice_id + generateId(),
                  amount: { currency_code: currency_code, value: value },
                },
              ],
            })
            console.log(payData)
            return payData
          },

          onApprove(data, actions) {
            console.log(actions)
            return actions.order.capture().then((details) => {
              window.onError = 1
            })

          },
          onCancel(data, actions) {
            // Show a cancel page or return to cart
          },
          onAuthorize(data, actions) {
            // Execute the payment here, when the buyer approves the transaction
          },

          onError(err) {
            window.onError = 2
          },
        })
        .render("#paypal-button-container")
    },
    async getSyrianPaypalData() {
      this.overlay = true
      let paypalData = {
        router: "calculate_price",
        number_id: this.$route.params.id,
        plan_type: this.$route.params.plantype,
        days_order: this.$route.params.days,
      };
      this.post(paypalData, false).then((response) => {
        console.log(response);
        if (!response.data.session) {
          this.$router.push("/login");
        }
        (this.updatePrice = response.data.update_price),
          (this.planType = response.data.plan_type),
          (this.planPrice = response.data.plan_price);
        this.totalPrice = response.data.total_price;
        this.currency = response.data.currency
        this.invoice_id = response.data.invoice_id;
        this.desc = response.data.description;
        this.remainDay = response.data.remaining_days
        setTimeout(()=>{
          this.overlay = false
        },2000)

         if (response.data.message == "no_downgrade") {
          this.dialog = true;
          this.dialogMainTitle = "error";
          this.dialogErrorRouter = `/support`;
          this.dialogTitle = i18n.t("contact_us");
          this.dialogCardError = response.data.message;
          this.plans = `/plans/${this.$route.params.id}/${this.$route.params.number}`;
          this.dialogIcon = "mdi-lifebuoy";
          this.showSecondButton = true;
          this.firstButton = "plans"
          this.overlay = true
        } else if (response.data.message == "day_order_30_or_180") {
          this.dialog = true;
          this.dialogMainTitle = "error";
          this.dialogErrorRouter = `/support`;
          this.dialogTitle = i18n.t("contact_us");
          this.plans = `/plans/${this.$route.params.id}/${this.$route.params.number}`;
          this.dialogCardError = response.data.message;
          this.dialogIcon = "mdi-lifebuoy";
          this.showSecondButton = true;
          this.firstButton = "plans"
          this.overlay = true
        } else if (response.data.message == "paypal_sdk_id") {
          this.dialog = true;
          this.dialogMainTitle = "error";
          this.dialogErrorRouter = `/support`;
          this.dialogTitle = i18n.t("contact_us");
          this.dialogCardError = response.data.message;
          this.plans = `/plans/${this.$route.params.id}/${this.$route.params.number}`;
          this.dialogIcon = "mdi-lifebuoy";
          this.showSecondButton = true;
          this.firstButton = "plans"
          this.overlay = true
        }
      })
      },
    async getPaypalData() {
      this.overlay = true

      let paypalData = {
        router: "calculate_price",
        number_id: this.$route.params.id,
        plan_type: this.$route.params.plantype,
        days_order: this.$route.params.days,
      };
      this.post(paypalData, false).then(async (response) => {
        console.log(response);
        if (!response.data.session) {
          this.$router.push("/login");
        }
        (this.updatePrice = response.data.update_price),
        (this.planType = response.data.plan_type),
        (this.planPrice = response.data.plan_price);
        this.totalPrice = response.data.total_price;
        this.invoice_id = response.data.invoice_id;
        this.currency = response.data.currency
        this.remainDay = response.data.remaining_days
        let desc = response.data.description;
        let ivoId = response.data.invoice_id;
        let currency = response.data.currency;
        let totalPrice = response.data.total_price;
        let url = response.data.paypal_sdk_id;
        let paypalData = {
          desc: desc,
          ivoId: ivoId,
          currency: currency,
          totalPrice: totalPrice,
        };
        setTimeout(()=>{
          this.overlay = false
          this.paypalButtons = true
        },2000)

        if (response.data.success) {
          this.initPayPalButton(desc, ivoId, "USD", totalPrice, this);
          setTimeout(()=>{
          this.overlay = false
          this.paypalButtons = true
        },2000)

        }

        this.paypalData = paypalData;

        if (response.data.message == "no_downgrade") {
          this.dialog = true;
          this.dialogMainTitle = "error";
          this.dialogErrorRouter = `/support`;
          this.dialogTitle = i18n.t("contact_us");
          this.dialogCardError = response.data.message;
          this.plans = `/plans/${this.$route.params.id}/${this.$route.params.number}`;
          this.dialogIcon = "mdi-lifebuoy";
          this.showSecondButton = true;
          this.firstButton = "plans"
          this.syrianNumber = false
          this.overlay = true
        } else if (response.data.message == "day_order_30_or_180") {
          this.dialog = true;
          this.dialogMainTitle = "error";
          this.dialogErrorRouter = `/support`;
          this.dialogTitle = i18n.t("contact_us");
          this.plans = `/plans/${this.$route.params.id}/${this.$route.params.number}`;
          this.dialogCardError = response.data.message;
          this.dialogIcon = "mdi-lifebuoy";
          this.showSecondButton = true;
          this.firstButton = "plans"
          this.syrianNumber = false
          this.overlay = true
        } else if (response.data.message == "paypal_sdk_id") {
          this.dialog = true;
          this.dialogMainTitle = "error";
          this.dialogErrorRouter = `/support`;
          this.dialogTitle = i18n.t("contact_us");
          this.dialogCardError = response.data.message;
          this.plans = `/plans/${this.$route.params.id}/${this.$route.params.number}`;
          this.dialogIcon = "mdi-lifebuoy";
          this.firstButton = "plans"
          this.syrianNumber = false
          this.showSecondButton = true;
          this.overlay = true
        }
      }).catch(err =>{
        console.log("here an error");
        if (err) {
          this.syrianNumber = false
          this.getSyrianPaypalData()
          this.overlay = false
        }
      })
    },
    stopInit(){
      clearInterval(this.timer)
      window.__proto__.onError = 0
    },
    timerRun(){
window.__proto__.onError = 0
       this.timer = setInterval(() => {
        console.log(window.onApp);
        if (window.onError == 1) {

          this.dialog = true
          this.dialogCardError = "paymeny_info"
          this.dialogMainTitle = "payment_complete"
          this.firstButton = "close"
          this.plans = ''
          this.showSecondButton = false
          window.onError = 0
        }else if (window.onError == 2) {
          this.dialog = true;
          this.dialogMainTitle = "error_payment";
          this.dialogCardError = "dialog_error_payment";
          this.plans =  "";
          this.showSecondButton = false;
         this.firstButton = "close"
         window.onError = 0
        }
      },500)
    },
  },
  created() {
    
    let number = `+${this.$route.params.number}`;
    let checkNumber = parseMax(number);
    if (checkNumber.country == "SY") {
      this.showCopone = true;
      this.syrianNumber = false
      this.overlay = false
      this.getSyrianPaypalData()
    } else {
      this.showCopone = true;
      this.syrianNumber = true
      this.getPaypalData();
      this.timerRun()
    }

  },
  beforeDestroy(){
    clearInterval(this.timer)
  },
  mounted() {
    const generateId = function() {
      // Math.random should be unique because of its seeding algorithm.
      // Convert it to base 36 (numbers + letters), and grab the first 9 characters
      // after the decimal.
      return Math.random()
        .toString(36)
        .substr(2,20)
    };
    console.log(generateId())
    let number = `+${this.$route.params.number}`;
    let checkNumber = parseMax(number);
    if (checkNumber.country == "SY") {
      this.showCopone = true;
    } else {
      this.showCopone = true;
    }
    console.log(checkNumber);
  },
  mixins: [Remote],
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@600&display=swap");
.add-remote-account {
  font-family: "Cairo", sans-serif !important;
  font-size: 0.9125rem;
  height: 100vh;
}
.add-remote-title {
  font-family: "Cairo", sans-serif !important;
}
.path-button {
  text-transform: lowercase;
  font-size: 14px !important;
  font-weight: 300 !important;
}
iframe.component-frame {
  z-index: 0 !important;
}
.paypal-buttons-container {
  max-width: 368px !important;
  margin: auto;
}
.desc-color {
  color: #81217d !important;
  font-size: 1rem !important;
}
.copone-container {
  max-width: 419px !important;
  margin: auto;
}
.f-color{
  color: #33368d
}
</style>
