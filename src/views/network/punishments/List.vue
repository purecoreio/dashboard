<template>
  <div>
    <v-card
      class="pt-1 pb-1 mb-2"
      outlined
      v-for="punishment in punishments"
      :key="punishment.id"
    >
      <v-list-item>
        <v-list-item-content>
          <v-row align="center" no-gutters>
            <v-col
              v-if="punishment.staff == null"
              class="flex-grow-0 flex-shrink-1"
            >
              <v-avatar
                v-for="profile in punishment.affected"
                :key="profile.id"
                size="40"
              >
                <v-img
                  :src="`https://minotar.net/helm/` + profile.platformUsername"
                ></v-img>
              </v-avatar>
            </v-col>
            <v-col
              v-if="punishment.staff != null"
              class="flex-grow-0 flex-shrink-1"
            >
              <v-badge avatar bordered overlap>
                <template v-slot:badge>
                  <v-avatar>
                    <v-img
                      :src="
                        `https://minotar.net/helm/` +
                        punishment.staff.platformUsername
                      "
                    ></v-img>
                  </v-avatar>
                </template>

                <v-avatar
                  v-for="profile in punishment.affected"
                  :key="profile.id"
                  size="40"
                >
                  <v-img
                    :src="
                      `https://minotar.net/helm/` + profile.platformUsername
                    "
                  ></v-img>
                </v-avatar>
              </v-badge>
            </v-col>
            <v-col class="flex-grow-0 flex-shrink-1 pl-4">
              <v-list-item-title style="min-width: 130px">
                <b>{{ getType(punishment.type) }}</b>
                <span v-if="punishment.reason != null">
                  {{ punishment.reason }}
                </span>
              </v-list-item-title>
              <v-list-item-subtitle>
                <span v-for="profile in punishment.affected" :key="profile.id">
                  {{ profile.platformUsername }}
                </span>
              </v-list-item-subtitle>
            </v-col>
            <v-col
              v-if="$vuetify.breakpoint.mdAndUp"
              class="text-right flex-grow-1 flex-shrink-0"
            >
              <v-tooltip v-if="punishment.until != null" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-chip label class="mr-2" v-bind="attrs" v-on="on">
                    {{
                      countdown(
                        (punishment.until.getTime() -
                          punishment.since.getTime()) /
                          1000
                      )
                    }}
                  </v-chip>
                </template>
                <span
                  >This punishment is due until
                  {{ punishment.until.toLocaleString() }}</span
                >
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-chip label v-bind="attrs" v-on="on">
                    {{ punishment.since.toLocaleString() }}
                  </v-chip>
                </template>
                <span>Creation timestamp</span>
              </v-tooltip>
              <v-tooltip v-if="punishment.closed != null" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-chip
                    color="green"
                    class="ml-2"
                    label
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ punishment.closed.toLocaleString() }}
                  </v-chip>
                </template>
                <span>Closed manually</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <v-fade-transition>
      <div v-show="!loading && punishments.length <= 0">
        <center class="mt-10">
          <v-icon class="mb-10" x-large> gavel </v-icon>
          <h2>Your network has no recorded punishments</h2>
          <span>Your new punishments will be listed here</span>
        </center>
      </div>
    </v-fade-transition>
    <div v-if="loading">
      <v-skeleton-loader
        v-for="i in 20"
        :key="i"
        class="mx-auto mb-2"
        type="list-item-avatar-two-line"
      ></v-skeleton-loader>
    </div>
  </div>
</template>
<script>
export default {
  data: () => {
    return {
      punishments: [],
      lastTimestamp: null,
      loading: false,
      stopQuerying: false,
    };
  },
  mounted() {
    this.scroll();
    this.query();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollHandler);
  },
  methods: {
    getType(type) {
      switch (type) {
        case 0:
          return "Kick";
        case 1:
          return "Ban";
        case 2:
          return "Warn";
        case 3:
          return "Mute";
        case 4:
          return "BanIP";

        default:
          break;
      }
    },
    countdown(s) {
      const d = Math.floor(s / (3600 * 24));

      s -= d * 3600 * 24;

      const h = Math.floor(s / 3600);

      s -= h * 3600;

      const m = Math.floor(s / 60);

      s -= m * 60;

      const tmp = [];

      d && tmp.push(d + "d");

      (d || h) && tmp.push(h + "h");

      (d || h || m) && tmp.push(m + "m");

      tmp.push(s + "s");

      return tmp.join(" ");
    },
    scrollHandler() {
      {
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
      }
    },
    scroll() {
      window.addEventListener("scroll", this.scrollHandler);
    },
    query() {
      if (!this.loading && !this.stopQuerying) {
        let main = this;
        main.loading = true;
        this.$purecore
          .getContext()
          .getNetwork()
          .getPunishments(
            main.lastTimestamp != null
              ? main.lastTimestamp / 1000
              : new Date().getTime() / 1000
          )
          .then((punishments) => {
            if (punishments.length <= 0) {
              main.stopQuerying = true;
              console.log(main.stopQuerying);
            } else {
              for (let i = 0; i < punishments.length; i++) {
                const element = punishments[i];
                main.punishments.push(element);
                if (i == punishments.length - 1) {
                  main.lastTimestamp = element.since;
                }
              }
            }
          })
          .finally(() => {
            main.loading = false;
          });
      }
    },
  },
};
</script>