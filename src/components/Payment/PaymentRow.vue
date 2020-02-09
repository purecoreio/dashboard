<template>
  <v-card :elevation="noShadow==true ? 0 : 1" style="margin-bottom: 10px">
    <v-container fluid>
      <v-row dense align="center">
        <v-col cols="8" xl="8" lg="8" md="8" sm="8">
          <v-list-item-content style="padding: 0px">
            <div class="overline">{{ payment.gateway.name }}</div>
            <v-list-item-title>{{ payment.legacyUsername }}</v-list-item-title>
          </v-list-item-content>
        </v-col>
        <v-col
          class="text-right"
          cols="2"
          xl="2"
          lg="2"
          md="2"
          sm="2"
        >{{ payment.request.due }} {{ payment.request.currency }}</v-col>
        <v-col class="text-right" cols="2" xl="2" lg="2" md="2" sm="2">
          <v-btn :icon="$vuetify.breakpoint.smAndDown" v-on="on" fill-height depressed>
            <v-icon :left="$vuetify.breakpoint.mdAndUp">history</v-icon>
            <span v-if="$vuetify.breakpoint.mdAndUp">Details</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>


<script>
export default {
  name: "PaymentRow",
  props: ["payment", "noShadow"],
  data: () => ({})
};
</script>
