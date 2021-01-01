    <template>
  <v-card outlined>
    <div
      :style="`${
        $vuetify.breakpoint.smAndUp ? 'min-height: 350px' : 'min-height:250px'
      }; ${
        $vuetify.theme.dark
          ? 'background-color: rgba(0, 0, 0, 0.3)'
          : 'background-color: rgba(0, 0, 0, 0.02)'
      }; position:relative`"
    >
      <div
        style="
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0px;
          left: 0px;
        "
      >
        <!-- todo -->
      </div>
      <v-fade-transition>
        <div v-show="enoughData">
          <apexchart
            type="line"
            v-if="enoughData"
            :height="this.$vuetify.breakpoint.smAndUp ? '350' : '250'"
            :options="this.chartOptions"
            :series="currentSeries[selectedBase][computedDatapoint]"
          ></apexchart>
        </div>
      </v-fade-transition>
      <v-fade-transition>
        <div
          style="
            height: 100%;
            width: 100%;
            position: absolute;
            top: 0px;
            left: 0px;
          "
          v-show="!enoughData && !loading"
        >
          <v-container fill-height fluid>
            <v-row align="center" justify="center">
              <v-col>
                <center>
                  <h3 class="grey--text">Not Enough Data</h3>
                </center>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-fade-transition>
      <div
        style="
          position: absolute;
          top: 0px;
          left: 0px;
          margin-left: 20px;
          margin-top: 20px;
        "
      >
        <v-select
          style="display: inline-block; width: 150px"
          hide-details
          v-model="selected"
          :items="items"
          outlined
          label="Period"
        />
        <v-btn-toggle
          class="ml-4 hoverOpacity"
          dense
          v-model="selectedDatapoint"
          mandatory
          group
        >
          <v-btn style="border-radius: 20px"> Revenue </v-btn>

          <v-btn style="border-radius: 20px"> Customers </v-btn>

          <v-btn style="border-radius: 20px"> Requests </v-btn>
        </v-btn-toggle>
      </div>
    </div>
    <v-divider v-if="enoughData || loading" />
    <div v-if="enoughData || loading" class="pl-5 pr-5 pt-2 pb-2">
      <v-row v-if="loading">
        <v-col v-for="i in 3" :key="i" cols="12" sm="4">
          <v-skeleton-loader
            class="mx-auto mb-5 mt-5"
            type="heading"
          ></v-skeleton-loader>
          <v-skeleton-loader class="mx-auto" type="text"></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row v-if="!loading && enoughData">
        <v-col cols="12" sm="4">
          <v-card style="height: 100%" class="pa-4" outlined>
            <span class="display-2 font-weight-black">{{
              Math.trunc(
                currentSeries[selectedBase].data.getTotal("totalGross") * 100,
                2
              ) / 100
            }}</span>
            <strong>EUR</strong>
            <p class="caption text-uppercase mb-0">Gross</p>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card style="height: 100%" class="pa-4" outlined>
            <span class="display-2 font-weight-black">{{
              Math.trunc(
                currentSeries[selectedBase].data.getTotal("totalNet") * 100,
                2
              ) / 100
            }}</span>
            <strong>EUR</strong>
            <p class="caption text-uppercase mb-0">Net</p>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card style="height: 100%" class="pa-4" outlined>
            <span class="display-2 font-weight-black">{{
              Math.trunc(
                currentSeries[selectedBase].data.getTotal("totalTaxes") * 100,
                2
              ) / 100
            }}</span>
            <strong>EUR</strong>
            <p class="caption text-uppercase mb-0">Collected Taxes</p>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>
<script>
export default {
  data: () => {
    return {
      revenue: null,
      loading: false,
      enoughData: false,
      currentSeries: {},
      previousSeries: {
        revenue: [],
      },
      selectedBase: null,
      selectedPeriod: 0,
      items: ["December"],
      selected: "December",
      selectedDatapoint: 0,
      computedDatapoint: "revenue",
      chartOptions: null,
    };
  },
  watch: {
    selectedDatapoint(datapoint) {
      switch (datapoint) {
        case 0:
          this.computedDatapoint = "revenue";
          break;
        case 1:
          this.computedDatapoint = "customers";
          break;
        case 2:
          this.computedDatapoint = "requests";
          break;
      }
    },
  },
  mounted() {
    this.chartOptions = this.$chartOptions;
    this.load();
  },
  methods: {
    load() {
      let main = this;

      main.loading = true;
      main.currentSeries = {};
      main.selectedBase = null;

      this.$purecore
        .getContext()
        .getNetwork()
        .getMonthRevenue()
        .then((revenue) => {
          revenue.fill();
          if (revenue.analytics.length > 0) {
            this.chartOptions.xaxis.max = revenue.analytics[0].ending.getTime();
            main.selectedBase = revenue.analytics[0].base;
            for (let i = 0; i < revenue.analytics.length; i++) {
              const analytics = revenue.analytics[i];
              main.currentSeries[analytics.base] = {
                revenue: analytics.asApexSeries([
                  "totalNet",
                  "totalGross",
                  "totalTaxes",
                  "totalRefunded",
                ]),
                customers: analytics.asApexSeries(["distinctCustomers"]),
                requests: analytics.asApexSeries([
                  "totalRequests",
                  "totalPayments",
                ]),
                data: analytics,
              };
            }
            main.enoughData = true;
          } else {
            main.enoughData = false;
          }
        })
        .catch(() => {
          main.enoughData = false;
        })
        .finally(() => {
          main.loading = false;
        });
    },
  },
};
</script>