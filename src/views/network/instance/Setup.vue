<template>
  <div>
    <v-card outlined class="pa-2 pr-2 pl-2">
      <v-row align="center">
        <v-col class="flex-shrink-0 flex-grow-1">
          <v-text-field
            :loading="key == null"
            readonly
            v-model="key"
            label="Instance Key"
            type="password"
            outlined
            hide-details=""
          >
          </v-text-field>
        </v-col>
        <v-col class="flex-shrink-1 flex-grow-0">
          <v-btn
            v-clipboard:copy="key"
            :disabled="key == null"
            x-large
            color="primary"
            depressed
          >
            <v-icon>content_copy</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-divider class="mt-2 mb-2" />
    <v-card outlined class="pa-2">
      <v-row class="pl-7" align="center">
        <v-col class="flex-grow-0 flex-shrink-1">
          <status-indicator
            :status="server != null && server.online ? 'active' : ''"
            :pulse="server != null && server.online"
          />
        </v-col>
        <v-col class="flex-grow-0 flex-shrink-1">
          <span v-if="server != null && server.online ? 'active' : ''"
            >Online</span
          >
          <span
            v-if="
              server == null || (server != null && !server.online)
                ? 'active'
                : ''
            "
            >Offline</span
          >
        </v-col>
        <v-col class="flex-grow-1 flex-shrink-0 text-right">
          <v-btn
            @click="reload()"
            :disabled="reloading"
            :loading="reloading"
            text
            color="primary"
          >
            Check Again
          </v-btn>
        </v-col>
      </v-row>
      <v-expand-transition>
        <div v-show="server == null || (server != null && !server.online)">
          <v-divider class="mt-2 mb-2" />
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <v-avatar color="primary"> 1 </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content> Download purecore.jar (contact quiquelhappy on Discord) </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <v-avatar color="primary"> 2 </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                Drop purecore.jar under plugins
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <v-avatar color="primary"> 3 </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content> Restart your server </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <v-avatar color="primary"> 4 </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                Use /purecore key [hash]
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>
<script>
export default {
  props: ["instance"],
  mounted() {
    let main = this;
    main.reloading = true;
    this.$purecore.getInstance(this.instance).then((instance) => {
      main.server = instance;
      main.reloading = false;
      instance.getKeys().then((keys) => {
        main.key = keys[0].hash;
      });
    });
  },
  methods: {
    reload() {
      let main = this;
      main.reloading = true;
      this.$purecore.getInstance(this.instance).then((instance) => {
        main.server = instance;
        main.reloading = false;
      });
    },
  },
  data: () => {
    return {
      server: null,
      key: null,
      reloading: false,
    };
  },
};
</script>