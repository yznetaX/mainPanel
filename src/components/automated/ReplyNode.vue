<template>
  <div :class="view" style="position: relative;" v-resize="onResize">
    <div
      :class="[
        'reply-container option-node px-1',
        selected ? 'reply-active' : '',
        hover ? hoverClass : '',
      ]"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <span>{{ indexNum + "-" }}</span>
      <input
        type="text"
        v-model="text"
        :placeholder="placeHolderTranslate"
        v-autowidth="{ maxWidth: '250px', minWidth: '20px', comfortZone: 0 }"
        @input="handelChange"
        @blur="handelFocus(false)"
        @focus="handelFocus(true)"
        @keypress.enter="handelEnter"
        @keydown="savePress"
        @keypress="codeKey"
        :id="id"
        class="test"
        ref="reply"
      />
      <v-icon @click="handelDelete" small class="ms-1">
        mdi-close-box
      </v-icon>
      <v-menu
        class="emoji-menu"
        offset-Y
        :close-on-content-click="false"
        :nudge-bottom="35"
      >
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon x-small>
            <v-icon>
              mdi-emoticon
            </v-icon>
          </v-btn>
        </template>
        <VEmojiPicker
          @select="selectEmoji"
          :emojiSize="25"
          :emojisByRow="4"
          :showCategories="false"
          style="width: 250px; height: 250px"
        />
      </v-menu>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import i18n from "../../plugins/i18n";
import { bus } from "../../main";
import VEmojiPicker from "v-emoji-picker";
export default {
  name: "reply-node",
  components: {
    VEmojiPicker,
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    selected: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: "",
    },
    indexNumber: {
      type: Number,
    },
  },
  data() {
    return {
      text: this.value,
      placeHolder: "",
      hover: false,
      view: this.$store.state.typeView,
      showErrorAlert: this.$store.state.replyDelete,
      showIcon: false,
      hoverClass: "reply-hover"
    };
  },
  mounted() {
    if (this.selected) {
      let input = document.getElementById(this.id);
      input.focus();
    }
  },
  computed: {
    indexNum() {
      let icressIndexNumber = this.indexNumber;
      return (icressIndexNumber += 1);
    },
    placeHolderTranslate() {
      return (this.placeHolder = i18n.t("option_reply"));
    },
  },
  methods: {
    onResize(){
      if (window.innerWidth < 600) {
        this.hoverClass = "mobile-hover"
      }
      if (window.innerWidth >= 600) {
        this.hoverClass = "reply-hover"
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
      this.$emit("input", this.text);
      bus.$emit("replyText", this.text)
      this.$store.state.textReply = this.text
    },
    handelFocus(isFocused) {
      this.$emit("focused", isFocused);
    },
    handelDelete() {
      this.$emit("delete");
    },
    handelEnter() {
      this.$emit("enterPressed");
      this.showPicker = false;
    },
    savePress() {
      let numberIdEdit = `${this.$route.params.id}_edit`;
      localStorage.setItem(numberIdEdit, true);
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
    selectEmoji(emoji) {
      this.caretEmoji(emoji.data)
      this.handelChange();
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
    caretEmoji(emoji){
      const textArea = this.$refs.reply
      this.cursorPosition = textArea.selectionEnd;
      const start = this.text.substring(0, textArea.selectionStart); // بس هي this.input لمين
      const end = this.text.substring(textArea.selectionStart);
      this.text = start + emoji + end;
      textArea.focus();
      this.$nextTick(() => {
        textArea.selectionEnd = this.cursorPosition + emoji.length;
      });
    }
  },
  watch: {
    value: function(to, from) {
      this.text = to;
    },
  },
  created() {
    bus.$on("comfort", () => {
      this.view = "comfortable-view"; // test
      this.$store.state.typeView = this.view;
    });
    bus.$on("compact", () => {
      this.view = "compact-view";
      this.$store.state.typeView = this.view;
    });
    if (this.text && this.text.length > 0) {
      this.showIcon = true;
    } else {
      this.showIcon = false;
    }
  },
  updated() {
    if (this.text && this.text.length > 0) {
      this.showIcon = true;
    } else {
      this.showIcon = false;
    }
  },
};
</script>

<style lang="scss">
$reply-color-f: #e8ffd5;
$reply-color-b: white;
$reply-place-holder: #82befd;

.reply-container {
  background-color: $reply-color-f;
  box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
  input {
    max-width: 17rem;
    background-color: transparent;
    border: 0px;
    color: #000;
    outline: none;
    font-size: 14px;
  }
  input::placeholder {
    color: grey;
    font-size: 14px;
  }
  div {
    display: inline-block;
    width: 1.4rem;
    height: 1.45rem;
    position: absolute;
    top: -4px;
    right: -8px;
    background-color: grey;
    color: white;
    border-radius: 14px;
    cursor: pointer;
    text-align: center;
  }
  div:hover {
    background-color: grey;
    color: white;
  }
}
.reply-active {
  background-color: $reply-color-b;
  border: $reply-color-b;
  input {
    color: #000;
  }
}
.reply-hover {
  background-color: #f0ffe2;
  border: #f0ffe2;
}
.mobile-hover{
  background-color: #FFF;
  border: #FFF;
}
.v-badge__badge {
  bottom: calc(100% - 5px) !important;
  left: calc(100% - 7px) !important;
  right: auto;
  top: auto;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s !important;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0 !important;
}
.v-menu {
  display: none !important;
}
.emoji-menu {
  box-shadow: none !important;
}
</style>
