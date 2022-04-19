<template>
  <v-row align="center" justify="center">
    <v-col cols="11" sm="6" md="4" lg="3" xl="2">
      <div class="text-center mb-3">
        <animated-logo />
      </div>
      <v-sheet>
        <v-card-content>
          <v-btn
            @click="handleLogin(method.name ?? method)"
            class="mb-2"
            v-for="(method, i) in methods.primary"
            :key="i"
            :rounded="0"
            size="large"
            color="black"
            :prepend-icon="`mdi-${method.icon ?? method.toLowerCase()}`"
            block
            flat
          >
            {{ method.name ?? method }}
          </v-btn>
          <v-divider class="mb-3 mt-3" />
          <v-row no-gutters>
            <v-col
              class="text-center"
              v-for="(method, i) in methods.secondary"
              :key="i"
            >
              <v-btn
                @click="handleLogin(method.name ?? method)"
                size="small"
                color="black"
                flat
                icon
              >
                <v-icon size="small"
                  >mdi-{{ method.icon ?? method.toLowerCase() }}</v-icon
                >
              </v-btn>
            </v-col>
          </v-row>
        </v-card-content>
      </v-sheet>

      <div class="mt-3 text-center">
        <small
          >By logging in, you are agreeing to our TOS and Privacy Policy</small
        >
      </div>
    </v-col>
  </v-row>
</template>

<script>
import absorber from "@/assets/particles/absorber.json";
import AnimatedLogo from "@/components/logo/AnimatedLogo.vue";
import { loadFull } from "tsparticles";

export default {
  components: {
    AnimatedLogo,
  },
  data() {
    return {
      methods: {
        primary: ["Microsoft", "Google", "GitHub"],
        secondary: [
          "steam",
          "discord",
          {
            name: "xbox",
            icon: "microsoft-xbox",
          },
          "minecraft",
        ],
      },
      particles: null,
      particlesInit: async (engine) => {
        await loadFull(engine);
      },
    };
  },
  mounted() {
    this.particles = absorber;
  },
  methods: {
    handleLogin(method){
      this.purecore.login(method)
    }
  }
};
</script>