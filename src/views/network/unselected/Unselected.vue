<template>
  <v-main>
    <router-container>
      <router-view />
    </router-container>
  </v-main>
</template>

<script>
import RouterContainer from "@/components/container/RouterContainer.vue";
export default {
  components: {
    RouterContainer,
  },
};
</script>
