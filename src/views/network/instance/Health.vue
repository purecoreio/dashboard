<template>
  <div class="small">
    <v-card outlined>
      <v-list style="filter: blur(5px)">
        <v-list-item>
          <v-list-item-icon>
            <v-icon> storage </v-icon>
          </v-list-item-icon>
          <v-list-item-content> High storage R/W ops </v-list-item-content>
          <v-list-item-action>
            <v-chip> 19:00:00 </v-chip>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon> memory </v-icon>
          </v-list-item-icon>
          <v-list-item-content> High CPU usage </v-list-item-content>
          <v-list-item-action>
            <v-chip> 19:00:00 </v-chip>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon> data_usage </v-icon>
          </v-list-item-icon>
          <v-list-item-content> High RAM usage </v-list-item-content>
          <v-list-item-action>
            <v-chip> 19:00:00 </v-chip>
          </v-list-item-action>
        </v-list-item>
      </v-list>
        <v-container style="position:absolute;width:100%;left:0px;top:0px;height:100%" fill-height fluid>
          <v-row align="center" justify="center">
            <v-col>
              <center>
                <h4>See instance incidents with purecore <span class="plus">plus</span></h4>
              </center>
            </v-col>
          </v-row>
        </v-container>
    </v-card>
    <v-divider class="mt-4 mb-4" />
    <div v-if="options != null">
      <v-card outlined class="mb-3">
        <p class="overline ml-2 mt-2">CPU USAGE</p>
        <apexchart
          type="line"
          height="200px"
          :options="options[0]"
          :series="series1"
        ></apexchart>
      </v-card>
      <v-card outlined class="mb-3">
        <p class="overline ml-2 mt-2">RAM USAGE</p>
        <apexchart
          type="line"
          height="200px"
          :options="options[1]"
          :series="series2"
        ></apexchart>
      </v-card>
      <v-card outlined>
        <p class="overline ml-2 mt-2">NETWORK USAGE</p>
        <apexchart
          type="line"
          height="200px"
          :options="options[2]"
          :series="series3"
        ></apexchart>
      </v-card>
    </div>
  </div>
</template>
<script>
export default {
  data: () => {
    return {
      options: null,
      series1: [
        {
          name: "series-1",
          data: [5, 5, 4, 5, 5, 2, 4, 5, 5, 5, 5, 5, 5],
        },
      ],
      series2: [
        {
          name: "series-2",
          data: [2, 4, 2, 6, 7, 8, 3, 5, 2, 1, 8, 9, 1],
        },
      ],
      series3: [
        {
          name: "series-3",
          data: [2, 2, 90, 40, 4, 2, 5, 90, 80, 50, 60, 0, 2],
        },
      ],
    };
  },
  mounted() {
    let t = this.$chartOptions;
    t.chart.group = "health";
    t.yaxis = {
      labels: {
        minWidth: 10,
      },
    };
    let fo = [];
    for (let i = 0; i < 3; i++) {
      let tf = t;
      tf.chart.id = `health-${i}`;
      fo[i] = tf;
    }
    this.options = fo;
  },
};
</script>