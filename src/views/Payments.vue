<template>
  <div class="mujeebk-ai my-auto" v-resize="onResize">
    <Overlay :overlay="overlay" />
    <v-card flat>
      <v-card-title class="pt-1 px-0 secondary--text mujeebk-title">
        <Backword v-if="showBackword" />
        {{ $t("payments_and_bills") }}
      </v-card-title>
      
      <!-- <v-card-subtitle
        class="px-0 subtitle-1"
        v-html="$t('payments_and_bills_description')"
      ></v-card-subtitle> -->
    </v-card>
    <v-simple-table
      fixed-header
      ref="bot_table"
      class="bot-table"
      v-if="numberInvoices.length > 0"
    >
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-center">{{ $t("date_time") }}</th>
            <th class="text-center">{{ $t("description") }}</th>
            <th class="text-center">{{ $t("plan_days") }}</th>
            <th class="text-center">{{ $t("plan_type") }}</th>
            <th class="text-center">{{ $t("price") }}</th>
            <th class="text-center">{{ $t("payment_status") }}</th>
            <th class="text-center">{{ $t("transaction_id") }}</th>
            <th class="text-center">{{ $t("pdf_file") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in numberInvoices" :key="index">
            <td class="text-center">{{ item.datetime }}</td>
            <td class="text-center">{{ item.description }}</td>
            <td class="text-center">{{ item.plan_days }}</td>
            <td class="text-center">{{ $t(planType[index]) }}</td>
            <td class="text-center">{{"$" +  item.price }}</td>
            <td v-if="item.payment_status == 'completed'">
              <v-chip
                color="secondary"
                class="d-block text-center"
                style="width: 100%"
                small
                dark
              >
                {{ $t(item.payment_status) }}
              </v-chip>
            </td>
            <td v-else-if="item.payment_status == 'dispute'">
              <v-chip
                color="red darken-4"
                class="d-block text-center"
                style="width: 100%"
                small
                dark
              >
                {{ $t(item.payment_status) }}
              </v-chip>
            </td>
            <td v-else>
              <v-chip
                color="orange"
                class="d-block text-center"
                style="width: 100%"
                small
                dark
              >
                {{ $t(item.payment_status) }}
              </v-chip>
            </td>
            <td class="text-center">{{ item.transaction_id }}</td>
            <td class="text-center">
              <v-btn rounded color="secondary" small>
                <v-icon class="me-2">mdi-file-pdf</v-icon>
                {{$t('download')}}
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-card v-if="noValue" flat max-width="350" class="mx-auto">
      <v-img src="../assets/empty.png"></v-img>
      <v-row justify="center">
        <v-subheader class="text-h6">{{ $t("no_bill") }}</v-subheader>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import payemntBillsMixins from "../mixins/httpHandler";
import Overlay from "../components/cirlceOverlay";
import Backword from '../components/Backword'
export default {
  components: {
    Overlay,
    Backword
  },
  data() {
    return {
      numberInvoices: [],
      noValue: false,
      overlay: true,
      arrowWithLang: "",
      showBackword: ""
    };
  },
  computed: {
    planType() {
      // اذا بدي جيبهن عم اعمل map
      return this.numberInvoices.map((card) => {
        if (card.plan_type == 0) {
          return "plan_types.free_plan";
        }
        if (card.plan_type == 1) {
          return "plan_types.silver_plan";
        }
        if (card.plan_type == 2) {
          return "plan_types.golden_plan";
        }
        if (card.plan_type == 3) {
          return "plan_types.premium_plan";
        }
      });
    },
  },
  methods: {
    onResize(){
      if (window.innerWidth >= 1250) {
        this.showBackword = true
      }
      if (window.innerWidth < 1250) {
        this.showBackword = false
      }
    },
    getPaymentAndBills() {
      let paymentAndBillData = {
        router: "get_number_invoices",
        number_id: this.$route.params.id,
      };
      this.post(paymentAndBillData, false)
        .then((response) => {
          console.log(response);
          if (response.data.invoices.length != 0) {
            this.numberInvoices = response.data.invoices;
            this.noValue = false;
            this.overlay = false;
          } else {
            this.noValue = true;
            this.overlay = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getPaymentAndBills();

  },
  mixins: [payemntBillsMixins],
};
</script>
<style lang="scss">
.button-backword{
  width: 30px !important;
  height: 30px !important;
  border-radius: 50%;
  min-width: 30px !important;
}

</style>