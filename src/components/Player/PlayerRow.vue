<template>
  <v-card style="margin-bottom: 10px">
    <v-container fluid>
      <v-row dense align="center">
        <v-col cols="12" xl="10" lg="10" md="10" sm="10" xs="10">
          <v-list-item>
            <v-list-item-avatar tile size="40">
              <v-img :src="'https://minotar.net/helm/'+player.username" />
            </v-list-item-avatar>
            <v-list-item-content style="padding: 0px">
              <div class="overline">{{ player.uuid }} #{{ player.id }}</div>
              <v-list-item-title>{{ player.username }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col class="text-right" cols="12" xl="2" lg="2" md="2" sm="2" xs="2">
          <router-link :to="{ name: 'PlayerProfile' , params: { coreid: player.id } }">
            <v-btn fill-height depressed>
              <v-icon left>person</v-icon>Profile
            </v-btn>
          </router-link>
        </v-col>
      </v-row>
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
