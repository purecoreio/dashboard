<template>
  <v-app>
    <v-app-bar
      :model-value="!isLogin"
      class="pl-0"
      app
      border="b"
      flat
    >
      <div class="text-center" style="width: 256px">
        <h2 style="font-weight: 500">
          purecore
          <v-chip color="primary" small class="betaChip"> BETA </v-chip>
        </h2>
      </div>
      <v-spacer />
      <v-chip class="mr-2"> Standard Plan </v-chip>
      <v-btn :color="null" icon @click="this.logout()">
        <v-icon icon="mdi-logout-variant" />
      </v-btn>
    </v-app-bar>

    <router-view
      v-if="isLogin || (this.credentials.authenticated && this.context.user)"
    />
  </v-app>
</template>

<style>
* {
  font-family: "Barlow", sans-serif !important;
}

a {
  color: #82b1ff;
}

.wizardTitle {
  font-weight: 500;
}

.v-ripple__container {
  opacity: 0;
}

button {
  text-transform: none !important;
}

button:active {
  transition: 200ms;
  box-shadow: 0 0 0 0.2rem rgba(68, 138, 255, 0.5) !important;
}

button.text-red:active {
  transition: 200ms;
  box-shadow: 0 0 0 0.2rem rgba(255, 68, 68, 0.5) !important;
}

.v-list-item--nav:active {
  background-color: rgba(68, 138, 255, 0.2);
}

a.v-card:active {
  transform: scale(0.97);
}
a.v-card {
  transition: 100ms;
  transform: scale(1);
}

.v-btn--icon:active {
  transition: 100ms;
  transform: scale(0.9);
}

button.v-btn--size-large i {
  padding-top: 3px !important;
}

button.v-btn--size-default i {
  padding-bottom: 2px !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<script>
export default {
  computed: {
    isLogin() {
      return this.$router.currentRoute.value.fullPath.startsWith("/login");
    },
  },
  data() {
    return {
      credentials: null,
      loadingUser: false,
    };
  },
  methods: {
    async updateUser() {
      if (this.loadingUser) {
        return;
      }
      this.loadingUser = true;
      this.context.user = await this.purecore.getUser();
      this.loadingUser = false;
    },
    logout() {
      this.credentials.clear();
      if (this.context.user) delete this.context.user;
      this.$router.push("/login");
    },
  },
  async beforeMount() {
    this.credentials = this.purecore.getCredentials();

    if (!this.credentials.authenticated) {
      this.$router.push("/login");
      return;
    }

    await this.updateUser();

    this.credentials.addEventListener("cleared", () => {
      if (this.context.user) delete this.context.user;
      this.$router.push("/login");
    });
  },
};
</script>
