<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-card outlined>
      <v-row>
        <v-col class="pr-6 pl-6">
          <v-slider
            hide-details
            thumb-label
            :disabled="queryingData"
            v-model="days"
            min="1"
            max="60"
            label="Days"
            @end="queryData()"
          ></v-slider>
        </v-col>
      </v-row>
    </v-card>
    <v-row>
      <v-col
        cols="12"
        md="4"
        class="pb-0"
        v-for="(number, i) in numbers"
        :key="i"
      >
        <v-card class="pt-4 pb-4" outlined>
          <center>
            <h1>
              <animated-number
                :value="Math.abs(number.value)"
                easing="easeOutSine"
                class="mr-2"
                :formatValue="formatToNoDecimal"
                :round="0"
                :duration="2000"
              />
              <span :style="'color:' + getColor(number.percent)">
                <span v-if="number.percent > 0">+</span>
                <span v-if="number.percent < 0">-</span>
                <span v-if="number.percent == 0">—</span>
                <animated-number
                  :value="Math.abs(number.percent)"
                  easing="easeOutSine"
                  :formatValue="formatToDecimal"
                  :round="0"
                  :duration="2000"
                />%
              </span>
            </h1>
            <p>{{ number.name }}</p>
          </center>
        </v-card>
      </v-col>
    </v-row>
    <v-card
      class="mt-4 mb-4"
      style="overflow:hidden; position:relative"
      outlined
      height="400px"
    >
      <v-fade-transition>
        <apexchart
          v-show="!queryingData"
          style="position:absolute;top:0px;left:0px;width:100%;height:400px"
          height="400"
          type="line"
          :options="optionsSmallAbsolute"
          :series="seriesGrowthAbsolute"
        />
      </v-fade-transition>
    </v-card>
    <v-card
      class="mt-4 mb-4"
      style="overflow:hidden; position:relative"
      outlined
      height="400px"
    >
      <v-fade-transition>
        <apexchart
          style="position:absolute;top:0px;left:0px;width:100%;height:400px"
          v-show="!queryingData"
          height="400"
          type="line"
          :options="optionsSmall"
          :series="seriesGrowth"
        />
      </v-fade-transition>
    </v-card>
    <v-card class="mb-4" style="overflow:hidden" outlined height="200px">
      <apexchart
        height="200"
        type="line"
        :options="optionsSmall2"
        :series="seriesVotes"
      />
    </v-card>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import core from "purecore";
import AnimatedNumber from "animated-number-vue";

export default {
  name: "AnalyticsGrowth",
  components: {
    apexchart: VueApexCharts,
    AnimatedNumber,
  },
  methods: {
    formatToDecimal(value) {
      return `${value.toFixed(2)}`;
    },
    formatToNoDecimal(value) {
      return `${value.toFixed(0)}`;
    },
    getColor(value) {
      if (value > 0) {
        return "#00e676";
      } else if (value == 0) {
        return "gray";
      } else {
        return "#F44336";
      }
    },
    queryData() {
      this.queryingData = true;
      var purecore = new core(JSON.parse(localStorage.getItem("session")));
      var network = purecore
        .getInstance(localStorage.getItem("network"))
        .asNetwork();
      let main = this;

      network
        .asInstance()
        .getGrowthAnalytics(this.days * 3600 * 24)
        .then(function(data) {
          main.queryingData = false;
          main.seriesGrowth = purecore
            .getWorkbench()
            .toApexSeries(purecore.getWorkbench().arrayToLegacy(data), true);

          main.seriesGrowthAbsolute = purecore
            .getWorkbench()
            .toApexSeries(purecore.getWorkbench().arrayToLegacy(data), false);

          main.numbers[0].value = data[data.length - 1].inactivePlayers;
          main.numbers[0].percent =
            data[data.length - 1].inactivePlayersRelative * 100;

          main.numbers[1].value = data[data.length - 1].activePlayers;
          main.numbers[1].percent =
            data[data.length - 1].activePlayersRelative * 100;

          main.numbers[2].value = data[data.length - 1].newPlayers;
          main.numbers[2].percent =
            data[data.length - 1].newPlayersRelative * 100;
        });

      network.getVotingAnalytics(this.days * 3600 * 24).then(function(data) {
        main.seriesVotes = purecore
          .getWorkbench()
          .toApexSeries(purecore.getWorkbench().arrayToLegacy(data), false);
      });
    },
  },
  mounted() {
    this.queryData();
  },
  data: () => ({
    days: 1,
    queryingData: false,
    relative: "left",
    numbers: [
      {
        value: 0,
        percent: 0,
        name: "Inactive Players",
      },
      {
        value: 0,
        percent: 0,
        name: "Returning Players",
      },
      {
        value: 0,
        percent: 0,
        name: "New Players",
      },
    ],
    inactivePercent: 0,
    activePercent: 0,
    newPercent: 0,
    location: [
      {
        text: "Analytics",
        disabled: true,
        href: "",
      },
      {
        text: "Growth",
        disabled: false,
        href: "#",
      },
    ],
    optionsSmall2: {
      tooltip: {
        enabled: true,
        followCursor: false,
        fillSeriesColor: true,
        theme: false,
        style: {
          fontSize: "12px",
        },
        x: {
          show: true,
          format: "dd MMM",
        },
      },
      chart: {
        id: "1",
        group: "data",
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        curve: "straight",
      },
      fill: {
        opacity: 1,
      },
      yaxis: {
        tickAmount: 6,
        labels: {
          minWidth: 40,
        },
      },
    },
    optionsSmall: {
      tooltip: {
        enabled: true,
        followCursor: false,
        fillSeriesColor: true,
        theme: false,
        style: {
          fontSize: "12px",
        },
        x: {
          show: true,
          format: "dd MMM",
        },
      },
      chart: {
        id: "1",
        group: "data",
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        curve: "straight",
      },
      fill: {
        opacity: 1,
      },
      yaxis: {
        tickAmount: 6,
        min: -1,
        max: 1,
        labels: {
          minWidth: 40,
        },
      },
    },
    optionsSmallAbsolute: {
      tooltip: {
        enabled: true,
        followCursor: false,
        fillSeriesColor: true,
        theme: false,
        style: {
          fontSize: "12px",
        },
        x: {
          show: true,
          format: "dd MMM",
        },
      },
      chart: {
        id: "1",
        group: "data",
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        curve: "straight",
      },
      fill: {
        opacity: 1,
      },
      yaxis: {
        tickAmount: 6,
        min: 180,
        max: 700,
        labels: {
          minWidth: 40,
        },
      },
    },
    seriesGrowth: [],
    seriesGrowthAbsolute: [],
    seriesVotes: [],
  }),
};
</script>
