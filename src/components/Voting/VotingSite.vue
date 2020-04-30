<template>
  <v-card style="postion: relative" height="200px" outlined>
    <v-list-item class="mt-4">
      <v-list-item-content>
        <v-list-item-title>{{site.votingSite.name}}</v-list-item-title>
        <v-list-item-subtitle>{{site.votingSite.url}}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn :to="{name:'VotingSiteSetup', params: {siteid: site.votingSite.uuid}}" icon>
          <v-icon>settings</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <div class="pl-4 pr-4" style="position: absolute; width: 100%; bottom: 0px;">
      <v-divider class="mb-4" />
      <a style="text-transform: none; text-decoration: none" :href="site.url" target="_blank">
        <p
          class="grey--text"
          style="text-overflow: ellipsis;  overflow: hidden; white-space: nowrap;"
        >{{site.url}}</p>
      </a>
    </div>
  </v-card>
</template>

<script>
export default {
  props: ["site"]
};
</script>