<template>
  <div>
    <v-stepper
      class="elevation-0"
      style="background-color: transparent"
      v-model="e1"
    >
      <v-stepper-items>
        <v-stepper-content class="pa-0" step="1">
          <h1>{{ $t("selectGame") }}</h1>
          <v-item-group mandatory v-model="game">
            <v-row>
              <v-col v-for="game in games" :key="game.name" cols="12" md="4">
                <v-item v-slot:default="{ active, toggle }">
                  <v-card
                    :data-active="active ? 'yes' : 'no'"
                    class="d-flex align-center gamecard"
                    style="position: relative; overflow: hidden"
                    dark
                    height="200"
                    @click="toggle"
                  >
                    <div
                      class="gamecardBackground"
                      :data-active="active ? 'yes' : 'no'"
                      style="
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        top: 0px;
                        left: 0px;
                      "
                    >
                      <v-img
                        width="100%"
                        height="100%"
                        :src="
                          require(`@/assets/game/${game.folder}/${game.bg}`)
                        "
                      />
                    </div>
                    <div
                      style="
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        top: 0px;
                        left: 0px;
                      "
                    >
                      <v-img
                        width="80%"
                        style="margin-left: 10%; margin-top: 50px"
                        height="100px"
                        contain
                        :src="
                          require(`@/assets/game/${game.folder}/${game.logo}`)
                        "
                      />
                    </div>
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </v-item-group>
          <v-row>
            <v-col>
              <v-btn to="/select/" text>{{ $t("cancel") }}</v-btn>
            </v-col>
            <v-col class="text-right">
              <v-btn
                depressed
                :disabled="game == null || game != 0"
                color="primary"
                @click="e1 = 2"
              >
                {{ $t("continue")
                }}<span v-if="game != null">: {{ games[game].name }} </span>
              </v-btn>
            </v-col>
          </v-row>
          <v-alert
            v-if="game != null"
            text
            color="primary"
            transition="fade-transition"
            :value="game != null && game != 0"
          >
            {{ $t("weAreStillWorkingOn") }} {{ games[game].name }},
            {{ $t("weRecommendJoiningOur") }}
            <a href="https://purecore.io/community/" target="_blank">
              {{ $t("discordServer") }}</a
            >
            {{ $t("forUpdates") }}
          </v-alert>
        </v-stepper-content>

        <v-stepper-content class="pa-0" step="2">
          <h1>{{ $t("nameYourCommunity") }}</h1>
          <v-row>
            <v-col cols="12" lg="6">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    @keyup.enter.native="register()"
                    hide-details
                    v-model="name"
                    outlined
                    :label="$t(`name`)"
                    autocomplete="off"
                    :placeholder="$t(`nameExample`)"
                  ></v-text-field>
                </v-col>
                <v-col class="flex-grow-1 flex-shrink-0">
                  <v-text-field
                    @keyup.enter.native="register()"
                    hide-details
                    outlined
                    v-model="subdomain"
                    autocomplete="off"
                    :label="$t(`subdomain`)"
                    @change="subdomainEdit"
                    :placeholder="$t(`subdomainPlaceholder`)"
                  ></v-text-field>
                </v-col>
                <v-col class="flex-grow-0 flex-shrink-1">
                  <div
                    style="
                      border-radius: 4px;
                      border-color: gray;
                      border-width: 1px;
                      border-style: solid;
                      padding-top: 14.5px;
                      padding-left: 10px;
                      padding-right: 10px;
                      padding-bottom: 14.5px;
                    "
                  >
                    .purecore.io
                  </div>
                </v-col>
                <v-col cols="12">
                  <v-alert
                    :value="error == null"
                    class="mt-1"
                    text
                    color="primary"
                  >
                    {{ $t("customDomainLater") }}
                  </v-alert>
                  <v-alert
                    transition="scale-transition"
                    class="mt-1"
                    text
                    :value="error != null && !loading"
                    color="primary"
                  >
                    {{ error }}
                  </v-alert>
                </v-col>
                <v-col cols="12">
                  <v-row>
                    <v-col>
                      <v-btn @click="e1 = 1" icon
                        ><v-icon>keyboard_backspace</v-icon></v-btn
                      >
                    </v-col>
                    <v-col class="text-right">
                      <v-btn
                        @click="register()"
                        depressed
                        :loading="loading"
                        :disabled="
                          !(
                            name != null &&
                            name != '' &&
                            subdomain != '' &&
                            subdomain != null
                          )
                        "
                        color="primary"
                      >
                        {{ $t("register")
                        }}<span class="ml-1" v-if="name != null">
                          {{ name }}</span
                        >
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" lg="6">
              <v-row>
                <v-col>
                  <div
                    :style="
                      'border-radius:5px;border-style:solid;border-width:2px;' +
                      ($vuetify.theme.dark
                        ? 'border-color:gray;'
                        : 'border-color:black;')
                    "
                  >
                    <div
                      :style="
                        'border-bottom-style:solid;border-bottom-width:2px;' +
                        ($vuetify.theme.dark
                          ? 'border-bottom-color:gray;'
                          : 'border-bottom-color:black;')
                      "
                    >
                      <v-row no-gutters align="center">
                        <v-col
                          style="min-width: 66px"
                          class="pl-1 flex-grow-0 flex-shrink-1"
                        >
                          <div
                            v-for="i in 3"
                            :key="i"
                            :style="
                              'margin-top:5px;display:inline-block;margin-bottom:0px;border-style:solid;border-width:2px;border-radius:100px;padding:5px;margin:2px;' +
                              ($vuetify.theme.dark
                                ? 'border-color:gray;'
                                : 'border-color:black;')
                            "
                          />
                        </v-col>
                        <v-col
                          style="padding-right: 66px"
                          class="flex-grow-1 flex-shrink-0 text-center"
                        >
                          <span style="color: green">https://</span
                          >{{
                            subdomain != null && subdomain != ""
                              ? subdomain
                              : $t("unknown")
                          }}.purecore.io
                        </v-col>
                      </v-row>
                    </div>
                    <div style="margin-top: 100px; margin-bottom: 110px">
                      <center>
                        <span style="font-size: 30px">{{
                          name != null && name != "" ? name : $t("unknown")
                        }}</span
                        ><br />
                        <span> {{ $t("yourCoolWebsite") }}</span>
                      </center>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <v-progress-linear
      style="position: absolute; bottom: 0px; width: 100%; left: 0px"
      :value="this.loading ? 100 : (this.e1 / 3) * 100"
    ></v-progress-linear>
  </div>
</template>

<style lang="css" scoped>
.gamecard {
  filter: grayscale(1);
  transition: 200ms;
}
.gamecard[data-active="yes"] {
  filter: grayscale(0);
}
.gamecardBackground {
  transform: scale(1);
  filter: grayscale(0) blur(0px);
  transition: 200ms;
}
.gamecardBackground[data-active="yes"] {
  transform: scale(1.1);
  filter: grayscale(0) blur(2px);
}
</style>

<script>
export default {
  watch: {
    game(/*newv*/) {
      // to compute
    },
    name(value) {
      if (!this.subdomainEdited) {
        this.subdomain = value.replace(/[^a-zA-Z]/g, "");
      }
    },
    e1() {
      this.error = null;
    },
  },
  methods: {
    subdomainEdit() {
      this.subdomainEdited = true;
    },
    register() {
      let main = this;
      main.loading = true;
      this.$purecore
        .getPlayer()
        .asOwner()
        .createNetwork(
          this.name,
          this.subdomain,
          this.games[this.game].folder,
          -1
        ) // TODO: Implement platform selection
        .then((network) => {
          main.loading = false;
          localStorage.setItem(btoa("purecore-n"), network.id);
          this.$purecore.getContext().setNetwork(network);
          main.$router.push({ path: "/network/servers/wizard/" });
        })
        .catch((err) => {
          main.loading = false;
          main.error = err;
        });
    },
  },
  data: () => {
    return {
      e1: 1,
      game: null,
      subdomainEdited: false,
      name: null,
      subdomain: null,
      error: null,
      loading: false,
      games: [
        {
          name: "Minecraft",
          folder: "minecraft",
          bg: "background.jpg",
          logo: "logo.png",
        },
        {
          name: "Minecraft Bedrock",
          folder: "minecraft_bedrock",
          bg: "background.jpg",
          logo: "logo.webp",
        },
        {
          name: "CS:GO",
          folder: "csgo",
          bg: "background.jpg",
          logo: "logo.png",
        },
        {
          name: "FiveM",
          folder: "gta",
          bg: "background.jpg",
          logo: "logo.png",
        },
        {
          name: "garry's mod",
          folder: "garrysmod",
          bg: "background.jpg",
          logo: "logo.png",
        },
        {
          name: "unturned",
          folder: "unturned",
          bg: "background.jpg",
          logo: "logo.png",
        },
        {
          name: "Team Fortress 2",
          folder: "teamfortress2",
          bg: "background.jpg",
          logo: "logo.png",
        },
        {
          name: "ARK",
          folder: "ark",
          bg: "background.jpg",
          logo: "logo.png",
        },
        {
          name: "Space Engineers",
          folder: "spaceengineers",
          bg: "background.jpg",
          logo: "logo.png",
        },
      ],
    };
  },
};
</script>
