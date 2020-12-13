<template>
  <v-dialog
    v-model="show"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-toolbar :color="options.color" dark dense height="34" flat>
        <v-toolbar-title class="white--text subtitle-1">{{
          toolbarTitle
        }}</v-toolbar-title>
      </v-toolbar>
      <v-card-actions>
        <v-form
          ref="form"
          v-model="valid"
          style="width: 100%;"
          onSubmit="return false;"
        >
          <v-text-field
            v-model="title"
            required
            outlined
            :label="$t('name')"
            dense
            color="secondary"
            :rules="nameRules"
            @keyup="shareTitle"
            @keyup.enter.prevent="agree"
          ></v-text-field>
        </v-form>
      </v-card-actions>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn
          @click.native="agree"
          color="secondary"
          small
          :loading="confirmLoading"
          >{{ $t("yes") }}</v-btn
        >
        <v-btn @click.native="cancel" color="warning" small>{{
          $t("close")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import i18n from "../plugins/i18n";
import { bus } from '../main';
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
// import i18n from "../plugins/i18n";
export default {
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    message: null,
    title: null,
    toolbarTitle: null,
    options: {
      color: "secondary",
      width: 400,
      zIndex: 200,
    },
    confirmLoading: false,
    nameRules: [(v) => !!v || i18n.tc("name_required")],
    valid: true,
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
  mounted() {
  },
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    open(title, toolbarTitle, options) {
      this.valid =true
      this.dialog = true;
      this.confirmLoading = false;
      this.title = title;
      this.toolbarTitle = i18n.t(toolbarTitle);
      this.options = Object.assign(this.options, options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree(e) {
      if (this.$refs.form.validate()) {
        e.preventDefault();
        this.confirmLoading = true;
        this.resolve(true);
        this.dialog = false;
      } 
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
    shareTitle(){
      bus.$emit('shareTitle' ,this.title)
    },
  },
};
</script>
