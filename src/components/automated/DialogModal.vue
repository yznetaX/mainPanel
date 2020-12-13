<template>
  <div v-resize="onResize">
    <v-dialog v-model="dialog" persistent scrollable max-width="700">
      <v-card class="px-4 py-2" height="100%">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn
              
              color="secondary"
              v-on="on"
              class="mt-2"
              >{{ title }}</v-btn
            >
          </template>
          <v-list flat max-height="250" style="overflow-y:scroll">
            <v-list-item
              v-for="(option, index) in options"
              :key="index"
              @click="handelSelectOption(option, index)"
              dense
              :class="option.bgClass"
              >
              <span>
                {{$t(`dialog_types.${option.id}`)}}
              </span>
              <v-spacer></v-spacer>
              <v-icon class="me-2" v-if="option.plan_type == planType  ? true : false">mdi-lock-outline</v-icon>
              <v-icon class="me-2" v-if="option.plan_type_two == planType  ? true : false">mdi-lock-outline</v-icon>
              </v-list-item
            >
          </v-list>
        </v-menu>
          <v-alert color="red darken-4 mt-2" v-model="errorMessage" dark >{{
              dialogModalError
          }}</v-alert>
          <v-alert class="mt-2 py-1 mb-0 px-1 red--text text--darken-4" outlined type="error" v-if="descriptionPlan && planDisabled || planDisabledTwo">{{$t(descriptionPlan)}}</v-alert>
          <v-card-text class="py-2 px-0" v-if="descriptionMessage && !fileInput" v-html="$t(descriptionMessage)"></v-card-text>
        <v-card-actions class="py-0 px-0" v-if="isNumberCard">
          <v-text-field
            :disabled="processing || planDisabled || planDisabledTwo"
            prepend-icon="mdi-card-account-phone-outline"
            color="secondary"
            :label="$t(`dialog_types.card_number_name`)"
            v-model="inputs.display_name"
          ></v-text-field>
        </v-card-actions>
        <v-card-actions class="py-0 px-0" v-if="isNumberCard">
          <v-text-field
            color="secondary"
            :disabled="processing || planDisabled || planDisabledTwo"
            prepend-icon="mdi-phone"
            :label="$t(`dialog_types.send_card_number`)"
            required
            v-model="inputs.card_number"
          ></v-text-field>
        </v-card-actions>



        <v-card-actions v-if="isIncludeMessage && !fileInput" class="py-0">
          <v-row>
            <v-col cols="12 pa-0 pb-4">
            <v-textarea
            rows="3"
            color="secondary"
            :disabled="processing || planDisabled || planDisabledTwo"
            v-model="inputs.message"
            prepend-inner-icon="mdi-emoticon"
            @click:prepend-inner="showEmojiPicker"
            :placeholder="$t('message')"
            outlined
            no-resize
            required
            :hide-details="true"
            ref="message"
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

        </v-card-actions>

        <v-card-actions v-if="showTextareaList" class="py-0 mt-2">
          <v-row>
            <v-col cols="12 pa-0 pb-4">
            <v-text-field
            rows="1"
            color="secondary"
            :disabled="processing || planDisabled || planDisabledTwo"
            v-model="listValue"
            prepend-inner-icon="mdi-emoticon"
            @click:prepend-inner="showEmojiPickerList"
            append-icon="mdi-plus-box"
            @click:append="addToarray"
            @keydown.enter="addToarray"
            :placeholder="$t('textarea_list')"
            outlined
            required
            :hide-details="true"
            ref="messageList"
          ></v-text-field>
          <v-menu
            v-model="emojiModalList"
            class="emoji-menu"
            offset-Y
            :position-x="x"
            :position-y="y"
            :close-on-content-click="false"
          >
            <VEmojiPicker
              @select="selectEmojiList"
              :emojiSize="25"
              :emojisByRow="4"
              :showCategories="false"
              style="width: 250px; height: 250px"
            />
          </v-menu>
          <v-card class="mt-2" flat max-width="700">
            <v-chip-group multiple column style="max-height: 150px !important" ref="chipgroup">
              <div v-for="(chip,index) in listValueArray" :key="index">
            <v-chip class="chip-width">
              <v-icon small class="me-1" @click="deleteItem(index,chip)">mdi-close-circle </v-icon>
              {{
                chip.text.length > maxLength
                  ? chip.text.slice(0, maxLength) + "..."
                  : chip.text
              }}
            </v-chip>
            </div>
            </v-chip-group>
          </v-card>
            </v-col>
          </v-row>

        </v-card-actions>
        <v-card-actions v-if="showMultiMessage" class="py-0 mt-2">
          <v-row>
            <v-col cols="12 pa-0 pb-4">
            <v-text-field
            rows="1"
            color="secondary"
            :disabled="processing || planDisabled || planDisabledTwo || limit"
            v-model="multiMessage"
            prepend-inner-icon="mdi-emoticon"
            @click:prepend-inner="showEmojiPickerList"
            append-icon="mdi-plus-box"
            @click:append="addTomulti"
            @keydown.enter="addTomulti"
            :placeholder="$t('multi_list')"
            outlined
            required
            :hide-details="true"
            ref="messageListMulti"
          ></v-text-field>
          <v-menu
            v-model="emojiModalList"
            class="emoji-menu"
            offset-Y
            :position-x="x"
            :position-y="y"
            :close-on-content-click="false"
          >
            <VEmojiPicker
              @select="selectEmojiListMessage"
              :emojiSize="25"
              :emojisByRow="4"
              :showCategories="false"
              style="width: 250px; height: 250px"
            />
          </v-menu>
          <v-card class="mt-2" flat max-width="700">
            <v-chip-group multiple column   style="max-height: 400px !important" ref="chipgroupMulti">
              <div v-for="(chip,index) in listValueMessages" :key="index" class="d-block">
                
            <v-chip>
              <v-icon small class="me-1" @click="deleteItemMulti(index,chip)">mdi-close-circle </v-icon>
              <span class="text-subtitle-1">{{index += 1}}. </span>
              {{
                chip.text.length > maxLengthMulti
                  ? chip.text.slice(0, maxLengthMulti) + "..."
                  : chip.text
              }}
            </v-chip>
            </div>
            </v-chip-group>
          </v-card>
            </v-col>
          </v-row>

        </v-card-actions>


        <v-card-actions v-if="indcludeTTS" class="pb-0 px-0">
          <v-select
            :disabled="processing || planDisabled || planDisabledTwo"
            v-model="inputs.voice_type"
            :items="ttsInput"
            :item-text="text"
            item-value="value"
            :label="$t('select_voice_type')"
            outlined
            color="secondary"
            dense
            return-object
            prepend-icon="mdi-account-voice"
            required
          >
          </v-select>
        </v-card-actions>
        <v-card-actions v-if="isIncludeTtsMessage" class="py-0 px-0">
          <v-textarea
            rows="3"
            color="secondary"
            :disabled="processing || planDisabled || planDisabledTwo"
            v-model="inputs.ttsMessage"
            prepend-icon="mdi-android-messages"
            :label="$t('message')"
            outlined
            no-resize
            :rules="[rulesTTS.moreThan100, rulesTTS.lessThan5]"
            counter
            required
          ></v-textarea>
        </v-card-actions>
        
        <v-tabs
        v-if="fileInput"
      color="orange"
      class="dialog-tabs"
    >
      <v-tab>{{$t('dialog_file_form')}}</v-tab>
      <v-tab :disabled="!this.$store.state.mediaUrl" @click="overlayDialog=false">{{$t('dialog_file_preivew')}}</v-tab>

      <v-tab-item>
        <v-card-text class="py-2 px-0" v-if="descriptionMessage" v-html="$t(descriptionMessage)"></v-card-text>
        <v-card-actions v-if="isIncludeMessage" class="py-0">
          <v-row>
            <v-col cols="12 pa-0 pb-4">
            <v-textarea
            rows="3"
            color="secondary"
            :disabled="processing || planDisabled || planDisabledTwo"
            v-model="inputs.message"
            prepend-inner-icon="mdi-emoticon"
            @click:prepend-inner="showEmojiPicker"
            :placeholder="$t('message')"
            outlined
            no-resize
            required
            :hide-details="true"
            ref="message"
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

        </v-card-actions>
<v-card-actions v-if="inputMessage" class="py-0 pt-1">
          <span>{{ inputMessage }}</span>
        </v-card-actions>
        <v-card-actions v-if="fileInput" class="py-0 px-0">
          <v-file-input
            :disabled="processing || planDisabled || planDisabledTwo"
            v-model="inputs.file"
            :rules="rules"
            :accept="fileInput.accept"
            :prepend-icon="fileInput.icon"
            color="secondary"
            :label="$t(`dialog_types.${fileInput.placeholder}`)"
          ></v-file-input>
        </v-card-actions>
        <v-card-actions v-if="textInput" class="py-0 px-0">
          <v-text-field
            color="secondary"
            :disabled="processing || planDisabled || planDisabledTwo"
            v-model="inputs.url"
            :prepend-icon="textInput.icon"
            :label="$t(`dialog_types.${textInput.placeholder}`)"
          ></v-text-field>
        </v-card-actions>
      </v-tab-item>

      <v-tab-item :class="tabMiniHeight">
        <v-card-actions>
          <v-overlay :value="overlayDialog" absolute color="white" opacity="1">
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
            <v-img :src="this.$store.state.mediaUrl" max-width="350" max-height="350" @error="handelErrorImg" @loadeddata="overlayDialog = false"></v-img>
          </v-card>
          <v-card v-if="thereError" width="100%" flat>
            <v-card-title class="d-block text-center">
              {{$t("img_not_found")}}
            </v-card-title>
          </v-card>
        </v-card-actions>
      </v-tab-item>
    </v-tabs>
        
        <v-card-actions v-if="gpsLocation">
          <Map />
        </v-card-actions>
        <v-card-actions class="mt-0 flex-row-reverse">
          <v-btn
            :loading="isTrue"
            v-if="isOptionSelected"
            class="ms-3"
            color="secondary"
            @click="handelSave"
            :disabled="processing || planDisabled || planDisabledTwo"
            small
            >{{ $t("save") }}</v-btn
          >
          <v-btn
            
            @click="handelClose"
            color="orange"
            dark
            class="mx-1"
            small
            >{{ $t("close") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/*eslint-disable*/
// import options from "./config";
import VEmojiPicker from "v-emoji-picker";
import { postDataToServer } from "./utils";
import i18n from "../../plugins/i18n";
import { bus } from "../../main";
import Map from "./Map";
export default {
  components: {
    Map,
    VEmojiPicker,
  },
  props: {
    dialogId: {
      type: String,
      default: null,
    },
    option: {
      type: Object,
      default: null,
    },
    values: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      overlayDialog: true,
      listValue: "",
      multiMessage: "",
      listValueArray: [],
      listValueMessages: [],
      dialog: true,
      options: this.$store.state.options,
      selectedOption: this.option,
      thereError: false,
      dialogss: "",
      index: "",
      rules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          i18n.t("dialog_errors.invalid_file_size"),
      ],
      rulesTTS: {
        moreThan100: (value) =>
          !value ||
          value.length < 100 ||
          i18n.t("dialog_errors.invalid_tts_message"),
        lessThan5: (value) =>
          !value ||
          value.length > 5 ||
          i18n.t("dialog_errors.invalid_tts_message"),
      },
      inputs: {
        message: this.values && this.values.message, //حبيبي وين اقيمة العداد يعم تقرا من
        file: null,
        url: this.values && this.values.url,
        voice_type: this.values && this.values.voice_type,
        position: this.$store.state.newLocation,
        zoom: this.$store.state.zoom,
        card_number: this.values && this.values.card_number,
        display_name: this.values && this.values.display_name,
        ttsMessage: this.values && this.values.ttsMessage,
        listmessage: this.values && this.values.listmessage,
        multiMessage: this.values && this.values.multiMessage
      },
      errorMessage: false,
      dialogModalError: "",
      processing: null,
      isTrue: false,
      emojiModal: false,
      emojiModalList: false,
      x: 0,
      y: 0,
      deletedListArray: [],
      deletedMulti: [],
      enableEdit: '',
      planType: this.$store.state.planTypeCard,
      disabledFiled: false,
      disabledFiledTwo: false,
      showd: false,
      edit: null,
      index:-1,
      media: "",
      src: "",
      maxLength: 40,
      limit: false,
      maxLengthMulti: 80,
      icressIndexNumber: 0,
      tabMiniHeight: "img-tab"
    };
  },
  computed: {
    indexNum() {
      let icressIndexNumber = this.indexNumber;
      return (icressIndexNumber += 1);
    },
    planDisabled(){
      if(this.isOptionSelected){
        if (this.selectedOption.plan_type == undefined) return false;
        let storedPlan = this.planType
        return this.selectedOption.plan_type === storedPlan ? true : false
      }
      return false
    },
    planDisabledTwo(){
      if(this.isOptionSelected){
        if (this.selectedOption.plan_type_two == undefined) return false;
        let storedPlan = this.planType
        return this.selectedOption.plan_type_two === storedPlan ? true : false
      }
      return false
    },
    showTextareaList(){
      if(this.isOptionSelected){
        if (this.selectedOption.show_textarea_message == undefined) return false;
        return this.selectedOption.show_textarea_message
      }
      return false
    },
    showMultiMessage(){
      if(this.isOptionSelected){
        if (this.selectedOption.show_multi_message == undefined) return false;
        return this.selectedOption.show_multi_message
      }
      return false
    },
    isIncludeMessage() {
      if (this.isOptionSelected) {
        if (this.selectedOption.message == undefined) return false;
        if (this.selectedOption.description_message == undefined) return false; // وهون ؟؟؟؟
        return this.selectedOption.message;
      }
      return false;
    },
    gpsLocation() {
      if (this.isOptionSelected) {
        if (this.selectedOption.gps_location == undefined) return false; // وهون ؟؟؟؟
        return this.selectedOption.gps_location;
      }
      return false;
    },
    indcludeTTS() {
      if (this.isOptionSelected) {
        if (this.selectedOption.send_tts_message == undefined) return false;
        return this.selectedOption.send_tts_message;
      }
      return false;
    },
    isNumberCard() {
      if (this.isOptionSelected) {
        if (this.selectedOption.send_contact == undefined) return false;
        return this.selectedOption.send_contact;
      }
      return false;
    },
    isIncludeTtsMessage() {
      if (this.isOptionSelected) {
        if (
          this.selectedOption.send_tts_message == undefined &&
          this.selectedOption.tts_message == undefined
        )
          return false;
        return this.selectedOption.tts_message;
      }
      return false;
    },
    isOptionSelected() {
      return this.selectedOption != null;
    },
    title() {
      if (!this.isOptionSelected) return i18n.t("select_dialog_type");
      // return this.selectedOption.title || this.selectedOption.text;
      return i18n.t(`dialog_types.${this.selectedOption.id}`);
    },
    fileInput() {
      if (this.isOptionSelected && this.selectedOption.inputs) {
        for (var i = 0; i < this.selectedOption.inputs.length; i++)
          if (this.selectedOption.inputs[i].input_type == "file")
            return this.selectedOption.inputs[i];
      }
      return null;
    },
    textInput() {
      if (this.isOptionSelected && this.selectedOption.inputs) {
        for (var i = 0; i < this.selectedOption.inputs.length; i++)
          if (this.selectedOption.inputs[i].input_type == "text")
            return this.selectedOption.inputs[i];
      }
      return null;
    },
    ttsInput() {
      if (this.isOptionSelected && this.selectedOption.items) {
      return  this.selectedOption.items
      }
      return null;
    },
    gpsInput() {
      let pos = JSON.parse(this.selectedOption.position);
      if (this.isOptionSelected && pos) {
        return pos;
      }
      return null;
    },
    inputMessage() {
      if (this.fileInput && this.textInput)
        return i18n.t("dialog_types.pick_one_item");
      if (this.fileInput) return i18n.t("dialog_types.pick_file");
      if (this.textInput) return i18n.t("dialog_types.set_url");
      return null;
    },
    descriptionMessage(){
    if (this.isOptionSelected) {
        if (this.selectedOption.description_message == undefined) return false;
        return `dialogs_descriptions.${this.selectedOption.id}`
      }
      return false;
    },
    descriptionPlan(){
      if (this.isOptionSelected) {
        if (this.selectedOption.plan_description == undefined) return false;
        return `dialog_plan`
      }
      return false;
    }
  },
  async mounted(){
    if(this.$refs.chipgroup !==  undefined){
      let chipGroupContent = this.$refs.chipgroup.$refs.wrapper;
      chipGroupContent.style.overflowY = "auto";
    }
    if(this.$refs.chipgroupMulti !==  undefined){
      let chipGroupContent = this.$refs.chipgroupMulti.$refs.wrapper;
      chipGroupContent.style.overflowY = "auto";
    }
    
    
    if(this.$store.state.deletedArray){
      this.listValueArray = [...this.$store.state.listArrayTest, ...this.$store.state.deletedArray]
    }else {
      this.listValueArray = this.$store.state.listArrayTest
    }
    if(this.$store.state.deletedArrayMulti){
      this.listValueMessages = [...this.$store.state.listArraymulti, ...this.$store.state.deletedArrayMulti]
    }else {
      this.listValueMessages = this.$store.state.listArraymulti
    }
  },
  created() {
    bus.$on("shareUrl", data => {
      console.log(data)
      this.src = data
    })
    console.log(this.$store.state.mediaUrl)
    bus.$on("delte", (data) => {});
    bus.$on("sharePosition", (data) => {
      this.inputs.position = data;
    });
    bus.$on("shareZoom", (data) => {
      this.inputs.zoom = data;
    });
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
    handelErrorImg(){
      this.thereError = true
    },
    async deleteItem(index,chip){
      let deletedArray = this.deletedListArray
      this.listValueArray.splice(index, 1);
      deletedArray.push(chip)
      this.$store.state.deletedArray = deletedArray
    },
    async deleteItemMulti(index,chip){
      index -= 1 
      let deletedArray = this.deletedMulti
      this.listValueMessages.splice(index, 1);
      if(this.listValueMessages.length > 6){
        this.limit = true
      }else{
        this.limit = false
      }
      deletedArray.push(chip)
      this.$store.state.deletedArrayMulti = deletedArray
    },
    addToarray(){
      let valueArray = this.listValueArray
      let valueObject = {
        text: this.listValue
      }
      valueArray.push(valueObject)
      this.listValue = ''
    },
    addTomulti(){
      let valueArray = this.listValueMessages
      let valueObject = {
        text: this.multiMessage
      }
      
      if(valueArray.length > 6){
        this.limit = true
      }else{
        valueArray.push(valueObject)
        this.icressIndexNumber += 1
      }
      this.multiMessage = ''
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
      showEmojiPickerList(e){
e.preventDefault()
        this.emojiModalList = false
        this.x = e.clientX
        this.y = e.clientY
        this.$nextTick(() => {
          this.emojiModalList = true
        })
      },
    caretEmoji(emoji) {
      const textArea = this.$refs.message.$refs.input
      this.cursorPosition = textArea.selectionEnd;
      const start = this.inputs.message.substring(0, textArea.selectionStart); // بس هي this.input لمين
      const end = this.inputs.message.substring(textArea.selectionStart);
      this.inputs.message = start + emoji + end;
      textArea.focus();
      this.$nextTick(() => {
        textArea.selectionEnd = this.cursorPosition + emoji.length;
      });
    },
    selectEmoji(emoji) { 
      this.caretEmoji(emoji.data)
    },
    caretEmojiList(emoji) {
      const textArea = this.$refs.messageList.$refs.input
      this.cursorPosition = textArea.selectionEnd;
      const start = this.listValue.substring(0, textArea.selectionStart); // بس هي this.input لمين
      const end = this.listValue.substring(textArea.selectionStart);
      this.listValue = start + emoji + end;
      textArea.focus();
      this.$nextTick(() => {
        textArea.selectionEnd = this.cursorPosition + emoji.length;
      });
    },
    selectEmojiList(emoji){
      this.caretEmojiList(emoji.data)
    },
    caretEmojiListMessage(emoji) {
      const textArea = this.$refs.messageListMulti.$refs.input
      this.cursorPosition = textArea.selectionEnd;
      const start = this.multiMessage.substring(0, textArea.selectionStart); // بس هي this.input لمين
      const end = this.multiMessage.substring(textArea.selectionStart);
      this.multiMessage = start + emoji + end;
      textArea.focus();
      this.$nextTick(() => {
        textArea.selectionEnd = this.cursorPosition + emoji.length;
      });
    },
    selectEmojiListMessage(emoji){
      this.caretEmojiListMessage(emoji.data)
    },
    text: item => i18n.t(`${item.text}`),
    handelSelectOption(option, index) {
    // this.planTypeDisableTwo()
      this.listValueArray = []
      this.listValueMessages = []
      this.$store.state.mediaUrl = ""
      this.errorMessage = false;
      this.inputs.message = ""
      this.inputs.file = this.inputs.url = this.inputs.voice_type = this.inputs.number = this.inputs.name = null;
      this.selectedOption = option;
      if (this.selectedOption.gps_location) {
        this.$store.state.zoom = 7;
        this.$store.state.newLocation = {
          lat: parseFloat(localStorage.getItem("lat")),
          lng: parseFloat(localStorage.getItem("lng")),
        };
      }
    },
    async beforeDestroy(){
      this.listValueArray = [...this.$store.state.listArrayTest , ...this.$store.state.deletedArray]
      await this.handelSave()
      this.$store.state.deletedArray = []
      this.listValueMessages = [...this.$store.state.listArraymulti , ...this.$store.state.deletedArrayMulti]
      await this.handelSave()
      this.$store.state.deletedArrayMulti = []
      
    },
    handelClose() {
      this.dialog = false;
      
      this.$emit("hide");
    },
    handelSave() {
      this.errorMessage = false;
      this.processing = true;
      this.isTrue = true;
      if (this.isValidLocaly()) {
        this.checkInServer((data) => {
          console.log(data)
          this.processing = false;
          if (data.success) {
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
            let numberIdEdit = `${this.$route.params.id}_edit`;
            localStorage.setItem(numberIdEdit, true);
            this.dialog = false;
            if (data.url) this.inputs.url = data.url;
            this.$emit("save", {
              option: this.selectedOption,
              values: {
                message: this.inputs.message,
                url: this.inputs.url,
                voice_type: this.inputs.voice_type,
                position: this.inputs.position,
                zoom: this.inputs.zoom,
                card_number: this.inputs.card_number,
                display_name: this.inputs.display_name,
                ttsMessage: this.inputs.ttsMessage,
                listmessage: this.listValueArray,
                multiMessage: this.listValueMessages
              },
            });
            
          } else {
            if (data.error) {
              this.errorMessage = true;
              if(data.error == "Error: Network Error"){
                this.dialogModalError = i18n.t(`dialog_errors.network_error`);
                this.processing = false;
                this.isTrue = false
              
              }else {
              this.dialogModalError = i18n.t(`dialog_errors.${data.error}`);
              this.isTrue = false
              this.processing = false;
              }
            } else {
              this.errorMessage = true;
              this.dialogModalError = i18n.t("dialog_errors.no_input_data");
              this.processing = false;
            }
          }
        });
      } else {
              this.processing = false;
      this.isTrue = false;
      }
    },
    isValidLocaly() {
      if (
        !this.fileInput &&
        !this.textInput &&
        !this.selectedOption.send_tts_message &&
        !this.inputs.message &&
        !this.selectedOption.gps_location &&
        !this.selectedOption.send_contact &&
        !this.selectedOption.show_textarea_message &&
        !this.selectedOption.show_multi_message
      ) {
        this.errorMessage = true;
        this.dialogModalError = i18n.t("dialog_errors.no_valid_message");
        return false;
      }

      if (
        this.fileInput &&
        this.textInput &&
        !this.selectedOption.gps_location &&
        ((this.inputs.file && this.inputs.url && this.inputs.url.length > 0) ||
          (!this.inputs.file && (!this.inputs.url || this.inputs.url === "")))
      ) {
        this.errorMessage = true;
        this.dialogModalError = i18n.t("dialog_errors.no_selected_file");
        return false;
      }

      if (this.fileInput && !this.textInput && !this.inputs.file) {
        this.errorMessage = true;
        this.dialogModalError = i18n.t("dialog_errors.no_pick_file");
        return false;
      }

      if (
        !this.fileInput &&
        this.textInput &&
        (!this.inputs.url || this.inputs.url === "")
      ) {
        this.errorMessage = true;
        this.dialogModalError = i18n.t("dialog_errors.no_url");
        return false;
      }
      if (this.selectedOption.send_tts_message && !this.inputs.ttsMessage) {
        this.errorMessage = true;
        this.dialogModalError = i18n.t("dialog_errors.enter_message");
        return false;
      }
      if (
        this.selectedOption.send_contact &&
        !this.inputs.card_number &&
        !this.inputs.displat_name
      ) {
        this.errorMessage = true;
        this.dialogModalError = i18n.t("dialog_errors.enter_number");
        return false;
      }
      return true;
    },
    checkInServer(callback) {
      postDataToServer({
        dialogId: this.dialogId,
        option: this.selectedOption,
        inputs: this.inputs,
      }).then((serverData) => {
        console.log(serverData)
        callback(serverData);
      });
    },
  },
};
</script>

<style lang="scss">
.v-list-item {
  min-height: 34px !important;
}
.locked_items{
  // background: rgb(51 54 141 / 7%);
  background: #f0f0fd;
}
.img-shadow{
  box-shadow: 1px 1px 1px 1px #ccc;
}
.dialog-tabs{
  .v-tabs-bar{
    height: 40px !important
  }
}
.chip-width{
  max-width: 300px !important
}
.img-tab{
  min-height: 270px !important
}
.tab-mini{
  min-height: 150px !important
}
.v-slide-group__wrapper{
      contain: content;
    display: flex;
    flex: 1 1 auto;
    overflow: auto;
    touch-action: none;

}
</style>
<!-- {{ optionsTranslate[index] }} -->