<template>
  <div class="" v-resize="onResize">
    <v-icon :disabled="!enabled" @click="showMedia" :color="url != '' ? '#b71c1c' : '#696562'"
      >mdi-image-area</v-icon
    >

    <v-dialog v-model="show" persistent scrollable max-width="700">
      <v-card class="px-4 py-2" height="100%">
        <v-card-title
          class="secondary white--text py-1 text-subtitle-1 d-block text-center"
        >
          {{$t('add_img_welcome')}}
        </v-card-title>
        <v-alert color="red darken-4 mt-2" v-model="errorMessage" dark>{{
          $t(dialogModalError)
    }}</v-alert>
        <v-tabs
      color="orange"
      class="dialog-tabs"
    >
    
    <v-tab>{{$t('dialog_file_form')}}</v-tab>
      <v-tab :disabled="!url" @click="overlay=false">{{$t('dialog_file_preivew')}}</v-tab>
        
        
        <v-tab-item>
        <v-card-actions>
          <span>{{ $t("dialog_types.pick_one_item") }}</span>
        </v-card-actions>
        <v-card-actions class="py-0 px-0">
          <v-file-input
            prepend-icon="mdi-camera"
            accept="image/jpeg, image/jpg"
            @change="sendChange"
            :rules="rules"
            v-model="fileInput"
            :disabled="procces"
            :label="$t(`dialog_types.pick_file`)"
          ></v-file-input>
        </v-card-actions>
        <v-card-actions class="py-0 px-0">
          <v-text-field
            class="pa-0"
            color="secondary"
            prepend-icon="mdi-web"
            :label="$t(`dialog_types.set_url`)"
            v-model="url"
            @blur="handelFocus(true)"
            @focus="handelFocus(true)"
            
            :disabled="procces"
          ></v-text-field>
        </v-card-actions>
        <v-card-actions>
          <v-btn @click="sendImg" color="orange" small dark :loading="procces">
            {{ $t("save") }}
          </v-btn>
          <v-btn
            @click="show = false"
            :disabled="procces"
            color="secondary"
            small
          >
            {{ $t("cancel") }}
          </v-btn>
          <v-btn small color="red darken-4" :disabled="procces" :dark="procces == true ? false : true" @click="deleteUrl" v-if="url || fileInput">{{$t('delete')}}</v-btn>
        </v-card-actions>
        </v-tab-item>
        <v-tab-item :class="tabMiniHeight">
        <v-card-actions>
          <v-overlay :value="overlay" absolute color="white" opacity="1">
            <v-row align-content="center" justify="center">
            <v-progress-circular
        style="width:300px;"
        color="grey darken-2"
        indeterminate
        rounded
        :size="30"
      >
      </v-progress-circular>
            </v-row>
          </v-overlay>
          <v-card  class="ma-auto" v-if="!thereError">
            <v-img :src="url" max-width="350" max-height="350" @error="handelImgError" @loadeddata="overlay = false"></v-img>
          </v-card>
          <v-card v-if="thereError" width="100%" flat>
            <v-card-title class="d-block text-center">
              {{$t("img_not_found")}}
            </v-card-title>
          </v-card>
        </v-card-actions>
        <v-card-actions>
          <v-btn
            @click="show = false"
            :disabled="procces"
            color="secondary"
            small
          >
            {{ $t("close_img") }}
          </v-btn></v-card-actions>
      </v-tab-item>
      </v-tabs>
      </v-card>
      
    </v-dialog>
  </div>
</template>
<script>
/*eslint-disable*/
import { postImgToServer, mergeArrays, saveToLocalStorage} from "./utils";
import {findDeletedChainUrls} from './models'
import { bus } from "../../main";
import i18n from '../../plugins/i18n';
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      url: this.value,
      show: false,
      rules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          i18n.t("dialog_errors.invalid_file_size"),
      ],
      textInput: "",
      fileInput: null,
      errorMessage: false,
      dialogModalError: "",
      procces: false,
      deletedArray: [],
      modelUrl: "",
      overlay:true,
      thereError: false,
      tabMiniHeight: "img-tab"
    };
  },
  methods: {
    onResize(){
      if (window.innerWidth <= 400) {
        this.tabMiniHeight = "tab-mini"
      }
      if (window.innerWidth > 400) {
        this.tabMiniHeight = "img-tab"
      }
    },
    handelImgError(){
      alert('something went wrong')
      this.thereError = true
    },
    deleteUrl(){
      let val = this.value
      bus.$emit("deletedChainUrl", this.value)
      this.show = false
      val = ""
      this.url = ""
      this.$emit("deletedUrls")
      this.$emit("input", this.url);
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
      this.handelChange()
    },
    sendChange(val) {
      this.dataImg = val;
    },
    sendImg() {
      let imgData = {
        id: "send_photo",
        file: this.dataImg,
        url: this.url
      };
      let imgFile = {
        id: "send_photo",
        file: this.dataImg,
      }
      this.procces = true;
      console.log(this.url != "" && this.fileInput != null);
      if (this.url && this.fileInput) {
        postImgToServer(imgFile).then((res) => {
          console.log(res);
          if (res.error) {
            this.errorMessage = true;
            this.dialogModalError = i18n.t(`dialog_errors.${res.error}`);
            this.procces = false;
          }else {
            let val = this.value
      val = ""
      this.url = ""
      this.$emit("deletedUrls")
      this.$emit("input", this.url);
          this.procces = false;
          this.show = false;
          this.url = res.url;
          this.$emit("input", this.url);
          this.fileInput = null;
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
          }
        });
      } else if (!this.url && !this.fileInput) {
        this.errorMessage = true;
        this.dialogModalError = "dialog_errors.no_pick_file";
        this.procces = false;
        return false;
      } else if (this.url && !this.fileInput) {
        // bus.$emit("u", this.url)
        postImgToServer(imgData).then((response) => {
          console.log(response);
          if (response.error) {
            this.errorMessage = true;
            this.dialogModalError = i18n.t(`dialog_errors.${response.error}`);
            this.procces = false;
          }else {
            this.url = '';
          this.$emit("input", this.url);
            this.show = false;
            this.procces = false;
            this.url = response.url;
            this.$emit("input", this.url);
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
          }
          
        })
      } else {
        postImgToServer(imgData).then((res) => {
          console.log(res);
          if (res.error) {
            this.errorMessage = true;
            this.dialogModalError = i18n.t(`dialog_errors.${res.error}`);
            this.procces = false;
          }else {
          this.url = '';
          this.$emit("input", this.url);
          this.procces = false;
          this.show = false;
          this.url = res.url;
          this.$emit("input", this.url);
          this.fileInput = null;
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
          }
        });
      }
    },
    showMedia() {
      this.show = true;
      this.errorMessage = false
      this.fileInput = null
      
      if (this.url) {
        this.overlay = false
      }else {
        this.overlay = true
      }
    },
    handelChange() {
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
      this.$emit("input", this.url);
    },
    handelFocus(isFocused) {
      this.$emit("focused", isFocused);
    },
  },
  watch: {
    value: function(to, from) {
      this.url = to;
    },
  },
};
</script>
<style lang="scss">
.img-bg{
  text-align: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  line-height: 40px;
  background-color: #6e6b6e57 !important;
  border-color: #4f464e57 !important;
}
.img-tab{
  min-height: 270px !important
}
.tab-mini{
  min-height: 150px !important
}
</style>
