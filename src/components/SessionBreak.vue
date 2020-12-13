<template>
  <div>
          <v-card-title
        class="headline secondary--text font-weight-medium add-remote-title pt-2"
        style="font-family: Cairo !important;word-break:normal"
      >
        {{ $t("session_expired") }}
      </v-card-title>
    <v-card  class="ma-auto" flat>
            <v-card-subtitle class="subtitle-1" style="font-family: Cairo !important;text-align: justify">
        {{ $t("dialog_cards_error.qr_session_expired") }}
      </v-card-subtitle>
      <v-card-actions class="d-block text-center">
        <v-btn color="secondary" class="px-2 session-break" rounded to="/mujeebk_web">
          <v-icon class="me-1">
            mdi-qrcode
          </v-icon>
          <span>{{ $t("rescane") }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<style lang="scss">
.session-break{
  .v-btn__content{
    padding: 10px !important;
  }
}
</style>
