<template>
  <div>
    <v-snackbar v-model="errorShow">
      {{ errorStr }}
      <v-btn text @click="errorShow = false">Close</v-btn>
    </v-snackbar>
    <v-dialog v-model="setup.active" max-width="600px">
      <v-card class="pa-4">
        <v-alert
          :value="setup.name.includes(' ')"
          transition="scale-transition"
          class="mt-4"
          color="primary"
          text
        >Spaces will be converted to dashes</v-alert>
        <v-alert
          class="mb-0"
          transition="scale-transition"
          :value="setup.error != null"
          text
          color="primary"
        >{{ setup.error }}</v-alert>
        <v-row>
          <v-col class="flex-shrink-0 flex-grow-1">
            <v-text-field
              v-model="setup.name"
              outlined
              label="Instance Name"
              autocomplete="off"
              required
              hide-details
            />
          </v-col>
          <v-col class="flex-shrink-1 flex-grow-0">
            <v-btn
              class="pt-7 pb-7"
              :loading="setup.loading"
              large
              depressed
              color="primary"
              @click="createServer()"
            >Create</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
    <v-fade-transition>
      <div v-show="templatedata!=null">
        <v-row align="stretch">
          <v-col cols="12" md="4" lg="4" xl="3">
            <v-card height="100%">
              <v-list-item>
                <v-list-item-content>
                  <b>Game</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip>
                    <v-avatar class="mr-1" tile>
                      <v-img
                        src="https://lutris.net/media/games/icons/minecraft-launcher_5zwVHLz.png"
                      />
                    </v-avatar>Minecraft Java
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <b>Memory</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip>
                    <v-icon class="mr-1" small>storage</v-icon>
                    {{templatedata.memory/1073741824}}GB
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <b>Size</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip>
                    <v-icon class="mr-1" small>save</v-icon>
                    {{templatedata.size/1073741824}}GB
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <b>Dedicated Cores</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip>
                    <v-icon class="mr-1" small>check_box_outline_blank</v-icon>
                    {{templatedata.cores}}
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" lg="4" xl="3">
            <v-card height="100%">
              <v-list-item>
                <v-list-item-content>
                  <b>Billing Interval</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip>Monthly</v-chip>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <b>To Pay Now</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-skeleton-loader :loading="billingpreview==null" type="chip">
                    <v-chip>{{billingpreview.now}} EUR</v-chip>
                  </v-skeleton-loader>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <b>Monthly Cost</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-skeleton-loader :loading="billingpreview==null" type="chip">
                    <v-chip>{{billingpreview.monthly}} EUR</v-chip>
                  </v-skeleton-loader>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <b>Next Bill In</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-skeleton-loader :loading="billingpreview==null" type="chip">
                    <v-chip>
                      {{billingpreview.days}} day
                      <span v-if="billingpreview.days>1">s</span>
                    </v-chip>
                  </v-skeleton-loader>
                </v-list-item-action>
              </v-list-item>
            </v-card>
          </v-col>
          <v-col v-if="$vuetify.breakpoint.mdAndUp">
            <HostingHeader :showsmalltext="$vuetify.breakpoint.xlOnly" />
          </v-col>
        </v-row>
        <div>
          <v-row align="stretch">
            <v-col cols="12" md="8" lg="8" xl="6">
              <v-card height="100%">
                <v-container fill-height fluid>
                  <v-row align="center" justify="center">
                    <v-col>
                      <v-stepper
                        style="background:transparent;box-shadow:none"
                        v-model="paymentProgress"
                      >
                        <v-stepper-items>
                          <v-stepper-content step="0">
                            <h3>Instance Selection</h3>
                            <v-divider class="mt-2 mb-2" />
                            <div v-if="servers==null">
                              <div class="mt-10 mb-10 pt-10 pb-10">
                                <center>
                                  <v-progress-circular
                                    :size="70"
                                    :width="7"
                                    color="primary"
                                    indeterminate
                                  ></v-progress-circular>
                                </center>
                              </div>
                            </div>
                            <v-list v-if="servers!=null">
                              <v-alert
                                v-for="server in servers"
                                :key="server.uuid"
                                class="pa-0 mb-2"
                                :color="$vuetify.theme.dark ? 'white' : 'primary'"
                                text
                              >
                                <v-list-item @click="paymentProgress=1;selectedServer=server">
                                  <v-list-item-content>{{server.name}}</v-list-item-content>
                                  <v-list-item-action>
                                    <v-icon>arrow_forward</v-icon>
                                  </v-list-item-action>
                                </v-list-item>
                              </v-alert>

                              <v-divider class="mt-2 mb-2" />

                              <v-alert
                                class="pa-0 mb-2"
                                :color="$vuetify.theme.dark ? 'white' : 'primary'"
                                text
                              >
                                <v-list-item @click="createInstance();">
                                  <v-list-item-content>Create New</v-list-item-content>
                                  <v-list-item-action>
                                    <v-icon>add</v-icon>
                                  </v-list-item-action>
                                </v-list-item>
                              </v-alert>
                            </v-list>
                          </v-stepper-content>

                          <v-stepper-content step="1">
                            <h3>Payment Method</h3>
                            <v-divider class="mt-2 mb-2" />
                            <CardList
                              @creditCard="useCreditCard"
                              @noCreditCard="dontUseCreditCard"
                            />
                          </v-stepper-content>

                          <v-stepper-content step="2">
                            <v-alert
                              color="primary"
                              text
                            >Adding a credit card to your purecore account allows you to get your services renewed automatically. We don't store your credit card number. Keep in mind you can also use debit cards. If you use an alternative payment method, you will have to manually renew your services from your panel.</v-alert>

                            <v-btn color="primary" @click="paymentProgress = 3">Continue</v-btn>

                            <v-btn text @click="paymentProgress = 1">Cancel</v-btn>
                          </v-stepper-content>

                          <v-stepper-content step="3">
                            <v-alert
                              color="primary"
                              text
                            >PayPal payments will be integrated soon, as of right now, you can only use a credit card.</v-alert>
                            <v-btn text @click="paymentProgress=1">Cancel</v-btn>
                          </v-stepper-content>

                          <v-stepper-content step="4">
                            <h3>Billing Address</h3>
                            <v-divider class="mt-2 mb-2" />
                            <BillingAddress btn="pay" @savedBilling="savedBillingAddress" />
                          </v-stepper-content>

                          <v-stepper-content step="5">
                            <div class="mt-10 mb-10 pt-10 pb-10">
                              <center>
                                <v-progress-circular
                                  :size="70"
                                  :width="7"
                                  color="primary"
                                  indeterminate
                                ></v-progress-circular>
                              </center>
                            </div>
                          </v-stepper-content>
                        </v-stepper-items>
                      </v-stepper>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
            <v-col v-if="$vuetify.breakpoint.mdAndUp">
              <v-card height="100%">
                <v-container fill-height fluid>
                  <v-row align="center" justify="center">
                    <v-col>
                      <center>
                        <v-img max-width="200px" contain src="@/assets/bongo.png" />
                        <v-divider class="mt-4 mb-4" style="max-width: 100px" />
                        <i style="opacity:0.5">
                          <b>Thanks! You are making purecore better!</b>
                        </i>
                      </center>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-fade-transition>
  </div>
</template>

<script>
import core from "purecore";
import HostingHeader from "@/components/Hosting/HostingHeader";
import CardList from "@/components/Billing/CardList";
import BillingAddress from "@/components/Billing/BillingAddress";
export default {
  props: ["machine", "template"],
  components: {
    HostingHeader,
    CardList,
    BillingAddress,
  },
  mounted() {
    this.core = new core(JSON.parse(localStorage.getItem("session")));
    let main = this;
    main.getServers();
    this.core
      .getHostingManager()
      .getTemplate(this.template)
      .then((template) => {
        main.templatedata = template;
        main.core
          .getHostingManager()
          .preview(template)
          .then((preview) => {
            main.billingpreview = preview;
          });
      });
  },
  methods: {
    createInstance() {
      this.setup.active = true;
    },
    savedBillingAddress() {
      this.paymentProgress = 5;
      let main = this;
      let machine = this.session.core
        .getHostingManager()
        .getMachineFromId(this.machine);
      this.templatedata
        .use(this.selectedServer, "itzg/minecraft-server", machine)
        .then(() => {
          main.$router.push({ path: "/instance/" + main.selectedServer.uuid });
        })
        .catch((err) => {
          main.paymentProgress = 4;
          main.showError(err.message);
        });
    },
    useCreditCard(pm) {
      console.log(pm);
      this.paymentProgress = 4;
    },
    dontUseCreditCard() {
      console.log("dont");
      this.paymentProgress = 2;
    },
    getServers() {
      this.servers = [];
      if (localStorage.session && localStorage.network) {
        network = localStorage.network;
        var coreInstance = new core(JSON.parse(localStorage.session));
        this.session = coreInstance.getCoreSession();
        var network = coreInstance
          .getInstance(localStorage.network)
          .asNetwork();
        var mainObj = this;
        this.network = network;
        network.getServers().then(function (servers) {
          mainObj.servers = servers;
        });
      }
    },
    showError(err) {
      this.errorShow = true;
      this.errorStr = err;
      setTimeout(() => {
        this.errorShow = false;
      }, 5000);
    },
    createServer() {
      this.setup.created = false;
      var mainObj = this;
      mainObj.setup.loading = true;
      mainObj.setup.key.loading = true;
      mainObj.setup.error = null;
      mainObj.network
        .createServer(mainObj.setup.name)
        .then(function (instance) {
          mainObj.setup.loading = false;
          mainObj.e1 = 2;
          mainObj.setup.created = true;
          mainObj.setup.error = null;
          instance.getKeys().then(function (keys) {
            mainObj.setup.key.value = keys[0].hash;
            mainObj.setup.key.loading = false;
          });
          mainObj.selectedServer = instance;
          mainObj.paymentProgress = 1;
          mainObj.setup.active = false;
          mainObj.getServers();
        })
        .catch(function (error) {
          mainObj.setup.loading = false;
          mainObj.setup.created = false;
          mainObj.setup.error = error;
        });
    },
  },
  data: () => {
    return {
      errorShow: false,
      errorStr: "",
      setup: {
        loading: false,
        mode: null,
        created: false,
        proxyAsked: false,
        active: false,
        proxyAsking: false,
        error: null,
        name: "",
        key: {
          value: "",
          loading: true,
        },
      },
      selectedServer: null,
      core: null,
      templatedata: null,
      billingpreview: null,
      paymentProgress: 0,
      servers: null,
    };
  },
};
</script>