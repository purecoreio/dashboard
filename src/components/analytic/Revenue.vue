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
        <v-row align="center" no-gutters>
          <v-col class="flex-grow-0 flex-shrink-1">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  hide-details
                  v-model="date"
                  label="Period"
                  prepend-inner-icon="event"
                  readonly
                  outlined
                  style="min-width: 150px; display: inline-block"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="picker"
                v-model="date"
                type="month"
                :max="new Date().toISOString().substr(0, 10)"
                @change="save"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="flex-grow-1 flex-shrink-0">
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
          </v-col>
        </v-row>
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
      date: null,
      menu: false,
      selectedDatapoint: 0,
      computedDatapoint: "revenue",
      chartOptions: null,
    };
  },
  watch: {
    date() {
      this.load();
    },
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
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
    this.date = new Date().toISOString().substr(0, 7);
    //this.load();
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },
    load() {
      let main = this;

      main.loading = true;
      this.enoughData = false;
      main.currentSeries = {};
      main.selectedBase = null;

      let month = Number(this.date.split("-")[1]) - 1;
      let year = this.date.split("-")[0];

      this.$purecore
        .getContext()
        .getNetwork()
        .getMonthRevenue(month, year)
        .then((revenue) => {
          revenue = revenue.fill();
          if (revenue.analytics.length > 0) {
            this.chartOptions.xaxis.max = revenue.analytics[0].ending.getTime();
            this.chartOptions.xaxis.min = revenue.analytics[0].beginning.getTime();
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
        .catch((e) => {
          alert(e.message);
          main.enoughData = false;
        })
        .finally(() => {
          main.loading = false;
        });
    },
  },
};
</script>