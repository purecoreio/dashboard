<template>
  <div>
    <div v-for="(subNode, i) in node" :key="i">
      <div
        v-if="subNode.nodeType != 3"
        class="codeLine pa-3 pl-7 mb-3"
        :style="`border-color:${getColor()}`"
      >
        <p class="overline mb-2">
          {{ subNode.rawTagName }}
          <v-chip
            style="transform: translateY(-2px)"
            class="mr-2"
            small
            color="primary"
            v-for="(attr, key) in subNode.attributes"
            :key="attr"
          >
            {{ key }}
            <span v-if="attr != null && attr != ''"> : {{ attr }} </span>
          </v-chip>
        </p>
        <div v-if="subNode.childNodes != null">
          <div v-if="subNode.childNodes.length > 0">
            <div v-for="(childNode, i) in subNode.childNodes" :key="i">
              <vue-child :node="[childNode]" />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="subNode.nodeType == 3 && !subNode.isWhitespace"
        outlined
        class="pa-3 mb-3"
      >
        <v-text-field solo-inverted hide-details :value="subNode.text">
        </v-text-field>
      </div>
    </div>
  </div>
</template>
<style lang="css" scoped>
.codeLine {
  border-left-width: 1px;
  border-left-style: solid;
}
</style>
<script>
export default {
  props: ["node"],
  name: "VueChild",
  methods: {
    getColor() {
      if (this.$vuetify.theme.dark) {
        return (
          "hsl(" +
          360 * Math.random() +
          "," +
          (25 + 70 * Math.random()) +
          "%," +
          (85 + 10 * Math.random()) +
          "%)"
        );
      } else {
        var letters = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
    },
  },
};
</script>