<template>
  <div style="display: inline-block">
    <router-link v-if="to" class="back-arrow" :to="to">
      <v-icon icon="mdi-keyboard-backspace" />
    </router-link>
    <a v-if="!to" @click="clicked" class="back-arrow"
      ><v-icon icon="mdi-keyboard-backspace"
    /></a>
  </div>
</template>
<style scoped>
.back-arrow {
  transition: 100ms;
  color: gray;
  text-decoration: none;
}
.back-arrow:hover {
  color: rgb(219, 219, 219);
}
.back-arrow:active {
  color: white;
}
</style>
<script>
export default {
  props: ["to"],
  methods: {
    clicked() {
      this.$emit("clicked");
    },
  },
};
</script>
