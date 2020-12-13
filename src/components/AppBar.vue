<template>
  <div>
    <v-app-bar app elevation="2" v-if="showToolbar" height="65">
      <v-app-bar-nav-icon @click="showDrawer"></v-app-bar-nav-icon>
      
      <v-toolbar-title class="mx-auto pa-0">
        <img
          @click="toIndex"
          :src="require('../assets/mujeebk_final.svg')"
          style="cursor:pointer"
          class="mujeebk-logo"
        />
      </v-toolbar-title>
        <v-btn icon @click="goBack" v-if="$route.fullPath == '/cards' ? false : true" class="appbar">
          <v-icon class="d-block"  >
          {{arrowWithLang}}
        </v-icon>
        </v-btn>
    </v-app-bar>
  </div>
</template>
<script>
import { bus } from '../main';
import i18n from '../plugins/i18n';
export default {
  props: {
    showDrawer: {
      type: Function,
    },
    toIndex: {
      type: Function,
    },
    showToolbar:{
      type: Boolean
    }
  },
  data() {
    return {
      arrowWithLang: ""
    };
  },
  methods:{
    goBack(){
      if (this.$route.fullPath == `/scenario/${this.$route.params.id}/${this.$route.params.new}`) {
        this.$router.push(`/scenario/${this.$route.params.id}`)
      }else if(this.$route.fullPath == `/scenario/${this.$route.params.id}`) {
        this.$router.push(`/cards`)
      }else {
        this.$router.go(-1)
      }
    //   goBack(){
    //   if (this.$route.fullPath == `/scenario/${this.$route.params.id}/${this.$route.params.new}`) {
    //     this.$router.push(`/scenario/${this.$route.params.id}`)
    //   }else if(this.$route.fullPath == `/scenario/${this.$route.params.id}`) {
    //     this.$router.push(`/cards`)
    //   }else {
    //     this.$router.go(-1)
    //   }
    // }
    }
  },
  mounted() {
    if (i18n.locale == "en") {
      this.arrowWithLang = "mdi-arrow-right";
    } else {
      this.arrowWithLang = "mdi-arrow-left";
    }
    bus.$on("englishLang", () => {
      this.arrowWithLang = "mdi-arrow-right";
    });
    bus.$on("arabicLang", () => {
      this.arrowWithLang = "mdi-arrow-left";
    });
  },
};
</script>
<style lang="scss">
.appbar:not(.v-btn--text):not(.v-btn--outlined):hover:before{
  opacity: 0 !important;
}
</style>