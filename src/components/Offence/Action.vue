<template>
  <v-card style="margin-bottom: 10px" class="pb-2 pt-2">
    <v-list-item>
      <v-list-item-content style="padding: 0px">
        <div class="overline">{{ action.punishmentType }}</div>
        <v-list-item-title>
          <v-chip class="mr-1">- {{ action.requiredPoints }}</v-chip>
          {{ action.name }}
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
  name: "OffenceAction",
  props: ["action"],
  data: () => ({})
};
</script>
