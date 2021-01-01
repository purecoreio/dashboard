<template>
  <v-card
    style="
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 60px;
    "
  >
    <v-snackbar v-model="snackbar">
      {{ text }}
    </v-snackbar>
    <div class="pt-5 pb-5">
      <div class="d-flex align-center logoWhole justify-center">
        <v-img
          alt="purecore.io logo"
          class="logoAnimation mr-4"
          contain
          src="@/assets/c.png"
          max-width="40"
          scale-transition
        />
        <span
          class="logoText mr-3"
          style="font-size: 30px; padding-bottom: 5px"
        >
          purecore
          <v-chip color="primary" small class="betaChip"> BETA </v-chip>
        </span>
      </div>
    </div>
    <v-divider />
    <v-sheet
      style="max-width: 400px; margin-left: auto; margin-right: auto"
      class="pl-2 pr-2 pt-4 pb-2"
    >
      <div class="mt-8" v-if="this.$vuetify.breakpoint.mdAndUp"></div>
      <v-btn
        v-for="oauth in oauths"
        :key="oauth.name"
        class="mb-2"
        block
        large
        depressed
        @click="handleLogin(oauth.loginName)"
      >
        <v-row align="center" justify="center" no-gutters>
          <v-col class="flex-grow-0 flex-shrink-1">
            <v-avatar size="20px" class="mr-3">
              <v-img
                :src="
                  require(`@/assets/oauth/${String(
                    oauth.name
                  ).toLowerCase()}.svg`)
                "
              />
            </v-avatar>
          </v-col>
          <v-col class="flex-grow-0 flex-shrink-1 text-center">
            <p style="width: 160px" class="ma-0">
              LOGIN WITH {{ String(oauth.displayName).toUpperCase() }}
            </p>
          </v-col>
        </v-row>
      </v-btn>
      <div class="mt-10" v-if="this.$vuetify.breakpoint.mdAndUp"></div>
    </v-sheet>
    <v-sheet class="pa-3" style="background-color: rgba(0, 0, 0, 0.1)">
      <center>By logging in, you accept our TOS and privacy policy</center>
    </v-sheet>
  </v-card>
</template>
<script>
export default {
  methods: {
    handleLogin(method) {
      this.$loginManager
        .login(method)
        .then(() => {
          this.$router.push({ path: "/select/" });
        })
        .catch((err) => {
          this.text = err.message;
          this.snackbar = true;
        });
    },
  },
  mounted() {
    if (this.$loginManager.loggedIn) {
      this.$router.push({ path: "/select/" });
    }
  },
  data: () => {
    return {
      snackbar: false,
      text: "",
      msalInstance: null,
      oauths: [
        {
          name: "google",
          loginName: "google",
          displayName: "Google",
        },
        {
          name: "discord",
          loginName: "discord",
          displayName: "Discord",
        },
        {
          name: "steam",
          loginName: "steam",
          displayName: "steam",
        },
        {
          name: "xbox",
          loginName: "microsoft",
          displayName: "Xbox",
        },
      ],
      msalConfig: {
        auth: {
          clientId: "19b652b9-4426-48b0-878c-e6d93f2515b4",
          redirectUri: "https://purecore.io/",
        },
      },
    };
  },
};
</script>