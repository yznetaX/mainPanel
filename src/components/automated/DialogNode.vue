<template>
  <div :class="view">
    <div
      class="dialog-container option-node"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <label  class="black--text dialog-label d-inline-block" @click="handelEdit"
        >{{ indexNum + "-" }} {{ translate }}</label
      >
      <v-icon @click="handelDelete" small class="ms-1">
        mdi-close-box
      </v-icon>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import i18n from "../../plugins/i18n";
import { bus } from "../../main";
import DialogModal from "./DialogModal"
export default {
  name: "dialog-node",
  props: {
    value: {
      type: String,
      default: "",
    },
    indexNumber: {
      type: Number,
    },
    option: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      hover: false,
      view: this.$store.state.typeView,
      options: this.$store.state.options,
      optionSelected: this.option
    };
  },
  computed: {
    indexNum() {
      let incressIndexNumber = this.indexNumber;
      return (incressIndexNumber += 1);
    },
    translate(){
      return i18n.t(`dialog_types.${this.value}`)
    }
  },
  methods: {
    handelDelete() {
      this.$emit("delete");
    },
    handelEdit() {
      this.$emit("edit");
    },
  },
  watch: {

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
  },
};
</script>

<style lang="scss">
$dialog-color-b: #eaeaea;
$dialog-color-f: #eaeaea;
.dialog-container {
  border: 1px solid $dialog-color-b;
  background-color: $dialog-color-b;
  color: $dialog-color-f;
  box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
  div {
    display: inline-block;
    position: absolute;
    text-align: center;
  }
}
.dialog-label {
  cursor: pointer;
  display: block;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .4s !important;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0 !important;
}
</style>
