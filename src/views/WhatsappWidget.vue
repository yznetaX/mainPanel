<template>
  <div class="whatsapp-widget px-2" :class="marginButtom" v-resize="onResize">
    <vue-topprogress
      ref="topProgress"
      :color="'#81217d'"
      :height="3"
    ></vue-topprogress>
    <overlay :overlay="overlay" />
    <v-card flat>
<v-card-title
          class="pt-1 px-0 secondary--text mujeebk-title"
        >
        <Backword v-if="showBackword" />
        {{ $t("widget_settings") }}
      </v-card-title>
      <v-card-subtitle
        class="px-0 subtitle-1"
        v-html="$t('whatsapp_widget_description')"
      ></v-card-subtitle>
            <v-row>
        <v-col cols="12" sm="8" md="6" style="position:relative">
          <v-card-text
            class="subtitle-1 px-0 pt-0"
            style="font-family: Cairo !important;"
            >{{ $t("source_code") }}</v-card-text
          >
          <v-text-field
            style="cursor:pointer !important"
            append-outer-icon="mdi-content-copy"
            @click:append-outer="copyText"
            @click="copyText"
            dense
            ref="sourceCode"
            solo
            :value="
              `<script src='https://mujeebk.com/widget/${$route.params.id}/'></script>`
            "
          ></v-text-field>
          <div
            class="grey darken-1 white--text fab-text-custom"
            :class="tooltip"
            v-if="tooltipShow"
          >
            {{ $t("copied") }}
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="6">
          <v-btn block color="primary" @click="showDefaultWidget">
            {{$t('live_demo')}}
          </v-btn>
        </v-col>
      </v-row>
            <v-row>
        <v-col cols="12" sm="8" md="6">
          <v-card-text
            class="subtitle-1 px-0 pt-0"
            style="font-family: Cairo !important;"
            >{{ $t("widget_welcome_message") }}</v-card-text
          >
          <v-textarea
            rows="3"
            color="secondary"
            prepend-inner-icon="mdi-emoticon"
            @click:prepend-inner="showEmojiPicker"
            :placeholder="$t('message')"
            v-model="welcomMessga"
            @change="welcomMessageValue"
            outlined
            no-resize
            required
            ref="message"
            :rules="widgetRules"
            counter
          ></v-textarea>
          <v-menu
            v-model="emojiModal"
            class="emoji-menu"
            offset-Y
            :position-x="x"
            :position-y="y"
            :close-on-content-click="false"
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
      <v-row>
        <v-col cols="12" sm="8" md="6">
          <v-card-text
            class="subtitle-1 px-0 pt-0"
            style="font-family: Cairo !important;"
            >{{ $t("agent_name") }}</v-card-text
          >
          <v-text-field
            :hide-details="true"
            solo
            dense
            :label="$t('agent_name')"
            @change="agentNameValue"
            v-model="agentName"
            :disabled="disabeldFeild"
            append-outer-icon="mdi-account"
          ></v-text-field>
        </v-col>
      </v-row>
            <v-row>
        <v-col cols="12" sm="8" md="6">
          <v-card-text
            class="subtitle-1 px-0 pt-0"
            style="font-family: Cairo !important;"
            >{{ $t("widget_position_title") }}</v-card-text
          >
          <v-select
            v-model="haveValue"
            :items="widgetPosition"
            :label="$t('choose')"
            :item-text="manageVal"
            item-value="value"
            solo
            ref="manageRef"
            append-outer-icon="mdi-panorama-wide-angle"
            dense
            :hide-details="true"
            @change="widgetPositionValue"
            :disabled="disabeldFeild"
          >
            <template v-slot:selection="{ item }">
              <span class="subtitle-2">{{ $t(item.name) }}</span>
            </template>
            <template v-slot:item="{ item }">
              <v-list dense class="pa-0">
                <v-list-item dense class="pa-0">
                  <span class="subtitle-2">
                    {{ $t(item.name) }}
                  </span>
                </v-list-item>
              </v-list>
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="6">
          <v-card-text
            class="subtitle-1 px-0 pt-0"
            style="font-family: Cairo !important;"
            >{{ $t("widget_on_scroll_title") }}</v-card-text
          >
          <v-select
            v-model="haveScrollValue"
            :items="widgetPositionOnScroll"
            :label="$t('choose')"
            :item-text="scrollVal"
            item-value="value"
            solo
            ref="manageRef"
            append-outer-icon="mdi-valve-open"
            dense
            :hide-details="true"
            :disabled="disabeldFeild"
            @change="widgetOnScrollVal"
          >
            <template v-slot:selection="{ item }">
              <span class="subtitle-2">{{ $t(item.name) }}</span>
            </template>
            <template v-slot:item="{ item }">
              <v-list dense class="pa-0">
                <v-list-item dense class="pa-0">
                  <span class="subtitle-2">
                    {{ $t(item.name) }}
                  </span>
                </v-list-item>
              </v-list>
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="6">
          <v-card-text
            class="subtitle-1 py-0 px-0"
            style="font-family: Cairo !important;"
            >{{ $t("catalog_card") }}</v-card-text
          >
          <v-subheader
            style="font-family: Cairo !important;letter-spacing: 0;"
            class="px-0"
            
          >
            <v-switch
              color="secondary"
              inset
              v-model="haveCatalog"
              @change="sendCatalog"
            ></v-switch>
            <span
              class="subtitle-2 my-auto"
              style="font-family: Cairo !important;"
              >{{ $t("have_catalog") }}</span
            >
            <v-icon class="ms-auto">
            mdi-book-open-blank-variant
          </v-icon>
          </v-subheader>
          
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import i18n from "../plugins/i18n";
import VEmojiPicker from "v-emoji-picker";
import widgetHttp from "../mixins/httpHandler";
// import { bus } from '../main';
import overlay from "../components/cirlceOverlay";
import Backword from "../components/Backword";
export default {
  components: {
    VEmojiPicker,
    overlay,
    Backword
  },
  data() {
    return {
      haveValue: null,
      haveScrollValue: null,
      emojiModal: "",
      x: 0,
      y: 0,
      welcomMessga: null,
      agentName: null,
      message: "copy this text",
      snakeContent: "",
      show: false,
      tooltip: "",
      tooltipShow: false,
      widgetPosition: [
        {
          name: "right",
          value: "right",
        },
        {
          name: "left",
          value: "left",
        },
      ],
      widgetPositionOnScroll: [
        {
          name: "yes",
          value: "yes",
        },
        {
          name: "no",
          value: "no",
        },
      ],
      marginButtom: "",
      changeToCopy: true,
      overlay: true,
      widgetRules: [
        (value) =>
          !value || value.length < 100 || i18n.t("widget_error_message"),
      ],
      disabeldFeild: true,
      haveCatalog: false,
      showBackword: ""
    };
  },
  methods: {
    sendCatalog(){
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
      this.handelSave()
    },
    showDefaultWidget() {
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
      let widgetData = {
        id: this.$route.params.id,
      };
      let widgetScript = document.createElement("script");
      widgetScript.removeAttribute("src");
      widgetScript.setAttribute(
        "src",
        `https://mujeebk.com/widget/${widgetData.id}/`
      );
      document.head.appendChild(widgetScript);
      this.handelSave()
    },
    onResize() {
      if (window.innerWidth >= 1250) {
        this.showBackword = true
      }
      if (window.innerWidth < 1250) {
        this.showBackword = false
      }
      if (window.innerWidth < 600) {
        this.marginButtom = "mb-16";
      } else {
        this.marginButtom = "mb-8";
      }
    },
    async widgetPositionValue(val) {
      if (this.$refs.message.valid) {
              this.$refs.topProgress.start();
      this.haveValue = val;
      this.changeToCopy = false;
      await this.handelSave();
      this.$refs.topProgress.done();
      }

    },
    async widgetOnScrollVal(val) {
      if (this.$refs.message.valid) {
              this.$refs.topProgress.start();
      this.haveScrollValue = val;
      this.changeToCopy = false;
      await this.handelSave();
      this.$refs.topProgress.done();
      }

    },
    manageVal: (item) => i18n.t(item.name),
    scrollVal: (item) => i18n.t(item.name),
    copyText() {
      this.$refs.topProgress.start();
      this.$nextTick(() => {
        this.$refs.topProgress.done();
      });
      this.tooltip = "fab-text-custom";
      this.tooltipShow = true;
      let test = this.$refs.sourceCode.$el.querySelector("input");
      test.select();
      document.execCommand("copy");
      setTimeout(() => {
        this.tooltip = "";
        this.tooltipShow = false;
      }, 4000);
    },
    showEmojiPicker(e) {
      e.preventDefault();
      this.emojiModal = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.emojiModal = true;
      });
    },
    async agentNameValue(name) {
      if (this.$refs.message.valid) {
      this.$refs.topProgress.start();
      this.agentName = name;
      await this.handelSave();
      this.changeToCopy = false;
      this.$refs.topProgress.done();
      }

    },
    async welcomMessageValue(message) {
      if (this.$refs.message.valid) {
        this.$refs.topProgress.start();
        this.welcomMessga = message;
        this.changeToCopy = false;
        await this.handelSave();
        this.$refs.topProgress.done();
        this.disabeldFeild = false
      }else {
        this.disabeldFeild = true
      }
    },
    caretEmoji(emoji) {
      const textArea = this.$refs.message.$refs.input;
      this.cursorPosition = textArea.selectionEnd;
      const start = this.welcomMessga.substring(0, textArea.selectionStart); // بس هي this.input لمين
      const end = this.welcomMessga.substring(textArea.selectionStart);
      this.welcomMessga = start + emoji + end;
      textArea.focus();
      this.$nextTick(() => {
        textArea.selectionEnd = this.cursorPosition + emoji.length;
      });
    },
    selectEmoji(emoji) {
      this.caretEmoji(emoji.data);
    },
    handelSave() {
      let widget = {
        widget_position: this.haveValue,
        widget_on_scroll: this.haveScrollValue,
        agent_name: this.agentName,
        welcome_messga: this.welcomMessga,
        have_catalog : this.haveCatalog
      };
      if (this.checkSaveLocaly()) {
        let widgetData = {
          router: "set_widget",
          number_id: this.$route.params.id,
          widget_json: JSON.stringify(widget),
        };
        this.post(widgetData, false).then((response) => {
          if (response.data.success) {
            let widgetData = {
              id: this.$route.params.id,
            };
            let widgetScript = document.createElement("script");
            widgetScript.removeAttribute("src");
            widgetScript.setAttribute(
              "src",
              `https://mujeebk.com/widget/${widgetData.id}/`
            );
            document.head.appendChild(widgetScript);
          }
        });
      }
    },
    checkSaveLocaly() {
      if (this.haveValue == null) {
        return false;
      }
      if (this.haveScrollValue == null) {
        return false;
      }
      if (this.agentName == null) {
        return false;
      }
      if (this.welcomMessga == null) {
        return false;
      }
      return true;
    },
    getWidgetSetting() {
      let getWidgetData = {
        router: "get_widget",
        number_id: this.$route.params.id,
      };
      this.post(getWidgetData, false).then(async (response) => {
        this.agentName = response.data.widget_json.agent_name;
        this.welcomMessga = response.data.widget_json.welcome_messga;
        this.haveScrollValue = response.data.widget_json.widget_on_scroll;
        this.haveValue = response.data.widget_json.widget_position;
        this.overlay = false;
        this.handelSave()
      });
    },
  },
  computed: {
    widgetPostion() {
      let widgetPositionValue = this.haveValue;
      return widgetPositionValue === null
        ? i18n.t("widget_position_title")
        : widgetPositionValue;
    },
    openWidgetOnPageScroll() {
      let widgetOpenOnScroll = this.haveScrollValue;
      return widgetOpenOnScroll === null
        ? i18n.t("widget_on_scroll")
        : widgetOpenOnScroll;
    },
    changeTextareaToEnable(){
      let valid = this.$refs.message.valid
      return valid === true ? false : true
    }
  },
  mounted() {
    this.showDefaultWidget()
    if (this.$refs.message.valid) {
      this.disabeldFeild = false
    }else {
      this.disabeldFeild = true
    }
    this.getWidgetSetting();
    if (this.$refs.manageRef.$refs.label != undefined) {
      let allow = this.$refs.manageRef.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
    this.overlay = false;
  },
  updated() {
    if (this.$refs.manageRef.$refs.label != undefined) {
      let allow = this.$refs.manageRef.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
  },
  mixins: [widgetHttp],
};
</script>
<style>
.fab-text-custom {
  position: absolute;
  right: 165px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 3px 8px;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  top: 15px;
  border-radius: 2px;
}
</style>
