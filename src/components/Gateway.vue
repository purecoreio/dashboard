<template>
  <v-card class="mb-5" style="overflow:hidden" outlined>
    <div :style="this.name == 'mollie' ? 'filter:blur(8px)' : ''">
      <div style="width: 200px">
        <center>
          <v-img height="100px" contain width="150px" :src="logo" />
        </center>
      </div>
      <div
        class="pt-2 pb-2"
        outlined
        :style="`position:relative; overflow:hidden; ${
          $vuetify.theme.dark
            ? 'background-color: rgba(0, 0, 0, 0.5)'
            : 'background-color: rgba(0, 0, 0, 0.02)'
        };`"
      >
        <vue-marquee
          :duration="200000"
          :showProgress="false"
          style="height: 50px; overflow: hidden"
        >
          <div v-for="i in 2" :key="i">
            <vue-marquee-slide v-for="item in cards" :key="item.name">
              <v-img
                width="100px"
                height="50px"
                contain
                style="
                  display: inline-block;
                  margin-right: 5px;
                  margin-left: 5px;
                "
                :src="
                  require(`@/assets/gateways/${String(
                    name
                  ).toLowerCase()}/method/card/${
                    'variant' in item
                      ? item.name + ($vuetify.theme.dark ? '_dark' : '_light')
                      : item.name
                  }.svg`)
                "
              />
            </vue-marquee-slide>
          </div>
        </vue-marquee>
        <div
          :class="`${$vuetify.theme.dark ? 'leftFadeDark' : 'leftFade'}`"
        ></div>
        <div
          :class="`${$vuetify.theme.dark ? 'rightFadeDark' : 'rightFade'}`"
        ></div>
      </div>
      <v-alert
        transition="slide-y-transition"
        :value="attention"
        class="mb-0"
        tile
        text
        color="warning"
      >
        Required actions, please,
        <a target="_blank" class="warning--text" :href="url">click here</a>
        to go to your {{ name }} control panel
      </v-alert>
      <v-divider />
      <div
        class="pa-5"
        :style="`${
          $vuetify.theme.dark
            ? 'background-color: rgba(0, 0, 0, 0.3)'
            : 'background-color: rgba(0, 0, 0, 0.02)'
        };`"
      >
        <v-list-item>
          <v-list-item-icon>
            <v-icon>power</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Connected </v-list-item-title>
            <v-list-item-subtitle v-if="connected">
              You already connected {{ name }}
            </v-list-item-subtitle>
            <v-list-item-subtitle v-if="!connected">
              {{ name }} is <strong>not</strong> connected
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn text v-if="connected"> Disconnect </v-btn>
            <v-btn text v-if="!connected"> Connect </v-btn>
          </v-list-item-action>
        </v-list-item>
      </div>
    </div>
    <div
      v-if="this.name == 'mollie'"
      style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%"
    >
      <v-container fill-height fluid>
        <v-row align="center" justify="center">
          <v-col>
            <center>
              <v-img contain width="150px" :src="logo" />
              <h4>Coming Soon</h4>
              <h5 style="max-width:300px; margin-top:10px" class="gray--text">
                Supporing Paysafecard, among others. Please, support us with a
                purecore plus subscription, we really need it in order to
                implement this gateway!
              </h5>
            </center>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-card>
</template>

<style lang="css" scoped>
.leftFade {
  position: absolute;
  width: 80px;
  left: 0px;
  top: 0px;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 1) 20%,
    rgba(255, 255, 255, 0) 100%
  ) !important;
}
.leftFadeDark {
  position: absolute;
  width: 80px;
  left: 0px;
  top: 0px;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 1) 20%,
    rgba(0, 0, 0, 0) 100%
  ) !important;
}
.rightFade {
  position: absolute;
  width: 80px;
  right: 0px;
  top: 0px;
  height: 100%;
  background: linear-gradient(
    -90deg,
    rgba(255, 255, 255, 1) 20%,
    rgba(255, 255, 255, 0) 100%
  ) !important;
}
.rightFadeDark {
  position: absolute;
  width: 80px;
  right: 0px;
  top: 0px;
  height: 100%;
  background: linear-gradient(
    -90deg,
    rgba(0, 0, 0, 1) 20%,
    rgba(0, 0, 0, 0) 100%
  ) !important;
}
</style>

<script>
//require(`@/assets/gateways/paypal/logo.svg`)
import { Marquee, Slide } from "vue-marquee-component";
export default {
  components: {
    VueMarquee: Marquee,
    VueMarqueeSlide: Slide,
  },
  props: ["logo", "name", "connected", "attention", "url", "cards"],
};
</script>