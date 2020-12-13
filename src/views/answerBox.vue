<template>
  <div class="automated-answer" v-resize="onResize">
    <v-snackbar v-model="snake" timeout="10000">
      <v-icon color="red darken-4">
        mdi-wifi-off
      </v-icon>
      Network error please try again <v-btn small class="ms-3" @click="$router.go(0)">
        <v-icon small class="me-2">mdi-replay</v-icon> 
        Try again
      </v-btn>
    </v-snackbar>
    <conf ref="confirm" />
    <v-dialog v-model="dialog" max-width="400" persistent>
      <v-card>
        <v-toolbar color="secondary" dark dense height="34" flat>
          <v-toolbar-title class="white--text subtitle-1">{{
            $t("upgrade_your_plan")
          }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-4">{{ $t(dialogCardError) }}</v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn color="orange" dark @click="$router.push('/cards')" small>
            <v-icon small class="me-1">
              mdi-whatsapp
            </v-icon>
            {{ $t("dashboard") }}</v-btn
          >
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
    <v-dialog v-model="dialogFree" max-width="400" persistent>
      <v-card>
        <v-toolbar color="secondary" dark dense height="34" flat>
          <v-toolbar-title class="white--text subtitle-1">{{
            $t("upgrade_your_plan")
          }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-4">{{ $t(dialogCardErrorFree) }}</v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn
            color="orange"
            dark
            @click="dialogFree = false"
            small
            :to="firstRouter"
          >
            <v-icon small class="me-1">
              mdi-update
            </v-icon>
            {{ $t("to_planns") }}</v-btn
          >
          <v-btn
            small
            color="secondary"
            @click="dialogFree = false"
            :to="secondRouter"
            class="ms-2"
          >
            <v-icon class="me-1" small>
              {{ dialogIconFree }}
            </v-icon>
            <span>{{ dialogTitleFree }}</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card flat class="px-2">
      <v-card-title class="px-0 pt-1 secondary--text mujeebk-title">
        <v-btn
        
    color="grey lighten-1"
    small
    dark
    class="me-2 button-backword"
    @click="backToScenarios"
    v-if="$route.fullPath == '/cards' ? false : true && showBackword"
  >
    <v-icon>
      {{ arrowWithLang }}
    </v-icon>
  </v-btn>
        {{ $t("automated_answers") }}
      </v-card-title>
      <v-card-subtitle
        class="subtitle-1 font-weight-regular pb-0 px-0"
        style="font-family: 'Cairo', sans-serif !important;"
      >
        {{ $t("mujeebk_web") }}
      </v-card-subtitle>
      <v-card-actions class="pb-0 px-0">
        <v-text-field
          color="secondary"
          name="title"
          :label="$t('title')"
          :placeholder="placeholderTitle"
          id="id"
          outlined
          dense
          v-model="title"
          @keyup="shareTitle"
        ></v-text-field>
      </v-card-actions>
    </v-card>
    <v-row>
      <v-col cols="12" xs="12" sm="12" md="12" class="pt-0">
        <v-card
          color="transparent bg"
          flat
          class="pa-4 px-2 pt-0 mb-8"
          scrollable
          height="100%"
        >
          <automated />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import automated from "../components/automated/Conversation";
import checkSessionAutomatedAnswer from "../mixins/httpHandler";
import { bus } from "../main";
import i18n from "../plugins/i18n";
import conf from '../components/warningConfirn'
export default {
  components: {
    automated,
    conf
  },
  data() {
    return {
      sessionId: "session_id",
      title: "",
      oldTitle: "",
      hasSession: false,
      noPlan: "",
      showBlurOverlay: true,
      dialog: false,
      dialogCardError: "",
      dialogErrorRouter: "",
      dialogIcon: "",
      dialogTitle: "",
      dialogFree: false,
      dialogCardErrorFree: "",
      firstRouter: "",
      secondRouter: "",
      dialogTitleFree: "",
      dialogIconFree: "",
      componentKey: 0,
      showBackword: "",
      dialogSave: false,
      userState: null,
      snake: false,
      arrowWithLang: "",
      smallScreen: ""
    };
  },
  watch: {
    async $route(to,from,next){
      let isEdit = localStorage.getItem(`${this.$route.params.id}_${this.$route.params.new}_is_edited`)
      let convIsEdit = isEdit == "true" ? true : false
      console.log(convIsEdit);
      if (convIsEdit) {
      const res = await this.$refs.confirm.open();
      if (res) {
        console.log("1one");
        next();
      } else {
        console.log(`/scenario/${from.params.id}/${from.params.new}`);
        this.$router.push(`/scenario/${from.params.id}/${from.params.new}`).catch((err) => {
          err
        })
      }
    }else {
      next()
    }
    }
  },
  methods: {
    backToScenarios(){
      this.$router.push(`/scenario/${this.$route.params.id}`)
    },
    onResize() {
      if (window.innerWidth >= 1250) {
        this.showBackword = true;
      }
      if (window.innerWidth < 1250) {
        this.showBackword = false;
      }
    },
    knowScenarioPlan() {
      let scenarioPlan = {
        router: "scenario_plan",
        number_id: this.$route.params.id,
        scenario_id:
          this.$route.params.new === "new" ? null : this.$route.params.new,
      };
      this.post(scenarioPlan, false).then((response) => {
        console.log(response);
        if (response.data.message == "scenario_1_plan_error") {
          if (this.$store.state.scenarios_list.length != 0) {
            let scenarios = this.$store.state.scenarios_list;
            // let scenario_id = scenarios[0].scenario_id;
            let scenario_title = scenarios[0].title
            this.title = scenario_title
            this.$store.state.title = scenario_title
            localStorage.setItem("existing_title", scenario_title);
            this.dialogFree = true;
            this.firstRouter = `/plans/${this.$route.params.id}/${response.data.phone_number}`;
            this.dialogTitleFree = i18n.t("scenarios");
            this.secondRouter = `/scenario/${this.$route.params.id}`;
            this.dialogCardErrorFree = i18n.t("silver_plan_error");
            this.dialogIconFree = "mdi-text-box-outline";
          } else {
            this.dialogFree = true;
            this.firstRouter = `/plans/${this.$route.params.id}/${response.data.phone_number}`;
            this.dialogTitleFree = i18n.t("scenarios");
            this.secondRouter = `/scenario/${this.$route.params.id}`;
            this.dialogCardErrorFree = i18n.t("silver_plan_error");
            this.dialogIconFree = "mdi-text-box-outline";
          }
        } else if (response.data.message == "scenario_3_plan_error") {
          this.dialog = true;
          this.dialogErrorRouter = `/plans/${this.$route.params.id}/${response.data.phone_number}`;
          this.dialogTitle = i18n.t("upgrade");
          this.dialogCardError = i18n.t("gold_plan_error");
          this.dialogIcon = "mdi-update";
        } else if (response.data.message == "scenario_5_plan_error") {
          this.dialog = true;
          this.dialogTitle = i18n.t("scenarios");
          this.dialogErrorRouter = `/scenario/${this.$route.params.id}`;
          this.dialogCardError = i18n.t("dim_plan_error");
          this.dialogIcon = "mdi-text-box-outline";
        } else {
          this.noPlan = "";
          this.showBlurOverlay = false;
        }
      });
    },
    shareTitle() {
      this.$store.state.title = this.title;
      if (this.$route.params.new == "new") {
        localStorage.setItem(
          `${this.$route.params.id}_${this.$route.params.new}_is_edited`,
          true
        );
      } else {
        localStorage.setItem(
          `${this.$route.params.id}_${this.$route.params.new}_is_edited`,
          true
        );
      }
    },
    checkSessionState() {
      this.post({ router: "session_status" }, false).then((respone) => {
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
    closeStay(val){
      this.userState = val
    }
  },
  beforeMount() {},
  async beforeRouteLeave(to,from,next) {
    console.log(to);
    console.log("here i am");
    console.log(from);
    let isEdit = localStorage.getItem(`${this.$route.params.id}_${this.$route.params.new}_is_edited`);
    let editTrue = isEdit == "true" ? true : false
    console.log(editTrue)
    if (editTrue) {
      const res = await this.$refs.confirm.open();
      if (res) {
        console.log("1one");
        next();
      } else {
        console.log(`/scenario/${from.params.id}/${from.params.new}`);
        this.$router.push(`/scenario/${from.params.id}/${from.params.new}`).catch((err) => {
          err
        })
      }
    }else {
      next()
    }
  },
  mounted() {
    this.knowScenarioPlan();
    this.checkSessionState();
    bus.$emit("subtitle", this.placeholderTitle);
    this.$store.state.subtitle = this.placeholderTitle;
    this.title = localStorage.getItem("existing_title") || this.$route.params.title || 
      this.$store.state.title ;
      if (i18n.locale == "en") {
      this.arrowWithLang = "mdi-arrow-left";
    } else {
      this.arrowWithLang = "mdi-arrow-right";
    }
    bus.$on("englishLang", () => {
      this.arrowWithLang = "mdi-arrow-left";
    });
    bus.$on("arabicLang", () => {
      this.arrowWithLang = "mdi-arrow-right";
    });
  },
  updated() {},
  computed: {
    placeholderTitle() {
      let scenarioLength = parseInt(localStorage.getItem("scenario_number"));
      if (scenarioLength == undefined || isNaN(scenarioLength)) {
        return (scenarioLength = parseFloat(
          localStorage.setItem("scenario_number", 0)
        ));
      } else {
        let addOne = (scenarioLength += 1);
        return i18n.t("scenario") + " #" + addOne;
      }
    },
  },
  mixins: [checkSessionAutomatedAnswer],
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@600&display=swap");
.automated-answer {
  font-family: "Cairo", sans-serif !important;
  font-size: 0.9125rem;
  height: 100vh;
}
.headline {
  font-family: "Cairo", sans-serif !important;
}
.v-application .headline {
  font-family: "Cairo", sans-serif !important;
}
</style>
