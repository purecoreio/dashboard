<template>
  <div>
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
    session: null
  }),
  mounted() {
    this.$emit("setDrawer", false);
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