<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-row>
      <v-col cols="12" md="4" class="pb-0" v-for="(number,i) in numbers" :key="i">
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
              <span v-if="number.name=='Revenue'">€</span>
            </h1>
            <p>{{number.name}}</p>
          </center>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="mt-4 mb-4" style="overflow:hidden" outlined height="400px">
      <apexchart height="400" type="line" :options="optionsSmall" :series="seriesIncome" />
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
    AnimatedNumber
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
    }
  },
  mounted() {
    var purecore = new core(JSON.parse(localStorage.getItem("session")));
    var network = purecore
      .getInstance(localStorage.getItem("network"))
      .asNetwork();
    let main = this;

    network
      .getStore()
      .getIncomeAnalytics(3600 * 24)
      .then(function(data) {
        main.seriesIncome = purecore
          .getWorkbench()
          .toApexSeries(purecore.getWorkbench().arrayToLegacy(data), false);

        var potential = 0;
        var income = 0;
        var payments = 0;

        data.forEach(element => {
          potential += element.paymentRequests;
          income += element.finalIncome;
          payments += element.payments;
        });

        main.numbers[0].value = income;
        main.numbers[1].value = payments;
        main.numbers[2].value = potential;

        /*
        main.numbers[0].percent =
          data[data.length - 1].inactivePlayersRelative * 100;

        main.numbers[1].value = data[data.length - 1].activePlayers;
        main.numbers[1].percent =
          data[data.length - 1].activePlayersRelative * 100;

        main.numbers[2].value = data[data.length - 1].newPlayers;
        main.numbers[2].percent =
          data[data.length - 1].newPlayersRelative * 100;*/
      });
  },
  data: () => ({
    location: [
      {
        text: "Analytics",
        disabled: true,
        href: ""
      },
      {
        text: "Revenue",
        disabled: false,
        href: "#"
      }
    ],
    numbers: [
      {
        value: 0,
        name: "Revenue"
      },
      {
        value: 0,
        name: "Payments"
      },
      {
        value: 0,
        name: "Potential Payments"
      }
    ],
    optionsSmall: {
      tooltip: {
        enabled: true,
        followCursor: false,
        fillSeriesColor: true,
        theme: false,
        style: {
          fontSize: "12px"
        },
        x: {
          show: true,
          format: "dd MMM"
        }
      },
      chart: {
        id: "1",
        group: "data",
        sparkline: {
          enabled: true
        }
      },
      stroke: {
        curve: "straight"
      },
      fill: {
        opacity: 1
      },
      yaxis: {
        tickAmount: 6,
        min: 0,
        labels: {
          minWidth: 40
        }
      }
    },
    seriesIncome: []
  })
};
</script>
