<template>
  <v-container
    style="margin-bottom: 0px !important; padding:0px;"
    fill-height
    fluid
  >
    <v-layout row wrap>
      <v-flex d-flex xs6 v-if="$vuetify.breakpoint.mdAndUp">
        <v-sheet
          elevation="5"
          width="100%"
          :color="$vuetify.theme.dark ? 'grey darken-4' : 'primary'"
          dark
          tile
          flat
        >
          <v-container fill-height fluid>
            <v-row align="center" justify="center">
              <v-col>
                <center>
                  <div style="max-width:400px">
                    <h1>purecore</h1>
                    <v-divider class="mt-4 mb-4" />
                    <v-card
                      hover
                      color="white"
                      class="text-left black--text mb-4"
                    >
                      <v-card-title>
                        Introducing Team Accounts
                      </v-card-title>
                      <v-card-text class="black--text">
                        Empower your staff team with our permission manager. Its
                        the most modular permission manager ever seen on the
                        sector. Limit every call, create permission groups and
                        sync them automatically with software on your server.
                        Now compatible with Luckperms.
                      </v-card-text>
                    </v-card>
                    <v-card hover color="white" class="text-left black--text">
                      <v-card-title>
                        Introducing Premium
                      </v-card-title>
                      <v-card-text class="black--text">
                        Get some extra perks and support purecore's development
                        by subscribing to premium, now with a free 7-day trial
                        for premium+.
                      </v-card-text>
                    </v-card>
                  </div>
                </center>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-flex>

      <v-flex d-flex xs12 md6>
        <v-container fill-height fluid>
          <v-row align="center" justify="center">
            <v-col>
              <center>
                <div style="max-width:400px">
                  <div v-if="!$vuetify.breakpoint.mdAndUp">
                    <h1 class="mb-3">purecore</h1>
                    <v-divider class="mb-6" />
                  </div>
                  <v-card outlined class="mb-4">
                    <div style="filter:blur(4px)">
                      <v-card-text>
                        Login as a staff member
                      </v-card-text>
                      <v-list
                        class="pa-0"
                        :color="!$vuetify.theme.dark ? 'grey lighten-4' : ''"
                      >
                        <v-list-item>
                          <v-list-item-avatar>
                            <v-avatar>
                              <v-img
                                src="https://minotar.net/helm/quiquelhappy"
                              />
                            </v-avatar>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            quiquelhappy
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-icon>
                              lock
                            </v-icon>
                          </v-list-item-action>
                        </v-list-item>
                      </v-list>
                    </div>
                    <div
                      style="position:absolute; left:0px;top:0px;width:100%;height:100%"
                    >
                      <p class="mb-0 mt-7"><b>Team Accounts</b></p>
                      <span>In development</span>
                    </div>
                  </v-card>

                  <v-btn
                    @click="GoogleLoginHandle"
                    v-if="!(session != null && session != undefined)"
                    depressed
                    large
                    block
                    :loading="loginLoading"
                  >
                    LOGIN WITH GOOGLE
                    <v-avatar right size="25px" style="margin-left: 10px">
                      <v-img src="../../assets/glogo.svg" alt="Login" />
                    </v-avatar>
                  </v-btn>
                </div>
              </center>
            </v-col>
          </v-row>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import core from "purecore";

export default {
  mounted() {
    this.$emit("setDrawer", false);
    if (
      localStorage.getItem("session") != null &&
      localStorage.getItem("session") != "null"
    ) {
      this.$router.replace({ path: "/" });
    }
  },
  watch: {
    session: function(val) {
      if (val != null) {
        localStorage.setItem("session", JSON.stringify(val));
        this.$emit("initialCheck");
      }
    },
  },
  data: () => ({
    session: null,
    loginLoading: false,
  }),
  methods: {
    GoogleLoginHandle() {
      this.loginLoading = true;
      var mainObj = this;
      this.$gAuth
        .signIn()
        .then((GoogleUser) => {
          new core()
            .fromToken(GoogleUser.getAuthResponse().id_token)
            .then(function(core) {
              // to-do save core session

              mainObj.loginLoading = false;
              mainObj.session = core.getCoreSession();
            });
        })
        .catch(function() {
          mainObj.loginLoading = false;
        });
    },
  },
};
</script>
