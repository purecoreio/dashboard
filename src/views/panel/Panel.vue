<template>
  <div>
    <v-navigation-drawer
      v-model="drawer.model"
      clipped
      :permanent="$vuetify.breakpoint.mdAndUp"
      :expand-on-hover="$vuetify.breakpoint.mdAndUp"
      app
    >
      <v-list-item style="height: 120px">
        <v-list-item-content
          fill-height
          justify="center"
          align="center"
          v-if="selectedNetwork != null && selectedNetworkName != null"
        >
          <center>
            <v-list-item-title class="title">{{
              selectedNetworkName
            }}</v-list-item-title>
            <v-list-item-subtitle>{{ selectedNetwork }}</v-list-item-subtitle>
          </center>
        </v-list-item-content>
        <v-list-item-content
          fill-height
          justify="center"
          align="center"
          v-if="selectedNetwork == null || selectedNetworkName == null"
        >
          <center>
            <v-list-item-title class="title">
              <v-skeleton-loader
                class="mx-auto"
                type="text"
              ></v-skeleton-loader>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-skeleton-loader
                class="mx-auto"
                type="text"
              ></v-skeleton-loader>
            </v-list-item-subtitle>
          </center>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list shaped>
        <v-list-group
          v-for="item in drawer.items"
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

          <v-list-item
            link
            :to="subItem.path"
            v-for="subItem in item.items"
            :key="subItem.title"
          >
            <v-list-item-content>
              <v-list-item-title v-text="subItem.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <transition
      mode="out-in"
      @beforeLeave="beforeLeave"
      @enter="enter"
      @afterEnter="afterEnter"
      name="fade"
    >
      <router-view @changeNetwork="selectNetwork" />
    </transition>
  </div>
</template>

<script>
import core from "purecore";
export default {
  name: "Panel",
  data: () => ({
    prevHeight: 0,
    dark: false,
    selectedNetwork: null,
    selectedNetworkName: null,
    drawer: {
      model: null,
      items: [
        {
          action: "analytics",
          title: "Analytics",
          icon: "bar_chart",
          items: [
            { title: "Growth", path: "/analytics/growth" },
            { title: "Voting Sites", path: "/analytics/voting" },
            { title: "Revenue", path: "/analytics/revenue" },
          ],
        },
        {
          action: "players",
          title: "Players",
          icon: "supervisor_account",
          items: [{ title: "Lookup", path: "/players/lookup" }],
        },
        {
          action: "servers",
          title: "Servers",
          icon: "view_list",
          items: [{ title: "List", path: "/servers/list" }],
        },
        {
          action: "donations",
          title: "Donations",
          icon: "store",
          items: [
            { title: "Transactions", path: "/donations/transactions" },
            { title: "Packages", path: "/donations/packages" },
            { title: "Gateways", path: "/donations/gateways" },
          ],
        },
        {
          action: "community",
          title: "Community",
          icon: "chat_bubble",
          items: [
            { title: "Discord", path: "/community/discord" },
            { title: "News", path: "/community/news" },
            { title: "Forum", path: "/community/forum" },
          ],
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
            { title: "Reports", path: "/punishments/reports" },
          ],
        },
        {
          action: "website",
          title: "Website",
          icon: "dvr",
          items: [
            { title: "Domain", path: "/website/domain" },
            { title: "Themes", path: "/website/themes" },
            { title: "Pages", path: "/website/pages" },
          ],
        },
        {
          action: "settings",
          title: "Settings",
          icon: "settings",
          items: [{ title: "Danger Zone", path: "/settings/dangerZone" }],
        },
      ],
    },
  }),
  mounted() {
    this.$emit("setDrawer", true);
    if (localStorage.getItem("dark", null) != null) {
      var info = localStorage.getItem("dark") == "true";
      if (info) {
        this.dark = true;
      } else {
        this.dark = false;
      }
    }

    if (
      this.$router.currentRoute == "/" ||
      this.$router.currentRoute == null ||
      this.$router.currentRoute == undefined
    ) {
      this.$router.replace({ path: "/summary/general" });
    }
    this.selectedNetwork = localStorage.getItem("network");
  },
  watch: {
    selectedNetwork(newNetwork) {
      try {
        localStorage.network = newNetwork;
        var mainObj = this;
        var coreInstance = new core(JSON.parse(localStorage.session));
        mainObj.selectedNetworkName = null;

        coreInstance
          .getInstance(newNetwork, null, "NTW")
          .update()
          .then(function(instance) {
            mainObj.selectedNetworkName = instance.getName();
          })
          .catch(function(err) {
            alert(err.message);
          });
      } catch (error) {
        setTimeout(() => {
          mainObj.selectedNetwork = localStorage.network;
        }, 100);
      }
    },
    dark: function() {
      if (this.dark) {
        this.$vuetify.theme.dark = true;
        localStorage.setItem("dark", true);
      } else {
        this.$vuetify.theme.dark = false;
        localStorage.setItem("dark", false);
      }
    },
  },
  methods: {
    selectNetwork: function() {
      this.$emit("selectNetwork");
    },
    openDrawer: function() {
      this.drawer.model = true;
    },
    beforeLeave(element) {
      this.prevHeight = getComputedStyle(element).height;
    },
    enter(element) {
      const { height } = getComputedStyle(element);

      element.style.height = this.prevHeight;

      setTimeout(() => {
        element.style.height = height;
      });
    },
    afterEnter(element) {
      element.style.height = "auto";
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
