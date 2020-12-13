<template>
    <v-app-bar color="white" elevation="0" height="62" class="outerToolbar">
      <v-toolbar-title class="mx-auto pa-0 mt-8">
        <img src="../assets/mujeebk_final.svg" class="mujeebk-logo" @click="toLogin" style="cursor:pointer"/>
      </v-toolbar-title>
    </v-app-bar>
</template>
<script>
export default {
    methods: {
        toLogin(){
            this.$router.push('/login')
        }
    }
}
</script>
<style lang="scss">
.outerToolbar{
  .v-toolbar__content{
    height: 36px !important;
  }
}
</style>