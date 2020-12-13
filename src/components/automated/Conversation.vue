<template>
  <div :class="[bg, whatsappChatbot]">
    <v-overlay :value="overlay" color="white" opacity="1" v-resize="onResize">
      <v-row align-content="center" justify="center" :class="overlayPadding">
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
    <v-dialog v-model="hasAnError" max-width="400">
      <v-card>
        <v-toolbar color="secondary" dark dense height="34" flat>
          <v-toolbar-title class="white--text subtitle-1">{{
            $t("error")
          }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-4" v-html="$t(errorData)"></v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn color="orange" @click="hasAnError = false" small dark>{{
            $t("close")
          }}</v-btn>
          <v-btn
            small
            color="secondary"
            @click="hasAnError = false"
            :to="dialogErrorRouter"
            router
            class="ms-2"
            v-if="dialogButton"
          >
            <v-icon class="me-1" small>
              {{ dialogIcon }}
            </v-icon>
            <span>{{ dialogTitle }}</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="convDialog"
      max-width="600"
      transition="dialog-transition"
    >
      <v-card class="pa-4">
        <v-card-title class="qr-session-error">
          {{ conversationDialogError }}
        </v-card-title>
        <v-card-actions class="text-right d-block">
          <v-btn @click="convDialog = false" color="#ff9b0e" dark small>
            <v-icon class="me-1">
              mdi-close
            </v-icon>
            <span>
              {{ $t("close") }}
            </span>
          </v-btn>
          <v-btn
            small
            color="secondary"
            @click="convDialog = false"
            :to="dialogErrorRouter"
            router
            class="ms-2"
          >
            <v-icon class="me-1">
              {{ convDialogIcon }}
            </v-icon>
            <span>{{ convDialogTitle }}</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar color="red darken-4" v-model="searchError" bottom>{{
      errorSearch
    }}</v-snackbar>
    <v-snackbar color="red darken-4" bottom v-model="errorMessage">{{
      errorConversationMessage
    }}</v-snackbar>
    <div class="search">
      <v-toolbar dense color="#00bfa5" elevation="0" class="px-0 conv-toolbar">
        <v-simple-table class="table-conversation" ref="conv_table">
          <template v-slot:default>
            <tbody>
              <tr>
                <td class="pa-0" style="width: 70px; vertical-align : middle;">
                  <avatar
                    :avatarClass="'conv-avatar'"
                    :phone_number="phoneNumber"
                    v-if="showAvatar"
                    :color_avatar="'white'"
                    :show_online_dot="false"
                  />
                </td>
                <td class="px-2" style="width: 100%; vertical-align : middle;">
                  <v-menu
                    class="menu-search"
                    v-model="searchMenu"
                    :max-height="500"
                    offset-y
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        type="text"
                        v-model="searchText"
                        :placeholder="$t('search')"
                        @keypress.enter="handelSearchEnter"
                        v-on="on"
                        height="40"
                        color="white"
                        class="search-input"
                        dense
                        :disabled="$route.params.new == 'default'"
                      >
                      </v-text-field>
                    </template>
                    <v-card
                      v-if="searchResults && searchResults.length > 0"
                      flat
                      :elevation="0"
                      style="border: 1px solid #e8e8e8;"
                    >
                      <v-list class="py-0">
                        <v-list-item dense>
                          <v-list-item-content class="py-0">
                            <v-list-item-subtitle
                              class="mt-2 title font-weight-regular"
                            >
                              <span>{{ $t("result_of") }} </span>
                              <span class="title">{{ lastSearchText }}</span>
                            </v-list-item-subtitle>
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-btn
                              icon
                              color="red"
                              @click="
                                () => {
                                  searchResults = [];
                                  searchMenu = false;
                                }
                              "
                            >
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </v-list-item-action>
                        </v-list-item>
                      </v-list>
                      <v-divider></v-divider>
                      <v-list>
                        <v-list-item
                          v-for="(result, index) in searchResults"
                          :key="index"
                          @click="handelSearchResult(result.value)"
                          dense
                        >
                          <v-list-item-action>{{
                            result.text
                          }}</v-list-item-action>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-menu>
                </td>

                <td
                  class="px-0 pe-1"
                  v-if="$route.params.new === 'new' ? false : true"
                >
                  <v-btn
                    text
                    class="px-1 ps-0"
                    dark
                    small
                    @click="changeButton"
                    :loading="conversationButtonStatus"
                    :disabled="$route.params.new == 'default'"
                  >
                    <v-icon small class="me-1">
                      {{ iconCard }}
                    </v-icon>
                    {{ $t(statusCard) }}
                  </v-btn>
                </td>
                <td class="px-0">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        small
                        elevation="0"
                        color="white"
                        v-on="on"
                        text
                        class="px-0"
                      >
                        <v-icon small class="me-1">
                          mdi-view-dashboard-outline
                        </v-icon>
                        {{ $t("view_option") }}
                      </v-btn>
                    </template>
                    <v-list class="py-0">
                      <v-list-item
                        @click="comfortable"
                        class="subtitle-2"
                        style="font-family: Cairo !important;font-size:0.75rem !important"
                        >{{ $t("view_comfortable") }}</v-list-item
                      >
                      <v-list-item
                        @click="compact"
                        class="subtitle-2"
                        style="font-family: Cairo !important;font-size:0.75rem !important"
                        >{{ $t("view_compact") }}</v-list-item
                      >
                    </v-list>
                  </v-menu>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-toolbar>
    </div>
    <chain-node
      class="chain-node pt-2"
      v-model="chain"
      @addDialog="handelAddDialog"
      @editDialog="handelEditDialog"
    ></chain-node>
    <dialog-modal
      class="dialog"
      v-if="modal.show"
      :dialogId="dialog.isEdit ? dialog.data.dialog.id : null"
      :option="modal.option"
      :values="modal.values"
      @hide="handelHideModal"
      @save="handelSaveModal"
    />
    <transition name="slide">
      <v-bottom-navigation
        v-if="showButtons"
        background-color="#f6f6f6"
        horizontal
      >
        <v-btn
          class="title"
          :disabled="processing || $route.params.new == 'default'"
          :rounded="true"
          @click="handelDiscard"
          small
        >
          <span class="conv-buuton">
            {{ $t("discard") }}
          </span>
          <v-icon class="me-2">
            mdi-backup-restore
          </v-icon>
        </v-btn>
        <v-btn
          :disabled="processing || $route.params.new == 'default'"
          class="black--text title"
          :rounded="true"
          @click="handelSave"
          :loading="processing"
          small
        >
          <span class="conv-buuton">
            {{ $t("save") }}
          </span>
          <v-icon class="me-2">
            mdi-floppy
          </v-icon>
        </v-btn>
      </v-bottom-navigation>
    </transition>
  </div>
</template>

<script>
/*eslint-disable*/
import i18n from "../../plugins/i18n";
import { bus } from "../../main";
import Vue from "vue";

import {
  tree,
  Chain,
  Dialog,
  SearchService,
  ValidateService,
  applySelection,
  findDeletedUrls,
  findDeletedIds,
  findDeletedChainUrls,
} from "./models";
import {
  deepClone,
  saveToLocalStorage,
  loadFromLocalStorage,
  sleep,
  mergeArrays,
  postSavedDataToServer,
} from "./utils";
import ChainNode from "./ChainNode";
import DialogModal from "./DialogModal";
import chainHttpHandler from "../../mixins/httpHandler";
import avatar from "./Avatar";
export default {
  name: "conversation",
  components: {
    "chain-node": ChainNode,
    "dialog-modal": DialogModal,
    avatar,
  },
  data() {
    return {
      modal: {
        show: false,
        option: null,
        values: null,
      },
      chain: tree,
      baseChain: tree,
      deletedUrls: [],
      deleteIds: [],
      deletedChainUrls: [],
      timerWrittenChain: tree,
      baseStorageName: "",
      storageName: "",
      deletedStorageName: "",
      deleteStorageName: "",
      searchText: "",
      lastSearchText: "",
      searchResults: [],
      searchMenu: false,
      dialog: {
        isEdit: false,
        data: null,
      },
      errorMessage: false,
      errorConversationMessage: null,
      processing: false,
      align: "",
      searchError: false,
      errorSearch: "",
      sm1: "1",
      sm2: "10",
      sm3: "1",
      subtitle: "",
      loadChainServer: "",
      title: "",
      subtitle: "",
      loadhain: "",
      conversationDialog: false,
      dialogCardError: "",
      dialogErrorRouter: "",
      showConv: false,
      overlay: true,
      showButtons: false,
      overlayPadding: "",
      avatarImage: "",
      onError: "",
      iconCard: "",
      statusCard: "",
      thisCard: [],
      oneCard: {},
      conversationDialogError: "",
      convDialog: false,
      convDialogTitle: "",
      convDialogIcon: "",
      phoneNumber: "",
      showAvatar: false,
      conversationButtonStatus: false,
      time: null,
      hasAnError: false,
      dialogIcon: "",
      dialogButton: true,
      dialogTitle: "",
      errorData: "",
      bg: "",
      whatsappChatbot: "grey",
    };
  },
  watch: {
    $route(oldVal, newVal) {
      if (newVal.fullPath != oldVal.fullPath) {
        this.overlay = true;

        setTimeout(() => {
          let loadChain =
            "_chain_" + this.$route.params.id + "_" + this.$route.params.new;
          let storageLoaded = localStorage.getItem(loadChain);
          if (storageLoaded) {
            this.overlay = false;
            this.baseChain = loadFromLocalStorage(this.baseStorageName);
            this.chain = loadFromLocalStorage(this.storageName);
            Vue.prototype.$tree = loadFromLocalStorage(this.storageName);
            this.deletedUrls = loadFromLocalStorage(this.deletedStorageName);
            this.deleteIds = loadFromLocalStorage(this.deleteStorageName);
            this.timerWrittenChain = deepClone(this.chain);
          } else if (!storageLoaded && this.$route.params.new === "new") {
            let newChain = new Chain();
            this.baseChain = newChain;
            this.chain = newChain;
            Vue.prototype.$tree = newChain;
            this.deletedUrls = [];
             this.deletedChainUrls = []
            this.deleteIds = [];
            this.timerWrittenChain = deepClone(newChain);
            this.overlay = false;
          } else {
            this.getOneScenario();
            this.overlay = false;
          }
        }, 1000);
      }
    },
  },
  methods: {
    checkChainEdit() {
      setInterval(() => {}, 500);
    },
    async getOneScenario() {
      let getOneScenario = {
        router: "get_scenario",
        number_id: this.$route.params.id,
        scenario_id: this.$route.params.new,
      };
      await this.post(getOneScenario).then((response) => {
        let loadChain = JSON.parse(response.data.scenario_json);
        // this.baseChain = loadChain;
        // this.chain = loadChain;
        saveToLocalStorage(loadChain, this.baseStorageName);
        saveToLocalStorage(loadChain, this.storageName);
        this.baseChain = loadFromLocalStorage(this.baseStorageName);
        this.chain = loadFromLocalStorage(this.storageName);
        Vue.prototype.$tree = loadChain;
        this.deletedUrls = [];
        this.deleteIds = [];
        this.timerWrittenChain = deepClone(loadChain);
      });
    },
    handelHideModal() {
      this.modal.show = false;
    },
    handelSaveModal(data) {
      if (this.dialog.isEdit) {
        //edit dialog
        let dlg = this.dialog.data.dialog;
        dlg.option = data.option;
        dlg.values = data.values;
        dlg.text = data.option.id;
      } else {
        // add dialog
        let dlg = new Dialog(data.option, data.values);
        dlg.text = data.option.id;
        this.dialog.data.dialogs.push(dlg);
      }
      this.modal.show = false;
    },
    handelAddDialog(chain) {
      this.dialog.data = chain;
      this.dialog.isEdit = false;
      this.modal.option = null;
      this.modal.values = null;
      this.modal.show = true;
    },
    handelEditDialog(data) {
      let listArray = data.dialog.values.listmessage;
      bus.$emit("listMessage", listArray);
      this.$store.state.listArrayTest = data.dialog.values.listmessage;
      this.$store.state.deletedArray = [];
      this.$store.state.listArraymulti = data.dialog.values.multiMessage;
      this.$store.state.deletedArrayMulti = [];
      let url = data.dialog.values.url;
      this.$store.state.mediaUrl = url;
      bus.$emit("shareUrl", url);
      this.dialog.data = data;
      this.dialog.isEdit = true;
      this.modal.option = data.dialog.option;
      this.modal.values = data.dialog.values;
      this.modal.show = true;
    },
    handelSearchEnter() {
      this.searchResults = [];
      this.searchMenu = false;
      if (!this.searchText || this.searchText.length == 0) return;

      new SearchService(this.chain, this.searchText, (res) => {
        if (res.results.length > 0) {
          res.results.forEach((r) => {
            let txt = res.chain.text;
            r.forEach((p) => {
              txt = p.text;
            });
            this.searchResults.push({
              text: txt,
              value: r,
            });
          });
          this.searchMenu = true;
        } else {
          this.errorSearch =
            i18n.t("error_search") + " " + `"${this.searchText}"`;
          this.searchError = true;
        }
        this.lastSearchText = this.searchText;
        this.searchText = "";
      });
    },
    handelSearchResult(res) {
      if (res != null) applySelection(this.chain, res);
    },
    findChainUrls(chain) {
      let chainUrl = [];
      if (chain) {
          chainUrl.push(chain.url)
          console.log(chain.url)
        chain.replies.forEach((reply) => {
          let nextChainUrls = this.findChainUrls(reply.next);
          if (nextChainUrls.length > 0) chainUrl = mergeArrays(chainUrl, nextChainUrls);
        });
      }
      return chainUrl;
    },
    findIds(chain) {
      let id = [];
      if (chain) {
        chain.dialogs.forEach((dialog) => {
          if (dialog.id && dialog.id.length > 0)
            id.push(dialog.id);
        });

        chain.replies.forEach((reply) => {
          let nextIds = this.findIds(reply.next);
          if (nextIds.length > 0) id = mergeArrays(id, nextIds);
        });
      }
      return id;
    },
    handelSave() {
      this.title =
        this.$store.state.title || localStorage.getItem("existing_title");
      this.subtitle = this.$store.state.subtitle;
      new ValidateService(this.chain, async (res) => {
        if (res.invalidPath == null) {
          this.processing = true;
          this.errorMessage = false;
          let newDeleteIds = findDeletedIds(this.baseChain, this.chain);
          let newDeletedUrls = findDeletedUrls(this.baseChain, this.chain);
          let chainUrls = this.findChainUrls(this.chain)
          this.deletedUrls = this.deletedUrls.filter((val) => {
            return chainUrls.indexOf(val) == -1
          })
          let chainIds = this.findIds(this.chain)
          this.deleteIds = this.deleteIds.filter((val) => {
            return chainIds.indexOf(val) == -1
          })
          console.log(newDeleteIds);
          console.log("idididididdididididididiiddii");
          console.log(this.deleteIds);
          this.deletedUrls = mergeArrays(this.deletedUrls, newDeletedUrls);
          this.deleteIds = mergeArrays(this.deleteIds, newDeleteIds);
          if (!this.title || this.title.length == 0) {
            this.title = this.subtitle;
          }
          postSavedDataToServer(
            this.chain,
            this.deletedUrls,
            this.$route.params.id,
            this.title,
            this.$route.params.new,
            this.deleteIds
          ).then(async (res) => {
            this.processing = false;
            if (res.success) {
              let editedName =
                this.$route.params.id +
                "_" +
                this.$route.params.new +
                "_is_edited";
              localStorage.setItem(
                `${this.$route.params.id}_${this.$route.params.new}_is_edited`,
                false
              );
              this.showButtons = false;
              let numberIdEdit = `${this.$route.params.id}_edit`;
              localStorage.setItem(numberIdEdit, false);
              this.deletedUrls = [];
              this.deletedChainUrls = []
              this.deleteIds = [];
              this.baseChain = deepClone(this.chain);
              this.timerWrittenChain = deepClone(this.chain);
              saveToLocalStorage(this.baseChain, this.baseStorageName);
              if (this.$route.params.new == "new") {
                await localStorage.removeItem(this.storageName);
                await localStorage.removeItem(this.baseStorageName);
                await localStorage.removeItem(this.deletedStorageName);
                await localStorage.removeItem(this.deleteStorageName);
                
                (this.baseStorageName =
                  "_base_chain_" +
                  this.$route.params.id +
                  "_" +
                  res.scenario_id),
                  (this.storageName =
                    "_chain_" + this.$route.params.id + "_" + res.scenario_id),
                  (this.deletedStorageName =
                    "_deleted_urls_" +
                    this.$route.params.id +
                    "_" +
                    res.scenario_id);
                this.deleteStorageName ="_deleted_ids_" +this.$route.params.id +"_" +res.scenario_id;

                await saveToLocalStorage(this.chain, this.storageName);
                await saveToLocalStorage(this.baseChain, this.baseStorageName);
                await saveToLocalStorage(
                  this.deletedUrls,
                  this.deletedStorageName
                );
                await saveToLocalStorage(
                  this.deleteIds,
                  this.deleteStorageName
                );
                this.chain = loadFromLocalStorage(this.storageName);
                this.baseChain = loadFromLocalStorage(this.storageName);
                let scenario_id = res.scenario_id;
                await this.$router.push(
                  "/scenario/" + this.$route.params.id + "/" + scenario_id
                );
                
              }
              else {
                await localStorage.removeItem(`_deleted_urls_${this.$route.params.id}_${this.$route.params.new}`)
                await localStorage.removeItem(`_deleted_ids_${this.$route.params.id}_${this.$route.params.new}`)
              }
            } else {
              this.errorMessage = true;
              this.errorConversationMessage = i18n.t(res.message);
            }
          });
        } else {
          applySelection(this.chain, res.invalidPath);
          await sleep(200);
          this.errorMessage = true;
          this.errorConversationMessage = i18n.t("empty_reply");
        }
      });
    },
    handelDiscard() {
      this.errorMessage = false;
      this.chain = deepClone(this.baseChain);
      saveToLocalStorage(this.chain, this.storageName);
      localStorage.setItem(
        `${this.$route.params.id}_${this.$route.params.new}_is_edited`,
        false
      );
      this.showButtons = false;
    },
    timer() {
      this.time = setInterval(() => {
        if (
          JSON.stringify(this.timerWrittenChain) != JSON.stringify(this.chain)
        ) {
          let newDeletedUrls = findDeletedUrls(
            this.timerWrittenChain,
            this.chain
          );
          let newDeleteIds = findDeletedIds(this.timerWrittenChain, this.chain);
          let newDeletedChainUrls = findDeletedChainUrls(this.timerWrittenChain, this.chain)
          this.deletedChainUrls = [...this.deletedChainUrls, ...newDeletedChainUrls]
          this.deletedUrls = mergeArrays(this.deletedUrls, newDeletedUrls, this.deletedChainUrls);
          this.deleteIds = mergeArrays(this.deleteIds, newDeleteIds);
          this.timerWrittenChain = deepClone(this.chain);
          saveToLocalStorage(this.chain, this.storageName);
          saveToLocalStorage(this.deletedUrls, this.deletedStorageName);
          saveToLocalStorage(this.deleteIds, this.deleteStorageName);
          bus.$emit("newChain", this.chain);
        }
        if (
          localStorage.getItem(
            `${this.$route.params.id}_${this.$route.params.new}_is_edited`
          ) == "true"
        ) {
          this.showButtons = true;
        } else {
          this.showButtons = false;
        }
      }, 500);
    },
    setTime() {
      this.timer();
    },
    stopTimer() {
      if (this.time) {
        clearInterval(this.time);
      }
    },
    comfortable() {
      bus.$emit("comfort");
    },
    compact() {
      bus.$emit("compact");
    },
    onResize() {
      if (window.innerWidth <= 1250) {
        this.overlayPadding = "";
      }
      if (window.innerWidth > 1250) {
        if (i18n.locale == "en" || localStorage.getItem("local_lang") == "en") {
          this.overlayPadding = "overlay-english";
        }
        if (i18n.locale == "ar" || localStorage.getItem("local_lang") == "ar") {
          this.overlayPadding = "overlay-arabic";
        }
      }
    },
    async wait(time) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, time);
      });
    },
    overlayChangePadding() {
      if (localStorage.getItem("local_lang") == "en") {
        this.overlayPadding = "overlay-english";
      }
      if (localStorage.getItem("local_lang") == "ar") {
        this.overlayPadding = "overlay-arabic";
      }
    },
    toQrScane() {
      this.$router.push("/mujeebk_web");
    },
    async getThisCard() {
      // عندك راوتر مشان نجيب بس رقم واحد
      let getThisNumber = {
        router: "get_numbers",
        number_id: this.$route.params.id,
      };
      await this.post(getThisNumber, false).then((response) => {
        this.thisCard = response.data.registered_numbers;
        response.data.registered_numbers.map((card) => {
          this.oneCard = card;
          this.phoneNumber = card.phone_number;
          this.$store.state.planTypeCard = "";
          this.$store.state.planTypeCard = card.plan_type;
          this.$store.state.avatarPhoneNumber = card.phone_number;
          this.buttonStatus();
          this.showAvatar = true;
        });
      });
    },
    async changeButton() {
      let oneCard = this.oneCard;
      let changeButtonData = {
        router: "set_status",
        status: oneCard.number_status === "1" ? "0" : "1",
        number_id: this.$route.params.id,
        scenario_id: this.$route.params.new,
      };
      this.conversationButtonStatus = true;
      await this.post(changeButtonData, false).then(async (response) => {
        if (response.data.session) {
          oneCard.number_status = response.data.status;
          this.card = this.$store.state.oneCard;
          await this.buttonStatus();
          this.conversationButtonStatus = false;
        } else {
          this.$router.push("/login");
          this.conversationButtonStatus = false;
        }
        if (!response.data.success) {
          if (response.data.message == "block_number") {
            this.hasAnError = true;
            this.dialogButton = false;
            this.errorData = `snake_cards_error.${response.data.message}`;
            this.dialogErrorRouter = `/plans/${this.$route.params.id}/${oneCard.phone_number}`;
          }
          if (response.data.message == "plan_expire") {
            this.hasAnError = true;
            this.errorData = `snake_cards_error.${response.data.message}`;
            this.dialogIcon = "mdi-update";
            this.dialogButton = true;
            this.dialogTitle = i18n.t("upgrade");
            this.dialogErrorRouter = `/plans/${this.$route.params.id}/${oneCard.phone_number}`;
          }
          if (response.data.message == "qr_session_expired") {
            //
            this.hasAnError = true;
            this.errorData = `dialog_cards_error.${response.data.message}`;
            this.dialogIcon = "mdi-qrcode";
            this.dialogTitle = i18n.t("rescane");
            this.dialogErrorRouter = "/mujeebk_web";
            oneCard.boxColorStyle = "broken-card";
            oneCard.cardStyle = false;
            this.dialogButton = true;
            oneCard.qrCardStyle = true;
          }
          if (response.data.message == "no_scenario_id") {
            this.dialogErrorRouter = "/";
            this.dialogButton = true;
            this.convDialog = true;
            this.convDialogTitle = i18n.t("create_scenario");
            this.conversationDialogError = i18n.t(
              `dialog_cards_error.${response.data.message}`
            );
            this.convDialogIcon = "mdi-text-box-outline";
          }
        } else {
          this.buttonStatus();
        }
      });
    },
    buttonStatus() {
      let oneCard = this.oneCard;
      if (oneCard.number_status == 0) {
        oneCard.colorIcon = "green";
        oneCard.stateIcon = "mdi-play";
        oneCard.buttonState = "start";
        this.iconCard = "mdi-play";
        this.statusCard = "start";
      }
      if (oneCard.number_status == 1) {
        oneCard.colorIcon = "red darken-3";
        oneCard.stateIcon = "mdi-stop";
        oneCard.buttonState = "stop";
        this.iconCard = "mdi-stop";
        this.statusCard = "stop";
      }
    },
  },
  created(){
    this.whatsappChatbot = "whats-chat"
  },
  async mounted() {
    bus.$on("stopScenarioTimer", () => {
      if (this.time) {
        clearInterval(this.time);
      }
    });
    this.getThisCard();
    this.buttonStatus();
    (this.baseStorageName =
      "_base_chain_" + this.$route.params.id + "_" + this.$route.params.new),
      (this.storageName =
        "_chain_" + this.$route.params.id + "_" + this.$route.params.new),
      (this.deletedStorageName =
        "_deleted_urls_" +
        this.$route.params.id +
        "_" +
        this.$route.params.new),
      (this.deleteStorageName =
        "_deleted_ids_" + this.$route.params.id + "_" + this.$route.params.new);

    this.setTime();
    this.bg = "conversation-container";
    bus.$on("arabicLang", () => {
      this.align = "text-left";
    });
    bus.$on("englishLang", () => {
      this.align = "text-right";
    });

    if (this.$vuetify.rtl || localStorage.getItem("local_lang") == "ar") {
      this.align = "text-left";
    } else {
      this.align = "text-right";
    }
  },
  beforeDestroy() {
    this.stopTimer();
  },
  async beforeMount() {
    await this.wait(1000);
    let loadChain =
      "_chain_" + this.$route.params.id + "_" + this.$route.params.new;
    let storageLoaded = localStorage.getItem(loadChain);
    if (storageLoaded) {
      this.overlay = false;
      this.baseChain = loadFromLocalStorage(this.baseStorageName);
      this.chain = loadFromLocalStorage(this.storageName);
      Vue.prototype.$tree = loadFromLocalStorage(this.storageName);
      this.deletedUrls = loadFromLocalStorage(this.deletedStorageName);
      this.deleteIds = loadFromLocalStorage(this.deleteStorageName);
      this.timerWrittenChain = deepClone(this.chain);
    } else if (!storageLoaded && this.$route.params.new === "new") {
      let newChain = new Chain();
      this.baseChain = newChain;
      this.chain = newChain;
      Vue.prototype.$tree = newChain;
      this.deletedUrls = [];
       this.deletedChainUrls = []
      this.deleteIds = [];
      this.timerWrittenChain = deepClone(newChain);
      this.overlay = false;
    } else {
      this.getOneScenario();
      this.overlay = false;
    }
  },
  beforeRouteLeave() {
    localStorage.removeItem("existing_title");
    this.stopTimer();
  },
  updated() {
    // bus.$emit("newChain", this.chain)
    this.buttonStatus();
  },
  beforeRouteEnter() {
    if (localStorage.getItem("session_id") == null) {
      this.$router.push("/login");
    }
  },
  mixins: [chainHttpHandler],
};
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@600&display=swap");
.whats-chat {
  background-image: url("../../assets/whatsapp_chat.png");
}

.option-node {
  display: inline-block;
  margin: 0.5rem;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  position: relative;
}
.conversation-container {
  // background-image: url("../../assets/whatsapp_chat.png");
  // background-size: cover !important;
  background-repeat: repeat;
  position: relative;
  border: 10px solid #6b6a6a;
  border-radius: 10px;
  font-family: "Cairo" !important;
  font-size: 0.9125rem;
  .search {
    background: #00bfa5;
    padding: 0 0 12px 0;
  }
  .conv-buuton {
    font-family: "Cairo" !important;
  }
  .chain-node {
    overflow: scroll;
    overflow-x: hidden;
    height: 400px;
    margin: 0 0 15px 0;
  }
}
.v-item-group.v-bottom-navigation {
  box-shadow: none !important;
}
.comfortable-view {
  display: block;
}
.compact-view {
  display: inline-block;
}
.slide-enter-active {
  transition: all 0.4s ease !important;
}
.slide-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1) !important;
}
.slide-enter, .slide-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(10px) !important;
  opacity: 0 !important;
}
.menu-search {
  box-shadow: none !important;
}
.search-input {
  color: #fff !important;
  .v-input__control {
    .v-input__slot {
      &::before {
        border-color: #fff !important;
      }
      .v-text-field__slot {
        input {
          color: #fff;
          &::placeholder {
            color: #fff;
          }
        }
      }
    }
  }
}
.v-list-item--link:before {
  width: 100% !important;
}
.theme--light.table-conversation
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: #00bfa5 !important;
}
.table-conversation {
  background: #00bfa5 !important;
  max-height: 100%;
  width: 100%;
}
.v-data-table__wrapper {
  overflow: hidden !important;
}
.overlay-english {
  padding: 0 30px 0 270px !important;
}
.overlay-arabic {
  padding: 0 270px 0 30px !important;
}
.qr-session-error {
  word-break: normal;
  text-align: justify;
  font-size: 1rem !important;
  font-weight: 400 !important;
}
.conv-toolbar {
  .v-toolbar__content {
    padding: 0 8px;
  }
}
.conv-avatar {
  height: 36px !important;
  min-width: 36px !important;
  width: 36px !important;
  border-radius: 0 !important;
}
</style>
