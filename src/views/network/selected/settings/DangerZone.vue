<template>
  <v-alert color="red" class="mb-2">
    You won't be able to recover any network data if you delete your network
  </v-alert>
  <v-expand-transition>
    <v-alert color="red" class="mb-2" v-show="error">
      {{ error }}
    </v-alert>
  </v-expand-transition>
  <v-btn :disabled="loading" @click="deleteNetwork" block color="red" variant="outlined">
    Delete Network
  </v-btn>
</template>

<script>
export default {
  props: ["network"],
  data() {
    return {
      loading: false,
      error: null,
    };
  },
  methods: {
    async deleteNetwork() {
      this.error = null;
      this.loading = true;
      try {
        await this.network.delete();
        this.$router.push("/");
      } catch (error) {
        this.error = error.message;
      }
      this.loading = false;
    },
  },
};
</script>
