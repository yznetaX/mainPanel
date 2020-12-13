<template>
  <div v-resize="onResize">
    <OuterToolbar />
    <v-row :class="onHideImg">
      <v-col cols="6" sm="12" md="6" class="mx-auto" v-if="hideImg">
        <v-img src="../assets/UI/confirm.svg" class="mx-auto"></v-img>
      </v-col>
      <v-col :cols="forgetnCols" :md="forgetnCols" class="ma-auto">
    <v-card falt elevation="0">
      <v-card-subtitle class="text-center d-block font-weight-light text-h4 text-sm-h4 py-1" style="letter-spacing: -0.5px !important;font-family: Cairo !important;">
        {{ $t("almost_done") }}
      </v-card-subtitle>
      <v-card-subtitle class="text-center py-1">
        {{$t('activation')}} <span class="primary--text">{{email}} </span>
      </v-card-subtitle>
      <v-card-subtitle class="py-1 text-center">
        <span>{{$t('click_to_login')}}</span>
        <a  class="px-0 font-weight-bold deco"  @click="toIndex">
          {{$t("click_button_to_login")}}
        </a>
      </v-card-subtitle>
      <v-card-subtitle class="text-center py-1">
        <span>
          {{$t('activation_time')}},
        </span>
        {{$t('resend_activation.part_one')}}<a class="deco px-0 mx-2 subtitle-1 font-weight-bold" color="secondary" @click="toResend">{{$t('resend_activation.part_two')}}</a>{{$t('resend_activation.part_three')}}
      </v-card-subtitle>
    </v-card>
      </v-col>
    </v-row>
    <v-overlay color="white" opacity="1" :value="overlay" z-index="9"></v-overlay>
    <v-snackbar top v-model="snack" v-if="error">{{errorMessage}}</v-snackbar>
  </div>
</template>
<script>
import confirmEmail from '../mixins/httpHandler'
import i18n from '../plugins/i18n'
import OuterToolbar from '../components/OuterToolbar'
import { bus } from "../main";
export default {
  components: {
    OuterToolbar
  },
  data() {
    return {
      snack: false,
      errorMessage:"",
      error: false,
      overlay: true,
      email: "",
      hideImg: null,
      onHideImg: "",
      forgetnCols: "6"
    }
  },
  methods: {
    toIndex(){
      this.$router.push('/login')
    },
    onResize(){
      if (window.innerWidth <= 960) {
        this.hideImg = false
        this.onHideImg = "mt-16"
        this.forgetnCols = "12"
      }else{
        this.hideImg = true
        this.onHideImg = ""
        this.forgetnCols = "6"
      }
    },
    toResend(){
      this.$router.push({name:'resendActivation' ,params: {
        id: this.$route.params.id
      }})
    },
    async getRandId(){
          let getEmailData = {
        router: "get_email_by_rand_id",
        rand_id: this.$route.params.id
      }
      await this.post(getEmailData ,false).then(async (response) => {
        if (response.data.success) {
          this.email = response.data.email
          this.overlay = false
        } else {
          this.overlay = false
          this.error = true
          this.errorMessage = i18n.t(response.data.message)
        }
      })
    }
  },
  async mounted() {
    await this.getRandId()
  },
  created() {
    document.getElementById("app").style.display = "block";
    document.getElementById("loading").style.display = "none";
    bus.$emit("showFooter", true)
  },
  async beforeMount() {
  },
  mixins: [confirmEmail]
}
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@600&display=swap");
.v-application .display-1{
  font-family: "Cairo" !important;
}
.deco{
  text-decoration: none;
  font-weight: bold;
    font-size: 16px;
}
</style>