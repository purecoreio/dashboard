<template>
  <div>
    <onlineGraph
      class="mb-4"
      :instance="$purecore.getContext().getNetwork().asInstance()"
    />
    <v-card
      class="pt-1 pb-1 mb-2"
      outlined
      v-for="profile in profiles"
      :key="profile.id"
    >
      <v-list-item>
        <v-list-item-avatar>
          <img :src="`https://minotar.net/helm/${profile.platformUsername}`" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title style="min-width: 130px">
            {{ profile.platformUsername }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ profile.platformId }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <div v-if="loading">
      <v-skeleton-loader
        v-for="i in 20"
        :key="i"
        class="mx-auto mb-2"
        type="list-item-avatar-two-line"
      ></v-skeleton-loader>
    </div>
    <v-fade-transition>
      <div v-show="!loading && profiles.length <= 0">
        <center class="mt-8">
          <v-icon class="mb-5" x-large> recent_actors </v-icon>
          <h2>Your network has no online players</h2>
          <span>Your online players will be listed here</span>
        </center>
      </div>
    </v-fade-transition>
  </div>
</template>

<script>
import onlineGraph from "@/components/analytic/Online";
export default {
  components: {
    onlineGraph,
  },
  name: "Transactions",
  data: () => {
    return {
      items: ["December"],
      selected: "December",
      profiles: [],
      timestamp: null,
      loading: false,
      stopQuerying: false,
      page: 0,
    };
  },
  mounted() {
    this.timestamp = new Date();
    this.query();
    this.scroll();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollHandler);
  },
  methods: {
    scrollHandler() {
      let bottomOfWindow =
        Math.max(
          window.pageYOffset,
          document.documentElement.scrollTop,
          document.body.scrollTop
        ) +
          window.innerHeight >=
        document.documentElement.offsetHeight - 400;

      if (bottomOfWindow) {
        this.query();
      }
    },
    scroll() {
      window.addEventListener("scroll", this.scrollHandler);
    },
    query() {
      if (!this.stopQuerying && !this.loading) {
        let main = this;
        main.loading = true;
        this.$purecore
          .getContext()
          .getNetwork()
          .asInstance()
          .getOnlinePlayers(this.timestamp, this.page)
          .then((profiles) => {
            if (profiles.length < 20) {
              main.stopQuerying = true;
            }
            for (let i = 0; i < profiles.length; i++) {
              const element = profiles[i];
              main.profiles.push(element);
            }
          })
          .finally(() => {
            main.loading = false;
            main.page++;
          });
      }
    },
  },
};
</script>