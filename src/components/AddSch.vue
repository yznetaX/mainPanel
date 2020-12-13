<template>
  <div class="px-2 mb-16" v-resize="onResize">
    <v-dialog v-model="dialog" max-width="400" persistent>
        <v-card>
          <v-toolbar color="secondary" dark dense height="34" flat>
            <v-toolbar-title class="white--text subtitle-1">{{
              $t("upgrade_your_plan")
            }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-4" v-html="$t(dialogCardError)"></v-card-text>
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
              :to="dialogErrorRouter"
              router
              class="ms-2"
            >
              <v-icon class="me-1" small>
                {{ dialogIcon }}
              </v-icon>
              <span>{{ dialogTitle }}</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    <vue-topprogress
      ref="topProgress"
      :color="'#81217d'"
      :height="3"
    ></vue-topprogress>
    <v-overlay :value="overlay" color="white" opacity="1">
        <v-row align-content="center" justify="center" :class="loadingPadding">
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
    <v-alert border="left" colored-border type="info" elevation="2" v-if="smallScreen">
        {{$t('best_ux_report')}}
      </v-alert>
      <cardConfirm ref="confirm"/>
    <v-card flat>
      <v-card-title
          class="mujeebk-title secondary--text px-0"
        >
        <Backword v-if="showBackword" />
          {{ $t("sch_messages") }}
        </v-card-title>
        <v-card-subtitle
          class="subtitle-1 font-weight-regular pb-0 px-0"
          style="font-family: 'Cairo', sans-serif !important;"
        >
          {{ $t("sch_description") }}
        </v-card-subtitle>
      <v-card-actions class="px-0">
        <v-btn color="secondary" small class="mb-4" @click="addNewSch">
          <v-icon>mdi-plus</v-icon>
          <span> {{$t('add')}} {{ $t("sch_message") }} </span>
        </v-btn>
      </v-card-actions>
      <v-card v-if="getschlist == undefined" flat class="mx-auto d-block">
        <v-img src="../assets/empty.png" max-width="350" class="mx-auto"></v-img>
        <v-row justify="center">
          <v-subheader class="text-h6">{{$t('there_is_no_sch')}} 🚀</v-subheader>
        </v-row>
      </v-card>
      <v-card flat v-else>
        <v-lazy>
          <v-simple-table fixed-header class="sch-table">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="">{{ $t("message_type") }}</th>
                  <th class="text-center">{{ $t("recipient_count") }}</th>
                  <th class="text-center">{{ $t("start_time") }}</th>
                  <th class="text-center">{{ $t("status") }}</th>
                  <th class="text-center">{{$t('delete')}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(sch, index) in getschlist" :key="index" @click="goToThisSch(sch.status, sch.id)" style="cursor:pointer">
                  <td>
                    {{ $t(`dialog_types.${sch.message_type}`) }}
                  </td>
                  <td class="text-center">
                    <v-icon>mdi-account</v-icon>
                    {{ sch.recipient_count }}
                  </td>
                  <td class="text-center">
                    {{ sch.start_time }}
                  </td>
                  <td class="text-center" style="width:121px">
                    <v-chip class="d-block text-center" style="width: 100%" :color="sch.status == '0'? 'orange': 'secondary'" small dark>
                      <span class="text-center">
                        {{ sch.status == "0" ? $t("pending") : $t("ending") }}
                      </span>
                    </v-chip>
                  </td>
                  <td class="text-center">
                    <v-btn icon @click="deleteSch(sch.id)">
                      <v-icon>
                        mdi-close
                      </v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-lazy>
      </v-card>
      
    </v-card>
  </div>
</template>
<script>
import { bus } from '../main';
import addSch from "../mixins/httpHandler";
import i18n from '../plugins/i18n';
import cardConfirm from './cardConfirm'
import Backword from './Backword'
export default {
  components:{
    cardConfirm,
    Backword
  },
  data() {
    return {
      getschlist: [],
      smallScreen: null,
      isDeleteBtn: false,
      overlay: true,
      loadingPadding: '',
      planBlur: "",
      showBlurOverlay: true,
      dialog: false,
      dialogCardError: "",
      dialogErrorRouter: "",
      dialogIcon: "",
      dialogTitle: "",
      showBackword: ""
    };
  },
  methods: {
    async deleteSch(id){
      let deleteSchData = {
        router: "delete_schedule",
        number_id: this.$route.params.id,
        schedule_id: id,
      }
      this.isDeleteBtn = true
      let deletedSch = i18n.t("deleted_sch");
      const res = await this.$refs.confirm.open("confirm", deletedSch);
      if (res) {
        this.post(deleteSchData , false).then(async (response) => {
        if (response.data.session) {
          await this.getSchList()
          bus.$emit('deleteCard')
        }else{
          this.$router.push('/login')
        }
        if (response.data.session == false) {
          this.$router.push("/login").catch((err) => err);
        }
      })
      }
      
    },
    onResize(){
      if (window.innerWidth < 600) {
        this.smallScreen = true
      }else {
        this.smallScreen = false
      }
      if (window.innerWidth >= 1250) {
        this.showBackword = true
        if (i18n.locale == "en" || localStorage.getItem("local_lang") == "en") {
          this.loadingPadding = "englishPadding";
        }
        if (i18n.locale == "ar" || localStorage.getItem("local_lang") == "ar") {
          this.loadingPadding = "arabicPadding";
        }
      }
      if (window.innerWidth < 1250) {
        this.showBackword = false
        this.loadingPadding = "";
      }
    },
    getSchList() {
      let getSchList = {
        router: "get_schedule_list",
        number_id: this.$route.params.id,
      };
      this.post(getSchList, false).then((response) => {
        if (response.data.message === "plan_error") {
          this.dialog = true
          this.dialogErrorRouter = `/plans/${this.$route.params.id}/${response.data.phone_number}`;
          this.dialogTitle = i18n.t('upgrade');
          this.dialogCardError = i18n.t("silver_plan_error_sch");;
          this.dialogIcon = "mdi-update";
        }else {
          this.planBlur = ""
          this.showBlurOverlay = false
        }
        if (response.data.session) {
          this.getschlist = response.data.schedule;
          this.overlay = false
        }else{
          this.$router.push('/login')
        }
        
      });
    },
    goToThisSch(status,id){
      let deleted = this.isDeleteBtn
      if (deleted !== true) {
        this.$router.push({
        name :"newSch",
        params: {
          id: this.$route.params.id,
          new: id,
        }
      })
      bus.$emit('shareTableStatus', status)
      }
    },
    addNewSch(){
      this.$router.push({
        name: "newSch",
        params: {id: this.$route.params.id, new: "new"}
      })
    }
  },
  mounted() {
    this.getSchList()
    bus.$on('refreshSch', async () => {
      this.$refs.topProgress.start();
      await this.getSchList()
      this.$refs.topProgress.done();
    })
  },
  mixins: [addSch],
};
</script>
<style lang="scss">
.theme--light.sch-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper){
background: #e3e3ed !important;
transition: all .2s ease-in-out;
}
.sch-table > .v-data-table__wrapper{
  overflow-x: auto !important;
}
.englishPadding {
  padding: 0 30px 0 270px !important;
}
.arabicPadding {
  padding: 0 270px 0 30px !important;
}
</style>
