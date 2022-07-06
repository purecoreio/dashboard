<template>
  <router-container v-if="network">
    <router-view :network="network" />
  </router-container>
</template>

<script>
import AnimatedLogo from "@/components/logo/AnimatedLogo.vue";
import RouterContainer from "@/components/container/RouterContainer.vue";

export default {
  emits: ["identity"],
  components: {
    AnimatedLogo,
    RouterContainer,
  },
  async beforeMount() {
    try {
      if (!this.context.selected) {
        this.$router.push({
          path: "/networks",
          query: { redirect: this.$router.currentRoute.value.fullPath },
        })
      } else {
        this.network = await this.context.user.getNetwork(this.context.selected);
        this.$emit("identity", {
          name: this.network.name,
          id: this.network.id,
          action: "/networks",
          icon: "mdi-swap-horizontal",
          links: [
            {
              path: "instances",
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
        })
      }
    } catch (error) {
      this.$router.push("/");
      this.unselect()
    }
  },
  data() {
    return {
      network: null,
    };
  },
};
</script>
