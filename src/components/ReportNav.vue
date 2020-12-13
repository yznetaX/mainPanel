<template>
  <div v-resize="onResize" v-cloak>
    <vue-topprogress
      ref="topProgress"
      :color="'#81217d'"
      :height="3"
    ></vue-topprogress>
    <v-card v-if="showNav">
      <v-navigation-drawer
        
        z-index="-1"
        mini-variant-width="100"
        top="57px"
        ref="nav"
        v-model="drawer"
        width="250"
        fixed
        :right="right"
        permanent
        :mini-variant="mini"
      >
        <v-btn icon @click="changeMiniStatus" v-if="showExpand">
          <v-icon>{{mini == true ? 'mdi-chevron-right' : 'mdi-chevron-left'}}</v-icon>
        </v-btn>
        <v-btn icon @click="refreshContent" :loading="refreshLoading">
          <v-icon>mdi-rotate-right</v-icon>
        </v-btn>
        <v-btn
          icon
          v-if="mini == false"
          @click="changeTime"
          v-model="reportTime"
          @click.native="reportTime = !reportTime"
        >
          <v-icon>mdi-clock-outline</v-icon>
        </v-btn>
        <v-card-actions class="py-0">
          <v-text-field
            class="pa-0"
            outlined
            dense
            rounded
            append-icon="mdi-magnify"
            :label="$t('search')"
            :hide-details="true"
            :disabled="mini == true ? true : false"
          ></v-text-field>
        </v-card-actions>
        <v-virtual-scroll :items="repots" :item-height="80">
          <template v-slot="{ item }">
            <v-list-item
              @click="gotToReport(item)"
              class="my-1"
              :class="[returnMarginCount, item.from_number === $route.params.number ? 'isSelected' : '' ]"
              active-class="isSelected"
            >
              <v-list-item-avatar
                style="height: 70px; min-width: 70px; width: 50px;"
                class="mx-0"
              >
                <v-badge
                  ref="vscroll"
                  bottom
                  overlap
                  class="my-1 ss"
                  color="red darken-3"
                  bordered
                  :content="item.new_reports > '9' ? '9+' : item.new_reports"
                  :value="item.new_reports == '0' ? false : true"
                >
                  <reportAvatar
                    :phone_number="item.from_number"
                    :number_id="$route.params.id"
                    :color_avatar="'grey'"
                    :avatarClass="'report-class'"
                    :is_online_info="0"
                    :show_online_dot="false"
                  />
                </v-badge>
              </v-list-item-avatar>

              <v-list-item-content class="py-0">
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.from_number }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-navigation-drawer>
    </v-card>
  </div>
</template>
<script>
import reportNav from "../mixins/httpHandler";
import reportAvatar from "./automated/Avatar";
import { bus } from "../main";
import i18n from '../plugins/i18n';
export default {
  components: {
    reportAvatar,
  },
  data() {
    return {
      drawer: true,
      repots: [],
      mini: true,
      reportTime: false,
      refreshLoading: false,
      right: null,
      lastSeen: "",
      isOnline: null,
      numberStatusOnline: "",
      showData: false,
      wait: false,
      returnMarginCount: "ps-7 pe-1",
      t: "",
      noPlan: "",
      showNav: false,
      showExpand: true
    };
  },
  methods: {

    changeMiniStatus() {
      this.mini = !this.mini;
      let mini = this.mini;
      localStorage.setItem("mini", this.mini);
      mini == true
        ? (this.returnMarginCount = "ps-7 pe-1")
        : (this.returnMarginCount = "ps-2 pe-6");
      bus.$emit("minStatus", this.mini);
      bus.$on("miniStatus", () => {
        this.mini = true;
      });
    },
    onResize() {

        if (window.innerWidth < 960) {
        if (this.mini && this.showNav) {
          let asid = this.$refs.nav._vnode.elm;
          asid.style.top = "57px";
          this.returnMarginCount = "ps-7 pe-1"
        }
      }
        if (window.innerWidth >= 960) {
        if (this.mini && this.showNav) {
          let asid = this.$refs.nav._vnode.elm;
          asid.style.top = "65px";
          this.returnMarginCount = "ps-7 pe-1"
        }
      }
      

        if (window.innerWidth > 1250) {
          if (this.showNav) {
            let asid = this.$refs.nav._vnode.elm;
        asid.style.top = "0";
          }
        
      } else if (window.innerWidth > 960 && window.innerWidth <= 1250) {
        if (this.showNav) {
          let asid = this.$refs.nav._vnode.elm;
        asid.style.top = "65px";
        }
      } else {
        if (this.showNav) {
          let asid = this.$refs.nav._vnode.elm;
          asid.style.top = "66px";
        }
      }
      if (window.innerWidth < 600) {
        this.showExpand = false
      }
      if (window.innerWidth > 600) {
        this.showExpand = true
      }
      
    },
    async refreshContent() {
      this.$refs.topProgress.start();
      this.refreshLoading = true;
      let reportsData = {
        router: "get_reports_number",
        number_id: this.$route.params.id,
      };
      await this.post(reportsData, false).then((response) => {
        console.log(response);
        if (response.data.session == false) {
          this.$router.push("/login").catch((err) => err);
        }
        this.repots = response.data.from_number;
        this.refreshLoading = false;
        this.$refs.topProgress.done();
      });
    },
    changeTime() {
      localStorage.setItem("reportTime", !this.reportTime);
      bus.$emit("shareTimeReport", !this.reportTime);
    },
    getReports() {
      let reportsData = {
        router: "get_reports_number",
        number_id: this.$route.params.id,
      };
      this.post(reportsData, false).then(async (response) => {
        console.log(response);
        if (response.data.session == false) {
          this.$router.push("/login").catch((err) => err);
        }
        this.repots = await response.data.from_number;
        if (this.repots == undefined) {
          this.showNav = false
          localStorage.removeItem("mini")
          bus.$emit('removeNav')
          this.stopTimer()
        }else{
          this.showNav = true
        }
        this.refreshLoading = false;
      });
    },
    gotToReport(number) {
      number.new_reports = '0'
      this.$router
        .push(`/report/${this.$route.params.id}/${number.from_number}`)
        .then(async () => {
          bus.$emit("showOverlay");
          // this.getReports();
          number.new_reports = '0'
        })
        .catch((err) => err);
      bus.$emit('refreshReports')
      this.$refs.topProgress.start();
      this.$nextTick(() =>{
        this.$refs.topProgress.done();
      })
    },
    drawerDir() {
      if (
        localStorage.getItem("local_lang") == "en" ||
        i18n.locale == "en"
      ) {
        this.right = true;
      }
      if (localStorage.getItem("local_lang") == "ar" || i18n.locale == "ar") {
        this.right = false;
      }
    },
    timer() {
      this.t = setInterval(() => {
        this.getReports();
        bus.$emit("shareRefresh");
      }, 60000 * 3);
    },
    setTime() {
      this.timer();
    },
    stopTimer() {
      if (this.t) {
        clearInterval(this.t);
      }
    },
  },
  computed: {},
  watch: {},
  created() {
    bus.$on("arabicLang", () => {
      this.right = false;
    });
    bus.$on("englishLang", () => {
      this.right = true;
    });
    bus.$on("miniStatus", () => {
      this.mini = true;
    });
  },
  mounted() {
    bus.$on("stopTimer",()=> {
      this.stopTimer()
    });
    localStorage.setItem("mini", this.mini);
    bus.$emit("minStatus", this.mini);
    bus.$emit("shareMiniStatus", this.mini);
    localStorage.setItem("mini", this.mini);
    this.setTime();
    this.drawerDir();
    this.onResize();
    this.getReports();
    if (window.innerWidth > 1250) {
      this.mini = false;
      localStorage.setItem("mini", this.mini);
      bus.$emit("minStatus", this.mini);
    } else {
      this.mini = true;
      localStorage.setItem("mini", this.mini);
      bus.$emit("minStatus", this.mini);
    }
  },
  beforeRouteLeave() {
    this.stopTimer();
  },
  updated() {
    if (this.mini) {
      this.onResize();
    }
  },
  mixins: [reportNav],
};
</script>
<style lang="scss">
.reportnav-badge {
  bottom: calc(100% - 11px) !important;
  left: calc(100% - 16px) !important;
}
.ss {
  .v-badge__wrapper {
    .v-badge__badge {
      bottom: calc(100% - 11px) !important;
      left: calc(100% - 16px) !important;
    }
  }
}
.isSelected{
  background: #e3e3ed !important;
}
</style>
