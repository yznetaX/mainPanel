<template>
  <div class="mujeebk-ai " v-resize="onResize" :class="mbSmallScreen">
    <overlay :overlay="overlay" />
    <v-snackbar v-model="snake" timeout="10000">
      <v-icon color="red darken-4">
        mdi-wifi-off
      </v-icon>
      Network error please try again <v-btn small class="ms-3" @click="$router.go(0)">
        <v-icon small class="me-2">mdi-replay</v-icon> 
        Try again
      </v-btn>
    </v-snackbar>
      <v-card flat>
        <v-card-title
          class="px-2 py-1 secondary--text mujeebk-title"
        >
        <Backword v-if="showBackword" />
        {{$t('privacy_and_security')}}
        </v-card-title>
        <v-card-subtitle
        class="py-4 px-2 subtitle-1"
        v-html="$t('privacy_description')"
      >1
      </v-card-subtitle>
      </v-card >
      <v-card :class="mbSmallScreen" max-width="550" class="ma-auto pa-2 my-6" flat>
        <v-alert outlined close-label  color="red darken-4" type="error" v-model="pricacyError">{{$t(error_privacy)}}</v-alert>
        <v-alert outlined close-label   type="success" v-model="pricacySuccess">{{$t('info_updated')}}</v-alert>
        <v-text-field solo class="" readonly :value="getEmail" append-outer-icon="mdi-email-outline" dense></v-text-field>
        <v-form ref="form"
          v-model="valid"
          @submit.prevent="submit()">
          <v-text-field solo dense :disabled="submitLoader" :type="oldPass ? 'text' : 'password'" :append-outer-icon="oldPass ? 'mdi-eye' : 'mdi-eye-off'" :label="$t('old_password')" @click:append="oldPass = !oldPass" requried v-model="old_password" @keydown="removeError" :rules="oldPassword" ref="textFeildP"></v-text-field>
          <v-text-field
          solo dense
            :disabled="submitLoader"
                :type="show ? 'text' : 'password'"
                :counter="20"
                :label="$t('new_password')"
                required
                :append-outer-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show = !show"
                v-model="password"
                :rules="[passwordRules.required , passwordRules.min]"
                color="secondary"
                @keydown="removeError"
                ref="textFeildT"
              ></v-text-field>
              <v-text-field
              solo dense
              :disabled="submitLoader"
                :counter="20"
                :label="$t('confirm_password')"
                required
                :type="show1 ? 'text' : 'password'"
                :append-outer-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show1 = !show1"
                v-model="confirm_password"
                :rules="[passwordRules.required , passwordRules.min, passwordConfirmationRule]"
                color="secondary"
                @keydown="removeError"
                ref="textFeild"
              ></v-text-field>
              <v-btn small color="primary" class="me-2" :disabled="!valid" @click="submit" :loading="submitLoader">
                <span>{{$t('send_reply')}}</span>
              </v-btn>
              <v-btn small color="orange" dark @click="reset">
                {{$t('reset')}}
              </v-btn>
        </v-form>
      </v-card>
  </div>
</template>
<script>
import i18n from '../plugins/i18n';
import privacy from '../mixins/httpHandler'
import Backword from '../components/Backword'
import overlay from "../components/cirlceOverlay"
export default {
  components:{
    Backword,
    overlay
  },
  data() {
    return {
      marginTop: "",
      show: null,
      show1: null,
      confirm_password: "",
      password: "",
      oldPassword: [(v) => !!v || i18n.tc("old_password_is_required"),],
      passwordRules: {
        required: (v) => !!v || i18n.tc("new_password_is_required"),
        min: (v) => (v && v.length >= 8) || i18n.tc("password_count"),
      },
      valid: true,
      old_password: "",
      oldPass: null,
      submitLoader: false,
      pricacyError: false,
      error_privacy: "",
      pricacySuccess: false,
      getEmail: "",
      mbSmallScreen: "mb-10",
      showBackword: "",
      snake: false,
      overlay: true
    }
  },
  methods: {
    onResize() {
      if (window.innerWidth >= 1250) {
        this.showBackword = true
      }
      if (window.innerWidth < 1250) {
        this.showBackword = false
      }
      if (window.innerWidth <= 600) {
        this.marginTop = "my-5";
        this.mbSmallScreen = "mb-10"
      }
      if (window.innerWidth <= 300) {
        this.marginTop = "my-7";
      }
      if (window.innerWidth > 600) {
        this.marginTop = "";
        this.mbSmallScreen = "mb-3"
      }
    },
    checkSessionState() {
      this.post({ router: "session_status" }, false).then((respone) => {
        this.getEmail = respone.data.email
        this.overlay = false
        if (
          respone.data.session == false ||
          localStorage.getItem("session_id") == null
        ) {
          this.$router.push("/login");
        }
      }).catch((err) => {
        if (err) {
          this.snake = true
        }
      })
    },
    async submit(){
      this.pricacyError = false
      if (this.$refs.form.validate()) {
        this.submitLoader = true
        let privacyData = {
          router: 'update_password',
          old_password: this.old_password,
          new_password: this.password,
          confirm_password: this.confirm_password,
        }
        await this.post(privacyData, false).then((response) => {
          if (response.data.success) {
            this.pricacySuccess = true
            this.$refs.form.reset();
            this.submitLoader = false
          } else {
            this.pricacyError = true
            this.error_privacy = i18n.t(`error_privacy.${response.data.message}`)
            this.submitLoader = false
          }
        })
      }
    },
    reset() {
      this.$refs.form.reset();
      this.pricacyError = false
      this.pricacySuccess = false
    },
    removeError(){
      this.pricacyError = false
      this.pricacySuccess = false
    }
  },
  computed: {
    passwordConfirmationRule() {
      return this.password === this.confirm_password || i18n.tc("password_dose_not_match");
    }
  },
  
  
  mounted() {
    this.checkSessionState()
    if (this.$refs.textFeild.$refs.label != undefined) {
      let allow = this.$refs.textFeild.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
    if (this.$refs.textFeildT.$refs.label != undefined) {
      let allow = this.$refs.textFeildT.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
    if (this.$refs.textFeildP.$refs.label != undefined) {
      let allow = this.$refs.textFeildP.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
  },
  updated() {
    if (this.$refs.textFeild.$refs.label != undefined) {
      let allow = this.$refs.textFeild.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
    if (this.$refs.textFeildT.$refs.label != undefined) {
      let allow = this.$refs.textFeildT.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
    if (this.$refs.textFeildP.$refs.label != undefined) {
      let allow = this.$refs.textFeildP.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
  },
  mixins:[privacy]
}
</script>
