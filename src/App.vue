<template>
  <v-app id="sandbox">
    <v-navigation-drawer
      v-model="primaryDrawer.model"
      :clipped="primaryDrawer.clipped"
      :floating="primaryDrawer.floating"
      :mini-variant="primaryDrawer.mini"
      permanent="primaryDrawer.type === 'permanent'"
      :temporary="primaryDrawer.type === 'temporary'"
      expand-on-hover
      app
      overflow
    >
      <v-list-item style="height: 120px">
        <v-list-item-content
          fill-height
          justify="center"
          align="center"
          v-if="selectedNetwork!=null&&selectedNetworkName!=null"
        >
          <center>
            <v-list-item-title class="title">
              {{ selectedNetworkName }}
              <v-btn @click="switchingNetworks=true" small color="primary" outlined text icon>
                <v-icon>compare_arrows</v-icon>
              </v-btn>
            </v-list-item-title>
            <v-list-item-subtitle>{{ selectedNetwork }}</v-list-item-subtitle>
          </center>
        </v-list-item-content>
        <v-list-item-content
          fill-height
          justify="center"
          align="center"
          v-if="selectedNetwork==null||selectedNetworkName==null"
        >
          <center>
            <v-list-item-title class="title">
              <v-skeleton-loader class="mx-auto" type="text"></v-skeleton-loader>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-skeleton-loader class="mx-auto" type="text"></v-skeleton-loader>
            </v-list-item-subtitle>
          </center>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list shaped>
        <v-list-group
          v-for="item in items"
          :key="item.action"
          v-model="item.active"
          :prepend-icon="item.icon"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item link :to="subItem.path" v-for="subItem in item.items" :key="subItem.title">
            <v-list-item-content>
              <v-list-item-title v-text="subItem.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <!-- login form -->

    <v-app-bar :clipped-left="primaryDrawer.clipped" app>
      <v-app-bar-nav-icon
        v-if="primaryDrawer.type !== 'permanent'"
        @click.stop="primaryDrawer.model = !primaryDrawer.model"
      />
      <v-toolbar-title>purecore</v-toolbar-title>
      <v-spacer />

      <v-dialog
        :value="(selectedNetwork==undefined || selectedNetwork == null || switchingNetworks) && (session != null && session != undefined)"
        persistent
        max-width="500px"
      >
        <template v-slot:activator="{ on }">
          <v-btn rounded text @click="switchingNetworks=true">
            <v-icon>compare_arrows</v-icon>
          </v-btn>
        </template>
        <v-card max-width="500">
          <v-list v-if="availableNetworks.length > 0">
            <v-list-item-group v-model="model" color="primary">
              <v-list-item
                @click="selectedNetwork=i.uuid; switchingNetworks=false"
                v-for="i in availableNetworks"
                :key="i"
              >
                <v-list-item-icon>
                  <v-icon>arrow_forward</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title v-text="i.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-divider v-if="availableNetworks.length > 0"></v-divider>
          <v-row no-gutters class="px-3" max-width="500">
            <v-col cols="6">
              <v-layout row wrap justify-start>
                <v-flex shrink>
                  <v-btn
                    @click="disableNetworkSwitcher"
                    :disabled="selectedNetwork == null || selectedNetwork == undefined"
                    class="ma-2"
                    outlined
                    color="secondary"
                  >CANCEL</v-btn>
                </v-flex>
              </v-layout>
            </v-col>
            <v-col cols="6">
              <v-layout row wrap justify-end>
                <v-flex shrink>
                  <v-btn class="ma-2" outlined color="primary">CREATE NETWORK</v-btn>
                </v-flex>
              </v-layout>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
      <v-btn
        @click="session=null; selectedNetwork=null"
        v-if="(session != null && session != undefined)"
        icon
      >
        <v-icon>exit_to_app</v-icon>
      </v-btn>

      <v-dialog :value="!(session != null && session != undefined)" persistent max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn v-if="!(session != null && session != undefined)" rounded text v-on="on">
            LOGIN WITH GOOGLE
            <v-avatar right size="25px" style="margin-left: 10px">
              <v-img src="./assets/glogo.svg" alt="Login" />
            </v-avatar>
          </v-btn>
        </template>
        <v-card class="mx-auto" max-width="500">
          <v-img src="./assets/piston.png" height="300px"></v-img>
          <center>
            <v-btn
              @click="GoogleLoginHandle"
              v-if="!(session != null && session != undefined)"
              rounded
              outlined
              v-on="on"
              :loading="loginLoading"
              style="margin-bottom: 30px"
            >
              {{loginString}}
              <v-avatar right size="25px" style="margin-left: 10px">
                <v-img src="./assets/glogo.svg" alt="Login" />
              </v-avatar>
            </v-btn>
          </center>
        </v-card>
      </v-dialog>

      <!-- login form -->
    </v-app-bar>

    <v-content>
      <v-container fluid class="mb-5">
        <v-row align="center" justify="center">
          <v-col cols="12" xs="12" sm="12" md="10" lg="8" xl="6">
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
      <v-footer absolute>
        <center style="width: 100%">
          <span class="px-4">&copy; 2019-{{ new Date().getFullYear() }} quiquelhappy</span>
        </center>
      </v-footer>
    </v-content>
  </v-app>
</template>

<script>
import core from "purecore";

export default {
  name: "App",
  data: () => ({
    availableNetworks: [],
    session: null,
    loginString: "LOGIN WITH GOOGLE",
    loginLoading: false,
    selectedNetwork: null,
    selectedNetworkName: null,
    switchingNetworks: false,
    drawers: ["Default (no property)", "Permanent", "Temporary"],
    primaryDrawer: {
      model: null,
      type: "default (no property)",
      clipped: true,
      floating: true,
      mini: false
    },
    footer: {
      inset: false
    },
    items: [
      {
        action: "summary",
        title: "Summary",
        icon: "dashboard",
        active: true,
        items: [
          {
            title: "General View",
            path: "/summary/general"
          },
          { title: "Instance View", path: "/summary/instance" }
        ]
      },
      {
        action: "players",
        title: "Players",
        icon: "supervisor_account",
        items: [{ title: "Lookup", path: "/players/lookup" }]
      },
      {
        action: "analytics",
        title: "Analytics",
        icon: "bar_chart",
        items: [
          { title: "General Stats", path: "/analytics/general" },
          { title: "Instance Growth", path: "/analytics/growth" },
          { title: "Game Stats", path: "/analytics/game" },
          { title: "Feedback", path: "/analytics/feedback" }
        ]
      },
      {
        action: "servers",
        title: "Servers",
        icon: "view_list",
        items: [{ title: "List", path: "/servers/list" }]
      },
      {
        action: "donations",
        title: "Donations",
        icon: "store",
        items: [
          { title: "Transactions", path: "/donations/transactions" },
          { title: "Packages", path: "/donations/packages" }
        ]
      },
      {
        action: "forum",
        title: "Forum",
        icon: "chat_bubble",
        items: [
          { title: "News", path: "/forum/news" },
          { title: "Sections", path: "/forum/sections" },
          { title: "Threads", path: "/forum/threads" },
          { title: "Actions", path: "/forum/actions" },
          { title: "Badges", path: "/forum/badges" }
        ]
      },
      {
        action: "punishments",
        title: "Punishments",
        icon: "gavel",
        items: [
          { title: "Offences", path: "/punishments/offences" },
          { title: "Actions", path: "/punishments/actions" },
          { title: "History", path: "/punishments/history" },
          { title: "Appeals", path: "/punishments/appeals" },
          { title: "Reports", path: "/punishments/reports" }
        ]
      },
      {
        action: "billing",
        title: "Billing",
        icon: "attach_money",
        items: [{ title: "Invoices", path: "/billing/invoices" }]
      },
      {
        action: "website",
        title: "Website",
        icon: "dvr",
        items: [
          { title: "Domain", path: "/website/domain" },
          { title: "Themes", path: "/website/themes" },
          { title: "Pages", path: "/website/pages" }
        ]
      }
    ]
  }),
  mounted() {
    if (localStorage.session) {
      var coreInstance = new core(JSON.parse(localStorage.session));
      this.session = coreInstance.getCoreSession();
      if (localStorage.network != null && localStorage.network != undefined) {
        this.selectedNetwork = localStorage.network;
      } else {
        this.getAvailableNetworks();
      }
    }

    if (
      this.$router.currentRoute == "/" ||
      this.$router.currentRoute == null ||
      this.$router.currentRoute == undefined
    ) {
      this.$router.replace({ path: "/summary/general" });
    }
  },
  watch: {
    session(newSession) {
      localStorage.session = JSON.stringify(newSession);
    },
    selectedNetwork(newNetwork) {
      localStorage.network = newNetwork;

      var mainObj = this;

      var coreInstance = new core(JSON.parse(localStorage.session));
      mainObj.selectedNetworkName = null;

      coreInstance
        .getInstance(newNetwork, null, "NTW")
        .update()
        .then(function(instance) {
          mainObj.selectedNetworkName = instance.getName();
        });
    },
    switchingNetworks(newValue) {
      if (newValue) {
        this.getAvailableNetworks();
      }
    }
  },
  methods: {
    disableNetworkSwitcher() {
      if (this.selectedNetwork != null && this.selectedNetwork != undefined) {
        this.switchingNetworks = false;
      }
    },
    getAvailableNetworks() {
      if (this.session != undefined && this.session != null) {
        var mainObj = this;

        this.session.getNetworks().then(function(networks) {
          mainObj.availableNetworks = networks;
        });
      }
    },
    GoogleLoginHandle() {
      this.loginLoading = true;
      var mainObj = this;

      this.$gAuth.signIn().then(GoogleUser => {
        new core()
          .fromToken(GoogleUser.getAuthResponse().id_token)
          .then(function(core) {
            // to-do save core session

            mainObj.loginLoading = false;
            mainObj.session = core.getCoreSession();

            mainObj.getAvailableNetworks();
          });
      });
    }
  }
};
</script>
