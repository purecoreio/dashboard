<template>
  <div>
    <v-fade-transition>
      <v-row v-show="!loading">
        <v-col
          v-for="network in networks"
          :key="network.uuid"
          cols="12"
          md="4"
          lg="3"
        >
          <v-card style="height: 200px" @click="select(network)" hover>
            <div
              style="height: 100%"
              class="d-flex align-center justify-center"
            >
              <center>
                <h3>{{ network.name }}</h3>
                <v-divider class="mt-2 mb-2" />
                <h5 style="opacity: 0.5">{{ network.uuid }}</h5>
              </center>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <v-card to="/setup/" style="height: 200px" outlined>
            <div
              style="height: 100%"
              class="d-flex align-center justify-center"
            >
              <v-icon>add</v-icon>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-fade-transition>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      networks: [],
      loading: false,
    };
  },
  methods: {
    select(network) {
      localStorage.setItem(btoa("purecore-n"), network.id);
      this.$purecore.getContext().setNetwork(network);
      this.$router.push({ path: "/network/servers/" });
    },
  },
  mounted() {
    this.loading = true;
    this.$purecore
      .getPlayer()
      .asOwner()
      .getNetworks()
      .then((networks) => {
        this.networks = networks;
        if (networks.length <= 0) {
          this.$router.push({ path: "/setup/" });
        }
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>