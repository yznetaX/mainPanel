<template>
  <div class="foreget-password">
    <v-row>
      <v-col cols="12" sm="6" md="6" class="ma-auto">
    <v-card
      max-width="450"
      style="margin-top: 100px;"
      flat
      elevation="0"
      class="mx-auto">
      <v-card-actions>
        <img
          src="../assets/mujeebk_final.svg"
          class="mx-auto mujeebk-logo"
          style="cursor:pointer"
          @click="$router.push('/login')"
        />
      </v-card-actions>
      <v-alert
          color="red darken-4 mt-2"
          type="error"
          outlined
          v-model="showError"
          dark
          >{{ dialogModalErrorNumber }}
      </v-alert>
      <v-card-actions>
        <v-text-field
          ref="email"
          color="#33368d"
          @keydown="removeError"
          v-model="email"
          :rules="emailRules"
          :disabled="resetLoading"
          :label="$t('email')"
          required
        ></v-text-field>
      </v-card-actions>
      <v-card-actions>
        <v-btn
          class="d-block mx-auto"
          block
          rounded
          color="orange"
          dark
          @click="resetPassword"
          :loading="resetLoading"
          @keydown.enter="resetPassword"
        >
          {{ $t("forget_password") }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-row justify="center">
      <v-btn class="mt-2 mx-auto text-center" text id="dec" color="primary" :to="`/login`">
        <v-icon>mdi-undo-variant</v-icon>
        <span class="backToButton">{{$t('back_to')}} {{$t('login_page')}}</span>
      </v-btn>
    </v-row>
      
      </v-col>
    </v-row>

  </div>
</template>
<script>
import i18n from "../plugins/i18n";
import resetPassword from "../mixins/httpHandler";
import { bus } from '../main';
export default {
  data() {
    return {
      email: "",
      emailRules: [
        (v) => !!v || i18n.tc("email_is_required"),
        (v) => /.+@.+\..+/.test(v) || i18n.tc("email_valid"),
      ],
      showError: false,
      dialogModalErrorNumber: "",
      resetLoading: false,
      hideImg: null
    };
  },
  methods: {
    resetPassword() {
      if (this.$refs.email.valid) {
        this.resetLoading = true
        let resetPasswordData = {
          router: "forget_password",
          email: this.email,
        };
        this.post(resetPasswordData, false).then((response) => {
          this.resetLoading = false
          if (response.data.success) {
            this.$router.push('/forgeten_password')
            bus.$emit('shareEmail', this.email)
            this.$store.state.resetEmail = this.email
          }else {
            this.resetLoading = false
            this.showError = true;
            this.dialogModalErrorNumber = i18n.t(`${response.data.message}`)
          }
        });
      } else {
        this.resetLoading = false
        this.showError = true;
        this.dialogModalErrorNumber = i18n.t("email_is_required")
      }
    },
    removeError(){
      this.showError = false
    }
  },
  updated() {
    if (this.$refs.email != undefined) {
      let field = this.$refs.email.$el.childNodes[0].childNodes[0].childNodes[0].childNodes[1]
      field.classList.add("text-left")
    }
  },
  mounted() {
    if (this.$refs.email != undefined) {
      let field = this.$refs.email.$el.childNodes[0].childNodes[0].childNodes[0].childNodes[1]
      field.classList.add("text-left")
    }
  },
  created(){
    bus.$emit("showFooter", true)
  },
  mixins: [resetPassword],
};
</script>
