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
        <v-list-item-content fill-height justify="center" align="center" v-if="session!=null">
          <center>
            <v-list-item-title class="title">{{ session.owner.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ session.owner.email }}</v-list-item-subtitle>
          </center>
        </v-list-item-content>
        <v-list-item-content fill-height justify="center" align="center" v-if="session==null">
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

          <v-list-item link :to="subItem.path" v-for="subItem in item.items" :key="subItem.title">
            <v-list-item-content>
              <v-list-item-title v-text="subItem.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn style="overflow: hidden" to="/" depressed outlined color="primary" large block>
            <v-icon left>keyboard_backspace</v-icon>back to the panel
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-alert class="white--text" color="primary">
      <v-row align="center" no-gutters>
        <v-col cols="8">
          <h4>Wrong place?</h4>
          <p style="margin-bottom: 0px">go back to the panel by clicking here</p>
        </v-col>
        <v-col align="right">
          <v-btn :fab="!$vuetify.breakpoint.mdAndUp" to="/" depressed color="primary">
            <v-icon style="color: white" :left="$vuetify.breakpoint.mdAndUp">keyboard_backspace</v-icon>
            <span v-if="$vuetify.breakpoint.mdAndUp">go back to the panel</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-alert>
    <transition
      mode="out-in"
      @beforeLeave="beforeLeave"
      @enter="enter"
      @afterEnter="afterEnter"
      name="fade"
    >
      <router-view />
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
    session: null,
    drawer: {
      model: null,
      items: [
        {
          action: "settings",
          title: "Settings",
          icon: "settings",
          active: true,
          items: [
            {
              title: "Notifications",
              path: "/account/notifications"
            },
            {
              title: "Theme",
              path: "/account/theme"
            },
            {
              title: "Session",
              path: "/account/session"
            }
          ]
        },
        {
          action: "billing",
          title: "Billing",
          icon: "attach_money",
          items: [
            { title: "Invoices", path: "/account/invoices" },
            { title: "Plan & Services", path: "/account/plan" }
          ]
        },
        {
          action: "supervisor",
          title: "Supervisor",
          icon: "remove_red_eye",
          items: [{ title: "Machines", path: "/account/machines" }]
        }
      ]
    }
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
    try {
      this.session = JSON.parse(localStorage.getItem("session"));
    } catch (error) {
      // ignore
    }
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
          .catch(function() {});
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
    }
  },
  methods: {
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
    }
  }
};
</script>


<style>
@import url("https://fonts.googleapis.com/css?family=Barlow&display=swap");
* {
  font-family: "Barlow", sans-serif;
}
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