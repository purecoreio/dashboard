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
      <div class="pl-5 pr-5 pt-2 pb-2">
        <v-row>
          <v-col cols="12" sm="4">
            <v-card style="height: 100%" class="pa-4" outlined>
              <span class="display-2 font-weight-black">84.00</span>
              <strong>EUR</strong>
              <p class="caption text-uppercase">Gross Discounted</p>
              <p>
                This represents the total discounted amount from the checkout
                balance
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card style="height: 100%" class="pa-4" outlined>
              <span class="display-2 font-weight-black">1</span>
              <p class="caption text-uppercase">Active Sales</p>
              <p>
                This is the number of active sales being displayed on your store
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card style="height: 100%" class="pa-4" outlined>
              <span class="display-2 font-weight-black">4</span>
              <p class="caption text-uppercase">Payments With Discounts</p>
              <p>This represents the amount of payments with a discount</p>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <v-row class="mt-6 mb-2" no-gutters align="center">
      <v-col class="flex-grow-1 flex-shrink-0">
        <p class="overline text-uppercase ma-0">Sales Performance</p>
      </v-col>
      <v-col class="flex-grow-0 flex-shrink-1 text-right">
        <v-btn text>
          Create Sale<v-icon style="transform: translateY(2px)">add</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="mb-3" v-for="i in 2" :key="i" outlined>
      <v-list-item>
        <v-list-item-title> Name </v-list-item-title>
        <v-list-item-action>
          <v-btn text color="red"> Archive </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-divider />
      <div style="position: relative" class="pt-0 pa-2 pb-0">
        <v-row
          :style="`${
            i == 2 ? 'filter:blur(8px) grayscale(1);opacity:0.5;' : ''
          }`"
        >
          <v-col cols="12" sm="4">
            <v-card style="height: 100%" class="pa-4" outlined>
              <span class="green--text">
                <span class="display-2 font-weight-black">+20.00</span>
                <strong>%</strong>
              </span>
              <p class="caption text-uppercase">Sales Number</p>
              <p>
                The amount of transactions made compared to the exact same
                period from a month before the sale was active
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card style="height: 100%" class="pa-4" outlined>
              <span class="red--text">
                <span class="display-2 font-weight-black">-4.00</span>
                <strong>%</strong>
              </span>
              <p class="caption text-uppercase">Sales Income</p>
              <p>
                The income being generated compared to the exact period from a
                month before the sale was active
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card style="height: 100%" class="pa-4" outlined>
              <span class="green--text">
                <span class="display-2 font-weight-black">+10.00</span>
                <strong>%</strong>
              </span>
              <p class="caption text-uppercase">Potential Customers</p>
              <p>
                This represents the amount of platform profiles being marked as
                interested customers
              </p>
            </v-card>
          </v-col>
        </v-row>
        <div
          v-if="i == 2"
          style="
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
          "
        >
          <v-container fill-height fluid>
            <v-row align="center" justify="center">
              <v-col>
                <center>
                  <v-icon large class="mb-1">schedule</v-icon>
                  <h2>Scheduled</h2>
                </center>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </div>
      <v-divider />
      <div class="pa-3">
        <v-row no-gutters>
          <v-col>
            <v-icon class="mr-2">schedule</v-icon>Starting 1/2/21 00:00
          </v-col>
          <v-col class="text-center">
            <v-icon class="mr-2">history_toggle_off</v-icon>Ending 7/2/21 00:00
          </v-col>
          <v-col class="text-right">
            <v-icon class="mr-2">sort</v-icon>2 Conditions
          </v-col>
        </v-row>
      </div>
    </v-card>

    <v-row class="mt-6 mb-2" no-gutters align="center">
      <v-col class="flex-grow-1 flex-shrink-0">
        <p class="overline text-uppercase ma-0">Discount Codes</p>
      </v-col>
      <v-col class="flex-grow-0 flex-shrink-1 text-right">
        <v-btn text>
          Create Code<v-icon style="transform: translateY(2px)">add</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-card outlined>
      <v-list class="pt-0 pb-0">
        <v-list-item v-for="i in 5" :key="i" @click="n=0" >
          <v-list-item-content @click="a=1">
            <v-row align="center" no-gutters>
              <v-col>
                <span style="font-size: 17px"
                  >EX<span
                    style="
                      background-color: black;
                      border-radius: 5px;
                      padding-left: 4px;
                      padding-right: 5px;
                      color: white;
                      margin-left: 2px;
                    "
                    >• • • • •</span
                  ><v-btn icon>
                    <v-icon small style="transform: translateY(-2px)">
                      content_copy
                    </v-icon>
                  </v-btn>
                </span>
              </v-col>
              <v-col> 0/∞ Uses </v-col>
              <v-col> 20% </v-col>
            </v-row>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon>
              <v-icon> edit </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      items: ["December"],
      selected: "December",
      series: [
        {
          name: "Gross",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
        {
          name: "Net",
          data: [7, 30, 20, 40, 45, 55, 60, 30, 130],
        },
      ],
    };
  },
};
</script>