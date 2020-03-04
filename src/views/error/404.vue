<template>
  <v-container>
    <center>
      <h1 style="margin-bottom: 25px">404</h1>
      <iframe
        style="max-width: 400px; max-height: 400px; width: 100%; height: 400px; border-radius: 10px;"
        src="https://www.youtube-nocookie.com/embed/rFpAiExWvSQ?controls=0&autoplay=1"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </center>
    <div style="max-width: 400px; margin: auto">
      <v-progress-linear rounded :value="value" />
    </div>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    value: 0
  }),
  mounted() {
    this.$emit("setDrawer", false);
    var interval = setInterval(() => {
      this.value += 0.7;
      if (this.value > 100) {
        this.$router.push({ path: "/" });
        clearInterval(interval);
      }
    }, 100);
  }
};
</script>