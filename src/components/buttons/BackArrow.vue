<template>
  <div style="display: inline-block">
    <a @click="clicked" class="back-arrow">
      <v-icon icon="mdi-keyboard-backspace" />
    </a>
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
  emits: ["clicked"],
  methods: {
    clicked() {
      this.$emit("clicked");
      this.$router.back()
    },
  },
};
</script>
