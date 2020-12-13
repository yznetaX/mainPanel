<template>
  <div>
    <v-dialog v-model="dialog"  ref="reportDialog" scrollable max-width="500">
      <v-card  flat  elevation="0">
        
        <v-overlay :value="overlay" absolute color="white" opacity="1">
          <v-row align-content="center" justify="center">
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
        <v-card width="500" flat>
            <v-img max-width="500" position="inherit" :src="dialogData" v-if="dialogType == 'ask_photo'"  class="mx-auto" @load="overlay = false"></v-img>
        </v-card>
        <v-card-actions class="py-4">
          <v-btn small color="secondary" target="_blank" :href="dialogData">
            {{$t('download')}}
          </v-btn>
          <v-btn small color="orange" dark @click="dialog = false">
            {{$t('cancel')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="replyDialog"
      max-width="500px"
      @click:outside="closeDialogReply"
    >
      <v-card class="pt-2">
        <v-card-subtitle v-if="dialog_answer == null || dialog_answer == 'gps'">
          <v-icon>
            mdi-account
          </v-icon>
          <v-img :src="dialog_data" width="150" height="150" v-if="dialog_id == 'ask_photo'"></v-img>
          <video v-if="dialog_id == 'ask_video'" :src="dialog_data"></video>
          <audio v-if="dialog_id == 'ask_audio'" :src="dialog_data"></audio>
        </v-card-subtitle>
        <v-card-subtitle v-if="dialog_data == null" class="pb-2 ps-4">
          <v-icon class="me-2">mdi-account</v-icon>
          {{dialog_answer}}
        </v-card-subtitle>
        <v-form v-model="valid" ref="form">
        <v-card-subtitle class="py-0">
          <v-textarea ref="message" v-model="text" no-resize rows="2" prepend-icon="mdi-emoticon" @click:prepend="showEmojiPicker" dense :label="$t('admin')" outlined :rules="replyDialogRule"></v-textarea>
        </v-card-subtitle>
        <v-card-actions class="py-0">
          <div style="width: 50%">
              <v-img  src="../assets/whatsBg.png" @click="replyQoute = !replayAll"  width="120" class="mx-auto reportImg">
              
              <v-img :src="all" class="mt-6"></v-img>
              </v-img>
            <v-row justify="center">
              <v-switch ref="reprotSwitch" v-model="replyQoute" falt @click="replayAll = !replyQoute"  color="secondary" class="my-0"></v-switch>
            </v-row>
          </div>
          <v-spacer></v-spacer>
          <div style="width: 50%;">
              <v-img  src="../assets/whatsBg.png" @click="replyQoute = !replayAll" width="120" class="mx-auto reportImg" >
              <v-img :src="qoute"></v-img>
              </v-img>
            <v-row justify="center" style="width: 262px;">
              <v-switch ref="reprotSwitch" falt @click="replyQoute = !replayAll" v-model="replayAll"  color="secondary" class="my-0"></v-switch>
            </v-row>
          </div>
        </v-card-actions>
        </v-form>
        <v-alert outlined close-label color="red darken-4"  type="error"  v-if="hasAnError" class="mx-4 text-caption" >{{errorData}}</v-alert>
        <v-card-actions class="pt-0 d-block ms-auto">
          <v-btn small color="orange" class="white--text" @click="closeDialogReply">
            {{$t('cancel')}}
          </v-btn>
          <v-btn small color="primary" @click="sendAdminMessage()" :loading="sendReplayLoading" :disabled="perLoading">
            {{$t('send_reply')}}
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-menu
          v-model="emojiModal"
            class="emoji-menu"
            offset-Y
            :position-x="x"
            :position-y="y"
            :close-on-content-click="false"
            :nudge-bottom="30"
          >
            <VEmojiPicker
              @select="selectEmoji"
              :emojiSize="25"
              :emojisByRow="4"
              :showCategories="false"
              style="width: 250px; height: 250px"
            />
    </v-menu>
    </v-dialog>
  </div>
</template>
<script>
import { bus } from "../main";
import VEmojiPicker from "v-emoji-picker";
import dialogReport from '../mixins/httpHandler'
import i18n from '../plugins/i18n.js'

export default {
  components:{
    VEmojiPicker
  },
  data() {
    return {
      emojiModal: false,
      replyQoute: false,
      replayAll: true,
      dialog: false,
      dialogData: "",
      dialogType: "",
      overlay: true,
      replyDialog: false,
      dialog_answer: null,
      dialog_data: null,
      replyDialogRule:[
        (v) => !!v || this.tg || false
      ],
      dialog_id: null,
      text: '',
      x: 0,
      y: 0,
      answer_id: null,
      sendReplayLoading: false,
      perLoading: false,
      valid: true,
      all: "",
      qoute: "",
      hasAnError:false,
      errorData: ''
    };
  },
  computed: {
    tg(){
    return i18n.tc('admin_error')
    }
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
    s()
    {
        let replyDialogSwitch = this.$refs.reprotSwitch.$el.children[0].childNodes[0].childNodes[0]
        replyDialogSwitch.classList.add('mx-auto')
    },
    closeDialogReply(){
      this.replyDialog = false
      this.$refs.form.reset()
      this.$refs.form.resetValidation()
    },
    sendAdminMessage(){
      if(this.replayAll) {
        let adminMessageData ={
        router: 'admin_text_replay',
        number_id: this.$route.params.id,
        answer_id: this.answer_id,
        text_reply: this.text
      }
      this.sendReplayLoading = true
      this.perLoading = true
    if (this.$refs.form.validate()) {
      this.post(adminMessageData,false).then((response) => {
         if (response.data.session == false) {
          this.$router.push("/login").catch((err) => err);
        }
        if (response.data.success) {
            this.sendReplayLoading = false
        this.perLoading = false
        this.replyDialog = false
        this.$refs.form.reset()
          }else {
            this.sendReplayLoading = false
        this.perLoading = false
            this.hasAnError = true
            this.errorData = i18n.t(`dialog_cards_error.${response.data.message}`)
          }
        
      })
      }else {
        this.sendReplayLoading = false
        this.perLoading = false
      }

      }
      if (this.replyQoute) {
        let adminQouteData = {
        router: 'admin_text_replay',
        number_id: this.$route.params.id,
        from_number: this.$route.params.number,
        text_reply: this.text
        }
        this.sendReplayLoading = true
        this.perLoading = true
        if (this.$refs.form.validate()) {
        this.post(adminQouteData,false).then((response) => {
          if (response.data.success) {
            this.sendReplayLoading = false
            this.perLoading = false
            this.replyDialog = false
            this.$refs.form.reset()
          }else {
            this.hasAnError = true
            this.errorData = i18n.t(`dialog_cards_error.${response.data.message}`)
           this.sendReplayLoading = false
            this.perLoading = false
          }
          if (response.data.session == false) {
          this.$router.push("/login").catch((err) => err);
        }
        
      })
        }else {
        this.sendReplayLoading = false
        this.perLoading = false
      }
      }
    },
    showEmojiPicker (e) {
        e.preventDefault()
        this.emojiModal = false
        this.x = e.clientX
        this.y = e.clientY
        this.$nextTick(() => {
          this.emojiModal = true
        })
      },
      caretEmoji(emoji) {
      const textArea = this.$refs.message.$refs.input
      this.cursorPosition = textArea.selectionEnd;
      const start = this.text.substring(0, textArea.selectionStart); // بس هي this.input لمين
      const end = this.text.substring(textArea.selectionStart);
      this.text = start + emoji + end;
      textArea.focus();
      this.$nextTick(() => {
        textArea.selectionEnd = this.cursorPosition + emoji.length;
      });
    },
    selectEmoji(emoji) {
      this.caretEmoji(emoji.data);
    },
    showImage(){
      if (i18n.locale == "en") {
        this.all = require('../assets/en.jpg')
        this.qoute = require('../assets/en_qoute.jpg')
      }
      if (i18n.locale == "ar") {
        this.all = require('../assets/ar.jpeg')
        this.qoute = require('../assets/ar_qoute.jpg')
      }
    }
  },
  created() {
    bus.$on("sharePhoto", (data) => {
      this.dialogData = data.dialog_data;
      this.dialogType = data.dialog_id;
      this.dialog = true;
    });
    bus.$on("openReplay", (data) => {
      this.dialog_answer = data.dialog_answer
      this.answer_id = data.answer_id
      this.dialog_data = data.dialog_data
      this.dialog_id = data.dialog_id
      this.replyDialog = true
    })
    
  },
  mounted() {
    this.checkSessionState()
    this.showImage()
    this.hasAnError = false
  },
  updated() {
    this.showImage()
  },
  mixins: [dialogReport]
};
</script>
<style >
.bgColor{
  background: transparent !important;
  box-shadow: none !important;
}
.reportImg {
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
</style>
