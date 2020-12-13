<template>
  <div>
    <v-dialog v-model="settingDialog" max-width="900" class="none-shadow" @click:outside="closeDialog" @keydown.esc="closeDialog">
      <v-btn x-large icon class="dialog-icon-close" @click="closeDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-card flat elevation="3">
        <vue-plyr ref="plyr" id="plyr">
          <video
           id="player"
            :poster="videoPoster"
            :src="videoUrl"
          ></video>
        </vue-plyr>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
/*eslint-disable*/
import VueLoadImage from "vue-load-image";
import { bus } from "../main";
export default {
  components: {
    "vue-load-image": VueLoadImage,
  },
  data() {
    return {
      settingDialog: false,
      modelSetting: 0,
      overlay: true,
    };
  },
  props: {
    videoUrl: {
      type: String,
    },
    videoPoster: {
      type: String
    }
  },
  created() {
    bus.$on("openDialogSetting", () => {
      this.settingDialog = true;
    });
    bus.$on("reset", () => {
      this.modelSetting = 0;
    });
  },
  mounted() {
  },
  methods: {
    closeDialog(){
      this.$refs.plyr.player.stop()
      this.settingDialog= false
    }
  },
};
</script>
<style lang="scss">
.none-shadow {
  box-shadow: none !important;
}
.dialog-icon-close{
  position: fixed !important;
    top: 4px !important;
    left: 4px !important;
    color: white !important;
}
</style>
