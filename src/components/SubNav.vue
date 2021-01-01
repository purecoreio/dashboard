<template>
  <v-row no-gutters>
    <v-col
      v-if="this.show !== false"
      :class="$vuetify.breakpoint.mdAndUp ? 'pr-6' : ''"
      cols="12"
      sm="12"
      md="2"
    >
      <div v-if="!$vuetify.breakpoint.mdAndUp">
        <v-tabs
          @change="reroute()"
          style="border-radius: 4px"
          v-model="activeTab"
          class="mb-3"
          center-active
          grow
        >
          <v-tab disabled>
            {{ title }}
          </v-tab>
          <v-tab v-for="i in items" :key="i.link">{{ i.name }}</v-tab>
        </v-tabs>
      </div>
      <div
        v-if="items != null && $vuetify.breakpoint.mdAndUp"
        style="max-width: 170px; margin-left: auto"
      >
        <p
          class="text-overline"
          style="
            font-weight: 900;
            margin: 0px;
            margin-bottom: 9px;
            font-size: 14px !important;
          "
        >
          {{ title }}
        </p>
        <div>
          <router-link
            :to="item.link"
            v-for="(item, i) in items"
            :key="`it${i}`"
            :class="`text-overline ${
              $vuetify.theme.dark ? 'sideLinkDark' : 'sideLinkLight'
            }`"
            :data-active="true"
          >
            {{ item.name }}<plus v-if="'plus' in item" />
          </router-link>
        </div>
      </div>
    </v-col>
    <v-col cols="12" sm="12" :md="this.show === false ? '12' : '8'">
      <v-alert
        :value="plusReview && !$router.currentRoute.path.includes('/account/billing/')"
        transition="scale-transition"
        v-ripple
        style="cursor: pointer"
        @click="$router.push({ path: '/account/billing/' })"
        class="text-justify"
        color="yellow"
        icon="warning"
        text
      >
        Please, click here to review your subscription status. You might lose
        access to instances and services
      </v-alert>
      <trial
        :plus="plusStatus"
        :trial="trialStatus"
        v-if="show != false && 'plus' in this.items[activeTab - 1]"
      />
      <slot />
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: ["title", "items", "show"],
  name: "SubNav",
  data: () => {
    return {
      activeTab: 1,
      plusStatus: null,
      trialStatus: 0,
      plusReview: false,
    };
  },
  methods: {
    reroute() {
      const e = this.items[this.activeTab - 1];
      this.$router.push(e.link);
    },
  },
  mounted() {
    let to = this.$router.currentRoute;
    for (let i = 0; i < this.items.length; i++) {
      const e = this.items[i];
      if (e.link == to.path) {
        this.activeTab = i + 1;
      }
    }

    this.shown = false;
    this.context = this.$purecore.getContext();
    if (this.context.subscriptionStatus != null) {
      this.plusStatus = Number(this.context.subscriptionStatus.plus);
      this.trialStatus = Number(this.context.subscriptionStatus.usedTrial);
      this.plusReview = Boolean(this.context.subscriptionStatus.plusReview);
    } else {
      setInterval(() => {
        if (this.context.subscriptionStatus != null) {
          this.plusStatus = Number(this.context.subscriptionStatus.plus);
          this.trialStatus = Number(this.context.subscriptionStatus.usedTrial);
          this.plusReview = Boolean(this.context.subscriptionStatus.plusReview);
        }
      }, 100);
    }
  },
  watch: {
    $route(to) {
      for (let i = 0; i < this.items.length; i++) {
        const e = this.items[i];
        if (e.link == to.path) {
          this.activeTab = i + 1;
        }
      }
    },
  },
};
</script>
<style lang="css" scoped >
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