<template>
  <div v-if="value"  class="chain-container" :id="value.id">
    <v-overlay :value="overlay" color="white" opacity="1" v-resize="onResize">
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
        <v-dialog v-model="dialogPlan" max-width="400" persistent>
        <v-card>
          <v-toolbar color="secondary" dark dense height="34" flat>
            <v-toolbar-title class="white--text subtitle-1">{{
              $t("upgrade_your_plan")
            }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-4" v-html="$t(dialogCardErrorPlan)"></v-card-text>
          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn color="orange" dark @click="dialogPlan = false" small>
              <v-icon small class="me-1">
                mdi-close
              </v-icon>
              {{
              $t("close")
            }}</v-btn>
            <v-btn
              small
              color="secondary"
              @click="dialog = false"
              :to="dialogErrorRouterPlan"
              router
              class="ms-2"
            >
              <v-icon class="me-1" small>
                {{ dialogIconPlan }}
              </v-icon>
              <span>{{ dialogTitlePlan }}</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    <div class="message-node">
      <section-title v-if="false" class="mx-6" v-model="value.sectionTitle"  @focused="handelMessageFocused" :enabled="enabled" />
      <v-row class="ma-0">
        <div class="pa-0" :class="messageNodeWidth">
          <message-node v-model="value.text"  @focused="handelMessageFocused" :enabled="enabled"  />
      </div>
      <div class="mx-auto pa-0 text-center" :class="imageNodeWidth" style="margin-top: 21.5px !important;">
      <image-icon v-model="value.url" @deletedUrls="deletedURls"  @focused="handelMessageFocused" :enabled="enabled" />
      </div>
      </v-row>
    </div>
    <div >
      <div class="replies-dialogs-container">
        <reply-node
        v-for="(reply, index) in this.value.replies"
        :key="index"
        :selected="reply.selected"
        :id="reply.id"
        v-model="reply.text"
        @focused="(focused) => handelFocusReply(index, reply, focused)"
        @delete="handelDeleteReply(index, reply)"
        @enterPressed="handelAddReply(index)"
        :indexNumber="index"
      />
      </div>
      <div>
      <dialog-node
        v-for="(dialog, index) in this.value.dialogs"
        :key="index"
        :id="dialog.id"
        v-model="dialog.text"
        @delete="handelDeleteDialog(index, dialog)"
        @edit="handelEditDialog({ chain: value, dialog: dialog, index: index })"
        :indexNumber="index"
      />
      </div>
    </div>
    <div class="add-dialog-reply px-4">
      <v-row class="py-1">
        <v-col cols="6" md="6" class="py-1">
          <v-btn
            color="#054740"
            dark
            small
            class="add-dialog"
            v-if="enableAddDialog || showDialogButton"
            @click="handelAddDialog(value)"
            ><v-icon small class="me-2">mdi-message-text-outline</v-icon>{{$t("add_dialogs")}}</v-btn
          >
        </v-col>
        <v-col cols="6" md="6" :class="['py-1', textAlign]">
          <v-btn small color="secondary" class="add-reply" v-if="enableAddReply" @click="handelAddReply(value)" 
            ><v-icon class="me-2" small>mdi-format-list-bulleted</v-icon>{{$t("add_options")}}</v-btn
          >
        </v-col>
      </v-row>
    </div>
    <transition name="fade">
      <chain-node
        v-if="selectedReply && showNextReply"
        v-model="selectedReply.next"
        :enabled="enableEditReplyMessage"
        @messageFocused="handelMessageFocused"
        @addDialog="handelAddDialog"
        @editDialog="handelEditDialog"
      />
    </transition>
  </div>
</template>

<script>
/*eslint-disable*/
import { tree, Chain, Reply, Dialog ,PlanService } from "./models";
import MessageNode from "./MessageNode";
import ReplyNode from "./ReplyNode";
import imageIcon from "./welcomeDialog";
import DialogNode from "./DialogNode";
import ChainNode from "./ChainNode";
import SectionTitle from "./SectionTitle"
import i18n from "../../plugins/i18n"
import {bus} from "../../main"
import _ from 'lodash';
export default {
  name: "chain-node",
  components: {
    "message-node": MessageNode,
    "image-icon": imageIcon,
    "reply-node": ReplyNode,
    "dialog-node": DialogNode,
    "chain-node": ChainNode,
    "section-title": SectionTitle
  },
  props: {
    value: {
      type: Object,
      default: tree,
    },
    enabled:{
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      showDialogButton: false,
      showNextReply: true,
      textAlign: '',
      tr: tree,
      isDeepOne: "",
      plan_1_automated : false,
      plan_2_automated : true,
      chain: tree,
      result: [],
      dialogPlan: false,
      dialogCardErrorPlan: "",
      dialogErrorRouterPlan: "",
      dialogIconPlan: "",
      dialogTitlePlan: "",
      planTypeCard: "",
      show: false,
      loadingPadding: "",
      overlay : true,
      test: this.chainProp,
      testTwo : this.value,
      defChain: tree,
      messageNodeWidth: "",
      imageNodeWidth: ""
    };
  },
  watch:{
  },
  computed: {
    enableAddOption() {
        return (this.value && this.value.text && this.value.text.length > 0) || (this.value && this.value.url && this.value.url.length > 0);
    },
    enabeldWithUrl(){
      return  this.value.url && this.value.url.length > 0;
    },
    enableAddReply() {
      return (
        this.enableAddOption  &&
        !(this.value.dialogs && this.value.dialogs.length > 0)
      );
    },
    enableAddDefDialog(){
      return (
        this.enableAddOption  &&
        !(this.value.replies && this.value.replies.length > 0)
      );
    },
    enableAddDialog() {
      return (
        this.enableAddOption &&
        !(this.value.replies && this.value.replies.length > 0) 
        && this.value.level > 0
      );
      
    },
    selectedReply() {
      if (this.value && this.value.replies) {
        
        let selected = this.value.replies.find((x) => x.selected == true);
        return selected;
      }
      return null;
    },

    enableEditReplyMessage() {
      let id = this.selectedReply.id
      let enable =
        this.selectedReply &&
        this.selectedReply.text &&
        this.selectedReply.text.length > 0;
      if (enable) return true;

      return false;
    },
  },
  methods: {
    deletedURls(){
      this.$emit("deletedUrls")
    },
    onResize() {
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
      if(window.innerWidth <= 600){
        this.messageNodeWidth = "message-mob"
        this.imageNodeWidth = "img-mob"
      }
      if(window.innerWidth > 600){
        this.messageNodeWidth = "message-lg"
        this.imageNodeWidth = "img-lg"
      }
    },
    handelMessageFocused(focused) {
      this.$emit("messageFocused", focused);
    },
    handelFocusReply(index, reply, focused) {
      if (focused) {
        console.log(reply);
        bus.$emit("replyText", reply.text)
        this.$store.state.textReply = reply.text
        this.$store.state.replyLevele = this.enableAddOption
        this.selectReply(reply);
      }
    },
    async handelDeleteReply(index, reply) {
      const showConfirm =
        (reply.next.text && reply.next.text.length > 0) ||
        (reply.next.replies && reply.next.replies.length > 0);
      if (showConfirm) {
        // const res = await this.$confirm("This will erase the reply and related data! Are you sure?");
        let deleteReply = i18n.t("delet_reply")
        const res = await this.$root.$confirm('delete', deleteReply);
      if (this.$route.params.new == "new") {
        localStorage.setItem(`${this.$route.params.id}_${this.$route.params.new}_is_edited`, true)
      } else {
      localStorage.setItem(`${this.$route.params.id}_${this.$route.params.new}_is_edited`, true)
      }
      if (!res) {
      if (this.$route.params.new == "new") {
        localStorage.setItem(`${this.$route.params.id}_${this.$route.params.new}_is_edited`, true)
      } else {
      localStorage.setItem(`${this.$route.params.id}_${this.$route.params.new}_is_edited`, true)
      }
        return
      };
      }
      this.value.replies.splice(index, 1)
      if (reply.selected && this.value.replies.length > 0) {
        const nIndex =
          index - 1 == 0 ? 0 : this.value.replies.length % (index - 1);
        this.selectReply(this.value.replies[nIndex]);
        if(this.$store.state.planTypeCard === "1"){
          bus.$on("newChain", (data) => {
            new PlanService(data, this.value.replies[nIndex].id, async (res)=> {
          if(res.results[0].length > 1){
              this.dialogPlan = true
              this.dialogErrorRouterPlan = "/plans";
              this.dialogTitlePlan = i18n.t('upgrade');
              this.dialogCardErrorPlan = i18n.t("automated_depth_1");;
              this.dialogIconPlan = "mdi-update";
              // this.value.replies.splice(index, 1)
          }
        })
          })
        } 
       else if(this.$store.state.planTypeCard === "2"){
          bus.$on("newChain", (data) => {
            new PlanService(data, this.value.replies[nIndex].id, async (res)=> {
          if(res.results[0].length > 3){
                this.dialogPlan = true
            this.dialogErrorRouterPlan = "/plans";
            this.dialogTitlePlan = i18n.t('upgrade');
            this.dialogCardErrorPlan = i18n.t("automated_depth_3");;
            this.dialogIconPlan = "mdi-update";
              // this.value.replies.splice(index, 1)
          }
        })
          })
       }
      }
    },
    async handelDeleteDialog(index, dialog) {
      if (this.$route.params.new == "new") {
        localStorage.setItem(`${this.$route.params.id}_${this.$route.params.new}_is_edited`, true)
      } else {
      localStorage.setItem(`${this.$route.params.id}_${this.$route.params.new}_is_edited`, true)
      }
      this.value.dialogs.splice(index, 1);
    },
    handelEditDialog(data) {
      this.$emit("editDialog", data);
      this.$store.state.newLocation = data.dialog.values.position;
      this.$store.state.zoom = data.dialog.values.zoom
      let position = data.dialog.values.position
      let url = data.dialog.values.url
      this.$store.state.mediaUrl = url
      bus.$emit("shareUrl", url)
      let listArray = data.dialog.values.listmessage
      let listMulti = data.dialog.values.multiMessage
      bus.$emit("position", position)
      bus.$emit("listMessage", listArray)
      bus.$emit("multiMessage", listMulti)
      bus.$emit('editedDialog',true)
    },
    handelAddReply(index) {
      let reply = new Reply();
      reply.next.level = this.value.level + 1;
      this.value.replies.push(reply);
      this.selectReply(reply);
        
        if(this.$store.state.planTypeCard === "1"){
          bus.$on("newChain", (data) => {
            new PlanService(data, reply.id, async (res)=> {
          if(res.results[0] && res.results[0].length > 1){
              this.dialogPlan = true
              this.dialogErrorRouterPlan = "/plans";
              this.dialogTitlePlan = i18n.t('upgrade');
              this.dialogCardErrorPlan = i18n.t("automated_depth_1");;
              this.dialogIconPlan = "mdi-update";
              this.value.replies.splice(index, 1)
          }
        })
          })
        } 
       else if(this.$store.state.planTypeCard === "2"){
          bus.$on("newChain", (data) => {
            new PlanService(data, reply.id, async (res)=> {
          if(res.results[0] && res.results[0].length > 3){
                this.dialogPlan = true
            this.dialogErrorRouterPlan = "/plans";
            this.dialogTitlePlan = i18n.t('upgrade');
            this.dialogCardErrorPlan = i18n.t("automated_depth_3");;
            this.dialogIconPlan = "mdi-update";
              this.value.replies.splice(index, 1)
          }
        })
          })
       }

    },
    handelAddDialog(chain) {
      this.$emit("addDialog", chain);
    },
    async selectReply(reply) {
      if (!reply.selected) {
        this.showNextReply = false;
        this.value.replies.forEach((x) => (x.selected = false));
        reply.selected = true;
        setTimeout(() => {
          this.showNextReply = true;
        }, 100);
        
        
      }
    },
  },
  mounted(){
    if(this.value.dialogs){
      let addNew = this.enableAddDialog
      addNew = true
    }
    this.overlay = false
    bus.$on("newChain", data => this.test = data)
  },
  async beforeMount(){
    
    
  },
  updated(){
    bus.$emit('enabled', this.enableAddOption)
  },
  created(){
    bus.$emit('enabled', this.enableAddOption)
    bus.$on('arabicLang', () => {
      this.textAlign = "text-left"
    })
    bus.$on('englishLang', () => {
      this.textAlign = "text-right"
    })
    bus.$on("u", (data) => {
      this.value.imgurl = data
      bus.$emit("ru", this.value.url)
    })
    bus.$emit("ru", this.value.url)
    if(this.$vuetify.rtl || localStorage.getItem('local_lang') == "ar"){
        this.textAlign = "text-left"
      } else {
        this.textAlign = "text-right"
      }
      console.log(this.value)
  }
};
</script>

<style lang="scss">
.theme--light.outer-img
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: transparent !important;
}
.chain-container {
  .replies-dialogs-container {
    text-align: end;
  }
  .fade-enter-active {
    transition: opacity 0.5s;
  }
  .fade-leave-active {
    transition: opacity 0.25s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
.englishPadding {
  padding: 0 30px 0 270px !important;
}
.arabicPadding {
  padding: 0 270px 0 30px !important;
}
.img-lg{
  width: 6% !important;
}
.message-lg{
  width: 94% !important;
}
.img-mob{
  width: 9% !important;
}
.message-mob{
  width: 91% !important;
}
</style>
