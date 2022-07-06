<template>
  <v-defaults-provider :defaults="defaults">
    <v-app>

      <!-- top bar-->

      <v-app-bar v-if="!isLogin" :class="$vuetify.display.mobile ? null : 'pl-0'" app border="b" flat>
        <v-btn v-if="$vuetify.display.mobile && hasDrawer" :color="null" icon @click.stop="drawer = !drawer">
          <v-icon icon="mdi-menu" />
        </v-btn>
        <v-btn class="ml-2" v-if="$vuetify.display.mobile && showBack" :color="null" icon @click="this.$router.back()">
          <v-icon icon="mdi-keyboard-backspace" />
        </v-btn>
        <div v-if="!$vuetify.display.mobile" style="width: 256px">
          <v-row align="center" no-gutters>
            <v-spacer />
            <v-col class="pr-3" cols="auto">
              <v-img width="32px" src="@/assets/isotype.png" />
            </v-col>
            <v-col cols="auto">
              <h2 style="font-weight: 500">
                purecore
                <v-chip color="primary" small class="betaChip"> BETA </v-chip>
              </h2>
            </v-col>
            <v-spacer />
          </v-row>
        </div>
        <v-spacer />
        <v-chip class="mr-2"> Standard Plan </v-chip>

        <v-btn icon>
          <v-icon icon="mdi-account-circle" />
          <v-menu open-on-hover location="start" activator="parent">
            <v-list>
              <v-list-item to="/me/machines">
                <v-list-item-avatar>
                  <v-icon icon="mdi-credit-card-outline" />
                </v-list-item-avatar>
                <v-list-item-title>Billing</v-list-item-title>
              </v-list-item>
              <v-list-item to="/me/machines">
                <v-list-item-avatar>
                  <v-icon icon="mdi-account-box-multiple-outline" />
                </v-list-item-avatar>
                <v-list-item-title>Profiles</v-list-item-title>
              </v-list-item>
              <v-list-item to="/me/machines">
                <v-list-item-avatar>
                  <v-icon icon="mdi-server-network" />
                </v-list-item-avatar>
                <v-list-item-title>Machines</v-list-item-title>
              </v-list-item>
              <v-list-item @click="this.logout()">
                <v-list-item-avatar>
                  <v-icon icon="mdi-logout-variant" />
                </v-list-item-avatar>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </v-app-bar>

      <!-- drawer -->
      <v-navigation-drawer :expand-on-hover="true"
        :rail="!this.$vuetify.display.mobile && this.$vuetify.display.lgAndDown" class="py-2 px-2" v-model="showDrawer"
        :temporary="this.$vuetify.display.mobile" :permanent="!this.$vuetify.display.mobile" app>
        <v-list style="overflow:hidden" v-if="identity" class="px-0 pt-0" mandatory nav dense>
          <v-list-item class="my-2" :to="identity.action" active-color="primary">
            <v-list-item-avatar color="primary">
              {{ identity.name.substring(0, 1) }}
            </v-list-item-avatar>
            <div class="pl-2">
              <v-list-item-title> {{ identity.name }} </v-list-item-title>
              <v-list-item-subtitle> #{{ identity.id }} </v-list-item-subtitle>
            </div>
          </v-list-item>
          <v-list-item class="my-2" :to="`${basePath}/${link.path}`" v-for="link in identity.links" :key="link.path"
            active-color="primary">
            <v-list-item-avatar>
              <v-icon :icon="`mdi-${link.icon}`"></v-icon>
            </v-list-item-avatar>
            <div class="pl-2">
              <v-list-item-title>{{ link.name }}</v-list-item-title>
            </div>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- view -->

      <v-main>
        <router-view @identity="handleIdentity"
          v-if="isLogin || (this.credentials.authenticated && this.context.user)" />
      </v-main>

    </v-app>
  </v-defaults-provider>
</template>

<script>
export default {
  computed: {
    defaults() {
      const common = {
        VBtn: {
          flat: true,
          color: 'primary'
        },
        VAlert: {
          color: "primary",
          variant: "tonal"
        },
        VSwitch: {
          color: "primary",
        },
        VToolbar: {
          rounded: true,
        },
        VCard: {
          rounded: 0,
        }
      }
      if (this.$vuetify.theme.current.dark) {
        common.VCard = {
          elevation: 0,
          variant: "tonal",
          rounded: 0
        }
      } else {
        common.VCard = {
          elevation: 0,
          border: "a",
          rounded: 0
        }
        common.VToolbar.color = "grey-lighten-4"
      }
      return common
    },
    isLogin() {
      return this.$router.currentRoute.value.fullPath.startsWith("/login");
    },
    showBack() {
      return false
    },
    hasDrawer() {
      return this.$router.currentRoute.value.href && (this.$router.currentRoute.value.href.split("/").length > 3 || this.$router.currentRoute.value.href.split("/")[1] == "me")
    },
    showDrawer() {
      return this.hasDrawer && (!this.$vuetify.display.mobile | this.drawer)
    },
    basePath() {
      return this.$router.currentRoute.value.href.split("/").slice(0, 3).join("/")
    },
  },
  data() {
    return {
      credentials: null,
      loadingUser: false,
      drawer: false,
      identity: null,
    };
  },
  methods: {
    handleIdentity(identity) {
      this.identity = identity
    },
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


<style>
.v-list {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

* {
  font-family: 'Rubik', sans-serif;
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

.v-btn {
  text-transform: none !important;
}

.v-btn:active {
  transition: 200ms;
  box-shadow: 0 0 0 0.2rem rgba(68, 138, 255, 0.5) !important;
}

.v-btn.text-red:active {
  transition: 200ms;
  box-shadow: 0 0 0 0.2rem rgba(255, 68, 68, 0.5) !important;
}

.v-list-item--nav:active {
  background-color: rgba(68, 138, 255, 0.2);
}

a.v-card:active {
  box-shadow: 0 0 0 0.2rem rgba(68, 138, 255, 0.5) !important;
  opacity: 0.75;
}

a.v-card {
  transition: 200ms;
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

a.v-list-item--active i {
  color: #82b1ff;
}
</style>
