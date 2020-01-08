<template>
  <div>
    <v-snackbar v-model="snackbar">Cover by EchoNotGecko</v-snackbar>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <div>
      <h1>Development Team</h1>
      <v-divider style="margin-top: 10px; margin-bottom: 10px;" />
      <v-card
        style="margin-bottom: 8px"
        v-for="item in developers"
        :key="item.name"
        class="mx-auto"
        outlined
      >
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline">
              {{item.name}}
              <v-btn @click="playSound()" v-if="item.playsound" icon small>
                <v-icon>mdi-play</v-icon>
              </v-btn>
            </v-list-item-title>
            <v-list-item-subtitle>{{item.description}}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-avatar size="80">
            <v-img :src="item.icon"></v-img>
          </v-list-item-avatar>
        </v-list-item>
      </v-card>
      <h1 style="margin-top: 40px">Open Source Libs And Providers</h1>
      <v-divider style="margin-top: 10px; margin-bottom: 10px;" />
      <v-card
        style="margin-bottom: 8px"
        v-for="item in items"
        :key="item.name"
        class="mx-auto"
        outlined
      >
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline">{{item.name}}</v-list-item-title>
            <v-list-item-subtitle>{{item.description}}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-avatar tile size="80">
            <v-img contain :src="item.icon"></v-img>
          </v-list-item-avatar>
        </v-list-item>
      </v-card>
    </div>
  </div>
</template>


<script>
import core from "purecore";
import confetti from "canvas-confetti";

export default {
  name: "AboutSite",
  data: () => ({
    snackbar: false,
    session: null,
    machines: [],
    location: [
      {
        text: "About",
        disabled: true,
        href: ""
      }
    ],
    developers: [
      {
        name: "quiquelhappy",
        playsound: true,
        description: "Lead Developer",
        icon: "https://i.imgur.com/tXdSztS.png"
      }
    ],
    items: [
      {
        name: "Vue.js",
        description: "Webapp framework",
        icon: "https://purecore.io/assets/vue.svg"
      },
      {
        name: "Vuetify",
        description: "Design framework",
        icon: "https://purecore.io/assets/vuetify.svg"
      },
      {
        name: "Node.js",
        description: "User interface and socket handling",
        icon: "https://purecore.io/assets/nodejs.svg"
      },
      {
        name: "Socket.io",
        description: "Socket managment",
        icon: "https://purecore.io/assets/socket-io.svg"
      },
      {
        name: "Stripe",
        description: "Payment processor, has a really sexy api",
        icon: "https://purecore.io/assets/stripe.svg"
      },
      {
        name: "PayPal",
        description: "Payment processor, doesn't have a sexy api",
        icon: "https://purecore.io/assets/paypal.svg"
      },
      {
        name: "Google Cloud",
        description: "Fast content delivery for our CMS",
        icon: "https://purecore.io/assets/cloud.png"
      },
      {
        name: "Hetzner",
        description: "Amazing machine provider",
        icon: "https://purecore.io/assets/hetzner.png"
      }
    ],
    dialog: false,
    e1: 1,
    network: null,
    audio: null
  }),
  methods: {
    playSound() {
      var sound = "https://purecore.io/assets/stal.mp3";
      if (sound) {
        if (this.audio == null) {
          setInterval(() => {
            confetti({
              startVelocity: 20,
              spread: 700,
              ticks: 70,
              shapes: ["square"],
              origin: {
                x: Math.random(),
                // since they fall down, start a bit higher than random
                y: Math.random() - 0.2
              }
            });
          }, 600);
          this.snackbar = true;
          var audio = new Audio(sound);
          this.audio = audio;
          audio.play();
          this.expand = true;
          setTimeout(() => {
            this.snackbar = false;
          }, 3000);
        }
      }
    }
  },
  mounted() {
    if (localStorage.session && localStorage.network) {
      var coreInstance = new core(JSON.parse(localStorage.session));
      this.session = coreInstance.getCoreSession();
      /*var mainObj = this;
      var owner = coreInstance.getCoreSession().getOwner();*/
    }
  }
};
</script>
