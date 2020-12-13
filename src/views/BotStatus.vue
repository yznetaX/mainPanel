<template>
  <div class="mujeebk-ai my-auto" v-resize="onResize">
    <vue-topprogress
      ref="topProgress"
      :color="'#81217d'"
      :height="3"
    ></vue-topprogress>
    <overlay :overlay="overlay" />
    <v-alert border="left" colored-border type="info" elevation="2" v-if="smallScreen">
        {{$t('best_ux_report')}}
      </v-alert>
      <v-card-title
          class="py-1 secondary--text px-2 mujeebk-title"
        >
        <Backword v-if="showBackword" />
        {{$t('bot_status')}}
        </v-card-title>
        <v-card-subtitle
        class="py-4 px-2 subtitle-1"
      >
      {{$t('bot_status_description')}}
      </v-card-subtitle>
    <v-card flat>
      <v-card-title class="px-2">
      <v-text-field :disabled="number_status.length == 0 ? true : false" v-model="search" :label="$t('search')" single-line hide-details append-icon="mdi-magnify"></v-text-field>
      </v-card-title>
      <v-lazy class="px-2">
    <v-simple-table fixed-header ref="bot_table" class="bot-table" v-if="number_status !== undefined">
    <template v-slot:default>
      <thead>
        <tr>
          <th>{{$t('logo')}}</th>
          <th class="text-center">{{$t('date_time')}}</th>
          <th class="text-center">{{$t('from_number')}}</th>
          <th class="text-center">{{$t('from_name')}}</th>
          <th class="text-center">{{$t('reason')}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in filterStatus" :key="index">
          <td>  
        <botStatusAvatar
          :color_avatar="'grey'"
          :phone_number="item.from_number"
          :number_id="$route.params.id"
          :show_online_dot="false"
          :is_online_info="0"
          :avatarClass="'bot-status-avatar'"
          />
          </td>
          <td class="text-center">{{ item.datetime }}</td>
          <td class="text-center">{{ item.from_number }}</td>
          <td class="text-center">{{ item.name ? item.name : $t('no_name') }}</td>
          <td class="text-center">{{ $t(item.reason) }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
      </v-lazy>
      <v-card flat>
        <v-card-title v-if="number_status.length == 0" class="d-block text-center">
          {{$t('no_record_found_card')}}
        </v-card-title>
      </v-card>
    </v-card>
  </div>
</template>
<script>
import botStatus from '../mixins/httpHandler'
import i18n from '../plugins/i18n'
import botStatusAvatar from '../components/automated/Avatar'
import overlay from '../components/cirlceOverlay'
import Backword from '../components/Backword'
// import { bus } from '../main'
export default {
  components:{
    botStatusAvatar,
    overlay,
    Backword
  },
  data() {
    return {
      smallScreen: false,
      number_status: [],
      headers: [
        {
          text: 'date_time', value: "datetime"
        },
        {
          text: 'from_number', value: "from_number"
        },
        {
          text: "from_name", value: "name"
        },
        {
          text: "reason", value: "reason"
        },
      ],
      search: "",
      overlay: true,
      showBackword: ""
    }
  },
  methods: {
    onResize(){
      if (window.innerWidth >= 1250) {
        this.showBackword = true
      }
      if (window.innerWidth < 1250) {
        this.showBackword = false
      }
      if (window.innerWidth <= 600) {
        this.smallScreen = true
      }else {
        this.smallScreen = false
      }
    },
    getBotStatus(){
      let botStatusData ={
        router : 'get_number_status',
        number_id: this.$route.params.id
      }
      this.post(botStatusData,false).then((response) => {
        if (response.data.session && response.data.success) {
          console.log(response);
          this.number_status = response.data.number_status
          this.overlay= false
        }else {
          this.$router.push('/login')
        }
      })
    }
  },
  computed: {
    headersTranslate(){
      return this.headers.map((item) => {
        let itemTransalted ={
          text : i18n.t(item.text),
          value: item.value
        }
        return itemTransalted
      })
    },
    filterStatus(){
      return this.number_status.filter((number) => {
        return number.from_number.match(this.search)
      })
    }
  },
  mounted() {
    this.getBotStatus()
  },
  updated() {
  },
  mixins:[botStatus]
}
</script>
<style lang="scss">
.bot-status-avatar{
  height: 36px !important;
  min-width: 36px !important;
  width: 36px !important;
  border-radius: 50% !important;
}
.botStatus{
  .v-data-table__wrapper{
    overflow-y: auto !important;
  }
}
.theme--light.bot-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper){
background: #e3e3ed !important;
transition: all .2s ease-in-out;
}
.bot-table > .v-data-table__wrapper{
  overflow-x: auto !important;
}
</style>
