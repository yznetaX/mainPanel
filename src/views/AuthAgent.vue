<template>
  <div class="auth-agent">
    <cirlceOverlay :overlay="overlay" />
    <v-card-title
          class="py-1 secondary--text mujeebk-title"
        >
        {{$t('auth_agent')}}
        </v-card-title>
    <v-lazy v-if="!noAgent">
    <v-simple-table fixed-header ref="bot_table" class="bot-table">
    <template v-slot:default>
      <thead>
        <tr>
          <th>{{$t('logo')}}</th>
          <th class="text-center">{{$t('agent_name_auth')}}</th>
          <th class="text-center">{{$t('from_number')}}</th>
          <th class="text-center">{{$t('agetn_adress')}}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>  
        <!-- <botStatusAvatar
          :color_avatar="'grey'"
          :phone_number="item.from_number"
          :number_id="$route.params.id"
          :show_online_dot="false"
          :is_online_info="0"
          :avatarClass="'bot-status-avatar'"
          /> -->
          </td>
          <td class="text-center">{{  }}</td>
          <td class="text-center">{{  }}</td>
          <td class="text-center">{{  }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
      </v-lazy>
      <v-card v-if="noAgent" flat class="mx-auto d-block">
        <v-img
          src="../assets/empty.png"
          max-width="350"
          class="mx-auto"
        ></v-img>
        <v-row justify="center">
          <v-subheader class="text-h6"
            >{{ $t(errorMessage) }} 📃</v-subheader
          >
        </v-row>
      </v-card>
  </div>
</template>
<script>
/*eslint-disable*/
import auth from '../mixins/httpHandler'
import cirlceOverlay from '../components/cirlceOverlay'
export default {
  components:{
    cirlceOverlay
  },
  data() {
    return {
      noAgent: false,
      errorMessage: "",
      agent: [],
      overlay: true
    }
  },
  methods: {
    getAgentList(){
      this.post({router: "agents_list"}, false).then((response) => {
        console.log(response);
        if (!response.data.success) {
          if (response.data.message) {
            this.errorMessage = response.data.message
            this.noAgent = true
            this.overlay = false
          }
        }else {
          this.agent = response.data.agents
          this.overlay = false
        }
      })
    }
  },
  mounted() {
    this.getAgentList()
  },
  mixins:[auth]
}
</script>
<style scoped>

</style>