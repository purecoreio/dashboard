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
        <apexchart
          type="bar"
          :height="this.$vuetify.breakpoint.smAndUp ? '350' : '250'"
          :options="this.$chartBarOptions"
          :series="series"
        ></apexchart>
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
        </div>
      </div>
      <v-divider />
      <v-sheet
        :style="` ${
          $vuetify.theme.dark
            ? 'background-color: rgba(0, 0, 0, 0.3)'
            : 'background-color: rgba(0, 0, 0, 0.02)'
        }; position:relative`"
      >
        <div class="pa-3 text-center">
          <span class="display-1"
            >Total Collected:
            <span class="display-1 font-weight-black">84.00</span></span
          >
          <strong>EUR</strong><br />
          <v-btn class="mt-1" color="primary" depressed>
            Download Report
          </v-btn>
        </div>
      </v-sheet>
    </v-card>
    <v-card outlined class="mt-5">
      <div class="pl-2 pr-2">
        <v-row>
          <v-col
            v-for="country in countries"
            :key="country.countryName"
            cols="12"
            md="4"
            lg="3"
          >
            <v-card style="height: 110px" outlined>
              <div class="pa-1 pl-2">
                <span class="display-1 font-weight-black">84.00</span>
                <strong>EUR</strong>
                <p class="caption text-uppercase">AVG 15%</p>
              </div>
              <v-sheet
                :style="` ${
                  $vuetify.theme.dark
                    ? 'background-color: rgba(0, 0, 0, 0.5)'
                    : 'background-color: rgba(0, 0, 0, 0.02)'
                }; position:absolute;width:100%;bottom:0px`"
                tile
                class="pa-1 pl-2"
              >
                <v-row align="center" no-gutters>
                  <v-col class="flex-grow-0 flex-shrink-1">
                    <v-img
                      width="40px"
                      height="30px"
                      contain
                      :src="`https://flagcdn.com/${String(
                        country.countryShortCode
                      ).toLowerCase()}.svg`"
                    >
                    </v-img>
                  </v-col>
                  <v-col
                    style="
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      overflow: hidden;
                    "
                    class="pl-1 flex-grow-1 flex-shrink-0"
                  >
                    {{ country.countryName }}
                  </v-col>
                </v-row>
              </v-sheet>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>
<script>
import data from "country-region-data";
export default {
  data: () => {
    return {
      items: ["November"],
      selected: "November",
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
        {
          name: "Desktops",
          data: [7, 30, 20, 40, 45, 55, 60, 30, 130],
        },
      ],
      countries: data,
    };
  },
};
</script>