<template>
  <v-dialog
    v-model="show"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-toolbar color="secondary" dark dense height="34" flat>
        <v-toolbar-title class="white--text subtitle-1">{{
          $t("warning")
        }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-4">{{ $t("warning_description") }}</v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn @click.native="agree" color="#81217d" dark small>{{
          $t("cancel")
        }}</v-btn>
        <v-btn
          @click.native="cancel"
          color="secondary"
          small
          >{{ $t("stay_here") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/**
 * Vuetify Confirm Dialog component
 *
 * Insert component where you want to use it:
 * <confirm ref="confirm"></confirm>
 *
 * Call it:
 * this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' }).then((confirm) => {})
 * Or use await:
 * if (await this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' })) {
 *   // yes
 * }
 * else {
 *   // cancel
 * }
 *
 * Alternatively you can place it in main App component and access it globally via this.$root.$confirm
 * <template>
 *   <v-app>
 *     ...
 *     <confirm ref="confirm"></confirm>
 *   </v-app>
 * </template>
 *
 * mounted() {
 *   this.$root.$confirm = this.$refs.confirm.open
 * }
 */
import i18n from "../plugins/i18n";
export default {
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    message: null,
    title: null,
    options: {
      color: "secondary",
      width: 400,
      zIndex: 200,
    },
    confirmLoading: false,
  }),
  computed: {
    show: {
      get() {
        return this.dialog;
      },
      set(value) {
        this.dialog = value;
        if (value === false) {
          this.cancel();
        }
      },
    },
  },
  methods: {
    open(title, message, options) {
      this.dialog = true;
      this.confirmLoading = false;
      this.title = i18n.t(title);
      this.message = message;
      this.options = Object.assign(this.options, options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      this.confirmLoading = true;
      this.resolve(true);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
  },
};
</script>
