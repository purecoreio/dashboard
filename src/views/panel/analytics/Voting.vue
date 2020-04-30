<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <!-- voting sites performance -->
    <v-expand-transition>
      <section v-show="series.length>0">
        <h1>Your voting sites performance</h1>
        <v-card class="mt-4 pt-4">
          <apexchart
            class="mt-10"
            type="line"
            height="200px"
            :options="optionsSmall"
            :series="series"
          ></apexchart>
        </v-card>
      </section>
    </v-expand-transition>
    <!-- voting sites setup -->
    <v-divider class="mt-6 mb-6" />

    <section>
      <h1>Your setup voting sites</h1>
      <div v-if="votingSites != null">
        <v-row>
          <v-col cols="12" sm="6" md="4" v-for="site in votingSites" :key="site.uuid">
            <VotingSite :site="site" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-card @click="setupNew()" style="postion: relative" height="200px" outlined>
              <v-row no-gutters style="height: 100%" align="center" justify="center">
                <v-col>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Setup new</v-list-item-title>
                      <v-list-item-subtitle>add a voting site</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn icon>
                        <v-icon>add</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <v-row v-if="votingSites == null">
        <v-col cols="12" sm="6" md="4" v-for="i in 6" :key="i">
          <v-skeleton-loader type="image" />
        </v-col>
      </v-row>
    </section>
  </div>
</template>


<script>
import VueApexCharts from "vue-apexcharts";
import VotingSite from "../../../components/Voting/VotingSite";
import core from "purecore";

export default {
  name: "AnalyticsGeneral",
  components: {
    VotingSite,
    apexchart: VueApexCharts
  },
  data: () => ({
    location: [
      {
        text: "Analytics",
        disabled: true,
        href: ""
      },
      {
        text: "Voting",
        disabled: false,
        href: "#"
      }
    ],
    votingSites: null,
    optionsSmall: {
      tooltip: {
        enabled: true,
        followCursor: true,
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
        type: "area",
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
      xaxis: {
        crosshairs: {
          width: 1
        }
      },
      yaxis: {
        min: 0
      }
    },
    series: []
  }),
  mounted() {
    var purecore = new core(JSON.parse(localStorage.getItem("session")));
    var network = purecore
      .getInstance(localStorage.getItem("network"))
      .asNetwork();
    let main = this;
    network.getSetupVotingSites().then(function(sites) {
      main.votingSites = sites;
    });

    network.getVotingAnalytics(3600 * 24 * 7).then(function(data) {
      main.series = purecore
        .getWorkbench()
        .toApexSeries(
          purecore
            .getWorkbench()
            .stack(purecore.getWorkbench().arrayToLegacy(data), (3600 * 24) / 4)
        );
    });
  },
  methods: {
    setupNew() {
      this.$router.push({
        name: "VotingSiteSetup",
        params: { siteid: "none" }
      });
    }
  }
};
</script>
