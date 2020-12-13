<template>
  <div class="message-container">
    <div class="input-container" style="position: relative">
      <v-row v-resize="onResize">
        <v-col cols="12" class="py-0 pe-0">
          <v-textarea
            type="text"
            v-model="text"
            :rows="lineCount"
            @input="handelChange($event)"
            @blur="handelFocus(true)" 
            @focus="handelFocus(true)"
            :placeholder="placeHolderTranslate"
            class="px-2 py-2 pt-1"
            :id="id"
            ref="message"
            :disabled="!enabled"
            append-outer-icon="mdi-emoticon"
            @click:append-outer="showEmojiPicker"
            color="secondary"
            outlined
            filled
            
            @keydown.native="savePress"
            @keypress.native="codeKey"
            background-color="white"
            :hide-details="true"
          >
          </v-textarea>
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
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import i18n from "../../plugins/i18n";
import { bus } from "../../main";
import { postImgToServer } from "./utils";
import VEmojiPicker from "v-emoji-picker";
export default {
  name: "message-node",
  components: {
    VEmojiPicker,
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    id: {
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
      text: this.value,
      placeHolder: "",
      showPicker: false,
      emojiPicker: "english-emoji-picker",
      emoticonButton: "english-emotion-icon",
      screenIcon: true,
      xsScreen: false,
      marginButton: "",
      emojiModal: false,
      x: 0,
      y: 0,
      show: false,
      dataImg: "",
      replyText: "",
      enabledAdd: null
    };
  },
  methods: {
    removeBorder(){
      let fildest = this.$refs.message.$refs['input-slot'].childNodes[0]
      fildest.style.border = "none"
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
    codeKey(event) {
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
      this.$emit("input", this.text);
    },
    handelFocus(isFocused) {
      this.$emit("focused", isFocused);
    },
    savePress() {
      let numberIdEdit = `${this.$route.params.id}_edit`;
      localStorage.setItem(numberIdEdit, true);
      this.emojiModal = false
    },
    selectEmoji(emoji) {
      this.caretEmoji(emoji.data);
      this.handelChange()
      // this.text += emoji.data;
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
    },
    onResize() {
      if (window.innerWidth <= 600) {
        this.screenIcon = false;
        this.xsScreen = true;
        this.marginButton = "mt-4";
      }
      if (window.innerWidth > 600) {
        this.screenIcon = true;
        this.marginButton = "";
      }
      if (window.innerWidth <= 400) {
        this.xsScreen = true;
        this.screenIcon = false;
      }
    },
  },
  watch: {
    value: function(to, from) {
      this.text = to;
    },
  },
  computed: {
    placeHolderTranslate() {
      return this.enabledAdd == true ? (this.placeHolder = i18n.t("bot_message")) + " " +  this.$store.state.textReply : i18n.t("bot_message_without_for");
    },
    lineCount() {
      // Return number of lines using regex if not empty
      let row = this.text.split(/\r\n|\r|\n/).length;
      if (row <= 4) {
        return row;
      } else {
        return (row = 4);
      }
      // return this.text.length ? this.text.split(/\r\n|\r|\n/).length : 1;
    },

  },
  beforeMount() {
    if (localStorage.getItem("local_lang") == "ar") {
      this.emojiPicker = "arabic-emoji-picker";
      this.emoticonButton = "arabic-emotion-icon";
    }
    if (localStorage.getItem("local_lang") == "en") {
      this.emojiPicker = "english-emoji-picker";
      this.emoticonButton = "english-emotion-icon";
    }
    bus.$on("replyText", data => this.replyText = data)
  },
  created() {
    bus.$on('enabled', data => {
      this.enabledAdd = data
      if(this.enabledAdd == ""){
        return false
      }else{
        return this.enabledAdd
      }
    })
    bus.$on("arabicLang", () => {
      this.emojiPicker = "arabic-emoji-picker";
      this.emoticonButton = "arabic-emotion-icon";
    });
    bus.$on("englishLang", () => {
      this.emojiPicker = "english-emoji-picker";
      this.emoticonButton = "english-emotion-icon";
    });
    // bus.$on("ru" ,data => this.url = data)
    this.onResize();
    // bus.$on("replyText", data => this.replyText = data)
  },
  mounted() {
    this.removeBorder()
    console.log(this.value)
  },
  updated() {
    this.onResize();
  },
};
</script>
<style lang="scss">
</style>
