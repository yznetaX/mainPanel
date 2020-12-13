<template>
  <v-card id="create">
    <logout-confirm ref="confirm"  :dark="true" :color="'secondary'" />
    <v-speed-dial
      v-outside="clickOutSide"
      v-model="fab"
      :bottom="bottom"
      :right="right"
      :left="left"
      :open-on-hover="hover"
      :transition="transition"
      fixed
    >
      <template v-slot:activator>
        <v-btn fab color="secondary" v-model="fab">
          <v-icon v-if="fab">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-wrench
          </v-icon>
        </v-btn>
      </template>
      <v-btn fab @click="toCards">
        <v-icon>
          mdi-whatsapp
        </v-icon>
        <div class="fab-text-custom-floating grey darken-1 white--text">
          {{ $t("phone_numbers") }}
        </div>
      </v-btn>      
      <v-btn fab @click="toQrScane">
        <v-icon>
          mdi-qrcode-plus
        </v-icon>
        <div class="fab-text-custom-floating grey darken-1 white--text">
          {{ $t("add_whats_account") }}
        </div>
      </v-btn>
      <v-btn fab @click="toSupport">
        <v-icon>
          mdi-lifebuoy
        </v-icon>
        <div class="fab-text-custom-floating grey darken-1 white--text">
          {{ $t("support") }}
        </div>
      </v-btn>
      <v-btn fab @click="toLogout">
        <v-icon>
          mdi-logout
        </v-icon>
        <div class="fab-text-custom-floating grey darken-1 white--text">
          {{ $t("logout") }}
        </div>
      </v-btn>
    </v-speed-dial>
  </v-card>
</template>

<script>
import flaotActionButton from '../mixins/httpHandler'
import {bus} from '../main'
import i18n from '../plugins/i18n';
import confirm from './cardConfirm'
export default {
  components:{
    "logout-confirm": confirm
  },
  data: () => ({
    direction: "top",
    fab: false,
    fling: false,
    hover: false,
    tabs: null,
    top: false,
    bottom: true,
    left: false,
    right: true,
    transition: "slide-y-reverse-transition",
    tooltip: false,
  }),
  methods: {
    clickOutSide() {
      this.fab = false;
      // do something - probably hide the dropdown menu / modal etc.
    },
    toQrScane() {
      this.fab = false;
      this.$router.push("/mujeebk_web");
    },
    toCards(){
      this.fab = false;
      this.$router.push("/cards");
    },
    toSupport(){
      this.fab = false
      this.$router.push("/support")
    },
    async toLogout(){
      let stopAllConfirm = i18n.t("log_out_confirm");
      if (await this.$refs.confirm.open("confirm_log_out", stopAllConfirm)) {
        this.post({ router: "logout" }, false).then(() => {
        localStorage.removeItem("session_id");
        this.$router.push("/login");
        localStorage.removeItem("lat");
        localStorage.removeItem("lng");
        localStorage.removeItem("rand_id");
        this.$store.state.rand_id = "";
        bus.$emit("hideButton");
      });
      }
    },
  },
  created() {
    this.tooltip = true;
  },
  mixins:[flaotActionButton]
};
</script>
<style>
.fab-text-custom-floating {
  position: absolute;
  right: 80px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 3px 8px;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  border-radius: 2px;
}
</style>
