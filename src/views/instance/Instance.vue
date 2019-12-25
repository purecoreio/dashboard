<template>
  <div>
    <v-card class="mx-auto" outlined>
      <v-row>
        <v-col cols="12" lg="6">asd</v-col>
        <v-col cols="12" lg="6">
          <apexchart
            type="area"
            group="machine"
            height="200"
            :options="chartOptions"
            :series="series"
          />
          <apexchart
            type="area"
            group="machine"
            height="200"
            :options="chartOptions"
            :series="series1"
          />
          <apexchart
            type="area"
            group="machine"
            height="200"
            :options="chartOptions"
            :series="series2"
          />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>


<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "InstanceView",
  components: {
    apexchart: VueApexCharts
  },
  data: () => ({
    chartOptions: {
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: false,
        curve: "smooth"
      },
      colors: ["#ff8a65"],
      fill: {
        type: "gradient",
        gradient: {
          type: "vertical",
          opacityFrom: 1,
          opacityTo: 0.3,
          stops: [0, 100],
          colorStops: []
        }
      },
      xaxis: {
        labels: {
          show: false
        },
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        },
        crosshairs: {
          show: false
        }
      },
      legend: {
        show: true
      },
      grid: {
        show: false
      }
    },
    series: [
      {
        name: "CPU Usage",
        data: [100, 0, 20]
      }
    ],
    series1: [
      {
        name: "TPS",
        data: [20, 20, 18]
      }
    ],
    series2: [
      {
        name: "RAM",
        data: [16, 14, 15]
      }
    ]
  })
};
</script>
