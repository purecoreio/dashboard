<template>
  <router-link class="back-arrow" :to="path">
    <v-icon icon="mdi-keyboard-backspace" />
  </router-link>
</template>
<style scoped>
.back-arrow {
  transition: 100ms;
  color: gray;
  text-decoration: none;
}
.back-arrow:hover{
  color: rgb(219, 219, 219);
}
.back-arrow:active{
  color: white;
}
</style>
<script>
export default {
  props: ["path"],
};
</script>
