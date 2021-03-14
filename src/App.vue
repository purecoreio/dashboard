<template>
  <!-- https://docs.google.com/forms/d/e/1FAIpQLSd7CStWKn9Ak30TIZADQCw5U9RMmM_nF6cPqtZ0IACRt39g1g/viewform?usp=pp_url&entry.1314722013=uri&entry.1612373001=id -->
  <v-app>
    <div
      v-if="$router.currentRoute.path.includes(`login`)"
      style="
        filter: grayscale(1);
        opacity: 0.4;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
      "
    >
      <particles-bg v-if="$vuetify.breakpoint.mdAndUp" type="polygon" />
    </div>
    <v-navigation-drawer
      :value="
        $router.currentRoute.path.includes(`network`) &&
        $vuetify.breakpoint.mdAndUp
      "
      app
      clipped
      mini-variant
      mini-variant-width="70px"
    >
      <v-list nav>
        <v-list-item
          v-for="(link, i) in networkLinks"
          :key="i"
          color="primary"
          :to="link.path"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t(link.title) }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :hidden="$router.currentRoute.path.includes(`login`)"
      app
      flat
      clipped-left
    >
      <router-link to="/select/">
        <div
          :class="
            'd-flex align-center' +
            ($vuetify.breakpoint.mdAndUp ? 'logoWhole' : '')
          "
        >
          <v-img
            alt="purecore.io logo"
            class="mr-1 ml-1 logoAnimation"
            contain
            src="@/assets/c.png"
            transition="scale-transition"
            max-width="30px"
          />
        </div>
      </router-link>

      <div
        v-if="$vuetify.breakpoint.mdAndUp"
        style="width: 110px"
        class="d-flex align-center ml-7"
      >
        <v-btn
          :loading="plusStatus == null"
          block
          class="planSelector"
          depressed
          rounded
        >
          <span v-if="plusStatus == 0">{{ $t("free") }}</span>
          <span v-if="plusStatus == 1">Plus</span>
        </v-btn>
      </div>
      <v-spacer />

      <div v-if="$vuetify.breakpoint.mdAndUp" class="d-flex align-center">
        <v-btn
          :loading="networkLoading"
          to="/select/"
          :disabled="$router.currentRoute.path.includes(`select`)"
          class="networkSelector"
          depressed
          rounded
        >
          <span v-if="$router.currentRoute.path.includes(`select`)">{{
            $t("selectingProject")
          }}</span>
          <span
            v-if="
              (!$router.currentRoute.path.includes(`network`) ||
                this.network == null) &&
              !$router.currentRoute.path.includes(`select`)
            "
            >{{ $t("selectProject") }}
            <v-icon>arrow_drop_down</v-icon>
          </span>
          <span
            v-if="
              $router.currentRoute.path.includes(`network`) &&
              this.network != null
            "
            >{{ this.network.name }}
            <v-icon>arrow_drop_down</v-icon>
          </span>
        </v-btn>
      </div>

      <v-btn icon>
        <v-icon>notifications_none</v-icon>
      </v-btn>
      <v-menu open-on-hover offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon>
            <v-icon>account_circle</v-icon>
          </v-btn>
        </template>

        <v-list class="mt-0 mb-0 pt-0 pb-0">
          <v-list-item to="/account/">
            <v-list-item-icon>
              <v-icon> face </v-icon>
            </v-list-item-icon>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout()">
            <v-list-item-icon>
              <v-icon> exit_to_app </v-icon>
            </v-list-item-icon>
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-tooltip
        :color="feedbackNotice ? 'primary' : ''"
        v-model="feedbackTooltip"
        left
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            target="_blank"
            :href="`https://docs.google.com/forms/d/e/1FAIpQLSd7CStWKn9Ak30TIZADQCw5U9RMmM_nF6cPqtZ0IACRt39g1g/viewform?usp=pp_url&entry.1314722013=${$router.currentRoute.path}&entry.1612373001=${networkId}`"
            fixed
            right
            bottom
            :color="feedbackNotice ? 'primary' : ''"
            style="margin-bottom: 45px"
            fab
            ><v-icon>feedback</v-icon></v-btn
          >
        </template>
        <span>Feedback</span>
      </v-tooltip>
      <v-container :fill-height="this.shouldCenter" :fluid="this.shouldCenter">
        <v-row
          :align="shouldCenter ? 'center' : 'start'"
          :justify="shouldCenter ? 'center' : 'start'"
        >
          <v-col>
            <transition mode="out-in" name="fade">
              <router-view />
            </transition>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer
      v-if="!$router.currentRoute.path.includes(`login`)"
      inset
      app
      absolute
      padless
    >
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} — <strong>purecore</strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import { ParticlesBg } from "particles-bg-vue";

export default {
  name: "App",
  components: {
    ParticlesBg,
  },
  watch: {
    context: {
      handler() {
        if (this.context.subscriptionStatus != null) {
          this.plusStatus = Number(this.context.subscriptionStatus.plus);
        }
      },
      deep: true,
    },
    $route(to, from) {
      this.shouldCenterCalc();
      if (!to.path.includes("/network/server/")) {
        this.isSubmenu = false;
        if (from.path.includes("/network/server/")) {
          this.keepCol = true;
          setTimeout(() => {
            this.keepCol = false;
          }, 100);
        }
      } else {
        if (to.path.includes("/network/server/")) {
          setTimeout(() => {
            this.isSubmenu = true;
          }, 100);
        }
      }
    },
  },
  methods: {
    shouldCenterCalc() {
      let centeredEndpoints = ["login", "wizard"];
      for (let i = 0; i < centeredEndpoints.length; i++) {
        const element = centeredEndpoints[i];
        if (this.$router.currentRoute.path.includes(element)) {
          this.shouldCenter = true;
          return;
        }
      }
      this.shouldCenter = false;
    },
    logout() {
      this.$loginManager.logout();
      this.$router.push({ path: "/login/" });
    },
    checkLogin() {
      if (this.$loginManager.isLoggedIn()) {
        if (this.$router.currentRoute.path.includes(`login`)) {
          this.$router.push({ path: "/select/" });
        }
      } else {
        this.$router.push({ path: "/login/" });
      }
    },
    checkNetwork() {
      if (this.network != null && this.network.name == null) {
        this.networkLoading = true;
        this.network
          .asInstance()
          .update()
          .then((instance) => {
            this.$store.commit("network", instance.asNetwork());
          })
          .catch(() => {
            localStorage.removeItem("network");
            this.$store.commit("network", null);
            /*this.$router.push({
              path: "/select/",
            });*/
          })
          .finally(() => {
            this.networkLoading = false;
          });
      } else if (this.network == null) {
        /*this.$router.push({
          path: "/select/",
        });*/
      }
    },
  },
  data: () => ({
    feedbackTooltip: true,
    feedbackNotice: true,
    networkId: null,
    context: null,
    shouldCenter: false,
    networkLoading: false,
    keepCol: false,
    isSubmenu: false,
    network: null,
    plusStatus: null,
    trialStatus: 0,
    serverLinks: [
      {
        path: "setup",
        icon: "build",
        title: "setup",
      },
      {
        path: "health",
        icon: "data_usage",
        title: "health",
      },
      {
        path: "console",
        icon: "computer",
        title: "console",
      },
    ],
    networkLinks: [
      {
        path: "/network/servers/",
        icon: "dns",
        title: "servers",
      },
      {
        path: "/network/players/",
        icon: "people",
        title: "players",
      },
      {
        path: "/network/donations/",
        icon: "store",
        title: "donations",
      },
      {
        path: "/network/community/",
        icon: "chat",
        title: "community",
      },
      {
        path: "/network/punishment/",
        icon: "gavel",
        title: "punishments",
      },
      {
        path: "/network/website/",
        icon: "language",
        title: "website",
      },
      {
        path: "/network/settings/",
        icon: "settings",
        title: "settings",
      },
    ],
  }),
  mounted() {
    setTimeout(() => {
      this.feedbackTooltip = false;
      this.feedbackNotice = false;
    }, 2000);
    this.context = this.$purecore.getContext();
    if (
      this.context.subscriptionStatus != null &&
      this.context.getNetwork() != null
    ) {
      this.plusStatus = Number(this.context.subscriptionStatus.plus);
      this.trialStatus = Number(this.context.subscriptionStatus.usedTrial);
      this.networkId = this.context.getNetwork().getId();
    } else {
      setInterval(() => {
        if (this.context.subscriptionStatus != null) {
          this.plusStatus = Number(this.context.subscriptionStatus.plus);
          this.trialStatus = Number(this.context.subscriptionStatus.usedTrial);
        }
        if (this.context.getNetwork() != null) {
          this.networkId = this.context.getNetwork().getId();
        }
      }, 100);
    }
    this.isSubmenu = this.$router.currentRoute.path.includes(
      "/network/server/"
    );
    //this.$vuetify.theme.dark = true;
    var userLang = navigator.language || navigator.userLanguage;
    this.$i18n.locale = userLang;
    console.log(this.$i18n.locale)
    //this.checkNetwork();
    this.checkLogin();
    this.shouldCenterCalc();
  },
};
</script>

<style lang="css">
@import "./assets/styles/app.css";
</style>
