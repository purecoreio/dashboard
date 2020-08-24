<template>
  <div>
    <HostingHeader :showsmalltext="true" />
    <v-row align="center">
      <v-col class="flex-grow-1 flex-shrink-0">
        <v-chip-group v-model="region" mandatory active-class="primary--text">
          <v-chip :disabled="availability==null" v-for="tag in regionalTags" :key="tag">{{ tag }}</v-chip>
        </v-chip-group>
      </v-col>
      <v-col class="flex-grow-0 flex-shrink-1">
        <v-switch
          :disabled="(!nocompare != compare)||availability==null"
          label="compare"
          @change="comparepricing()"
        ></v-switch>
      </v-col>
    </v-row>
    <v-alert
      :value="region!=0"
      transition="scale-transition"
      text
      color="primary"
    >We are planning on releasing our hosting services outside Europe, please, follow us on social media to keep yourself posted!</v-alert>
    <v-alert
      :value="compare"
      transition="scale-transition"
      text
      color="primary"
    >We are not afraid of showing our competitors, because we know we are better</v-alert>
    <v-row v-if="availability!=null">
      <v-col
        v-for="available in availability"
        :key="available.template.uuid"
        cols="12"
        md="4"
        xl="3"
      >
        <HostingCard
          :available="available"
          :price="price"
          :nocompare="nocompare"
          :compare="compare"
        />
      </v-col>
    </v-row>
    <v-row v-if="availability==null">
      <v-col v-for="i in 9" :key="i" cols="12" md="4" xl="3">
        <v-skeleton-loader type="image" />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import core from "purecore";
import HostingCard from "@/components/Hosting/HostingCard";
import HostingHeader from "@/components/Hosting/HostingHeader";
export default {
  components: {
    HostingCard,
    HostingHeader,
  },
  methods: {
    comparepricing() {
      if (this.compare) {
        this.compare = false;
        setTimeout(() => {
          this.nocompare = true;
        }, 250);
      } else {
        this.nocompare = false;
        setTimeout(() => {
          this.compare = true;
        }, 250);
      }
    },
    getAvailability() {
      let main = this;
      main.availability = null;
      this.core
        .getHostingManager()
        .getRecommended([this.region == 0 ? "DE" : "CA"])
        .then((available) => {
          main.availability = available;
        });
    },
  },
  mounted() {
    this.core = new core(JSON.parse(localStorage.getItem("session")));
    this.getAvailability();
  },
  watch: {
    region() {
      this.getAvailability();
    },
  },
  data: () => {
    return {
      core: null,
      nocompare: true,
      compare: false,
      price: null,
      region: 0,
      availability: null,
      regionalTags: ["Europe", "North America"],
    };
  },
};
</script>