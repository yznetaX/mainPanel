<template>
  <v-btn
    color="grey lighten-1"
    small
    dark
    class="me-2 button-backword"
    @click="goBack"
    v-if="$route.fullPath == '/cards' ? false : true"
  >
    <v-icon>
      {{ arrowWithLang }}
    </v-icon>
  </v-btn>
</template>
<script>
import { bus } from "../main";
import i18n from "../plugins/i18n";
export default {
  data() {
    return {
      arrowWithLang: "",
      smallScreen: ""
    };
  },
  methods: {
    goBack(){
      if (this.$route.fullPath == `/scenario/${this.$route.params.id}/${this.$route.params.new}`) {
        this.$router.push(`/scenario/${this.$route.params.id}`)
      }else if(this.$route.fullPath == `/scenario/${this.$route.params.id}`) {
        this.$router.push(`/cards`)
      }else {
        this.$router.go(-1)
      }
    }
  },
  mounted() {
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
};
</script>
