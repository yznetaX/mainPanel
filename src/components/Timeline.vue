<template>
  <v-timeline :dense="$vuetify.breakpoint.smAndDown">
    <v-timeline-item color="secondary" fill-dot left large>
      <template v-slot:icon>
        <span class="white--text font-weight-bold tree-number">1</span>
      </template>
      <v-card>
        <v-card-title
          class="secondary white--text py-2 px-1 text-subtitle-2 text-sm-h6"
          style="word-break: normal;"
        >
          <v-icon class="mx-1" color="white">
            mdi-qrcode-plus
          </v-icon>
          {{ $t("add_whats_account") }}
        </v-card-title>
        <v-card-text class="mt-2">
          <p>{{ $t("timeline.add_whats_account") }}</p>
          <div class="text-center" id="step-1-add-phone">
            <v-btn
              class="mx-auto"
              color="secondary"
              rounded
              to="/mujeebk_web"
              :class="timlineAnimation"
            >
              {{ $t("add_now") }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-timeline-item>

    <v-timeline-item color="orange" fill-dot right large>
      <template v-slot:icon>
        <span class="white--text font-weight-bold tree-number">2</span>
      </template>
      <v-card>
        <v-card-title
          class="orange white--text py-2 px-1 text-subtitle-2 text-sm-h6"
          style="word-break: normal;"
        >
          <v-icon class="mx-1" color="white">
            mdi-qrcode-plus
          </v-icon>
          {{ $t("created_first_scenario") }}
        </v-card-title>
        <v-card-text class="mt-2">
          {{ $t("timeline.created_first_scenario") }}
        </v-card-text>
      </v-card>
    </v-timeline-item>
    <v-timeline-item color="secondary" fill-dot left large>
      <template v-slot:icon>
        <span class="white--text font-weight-bold tree-number">3</span>
      </template>
      <v-card>
        <v-card-title
          class="secondary white--text py-2 px-1 text-subtitle-2 text-sm-h6"
          style="word-break: normal;"
        >
          <v-icon class="mx-1" color="white">
            mdi-cog-outline
          </v-icon>
          {{ $t("adjust_account_settings") }}
        </v-card-title>
        <v-card-text class="mt-2">
          {{ $t("timeline.adjust_account_settings") }}
        </v-card-text>
      </v-card>
    </v-timeline-item>

    <v-timeline-item color="orange" fill-dot right large>
      <template v-slot:icon>
        <span class="white--text font-weight-bold tree-number">4</span>
      </template>
      <v-card>
        <v-card-title
          class="orange white--text py-2 px-1 px-1 text-subtitle-2 text-sm-h6"
          style="word-break: normal;"
        >
          <v-icon class="mx-1" color="white">
            mdi-play
          </v-icon>
          {{ $t("start_auto_responder") }}
        </v-card-title>
        <v-card-text class="mt-2">
          {{ $t("timeline.start_auto_responder") }}
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>
<script>
import timeLineSession from "../mixins/httpHandler";
// import i18n from "../plugins/i18n";
export default {
  data() {
    return {
      timlineAnimation: "timlineAnimation",
    };
  },
  methods: {
    checkSessionState() {
      this.post({ router: "session_status" }, false).then((respone) => {
        if (
          respone.data.session == false ||
          localStorage.getItem("session_id") == null
        ) {
          this.$router.push("/login");
        }
      });
    },
  },
  created() {
    this.checkSessionState();
  },
  mounted() {
  },
  mixins: [timeLineSession],
};
</script>
<style>
.tree-number {
  font-family: "Arial Bold", sans-serif !important;
  font-size: 1.7rem;
}
.timlineAnimation {
  animation: timlineFade 1s infinite alternate;
}
@keyframes timlineFade {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}
</style>
