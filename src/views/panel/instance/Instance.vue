<template>
  <div>
    <div style="position: absolute; width: 0px; height: 0px; overflow: hidden">
      <input
        v-for="key in instance.key.list"
        :key="key.uuid"
        type="text"
        :id="key.uuid"
        :value="key.hash"
      />
    </div>
    <v-card class="pa-5 mb-2" outlined>
      <div class="overline">INSTANCE KEYS</div>
      <div v-if="instance.key.list<1">
        <v-row align="center" justify="center">
          <v-col cols="8" md="10">
            <v-text-field loading single-line hide-details dense type="password" outlined></v-text-field>
          </v-col>
          <v-col cols="4" md="2">
            <v-btn block depressed disabled color="primary">copy</v-btn>
          </v-col>
        </v-row>
      </div>
      <v-row v-for="key in instance.key.list" :key="key.uuid" align="center" justify="center">
        <v-col cols="8" md="10">
          <v-text-field :value="key.hash" single-line hide-details dense type="password" outlined></v-text-field>
        </v-col>
        <v-col cols="4" md="2">
          <v-btn @click="textToClipboard(key.hash)" block depressed color="primary">copy</v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="pa-5 mb-2" outlined>
      <div class="overline">HOSTING</div>
      <v-row align="center" justify="center">
        <v-col cols="12" md="10">
          <p>
            You are not hosting this instance on purecore, we are fine with that,
            but hosting your instance in our servers will ensure your instance always
            run on at least a dedicated core, and, as we have a really smart system that
            detects how busy is your server, we can allocate more resources and dynamically
            improve your server over time
          </p>
        </v-col>
        <v-col cols="12" md="2">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn block depressed v-on="on" color="gray">SETUP</v-btn>
            </template>
            <span>WIP 😿</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="pa-5 mb-2" outlined>
      <div class="overline">HEALTH</div>
      <div style="position: relative">
        <div style="filter: blur(5px)">
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
        </div>
        <div style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%">
          <v-container fill-height fluid>
            <v-row align="center" justify="center">
              <v-col>
                <center>
                  <h2 class="mb-4">This feature is being worked on</h2>
                  <link
                    href="https://fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext"
                    rel="stylesheet"
                  />
                  <a class="bmc-button" target="_blank" href="https://www.buymeacoffee.com/happy">
                    <img
                      src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
                      alt="Buy me a coffee"
                    />
                    <span style="margin-left:15px;font-size:19px !important;">Buy me a coffee</span>
                  </a>
                </center>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </div>
    </v-card>
  </div>
</template>

                  <style>
.bmc-button img {
  height: 34px !important;
  width: 35px !important;
  margin-bottom: 1px !important;
  box-shadow: none !important;
  border: none !important;
  vertical-align: middle !important;
}
.bmc-button {
  padding: 7px 10px 7px 10px !important;
  line-height: 35px !important;
  height: 51px !important;
  min-width: 217px !important;
  text-decoration: none !important;
  display: inline-flex !important;
  color: #ffffff !important;
  background-color: #000000 !important;
  border-radius: 5px !important;
  border: 1px solid transparent !important;
  padding: 7px 10px 7px 10px !important;
  font-size: 20px !important;
  letter-spacing: -0.08px !important;
  margin: 0 auto !important;
  font-family: "Lato", sans-serif !important;
  -webkit-box-sizing: border-box !important;
  box-sizing: border-box !important;
  -o-transition: 0.3s all linear !important;
  -webkit-transition: 0.3s all linear !important;
  -moz-transition: 0.3s all linear !important;
  -ms-transition: 0.3s all linear !important;
  transition: 0.3s all linear !important;
}
.bmc-button:hover,
.bmc-button:active,
.bmc-button:focus {
  -webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;
  text-decoration: none !important;
  box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;
  opacity: 0.85 !important;
  color: #ffffff !important;
}
</style>
                  

<script>
import core from "purecore";
import VueApexCharts from "vue-apexcharts";

export default {
  name: "InstanceView",
  props: ["uuid"],
  mounted() {
    this.loadKeys();
  },
  components: {
    apexchart: VueApexCharts
  },
  methods: {
    loadKeys: function() {
      var mainObj = this;
      var coreInstance = new core(JSON.parse(localStorage.session)).getInstance(
        mainObj.uuid
      );

      coreInstance
        .getKeys()
        .then(function(keys) {
          mainObj.instance.key.list = keys;
        })
        .catch(function(err) {
          mainObj.instance.key.error = err.message;
        });
    },
    textToClipboard: function(text) {
      var dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
    }
  },
  data: () => ({
    instance: {
      key: {
        list: [],
        error: ""
      }
    },
    chartOptions: {
      chart: {
        toolbar: {
          show: false
        }
      },
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
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          show: false
        }
      },
      yaxis: {
        show: false
      },
      legend: {
        show: false
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
