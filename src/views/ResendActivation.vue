<template>
  <div>
    <OuterToolbar />
    <v-snackbar top v-model="snack" v-if="error" color="red darken-3" class="subtitle-1">{{ errorMessage }}</v-snackbar>
    <v-card
      max-width="450"
      style="margin-top: 100px;"
      flat
      elevation="0"
      class="mx-auto"
    >
      <v-card-subtitle
        class="text-center d-block font-weight-light text-h4 text-sm-h4"
        style="letter-spacing: -0.52156px !important;font-family: Cairo !important;"
      >
        {{ $t("resend_this_activation") }}
      </v-card-subtitle>
      <v-card-subtitle class="text-center py-1">
        {{ $t("resend_activation_page") }}
      </v-card-subtitle>
      <v-card-subtitle class="text-center py-1">
        {{ $t("activation_time") }}
      </v-card-subtitle>
      <v-card-actions>
        <vue-recaptcha
          class="mx-auto"
          sitekey="6LdKdL4ZAAAAACR-RAPzdul19eaJe90Ro3xFD45h"
          ref="recaptcha"
          @verify="onVerify"
          @expired="onExpired"
        ></vue-recaptcha>
      </v-card-actions>
      <v-card-actions>
        <v-btn :loading="resendLoading" class="d-block mx-auto" block rounded color="secondary" @click="resendActivationCode" :disabled="sendDisabled">
          {{ $t("send") }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-row justify="center">
      <v-btn class="mt-2 mx-auto" text  id="dec" color="primary" :to="`/login`">
        <v-icon>mdi-undo-variant</v-icon>
        <span class="backToButton">{{$t('back_to')}} {{$t('login_page')}}</span>
      </v-btn>
    </v-row>

  </div>
</template>
<script>
import i18n from "../plugins/i18n";
import resend from "../mixins/httpHandler";
import VueRecaptcha from "vue-recaptcha";
import OuterToolbar from '../components/OuterToolbar'
import { bus } from "../main";
export default {
  components: {
    VueRecaptcha,
    OuterToolbar
  },
  data() {
    return {
      snack: false,
      error: false,
      errorMessage: "",
      email: "",
      sendDisabled: true,
      recapatcha: "",
      resendLoading: false
    };
  },
  methods: {
    toLogin(){
      this.$router.push('/login')
    },
    async getRandId() {
      let getEmailData = {
        router: "get_email_by_rand_id",
        rand_id: this.$route.params.id,
      };
      await this.post(getEmailData, false).then(async (response) => {
        if (response.data.success) {
          this.email = response.data.email;
        } else {
          this.error = true;
          this.errorMessage = i18n.t(response.data.message);
        }
      });
    },
    onVerify: function (response) {
      if (response != undefined) {
        this.sendDisabled = false
        this.recapatcha = response
      } else {
        this.sendDisabled = true
      }
    },
    onExpired: function () {
      this.sendDisabled = true
    },
    resendActivationCode(){
      this.resendLoading = true
      let resendData = {
        router: "resend_confirmation",
        recaptcha: this.recapatcha,
        rand_id: this.$route.params.id
      }
      this.post(resendData, false).then((response) => {
        if (response.data.success) {
          this.$router.push({name:'confirmEmail' ,params: {
            id: this.$route.params.id
          }})
          this.resendLoading = false
        } else {
          this.error = true
          this.resendLoading = false
          this.errorMessage = i18n.t(response.data.message)
        }
      })
    }
  },
  mounted() {
    this.getRandId();
  },
  created() {
    document.getElementById("app").style.display = "block";
    document.getElementById("loading").style.display = "none";
    bus.$emit("showFooter", true)
  },
  beforeMount() {
    this.getRandId();
  },
  mixins: [resend],
};
</script>
