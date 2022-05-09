<template>
  <v-row>
    <v-col v-for="network in networks" :key="network.id" cols="12" md="4" lg="3">
      <v-card :to="`/network/${network.id}`" class="align-center d-flex" dark height="200">
        <div class="flex-grow-1 text-center">{{ network.name }}</div>
      </v-card>
    </v-col>
    <v-col cols="12" md="4" lg="3">
      <v-card to="/network/create" variant="outlined" class="align-center d-flex" dark height="200">
        <div class="flex-grow-1 text-center">
          <v-icon size="large" icon="mdi-plus" />
        </div>
      </v-card>
    </v-col>
  </v-row>
  <!-- networks the user has a role in -->
  <div v-if="false">
    <v-divider class="my-5" />
    <v-list title="Networks you participate in" class="mt-5">
      <v-list-item> asd </v-list-item>
    </v-list>
  </div>
  <!-- invites, if any -->
  <div v-if="false">
    <v-divider class="my-5" />
    <v-list title="Networks you participate in" class="mt-5">
      <v-list-item> asd </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      networks: [],
    };
  },
  async beforeCreate() {
    this.networks = await this.context.user.getNetworks();
    if (this.networks.length <= 0) this.$router.push("/network/create");
  },
};
</script>
