<template>
  <v-card style="margin-bottom: 10px">
    <v-container fluid>
      <v-row dense align="center">
        <v-col cols="3">
          <v-list-item-content style="padding: 0px">
            <v-list-item-title>{{ punishment.player.username }}</v-list-item-title>
          </v-list-item-content>
        </v-col>
        <v-col cols="3">
          <v-list-item-content style="padding: 0px">
            <v-list-item-title>{{ punishment.moderator.username }}</v-list-item-title>
          </v-list-item-content>
        </v-col>
        <v-col cols="3">
          <v-list-item-content style="padding: 0px">
            <v-list-item-title>
              <span v-for="offence in punishment.offenceList" :key="offence.index">{{offence.name}}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-col>
        <v-col class="text-right" cols="3">
          <v-btn fill-height depressed>
            <v-icon left>edit</v-icon>Context
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>


<script>
export default {
  name: "Punishment",
  props: ["punishment"],
  data: () => ({})
};
</script>
