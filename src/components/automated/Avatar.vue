<template>
  <v-avatar :class="avatarClass">
    <v-progress-circular
      indeterminate
      :color="color_avatar"
      v-if="isloaded"
      size="20"
    ></v-progress-circular>

    <img v-if="avatarImageLoaded" :src="avatarImage"  />
  </v-avatar>
</template>
<script>
/*eslint-disable*/
import avatarHandler from "../../mixins/httpHandler";
import { bus } from "../../main";
// import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      isloaded: true,
      avatarImageLoaded: false,
      is_online: {},
      avatarImage: "",
    };
  },
  props: {
    phone_number: {
      type: String,
    },
    number_id: {
      type: String,
    },
    color_avatar: {
      type: String,
    },
    avatarClass: {
      type: String,
    },
    is_online_info: {
      type: Number,
    },
    show_online_dot: {
      type: Boolean,
    },
    get_online_status: {
      type: Function,
    },
  },
  computed: {
  },
  methods: {
    async getProfileImg() {
      var phone = this.phone_number;
      let st = "web zero"
      st.includes("web")
      if (this.$store.state.avatars[phone] == undefined || this.$store.state.avatars[phone].number_id != this.number_id) {
        console.log("if");
        let imageData = {
          router: "get_profile_img",
          number_id: this.$route.params.id || this.number_id,
          phone_number: phone,
          session_id: localStorage.getItem("session_id"),
        };
        if (phone) {
          
          await this.post(imageData, false).then((response) => {
            console.log(response);
            if (this.$refs.avatarRefBadge != undefined) {
              let avatarBadge = this.$refs.avatarRefBadge.$el.children[1]
                .firstChild;
              avatarBadge.classList.add("avatar-badge");
            }
            this.avatarImage = response.data.profile_photo;
            let img = response.data.profile_photo;
            this.$store.state.avatars[phone] = {
              img: img,
              number_id: this.$route.params.id || this.number_id
            };
            this.isloaded = false;
            this.avatarImageLoaded = true;
          });
        }
      } else {
        this.avatarImage = this.$store.state.avatars[phone].img;
          this.isloaded = false;
          this.avatarImageLoaded = true;
          if (Object.keys(this.$store.state.avatars).length >= 200) {
            this.$store.state.avatars = {}
          }
        if (this.$refs.avatarRefBadge != undefined) {
          let avatarBadge = this.$refs.avatarRefBadge.$el.children[1]
            .firstChild;
          avatarBadge.classList.add("avatar-badge");
        }
      }
    },
  },
  mounted() {
    this.getProfileImg();
    bus.$on("shareRefresh", () => {
      this.getProfileImg();
    });
    // console.log(this.isEmpty);   
  },
  updated() {
    if (this.$refs.avatarRefBadge != undefined) {
      let avatarBadge = this.$refs.avatarRefBadge.$el.children[1].firstChild;
      avatarBadge.classList.add("avatar-badge");
    }
  },
  mixins: [avatarHandler],
  beforeMount() {
    this.$store.state.isOnlineArray = {};
  },
};
</script>
<style>
.avatar-badge {
  border-radius: 9.5px !important;
  height: 13px !important;
  min-width: 0 !important;
  padding: 0 !important;
  width: 13px !important;
}
.avatar-badge::after {
  border-width: 2.5px !important;
}
</style>
