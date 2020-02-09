<template>
  <v-card :elevation="noShadow==true ? 0 : 1" style="margin-bottom: 10px">
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
          <v-btn :icon="$vuetify.breakpoint.smAndDown" depressed>
            <v-icon :left="$vuetify.breakpoint.mdAndUp">edit</v-icon>
            <span v-if="$vuetify.breakpoint.mdAndUp">Context</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>


<script>
export default {
  name: "Punishment",
  props: ["punishment", "noShadow"],
  data: () => ({})
};
</script>
