<template>
  <v-navigation-drawer v-if="network" class="py-2 px-2" permanent app>
    <v-alert variant="contained-text" color="primary">
      <v-list-item class="px-0">
        <v-list-item-action>
          <v-btn to="/" variant="text" icon>
            <v-icon> mdi-swap-horizontal </v-icon>
          </v-btn>
        </v-list-item-action>
        <div class="pl-3">
          <v-list-item-title> {{ network.name }} </v-list-item-title>
          <v-list-item-subtitle> #{{ network.id }} </v-list-item-subtitle>
        </div>
      </v-list-item>
    </v-alert>
    <v-list class="px-0 pt-0" nav dense>
      <v-list-item
        class="my-2"
        :to="`/network/${this.network.id}/${link.path}`"
        v-for="link in links"
        :key="link.path"
        active-color="primary"
      >
        <v-list-item-avatar>
          <v-icon :icon="`mdi-${link.icon}`"></v-icon>
        </v-list-item-avatar>

        <v-list-item-title>{{ link.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-main>
    <router-container v-if="network">
      <router-view :network="network" />
    </router-container>
  </v-main>
</template>

<script>
import AnimatedLogo from "@/components/logo/AnimatedLogo.vue";
import RouterContainer from "@/components/container/RouterContainer.vue";

export default {
  components: {
    AnimatedLogo,
    RouterContainer,
  },
  async beforeMount() {
    try {
      this.network = await this.context.user.getNetwork(this.$route.params.id);
    } catch (error) {
      this.$router.push("/");
    }
  },
  data() {
    return {
      network: null,
      links: [
        {
          path: "instance",
          name: "Instances",
          icon: "server",
        },
        {
          path: "player",
          name: "Players",
          icon: "account-supervisor-circle",
        },
        {
          path: "store",
          name: "Store",
          icon: "store",
        },
        {
          path: "website",
          name: "Website",
          icon: "web",
        },
        {
          path: "analytics",
          name: "Analytics",
          icon: "poll",
        },
        {
          path: "staff",
          name: "Staff",
          icon: "shield-account",
        },
        {
          path: "settings",
          name: "Settings",
          icon: "tune",
        },
        {
          path: "service",
          name: "Services",
          icon: "package",
        },
        {
          path: "dev",
          name: "Development",
          icon: "apple-keyboard-command",
        },
      ],
    };
  },
};
</script>
<style scoped>
a.v-list-item--active i {
  color: #82b1ff;
}
</style>
