<template>
  <v-card style="margin-bottom: 10px">
    <v-container fluid>
      <v-list-item>
        <v-list-item-avatar tile size="40">
          <v-img :src="'https://minotar.net/helm/'+player.username" />
        </v-list-item-avatar>
        <v-list-item-content style="padding: 0px">
          <div class="overline">{{ player.uuid }} #{{ player.id }}</div>
          <v-list-item-title>{{ player.username }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn
            :to="{ name: 'PlayerProfile' , params: { coreid: player.id } }"
            fill-height
            depressed
            :icon="!$vuetify.breakpoint.smAndUp"
          >
            <v-icon :left="$vuetify.breakpoint.smAndUp">person</v-icon>
            <span v-if="$vuetify.breakpoint.smAndUp">Profile</span>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-container>
  </v-card>
</template>


<script>
export default {
  name: "PlayerRow",
  props: ["player"],
  data: () => ({})
};
</script>
