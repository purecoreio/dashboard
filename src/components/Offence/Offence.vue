<template>
  <v-card style="margin-bottom: 10px">
    <v-list-item>
      <v-list-item-content style="padding: 0px">
        <v-list-item-title>
          <v-chip class="mr-1">- {{ offence.negativePoints }}</v-chip>
          {{ offence.name }}
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn :icon="$vuetify.breakpoint.smAndDown" depressed>
          <v-icon :left="$vuetify.breakpoint.mdAndUp">edit</v-icon>
          <span v-if="$vuetify.breakpoint.mdAndUp">Edit</span>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-card>
</template>


<script>
export default {
  name: "Offence",
  props: ["offence"],
  data: () => ({})
};
</script>
