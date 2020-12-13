
<template>
  <div class="mt-3" v-resize="onResize">
    <v-alert border="left" colored-border type="info" elevation="2" v-if="smallScreen">
        {{$t('best_ux_report')}}
      </v-alert>
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
    <div class="get-all-scenario">
      <v-card flat>
        <v-card-title
          class="py-1 secondary--text mujeebk-title"
        >
        {{$t('bot_status')}}
        </v-card-title>
        <v-card-subtitle
        class="py-4"
      >
      {{$t('get_number_description')}}
      </v-card-subtitle>
      </v-card>
      <v-row v-resize="onResize">
        <v-col cols="10" sm="8" md="8" class="mx-auto">
          <v-autocomplete
            class="mx-8"
            :items="numbers"
            :filter="customFilter"
            color="secondary"
            item-text="phone_number"
            item-value="number_id"
            :label="$t('numbers')"
            filled
            append-icon="mdi-phone"
            rounded
            @change="goToSelectedScenario"
            :disabled="process"
            :placeholder="placeholder"
            style="font-family: Cairo !important"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import getBotStatus from "../mixins/httpHandler";
import i18n from "../plugins/i18n";
export default {
  data() {
    return {
      numbers: [],
      overlay: true,
      profile_photo: "",
      marginTop: "",
      process: true,
      placeholder: i18n.t("loading_numbers"),
      smallScreen: false,
      loadingPadding: ""
    };
  },
  methods: {
    customFilter(item, queryText) {
      const textOne = item.phone_number.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    },
    async getNumbers() {
      if (this.$store.state.cards.length > 0) {
        console.log(true);
        this.numbers = this.$store.state.cards;
        this.process = false;
        this.placeholder = "";
        this.overlay = false;
      } else {
        await this.post({ router: "get_numbers" }, false).then((response) => {
          console.log(response)
           if (response.data.session == false) {
          this.$router.push("/login").catch((err) => err);
        }
          if (response.data.registered_numbers.length == 0) {
            this.$router.push('/cards')
          }else {
            this.numbers = response.data.registered_numbers;
            this.$store.state.cards = response.data.registered_numbers;
            this.process = false;
            this.placeholder = "";
            this.overlay = false;
          }
          
        });
      }
    },
    goToSelectedScenario(number_id) {
      this.$route.params.id = number_id;
      this.$router.push("/bot_status/" + number_id);
    },
    onResize() {
      if (window.innerWidth <= 600) {
        this.marginTop = "my-5";
        this.smallScreen = true
      }
      if (window.innerWidth <= 300) {
        this.marginTop = "my-7";
      }
      if (window.innerWidth > 600) {
        this.marginTop = "";
        this.smallScreen = false
      }
      if (window.innerWidth > 1250) {
        if (i18n.locale == "en" || localStorage.getItem("local_lang") == "en") {
          this.loadingPadding = "englishPadding";
        }
        if (i18n.locale == "ar" || localStorage.getItem("local_lang") == "ar") {
          this.loadingPadding = "arabicPadding";
        }
      }
      if (window.innerWidth < 1250) {
        this.loadingPadding = "";
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
      });
    },
  },
  mounted() {
    document.getElementById("app").style.display = "block";
    document.getElementById("loading").style.display = "none";
    this.checkSessionState();
    this.getNumbers();
  },
  updated() {
  },
  mixins: [getBotStatus],
};
</script>
<style lang="scss">
.englishPadding {
  padding: 0 30px 0 270px !important;
}
.arabicPadding {
  padding: 0 270px 0 30px !important;
}
</style>
-->
