import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);
export default new Vuex.Store({
  namespaced: true,
  state: {
    scenarios_list: [],
    color: "#f9f9f9",
    replyDelete:  false,
    rtl: true,
    loginButton: null,
    logoutButton: null,
    newLocation: null,
    zoom: null,
    subtitle: "",
    title: "",
    oldTitle: "",
    elements: [],
    typeView: "compact-view",
    options: [
      {
        id: "send_text",
        message: true,
        description_message: true,
      },
      {
        id: "send_tts_message",
        send_tts_message: true,
        tts_message: true,
        message: false,
        bgClass: "locked_items",
        plan_type: "1",
        plan_type_two: "2",
        plan_description: "dialog_plan",
        description_message: true,
        items: [{
          text:"male_voice",
          value: "m"
        },
        {
          text:"female_voice",
          value: "f"
        }] 
      },
      {
        id: "send_gps",
        gps_location: true,
        message: false,
        plan_type: "1",
        plan_description: "dialog_plan",
        description_message: true,
      },
      {
        id: "send_vcard",
        send_contact: true,
        message: false,
        description_message: true,
        bgClass: "locked_items",
      },
      {
        id: "send_photo",
        description_message: true,
        message: true,
        inputs: [
          {
            icon: "mdi-camera",
            placeholder: "pick_an_avatar",
            input_type: "file",
            data_type: "photo",
            accept: ".jpeg , .jpg",
          },
          {
            icon: "mdi-web",
            placeholder: "set_avatar_url",
            input_type: "text",
            data_type: "url",
          },
        ],
      },
      {
        id: "send_audio",
        bgClass: "locked_items",
        description_message: true,
        message: false,
        plan_type: "1",
        plan_type_two: "2",
        plan_description: "dialog_plan",
        inputs: [
          {
            icon: "mdi-phone-outline",
            placeholder: "pick_a_voice",
            input_type: "file",
            data_type: "audio",
            accept: ".mp3",
          },
          {
            icon: "mdi-web",
            placeholder: "set_voice_url",
            input_type: "text",
            data_type: "url",
            required: false,
          },
        ],
      },
      {
        id: "send_video",
        description_message: true,
        message: true,
        plan_type: "1",
        plan_description: "dialog_plan",
        inputs: [
          {
            icon: "mdi-video",
            placeholder: "pick_a_video",
            input_type: "file",
            data_type: "video",
            accept: ".mp4",
            required: false,
          },
          {
            icon: "mdi-web",
            placeholder: "set_video_url",
            input_type: "text",
            data_type: "url",
            required: false,
          },
        ],
      },
      {
        id: "send_document",
        bgClass: "locked_items",
        description_message: true,
        message: false,
        plan_type: "1",
        plan_type_two: "2",
        plan_description: "dialog_plan",
        inputs: [
          {
            icon: "mdi-file-document",
            placeholder: "pick_a_document",
            input_type: "file",
            data_type: "document",
            accept: ".pdf, .doc, .docx ,.csv,.xls,.xlsx,.ppt,.ppts,.gz,.zip,.text,.7z",
          },
          {
            icon: "mdi-web",
            placeholder: "set_document_url",
            input_type: "text",
            data_type: "url",
          },
        ],
      },
      // {
      //   id: "send_wordpress",
      //   description_message: true,
      //   message: true,
      //   plan_type: "1",
      //   plan_type_two: "2",
      //   plan_description: "dialog_plan",
      //   inputs: [
      //     {
      //       icon: "mdi-web",
      //       placeholder: "set_rss_url",
      //       input_type: "text",
      //       data_type: "url",
      //     },
      //   ],
      // },
      {
        id: "send_multiple_messages",
        show_multi_message: true,
        description_message: true,
        plan_description: "dialog_plan",
      },
      {
        id: "ask_photo_reply",
        description_message: true,
        message: true,
        plan_type: "1",
        bgClass: "locked_items",
        plan_description: "dialog_plan",
        inputs: [
          {
            icon: "mdi-camera",
            placeholder: "pick_an_avatar",
            input_type: "file",
            data_type: "photo",
            accept: ".jpeg , .jpg",
          },
          {
            icon: "mdi-web",
            placeholder: "set_avatar_url",
            input_type: "text",
            data_type: "url",
          },
        ],
      },
      {
        id: "ask_list",
        plan_type: "1",
        show_textarea_message: true,
        message: true,
        description_message: true,
        plan_description: "dialog_plan",
      },
      {
        id: "ask_email",
        plan_type: "1",
        description_message: true,
        plan_type_two: "2",
        message: true,
        bgClass: "locked_items",
        plan_description: "dialog_plan",
      },
      {
        id: "ask_phone",
        plan_type: "1",
        description_message: true,
        message: true,
        plan_description: "dialog_plan",
      },
      {
        id: "ask_photo",
        plan_type: "1",
        bgClass: "locked_items",
        description_message: true,
        message: true,
        plan_description: "dialog_plan",
      },
      {
        id: "ask_audio",
        plan_type: "1",
        plan_type_two: "2",
        description_message: true,
        message: true,
        plan_description: "dialog_plan",
      },
      {
        id: "ask_video",
        plan_type: "1",
        plan_type_two: "2",
        description_message: true,
        message: true,
        bgClass: "locked_items",
        plan_description: "dialog_plan",
      },
      {
        id: "ask_document",
        plan_type: "1",
        plan_type_two: "2",
        description_message: true,
        message: true,
        plan_description: "dialog_plan",
      },
      {
        id: "ask_contact",
        plan_type: "1",
        description_message: true,
        bgClass: "locked_items",
        message: true,
        plan_description: "dialog_plan",
      },
      {
        id: "ask_gps",
        plan_type: "1",
        plan_type_two: "2",
        description_message: true,
        message: true,
        plan_description: "dialog_plan",
      },
      {
        id: "ask_text",
        plan_type: "1",
        description_message: true,
        message: true,
        bgClass: "locked_items",
        plan_description: "dialog_plan",
      },
    ],
    sch_options: [
      {
        id: "send_text",
        message: true,
        description_message: true
      },
      {
        id: "send_tts_message",
        send_tts_message: true,
        tts_message: true,
        message: false,
        description_message: true,
        items: [{
          text:"male_voice",
          value: "m"
        },
        {
          text:"female_voice",
          value: "f"
        }] 
      },
      {
        id: "send_vcard",
        send_contact: true,
        message: false,
        description_message: true,
      },
      {
        id: "send_photo",
        description_message: true,
        inputs: [
          {
            icon: "mdi-camera",
            placeholder: "pick_an_avatar",
            input_type: "file",
            data_type: "photo",
            accept: ".jpeg , .jpg",
          },
          {
            icon: "mdi-web",
            placeholder: "set_avatar_url",
            input_type: "text",
            data_type: "url",
          },
        ],
      },
      {
        id: "send_audio",
        description_message: true,
        inputs: [
          {
            icon: "mdi-phone-outline",
            placeholder: "pick_a_voice",
            input_type: "file",
            data_type: "audio",
            accept: ".mp3",
          },
          {
            icon: "mdi-web",
            placeholder: "set_voice_url",
            input_type: "text",
            data_type: "url",
            required: false,
          },
        ],
      },
      {
        id: "send_video",
        description_message: true,
        inputs: [
          {
            icon: "mdi-video",
            placeholder: "pick_a_video",
            input_type: "file",
            data_type: "video",
            accept: ".mp4",
            required: false,
          },
          {
            icon: "mdi-web",
            placeholder: "set_video_url",
            input_type: "text",
            data_type: "url",
            required: false,
          },
        ],
      },
      {
        id: "send_document",
        description_message: true,
        inputs: [
          {
            icon: "mdi-file-document",
            placeholder: "pick_a_document",
            input_type: "file",
            data_type: "document",
            accept: ".pdf, .doc, .docx ,.csv,.xls,.xlsx,.ppt,.ppts,.gz,.zip,.text,.7z",
          },
          {
            icon: "mdi-web",
            placeholder: "set_document_url",
            input_type: "text",
            data_type: "url",
          },
        ],
      },
    ],
    cards: [],
    loadhain: [],
    number_id: "",
    photo_profile: "",
    phone_number: null,
    rand_id: "",
    card_number: "",
    session_status: "",
    oneCard: {},
    userEmail: "",
    selectedOption: '',
    settings: [],
    working_array: [],
    avatarPhoneNumber: "",
    sessionsArray: [],
    mainReports: '',
    lastSeen: '',
    isOnlineArray: {},
    reportItem: {},
    reportNumber: "",
    number_status: [],
    timeZoneStore: [],
    timeFormatSwitch: null,
    deletedArray: [],
    deletedArrayMulti: [],
    listArrayTest: [],
    listArraymulti: [],
    resetEmail: "",
    botStatus: "",
    p: "",
    ph: "",
    contacts: [],
    planTypeCard: "",
    thisChain: {},
    avatars: {},
    mediaUrl: "",
    singleAvatar: "",
    reporetsNumber: [],
    sixMonth: "",
    oneMonth: "",
    textReply: "",
    replyLevele: ""
  },
  getters: {
    doneData: state => {
      return state.isOnlineArray
    },
    chain: state => {
      return state.thisChain
    },
    singleAvata : state => {
      return state.singleAvatar
    },
    reporetsNumber: state => {
      return state.reporetsNumber
    }
  },
  mutations: {
    updateElements: (state, payload) => {
      state.elements = payload;
    },
    changeDir: (state, payload) => {
      state.rtl = payload;
    },
    restoreData: (state, payload) => {
      state.elements = payload;
    },
    addTree: (state) => {
      state.elements = state.elements.push();
    },
    getData: (state, payload) => {
      state.isOnlineArray = payload
    }
  },
  actions: {
    updateElements: ({ commit }, payload) => {
      commit("updateElements", payload);
    },
    changeDir: ({ commit }, payload) => {
      commit("changeDir", payload);
    },
    restore: ({ commit }, payload) => {
      commit("restoreData", payload);
    },
    addTree: async ({ commit }, { title }) => {
      commit("addTree", title);
    },
    removeTree: async ({ commit }, id) => {
      await axios.delete(`http://instaranker.com/test_array.php/${id}`);
      commit("removeTree", id);
    },
    getData: ({commit}, payload) => {
      commit('getData', payload)
    }
  },
  modules: {},
});
