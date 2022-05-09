<template>
  <v-alert class="mb-2" v-if="error">
    {{ error }}
  </v-alert>
  <v-card :disabled="loading" class="pa-5">
    <div v-if="!type">
      <h3 class="wizardTitle">Does your network use one (or multiple) proxies?</h3>
      <p>
        Proxies usually allow for multi-instance networks. You may know some proxy
        softwares such as
        <a target="_blank" href="https://www.spigotmc.org/wiki/bungeecord/">Bungeecord</a>
        or <a target="_blank" href="https://docs.papermc.io/waterfall">Waterfall</a>.
        Multiple proxies can sometimes be interconnected (usually by using
        <a target="_blank" href="https://redis.io/">Redis</a>) to provide load balancing.
        If you don't know what this is, just click on "No".
      </p>
      <div class="mt-3">
        <v-btn class="mr-2" @click="type = 'default'">No</v-btn>
        <v-btn variant="text" @click="type = 'one'">Yes</v-btn>
        <v-btn variant="text" @click="type = 'proxies'">I use multiple proxies</v-btn>
      </div>
    </div>
    <div v-if="type == 'default'">
      <v-row no-gutters>
        <v-col cols="auto">
          <back-arrow @clicked="revert" />
        </v-col>
        <v-col class="pl-2">
          <h3 class="wizardTitle">A default instance has been created!</h3>
        </v-col>
      </v-row>
    </div>
    <div v-if="type == 'one' || type == 'proxies'">
      <v-row no-gutters>
        <v-col cols="auto">
          <back-arrow @clicked="revert" />
        </v-col>
        <v-col class="pl-2">
          <h3 class="wizardTitle">A default proxy instance has been created!</h3>
        </v-col>
      </v-row>
    </div>
    <div v-if="type == 'proxies'">
      <v-row no-gutters>
        <v-col cols="auto">
          <back-arrow @clicked="revert" />
        </v-col>
        <v-col class="pl-2">
          <h3 class="wizardTitle">Your proxy instances have been created!</h3>
        </v-col>
      </v-row>
    </div>
    <v-list v-if="steps.length > 0" class="mt-3">
      <v-list-item v-for="(step, i) in steps" :key="i" class="my-2">
        <v-row no-gutters>
          <v-col cols="auto">
            <v-avatar color="primary"> {{ i + 1 }} </v-avatar>
          </v-col>
          <v-col class="pl-4">
            {{ step.text ?? step }}
            <div class="mt-2" v-if="i == 0">
              <download />
            </div>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script>
import BackArrow from "@/components/buttons/BackArrow.vue";
import Download from "@/components/buttons/Download.vue";
export default {
  props: ["network"],
  data() {
    return {
      type: null,
      loading: false,
      created: [],
      error: null,
      steps: [],
    };
  },
  components: {
    Download,
    BackArrow,
  },
  methods: {
    revert() {
      this.type = null;
    },
  },
  watch: {
    async type(type) {
      this.loading = true;
      try {
        switch (type) {
          case "default":
            this.created.push(await this.network.createInstance("default"));
            this.steps = [
              "Download the plugin and install it on your server. Make sure to restart the server!",
              "Open the plugin settings and paste the key from the created instance",
              "Restart the server. You are all set!",
            ];
            break;
          case "one":
            this.created.push(await this.network.createInstance("proxy"));
            this.steps = [
              "Download the plugin and install it on all your regular servers. There is no need to change any plugin settings!",
              "Install the very same file on your proxy instance, restart your proxy and paste the key on the plugin settings (you only need to do this on the proxy)",
              "Restart all your servers. The proxy will automatically register your regular servers and sync the data",
            ];
            break;
          case "proxies":
            this.created.push(await this.network.createInstance("proxy"));
            this.steps = [
              "Download the plugin and install it on all your regular servers. There is no need to change any plugin settings!",
              "Install the very same file on all your proxy instances, restart your proxy and paste the key on the plugin settings of every proxy",
              "Restart all your servers. The proxies will automatically register your regular servers and sync the data",
            ];
            break;
          case null:
            const deletePromises = [];
            this.proxies = [];
            this.proxyCount = 0;
            for (const instance of this.created) {
              deletePromises.push(instance.delete());
            }
            await Promise.all(deletePromises);
            break;

          default:
          // ignore
        }
        if (type) {
          this.$emit("created", this.created);
        } else {
          this.$emit("deleted", this.created);
          this.steps = [];
          this.created = [];
        }
      } catch (error) {
        this.error = error.message;
        this.type = null;
        setTimeout(() => {
          this.error = null;
        }, 1000 * 10);
      }
      this.loading = false;
    },
  },
};
</script>
