<template>
  <div class="support" :class="mbScreen" v-resize="onResize">
    <v-card flat>
      <v-card-title class="py-1 px-2 secondary--text mujeebk-title">
        <Backword v-if="showBackword" />
        {{ $t("support") }}
      </v-card-title>
      <v-card-subtitle
        class="py-4 subtitle-1 px-2"
        v-html="$t('support_description')"
      >
      </v-card-subtitle>
    </v-card>
    <v-card max-width="550" class="ma-auto pa-2 my-6" flat>
      <v-alert outlined close-label  color="red darken-4" type="error" v-model="supportError" close-icon="mdi-close">{{$t("error_support")}}</v-alert>
        <v-alert outlined close-label   type="success" v-model="supportSuccess">{{$t('support_success')}}</v-alert>
      <v-form @submit.prevent="sendSupportMessage" v-model="valid" ref="valid">
        <v-text-field
          v-model="subject"
          :label="$t('problem_name')"
          solo
          dense
          append-outer-icon="mdi-rename-box"
          :rules="[subjectRules.blank,subjectRules.required]"
          ref="subject"
        ></v-text-field>
        <v-select
          v-model="numbersValue"
          dense
          :items="numbers"
          :filter="customFilter"
          color="secondary"
          item-text="phone_number"
          item-value="number_id"
          :label="$t('numbers')"
          solo
          append-outer-icon="mdi-numeric"
          @change="getSelectValue"
          style="font-family: Cairo !important"
          :rules="[subjectRules.required]"
          :menu-props="autocompleteMenuProps"
          ref="number"
        >
        </v-select>
        <v-textarea
          counter="500"
          :rules="[passwordRules.blank, passwordRules.required, passwordRules.min]"
          v-model="problemText"
          solo
          :label="$t('description_problem')"
          append-outer-icon="mdi-message-processing-outline"
          ref="message"
          class="error--text"
        ></v-textarea>
        <v-btn
          small
          color="primary"
          class="me-2"
          @click="sendSupportMessage"
          :loading="loadingButton"
          :disabled="!valid"
        >
          <span>{{ $t("send_reply") }}</span>
        </v-btn>
        <v-btn small color="orange" dark @click="reset">
          {{ $t("reset") }}
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>
<script>
import i18n from "../plugins/i18n";
import support from "../mixins/httpHandler";
import Backword from '../components/Backword'
export default {
  components:{
    Backword
  },
  data() {
    return {
      numbers: [],
      subject: "",
      problemText: "",
      numbersValue: "",
      loadingButton: false,
      passwordRules: {
        required: (v) => !!v   || i18n.tc("this_req"),
        blank: v => v && !!v.trim() ||  i18n.tc("this_req"),
        min: (v) => (v && v.length < 500) || i18n.tc("password_count_support"),
      },
      subjectRules: {
        required: (v) => !!v  || i18n.tc("this_req"),
        blank: v => v && !!v.trim() || i18n.tc("this_req"),
      },
      valid: true,
      mbScreen: "mb-16",
      showBackword: "",
      supportError: false,
      supportSuccess: false,
    };
  },
  methods: {
    onResize(){
      if (window.innerWidth >= 1250) {
        this.showBackword = true
      }
      if (window.innerWidth < 1250) {
        this.showBackword = false
      }
      if (window.innerWidth <= 600) {
        this.mbScreen = "mb-16"
      }
      if (window.innerWidth > 600) {
        this.mbScreen = ""
      }
    },
    customFilter(item, queryText) {
      const textOne = item.phone_number.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    },
    async getNumbers() {
      if (this.$store.state.cards.length > 0) {
        this.numbers = this.$store.state.cards;
      } else {
        await this.post({ router: "get_numbers" }, false).then((response) => {
          if (response.data.session == false) {
            this.$router.push("/login").catch((err) => err);
          }
          if (response.data.registered_numbers.length == 0) {
            this.$router.push("/cards");
          } else {
            this.numbers = response.data.registered_numbers;
            this.$store.state.cards = response.data.registered_numbers;
          }
        });
      }
    },
    sendSupportMessage() {
      if (this.$refs.valid.validate()) {
        this.loadingButton = true;
        let supportMessage = {
          router: "send_support",
          number_id: this.numbersValue,
          subject: this.subject,
          problem_text: this.problemText,
        };
        if (!supportMessage.subject.replace(/\s/g, '').length && !supportMessage.problem_text.replace(/\s/g, '').length) {
          this.whiteSpaceSubject = false
          this.supportError = true
          this.loadingButton = false
}else{
        this.post(supportMessage, false).then((response) => {
          if (response.data.session == false) {
            this.$router.push("/login").catch((err) => err);
          }

            if (response.data.success) {
            this.supportSuccess = true
            this.$refs.valid.reset()
            this.loadingButton = false
          }else {
            this.supportError = true
            this.loadingButton = false
          }
          
        });
}

      } else {
        this.loadingButton = false;
      }
    },
    getSelectValue(val) {
      this.numbersValue = val;
    },
    reset() {
      this.$refs.valid.reset();
    },
  },
  computed: {
    autocompleteMenuProps() {
      // default properties copied from the vuetify-autocomplete docs
      let defaultProps = {
        maxHeight: 304,
        contentClass: "secondary--text",
        zIndex: "6",
      };

      if (this.$vuetify.breakpoint.smAndDown) {
        defaultProps.maxHeight = 230;
        defaultProps.top = true;
      }
      return defaultProps;
    },
  },
  mounted() {
    this.getNumbers();
    if (this.$refs.subject.$refs.label != undefined) {
      let allow = this.$refs.subject.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
    if (this.$refs.number.$refs.label != undefined) {
      let allow = this.$refs.number.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
    if (this.$refs.message.$refs.label != undefined) {
      let allow = this.$refs.message.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
  },
  updated() {
    if (this.$refs.subject.$refs.label != undefined) {
      let allow = this.$refs.subject.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
    if (this.$refs.number.$refs.label != undefined) {
      let allow = this.$refs.number.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
    if (this.$refs.message.$refs.label != undefined) {
      let allow = this.$refs.message.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
  },
  mixins: [support],
};
</script>
<style lang="scss">
.error--text{
  color: #B71C1C !important;
  caret-color: #B71C1C !important;
  }
</style>