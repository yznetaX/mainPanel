<template>
    <div v-resize="onResize">
      <OuterToolbar />
      <v-row>
                <v-col cols="12" md="7" v-if="hideImg">
          <v-img max-height="500" src="../assets/UI/register.svg"></v-img>
        </v-col>
        <v-col cols="12" md="5" class="pb-0">
                <v-card flat max-width="550" :class="cardMargin" class="pa-2 pb-4 margin-top mx-auto">
        <v-alert
          class="mx-4"
          color="red darken-4"
          outlined
          v-if="error_email_exist"
          close-label
          v-html="$t(error_email_exist)"
          ></v-alert
        >
        <v-form
          ref="form"
          v-model="valid"
          class="px-4 mx-4"
          @submit.prevent="submit()"
        >
          <v-row>
            <v-col cols="12" class="py-0">
              <v-text-field
              autocomplete="off"
                :counter="20"
                :rules="nameRules"
                :label="$t('full_name')"
                required
                v-model="full_name"
                color="secondary"
                ref="one"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-text-field
              autocomplete="off"
                v-model="email"
                :rules="emailRules"
                :label="$t('email')"
                required
                color="secondary"
                ref="two"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-text-field
                :type="show ? 'text' : 'password'"
                :counter="20"
                :label="$t('password')"
                required
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show = !show"
                v-model="password"
                :rules="[passwordRules.required , passwordRules.min]"
                color="secondary"
                ref="three"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-text-field
                :counter="20"
                :label="$t('confirm_password')"
                required
                :type="show1 ? 'text' : 'password'"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show1 = !show1"
                v-model="confirm_password"
                :rules="[passwordRules.required , passwordRules.min, passwordConfirmationRule]"
                color="secondary"
                @keydown="removeError"
                ref="four"
              ></v-text-field>
            </v-col><vue-recaptcha class="mx-auto" sitekey="6LdKdL4ZAAAAACR-RAPzdul19eaJe90Ro3xFD45h" ref="recaptcha"
          @verify="onVerify"
          @expired="onExpired"
          ></vue-recaptcha>
          </v-row>
          <v-alert
            color="red darken-4"
            dark
            outlined
            v-show="show_password_error"
            transition="fade-transition"
            >{{ password_error }}</v-alert>
          <v-row justify="center">
            <v-btn
            class="ma-2"
            color="secondary"
            :disabled="!valid"
            type="submit"
            ref="signupButton"
            :loading="buttonLoading"
          >
            <span>
              {{ $t("signup") }}
            </span>
          </v-btn>
          <v-btn class="ma-2" color="orange" dark @click="reset">
            <span>{{ $t("reset") }}</span>
          </v-btn>
          </v-row>
        </v-form>
      </v-card>
        </v-col>
      </v-row>
          <v-row justify="center">
      <v-btn class=" mx-auto text-center" text id="dec" color="primary" :to="`/login`">
        <v-icon>mdi-login</v-icon>
        <span class="backToButton">{{$t('have_an_account')}}</span>
      </v-btn>
    </v-row>
      </div>
</template>

<script>
/*eslint-disable*/
import register from "../mixins/httpHandler";
import i18n from "../plugins/i18n";
import VueRecaptcha from 'vue-recaptcha';
import OuterToolbar from '../components/OuterToolbar'
export default {
  components: { 
    "vue-recaptcha" : VueRecaptcha,
    OuterToolbar
     },
  data() {
    return {
      show1: false,
      show: false,
      nameRules: [
        (v) => !!v || i18n.tc("name_required"),
        (v) => (v && v.length <= 20) || i18n.tc("name_count"),
      ],
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
      emailRules: [
        (v) => !!v || i18n.tc("email_is_required"),
        (v) => /.+@.+\..+/.test(v) || i18n.tc("email_valid"),
      ],
        passwordRules: {
        required: (v) => !!v || i18n.tc("password_is_required"),
        min: (v) => (v && v.length >= 8) || i18n.tc("password_count"),
      },
      valid: true,
      snackbar: false,
      error_email_exist: null,
      password_error: null,
      register_error: null,
      show_password_error: false,
      recapatchaToken: "",
      buttonLoading: false,
      hideImg: null
    };
  },
  computed: {
    passwordConfirmationRule() {
      return this.password === this.confirm_password || i18n.tc("password_dose_not_match");
    }
  },
  methods: {
    onResize(){
      if (window.innerWidth <= 960) {
        this.hideImg = false
      }else {
        this.hideImg = true
      }
    },
    onVerify: function (response) {
      this.recapatchaToken = response
      this.valid = true
    },
    onExpired: function () {
    },
    reset() {
      this.$refs.form.reset();
    },
    removeError() {
      this.show_password_error = false;
      this.$refs.form.validate();
      this.valid = true;
    },
    async submit() {
      this.buttonLoading = true
      if (this.recapatchaToken == "") {
        this.valid = false
        this.buttonLoading = false
      } else {
      if (this.$refs.form.validate()) {
        let userInfo = {
          email: this.email,
          password: this.password,
          full_name: this.full_name,
          recaptcha: this.recapatchaToken,
          router: "signup",
        };
        await this.post(userInfo, false).then(async (respone) => {
          if (respone.data.success) {
            this.$router.push({name: 'confirmEmail', params:{id: respone.data.rand_id}});
          } else { 
            this.error_email_exist = `register_error.${respone.data.message}`;
            this.buttonLoading = false
          }
        });
      }
      }
    },
        changeCardMargin() {
      if (
        !localStorage.getItem(this.sessionId)
      ) {
        this.cardMargin = "mx-auto";
      } else {
        this.cardMargin = "";
      }
    },
  },
  mounted() {
    if (this.$refs.one != undefined) {
      let field = this.$refs.one.$el.childNodes[0].childNodes[0].childNodes[0].childNodes[1]
      field.classList.add("text-left")
    }
    if (this.$refs.two != undefined) {
      let field = this.$refs.two.$el.childNodes[0].childNodes[0].childNodes[0].childNodes[1]
      field.classList.add("text-left")
    }
    if (this.$refs.three != undefined) {
      let field = this.$refs.three.$el.childNodes[0].childNodes[0].childNodes[0].childNodes[1]
      field.classList.add("text-left")
    }
    if (this.$refs.four != undefined) {
      let field = this.$refs.four.$el.childNodes[0].childNodes[0].childNodes[0].childNodes[1]
      field.classList.add("text-left")
    }
  },
  updated() {
    if (this.$refs.one != undefined) {
      let field = this.$refs.one.$el.childNodes[0].childNodes[0].childNodes[0].childNodes[1]
      field.classList.add("text-left")
    }
    if (this.$refs.two != undefined) {
      let field = this.$refs.two.$el.childNodes[0].childNodes[0].childNodes[0].childNodes[1]
      field.classList.add("text-left")
    }
    if (this.$refs.three != undefined) {
      let field = this.$refs.three.$el.childNodes[0].childNodes[0].childNodes[0].childNodes[1]
      field.classList.add("text-left")
    }
    if (this.$refs.four != undefined) {
      let field = this.$refs.four.$el.childNodes[0].childNodes[0].childNodes[0].childNodes[1]
      field.classList.add("text-left")
    }
    try {
      document.getElementById("app").style.display = "block";
    document.getElementById("loading").style.display = "none";
    }catch(err) {
      err
    }
    
  },
  created() {
    this.changeCardMargin();
    bus.$emit("showFooter", true)
  },
  mixins: [register],
};
</script>
<style>
.margin-top {
  margin-top: 40px !important;
}
</style>