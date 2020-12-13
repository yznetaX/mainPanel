<template>
    <LoginComponent v-if="showContent" />
</template>

<script>
import LoginComponent from "../components/LoginComponent";
import checklogin from '../mixins/httpHandler'
export default {
  name: "Login",
  components: {
    LoginComponent,
  },
  data() {
    return {
      showContent: false
    }
  },
  created() {
    this.post({router: 'session_status'},false).then((res) => {
      if (res.data.session) {
        this.$router.push('/cards')
        this.showContent = false
      } else {
        this.showContent  = true
      }
    })
  },
  mixins: [checklogin]
};
</script>
