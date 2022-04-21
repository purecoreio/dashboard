<template>
  <div class="d-flex justify-center mt-5">
    <div class="sidePanel">
      <div v-if="hasLinks">
        <p
          class="text-overline"
          style="
            font-weight: 900;
            margin-top: 1px;
            margin-bottom: 9px;
            font-size: 14px !important;
          "
        >
          {{ $route.name }}
        </p>
        <div>
          <router-link
            :to="item.link"
            v-for="(item, i) in items"
            :key="`it${i}`"
            :class="`text-overline ${
              $vuetify.theme.current ? 'sideLinkDark' : 'sideLinkLight'
            }`"
            :data-active="true"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="pt-1 flex-grow-1 px-4" style="max-width: 1000px">
      <slot />
    </div>
    <div class="sidePanel" />
  </div>
</template>
<script>
export default {
  props: ["title", "show"],
  name: "SubNav",
  data: () => {
    return {
      activeTab: 1,
      items: [],
    };
  },
  computed: {
    hasLinks() {
      return this.items.length > 0;
    },
  },
};
</script>
<style lang="css" scoped>
.sidePanel {
  width: 200px;
}
.sideLinkLight {
  margin-bottom: 4px;
  opacity: 0.6;
  transition: 200ms;
  cursor: pointer;
  display: block;
  text-decoration: none;
  color: black;
}
.sideLinkDark {
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
  transform: translateY(-1.5px);
}
.sideLinkDark .v-icon {
  margin-left: 2px;
  color: inherit !important;
  transform: translateY(-1.5px);
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
  font-weight: bold;
}
.router-link-exact-active {
  color: #82b1ff !important;
  opacity: 1;
  font-weight: bold;
}
</style>
