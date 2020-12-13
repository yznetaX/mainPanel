<template>
  <div class="login-component" v-resize="onResize">
    <OuterToolbar />
    <v-dialog v-model="dialog" max-width="400">
        <v-card>
          <v-toolbar color="secondary" dark dense height="34" flat>
            <v-toolbar-title class="white--text subtitle-1">{{
              $t("error")
            }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-4" v-html="$t(dialogCardError)"></v-card-text>
          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn color="#81217d" @click="dialog = false" small dark>{{
              $t("close")
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    <v-row>
      <v-col cols="4" sm="4" md="7" class="ma-auto" v-if="hideImg">
        <v-img src="../assets/UI/login.svg"></v-img>
      </v-col>
      <v-col cols="12" sm="8" md="5" class="mx-auto">
        <v-card
        flat
        :class="cardMargin"
        class="pa-2 pb-4 margin-top mx-auto">
        <v-form
          ref="form"
          v-model="valid"
          class="px-4 mx-4"
          @submit.prevent="submit()"
          autocomplete="off"
        >
          <v-alert
            color="red darken-4"
            dark
            outlined
            v-show="error"
            transition="fade-transition"
            >{{ loginErrors }}</v-alert
          >
          <v-text-field
            autocomplete="off"
            color="#33368d"
            @keydown="hideError"
            v-model="email"
            :rules="emailRules"
            :label="$t('email')"
            required
            counter
            ref="textField"
          ></v-text-field>
          <v-text-field
            autocomplete="off"
            color="#33368d"
            v-model="password"
            :counter="20"
            :rules="passwordRules"
            @keydown="hideError"
            :label="$t('password')"
            required
            :type="show1 ? 'text' : 'password'"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show1 = !show1"
            ref="textFieldPassword"
          ></v-text-field>
          <v-card-actions class="pa-0">
            <v-btn text color="primary" class="ps-0" @click="goToForgetPassword">
              <span>{{ $t("forget") }}</span>
            </v-btn>
          </v-card-actions>
          <v-card-actions class="pa-0">
            <v-btn text to="/register" class="ps-0">
              <span class="primary--text">{{ $t("register") }}</span>
            </v-btn>
          </v-card-actions>
          <v-row justify="center">
          <v-btn
            class="ma-2"
            color="#33368d"
            type="submit"
            dark
            :loading="showLoading"
          >
            <span>
              {{ $t("login") }}
            </span>
          </v-btn>
          <v-btn class="ma-2" color="orange" dark @click="reset">
            <span>{{ $t("reset") }}</span>
          </v-btn>
          </v-row>

        </v-form>

        <v-snackbar :value="snake" top> </v-snackbar>
      </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import httpHandler from "../mixins/httpHandler.js";
import i18n from "../plugins/i18n";
import { bus } from "../main";
import OuterToolbar from './OuterToolbar'
export default {
  components: {
    OuterToolbar
  },
  data() {
    return {
      show1: false,
      passwordRules: [
        (v) => !!v || i18n.tc("password_is_required"),
        (v) => (v && v.length >= 5) || i18n.tc("password_count"),
      ],
      email: "",
      password: "",
      emailRules: [
        (v) => !!v || i18n.tc("email_is_required"),
        (v) => /.+@.+\..+/.test(v) || i18n.tc("email_valid"),
      ],
      valid: true,
      loginErrors: "",
      error: null,
      snake: false,
      showLoading: false,
      alert: true,
      cardMargin: "",
      sessionId: "session_id",
      hideImg: null,
      dialogCardError: "",
      dialogErrorRouter: "",
      dialogTitle: "",
      dialogIcon: "",
      dialog: false
    };
  },
  props: {
    msg: String,
  },
  methods: {
    onResize(){
      if (window.innerWidth <= 960) {
        this.hideImg = false
      }else {
        this.hideImg = true
      }
    },
    goToForgetPassword(){
      this.$router.push('/forget_password')
    },
    hideError() {
      this.error = false;
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
      this.showLoading = false;
    },
    async submit() {
      this.showLoading = true;
      if (this.$refs.form.validate()) {
        let userInfo = {
          email: this.email,
          password: this.password,
          router: "login",
        };
        await this.post(userInfo, true).then((respone) => {
          this.$store.state.rand_id = respone.data.rand_id;
          localStorage.setItem("rand_id", respone.data.rand_id);
          if (respone.data.success) {
            localStorage.setItem('email', respone.data.email)
            this.$store.state.lat = localStorage.setItem(
              "lat",
              respone.data.location_info.lat
            );
            this.$store.state.lng = localStorage.setItem(
              "lng",
              respone.data.location_info.lng
            );
            setTimeout(() => {
              this.$router.push("/cards");
              bus.$emit("switchedButton", respone.data.session);
            }, 1000);
          } else {
            if (respone.data.message == "activate_your_email") {
              this.$router.push({
                name: "confirmEmail",
                params: {
                  id: respone.data.rand_id,
                },
              });
            }else if (respone.data.message == "account_blocked") {
              this.dialog = true;
              this.dialogCardError = `dialog_login_error.${respone.data.message}`;
            }
            else {
              this.loginErrors = i18n.t(`login_errors.${respone.data.message}`);
              this.error = true;
              this.showLoading = false;
            }
            this.showLoading = false;
          }
        });
      } else {
        this.showLoading = false;
      }
    },

    changeCardMargin() {
      if (!localStorage.getItem(this.sessionId)) {
        this.cardMargin = "mx-auto";
      } else {
        this.cardMargin = "";
      }
    },
  },
  updated() {
    if (this.$refs.textField != undefined) {
      let field = this.$refs.textField.$el.childNodes[0].childNodes[0].childNodes[0].childNodes[1]
      field.classList.add("text-left")
    }
    if (this.$refs.textFieldPassword != undefined) {
      let field = this.$refs.textFieldPassword.$el.childNodes[0].childNodes[0].childNodes[0].childNodes[1]
      field.classList.add("text-left")
    }
  },
  mounted() {
    this.changeCardMargin();
    if (this.$refs.textField != undefined) {
      let field = this.$refs.textField.$el.childNodes[0].childNodes[0].childNodes[0].childNodes[1]
      field.classList.add("text-left")
    }
    if (this.$refs.textFieldPassword != undefined) {
      let field = this.$refs.textFieldPassword.$el.childNodes[0].childNodes[0].childNodes[0].childNodes[1]
      field.classList.add("text-left")
    }
    
  },
  created(){
    bus.$emit("showFooter", true)
  },
  beforeMount(){
    try {
      document.getElementById("app").style.display = "block";
  document.getElementById("loading").style.display = "none";
    }catch(err){
      err
    }
  if(localStorage.getItem("session_id") != null){
      this.$router.push('/cards')
    }
  },
  mixins: [httpHandler],
};
</script>
<style scoped>
.span_color {
  color: #32368b;
}
.margin-top {
  margin-top: 80px !important;
}
</style>
