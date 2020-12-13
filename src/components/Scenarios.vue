<template>
  <div class="scenarios px-2" v-resize="onResize">
    <cardConfirm ref="confirm" />
    <v-snackbar v-model="snake" timeout="10000">
      <v-icon color="red darken-4">
        mdi-wifi-off
      </v-icon>
      Network error please try again <v-btn small class="ms-3" @click="$router.go(0)">
        <v-icon small class="me-2">mdi-replay</v-icon> 
        Try again
      </v-btn>
    </v-snackbar>
    <vue-topprogress
      ref="topProgress"
      :color="'#81217d'"
      :height="3"
    ></vue-topprogress>
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
          <v-dialog v-model="dialog" max-width="400">
        <v-card>
          <v-toolbar color="secondary" dark dense height="34" flat>
            <v-toolbar-title class="white--text subtitle-1">{{
              $t("upgrade_your_plan")
            }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-4">{{ $t(dialogCardError) }}</v-card-text>
          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn color="orange" dark @click="dialog = false" small>{{
              $t("close")
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
    <v-snackbar v-model="snakeScenarios" text color="red darken-4" top >
      <span v-html="$t(scenarioError)" class="text-subtitle-1"></span>
      <v-btn text @click.native="snakeScenarios = false">{{
        $t("close")
      }}</v-btn>
    </v-snackbar>
    <v-snackbar text top color="red darken-4" v-model="defScenario">
      <v-icon color="red darken-4">mdi-alert</v-icon>
      {{$t('can_not_delete_default_scenario_while_bot_runing')}}
      
    </v-snackbar>
    <div v-if="inalidNumber">
      <v-card flat>
        <v-card-title class="pt-0 secondary--text">
          {{ $t("invalid_number_id") }}
        </v-card-title>
      </v-card>
      <div class="text-center">
        <v-icon :size="iconSize" color="grey lighten-3">
          mdi-emoticon-cry-outline
        </v-icon>
      </div>
    </div>
    <v-card flat>
<v-card-title
          class="px-0 pt-1 secondary--text mujeebk-title"
        >
        <Backword v-if="showBackword" />
          {{ $t("scenarios") }}
        </v-card-title>
        <v-card-subtitle
          class="subtitle-1 font-weight-regular pb-0 px-0"
          style="font-family: 'Cairo', sans-serif !important;"
        >
          {{ $t("scenario_description") }}
        </v-card-subtitle>
      <v-card-actions class="px-0 py-2">
        <v-btn color="secondary" @click="addNewScenarios(scenarios)" small :loading="newScenario">
          <v-icon>mdi-plus</v-icon>
          <span>
            {{ $t("add_scenario") }}
          </span>
        </v-btn>
      </v-card-actions>

      <v-card v-if="scenarios == undefined" flat class="mx-auto d-block">
        <v-img
          src="../assets/empty.png"
          max-width="350"
          class="mx-auto"
        ></v-img>
        <v-row justify="center">
          <v-subheader class="text-h6"
            >{{ $t("there_is_no_scenarios") }} 📃</v-subheader
          >
        </v-row>
      </v-card>
      <v-card-subtitle
        v-else
        v-for="(scenario, i) in scenarios"
        :key="scenario.id"
        :id="scenario.scenario_id"
        class="title py-1 px-0"
      >
        <v-btn color="orange" icon @click="deleteScenario(scenario)">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
        <v-btn
          icon
          :color="scenario.defaultGrayIcon"
          @click="setDefaultScenario(scenario, i)"
          :loading="sec_loader && i == index"
        >
          <v-icon>
            {{ scenario.defaultIcon }}
          </v-icon>
        </v-btn>
        <v-subheader
          class="d-inline-block subtitle-1"
          @click="secnarioRoute(scenario)"
          style="cursor: pointer;font-family: Cairo !important;letter-spacing: -0.2px !important"
        >
          {{ scenario.title }}
        </v-subheader>
        <v-divider class="grey lighten-3"></v-divider>
      </v-card-subtitle>
    </v-card>
  </div>
</template>

<script>
import scenariosPost from "../mixins/httpHandler";
import i18n from "../plugins/i18n";
import { bus } from "../main";
import cardConfirm from "./cardConfirm";
import Backword from '../components/Backword'
export default {
  components: {
    cardConfirm,
    Backword
  },
  data() {
    return {
      nameScenarios: "",
      scenarios: [],
      snakeScenarios: false,
      scenarioError: "",
      routeScenario: "",
      iconColor: "",
      defScenario: false,
      loadhain: [],
      overlay: true,
      dialog: false,
      dialogCardError: "",
      dialogErrorRouter: "",
      inalidNumber: false,
      iconSize: "500",
      loadingPadding: "",
      dialogIcon: "",
      dialogTitle: "",
      showBackword: "",
      process: false,
      snake: false,
      sec_loader: false,
      index: -1,
      dialogFree: false,
      dialogCardErrorFree: "",
      firstRouter: "",
      secondRouter: "",
      dialogTitleFree: "",
      dialogIconFree: "",
      newScenario: false
    };
  },
  methods: {
    onResize() {
      if (window.innerWidth <= 600) {
        this.iconSize = "345";
      }
      if (window.innerWidth > 600) {
        this.iconSize = "500";
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
        this.loadingPadding = "";
        this.showBackword = false
      }
    },
    addNewScenarios() {
      this.newScenario = true
      let scenarioPlan = {
        router: "scenario_plan",
        number_id: this.$route.params.id,
        scenario_id: "new"
      };
      this.post(scenarioPlan, false).then((response) => {
        console.log(response);
        if (!response.data.message) {
          this.$router.push(`/scenario/${this.$route.params.id}/new`)
          this.$store.state.title = "";
          localStorage.removeItem("existing_title")
          this.newScenario = false
        }else {
        if (response.data.message == "scenario_1_plan_error") {
          if (this.$store.state.scenarios_list.length != 0) {
            this.dialog = true;
          this.dialogErrorRouter = `/plans/${this.$route.params.id}/${response.data.phone_number}`;
          this.dialogTitle = i18n.t("upgrade");
          this.dialogCardError = i18n.t("gold_plan_error");
          this.dialogIcon = "mdi-update";
          this.newScenario = false
          } else {
            this.dialog = true;
          this.dialogErrorRouter = `/plans/${this.$route.params.id}/${response.data.phone_number}`;
          this.dialogTitle = i18n.t("upgrade");
          this.dialogCardError = i18n.t("gold_plan_error");
          this.dialogIcon = "mdi-update";
          this.newScenario = false
          }
        } else if (response.data.message == "scenario_3_plan_error") {
          this.dialog = true;
          this.dialogErrorRouter = `/plans/${this.$route.params.id}/${response.data.phone_number}`;
          this.dialogTitle = i18n.t("upgrade");
          this.dialogCardError = i18n.t("gold_plan_error");
          this.dialogIcon = "mdi-update";
          this.newScenario = false
        } else if (response.data.message == "scenario_5_plan_error") {
          this.dialog = true;
          this.newScenario = false
          this.dialogTitle = i18n.t("scenarios");
          this.dialogErrorRouter = `/scenario/${this.$route.params.id}`;
          this.dialogCardError = i18n.t("dim_plan_error");
          this.dialogIcon = "mdi-text-box-outline";
        } else {
          this.noPlan = "";
          this.showBlurOverlay = false;
        }
        }
      });
      
    },
        getAllScenarios() {
      let getAllScenariosData = {
        router: "get_all_scenarios",
        number_id: this.$route.params.id,
      };
      this.post(getAllScenariosData, false).then((response) => {
        if (response.data.session == false) {
          this.$router.push("/login").catch((err) => err);
        }
        console.log(response.data.scenarios_list);
        this.scenarios = response.data.scenarios_list;
        this.$store.state.scenarios_list = response.data.scenarios_list
        if (response.data.scenarios_list) {
          response.data.scenarios_list.forEach((item) =>{
          console.log(item);
          localStorage.removeItem(`_chain_${this.$route.params.id}_${item.scenario_id}`)
          localStorage.removeItem(`_base_chain_${this.$route.params.id}_${item.scenario_id}`)
          localStorage.removeItem(`_deleted_urls_${this.$route.params.id}_${item.scenario_id}`)
          localStorage.removeItem(`_deleted_ids_${this.$route.params.id}_${item.scenario_id}`)
          localStorage.removeItem(`${this.$route.params.id}_${item.scenario_id}_is_edited`)
        })
        }
        
        if (response.data.scenarios_list) {
          localStorage.setItem(
            "scenario_number",
            response.data.scenarios_list.length
          );
        } else {
          localStorage.setItem("scenario_number", 0);
        }
        this.overlay = false;
        this.setDefault();
      }).catch((err) => {
        if (err) {
          this.snake = true
        }
      })
      },
    async deleteScenario(scenario) {
      let deleteScenarioData = {
        router: "delete_scenario",
        number_id: this.$route.params.id,
        scenario_id: scenario.scenario_id,
      };
        let deleteScenario = i18n.t("delete_scenario");
        const res = await this.$refs.confirm.open("confirm", deleteScenario);
        if (res) {
          let base =
              "_base_chain_" +
              this.$route.params.id +
              "_" +
              scenario.scenario_id,
            chain =
              "_chain_" + this.$route.params.id + "_" + scenario.scenario_id,
            deleteChain =
              "_deleted_urls_" +
              this.$route.params.id +
              "_" +
              scenario.scenario_id,
            editedName =
              this.$route.params.id +
              "_" +
              scenario.scenario_id +
              "_is_edited";
          localStorage.removeItem(base);
          localStorage.removeItem(chain);
          localStorage.removeItem(deleteChain);
          localStorage.removeItem(editedName);
          localStorage.removeItem(`_deleted_urls_${this.$route.params.id}_${scenario.scenario_id}`)
              localStorage.removeItem(`_deleted_ids_${this.$route.params.id}_${scenario.scenario_id}`)
              
          this.post(deleteScenarioData, false).then((response) => {
            if (response.data.session == false) {
              this.$router.push("/login").catch((err) => err);
            }
            if (response.data.message) {
              this.snakeScenarios = true;
              this.scenarioError = response.data.message;
            }
            this.getAllScenarios();
            bus.$emit("deleteCard");
          });
        } else {
          return;
        }
    },
    secnarioRoute(scenario) {
      this.$router.push({
        name: "box",
        params: {
          id: this.$route.params.id,
          new: scenario.scenario_id,
          title: scenario.title,
        },
      });
      this.$store.state.title = scenario.title;
      this.$store.state.oldTitle = scenario.title;
      localStorage.setItem("existing_title", scenario.title);
    },
    setDefaultScenario(scenario, i) {
      this.index = i
      this.sec_loader = true
      let setDefaultData = {
        router: "set_default_scenario",
        number_id: this.$route.params.id,
        scenario_id: scenario.scenario_id,
      };
      // let isDef = scenario.is_default == "true" ? true : false
      if (scenario.is_default) {
        return true;
      } else {
        this.post(setDefaultData, false).then(async (response) => {
          console.log(response)
          if (response.data.session == false) {
            this.$router.push("/login").catch((err) => err);
          }
          if (response.data.success) {
            await this.resetToGrey();
            scenario.is_default = true;
            scenario.defaultGrayIcon = "red";
            scenario.defaultIcon = "mdi-heart";
            this.$refs.topProgress.start()
            this.$nextTick(() => {
              this.$refs.topProgress.done()
              this.sec_loader = false
            })
            
          }else {
            this.snakeScenarios = true;
            this.scenarioError = "some_thing_wrong";
            this.sec_loader = false
            throw new Error(response.data.message)
          }
        });
      }
    },
    setDefault() {
      if (this.scenarios) {
        this.scenarios.map((item) => {
          if (item.is_default) {
            item.defaultIcon = "mdi-heart";
            item.defaultGrayIcon = "red";
          }
          else  {
            item.defaultIcon = "mdi-heart-outline";
            item.defaultGrayIcon = "grey";
          }
        });
      } else {
        return false;
      }
    },
    resetToGrey() {
      this.scenarios.map((item) => {
        item.defaultGrayIcon = "grey";
        item.defaultIcon = "mdi-heart-outline";
        item.is_default = false;
      });
    },
    toQrScane() {
      this.$router.push("/mujeebk_web");
    },
  },
  updated() {
    this.onResize();
  },
  created() {
    this.getAllScenarios();
    this.setDefault();
    this.onResize();
  },
  beforeRouteEnter() {
    this.checkSessionState();
    this.getAllScenarios();
  },
  mixins: [scenariosPost],
};
</script>
<style>
.qr-session-error {
  word-break: normal;
  text-align: justify;
  font-size: 1rem !important;
  font-weight: 400;
}
.englishPadding {
  padding: 0 30px 0 270px !important;
}
.arabicPadding {
  padding: 0 270px 0 30px !important;
}
</style>
