<template>
  <v-card :elevation="noShadow==true ? 0 : 1" class="pa-2" style="margin-bottom: 10px">
    <v-row dense align="center">
      <v-col cols="3">
        <v-list-item-content style="padding: 0px">
          <v-list-item-title
            v-if="(parseDate(connection.status.closedOn) - parseDate(connection.status.openedOn))>0"
          >
            <v-btn
              text
            >{{ parseDifference(parseDate(connection.status.closedOn) - parseDate(connection.status.openedOn)) }}</v-btn>
          </v-list-item-title>
          <v-list-item-title
            v-if="(parseDate(connection.status.closedOn) - parseDate(connection.status.openedOn))<=0"
          >
            <v-btn color="green" text>Online</v-btn>
          </v-list-item-title>
        </v-list-item-content>
      </v-col>
      <v-col cols="3">
        <v-list-item-content style="padding: 0px">
          <v-list-item-title>{{ connection.location.city }}</v-list-item-title>
          <v-list-item-subtitle>{{ connection.location.region }}, {{ connection.location.country }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-col>
      <v-col cols="3">
        <v-list-item-content style="padding: 0px">
          <v-list-item-title>{{ connection.instance.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ connection.instance.uuid }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-col>
      <v-col class="text-right" cols="3">
        <v-dialog v-model="dialog" width="500">
          <template v-slot:activator="{ on }">
            <v-btn :icon="$vuetify.breakpoint.smAndDown" v-on="on" fill-height depressed>
              <v-icon :left="$vuetify.breakpoint.mdAndUp">layers</v-icon>
              <span v-if="$vuetify.breakpoint.mdAndUp">Map View</span>
            </v-btn>
          </template>

          <v-card>
            <MglMap
              style="height: 400px; width: 100%"
              :center="[connection.location.long,connection.location.lat]"
              zoom="10"
              accessToken="pk.eyJ1IjoicXVpcXVlbGhhcHB5IiwiYSI6ImNqdjlrcnM4ODBweng0M21qb3RxbnB0bWYifQ.SAxbNKo03QVyYdBZg8wmmw"
              :mapStyle="$vuetify.theme.dark ? 'mapbox://styles/mapbox/dark-v9' : 'mapbox://styles/mapbox/light-v9'"
            ></MglMap>
            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialog = false">Exit</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-card>
</template>


<script>
import { MglMap } from "vue-mapbox";
export default {
  name: "ConnectionRow",
  props: ["connection", "noShadow"],
  components: {
    MglMap: MglMap
  },
  data: () => ({
    dialog: false,
    mapstyle: "mapbox://styles/mapbox/light-v9"
  }),
  mounted() {
    if (this.$vuetify.theme.dark) {
      this.mapstyle = "mapbox://styles/mapbox/dark-v9";
    }
  },
  methods: {
    parseDate: function(stringval) {
      if (stringval == null) {
        return 0;
      } else {
        return stringval.valueOf() / 1000;
      }
    },
    parseDifference: function(secs) {
      var sec_num = parseInt(secs, 10);
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor(sec_num / 60) % 60;
      var seconds = sec_num % 60;

      return [hours, minutes, seconds]
        .map(v => (v < 10 ? "0" + v : v))
        .filter((v, i) => v !== "00" || i > 0)
        .join(":");
    }
  }
};
</script>
