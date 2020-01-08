<template>
  <v-card style="margin-bottom: 10px">
    <v-container fluid>
      <v-row dense align="center">
        <v-col cols="3">
          <v-list-item-content style="padding: 0px">
            <v-list-item-title
              v-if="(parseDate(connection.status.closedOn) - parseDate(connection.status.openedOn))>0"
            >
              <v-btn
                color="red"
                text
              >Offline ({{ parseDate(connection.status.closedOn) - parseDate(connection.status.openedOn) }}s)</v-btn>
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
              <v-btn v-on="on" fill-height depressed>
                <v-icon left>layers</v-icon>Map View
              </v-btn>
            </template>

            <v-card>
              <MglMap
                style="height: 400px"
                :center="[connection.location.long,connection.location.lat]"
                zoom=10
                accessToken="pk.eyJ1IjoicXVpcXVlbGhhcHB5IiwiYSI6ImNqdjlrcnM4ODBweng0M21qb3RxbnB0bWYifQ.SAxbNKo03QVyYdBZg8wmmw"
                mapStyle="mapbox://styles/mapbox/light-v9"
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
    </v-container>
  </v-card>
</template>


<script>
import { MglMap } from "vue-mapbox";
export default {
  name: "ConnectionRow",
  props: ["connection"],
  components: {
    MglMap: MglMap
  },
  data: () => ({
    dialog: false
  }),
  methods: {
    parseDate: function(stringval) {
      if (stringval == null) {
        return 0;
      } else {
        return parseInt(stringval);
      }
    }
  }
};
</script>
