<template>
  <v-card
    class="pa-6 backgroundGradient pt-10"
    style="padding-bottom:50px!important;padding-top:50px!important"
  >
    <v-row align="center">
      <v-col v-if="$vuetify.breakpoint.mdAndUp" class="flex-grow-0 flex-shrink-1">
        <v-img v-if="!$vuetify.theme.dark" width="150px" src="@/assets/oem/rizentextblack.svg" />
        <v-img v-if="$vuetify.theme.dark" width="150px" src="@/assets/oem/rizentext.svg" />
      </v-col>
      <v-col class="flex-grow-1 flex-shrink-0">
        <h2 v-if="showsmalltext">
          High performance
          <span class="textGradient">dedicated</span> cores
        </h2>
        <h4 v-if="showsmalltext" style="opacity:0.5">As cheap as low performance shared cores</h4>
      </v-col>
    </v-row>
  </v-card>
</template>
<style lang="css" scoped>
.backgroundGradient {
  background: linear-gradient(
    90deg,
    rgba(87, 160, 255, 0.2) 0%,
    rgba(87, 160, 255, 0) 39%
  );
}
.textGradient {
  text-align: center;

  background: linear-gradient(
    60deg,
    #b0ceff 20%,
    #4a98ff 40%,
    #4a98ff 60%,
    #b0ceff 80%
  );
  background-size: 200% auto;

  color: #000;
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  animation: shine 2s linear infinite;
}
@keyframes shine {
  to {
    background-position: 200% center;
  }
}
</style>
<script>
export default {
  props: ["showsmalltext"],
};
</script>