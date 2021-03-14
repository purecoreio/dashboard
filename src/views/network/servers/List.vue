<template>
  <div>
    <v-snackbar app v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>
    <v-dialog v-model="createServerMenu" max-width="600px">
      <v-card style="overflow: hidden">
        <v-card-title> {{ $t("createServer") }} </v-card-title>

        <div class="pl-4 pr-4 pb-4">
          <v-row no-gutters>
            <v-col class="mb-4 pt-0" cols="12">
              <v-alert
                :value="serverCreationError != ''"
                transition="scale-transition"
                color="primary"
                class="mt-0"
                text
              >
                {{ serverCreationError }}
              </v-alert>
              <v-text-field
                @keyup.enter.native="registerServer()"
                v-model="newServerName"
                :label="$t('name')"
                hide-details
                outlined
              />
            </v-col>
            <v-col>
              <v-btn
                text
                @click="
                  createServerMenu = false;
                  serverCreationError = '';
                  newServerName = '';
                "
              >
                {{ $t("cancel") }}
              </v-btn></v-col
            >
            <v-col class="text-right">
              <v-btn
                :loading="creatingServer"
                :disabled="newServerName == null || newServerName.length <= 3"
                color="primary"
                @click="registerServer()"
              >
                {{ $t("register") }}
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="serverDeleteMenu" max-width="600px">
      <v-card style="overflow: hidden">
        <v-card-title v-if="selected.length > 0">
          <span v-if="selected.length == 1"
            >{{ $t("deleting") }} {{ selected[0].name }}</span
          >
          <span v-if="selected.length > 1"
            >{{ $t("deleting") }} {{ selected.length }}
            {{ $t("servers") }}</span
          >
        </v-card-title>
        <v-row align="center" class="pl-4 pr-4">
          <v-col cols="12">
            <v-alert class="mb-0" color="primary" text>
              {{ $t("thisActionCannotBeRolledback") }}
            </v-alert>
          </v-col>
          <v-col>
            <v-checkbox
              class="mb-5"
              hide-details
              v-model="deleteNotice"
              :ripple="false"
              :label="$t('iUnderstand')"
            >
            </v-checkbox>
          </v-col>
          <v-col class="text-right">
            <v-btn
              color="primary"
              text
              @click="deleteServers(selected)"
              :disabled="!deleteNotice"
              :loading="deletingServer"
              >{{ $t("delete") }}</v-btn
            >
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
    <v-dialog v-model="groupDeleteMenu" max-width="600px">
      <v-card style="overflow: hidden">
        <v-card-title v-if="groupToDelete != null">
          {{ $t("deleting") }} {{ groupToDelete.name }}
        </v-card-title>
        <v-row class="pl-4 pr-4">
          <v-col>
            <v-alert color="primary" text>
              {{ $t("serverGroupRemove") }}
            </v-alert>
          </v-col>
          <v-col cols="12" class="text-right">
            <v-btn
              color="primary"
              text
              @click="deleteGroup(groupToDelete)"
              :loading="deletingGroup"
              >{{ $t("delete") }}</v-btn
            >
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
    <v-dialog v-model="createGroupMenu" max-width="600px">
      <v-card style="overflow: hidden">
        <v-card-title> {{ $t("createGroup") }} </v-card-title>
        <v-row class="pl-4 pr-4">
          <v-col cols="12">
            <v-text-field
              outlined
              hide-details
              v-model="newGroupName"
              :label="$t('name')"
              @keyup.enter.native="createGroup()"
            />
          </v-col>
          <v-col cols="12" class="text-right">
            <v-btn
              color="primary"
              text
              @click="createGroup"
              :disabled="newGroupName == null || newGroupName.length <= 3"
              :loading="creatingGroup"
              >{{ $t("create") }}</v-btn
            >
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
    <v-dialog v-model="movingForm" max-width="600px">
      <v-card style="overflow: hidden">
        <v-card-title v-if="selected.length > 0">
          <span v-if="selected.length == 1">Moving {{ selected[0].name }}</span>
          <span v-if="selected.length > 1"
            >Moving {{ selected.length }} servers</span
          >
        </v-card-title>
        <v-row class="pl-4 pr-4">
          <v-col cols="12">
            <v-select
              item-text="name"
              v-model="newGroupSelect"
              item-value="value"
              :items="groups"
              label="Group"
              outlined
              hide-details
            ></v-select>
          </v-col>
          <v-expand-transition>
            <v-col cols="12" v-show="newGroupSelect == 'new'">
              <v-text-field
                outlined
                hide-details
                v-model="newGroupName"
                :label="$t('name')"
              />
            </v-col>
          </v-expand-transition>
          <v-col cols="12" class="text-right">
            <v-btn
              color="primary"
              text
              @click="handleChange"
              :loading="handlingChange"
              >Change</v-btn
            >
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
    <v-fade-transition>
      <div v-show="!loading">
        <div
          v-if="
            !loading &&
            !(
              servers.length > 1 ||
              (servers.length == 1 && servers[0].servers.length > 0)
            )
          "
        >
          <!--<h3>
              <center>
                No servers found! Please, create one in order to start using
                purecore
                <div style="max-width: 350px; margin-top:20px">
                  <v-btn
                    x-large
                    block
                    color="primary"
                    @click="createServerMenu = true"
                    >Create Server <v-icon>add</v-icon></v-btn
                  >
                </div>
                <v-divider style="max-width: 200px" class="mt-4 mb-4" />
                <div class="pa-3" style="max-width: 350px">
                  <v-select
                    v-model="autoimportPlatform"
                    :items="autoimportOptions"
                    label="auto-import using"
                    hide-details
                    outlined
                    class="mb-2"
                  ></v-select>
                  <v-file-input
                    prepend-icon=""
                    :disabled="autoimportPlatform == null"
                    v-model="networkStructureInput"
                    prepend-inner-icon="attach_file"
                    @change="networkStructureChange"
                    hide-details
                    :accept="configFileName"
                    outlined
                    :label="configFileName"
                  />
                </div>
              </center>
            </h3>-->
        </div>
        <div
          v-if="
            servers.length > 1 ||
            (servers.length == 1 && servers[0].servers.length > 0)
          "
        >
          <v-row class="mb-4" no-gutters>
            <v-col>
              <v-menu
                class="pa-0"
                open-on-hover
                transition="scale-transition"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :disabled="selected.length <= 0"
                    color="primary"
                    depressed
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ $t("selected") }}
                    <v-icon>arrow_drop_down</v-icon>
                  </v-btn>
                </template>
                <v-list class="pa-0 ma-0">
                  <v-list-item @click="serverDeleteMenu = true">
                    <v-list-item-icon>
                      <v-icon>delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title style="text-transform: capitalize">{{
                      $t("delete")
                    }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="movingForm = true">
                    <v-list-item-icon>
                      <v-icon>low_priority</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{ $t("move") }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-col v-if="$vuetify.breakpoint.mdAndUp" class="text-right">
              <v-btn
                class="mr-2"
                @click="
                  createServerMenu = true;
                  groupToAdd = null;
                "
                color="primary"
                depressed
              >
                {{ $t("createServer") }}
                <v-icon>add</v-icon>
              </v-btn>
              <v-btn @click="createGroupMenu = true" color="primary" depressed>
                {{ $t("createGroup") }}
                <v-icon>add</v-icon>
              </v-btn>
            </v-col>
            <v-col v-if="!$vuetify.breakpoint.mdAndUp" class="text-right">
              <v-menu
                class="pa-0"
                transition="scale-transition"
                origin="top right"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" depressed v-bind="attrs" v-on="on">
                    <v-icon>add</v-icon>
                  </v-btn>
                </template>
                <v-list class="pa-0 ma-0">
                  <v-list-item @click="createServerMenu = true">
                    <v-list-item-icon>
                      <v-icon>add</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{
                      $t("createServer")
                    }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="createGroupMenu = true">
                    <v-list-item-icon>
                      <v-icon>add</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{
                      $t("createGroup")
                    }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
          <v-card v-if="serverCount > 1" elevation="0" tile>
            <div class="list-group-item">
              <v-card tile elevation="0" class="mb-2">
                <v-list-item link>
                  <v-list-item-action class="pt-1">
                    <status-indicator
                      :status="false ? 'active' : ''"
                      :pulse="false"
                    />
                  </v-list-item-action>
                  <v-list-item-content @click="seeServer(network)">
                    <v-list-item-title>Proxy</v-list-item-title>
                    <v-list-item-subtitle>{{
                      network.id
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </div>
          </v-card>
          <v-list v-for="(serverGroup, i) in servers" :key="i" class="pa-0">
            <v-toolbar
              v-if="
                !(serverGroup.name == null && serverGroup.servers.length <= 0)
              "
              class="mb-1"
              dense
              flat
            >
              <v-toolbar-title v-if="serverGroup.name != null"
                >{{ serverGroup.name }}
              </v-toolbar-title>
              <v-toolbar-title v-if="serverGroup.name == null">{{
                $t("ungrouped")
              }}</v-toolbar-title>
              <v-spacer />

              <v-menu
                v-if="serverGroup.name != null"
                left
                transition="scale-transition"
                origin="right"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                </template>
                <v-list class="pa-0 ma-0">
                  <v-list-item
                    @click="
                      groupToDelete = serverGroup;
                      groupDeleteMenu = true;
                    "
                  >
                    <v-list-item-icon>
                      <v-icon>delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{
                      $t("deleteGroup")
                    }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="
                      groupToAdd = serverGroup;
                      createServerMenu = true;
                    "
                  >
                    <v-list-item-icon>
                      <v-icon>add</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{ $t("addServer") }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-simple-checkbox
                :ripple="false"
                @click="pushAll(serverGroup.servers)"
                :value="
                  serverGroup.servers.filter((server) =>
                    selected.includes(server)
                  ).length >= serverGroup.servers.length &&
                  serverGroup.servers.length > 0
                "
                :indeterminate="
                  serverGroup.servers.filter((server) =>
                    selected.includes(server)
                  ).length > 0 &&
                  serverGroup.servers.filter((server) =>
                    selected.includes(server)
                  ).length < serverGroup.servers.length
                "
              >
              </v-simple-checkbox>
            </v-toolbar>
            <draggable
              @change="handleDrop(event, serverGroup.id)"
              @start="drag = true"
              @end="drag = false"
              :list="dragAndDrop[serverGroup.id]"
              group="servers"
            >
              <div
                class="list-group-item"
                v-for="server in dragAndDrop[serverGroup.id]"
                :key="server.id"
              >
                <v-card elevation="0" class="mb-2">
                  <v-list-item link>
                    <v-list-item-action class="pt-1">
                      <status-indicator
                        :status="server.online ? 'active' : ''"
                        :pulse="server.online"
                      />
                    </v-list-item-action>
                    <v-list-item-content @click="seeServer(server)">
                      <v-list-item-title>{{ server.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        server.id
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-checkbox v-model="selected" :value="server">
                      </v-checkbox>
                    </v-list-item-action>
                  </v-list-item>
                </v-card>
              </div>
            </draggable>
          </v-list>
          <v-fade-transition>
            <v-list v-show="drag" class="pa-0">
              <v-toolbar class="mb-1" dense flat>
                <v-toolbar-title>{{ $t("newGroup") }}</v-toolbar-title>
              </v-toolbar>
              <div style="position: relative; width: 100%; height: 62px">
                <center
                  style="
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 18px;
                  "
                >
                  <h4>Drop here to re-organize</h4>
                </center>
                <draggable
                  @change="handleDrop($event, 'new')"
                  style="position: absolute; width: 100%; height: 100%"
                  :list="dragAndDrop.new"
                  group="servers"
                >
                </draggable>
              </div>
            </v-list>
          </v-fade-transition>
        </div>
      </div>
    </v-fade-transition>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import YAML from "yamljs";

export default {
  components: {
    draggable,
  },
  watch: {
    autoimportPlatform(newv) {
      switch (newv) {
        case "mcproxy":
          this.configFileName = "config.yml";
          break;

        default:
          this.configFileName = "Network Structure";
          break;
      }
    },
    createServerMenu() {
      this.newServerName = "";
      this.serverCreationError = "";
      this.serverSetupStepper = 1;
      this.newServerKey = null;
    },
    serverDeleteMenu() {
      this.deleteNotice = false;
    },
    changeError(newv) {
      this.showError(newv);
    },
    movingForm(newv) {
      if (!newv) {
        this.loadServers();
      }
    },
  },
  data: () => {
    return {
      network: null,
      autoimportPlatform: null,
      autoimportOptions: [
        {
          text: "Bungeecord/Waterfall/Travertine",
          value: "mcproxy",
        },
      ],
      configFileName: "Network Structure",
      loading: false,
      servers: [],
      selected: [],
      drag: false,
      dragAndDrop: {
        new: [],
      },
      serverCount: 0,
      movingForm: false,
      groups: [],
      newGroupSelect: null,
      newGroupName: "",
      handlingChange: false,
      changeError: "",
      createGroupMenu: false,
      creatingNewGroup: false,
      groupToDelete: null,
      groupDeleteMenu: false,
      deletingGroup: false,
      creatingGroup: false,
      serverDeleteMenu: false,
      deletingServer: false,
      deleteNotice: false,
      createServerMenu: false,
      serverSetupStepper: 1,
      serverCreationError: "",
      newServerName: "",
      creatingServer: false,
      newlyCreatedServer: null,
      newServerKey: null,
      groupToAdd: null,
      snackbar: false,
      snackbarText: "",
      networkStructureInput: null,
    };
  },
  mounted() {
    this.network = this.$purecore.getContext().getNetwork();
    if (this.$purecore.getContext().getNetwork() == null) {
      this.$router.push({
        path: "/select/",
      });
    } else {
      this.loadServers();
    }
  },
  methods: {
    getGroup(id) {
      for (let i = 0; i < this.servers.length; i++) {
        if (this.servers[i].getId() == id) {
          return this.servers[i];
        }
      }
      return null;
    },
    seeServer(server) {
      this.$router.push({
        path: "/network/instance/" + server.id + "/setup",
      });
    },
    showError(err) {
      this.snackbar = true;
      this.snackbarText = err;
    },
    registerServers(names) {
      if (names != null && names.length > 0) {
        this.registerServerInList(names, 0);
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
            this.loadServers();
          }
        });
    },
    networkStructureChange(file) {
      if (file != null) {
        if (file.name != this.configFileName) {
          this.showError("the file must be named " + this.configFileName);
          this.networkStructureInput = [];
        } else {
          const reader = new FileReader();
          reader.addEventListener("load", (event) => {
            let result = event.target.result;
            if (this.autoimportPlatform == "mcproxy") {
              result = YAML.parse(result);
              if ("servers" in result) {
                let serverNames = [];
                for (const key in result.servers) {
                  serverNames.push(key);
                }
                this.registerServers(serverNames);
              } else {
                this.showError("no 'servers' key found");
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
    registerServer() {
      this.creatingServer = true;
      this.$purecore
        .getContext()
        .getNetwork()
        .createServer(this.newServerName)
        .then((server) => {
          this.serverCreationError = "";
          this.newlyCreatedServer = server;
          if (this.groupToAdd != null) {
            server
              .setGroup(this.groupToAdd.asServerGroup())
              .catch((err) => {
                this.showError(
                  "error while adding new server to group: " + err.message
                );
              })
              .finally(() => {
                this.loadServers();
                this.creatingServer = false;
                this.createServerMenu = false;
              });
          } else {
            this.creatingServer = false;
            this.createServerMenu = false;
            this.loadServers();
          }
        })
        .catch((err) => {
          this.serverCreationError = err.message;
          this.creatingServer = false;
        });
    },
    deleteServers(servers) {
      let actions = servers.length;
      this.deletingServer = true;
      servers.forEach((server) => {
        server
          .asInstance()
          .delete()
          .finally(() => {
            actions += -1;
            if (actions <= 0) {
              this.deletingServer = false;
              this.serverDeleteMenu = false;
              this.loadServers();
            }
          });
      });
    },
    deleteGroup(group) {
      this.deletingGroup = true;
      group
        .asServerGroup()
        .delete()
        .finally(() => {
          this.deletingGroup = false;
          this.groupDeleteMenu = false;
          this.groupToDelete = null;
          this.loadServers();
        });
    },
    createGroup() {
      this.creatingNewGroup = true;
      this.$purecore
        .getContext()
        .getNetwork()
        .createServerGroup(this.newGroupName)
        .finally(() => {
          this.createGroupMenu = false;
          this.creatingNewGroup = false;
          this.loadServers();
        });
    },
    handleChange() {
      let actions = this.selected.length;
      if (this.newGroupSelect == "new") {
        this.handlingChange = true;
        this.$purecore
          .getContext()
          .getNetwork()
          .createServerGroup(this.newGroupName)
          .then((group) => {
            this.selected.forEach((server) => {
              server
                .setGroup(group)
                .then(() => {
                  this.changeError = "";
                })
                .catch((err) => {
                  this.changeError = err.message;
                })
                .finally(() => {
                  actions += -1;
                  if (actions <= 0) {
                    this.handlingChange = false;
                    this.movingForm = false;
                  }
                });
            });
          })
          .catch((err) => {
            this.changeError = err.message;
            this.handlingChange = false;
            this.movingForm = false;
          });
      } else if (this.newGroupSelect == "ungrouped") {
        this.selected.forEach((server) => {
          server
            .ungroup()
            .then(() => {
              this.changeError = "";
            })
            .catch((err) => {
              this.changeError = err.message;
            })
            .finally(() => {
              actions += -1;
              if (actions <= 0) {
                this.handlingChange = false;
                this.movingForm = false;
              }
            });
        });
      } else {
        this.selected.forEach((server) => {
          server
            .setGroup(this.getGroup(this.newGroupSelect))
            .then(() => {
              this.changeError = "";
            })
            .catch((err) => {
              this.changeError = err.message;
            })
            .finally(() => {
              actions += -1;
              if (actions <= 0) {
                this.handlingChange = false;
                this.movingForm = false;
              }
            });
        });
      }
    },
    handleDrop(evt, id) {
      if ("added" in evt) {
        this.selected = [evt.added.element];
        if (id == "new") {
          this.movingForm = true;
        } else if (id != null) {
          this.selected[0]
            .setGroup(this.getGroup(id))
            .catch((err) => {
              this.changeError = err.message;
            })
            .finally(() => {
              this.loadServers();
            });
        } else {
          this.selected[0]
            .ungroup()
            .catch((err) => {
              this.changeError = err.message;
            })
            .finally(() => {
              this.loadServers();
            });
        }
      }
    },
    pushAll(servers) {
      let count = 0;
      servers.forEach((element) => {
        if (!this.selected.includes(element)) {
          this.selected.push(element);
        } else {
          count++;
        }
      });
      if (count >= servers.length) {
        servers.forEach((element) => {
          if (this.selected.includes(element)) {
            const index = this.selected.indexOf(element);
            if (index > -1) {
              this.selected.splice(index, 1);
            }
          }
        });
      }
    },
    loadServers() {
      this.loading = true;
      this.newGroupSelect = null;
      this.newGroupName = null;
      this.$purecore
        .getContext()
        .getNetwork()
        .getServers()
        .then((groupLists) => {
          if (groupLists.length <= 1) {
            if (groupLists.length > 0) {
              if (groupLists[0].servers.length == 0) {
                this.$router.push({ path: "/network/servers/wizard/" });
              }
            }
          }
          this.serverCount = 0;
          groupLists.forEach((group) => {
            this.serverCount += group.servers.length;
          });
          this.selected = [];
          this.dragAndDrop = {
            new: [],
          };
          this.groups = [
            {
              name: "Ungrouped",
              value: "ungrouped",
            },
            {
              name: "New Group",
              value: "new",
            },
            {
              divider: true,
            },
          ];
          groupLists.forEach((list) => {
            if (list.name != null) {
              this.groups.push({
                name: list.name,
                value: list.id,
              });
            }
            this.dragAndDrop[list.id] = list.servers;
          });
          this.servers = groupLists;
          this.loading = false;
        });
    },
  },
};
</script>
