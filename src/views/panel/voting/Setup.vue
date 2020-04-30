<template>
  <div>
    <v-snackbar v-model="snackbar">
      {{ snakbacktext }}
      <v-btn color="primary" text @click="snackbar = false">K</v-btn>
    </v-snackbar>
    <v-card class="pa-4" outlined>
      <v-row>
        <v-col class="d-flex" cols="12">
          <v-select
            hide-details
            :disabled="items.length<=0 || saving"
            :loading="items.length<=0 ||saving"
            :items="items"
            v-model="votingSite"
            label="Voting site to setup"
            outlined
          ></v-select>
        </v-col>
        <v-col class="d-flex" cols="12">
          <v-text-field
            :loading="votingSiteURLLoading || saving"
            :disabled="votingSiteURLLoading || saving"
            v-model="votingSiteURL"
            hide-details
            label="Your voting url"
            placeholder="Leave empty for deletion"
            clearable
            type="text"
            outlined
          ></v-text-field>
        </v-col>
        <v-col class="text-right" cols="12">
          <v-btn
            v-if="$vuetify.breakpoint.smAndUp"
            :to="{path:'/account/votingsites'}"
            class="mt-1"
            small
            style="float:left"
            text
          >I can't see my desired voting site</v-btn>
          <v-btn @click="save()" :loading="saving" depressed color="primary">save changes</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import core from "purecore";
export default {
  props: ["siteid"],
  data: () => ({
    lookingFor: "none",
    network: null,
    items: [],
    sites: [],
    setupVotingSites: [],
    saving: false,
    votingSite: null,
    votingSiteURL: null,
    snackbar: false,
    snakbacktext: "wtf?",
    votingSiteURLLoading: false
  }),
  watch: {
    sites(sites) {
      this.items = [];
      sites.forEach(site => {
        this.items.push({
          text: site.name + " (" + site.url + ")",
          value: site.uuid
        });
      });
    },
    votingSite(uuid) {
      this.votingSiteURLLoading = true;
      var lookedUp = 0;
      var doneLookingUp = false;
      this.setupVotingSites.forEach(setup => {
        lookedUp++;
        if (setup.votingSite.uuid == uuid) {
          this.votingSiteURL = setup.url;
          doneLookingUp = true;
        }
      });
      if (lookedUp >= this.setupVotingSites.length && !doneLookingUp) {
        this.votingSiteURL = "";
        doneLookingUp = true;
      }
      if (doneLookingUp) {
        this.votingSiteURLLoading = false;
      }
    }
  },
  methods: {
    loadSites() {
      let main = this;
      main.network.getVotingSites().then(function(sites) {
        main.sites = sites;
      });

      /* load setup sites */
      main.network.getSetupVotingSites().then(function(sites) {
        main.setupVotingSites = sites;
        sites.forEach(site => {
          if (site.votingSite.uuid == main.lookingFor) {
            main.votingSite = main.lookingFor;
          }
        });
      });
    },
    save() {
      this.saving = true;
      let main = this;
      var site = null;

      this.sites.forEach(tempSite => {
        if (tempSite.uuid == this.votingSite) {
          site = tempSite;
        }
      });

      if (site != null) {
        site.getConfig(this.network).then(function(config) {
          config
            .setURL(main.votingSiteURL)
            .then(function() {
              main.saving = false;
              main.showSaveNotice();
              main.loadSites();
            })
            .catch(function() {
              main.saving = false;
              main.showSaveNotice(true);
            });
        });
      } else {
        this.saving = false;
        main.showSaveNotice(true);
      }
    },
    showSaveNotice(error = false) {
      this.snackbar = true;

      var name = "unknown";
      this.sites.forEach(tempSite => {
        if (tempSite.uuid == this.votingSite) {
          name = tempSite.name;
        }
      });

      if (!error) {
        this.snakbacktext = "updated the setup for '" + name + "' successfully";
      } else {
        this.snakbacktext =
          "error while updating the setup for '" + name + "'!";
      }

      setTimeout(() => {
        this.snackbar = false;
      }, 3000);
    }
  },
  mounted() {
    if (this.siteid != null) {
      this.lookingFor = this.siteid;
    }
    /* load available sites */
    var purecore = new core(JSON.parse(localStorage.getItem("session")));
    var network = purecore
      .getInstance(localStorage.getItem("network"))
      .asNetwork();

    this.network = network;
    this.loadSites();
  }
};
</script>