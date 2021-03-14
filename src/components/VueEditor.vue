<template>
  <div>
    <v-card class="pb-0" outlined>
      <v-tabs v-model="tab">
        <v-tab v-for="(item, i) in items" :key="i">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item :key="0">
            To Be Implemented
        </v-tab-item>
        <v-tab-item :key="1">
          <div class="pl-6 pt-6 pb-6" :style="$vuetify.theme.dark ? 'background-color:rgba(0,0,0,0.4)':'background-color:rgba(0,0,0,0.02)'">
            <vue-child :node="this.nodes.childNodes" />
          </div>
        </v-tab-item>
        <v-tab-item :key="2">
          <v-card flat>
            <v-card-text> To Be Implemented </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>
<script>
import { parse } from "node-html-parser";
import vueChild from "./VueChild.vue";

export default {
  components: { vueChild },
  props: ["src"],
  data: () => {
    return {
      tab: 0,
      items: ["Text Only", "All Tags / Tree View", "Code"],
      nodes: {},
    };
  },
  mounted() {
    this.nodes = parse(this.src);
    console.log(this.nodes);
  },
};
</script>