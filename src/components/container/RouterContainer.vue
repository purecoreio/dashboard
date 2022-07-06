<template>
  <div :class="`d-flex justify-center ${this.$vuetify.display.mobile ? 'mt-4' : 'mt-5'}`">
    <div class="d-none d-lg-flex sidePanel pl-7">
      <v-slide-x-transition style="transition: 100ms">
        <div v-show="this.hasItems > 0">
          <p class="text-overline" style="
              font-weight: 900;
              margin-top: 1px;
              margin-bottom: 9px;
              font-size: 14px !important;
            ">
            {{ title }}
          </p>
          <div>
            <router-link :to="item.link" v-for="(item, i) in items" :key="`it${i}`" :class="`text-overline ${$vuetify.theme.current.dark ? 'sideLinkDark' : 'sideLinkLight'
            }`" :data-active="true">
              {{ item.name }}
              <v-icon v-if="item.beta" icon="mdi-flask-outline" />
            </router-link>
          </div>
          <back-arrow v-if="isChild" />
        </div>
      </v-slide-x-transition>
    </div>
    <div :class="`flex-grow-1 ${this.$vuetify.display.mobile ? 'px-3' : 'px-15'} mb-6`"
      style="max-width: 1000px; padding-top: 3px">
      <slot />
    </div>
    <div class="d-none d-lg-flex sidePanel" />
  </div>
</template>
<script>
import BackArrow from "@/components/buttons/BackArrow.vue";
export default {
  name: "SubNav",
  components: {
    BackArrow,
  },
  data: () => {
    return {
      activeTab: 1,
      title: null,
      hasItems: false,
      items: [],
      isChild: false,
    };
  },
  mounted() {
    this.updateLinks();
  },
  methods: {
    updateLinks() {
      const route = this.$route;
      this.isChild = route.path.split("/").filter((e) => e.length > 0).length >= 5;
      const matched = route.matched;
      if (matched.length > 1) {
        const penultimate = matched[matched.length - 2];
        const path = penultimate.path.split("/").filter((v) => v != "")
        if (
          path.length >= 2 &&
          penultimate.children
        ) {
          this.items = penultimate.children
            .filter((path) => !path.meta?.hidden)
            .map((path) => {
              return {
                name: path.name ?? path.path,
                link: path.path,
                beta: path.meta && path.meta.beta,
              };
            });
          if (this.items.length > 0) this.hasItems = true;
          this.title =
            penultimate.name ?? penultimate.path.split("/").findLast(() => true);
          return;
        }
      }
      this.hasItems = false;
    },
  },
  watch: {
    $route() {
      this.updateLinks();
    },
  },
};
</script>
<style lang="css" scoped>
.sidePanel {
  width: 25%;
  max-width: 170px;
}

.sideLinkLight {
  font-weight: bold;
  margin-bottom: 4px;
  opacity: 0.6;
  transition: 200ms;
  cursor: pointer;
  display: block;
  text-decoration: none;
  color: black;
}

.sideLinkDark {
  font-weight: bold;
  margin-bottom: 4px;
  opacity: 0.6;
  transition: 200ms;
  cursor: pointer;
  display: block;
  text-decoration: none;
  color: white;
}

.sideLinkLight .v-icon {
  margin-left: 2px;
  color: inherit !important;
  transform: translateY(-2px);
}

.sideLinkDark .v-icon {
  margin-left: 2px;
  color: inherit !important;
  transform: translateY(-2px);
}

.sideLinkLight:hover {
  color: #82b1ff;
  opacity: 0.9;
}

.sideLinkDark:hover {
  color: #82b1ff;
  opacity: 0.9;
}

.sideLinkLight:active {
  color: #82b1ff;
  opacity: 1;
}

.sideLinkDark:active {
  color: #82b1ff;
  opacity: 1;
}

.router-link-exact-active {
  color: #82b1ff !important;
  opacity: 1;
}

.router-link-exact-active {
  color: #82b1ff !important;
  opacity: 1;
}
</style>
