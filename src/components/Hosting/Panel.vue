<template>
  <div>
    <v-row align="stretch">
      <v-col cols="12" md="4" lg="4" xl="3">
        <v-card style="height:100%" outlined>
          <v-navigation-drawer width="100%" permanent>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">
                  {{host.instance.name}}
                  <v-fade-transition>
                    <span style="font-size:14px" v-show="showStatus">{{connectionStatus}}</span>
                  </v-fade-transition>
                </v-list-item-title>
                <v-list-item-subtitle>{{host.instance.uuid}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense nav>
              <v-list-group
                v-for="item in items"
                :key="item.title"
                :prepend-icon="item.icon"
                no-action
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                  </v-list-item-content>
                </template>

                <v-list-item v-for="subItem in item.items" :key="subItem.title">
                  <v-list-item-content>
                    <v-list-item-title v-text="subItem.title"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-list>
          </v-navigation-drawer>
        </v-card>
      </v-col>
      <v-col style="height:100%">
        <v-card style="overflow:hidden;position:relative" outlined class="mb-2">
          <v-fade-transition>
            <v-progress-linear
              v-show="connectionStatus!='authenticated'"
              class="ma-0"
              style="width:100%;top:0px;left:0px"
              :value="connectionProgress"
              :indeterminate="connectionStatus!='connected'&&connectionStatus!='authenticated'&&showStatus"
            />
          </v-fade-transition>
          <v-row no-gutters align="stretch">
            <v-col class="pa-5">
              <span>{{host.machine.ipv4}}:{{host.port}}</span>
            </v-col>
            <v-col class="text-right">
              <v-btn
                icon
                style="border-top-left-radius:4px;border-bottom-left-radius:4px;height:100%; width:60px"
                tile
                depressed
                color="primary"
              >
                <v-icon>stop</v-icon>
              </v-btn>
              <v-btn icon style="height:100%; width:60px" tile depressed color="primary">
                <v-icon>pause</v-icon>
              </v-btn>
              <v-btn icon style="height:100%; width:60px" tile depressed color="primary">
                <v-icon>replay</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
        <v-card outlined class="pa-2">
          <!--
          <div style="padding-top:180px;padding-bottom:180px">
            <center>
              <h2 class="mb-4">This feature is being worked on</h2>
              <link
                href="https://fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext"
                rel="stylesheet"
              />
              <a class="bmc-button" target="_blank" href="https://www.buymeacoffee.com/happy">
                <img
                  src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
                  alt="Buy me a coffee"
                />
                <span style="margin-left:15px;font-size:19px !important;">Buy me a coffee</span>
              </a>
            </center>
          </div>
          -->
          <v-list v-chat-scroll style="max-height:600px;overflow:auto">
            <p ref="console" class="ma-0" v-for="(line,i) in consoleLines" :key="i">{{line}}</p>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style>
.bmc-button img {
  height: 34px !important;
  width: 35px !important;
  margin-bottom: 1px !important;
  box-shadow: none !important;
  border: none !important;
  vertical-align: middle !important;
}
.bmc-button {
  padding: 7px 10px 7px 10px !important;
  line-height: 35px !important;
  height: 51px !important;
  min-width: 217px !important;
  text-decoration: none !important;
  display: inline-flex !important;
  color: #ffffff !important;
  background-color: #000000 !important;
  border-radius: 5px !important;
  border: 1px solid transparent !important;
  padding: 7px 10px 7px 10px !important;
  font-size: 20px !important;
  letter-spacing: -0.08px !important;
  margin: 0 auto !important;
  font-family: "Lato", sans-serif !important;
  -webkit-box-sizing: border-box !important;
  box-sizing: border-box !important;
  -o-transition: 0.3s all linear !important;
  -webkit-transition: 0.3s all linear !important;
  -moz-transition: 0.3s all linear !important;
  -ms-transition: 0.3s all linear !important;
  transition: 0.3s all linear !important;
}
.bmc-button:hover,
.bmc-button:active,
.bmc-button:focus {
  -webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;
  text-decoration: none !important;
  box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;
  opacity: 0.85 !important;
  color: #ffffff !important;
}
</style>
<script>
import io from "socket.io-client";
export default {
  props: ["host"],
  methods: {
    setupSocket() {
      this.socket = io("http://" + this.host.machine.ipv4 + ":31518");
      this.socket
        .on("connect", () => {
          this.socket.emit("authenticate", this.host);
          this.connectionStatus = "connected";
          this.connectionProgress = 50;
        })
        .on("authenticated", () => {
          this.connectionStatus = "authenticated";
          this.connectionProgress = 100;
          this.socket.emit("console");
        })
        .on("console", (line) => {
          this.consoleLines.push(line);
        })
        .on("connect_error", () => {
          this.connectionStatus = "connect_error";
          this.connectionProgress = 0;
        })
        .on("connect_timeout", () => {
          this.connectionStatus = "connect_timeout";
          this.connectionProgress = 0;
        })
        .on("reconnecting", () => {
          this.connectionStatus = "reconnecting";
          this.connectionProgress = 0;
        })
        .on("reconnect", () => {
          this.connectionStatus = "reconnect";
          this.connectionProgress = 0;
        })
        .on("reconnect_error", () => {
          this.connectionStatus = "reconnect_error";
          this.connectionProgress = 0;
        })
        .on("reconnect_failed", () => {
          this.connectionStatus = "reconnect_failed";
          this.connectionProgress = 0;
        })
        .on("disconnect", () => {
          this.connectionStatus = "disconnect";
          this.connectionProgress = 0;
        });
    },
  },
  watch: {
    connectionStatus() {
      this.lastStatusUpdate = new Date();
      this.showStatus = true;
      setTimeout(() => {
        if (this.lastStatusUpdate.getTime() <= new Date().getTime() - 1000) {
          this.showStatus = false;
        }
      }, 1001);
    },
  },
  mounted() {
    this.setupSocket();
  },
  beforeDestroy() {
    this.socket.disconnect();
  },
  data: () => {
    return {
      consoleLines: [],
      connectionProgress: 0,
      connectionStatus: "disconnected",
      lastStatusUpdate: null,
      showStatus: false,
      socket: null,
      items: [
        {
          icon: "keyboard_return",
          title: "Executions",
          items: [
            {
              title: "Console",
            },
            {
              title: "Scheduled",
            },
          ],
        },
        {
          icon: "settings",
          title: "Settings",
          items: [
            {
              title: "Image Properties",
            },
          ],
        },
        {
          icon: "public",
          title: "Networking",
          items: [
            {
              title: "Domain",
            },
            {
              title: "Additional Ports",
            },
            {
              title: "Firewall",
            },
          ],
        },
        {
          icon: "folder",
          title: "File System",
          items: [
            {
              title: "Credentials",
            },
            {
              title: "Explorer",
            },
            {
              title: "Import Data",
            },
            {
              title: "Optimize Storage",
            },
          ],
        },
        {
          icon: "analytics",
          title: "Monitoring",
          items: [
            {
              title: "Resources",
            },
            {
              title: "Timeline",
            },
          ],
        },
      ],
    };
  },
};
</script>