<template>
  <div>
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
                <v-btn style="border-radius: 20px"> Online </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card>
    <v-card outlined class="mt-4">
      <div
        :style="`background-color: ${
          $vuetify.theme.dark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.02)'
        }; height: ${this.$vuetify.breakpoint.smAndUp ? '200px' : '150px'};`"
      >
        <v-container
          v-if="!shouldShowDay && daySelected == null"
          fill-height
          fluid
        >
          <v-row align="center" justify="center">
            <v-col>
              <center>
                <h4>Click on any data point to see a more detailed graph</h4>
              </center>
            </v-col>
          </v-row>
        </v-container>

        <v-fade-transition>
          <div v-show="shouldShowDay">
            <apexchart
              v-if="shouldShowDay && daysLoaded[daySelected] != null"
              type="line"
              :key="dayId"
              :height="this.$vuetify.breakpoint.smAndUp ? '200' : '150'"
              :options="this.daysLoaded[daySelected].chartOptions"
              :series="this.daysLoaded[daySelected].chart"
            ></apexchart>
          </div>
        </v-fade-transition>
      </div>
    </v-card>
  </div>
</template>
<script>
export default {
  props: ["instance"],
  data: () => {
    return {
      revenue: null,
      loading: false,
      enoughData: false,
      currentSeries: {
        online: [],
      },
      previousSeries: {
        online: [],
      },
      selectedBase: null,
      date: null,
      menu: false,
      selectedDatapoint: 0,
      computedDatapoint: "online",
      chartOptions: null,
      daysLoaded: {},
      daySelected: null,
      events: {
        lastEvent: null,
        lastChartContext: null,
        lastSeriesIndex: null,
        lastDataPointIndex: null,
        lastConfig: null,
      },
      shouldShowDay: false,
      dayId: 0,
    };
  },
  watch: {
    shouldShowDay(newv) {
      if (newv) {
        this.dayId++;
      }
    },
    date() {
      this.load();
    },
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
    selectedDatapoint(datapoint) {
      switch (datapoint) {
        case 0:
          this.computedDatapoint = "online";
          break;
      }
    },
  },
  mounted() {
    let main = this;
    let chartOptions = JSON.parse(JSON.stringify(this.$chartOptions));
    chartOptions.chart.events = {
      markerClick: function (
        event,
        chartContext,
        { seriesIndex, dataPointIndex, config }
      ) {
        main.events.lastEvent = event;
        main.events.lastChartContext = chartContext;
        main.events.lastSeriesIndex = seriesIndex;
        main.events.lastDataPointIndex = dataPointIndex;
        main.events.lastConfig = config;
        for (const key in main.currentSeries) {
          if (Object.hasOwnProperty.call(main.currentSeries, key)) {
            const element = main.currentSeries[key];
            main.showDay(element.data.list[dataPointIndex].getCreation());
          }
        }
      },
    };
    this.chartOptions = chartOptions;
    this.date = new Date().toISOString().substr(0, 7);
    this.load();
  },
  methods: {
    showDay(date) {
      if (date.getTime() != this.daySelected) {
        let main = this;
        let day = date.getUTCDate();
        let month = date.getUTCMonth();
        let year = date.getUTCFullYear();
        if (!(date.getTime() in this.daysLoaded)) {
          main.shouldShowDay = false;
          main.daySelected = date.getTime();
          let chartOptions = JSON.parse(JSON.stringify(this.$chartOptions));
          chartOptions.tooltip.x = {
            format: "dd/MMM HH:mm",
          };
          main.daysLoaded[date.getTime()] = {
            chart: null,
            chartOptions: null,
          };
          chartOptions.legend = {};
          this.instance.getDayOnline(day, month, year).then((dayOnline) => {
            chartOptions.xaxis.max = dayOnline.analytics[0].ending.getTime();
            chartOptions.xaxis.min = dayOnline.analytics[0].beginning.getTime();
            main.daysLoaded[date.getTime()] = {
              chart: dayOnline.analytics[0]
                .memFill()
                .asApexSeries(["maxOnline", "avgOnline", "minOnline"]),
              chartOptions: chartOptions,
            };
            main.shouldShowDay = true;
          });
        } else {
          this.shouldShowDay = false;
          this.daySelected = date.getTime();
          setTimeout(() => {
            this.shouldShowDay = true;
          }, 100);
        }
      } else {
        this.shouldShowDay = false;
        this.daySelected = null;
      }
    },
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

      this.instance
        .getMonthOnline(month, year)
        .then((online) => {
          online.memFill();
          if (online.analytics.length > 0) {
            main.chartOptions.xaxis.max = online.analytics[0].ending.getTime();
            main.selectedBase = online.analytics[0].base;
            for (let i = 0; i < online.analytics.length; i++) {
              const analytics = online.analytics[i];
              main.currentSeries[analytics.base] = {
                online: analytics.asApexSeries([
                  "maxOnline",
                  "avgOnline",
                  "minOnline",
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