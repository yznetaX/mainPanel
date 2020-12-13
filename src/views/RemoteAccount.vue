<template>
  <div class="add-remote-account" v-resize="onResize">
      <v-card flat>
        <v-card-title
          class="py-1 px-2 secondary--text mujeebk-title"
        >
        <Backword v-if="showBackword"/>
        {{$t('remote_account')}}
        </v-card-title>
        <v-card-subtitle
        class="py-4 subtitle-1 px-2"
      >
      {{$t('remote_subtitle')}}
      </v-card-subtitle>
      </v-card>
    <v-card flat>

      <v-card-actions class="d-block text-center py-2 pt-12">
        <v-tooltip  top :open-on-click="true" :open-on-hover="false" v-model="show" z-index="3">
          <template v-slot:activator="{ on }">
            <v-row>
              <v-col cols="12">
            <v-btn
              rounded
              dark
              color="secondary"
              @click="on.click"
              class="path-button"
              v-clipboard:copy="addRemotePath"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >
              {{$t('remote_content')}}
            </v-btn>
              </v-col>
            </v-row>
          </template>
          <span class="subtitle-1" style="font-family: Cairo !important;  font-size:14px !important">{{snakeContent}}</span>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import i18n from "../plugins/i18n";
import Remote from '../mixins/httpHandler'
import Backword from '../components/Backword'
export default {
  components:{
    Backword
  },
  data() {
    return {
      message: "copy this text",
      snakeContent: "",
      show: false,
      showBackword: ""
    };
  },
  computed: {
    addRemotePath() {
      return (
        `https://mujeebk.com/scan/${localStorage.getItem("rand_id")}` ||
        `https://mujeebk.com/scan/${this.$store.state.rand_id}`
      );
    },
  },
  methods: {
    onResize(){
      if (window.innerWidth >= 1250) {
        this.showBackword = true
      }
      if (window.innerWidth < 1250) {
        this.showBackword = false
      }
    },
    onCopy: function() {
        this.snakeContent = i18n.t("copied");
        setTimeout(() => {
          this.show = false
        },4000)
      //   this.snake = true;
    },
    onError: function() {
      alert("Failed to copy texts");
    },
        checkSessionState() {
      this.post({ router: "session_status" }, false).then((respone) => {
        if (
          respone.data.session == false ||
          localStorage.getItem("session_id") == null
        ) {
          this.$router.push('/login')
        }
      });
    }
  },
  created() {
    this.checkSessionState()
  },
      beforeMount () {
        if (localStorage.getItem('session_id') == null) {
            this.$router.push('/login')
        }
    },
  mixins:[Remote]
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@600&display=swap");
.add-remote-account {
  font-family: "Cairo", sans-serif !important;
  font-size: 0.9125rem;
  height: 100vh;
}
.add-remote-title {
  font-family: "Cairo", sans-serif !important;
}
.path-button {
    text-transform: lowercase;
    font-size: 14px !important;
    font-weight: 300 !important;

}
</style>
