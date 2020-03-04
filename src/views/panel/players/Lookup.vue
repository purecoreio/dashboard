<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="primary" text>This feature is still under development.</v-alert>

    <v-text-field
      :loading="isSearchLoading"
      v-model="search"
      item-text="Username"
      item-value="symbol"
      label="Search for a player..."
      solo
    >
      <template v-slot:item="{ item }">
        <v-list-item-avatar>
          <v-img :src="'https://minotar.net/helm/'+item.username" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="item.username"></v-list-item-title>
          <v-list-item-subtitle v-text="item.id"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </v-text-field>

    <div v-if="search.length>0">
      <PlayerRow v-for="player in items" :key="player.uuid" :player="player" />
    </div>

    <div>
      <v-expand-transition>
        <div v-show="search.length<=0">
          <PlayerRow v-for="player in players" :key="player.uuid" :player="player" />
        </div>
      </v-expand-transition>
      <v-expand-transition>
        <div v-show="loadingNew || isSearchLoading">
          <v-skeleton-loader
            v-for="index in 20"
            :key="index"
            style="margin-bottom: 10px"
            height="68"
            type="list-item-two-line"
          ></v-skeleton-loader>
        </div>
      </v-expand-transition>
      <div v-if="!stopLoading && search.length<=0" v-intersect="loadContent"></div>
    </div>
  </div>
</template>


<script>
import core from "purecore";
import PlayerRow from "../../../components/Player/PlayerRow.vue";

export default {
  name: "PlayersLookup",
  components: {
    PlayerRow: PlayerRow
  },
  data: () => ({
    location: [
      {
        text: "Players",
        disabled: true,
        href: ""
      },
      {
        text: "Lookup",
        disabled: false,
        href: "#"
      }
    ],
    players: [],
    loadingNew: false,
    page: 0,
    network: null,
    isSearchLoading: false,
    items: [],
    model: null,
    search: "",
    tab: null,
    stopLoading: false
  }),
  mounted: function() {
    this.$nextTick(function() {
      var coreInstance = new core(JSON.parse(localStorage.session));
      var network = coreInstance.getInstance(localStorage.network).asNetwork();
      this.network = network;
    });
  },
  methods: {
    loadContent() {
      if (!this.loadingNew && localStorage.session && localStorage.network && !this.stopLoading) {
        this.loadingNew = true;
        network = localStorage.network;
        var coreInstance = new core(JSON.parse(localStorage.session));
        var network = coreInstance
          .getInstance(localStorage.network)
          .asNetwork();
        var mainObj = this;

        network.getPlayers(mainObj.page).then(function(players) {
          players.forEach(player => {
            mainObj.players.push(player);
          });

          mainObj.loadingNew = false;
          mainObj.page++;

          if(players.length<20){
            mainObj.stopLoading=true;
          }

        });
      }
    }
  },
  watch: {
    search(val) {
      this.items = [];
      this.isSearchLoading = true;

      // Lazily load input items
      this.network
        .searchPlayers(val)
        .then(res => {
          this.items = res;
        })
        .catch(function(){
          // ignore
        })
        .finally(() => (this.isSearchLoading = false));
    }
  }
};
</script>
