<template>
  <div style="width: 100%;">
    <v-footer padless class="mt-6" v-if="showFooter">
      <v-card class="flex fot" flat>
        <v-card-text
          class="py-0 black--text text-center"
          style="font-size:11px"
        >
          <v-btn x-small text href="https://mujeebk.com">
            Home
          </v-btn>
          |
          <v-btn x-small text href="https://mujeebk.com/terms_of_service">
            Term of use
          </v-btn>
          |
          <v-btn x-small text href="https://mujeebk.com/privacy_policy">
            Privacy policy
          </v-btn>
        </v-card-text>
        <v-card-text class="py-0 text-center" style="font-size:11px">
          Copyright © <strong>Mujeebk.com,</strong> All Rights Reserved
        </v-card-text>
      </v-card>
    </v-footer>
  </div>
</template>
<script>
export default {
  props:{
    showFooter:{
      type: Boolean
    }
  },
}
</script>