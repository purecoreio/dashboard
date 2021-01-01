<template>
  <div style="max-width: 400px; margin-left: auto; margin-right: auto">
    <v-snackbar app v-model="snackbar">
      <center>{{ snackbarText }}</center>
    </v-snackbar>
    <v-slide-y-transition>
      <center v-show="w == 1">
        <h2>Let's setup your servers!</h2>
      </center>
    </v-slide-y-transition>
    <v-slide-y-transition>
      <div v-show="(w == 3 || w == 4) && setupType == null">
        <center>
          <h2>Do you use a proxy or have multiple servers?</h2>
        </center>
        <v-expand-transition>
          <div v-show="w == 4">
            <v-divider class="mt-4 mb-4" />
            <v-row>
              <v-col>
                <v-card @click="setupType = 0" outlined class="pt-6 pb-6">
                  <center>
                    <v-icon> blur_on </v-icon>
                    <v-divider class="mt-3 mb-3" />
                    <h4>Yes</h4>
                    <h5>Multiple Server Setup</h5>
                  </center>
                </v-card>
              </v-col>
              <v-col>
                <v-card @click="setupType = 1" outlined class="pt-6 pb-6">
                  <center>
                    <v-icon> filter_center_focus </v-icon>
                    <v-divider class="mt-3 mb-3" />
                    <h4>No</h4>
                    <h5>Single Server Setup</h5>
                  </center>
                </v-card>
              </v-col>
            </v-row>
            <v-alert color="primary" text>
              If you are planning on expanding your network down the line, you
              will be able to add more servers to your network later on. Please,
              choose your current server setup and not your intended future
              server setup.
            </v-alert>
          </div>
        </v-expand-transition>
      </div>
    </v-slide-y-transition>
    <v-fade-transition>
      <div v-show="settingUp">
        <v-stepper
          class="elevation-0 transparent"
          v-if="setupType == 0"
          v-model="m"
        >
          <v-stepper-items>
            <input
              ref="file"
              style="
                position: absolute;
                width: 0px;
                left: 0px;
                visibility: hidden;
              "
              type="file"
              @change="networkStructureChange"
              multiple
            />
            <v-stepper-content step="1">
              <v-btn
                class="mb-3"
                @click="
                  m = 1;
                  serverNames = [];
                  name = null;
                  setupType = null;
                "
                icon
              >
                <v-icon> arrow_back </v-icon>
              </v-btn>
              <v-card @click="selectFile()" outlined class="pt-10 pb-5">
                <center>
                  <v-icon class="mb-3" large> folder </v-icon>
                  <h4>Select your proxy config.yml file</h4>
                  <span class="grey--text">Click To Select</span>
                  <v-divider class="mt-10 mb-5" />
                  <p class="mb-0 grey--text" style="font-size: 12px">
                    Your file won't be uploaded to purecore. It is processed
                    locally
                  </p>
                </center>
              </v-card>
              <v-btn @click="m = 2" large block class="mt-4" depressed>
                Skip <v-icon>skip_next</v-icon>
              </v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-btn
                class="mb-3"
                @click="
                  m = 1;
                  serverNames = [];
                  name = null;
                "
                icon
              >
                <v-icon> arrow_back </v-icon>
              </v-btn>
              <v-list class="mt-0 mb-0 pt-0 pb-0">
                <v-list-item v-if="serverNames.length <= 0">
                  <v-list-item-content>
                    <center>Please, add at least two servers</center>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-for="(name, i) in serverNames" :key="i">
                  <v-list-item-content>
                    {{ name }}
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click="deleteName(i)">
                      <v-icon> delete </v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
              <v-card class="mt-4">
                <v-row align="center" no-gutters>
                  <v-col class="flex-grow-1 flex-shrink-0">
                    <v-text-field
                      @keyup.enter.native="addName()"
                      solo-inverted
                      hide-details
                      placeholder="Server Name"
                      v-model="name"
                    />
                  </v-col>
                  <v-col class="flex-grow-0 flex-shrink-1 pl-2 pr-2">
                    <v-btn @click="addName()" icon>
                      <v-icon> add </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
              <v-btn
                @click="registerNames()"
                :disabled="serverNames.length < 2"
                large
                block
                color="primary"
                class="mt-4"
                depressed
              >
                Register <v-icon>add</v-icon>
              </v-btn>
              <v-alert
                class="mb-0 mt-4"
                text
                color="primary"
                :value="serverNames.length < 2"
                transition="scale-transition"
              >
                Please, define at least two server names
              </v-alert>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
        <v-stepper
          class="elevation-0 transparent"
          v-if="setupType == 1"
          v-model="m"
        >
          <v-stepper-items>
            <v-stepper-content step="1">
              <center>
                <h2>
                  <v-btn
                    class="mr-2"
                    @click="
                      s = 1;
                      serverNames = [];
                      name = null;
                      setupType = null;
                    "
                    icon
                  >
                    <v-icon> arrow_back </v-icon> </v-btn
                  >Please, name your server
                </h2>
              </center>
              <v-text-field
                class="mt-4"
                @keyup.enter.native="register()"
                solo-inverted
                hide-details
                placeholder="Server Name"
                v-model="name"
              />
              <v-btn
                @click="register()"
                :disabled="!nameValid"
                large
                block
                color="primary"
                class="mt-4 mb-4"
                depressed
              >
                Register <v-icon>add</v-icon>
              </v-btn>
              <v-alert
                transition="scale-transition"
                :value="serverCreationError != null"
                text
                color="primary"
              >
                {{ serverCreationError }}
              </v-alert>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </div>
    </v-fade-transition>
    <div style="position: absolute; bottom: 0px; width: 100%; left: 0px">
      <v-slide-y-reverse-transition>
        <v-progress-linear
          :value="
            loading ? 100 : setupType == 0 ? (m / 3) * 100 : (s / 2) * 100
          "
          v-show="settingUp"
        ></v-progress-linear>
      </v-slide-y-reverse-transition>
    </div>
  </div>
</template>
<script>
import YAML from "yamljs";
export default {
  watch: {
    setupType(newv) {
      if (newv == null) {
        this.w = 5;
        setTimeout(() => {
          this.w = 4;
        }, 500);
        this.settingUp = false;
      } else {
        this.w = 5;
        setTimeout(() => {
          this.settingUp = true;
        }, 500);
      }
    },
    name(newv) {
      let re = new RegExp("^[a-zA-Z0-9-_ ]+$");
      if (re.test(newv)) {
        this.nameValid = true;
      } else {
        this.nameValid = false;
      }
    },
  },
  data: () => {
    return {
      w: 0,
      m: 1,
      s: 1,
      loading: false,
      serverCreationError: null,
      newServerName: null,
      creatingServer: false,
      settingUp: false,
      setupType: null,
      configFileName: "config.yml",
      snackbar: false,
      snackbarText: "",
      autoimportPlatform: "mcproxy",
      name: null,
      serverNames: [],
      nameValid: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.startWelcome();
    }, 100);
  },
  methods: {
    register() {
      this.loading = true;
      this.$purecore
        .getContext()
        .getNetwork()
        .createServer(this.name)
        .then((server) => {
          this.serverCreationError = null;
          this.$router.push({
            path: `/network/instance/${server.id}/setup`,
          });
        })
        .catch((err) => {
          this.serverCreationError = err.message;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    registerNames() {
      if (this.serverNames != null && this.serverNames.length > 1) {
        this.registerServerInList(this.serverNames, 0);
      }
    },
    registerServerInList(list, index) {
      this.loading = true;
      this.$purecore
        .getContext()
        .getNetwork()
        .createServer(list[index])
        .catch((err) => {
          this.showError(
            "error while creating server '" + list[index] + "': " + err.message
          );
        })
        .finally(() => {
          if (index < list.length - 1) {
            this.registerServerInList(list, index + 1);
          } else {
            this.loading = false;
            this.$router.push({ path: "/network/servers/list/" });
          }
        });
    },
    addName() {
      let re = new RegExp("^[a-zA-Z0-9-_ ]+$");
      if (re.test(this.name)) {
        if (!this.serverNames.includes(this.name)) {
          this.serverNames.push(this.name);
          this.name = null;
        } else {
          this.showError("this server already exists");
        }
      } else {
        this.showError(
          "the name can only contain spaces, hyphen, underscores and characters from a-z"
        );
      }
    },
    deleteName(i) {
      this.serverNames.splice(i, 1);
    },
    selectFile() {
      let fileInputElement = this.$refs.file;
      fileInputElement.click();
    },
    startWelcome() {
      this.w++;
      let i = setInterval(() => {
        this.w++;
        if (this.w == 4) {
          clearInterval(i);
        }
      }, 1000);
    },
    showError(err) {
      this.snackbar = true;
      this.snackbarText = err;
    },
    networkStructureChange(ev) {
      let file = ev.target.files[0];
      if (file != null) {
        console.log(file.item);
        if (file.name != this.configFileName) {
          this.showError("the file must be named " + this.configFileName);
          this.networkStructureInput = [];
        } else {
          const reader = new FileReader();
          reader.addEventListener("load", (event) => {
            let result = event.target.result;
            if (this.autoimportPlatform == "mcproxy") {
              try {
                result = YAML.parse(result);
                if ("servers" in result) {
                  let serverNames = [];
                  for (const key in result.servers) {
                    let re = new RegExp("^[a-zA-Z0-9-_ ]+$");
                    if (re.test(key)) {
                      if (!serverNames.includes(key)) {
                        serverNames.push(key);
                      }
                    } else {
                      this.showError(
                        "some of your servers had an invalid name"
                      );
                    }
                  }
                  if (serverNames.length > 0) {
                    this.serverNames = serverNames;
                    this.m = 2;
                  } else {
                    this.showError("no servers configured");
                  }
                } else {
                  this.showError("no 'servers' key found");
                }
              } catch (error) {
                this.showError(
                  "unexpected structure: expecting Bungeecord, Waterfall, Travertine or other forks"
                );
              }
            } else {
              this.showError("unknown autoimport platform");
            }
          });
          reader.addEventListener("error", () => {
            this.showError("error while reading the network structure file");
          });
          reader.readAsText(file);
        }
      }
    },
  },
};
</script>