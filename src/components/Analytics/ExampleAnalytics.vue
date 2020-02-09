<template>
  <v-row v-blur="hoverAnalytics">
    <v-col cols="12">
      <v-alert
        text
        color="primary"
      >This example is not a true representation of your data, this feature is still being coded</v-alert>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-responsive style="max-height: 300px" :aspect-ratio="16/9">
          <apexchart
            style="width: 100%; height: 100%;top: 0px; left: 0px"
            type="line"
            height="100%"
            :options="optionsSmall"
            :series="seriesLine"
          ></apexchart>
        </v-responsive>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-responsive style="max-height: 300px" :aspect-ratio="16/9">
          <apexchart
            style="width: 100%; height: 100%;top: 0px; left: 0px"
            type="area"
            height="100%"
            :options="optionsSmall"
            :series="seriesArea"
          ></apexchart>
        </v-responsive>
      </v-card>
    </v-col>
    <v-col cols="6" md="3">
      <v-card>
        <v-responsive :aspect-ratio="1">
          <apexchart
            style="width: 100%; height: 100%;top: 0px; left: 0px"
            type="heatmap"
            height="100%"
            :options="optionsSmall"
            :series="seriesHeat"
          ></apexchart>
        </v-responsive>
      </v-card>
    </v-col>
    <v-col cols="6" md="3">
      <v-card>
        <v-responsive :aspect-ratio="1">
          <apexchart
            style="width: 100%; height: 100%;top: 0px; left: 0px"
            type="pie"
            height="100%"
            :options="optionsSmall"
            :series="seriesPie"
          ></apexchart>
        </v-responsive>
      </v-card>
    </v-col>
    <v-col cols="6" md="3">
      <v-card>
        <v-responsive :aspect-ratio="1">
          <apexchart
            style="width: 100%; height: 100%;top: 0px; left: 0px"
            type="radar"
            height="100%"
            :options="optionsSmall"
            :series="seriesRadar"
          ></apexchart>
        </v-responsive>
      </v-card>
    </v-col>
    <v-col cols="6" md="3">
      <v-card>
        <v-responsive :aspect-ratio="1">
          <apexchart
            style="width: 100%; height: 100%;top: 0px; left: 0px"
            type="rangeBar"
            height="100%"
            :options="optionsSmall"
            :series="seriesRange"
          ></apexchart>
        </v-responsive>
      </v-card>
    </v-col>
  </v-row>
</template>


<script>
// @ is an alias to /src
import VueApexCharts from "vue-apexcharts";
export default {
  components: {
    apexchart: VueApexCharts
  },
  methods: {
    getRandomInt: function(max) {
      return Math.floor(Math.random() * Math.floor(max));
    },
    getBasicRandom: function() {
      var final = [];
      for (let index = 0; index < 5; index++) {
        final.push(this.getRandomInt(100));
      }
      return final;
    },
    getRangeRandom: function() {
      var final = [];
      for (let index = 0; index < 4; index++) {
        var data = [];
        var from = this.getRandomInt(100);
        var to = from + this.getRandomInt(100);
        data.push(from);
        data.push(to);
        final.push({ x: index, y: data });
      }
      return final;
    },
    getHeatRandom: function() {
      var final = [];
      for (let index = 0; index < 4; index++) {
        var subseries = { name: index, data: [] };
        for (let index = 0; index < 4; index++) {
          subseries.data.push({ x: index, y: this.getRandomInt(100) });
        }
        final.push(subseries);
      }
      return final;
    },
    getPercentRandom: function() {
      var final = [];
      var available = 100;
      while (available > 20) {
        var result = this.getRandomInt(available);
        available = available - result;
        final.push(result);
      }
      if (available <= 20) {
        available = 0;
        final.push(available);
      }
      return final;
    },
    updateCharts: function() {
      this.seriesLine = [
        {
          data: this.getBasicRandom()
        }
      ];
      this.seriesArea = [
        {
          data: this.getBasicRandom()
        }
      ];
      this.seriesPie = this.getPercentRandom();
      this.seriesHeat = this.getHeatRandom();
      this.seriesRadar = this.getHeatRandom();
      this.seriesRange = [
        {
          data: this.getRangeRandom()
        }
      ];
    }
  },
  mounted() {
    this.updateCharts();
    setInterval(() => {
      if (this.$vuetify.breakpoint.mdAndUp) {
        this.updateCharts();
      }
    }, 2000);
  },
  data() {
    return {
      hoverAnalytics: false,
      optionsSmall: {
        colors: ["#448aff"],
        chart: {
          animations: {
            enabled: true,
            easing: "easeout",
            speed: 500
          },
          toolbar: {
            show: false
          },
          sparkline: {
            enabled: true
          }
        },
        tooltip: {
          enabled: false
        }
      },
      seriesLine: [],
      seriesArea: [],
      seriesHeat: [],
      seriesPie: [],
      seriesRange: [],
      seriesRadar: []
    };
  }
};
</script>