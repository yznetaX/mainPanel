<template>
  <div>
    <v-text-field
      dense
      solo
      label="Section title"
      type="text"
      v-model="sectionTitle"
      @input="handelChange($event)"
      @blur="handelFocus(true)" 
      @focus="handelFocus(true)"
    ></v-text-field>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  watch: {
    value: function(to) {
      this.sectionTitle = to;
    },
  },
  data() {
    return {
      sectionTitle: this.value
    };
  },
  methods: {
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
      this.$emit("input", this.sectionTitle);
    },
    handelFocus(isFocused) {
      this.$emit("focused", isFocused);
    },
  },
};
</script>
